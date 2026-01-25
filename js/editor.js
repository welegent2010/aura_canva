class AuraCanvasEditor {
  constructor() {
    this.connector = new GoogleSheetsConnector();
    this.gridGenerator = new GridGenerator();
    this.sections = [];
    this.sheetData = [];
    this.selectedSection = null;
    this.styleSets = [];
    this.currentStyle = null;
    this.gridConfig = {
      columns: 3,
      gap: 24,
      minWidth: 300,
      maxWidth: 1200,
      cardLimit: 0
    };
    this.previewWidth = 'desktop';
    this.originalHead = '';
    this.originalHtmlClass = '';

    this.init();
  }

  async init() {
    try {
      await this.connector.init();
      this.bindEvents();
      this.initSidebarResizer();
      this.loadSavedData();
      await this.loadLocalStyles();
      this.renderStyleSelect();
      this.showToast('Welcome to Aura Canvas Editor', 'success');
    } catch (error) {
      console.error('Failed to initialize editor:', error);
      this.showToast('Initialization failed: ' + error.message, 'error');
    }
  }

  initSidebarResizer() {
    const resizer = document.getElementById('sidebarResizer');
    const sidebar = document.getElementById('sidebar');
    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      resizer.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= 280 && newWidth <= 600) {
        sidebar.style.width = newWidth + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
      resizer.classList.remove('resizing');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    });
  }

  bindEvents() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    document.getElementById('newProjectBtn').addEventListener('click', () => this.newProject());
    document.getElementById('importHtmlBtn').addEventListener('click', () => this.importHtml());
    document.getElementById('exportBtn').addEventListener('click', () => this.exportHtml());
    document.getElementById('exportProjectBtn').addEventListener('click', () => this.exportProject());
    document.getElementById('addSectionBtn').addEventListener('click', () => this.addSection());
    document.getElementById('loadDataBtn').addEventListener('click', () => this.loadSheetData());
    document.getElementById('clearCacheBtn').addEventListener('click', () => this.clearCache());
    document.getElementById('loadStyleBtn').addEventListener('click', () => this.loadLocalStyle());
    document.getElementById('addTallyBtn').addEventListener('click', () => this.addTallySection());
    document.getElementById('refreshPreviewBtn').addEventListener('click', () => this.refreshPreview());
    document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));

    document.getElementById('previewDesktopBtn').addEventListener('click', () => this.setPreviewWidth('desktop'));
    document.getElementById('previewTabletBtn').addEventListener('click', () => this.setPreviewWidth('tablet'));
    document.getElementById('previewMobileBtn').addEventListener('click', () => this.setPreviewWidth('mobile'));

    this.bindGridControls();
  }

  bindGridControls() {
    const controls = ['gridColumnsNum', 'gridGapNum', 'gridMinWidthNum', 'gridMaxWidthNum', 'gridCardLimitNum'];
    controls.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          this.updateGridConfigFromControls();
        });
      }
    });

    const applyGridBtn = document.getElementById('applyGridBtn');
    if (applyGridBtn) {
      applyGridBtn.addEventListener('click', () => this.applyGridConfig());
    }
  }

  applyGridConfig() {
    this.updateGridConfigFromControls();

    console.log('=== Applying Grid Config ===');
    console.log('Grid config:', this.gridConfig);

    const existingGridSection = this.sections.find(s => s.gridEnabled);
    console.log('Existing grid section:', existingGridSection ? 'Yes' : 'No');

    if (!existingGridSection) {
      const gridSection = {
        id: Date.now(),
        name: 'Grid Section',
        content: '',
        className: 'grid-section',
        visible: true,
        gridEnabled: true,
        gridColumns: this.gridConfig.columns,
        gridGap: this.gridConfig.gap,
        gridMinWidth: this.gridConfig.minWidth,
        gridMaxWidth: this.gridConfig.maxWidth,
        gridCardLimit: this.gridConfig.cardLimit,
        styleApplied: false,
        styleSetId: null
      };
      console.log('Creating new grid section, ID:', gridSection.id);
      this.sections.push(gridSection);
    } else {
      console.log('Updating existing grid section, ID:', existingGridSection.id);
      existingGridSection.gridColumns = this.gridConfig.columns;
      existingGridSection.gridGap = this.gridConfig.gap;
      existingGridSection.gridMinWidth = this.gridConfig.minWidth;
      existingGridSection.gridMaxWidth = this.gridConfig.maxWidth;
      existingGridSection.gridCardLimit = this.gridConfig.cardLimit;
      console.log('Updated grid section:', existingGridSection);
    }

    this.selectedSection = this.sections.find(s => s.gridEnabled);
    console.log('Selected section:', this.selectedSection?.name, 'ID:', this.selectedSection?.id);
    console.log('Sections count:', this.sections.length);

    this.renderSections();
    this.renderPreview();
    this.showToast('Grid configuration applied', 'success');
  }

  bindStyleControls() {
    document.getElementById('cardRadius').addEventListener('input', (e) => {
      document.getElementById('cardRadiusValue').textContent = e.target.value;
      this.updatePreviewFromControls();
    });
    document.getElementById('cardPadding').addEventListener('input', (e) => {
      document.getElementById('cardPaddingValue').textContent = e.target.value;
      this.updatePreviewFromControls();
    });
    
    ['cardBg', 'cardText', 'cardBorder', 'cardAccent', 'cardShadow'].forEach(id => {
      document.getElementById(id).addEventListener('change', () => {
        this.updatePreviewFromControls();
      });
    });
  }

  updateGridConfigFromControls() {
    this.gridConfig.columns = parseInt(document.getElementById('gridColumnsNum').value);
    this.gridConfig.gap = parseInt(document.getElementById('gridGapNum').value);
    this.gridConfig.minWidth = parseInt(document.getElementById('gridMinWidthNum').value);
    this.gridConfig.maxWidth = parseInt(document.getElementById('gridMaxWidthNum').value);
    this.gridConfig.cardLimit = parseInt(document.getElementById('gridCardLimitNum').value) || 0;

    const gridSection = this.sections.find(s => s.gridEnabled);
    if (gridSection) {
      gridSection.gridColumns = this.gridConfig.columns;
      gridSection.gridGap = this.gridConfig.gap;
      gridSection.gridMinWidth = this.gridConfig.minWidth;
      gridSection.gridMaxWidth = this.gridConfig.maxWidth;
      gridSection.gridCardLimit = this.gridConfig.cardLimit;
      console.log('Updated grid section config:', gridSection);
    }
  }

  syncGridControls(section) {
    if (!section || !section.gridEnabled) return;

    console.log('Syncing grid controls with section:', section.id);

    if (document.getElementById('gridColumnsNum')) {
      document.getElementById('gridColumnsNum').value = section.gridColumns || 4;
    }
    if (document.getElementById('gridGapNum')) {
      document.getElementById('gridGapNum').value = section.gridGap || 24;
    }
    if (document.getElementById('gridMinWidthNum')) {
      document.getElementById('gridMinWidthNum').value = section.gridMinWidth || 280;
    }
    if (document.getElementById('gridMaxWidthNum')) {
      document.getElementById('gridMaxWidthNum').value = section.gridMaxWidth || 1200;
    }
    if (document.getElementById('gridCardLimitNum')) {
      document.getElementById('gridCardLimitNum').value = section.gridCardLimit ?? 0;
    }
  }

  updatePreviewFromControls() {
    if (!this.currentStyle) {
      this.currentStyle = {
        id: Date.now(),
        name: 'Custom Style',
        cardBg: document.getElementById('cardBg').value,
        cardText: document.getElementById('cardText').value,
        cardBorder: document.getElementById('cardBorder').value,
        cardAccent: document.getElementById('cardAccent').value,
        cardRadius: parseInt(document.getElementById('cardRadius').value),
        cardPadding: parseInt(document.getElementById('cardPadding').value),
        cardShadow: document.getElementById('cardShadow').value
      };
    } else {
      this.currentStyle.cardBg = document.getElementById('cardBg').value;
      this.currentStyle.cardText = document.getElementById('cardText').value;
      this.currentStyle.cardBorder = document.getElementById('cardBorder').value;
      this.currentStyle.cardAccent = document.getElementById('cardAccent').value;
      this.currentStyle.cardRadius = parseInt(document.getElementById('cardRadius').value);
      this.currentStyle.cardPadding = parseInt(document.getElementById('cardPadding').value);
      this.currentStyle.cardShadow = document.getElementById('cardShadow').value;
    }
    this.renderPreview();
  }

  switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    document.querySelectorAll('.panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === tabName + '-panel');
    });
  }

  newProject() {
    if (confirm('Are you sure you want to create a new project? All unsaved changes will be lost.')) {
      this.sections = [];
      this.sheetData = [];
      this.selectedSection = null;
      this.currentStyle = null;
      this.renderSections();
      this.renderPreview();
      this.showToast('New project created', 'success');
    }
  }

  importHtml() {
    document.getElementById('fileInput').click();
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const html = e.target.result;
      this.parseHtml(html);
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  parseHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    this.originalHead = doc.head.innerHTML;
    this.originalHtmlClass = doc.documentElement.className;

    const bodyChildren = Array.from(doc.body.children);

    if (bodyChildren.length === 0) {
      this.addSection('Full Page', html);
      this.renderSections();
      this.renderPreview();
      this.showToast(`Successfully imported ${this.sections.length} sections`, 'success');
      return;
    }

    this.detectContainerWidth(doc);

    let sections = [];
    let currentSection = null;

    bodyChildren.forEach((child) => {
      const tagName = child.tagName.toLowerCase();
      const nodeType = child.nodeType;

      if (nodeType === 8) {
        const commentText = child.textContent.trim();
        const sectionMatch = commentText.match(/(?:Section|区域|模块|Block)\s*[:：]\s*(.+)/i);
        
        if (sectionMatch) {
          currentSection = {
            name: sectionMatch[1].trim(),
            content: '',
            className: ''
          };
        }
      } else if (nodeType === 1) {
        let sectionName = '';
        let content = child.outerHTML;
        let className = child.className || '';

        if (tagName === 'header') {
          sectionName = 'Header / Navigation';
        } else if (tagName === 'main') {
          sectionName = 'Main Content';
        } else if (tagName === 'footer') {
          sectionName = 'Footer';
        } else if (tagName === 'section') {
          sectionName = 'Section';
        } else if (tagName === 'div' && child.classList.contains('container')) {
          sectionName = 'Container';
        } else {
          sectionName = 'Block';
        }

        if (currentSection) {
          sectionName = currentSection.name;
          className = currentSection.className;
          currentSection = null;
        }

        this.addSection(sectionName, content, className);
      }
    });

    this.renderSections();
    this.renderPreview();
    this.showToast(`成功导入 ${this.sections.length} 个区块`, 'success');
  }

  detectContainerWidth(doc) {
    const commonContainers = doc.querySelectorAll('.container, .wrapper, .content, main, section, [class*="container"], [class*="wrapper"], [class*="content"]');
    
    let detectedWidth = null;
    const computedWidths = [];
    
    commonContainers.forEach(el => {
      const style = el.style;
      const classList = el.classList;
      
      if (style.maxWidth) {
        const widthMatch = style.maxWidth.match(/(\d+)/);
        if (widthMatch) {
          computedWidths.push(parseInt(widthMatch[1]));
        }
      }
      
      if (style.width) {
        const widthMatch = style.width.match(/(\d+)/);
        if (widthMatch) {
          computedWidths.push(parseInt(widthMatch[1]));
        }
      }
      
      classList.forEach(cls => {
        const widthMatch = cls.match(/container-(\d+)/);
        if (widthMatch) {
          computedWidths.push(parseInt(widthMatch[1]));
        }
      });
    });
    
    const styleSheets = doc.querySelectorAll('style');
    styleSheets.forEach(sheet => {
      const cssText = sheet.textContent;
      const containerMatches = cssText.match(/\.container[^{]*{[^}]*max-width:\s*(\d+)/g);
      if (containerMatches) {
        containerMatches.forEach(match => {
          const widthMatch = match.match(/max-width:\s*(\d+)/);
          if (widthMatch) {
            computedWidths.push(parseInt(widthMatch[1]));
          }
        });
      }
    });
    
    if (computedWidths.length > 0) {
      const widths = computedWidths.filter(w => w > 300 && w < 2000);
      if (widths.length > 0) {
        this.detectedContainerWidth = Math.max(...widths);
      }
    }
    
    if (!this.detectedContainerWidth) {
      this.detectedContainerWidth = 1200;
    }
    
    this.gridConfig.maxWidth = this.detectedContainerWidth;
    
    const maxWidthInput = document.getElementById('gridMaxWidth');
    const maxWidthNumInput = document.getElementById('gridMaxWidthNum');
    if (maxWidthInput) maxWidthInput.value = this.detectedContainerWidth;
    if (maxWidthNumInput) maxWidthNumInput.value = this.detectedContainerWidth;
  }

  addSection(name = 'New Section', content = '', className = '') {
    const section = {
      id: Date.now(),
      name,
      content,
      className,
      visible: true,
      gridEnabled: false,
      gridColumns: 3,
      styleApplied: false,
      styleSetId: null
    };
    this.sections.push(section);
    this.selectedSection = section;
    this.renderSections();
    this.renderPreview();
    this.saveData();
    this.showToast('Section added: ' + name, 'success');
    return section;
  }

  deleteSection(id) {
    if (confirm('Are you sure you want to delete this section?')) {
      this.sections = this.sections.filter(s => s.id !== id);
      if (this.selectedSection && this.selectedSection.id === id) {
        this.selectedSection = null;
      }
      this.renderSections();
      this.renderPreview();
      this.saveData();
      this.showToast('Section deleted', 'success');
    }
  }

  selectSection(id) {
    this.selectedSection = this.sections.find(s => s.id === id);
    if (this.selectedSection && this.selectedSection.gridEnabled) {
      document.getElementById('gridColumns').value = this.selectedSection.gridColumns;
      document.getElementById('gridColumnsNum').value = this.selectedSection.gridColumns;
      document.getElementById('gridGap').value = this.selectedSection.gridGap;
      document.getElementById('gridGapNum').value = this.selectedSection.gridGap;
      document.getElementById('gridMinWidth').value = this.selectedSection.gridMinWidth;
      document.getElementById('gridMinWidthNum').value = this.selectedSection.gridMinWidth;
      document.getElementById('gridMaxWidth').value = this.selectedSection.gridMaxWidth;
      document.getElementById('gridMaxWidthNum').value = this.selectedSection.gridMaxWidth;
      document.getElementById('gridCardLimitNum').value = this.selectedSection.gridCardLimit ?? 0;
      this.updateGridConfigFromControls();
    }
    this.renderSections();
    this.showToast('Section selected: ' + this.selectedSection.name, 'success');
  }

  editSection(id) {
    const section = this.sections.find(s => s.id === id);
    if (!section) return;

    const newName = prompt('Section Name:', section.name);
    if (newName !== null) {
      section.name = newName;
      this.renderSections();
      this.saveData();
    }
  }

  toggleSectionVisibility(id) {
    const section = this.sections.find(s => s.id === id);
    if (section) {
      section.visible = !section.visible;
      this.renderSections();
      this.renderPreview();
      this.saveData();
    }
  }

  renderSections() {
    const container = document.getElementById('sectionList');
    
    if (this.sections.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <h3>No Sections</h3>
          <p>Import HTML or add new sections</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.sections.map(section => {
      const styleSet = section.styleSetId ? this.styleSets.find(s => s.id === section.styleSetId) : null;
      
      let typeBadge = '';
      if (section.type === 'tally') {
        typeBadge = `<span class="type-badge" style="background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">Tally Form</span>`;
      }
      
      let imagePreview = '';
      if (section.gridEnabled && this.sheetData.length > 0) {
        console.log('=== Rendering Image Preview ===');
        console.log('Sheet data count:', this.sheetData.length);
        console.log('First item:', this.sheetData[0]);
        
        const firstItem = this.sheetData[0];
        const imageUrl = this.findImageUrl(firstItem);
        console.log('Image URL found:', imageUrl);
        
        if (imageUrl) {
          const previewImages = this.sheetData.slice(0, 3).map((item, idx) => {
            const url = this.findImageUrl(item);
            console.log(`Preview image ${idx}:`, url);
            if (!url) return '';
            return `<img src="${url}" style="
              width: 40px;
              height: 40px;
              border-radius: 4px;
              object-fit: cover;
              flex-shrink: 0;
              border: 1px solid #e5e7eb;
            " onerror="console.error('Failed to load image:', this.src); this.outerHTML='<div style=\'width:40px;height:40px;border-radius:4px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:10px;color:#9ca3af\'>?</div>'">`;
          }).join('');
          
          imagePreview = `
            <div class="section-image-preview" style="
              margin-top: 8px;
              display: flex;
              gap: 8px;
              overflow-x: auto;
              padding-bottom: 4px;
            ">
              ${previewImages}
            </div>
          `;
          console.log('Image preview HTML length:', imagePreview.length);
        } else {
          console.log('No image URL found, skipping preview');
        }
      }
      
      return `
      <div class="section-item ${this.selectedSection && this.selectedSection.id === section.id ? 'selected' : ''} ${!section.visible ? 'opacity-50' : ''}"
           data-id="${section.id}">
        <div class="section-item-header">
          <span class="section-item-title">${section.name}</span>
          <div class="section-item-actions">
            <button class="btn btn-secondary" onclick="editor.toggleSectionVisibility(${section.id})">
              ${section.visible ? 'Hide' : 'Show'}
            </button>
            <button class="btn btn-secondary" onclick="editor.editSection(${section.id})">Edit</button>
            <button class="btn btn-secondary" onclick="editor.deleteSection(${section.id})">Delete</button>
          </div>
        </div>
        <div class="section-item-preview">
          ${section.className || 'No Class'}
          ${typeBadge}
          ${section.gridEnabled ? `
            <span class="grid-badge" style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">
              Grid: ${section.gridColumns || 3} cols
            </span>
          ` : ''}
          ${section.styleApplied ? `<span class="style-badge" style="background: #7c2bee; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">${styleSet ? styleSet.name : 'Style Applied'}</span>` : ''}
        </div>
        ${imagePreview}
      </div>
    `;
    }).join('');

    container.querySelectorAll('.section-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          this.selectSection(parseInt(item.dataset.id));
        }
      });
    });

    this.makeSectionsSortable();
  }

  makeSectionsSortable() {
    const container = document.getElementById('sectionList');
    new Sortable(container, {
      animation: 150,
      handle: '.section-item',
      onEnd: (evt) => {
        const item = this.sections.splice(evt.oldIndex, 1)[0];
        this.sections.splice(evt.newIndex, 0, item);
        this.saveData();
        this.renderPreview();
      }
    });
  }

  async loadSheetData() {
    const url = document.getElementById('sheetUrl').value.trim();
    const sheetName = document.getElementById('sheetName').value.trim() || 'Sheet1';

    if (!url) {
      this.showToast('Please enter Google Sheets URL', 'error');
      return;
    }

    try {
      const btn = document.getElementById('loadDataBtn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="loading">Loading...</span>';
      btn.disabled = true;

      const result = await this.connector.loadSheetData(url, sheetName, {
        useCache: true,
        cacheTimeout: 5 * 60 * 1000,
        showWarnings: true
      });

      console.log('=== Load Sheet Data Result ===');
      console.log('Result:', result);
      console.log('Result.data:', result?.data);
      console.log('Result type:', typeof result);
      console.log('Result.data type:', typeof result?.data);

      if (!result) {
        throw new Error('No data returned from connector');
      }

      if (!result.data) {
        throw new Error('Invalid data format returned - result.data is missing');
      }

      this.sheetData = Array.isArray(result.data) ? result.data : [];
      
      if (this.sheetData.length === 0) {
        this.showToast('No data found. Please check Google Sheets URL and sheet name', 'warning');
      } else {
        this.showToast(`Successfully loaded ${this.sheetData.length} records`, 'success');
        
        console.log('=== Sheet Data Loaded ===');
        console.log('Total rows:', this.sheetData.length);
        console.log('Sections count before update:', this.sections.length);
        console.log('Has grid section before:', this.sections.some(s => s.gridEnabled));

        if (this.sheetData.length > 0) {
          console.log('First row:', this.sheetData[0]);
          const imageKey = Object.keys(this.sheetData[0]).find(k => k.toLowerCase().includes('image') || k.toLowerCase().includes('url'));
          if (imageKey) {
            console.log('Image key:', imageKey);
            console.log('Original image URL:', this.sheetData[0][imageKey]);
            const convertedUrl = this.convertGoogleDriveUrl(this.sheetData[0][imageKey]);
            console.log('Converted image URL:', convertedUrl);
          }
        }

        const hasGridSection = this.sections.some(s => s.gridEnabled);
        console.log('Has grid section after check:', hasGridSection);

        if (!hasGridSection) {
          console.log('Creating new grid section...');
          const gridSection = {
            id: Date.now(),
            name: 'Data Grid Section',
            content: '',
            className: 'grid-section',
            visible: true,
            gridEnabled: true,
            gridColumns: this.gridConfig.columns,
            gridGap: this.gridConfig.gap,
            gridMinWidth: this.gridConfig.minWidth,
            gridMaxWidth: this.gridConfig.maxWidth,
            styleApplied: false,
            styleSetId: null
          };
          this.sections.push(gridSection);
          this.selectedSection = gridSection;
          console.log('Grid section created, ID:', gridSection.id);
        } else {
          console.log('Using existing grid section');
        }

        console.log('Sections count after update:', this.sections.length);
        console.log('Calling renderPreview...');
      }

      this.renderDataPreview();
      this.renderPreview();
      this.renderStyleSets();

    } catch (error) {
      this.showToast('Failed to load data: ' + error.message, 'error');
    } finally {
      const btn = document.getElementById('loadDataBtn');
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2L3 7h2v7h6V7h2L8 2z"/></svg>Load Data';
      btn.disabled = false;
    }
  }

  async clearCache() {
    try {
      await this.connector.clearCache();
      this.showToast('Cache cleared successfully', 'success');
      console.log('Cache cleared');
    } catch (error) {
      this.showToast('Failed to clear cache: ' + error.message, 'error');
      console.error('Failed to clear cache:', error);
    }
  }

  renderDataPreview() {
    const container = document.getElementById('dataPreview');
    
    if (!this.sheetData || this.sheetData.length === 0) {
      container.innerHTML = '<p style="color: #6b7280; font-size: 14px;">No data</p>';
      return;
    }

    const headers = Object.keys(this.sheetData[0]);
    const rows = this.sheetData.slice(0, 10);

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              ${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${this.sheetData.length > 10 ? `<p style="margin-top: 12px; color: #6b7280; font-size: 12px;">Showing first 10 of ${this.sheetData.length} records</p>` : ''}
    `;
  }

  saveStyleSet() {
    const name = document.getElementById('styleSetName').value.trim();
    if (!name) {
      this.showToast('Please enter style set name', 'error');
      return;
    }

    const styleSet = {
      id: Date.now(),
      name,
      cardBg: document.getElementById('cardBg').value,
      cardText: document.getElementById('cardText').value,
      cardBorder: document.getElementById('cardBorder').value,
      cardAccent: document.getElementById('cardAccent').value,
      cardRadius: parseInt(document.getElementById('cardRadius').value),
      cardPadding: parseInt(document.getElementById('cardPadding').value),
      cardShadow: document.getElementById('cardShadow').value
    };

    this.styleSets.push(styleSet);
    this.currentStyle = styleSet;
    this.renderStyleSets();
    this.renderPreview();
    this.saveData();
    this.showToast('Style set saved', 'success');
  }

  importStyleSet() {
    document.getElementById('styleFileInput').click();
  }

  handleStyleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const styleData = JSON.parse(e.target.result);

        const styleSet = {
          id: styleData.id || Date.now() + Math.random(),
          name: styleData.name || file.name.replace('.json', ''),
          description: styleData.description || '',
          cardBg: styleData.cardBg || styleData.cardStyle?.bg || '#ffffff',
          cardText: styleData.cardText || styleData.cardStyle?.text || '#1f2937',
          cardBorder: styleData.cardBorder || styleData.cardStyle?.border || '#e5e7eb',
          cardAccent: styleData.cardAccent || styleData.fields?.price?.color || '#7c2bee',
          cardRadius: styleData.cardRadius || styleData.cardStyle?.radius || 12,
          cardPadding: styleData.cardPadding || styleData.cardStyle?.padding || 16,
          cardShadow: styleData.cardShadow || styleData.cardStyle?.shadow || 'md',
          fields: styleData.fields || {},
          hover: styleData.hover || {},
          template: styleData.template || null,
          grid: styleData.grid || null,
          dataMapping: styleData.dataMapping || null,
          textStyles: styleData.textStyles || {},
          animation: styleData.animation || { enabled: false },
          isNewFormat: styleData.template && (styleData.template.html || styleData.template.css)
        };

        this.styleSets.push(styleSet);
        this.currentStyle = styleSet;
        this.renderStyleSets();
        this.renderPreview();
        this.saveData();
        this.showToast('Style set imported: ' + styleSet.name, 'success');
      } catch (error) {
        console.error('Failed to import style set:', error);
        this.showToast('Failed to import style set. Please check the file format.', 'error');
      }
    };
    reader.readAsText(file);

    event.target.value = '';
  }

  loadFromStyleFolder() {
    const styleFiles = [
      'STYLE_SET_TEMPLATE.json',
      'animated-card.json',
      'blog-card.json',
      'minimal-blog-card.json',
      'minimal-card.json',
      'modern-product-card.json',
      'product-card.json',
      'testimonal.json'
    ];

    let loadedCount = 0;
    let errorCount = 0;

    styleFiles.forEach(filename => {
      fetch(`style/${filename}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load ${filename}`);
          }
          return response.json();
        })
        .then(styleData => {
          const existingIndex = this.styleSets.findIndex(s => s.id === styleData.id);
          
          const styleSet = {
            id: styleData.id || Date.now() + Math.random(),
            name: styleData.name || filename.replace('.json', ''),
            description: styleData.description || '',
            cardBg: styleData.cardBg || styleData.cardStyle?.bg || '#ffffff',
            cardText: styleData.cardText || styleData.cardStyle?.text || '#1f2937',
            cardBorder: styleData.cardBorder || styleData.cardStyle?.border || '#e5e7eb',
            cardAccent: styleData.cardAccent || styleData.fields?.price?.color || '#7c2bee',
            cardRadius: styleData.cardRadius || styleData.cardStyle?.radius || 12,
            cardPadding: styleData.cardPadding || styleData.cardStyle?.padding || 16,
            cardShadow: styleData.cardShadow || styleData.cardStyle?.shadow || 'md',
            fields: styleData.fields || {},
            hover: styleData.hover || {},
            template: styleData.template || null,
            grid: styleData.grid || null,
            dataMapping: styleData.dataMapping || null,
            textStyles: styleData.textStyles || {},
            animation: styleData.animation || { enabled: false },
            isNewFormat: styleData.template && (styleData.template.html || styleData.template.css)
          };

          if (existingIndex >= 0) {
            this.styleSets[existingIndex] = styleSet;
          } else {
            this.styleSets.push(styleSet);
          }

          loadedCount++;
          console.log(`Loaded style set: ${styleSet.name}`);

          if (loadedCount + errorCount === styleFiles.length) {
            this.renderStyleSets();
            this.renderPreview();
            this.saveData();
            this.showToast(`Loaded ${loadedCount} style sets from style folder`, 'success');
          }
        })
        .catch(error => {
          console.error(`Error loading ${filename}:`, error);
          errorCount++;
        });
    });
  }

  applyStyleSet(id) {
    const styleSet = this.styleSets.find(s => s.id === id || String(s.id) === String(id));
    if (styleSet) {
      this.currentStyle = styleSet;

      if (styleSet.isNewFormat && styleSet.grid) {
        this.gridConfig = {
          columns: styleSet.grid.columns || 4,
          gap: styleSet.grid.gap || 24,
          minWidth: styleSet.grid.minWidth || 280,
          maxWidth: styleSet.grid.maxWidth || 1440
        };
      }

      document.getElementById('cardBg').value = styleSet.cardBg;
      document.getElementById('cardText').value = styleSet.cardText;
      document.getElementById('cardBorder').value = styleSet.cardBorder;
      document.getElementById('cardAccent').value = styleSet.cardAccent;
      document.getElementById('cardRadius').value = styleSet.cardRadius;
      document.getElementById('cardRadiusValue').textContent = styleSet.cardRadius;
      document.getElementById('cardPadding').value = styleSet.cardPadding;
      document.getElementById('cardPaddingValue').textContent = styleSet.cardPadding;
      document.getElementById('cardShadow').value = styleSet.cardShadow;

      if (this.selectedSection) {
        this.selectedSection.gridEnabled = true;
        this.selectedSection.gridColumns = this.gridConfig.columns;
        this.selectedSection.gridGap = this.gridConfig.gap;
        this.selectedSection.gridMinWidth = this.gridConfig.minWidth;
        this.selectedSection.gridMaxWidth = this.gridConfig.maxWidth;
        this.selectedSection.styleApplied = true;
        this.selectedSection.styleSetId = id;
      }

      this.renderStyleSets();
      this.renderSections();
      this.renderPreview();
      this.showToast('Style set applied: ' + styleSet.name, 'success');
    }
  }

  toggleStyleOnSection(id, apply) {
    if (!this.selectedSection) {
      this.showToast('Please select a section first', 'error');
      return;
    }
    
    if (apply) {
      this.applyStyleSet(id);
    } else {
      this.selectedSection.styleApplied = false;
      this.selectedSection.styleSetId = null;
      this.selectedSection.gridEnabled = false;
      this.renderStyleSets();
      this.renderSections();
      this.renderPreview();
      this.saveData();
      this.showToast('Style set removed', 'success');
    }
  }

  deleteStyleSet(id) {
    if (confirm('Are you sure you want to delete this style set?')) {
      this.styleSets = this.styleSets.filter(s => s.id !== id);
      if (this.currentStyle && this.currentStyle.id === id) {
        this.currentStyle = null;
      }
      this.renderStyleSets();
      this.renderPreview();
      this.saveData();
      this.showToast('Style set deleted', 'success');
    }
  }

  renderStyleSets() {
    const container = document.getElementById('styleSetList');
    const select = document.getElementById('styleSetSelect');
    
    const displayStyleSets = this.styleSets;
    
    if (displayStyleSets.length === 0) {
      container.innerHTML = '<p style="color: #6b7280; font-size: 14px;">No style set selected</p>';
      return;
    }

    container.innerHTML = displayStyleSets.map(styleSet => {
      const isAppliedToSelected = this.selectedSection && this.selectedSection.styleSetId === styleSet.id;
      
      let previewHtml = '';
      
      if (styleSet.template && styleSet.template.html) {
        const previewData = this.sheetData.length > 0 ? this.sheetData[0] : null;
        const dataMapping = styleSet.dataMapping || {};
        const fields = styleSet.fields || {};
        
        const fieldValues = {};
        const imageDefault = fields.image?.default || '';
        
        if (previewData) {
          console.log('=== Style Preview Data ===');
          console.log('Style:', styleSet.name);
          console.log('Preview data keys:', Object.keys(previewData));
          console.log('Data mapping:', dataMapping);
          console.log('Full preview data:', previewData);
        } else {
          console.log('=== Style Preview Data ===');
          console.log('Style:', styleSet.name);
          console.log('No preview data available (sheetData length:', this.sheetData.length, ')');
        }
        
        for (const [fieldName, possibleKeys] of Object.entries(dataMapping)) {
          let value = '';
          
          if (previewData) {
            for (const key of possibleKeys) {
              if (previewData[key] !== undefined && previewData[key] !== '') {
                value = previewData[key];
                console.log(`Found ${fieldName} from key "${key}":`, value);
                break;
              }
            }
          }
          
          if (!value) {
            const fieldConfig = fields[fieldName];
            value = fieldConfig?.default || '';
            console.log(`Using default for ${fieldName}:`, value);
          }
          
          fieldValues[fieldName] = value;
        }
        
        if (fieldValues['image'] && fieldValues['image'] !== imageDefault) {
          const originalImageUrl = fieldValues['image'];
          fieldValues['image'] = this.convertGoogleDriveUrl(fieldValues['image']);
          console.log('Image URL converted:', originalImageUrl, '->', fieldValues['image']);
        }
        
        let template = styleSet.template.html;
        for (const [field, value] of Object.entries(fieldValues)) {
          const regex = new RegExp(`{{${field}}}`, 'g');
          template = template.replace(regex, value);
        }
        
        template = template.replace(/<img\s+/g, '<img crossorigin="anonymous" ');
        template = template.replace(/<img([^>]*?)src="([^"]*?)"/g, (match, attrs, src) => {
          const convertedSrc = this.convertGoogleDriveUrl(src);
          return `<img${attrs}src="${convertedSrc}" onerror="this.onerror=null;this.src='${imageDefault}'"`;
        });
        
        const css = styleSet.template.css || '';
        const bg = styleSet.cardBg || styleSet.cardStyle?.bg || '#ffffff';
        const text = styleSet.cardText || styleSet.cardStyle?.text || '#1f2937';
        const border = styleSet.cardBorder || styleSet.cardStyle?.border || '#e5e7eb';
        const radius = styleSet.cardRadius || styleSet.cardStyle?.radius || 12;
        const padding = styleSet.cardPadding || styleSet.cardStyle?.padding || 16;
        const shadow = styleSet.cardShadow || styleSet.cardStyle?.shadow || 'md';
        
        const shadowValue = this.getShadowValue(shadow);
        
        let textStylesCSS = '';
        if (styleSet.textStyles) {
          const ts = styleSet.textStyles;
          if (ts.title) textStylesCSS += `--title-color: ${ts.title.color}; --title-font-size: ${ts.title.fontSize}px; --title-font-weight: ${ts.title.fontWeight}; --title-line-height: ${ts.title.lineHeight}; --title-letter-spacing: ${ts.title.letterSpacing}px; --title-text-align: ${ts.title.textAlign}; --title-text-transform: ${ts.title.textTransform};`;
          if (ts.subtitle) textStylesCSS += `--subtitle-color: ${ts.subtitle.color}; --subtitle-font-size: ${ts.subtitle.fontSize}px; --subtitle-font-weight: ${ts.subtitle.fontWeight}; --subtitle-line-height: ${ts.subtitle.lineHeight}; --subtitle-letter-spacing: ${ts.subtitle.letterSpacing}px; --subtitle-text-align: ${ts.subtitle.textAlign}; --subtitle-text-transform: ${ts.subtitle.textTransform};`;
          if (ts.description) textStylesCSS += `--description-color: ${ts.description.color}; --description-font-size: ${ts.description.fontSize}px; --description-font-weight: ${ts.description.fontWeight}; --description-line-height: ${ts.description.lineHeight}; --description-letter-spacing: ${ts.description.letterSpacing}px; --description-text-align: ${ts.description.textAlign}; --description-text-transform: ${ts.description.textTransform};`;
          if (ts.author) textStylesCSS += `--author-color: ${ts.author.color}; --author-font-size: ${ts.author.fontSize}px; --author-font-weight: ${ts.author.fontWeight}; --author-line-height: ${ts.author.lineHeight}; --author-letter-spacing: ${ts.author.letterSpacing}px; --author-text-align: ${ts.author.textAlign}; --author-text-transform: ${ts.author.textTransform};`;
          if (ts.role) textStylesCSS += `--role-color: ${ts.role.color}; --role-font-size: ${ts.role.fontSize}px; --role-font-weight: ${ts.role.fontWeight}; --role-line-height: ${ts.role.lineHeight}; --role-letter-spacing: ${ts.role.letterSpacing}px; --role-text-align: ${ts.role.textAlign}; --role-text-transform: ${ts.role.textTransform};`;
          if (ts.price) textStylesCSS += `--price-color: ${ts.price.color}; --price-font-size: ${ts.price.fontSize}px; --price-font-weight: ${ts.price.fontWeight}; --price-line-height: ${ts.price.lineHeight}; --price-letter-spacing: ${ts.price.letterSpacing}px; --price-text-align: ${ts.price.textAlign}; --price-text-transform: ${ts.price.textTransform};`;
        }
        
        previewHtml = `
          <div class="card-preview-wrapper" style="max-width: 300px;">
            <style>
              .card-preview-wrapper {
                --card-bg: ${bg};
                --card-text: ${text};
                --card-border: ${border};
                --card-radius: ${radius}px;
                --card-padding: ${padding}px;
                --card-shadow: ${shadowValue};
                ${textStylesCSS}
              }
              ${css}
            </style>
            ${template}
          </div>
        `;
      } else {
        const previewData = this.sheetData.length > 0 ? this.sheetData[0] : null;
        
        let previewImageUrl = 'https://via.placeholder.com/300x300/7c2bee/ffffff?text=Product';
        let previewNameText = 'Product Name';
        let previewPriceText = '$99';
        let previewDescText = 'This is a sample product description to demonstrate the style effect';
        
        if (previewData) {
          const imageKeys = ['image', 'url', 'cover', '图片', '图片链接', '封面', '封面图'];
          let previewImage = null;
          for (const key of imageKeys) {
            if (previewData[key]) {
              previewImage = key;
              break;
            }
          }
          
          if (previewImage && previewData[previewImage]) {
            previewImageUrl = previewData[previewImage];
          }
          
          const originalPreviewUrl = previewImageUrl;
          previewImageUrl = this.convertGoogleDriveUrl(previewImageUrl);
          
          const nameKeys = ['name', 'title', '商品名称', '名称', '标题'];
          for (const key of nameKeys) {
            if (previewData[key]) {
              previewNameText = previewData[key];
              break;
            }
          }
          
          const priceKeys = ['price', '价格', '售价'];
          for (const key of priceKeys) {
            if (previewData[key]) {
              previewPriceText = previewData[key];
              break;
            }
          }
          
          const descKeys = ['description', 'desc', '描述', '商品描述', 'summary', '摘要'];
          for (const key of descKeys) {
            if (previewData[key]) {
              previewDescText = previewData[key];
              break;
            }
          }
        }
        
        const convertedPreviewUrl = this.convertGoogleDriveUrl(previewImageUrl);
        const imageDefaultUrl = styleSet.fields?.image?.default || 'https://via.placeholder.com/300x300/7c2bee/ffffff?text=Image+Error';
        
        previewHtml = `
          <div class="mini-card" style="background: ${styleSet.cardBg}; color: ${styleSet.cardText}; border: 1px solid ${styleSet.cardBorder}; border-radius: ${styleSet.cardRadius}px; padding: ${styleSet.cardPadding}px;">
            <img src="${convertedPreviewUrl}" alt="${previewNameText}" onerror="this.onerror=null;this.src='${imageDefaultUrl}'" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
            <div class="mini-card-title" style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">${previewNameText}</div>
            <div class="mini-card-accent" style="font-size: 18px; font-weight: 700; color: ${styleSet.cardAccent}; margin-bottom: 8px;">${previewPriceText}</div>
            <div class="mini-card-body" style="font-size: 13px; line-height: 1.5; color: #6b7280; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${previewDescText}</div>
          </div>
        `;
      }
      
      return `
      <div class="style-set-item ${this.currentStyle && this.currentStyle.id === styleSet.id ? 'selected' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div class="style-set-name">${styleSet.name}</div>
          <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer;">
            <input type="checkbox" ${isAppliedToSelected ? 'checked' : ''} 
                   onchange="editor.toggleStyleOnSection('${styleSet.id}', this.checked)"
                   style="width: 16px; height: 16px; cursor: pointer;">
            Apply
          </label>
        </div>
        ${styleSet.description ? `<div class="style-set-description">${styleSet.description}</div>` : ''}
        <div class="style-set-preview">
          ${previewHtml}
        </div>
        <div style="margin-top: 8px; display: flex; gap: 8px;">
          <button class="btn btn-primary" onclick="editor.applyStyleSet('${styleSet.id}')">Apply</button>
          <button class="btn btn-secondary" onclick="editor.deleteStyleSet('${styleSet.id}')">Delete</button>
        </div>
      </div>
    `;
    }).join('');

    if (select) {
      select.innerHTML = `
        <option value="">Select style set...</option>
        ${this.styleSets.map(styleSet => `
          <option value="${styleSet.id}" ${this.currentStyle && this.currentStyle.id === styleSet.id ? 'selected' : ''}>
            ${styleSet.name}
          </option>
        `).join('')}
      `;
      select.addEventListener('change', (e) => {
        if (e.target.value) {
          this.applyStyleSet(parseFloat(e.target.value));
        }
      });
    }
  }

  setPreviewWidth(width) {
    this.previewWidth = width;
    this.updatePreviewContainer();
    this.renderPreview();
  }

  updatePreviewContainer() {
    const container = document.getElementById('previewContainer');
    const widths = {
      desktop: '100%',
      tablet: '768px',
      mobile: '375px'
    };
    container.style.maxWidth = widths[this.previewWidth];
    container.style.margin = '0 auto';
  }

  renderPreview() {
    const container = document.getElementById('previewContainer');
    
    console.log('=== renderPreview called ===');
    console.log('Sections count:', this.sections.length);
    console.log('Sections:', this.sections.map(s => ({ id: s.id, name: s.name, visible: s.visible, type: s.type, gridEnabled: s.gridEnabled })));
    console.log('Sheet data count:', this.sheetData.length);
    console.log('Current style:', this.currentStyle?.name);
    
    if (this.sections.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <h3>Start Your Project</h3>
          <p>Import HTML or add sections to begin editing</p>
        </div>
      `;
      return;
    }

    let html = `<!DOCTYPE html><html${this.originalHtmlClass ? ' class="' + this.originalHtmlClass + '"' : ''}><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">`;
    
    if (this.originalHead) {
      html += this.originalHead;
    }
    
    if (this.currentStyle || this.selectedSection?.gridEnabled) {
      html += '<style>';
      
      if (this.currentStyle || this.selectedSection?.gridEnabled) {
        html += `
          .grid-container {
            max-width: ${this.gridConfig.maxWidth}px;
            margin: 0 auto;
            width: 100%;
          }
        `;
      }
      
      if (this.currentStyle) {
        console.log('=== Generating Style CSS ===');
        console.log('Style name:', this.currentStyle.name);
        console.log('Is new format:', this.currentStyle.isNewFormat);
        console.log('Has template CSS:', !!this.currentStyle.template?.css);
        console.log('Has text styles:', !!this.currentStyle.textStyles);
        console.log('Text styles:', this.currentStyle.textStyles);

        const animEnabled = this.currentStyle.animation?.enabled ?? false;
        const animHover = this.currentStyle.animation?.hover || {};
        const animEntry = this.currentStyle.animation?.entry || {};

        if (this.currentStyle.isNewFormat && this.currentStyle.template?.css) {
          html += `
            .card {
              --card-bg: ${this.currentStyle.cardBg};
              --card-text: ${this.currentStyle.cardText};
              --card-border: ${this.currentStyle.cardBorder};
              --card-radius: ${this.currentStyle.cardRadius}px;
              --card-padding: ${this.currentStyle.cardPadding}px;
            }
            ${this.generateTextStylesCSS(this.currentStyle.textStyles || {})}
            ${this.generateAnimationCSS(animEnabled, animHover, animEntry)}
            ${this.currentStyle.template.css}
          `;
        } else {
          html += `
            .card {
              background: ${this.currentStyle.cardBg};
              color: ${this.currentStyle.cardText};
              border: 1px solid ${this.currentStyle.cardBorder};
              border-radius: ${this.currentStyle.cardRadius}px;
              padding: ${this.currentStyle.cardPadding}px;
              box-shadow: ${this.getShadowValue(this.currentStyle.cardShadow)};
              display: flex;
              flex-direction: column;
              ${animEnabled ? 'transition: transform 0.2s ease, box-shadow 0.2s ease;' : ''}
            }
            ${animEnabled && animHover.cardLift ? `
            .card:hover {
              transform: translateY(-${animHover.liftDistance || 4}px);
              ${animHover.cardShadow ? `box-shadow: 0 12px 24px rgba(0,0,0,${animHover.shadowIntensity || 0.15});` : ''}
            }
            ` : ''}
            .card img {
              ${animEnabled && animHover.imageZoom ? 'transition: transform 0.2s ease;' : ''}
            }
            ${animEnabled && animHover.imageZoom ? `
            .card:hover img {
              transform: scale(${animHover.imageScale || 1.05});
            }
            ` : ''}
            ${this.generateTextStylesCSS(this.currentStyle.textStyles || {})}
            ${this.generateAnimationCSS(animEnabled, animHover, animEntry)}
          `;
        }

        html += `
          @media (max-width: 599px) {
            .grid-container {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 12px !important;
            }
          }
          @media (min-width: 600px) and (max-width: 1023px) {
            .grid-container {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 16px !important;
            }
          }
          @media (min-width: 1024px) {
            .grid-container {
              grid-template-columns: repeat(${this.gridConfig.columns}, 1fr) !important;
              gap: ${this.gridConfig.gap}px !important;
            }
          }
        `;

        if (!this.currentStyle.isNewFormat || !this.currentStyle.template?.css) {
          html += `
            .card h3 {
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 600;
            }

            .card .subtitle {
              margin: 0 0 4px 0;
              font-size: 12px;
              font-weight: 500;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .card .price {
              margin: 0 0 8px 0;
              font-size: 18px;
              font-weight: 700;
              color: var(--primary, #7c2bee);
            }

            .card p {
              margin: 0;
              font-size: 13px;
              line-height: 1.5;
              color: #6b7280;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .card .badge {
              background: ${this.currentStyle?.cardAccent || '#7c2bee'};
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
            }
          `;
        }
      }

      const hasGridSections = this.sections.some(s => s.visible && s.gridEnabled);
      if (hasGridSections) {
        const gridCSS = this.gridGenerator.generateFullGridCSS({
          columns: this.gridConfig.columns,
          gap: this.gridConfig.gap,
          minWidth: this.gridConfig.minWidth,
          maxWidth: this.gridConfig.maxWidth,
          containerClass: '.grid-container'
        });
        html += gridCSS;
      }

      html += '</style>';
    }
    
    html += '<script>';
    html += `
      console.log('=== Preview Debug Info ===');
      console.log('Grid Config:', ${JSON.stringify(this.gridConfig)});
      console.log('Current Style:', ${JSON.stringify(this.currentStyle)});
      console.log('Sheet Data Count:', ${this.sheetData.length});
      console.log('Sections Count:', ${this.sections.length});
      
      document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded in preview iframe');
        const images = document.querySelectorAll('img');
        console.log('Images found:', images.length);
        images.forEach((img, index) => {
          console.log('Image', index, '- src:', img.src);
          img.addEventListener('load', function() {
            console.log('Image', index, 'loaded successfully:', this.src);
          });
          img.addEventListener('error', function() {
            console.error('Image', index, 'failed to load:', this.src);
          });
        });
      });
    `;
    html += '</script>';

    html += '</head><body>';

    console.log('=== Rendering Preview Sections ===');
    console.log('Total sections:', this.sections.length);
    console.log('Visible sections:', this.sections.filter(s => s.visible).length);

    this.sections.forEach(section => {
      if (section.visible) {
        console.log('Rendering section:', section.name, 'type:', section.type);
        
        if (section.type === 'tally') {
          console.log('Rendering Tally section with URL:', section.url);
          const config = section.config || {};
          const width = config.width || 1200;
          const padding = config.padding || { top: 60, bottom: 60, left: 20, right: 20 };
          
          const embedUrl = section.url;
          const formId = embedUrl.match(/\/embed\/([a-zA-Z0-9]+)/)?.[1] || '';
          
          html += `<div class="tally-section" style="
            max-width: ${width}px;
            margin: 0 auto;
            padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
            position: relative;
            border: 2px dashed #10b981;
            background: rgba(16, 185, 129, 0.02);
            border-radius: 4px;
          ">`;
          html += `<div class="section-label" style="
            position: absolute;
            top: -10px;
            left: 12px;
            background: #10b981;
            color: white;
            padding: 2px 8px;
            font-size: 12px;
            border-radius: 2px;
            font-weight: 500;
            z-index: 10;
          ">${section.name}</div>`;
          html += `<iframe 
            src="${embedUrl}" 
            data-tally-embed="${formId}"
            data-tally-width="100%"
            data-tally-auto-height="true"
            title="${section.name}" 
            style="width: 100%; height: 600px; border: none; background: transparent;"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
            loading="lazy"
          ></iframe>`;
          html += `</div>`;
        } else if (section.gridEnabled) {
          const sectionGridColumns = section.gridColumns || this.gridConfig.columns || 4;
          const sectionGridGap = section.gridGap || this.gridConfig.gap || 24;
          const sectionGridMaxWidth = section.gridMaxWidth || this.gridConfig.maxWidth || 1200;
          const sectionCardLimit = section.gridCardLimit ?? this.gridConfig.cardLimit ?? 0;

          console.log('=== Rendering Grid Section ===');
          console.log('Section ID:', section.id);
          console.log('Section name:', section.name);
          console.log('Grid columns:', sectionGridColumns);
          console.log('Grid gap:', sectionGridGap);
          console.log('Grid max width:', sectionGridMaxWidth);
          console.log('Card limit:', sectionCardLimit);
          console.log('Sheet data count:', this.sheetData.length);
          console.log('Current style:', this.currentStyle?.name);

          html += `<div class="section-framework" style="
            position: relative;
            border: 2px dashed #3b82f6;
            padding: 8px;
            margin: 8px 0;
            background: rgba(59, 130, 246, 0.02);
            border-radius: 4px;
          ">`;
          html += `<div class="section-label" style="
            position: absolute;
            top: -10px;
            left: 12px;
            background: #3b82f6;
            color: white;
            padding: 2px 8px;
            font-size: 12px;
            border-radius: 2px;
            font-weight: 500;
          ">${section.name}</div>`;
          html += `<div class="grid-container" style="
            display: grid;
            grid-template-columns: repeat(${sectionGridColumns}, 1fr);
            gap: ${sectionGridGap}px;
            max-width: ${sectionGridMaxWidth}px;
            margin: 0 auto;
            padding: 20px;
          ">`;

          if (this.sheetData.length > 0) {
            console.log('Rendering data cards...');
            const dataToRender = sectionCardLimit > 0 ? this.sheetData.slice(0, sectionCardLimit) : this.sheetData;
            console.log('Card limit applied:', sectionCardLimit);
            console.log('Cards to render:', dataToRender.length);
            
            let cardCount = 0;
            dataToRender.forEach((item, index) => {
              if (index < 10) {
                console.log(`Card ${index + 1} data:`, item);
              }
              html += `<div class="card">${this.renderCard(item)}</div>`;
              cardCount++;
            });
            console.log('Total cards rendered:', cardCount);
          } else {
            const totalPlaceholders = sectionGridColumns * 3;
            for (let i = 0; i < totalPlaceholders; i++) {
              const cardStyle = this.currentStyle ? `
                background: ${this.currentStyle.cardBg};
                color: ${this.currentStyle.cardText};
                border: 1px solid ${this.currentStyle.cardBorder};
                border-radius: ${this.currentStyle.cardRadius}px;
                padding: ${this.currentStyle.cardPadding}px;
              ` : `
                background: #f9fafb;
                border: 2px dashed #d1d5db;
              `;
              
              html += `<div class="card placeholder-card" style="
                ${cardStyle}
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 200px;
                color: #9ca3af;
                font-size: 14px;
              ">
                Card ${i + 1}
              </div>`;
            }
          }
          html += `</div>`;
          html += `</div>`;
        } else {
          html += `<div class="section-framework" style="
            position: relative;
            border: 2px dashed #7c2bee;
            padding: 8px;
            margin: 8px 0;
            background: rgba(124, 43, 238, 0.02);
            border-radius: 4px;
          ">`;
          html += `<div class="section-label" style="
            position: absolute;
            top: -10px;
            left: 12px;
            background: #7c2bee;
            color: white;
            padding: 2px 8px;
            font-size: 12px;
            border-radius: 2px;
            font-weight: 500;
          ">${section.name}</div>`;
          html += section.content;
          html += `</div>`;
        }
      }
    });

    html += '</body></html>';

    console.log('Creating preview iframe with blob URL');
    const blob = new Blob([html], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    container.innerHTML = `<iframe class="preview-iframe" src="${blobUrl}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation allow-presentation allow-downloads allow-modals allow-popups-to-escape-sandbox"></iframe>`;
    const iframe = container.querySelector('iframe');
    console.log('Preview iframe created with blob URL:', blobUrl);
  }

  convertGoogleDriveUrl(url) {
    if (!url) return '';
    
    console.log('convertGoogleDriveUrl called with:', url);
    
    const trimmedUrl = url.trim();
    
    if (trimmedUrl.includes('drive.google.com/file/d/')) {
      const idMatch = trimmedUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        const fileID = idMatch[1];
        const convertedUrl = `https://lh3.googleusercontent.com/d/${fileID}=w1600`;
        console.log('Converted URL (drive.google.com/file/d/):', trimmedUrl, '->', convertedUrl);
        return convertedUrl;
      }
    }
    
    if (trimmedUrl.includes('drive.google.com/open?id=')) {
      const idMatch = trimmedUrl.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        const fileID = idMatch[1];
        const convertedUrl = `https://lh3.googleusercontent.com/d/${fileID}=w1600`;
        console.log('Converted URL (drive.google.com/open):', trimmedUrl, '->', convertedUrl);
        return convertedUrl;
      }
    }
    
    if (trimmedUrl.includes('docs.google.com/uc?id=')) {
      const idMatch = trimmedUrl.match(/docs\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        const fileID = idMatch[1];
        const convertedUrl = `https://lh3.googleusercontent.com/d/${fileID}=w1600`;
        console.log('Converted URL (docs.google.com/uc):', trimmedUrl, '->', convertedUrl);
        return convertedUrl;
      }
    }
    
    if (trimmedUrl.includes('drive.google.com/thumbnail?id=')) {
      const idMatch = trimmedUrl.match(/drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        const fileID = idMatch[1];
        const convertedUrl = `https://lh3.googleusercontent.com/d/${fileID}=w1600`;
        console.log('Converted URL (drive.google.com/thumbnail):', trimmedUrl, '->', convertedUrl);
        return convertedUrl;
      }
    }
    
    if (trimmedUrl.includes('drive.google.com/uc?id=')) {
      const idMatch = trimmedUrl.match(/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        const fileID = idMatch[1];
        const convertedUrl = `https://lh3.googleusercontent.com/d/${fileID}=w1600`;
        console.log('Converted URL (drive.google.com/uc):', trimmedUrl, '->', convertedUrl);
        return convertedUrl;
      }
    }
    
    console.log('URL not converted, returning original:', trimmedUrl);
    return trimmedUrl;
  }

  findImageUrl(item) {
    if (!item) return '';
    
    console.log('findImageUrl called with item:', item);
    
    const keys = Object.keys(item);
    console.log('Available keys:', keys);
    
    const imagePatterns = ['image', 'url', 'avatar', 'portrait', 'photo', 'picture', 'pic', 'img', '图片', '照片', '头像', '缩略图', 'thumbnail', 'cover'];
    const imageKey = keys.find(k => imagePatterns.some(p => k.toLowerCase().includes(p)));
    
    console.log('Found image key:', imageKey);
    
    if (imageKey && item[imageKey]) {
      const url = this.convertGoogleDriveUrl(item[imageKey]);
      console.log('Converted image URL:', url);
      return url;
    }
    
    console.log('No image URL found in item');
    return '';
  }

  renderCard(item) {
    if (this.currentStyle?.isNewFormat && this.currentStyle?.template?.html) {
      return this.renderCardFromTemplate(item);
    }

    const keys = Object.keys(item);
    const nameKey = keys.find(k => k.toLowerCase().includes('name')) || keys[0];
    const descKey = keys.find(k => k.toLowerCase().includes('desc') || k.toLowerCase().includes('description'));
    const priceKey = keys.find(k => k.toLowerCase().includes('price'));
    const imageKey = keys.find(k => k.toLowerCase().includes('image') || k.toLowerCase().includes('url'));
    const tagsKey = keys.find(k => k.toLowerCase().includes('tag'));
    const subtitleKey = keys.find(k => k.toLowerCase().includes('subtitle') || k.toLowerCase().includes('category'));

    const useTextStyles = this.currentStyle?.textStyles && Object.keys(this.currentStyle.textStyles).length > 0;

    let html = '';

    if (imageKey && item[imageKey]) {
      const originalUrl = item[imageKey];
      const imageUrl = this.convertGoogleDriveUrl(originalUrl);
      html += `<img src="${imageUrl}" alt="${item[nameKey] || ''}" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x300/7c2bee/ffffff?text=Image+Error';console.error('Image failed to load:', '${originalUrl}');" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">`;
    }

    if (subtitleKey && item[subtitleKey]) {
      html += `<div class="subtitle">${item[subtitleKey]}</div>`;
    }

    if (nameKey && item[nameKey]) {
      html += `<h3>${item[nameKey]}</h3>`;
    }

    if (priceKey && item[priceKey]) {
      html += `<div class="price">${item[priceKey]}</div>`;
    }

    if (descKey && item[descKey]) {
      html += `<p>${item[descKey]}</p>`;
    }

    if (tagsKey && item[tagsKey]) {
      const tags = item[tagsKey].split(',').map(t => t.trim());
      html += `<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">`;
      tags.forEach(tag => {
        html += `<span class="badge">${tag}</span>`;
      });
      html += `</div>`;
    }

    return html;
  }

  renderCardFromTemplate(item) {
    let template = this.currentStyle.template.html;
    const dataMapping = this.currentStyle.dataMapping || {};

    console.log('=== renderCardFromTemplate Debug ===');
    console.log('Input item:', item);
    console.log('Data mapping:', dataMapping);

    for (const [field, possibleKeys] of Object.entries(dataMapping)) {
      let value = '';
      let foundKey = '';

      for (const key of possibleKeys) {
        if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
          value = item[key];
          foundKey = key;
          break;
        }
      }

      console.log(`Field "${field}":`);
      console.log('  Possible keys:', possibleKeys);
      console.log('  Found key:', foundKey);
      console.log('  Value:', value);

      if (!value) {
        const fieldConfig = this.currentStyle.fields?.[field];
        value = fieldConfig?.default || '';
        console.log('  Using default value:', value);
      }

      if (field === 'image' && value) {
        const originalUrl = value;
        value = this.convertGoogleDriveUrl(value);
        console.log('  Image conversion:');
        console.log('    Original:', originalUrl);
        console.log('    Converted:', value);
      }

      const regex = new RegExp(`{{${field}}}`, 'g');
      template = template.replace(regex, value);
    }

    console.log('Final template length:', template.length);
    template = template.replace(/<img\s+/g, '<img crossorigin="anonymous" ');

    return template;
  }

  getShadowValue(shadow) {
    const shadows = {
      none: 'none',
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
    };
    return shadows[shadow] || shadows.md;
  }

  generateTextStylesCSS(textStyles) {
    if (!textStyles || Object.keys(textStyles).length === 0) return '';

    let css = '';

    const styleSelectors = {
      title: '.card h3',
      subtitle: '.card .subtitle',
      description: '.card p',
      price: '.card .price',
      badge: '.card .badge',
      button: '.card button',
      author: '.card .author-name',
      role: '.card .author-role',
      testimonialText: '.card .testimonial-text'
    };

    for (const [styleType, selector] of Object.entries(styleSelectors)) {
      const style = textStyles[styleType];
      if (!style) continue;

      css += `\n${selector} {`;
      if (style.fontSize) css += `font-size: ${style.fontSize}px;`;
      if (style.fontWeight) css += `font-weight: ${style.fontWeight};`;
      if (style.color) css += `color: ${style.color};`;
      if (style.lineHeight) css += `line-height: ${style.lineHeight};`;
      if (style.letterSpacing !== undefined) css += `letter-spacing: ${style.letterSpacing}px;`;
      if (style.textAlign) css += `text-align: ${style.textAlign};`;
      if (style.textTransform) css += `text-transform: ${style.textTransform};`;
      css += '}';
    }

    return css;
  }

  generateAnimationCSS(enabled, hover, entry) {
    if (!enabled) return '';

    let css = '';

    if (entry.enabled && entry.type) {
      const duration = entry.duration || 0.4;
      const delay = entry.stagger ? 0.1 : 0;
      
      const keyframes = {
        fade: 'opacity: 0; opacity: 1;',
        slideUp: 'transform: translateY(20px); opacity: 0; transform: translateY(0); opacity: 1;',
        slideDown: 'transform: translateY(-20px); opacity: 0; transform: translateY(0); opacity: 1;',
        slideLeft: 'transform: translateX(20px); opacity: 0; transform: translateX(0); opacity: 1;',
        slideRight: 'transform: translateX(-20px); opacity: 0; transform: translateX(0); opacity: 1;',
        scale: 'transform: scale(0.9); opacity: 0; transform: scale(1); opacity: 1;'
      };

      if (keyframes[entry.type]) {
        css += `
          @keyframes cardEntry {
            from { ${keyframes[entry.type].split(';')[0]} }
            to { ${keyframes[entry.type].split(';').slice(1).join(';')} }
          }
          .card {
            animation: cardEntry ${duration}s ease-out ${delay}s backwards;
          }
        `;
      }
    }

    return css;
  }

  refreshPreview() {
    this.renderPreview();
    this.showToast('Preview refreshed', 'success');
  }

  exportHtml() {
    const html = this.generateHtml();
    this.downloadFile(html, 'aura-canvas.html', 'text/html');
    this.showToast('HTML exported', 'success');
  }

  exportProject() {
    const project = {
      sections: this.sections,
      sheetData: this.sheetData,
      styleSets: this.styleSets,
      currentStyle: this.currentStyle,
      gridConfig: this.gridConfig
    };
    const json = JSON.stringify(project, null, 2);
    this.downloadFile(json, 'aura-canvas-project.json', 'application/json');
    this.showToast('Project exported', 'success');
  }

  generateHtml() {
    let html = `<!DOCTYPE html>
<html${this.originalHtmlClass ? ' class="' + this.originalHtmlClass + '"' : ''}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aura Canvas Export</title>
`;

    if (this.originalHead) {
      html += this.originalHead;
    }

    if (this.currentStyle) {
      html += `<style>
        .grid-container {
          max-width: ${this.gridConfig.maxWidth}px;
          margin: 0 auto;
          width: 100%;
        }
        .card {
          background: ${this.currentStyle.cardBg};
          color: ${this.currentStyle.cardText};
          border: 1px solid ${this.currentStyle.cardBorder};
          border-radius: ${this.currentStyle.cardRadius}px;
          padding: ${this.currentStyle.cardPadding}px;
          box-shadow: ${this.getShadowValue(this.currentStyle.cardShadow)};
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        .card img {
          transition: transform 0.2s ease;
        }
        .card:hover img {
          transform: scale(1.05);
        }
        .section-framework {
          position: relative;
          border: 2px dashed #7c2bee;
          padding: 8px;
          margin: 8px 0;
          background: rgba(124, 43, 238, 0.02);
          border-radius: 4px;
        }
        .section-label {
          position: absolute;
          top: -10px;
          left: 12px;
          background: #7c2bee;
          color: white;
          padding: 2px 8px;
          font-size: 12px;
          border-radius: 2px;
          font-weight: 500;
        }
        .tally-section {
          position: relative;
          border: 2px dashed #10b981;
          background: rgba(16, 185, 129, 0.02);
          border-radius: 4px;
        }
        .tally-section .section-label {
          background: #10b981;
        }
        .tally-section iframe {
          width: 100%;
          border: none;
        }
      </style>`;
    }

    const hasGridSections = this.sections.some(s => s.visible && s.gridEnabled);
    if (hasGridSections) {
      const gridCSS = this.gridGenerator.generateFullGridCSS({
        columns: this.gridConfig.columns,
        gap: this.gridConfig.gap,
        minWidth: this.gridConfig.minWidth,
        maxWidth: this.gridConfig.maxWidth,
        containerClass: '.grid-container'
      });
      html += `<style>${gridCSS}</style>`;
    }

    html += `</head>
<body>
`;

    this.sections.forEach(section => {
      if (section.visible) {
        if (section.type === 'tally') {
          const config = section.config || {};
          const width = config.width || 1200;
          const padding = config.padding || { top: 60, bottom: 60, left: 20, right: 20 };
          
          const embedUrl = section.url;
          const formId = embedUrl.match(/\/embed\/([a-zA-Z0-9]+)/)?.[1] || '';
          
          html += `<div class="tally-section" style="
            max-width: ${width}px;
            margin: 0 auto;
            padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
          ">`;
          html += `<div class="section-label">${section.name}</div>`;
          html += `<iframe 
            src="${embedUrl}" 
            data-tally-embed="${formId}"
            data-tally-width="100%"
            data-tally-auto-height="true"
            title="${section.name}" 
            style="width: 100%; height: 600px; border: none; background: transparent;"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
            loading="lazy"
          ></iframe>`;
          html += `</div>`;
        } else if (section.gridEnabled) {
          const sectionGridColumns = section.gridColumns || this.gridConfig.columns || 4;
          const sectionGridGap = section.gridGap || this.gridConfig.gap || 24;
          const sectionGridMaxWidth = section.gridMaxWidth || this.gridConfig.maxWidth || 1200;
          
          html += `<div class="grid-container" style="
            display: grid;
            grid-template-columns: repeat(${sectionGridColumns}, 1fr);
            gap: ${sectionGridGap}px;
            max-width: ${sectionGridMaxWidth}px;
            margin: 0 auto;
            padding: 20px;
          ">`;
          if (this.sheetData.length > 0) {
            const cardLimit = section.gridCardLimit || this.gridConfig.cardLimit || 0;
            const dataToRender = cardLimit > 0 ? this.sheetData.slice(0, cardLimit) : this.sheetData;
            dataToRender.forEach(item => {
              html += `<div class="card">${this.renderCard(item)}</div>`;
            });
          } else {
            const gridCols = section.gridColumns || this.gridConfig.columns || 4;
            const totalPlaceholders = gridCols * 3;
            for (let i = 0; i < totalPlaceholders; i++) {
              html += `<div class="card placeholder-card" style="
                background: #f9fafb;
                border: 2px dashed #d1d5db;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 200px;
                color: #9ca3af;
                font-size: 14px;
              ">
                Card ${i + 1}
              </div>`;
            }
          }
          html += `</div>`;
        } else {
          html += section.content;
        }
      }
    });

    html += `</body>
</html>`;

    return html;
  }

  downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  saveData() {
    const data = {
      sections: this.sections,
      styleSets: this.styleSets,
      currentStyleId: this.currentStyle?.id,
      gridConfig: this.gridConfig,
      originalHead: this.originalHead,
      originalHtmlClass: this.originalHtmlClass
    };
    localStorage.setItem('auraCanvasData', JSON.stringify(data));
  }

  loadSavedData() {
    const saved = localStorage.getItem('auraCanvasData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.sections = data.sections || [];
        this.styleSets = data.styleSets || [];
        this.currentStyle = this.styleSets.find(s => s.id === data.currentStyleId) || null;
        this.gridConfig = data.gridConfig || this.gridConfig;
        this.originalHead = data.originalHead || '';
        this.originalHtmlClass = data.originalHtmlClass || '';
        this.renderSections();
        this.renderStyleSets();
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }

  extractSpreadsheetId(url) {
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

  async loadStyleSheets() {
    await this.loadLocalStyles();
  }

  async loadLocalStyles() {
    const styleFiles = [
      { name: 'Minimal Card', file: 'style/minimal-card.json' },
      { name: 'Minimal Testimonial Card', file: 'style/testimonal.json' }
    ];

    try {
      this.styleSets = [];
      for (const styleInfo of styleFiles) {
        const response = await fetch(styleInfo.file);
        if (!response.ok) continue;
        const styleSet = await response.json();
        styleSet.isNewFormat = true;
        styleSet.cardBg = styleSet.cardStyle?.bg || '#ffffff';
        styleSet.cardText = styleSet.cardStyle?.text || '#1f2937';
        styleSet.cardBorder = styleSet.cardStyle?.border || '#e5e7eb';
        styleSet.cardRadius = styleSet.cardStyle?.radius || 12;
        styleSet.cardPadding = styleSet.cardStyle?.padding || 16;
        styleSet.cardShadow = styleSet.cardStyle?.shadow || 'md';
        this.styleSets.push(styleSet);
      }

      this.renderStyleSelect();
    } catch (error) {
      console.error('Failed to load local styles:', error);
      this.showToast('Failed to load local styles: ' + error.message, 'error');
    }
  }

  renderStyleSelect() {
    const styleSelect = document.getElementById('styleSelect');
    if (!styleSelect) return;

    styleSelect.innerHTML = '<option value="">Choose a style...</option>';
    this.styleSets.forEach(styleSet => {
      const option = document.createElement('option');
      option.value = styleSet.id;
      option.textContent = styleSet.name;
      styleSelect.appendChild(option);
    });
  }

  async loadLocalStyle() {
    const styleId = document.getElementById('styleSelect').value;
    if (!styleId) {
      this.showToast('Please select a style', 'error');
      return;
    }

    try {
      const styleSet = this.styleSets.find(s => s.id === styleId);
      if (!styleSet) {
        throw new Error('Style not found');
      }

      console.log('=== Loading Style ===');
      console.log('Style ID:', styleId);
      console.log('Style name:', styleSet.name);
      console.log('Current sheet data count:', this.sheetData.length);
      console.log('Sections count:', this.sections.length);

      this.currentStyle = styleSet;

      let gridSection = this.sections.find(s => s.gridEnabled);
      if (gridSection) {
        console.log('Found grid section:', gridSection.id);
        gridSection.styleApplied = true;
        gridSection.styleSetId = styleSet.id;
        if (styleSet.grid) {
          gridSection.gridColumns = styleSet.grid.columns;
          gridSection.gridGap = styleSet.grid.gap;
          gridSection.gridMinWidth = styleSet.grid.minWidth;
          gridSection.gridMaxWidth = styleSet.grid.maxWidth;
          if (styleSet.grid.cardLimit !== undefined) {
            gridSection.gridCardLimit = styleSet.grid.cardLimit;
          }
        }
        this.syncGridControls(gridSection);
      } else {
        console.log('No grid section found, creating one automatically...');
        gridSection = {
          id: Date.now(),
          name: 'Grid Section',
          content: '',
          className: 'grid-section',
          visible: true,
          gridEnabled: true,
          gridColumns: styleSet.grid?.columns || this.gridConfig.columns || 4,
          gridGap: styleSet.grid?.gap || this.gridConfig.gap || 24,
          gridMinWidth: styleSet.grid?.minWidth || this.gridConfig.minWidth || 280,
          gridMaxWidth: styleSet.grid?.maxWidth || this.gridConfig.maxWidth || 1440,
          gridCardLimit: styleSet.grid?.cardLimit ?? this.gridConfig.cardLimit ?? 0,
          styleApplied: true,
          styleSetId: styleSet.id
        };
        this.sections.push(gridSection);
        console.log('Grid section created, ID:', gridSection.id);
        this.syncGridControls(gridSection);
      }

      this.renderStylePreview(styleSet);
      this.renderPreview();

      if (gridSection) {
        console.log('Switching to sections tab to show preview');
        this.switchTab('sections');
      } else {
        this.switchTab('styles');
      }

      this.showToast('Style applied successfully: ' + styleSet.name, 'success');
    } catch (error) {
      console.error('Failed to load style:', error);
      this.showToast('Failed to load style: ' + error.message, 'error');
    }
  }

  parseStyleFromSheet(data) {
    const styleSet = {
      id: Date.now(),
      name: data[0]?.name || 'Style from Sheet',
      description: data[0]?.description || '',
      cardBg: data[0]?.cardBg || '#ffffff',
      cardText: data[0]?.cardText || '#1f2937',
      cardBorder: data[0]?.cardBorder || '#e5e7eb',
      cardAccent: data[0]?.cardAccent || '#7c2bee',
      cardRadius: parseInt(data[0]?.cardRadius) || 12,
      cardPadding: parseInt(data[0]?.cardPadding) || 16,
      cardShadow: data[0]?.cardShadow || 'md',
      template: data[0]?.template ? JSON.parse(data[0].template) : null,
      dataMapping: data[0]?.dataMapping ? JSON.parse(data[0].dataMapping) : null,
      textStyles: data[0]?.textStyles ? JSON.parse(data[0].textStyles) : {},
      grid: data[0]?.grid ? JSON.parse(data[0].grid) : null,
      hover: data[0]?.hover ? JSON.parse(data[0].hover) : {},
      animation: data[0]?.animation ? JSON.parse(data[0].animation) : { enabled: false },
      isNewFormat: !!(data[0]?.template)
    };

    return styleSet;
  }

  getPreviewData(styleSet) {
    const fields = styleSet.fields || {};
    const isTestimonial = styleSet.id.includes('testimonial');
    
    return {
      image: fields.image?.default || (isTestimonial 
        ? 'https://via.placeholder.com/60x60/cccccc/000000?text=Client'
        : 'https://via.placeholder.com/400x400/1f2937/ffffff?text=Product'),
      name: fields.name?.default || (isTestimonial ? 'Lydia Chen' : 'Product Name'),
      description: fields.description?.default || (isTestimonial 
        ? 'ARKAL transformed our space with clear vision and thoughtful design. Every detail felt intentional.'
        : 'Product description text'),
      price: fields.price?.default || '$99',
      category: fields.category?.default || 'Category',
      badge: fields.badge?.default || '',
      buttonText: fields.buttonText?.default || 'Buy Now',
      author: fields.author?.default || 'Lydia Chen',
      role: fields.role?.default || 'Director, Arcadia Builders',
      title: fields.title?.default || (isTestimonial ? 'Client Stories' : 'Title')
    };
  }

  renderStylePreview(styleSet) {
    const previewContainer = document.getElementById('stylePreview');
    if (!previewContainer) {
      console.warn('stylePreview container not found');
      return;
    }

    let previewHtml = '';

    if (styleSet.isNewFormat && styleSet.template) {
      const previewData = this.getPreviewData(styleSet);
      
      if (previewData && styleSet.template.html) {
        const template = styleSet.template.html;
        const css = styleSet.template.css || '';
        const cardStyle = styleSet.cardStyle || {};
        const bg = cardStyle.bg || '#ffffff';
        const text = cardStyle.text || '#1f2937';
        const border = cardStyle.border || '#e5e7eb';
        const radius = cardStyle.radius || 12;
        const padding = cardStyle.padding || 16;
        const shadow = cardStyle.shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        const textStyles = styleSet.textStyles || {};
        
        let textStylesCSS = '';
        for (const [field, style] of Object.entries(textStyles)) {
          const cssVars = [
            `--${field}-font-size: ${style.fontSize}px`,
            `--${field}-font-weight: ${style.fontWeight}`,
            `--${field}-color: ${style.color}`,
            `--${field}-line-height: ${style.lineHeight}`,
            `--${field}-letter-spacing: ${style.letterSpacing}px`,
            `--${field}-text-align: ${style.textAlign}`,
            `--${field}-text-transform: ${style.textTransform}`
          ];
          textStylesCSS += cssVars.join('; ') + '; ';
        }

        let filledTemplate = template;
        for (const key in previewData) {
          let value = previewData[key];
          
          if (key === 'image' && value) {
            value = this.convertGoogleDriveUrl(value);
          }
          
          filledTemplate = filledTemplate.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
        }

        previewHtml = `
          <div class="card-preview-wrapper" style="max-width: 300px;">
            <style>
              .card-preview-wrapper {
                --card-bg: ${bg};
                --card-text: ${text};
                --card-border: ${border};
                --card-radius: ${radius}px;
                --card-padding: ${padding}px;
                --card-shadow: ${shadow};
                ${textStylesCSS}
              }
              ${css}
            </style>
            ${filledTemplate}
          </div>
        `;
      }
    }

    previewContainer.innerHTML = previewHtml || '<p>No preview available</p>';
  }

  addTallySection() {
    const url = document.getElementById('tallyUrl').value.trim();
    const width = parseInt(document.getElementById('tallyWidth').value) || 1200;
    const paddingTop = parseInt(document.getElementById('tallyPaddingTop').value) || 60;
    const paddingBottom = parseInt(document.getElementById('tallyPaddingBottom').value) || 60;
    const paddingLeft = parseInt(document.getElementById('tallyPaddingLeft').value) || 20;
    const paddingRight = parseInt(document.getElementById('tallyPaddingRight').value) || 20;

    console.log('=== Adding Tally Section ===');
    console.log('Input URL:', url);
    console.log('URL type:', typeof url);

    if (!url) {
      this.showToast('Please enter a Tally shared link', 'error');
      return;
    }

    const embedUrl = this.normalizeTallyUrl(url);
    console.log('Final embed URL:', embedUrl);
    console.log('Config:', { width, padding: { top: paddingTop, bottom: paddingBottom, left: paddingLeft, right: paddingRight } });

    const section = {
      id: Date.now(),
      name: 'Tally Form',
      type: 'tally',
      url: embedUrl,
      visible: true,
      config: {
        width: Math.min(Math.max(width, 320), 1440),
        padding: {
          top: paddingTop,
          bottom: paddingBottom,
          left: paddingLeft,
          right: paddingRight
        }
      }
    };

    this.sections.push(section);
    console.log('Sections count after adding Tally:', this.sections.length);
    console.log('All sections:', JSON.stringify(this.sections, null, 2));

    this.switchTab('sections');
    this.renderSections();
    this.renderPreview();
    this.showToast('Tally form section added', 'success');
  }

  normalizeTallyUrl(url) {
    if (!url) return url;

    if (url.includes('tally.so/embed/')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;
    }

    const rMatch = url.match(/tally\.so\/r\/([a-zA-Z0-9]+)/);
    if (rMatch && rMatch[1]) {
      return `https://tally.so/embed/${rMatch[1]}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;
    }

    const directMatch = url.match(/tally\.so\/([a-zA-Z0-9]+)/);
    if (directMatch && directMatch[1]) {
      return `https://tally.so/embed/${directMatch[1]}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;
    }

    return url;
  }

  async loadStyleFiles() {
    try {
      this.styleSets = [];

      if (typeof STYLE_SETS !== 'undefined' && STYLE_SETS.length > 0) {
        console.log('Loading style sets from STYLE_SETS constant:', STYLE_SETS.length);

        for (const styleData of STYLE_SETS) {
          const isNewFormat = styleData.template && (styleData.template.html || styleData.template.css);

          const styleSet = {
            id: styleData.id || Date.now() + Math.random(),
            name: styleData.name || 'Untitled Style',
            description: styleData.description || '',
            cardBg: styleData.cardBg || styleData.cardStyle?.bg || '#ffffff',
            cardText: styleData.cardText || styleData.cardStyle?.text || '#1f2937',
            cardBorder: styleData.cardBorder || styleData.cardStyle?.border || '#e5e7eb',
            cardAccent: styleData.cardAccent || styleData.fields?.price?.color || '#7c2bee',
            cardRadius: styleData.cardRadius || styleData.cardStyle?.radius || 12,
            cardPadding: styleData.cardPadding || styleData.cardStyle?.padding || 16,
            cardShadow: styleData.cardShadow || styleData.cardStyle?.shadow || 'md',
            fields: styleData.fields || {},
            hover: styleData.hover || {},
            template: styleData.template || null,
            grid: styleData.grid || null,
            dataMapping: styleData.dataMapping || null,
            textStyles: styleData.textStyles || {},
            animation: styleData.animation || { enabled: false },
            isNewFormat: isNewFormat
          };

          this.styleSets.push(styleSet);
          console.log(`Loaded style set: ${styleSet.name}`);
        }
      }

      await this.loadStyleJSONFiles();

      if (this.styleSets.length > 0 && !this.currentStyle) {
        this.currentStyle = this.styleSets[0];
      }

      console.log(`Total style sets loaded: ${this.styleSets.length}`);
      console.log('Style sets:', this.styleSets);
      this.renderStyleSets();
    } catch (error) {
      console.log('Failed to load style files:', error);
      console.error('Error details:', error);
    }
  }

  async loadStyleJSONFiles() {
    const styleFiles = [
      'style/card.json',
      'style/card_style_testimonal.json',
      'style/minimal-card.json',
      'style/testimonal.json'
    ];

    for (const filePath of styleFiles) {
      try {
        const response = await fetch(filePath);
        if (response.ok) {
          const styleData = await response.json();
          const isNewFormat = styleData.template && (styleData.template.html || styleData.template.css);
          
          let dataMapping = styleData.dataMapping || null;
          let fields = styleData.fields || {};
          let template = styleData.template || null;

          if (styleData.data_binding && !dataMapping) {
            dataMapping = {};
            fields = {};
            
            for (const [key, value] of Object.entries(styleData.data_binding)) {
              const placeholder = value.replace('{{', '').replace('}}', '');
              dataMapping[placeholder] = [placeholder, key];
              fields[placeholder] = {
                required: true,
                default: ''
              };
            }
            
            if (styleData.layout) {
              const cardRadius = styleData.layout.padding || 24;
              template = {
                html: `<div class="card-inner" style="display: flex; gap: ${styleData.layout.gap || 24}px; padding: ${styleData.layout.padding || 24}px; background: ${styleData.style?.background || '#ffffff'}; border-radius: ${styleData.style?.borderRadius || cardRadius}px; border: ${styleData.style?.border || '1px solid rgba(0,0,0,0.08)'};">` +
                  `<div style="flex: ${styleData.columns?.[0]?.widthPercent || 38}%;">` +
                    `<div style="font-size: 14px; font-weight: 500; color: rgba(0,0,0,0.72); margin-bottom: 18px;">Client Stories</div>` +
                    `<div style="font-family: ui-serif, Georgia, serif; font-size: 44px; line-height: 1.08; color: #111111; margin-bottom: 18px;">{{review}}</div>` +
                    `<div style="font-size: 16px; font-weight: 600; color: #111111;">{{name}}</div>` +
                    `<div style="font-size: 14px; font-weight: 500; color: rgba(0,0,0,0.62);">{{position}}</div>` +
                  `</div>` +
                  `<div style="flex: ${styleData.columns?.[1]?.widthPercent || 62}%;">` +
                    `<img src="{{image_url}}" alt="{{name}}" style="width: 100%; height: 100%; min-height: ${styleData.layout?.minHeight || 420}px; object-fit: cover; border-radius: ${styleData.style?.borderRadius || 18}px;">` +
                  `</div>` +
                `</div>`,
                css: ''
              };
              
              if (!fields['review']) fields['review'] = { required: true, default: 'Amazing experience!' };
              if (!fields['name']) fields['name'] = { required: true, default: 'Client Name' };
              if (!fields['position']) fields['position'] = { required: true, default: 'Position' };
              if (!fields['image_url']) fields['image_url'] = { required: true, default: 'https://via.placeholder.com/600x400' };
            }
          }

          const styleSet = {
            id: styleData.id || Date.now() + Math.random(),
            name: styleData.name || styleData.type || 'Untitled Style',
            description: styleData.description || '',
            cardBg: styleData.cardBg || styleData.cardStyle?.bg || styleData.style?.background || '#ffffff',
            cardText: styleData.cardText || styleData.cardStyle?.text || styleData.style?.color || '#1f2937',
            cardBorder: styleData.cardBorder || styleData.cardStyle?.border || styleData.style?.border || '#e5e7eb',
            cardAccent: styleData.cardAccent || styleData.fields?.price?.color || '#7c2bee',
            cardRadius: styleData.cardRadius || styleData.cardStyle?.radius || styleData.style?.borderRadius || 12,
            cardPadding: styleData.cardPadding || styleData.cardStyle?.padding || styleData.layout?.padding || 16,
            cardShadow: styleData.cardShadow || styleData.cardStyle?.shadow || styleData.style?.boxShadow || 'md',
            fields: fields,
            hover: styleData.hover || {},
            template: template,
            grid: styleData.grid || null,
            dataMapping: dataMapping,
            textStyles: styleData.textStyles || {},
            animation: styleData.animation || { enabled: false },
            isNewFormat: isNewFormat || template !== null
          };

          const existingIndex = this.styleSets.findIndex(s => s.id === styleSet.id);
          if (existingIndex === -1) {
            this.styleSets.push(styleSet);
            console.log(`Loaded JSON style: ${styleSet.name} from ${filePath}`);
          } else {
            this.styleSets[existingIndex] = styleSet;
            console.log(`Updated JSON style: ${styleSet.name} from ${filePath}`);
          }
        }
      } catch (error) {
        console.log(`Failed to load style file ${filePath}:`, error);
      }
    }
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        ${type === 'success' ? '<path d="M10 0a10 10 0 100 20 10 10 0 000-20zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z"/>' : ''}
        ${type === 'error' ? '<path d="M10 0a10 10 0 100 20 10 10 0 000-20zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>' : ''}
      </svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

const editor = new AuraCanvasEditor();
