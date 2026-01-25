class GoogleSheetsConnector {
  constructor() {
    this.storage = new SheetStorage();
  }

  async init() {
    await this.storage.init();
  }

  extractSheetId(url) {
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    const patterns = [
      /\/d\/([a-zA-Z0-9-_]+)/,
      /spreadsheet\/d\/([a-zA-Z0-9-_]+)/,
      /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  }

  async listSheets(sheetId) {
    if (!sheetId) {
      throw new Error('Invalid Sheet ID');
    }
    
    try {
      const response = await fetch(`https://opensheet.elk.sh/${sheetId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sheet list: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return Array.isArray(data) ? Object.keys(data) : [];
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Network error: unable to fetch sheet list');
      }
      throw error;
    }
  }

  async fetchSheetData(sheetId, sheetName = 'Sheet1') {
    if (!sheetId) {
      throw new Error('Invalid Sheet ID');
    }
    
    try {
      const response = await fetch(`https://opensheet.elk.sh/${sheetId}/${encodeURIComponent(sheetName)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to fetch sheet data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format: expected array');
      }
      
      return data;
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Network error: unable to fetch sheet data');
      }
      throw error;
    }
  }

  async readSheet(sheetId, sheetName = 'Sheet1') {
    return await this.fetchSheetData(sheetId, sheetName);
  }

  normalizeFields(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    return data.map(row => {
      const normalizedRow = {};
      
      for (const [key, value] of Object.entries(row)) {
        let normalizedKey = key
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '')
          .replace(/^_+|_+$/g, '');
        
        normalizedKey = normalizedKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        
        if (!normalizedKey) {
          normalizedKey = `field_${Math.random().toString(36).substr(2, 9)}`;
        }
        
        normalizedRow[normalizedKey] = value;
      }
      
      return normalizedRow;
    });
  }

  validateFields(data, schema) {
    const errors = [];
    const warnings = [];
    
    if (!data || !Array.isArray(data)) {
      errors.push('Invalid data: expected array');
      return { errors, warnings };
    }
    
    data.forEach((row, index) => {
      if (!schema || typeof schema !== 'object') {
        return;
      }
      
      for (const [field, rules] of Object.entries(schema)) {
        const value = row[field];
        
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`Row ${index + 1}: Missing required field '${field}'`);
        }
        
        if (value !== undefined && value !== null && value !== '' && rules.type) {
          const expectedType = rules.type;
          const actualType = typeof value;
          
          if (expectedType === 'number' && isNaN(Number(value))) {
            errors.push(`Row ${index + 1}: Field '${field}' should be a number`);
          }
          
          if (expectedType === 'boolean' && typeof value !== 'boolean' && 
              value !== 'true' && value !== 'false') {
            errors.push(`Row ${index + 1}: Field '${field}' should be a boolean`);
          }
        }
        
        if (value !== undefined && value !== null && rules.maxLength && 
            String(value).length > rules.maxLength) {
          errors.push(`Row ${index + 1}: Field '${field}' exceeds max length of ${rules.maxLength}`);
        }
        
        if (value !== undefined && value !== null && rules.minLength && 
            String(value).length < rules.minLength) {
          warnings.push(`Row ${index + 1}: Field '${field}' is shorter than min length of ${rules.minLength}`);
        }
        
        if (rules.pattern && value) {
          const regex = new RegExp(rules.pattern);
          if (!regex.test(String(value))) {
            errors.push(`Row ${index + 1}: Field '${field}' does not match required pattern`);
          }
        }
      }
    });
    
    return { errors, warnings };
  }

  async loadSheetData(url, sheetName = 'Sheet1', options = {}) {
    const { useCache = true, cacheTimeout = 5 * 60 * 1000 } = options;
    
    const sheetId = this.extractSheetId(url);
    if (!sheetId) {
      throw new Error('Invalid Google Sheets URL');
    }
    
    if (useCache) {
      const cached = await this.storage.load(sheetId);
      if (cached && cached.timestamp) {
        const age = Date.now() - cached.timestamp;
        if (age < cacheTimeout) {
          return cached;
        }
      }
    }
    
    const raw = await this.fetchSheetData(sheetId, sheetName);
    const normalized = this.normalizeFields(raw);
    
    if (options.schema) {
      const { errors, warnings } = this.validateFields(normalized, options.schema);
      if (errors.length > 0) {
        throw new Error(`Validation failed:\n${errors.join('\n')}`);
      }
      if (warnings.length > 0 && options.showWarnings !== false) {
        console.warn('Validation warnings:', warnings);
      }
    }
    
    const result = {
      sheetId,
      sheetName,
      data: normalized,
      timestamp: Date.now()
    };
    
    if (useCache) {
      await this.storage.save(sheetId, result);
    }
    
    return result;
  }

  async clearCache(sheetId = null) {
    if (sheetId) {
      await this.storage.save(sheetId, null);
    } else {
      await this.storage.clear();
    }
  }
}

class SheetStorage {
  constructor() {
    this.dbName = 'AuraCanvasDB';
    this.storeName = 'sheets';
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async save(id, data) {
    if (!this.db) {
      await this.init();
    }
    
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise((resolve, reject) => {
      if (data === null) {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } else {
        const request = store.put({ id, data, timestamp: Date.now() });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }
    });
  }

  async load(id) {
    if (!this.db) {
      await this.init();
    }
    
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => reject(request.error);
    });
  }

  async clear() {
    if (!this.db) {
      await this.init();
    }
    
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async list() {
    if (!this.db) {
      await this.init();
    }
    
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const items = request.result.map(item => ({
          id: item.id,
          timestamp: item.timestamp,
          dataCount: item.data?.data?.length || 0
        }));
        resolve(items);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GoogleSheetsConnector, SheetStorage };
}
