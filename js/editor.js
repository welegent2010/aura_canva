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
      maxWidth: 1200
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
      this.loadSavedData();
      await this.loadStyleFiles();
      this.renderStyleSets();
      this.showToast('Welcome to Aura Canvas Editor', 'success');
    } catch (error) {
      console.error('Failed to initialize editor:', error);
      this.showToast('Initialization failed: ' + error.message, 'error');
    }
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
    document.getElementById('loadStyleSheetsBtn').addEventListener('click', () => this.loadStyleSheets());
    document.getElementById('styleSheetName').addEventListener('change', () => this.loadSelectedStyle());
    document.getElementById('addTallyBtn').addEventListener('click', () => this.addTallySection());
    document.getElementById('refreshPreviewBtn').addEventListener('click', () => this.refreshPreview());
    document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));

    document.getElementById('previewDesktopBtn').addEventListener('click', () => this.setPreviewWidth('desktop'));
    document.getElementById('previewTabletBtn').addEventListener('click', () => this.setPreviewWidth('tablet'));
    document.getElementById('previewMobileBtn').addEventListener('click', () => this.setPreviewWidth('mobile'));

    this.bindGridControls();
  }

  bindGridControls() {
    const controls = ['gridColumnsNum', 'gridGapNum', 'gridMinWidthNum', 'gridMaxWidthNum'];
    controls.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          this.updateGridConfigFromControls();
          this.updatePreviewFromControls();
        });
      }
    });
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
    this.gridConfig.columns = parseInt(document.getElementById('gridColumns').value);
    this.gridConfig.gap = parseInt(document.getElementById('gridGap').value);
    this.gridConfig.minWidth = parseInt(document.getElementById('gridMinWidth').value);
    this.gridConfig.maxWidth = parseInt(document.getElementById('gridMaxWidth').value);
    
    if (this.selectedSection) {
      this.selectedSection.gridColumns = this.gridConfig.columns;
      this.selectedSection.gridGap = this.gridConfig.gap;
      this.selectedSection.gridMinWidth = this.gridConfig.minWidth;
      this.selectedSection.gridMaxWidth = this.gridConfig.maxWidth;
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

      if (!result || !result.data) {
        throw new Error('Invalid data format returned');
      }

      this.sheetData = Array.isArray(result.data) ? result.data : [];
      
      if (this.sheetData.length === 0) {
        this.showToast('No data found. Please check Google Sheets URL and sheet name', 'warning');
      } else {
        this.showToast(`Successfully loaded ${this.sheetData.length} records`, 'success');
        
        console.log('=== Sheet Data Loaded ===');
        console.log('Total rows:', this.sheetData.length);
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

  applyGridConfig() {
    this.gridConfig = {
      columns: parseInt(document.getElementById('gridColumnsNum').value),
      gap: parseInt(document.getElementById('gridGapNum').value),
      minWidth: parseInt(document.getElementById('gridMinWidthNum').value),
      maxWidth: parseInt(document.getElementById('gridMaxWidthNum').value)
    };

    if (this.selectedSection) {
      this.selectedSection.gridEnabled = true;
      this.selectedSection.gridColumns = this.gridConfig.columns;
    }

    this.renderSections();
    this.renderPreview();
    this.showToast('Grid configuration applied', 'success');
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
    
    let displayStyleSets = this.styleSets;
    
    if (this.currentStyle) {
      displayStyleSets = [this.currentStyle];
    }
    
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
        
        previewHtml = `
          <div class="mini-card" style="background: ${styleSet.cardBg}; color: ${styleSet.cardText}; border: 1px solid ${styleSet.cardBorder}; border-radius: ${styleSet.cardRadius}px; padding: ${styleSet.cardPadding}px;">
            <img src="${previewImageUrl}" alt="${previewNameText}" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x300/7c2bee/ffffff?text=Image+Error';" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
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

    this.sections.forEach(section => {
      if (section.visible) {
        if (section.type === 'tally') {
          const config = section.config || {};
          const width = config.width || 1200;
          const padding = config.padding || { top: 60, bottom: 60, left: 20, right: 20 };
          
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
          html += `<iframe src="${section.url}" data-tally-open-widget="" data-tally-embed-id="" title="${section.name}" style="width: 100%; height: 600px; border: none; background: transparent;"></iframe>`;
          html += `</div>`;
        } else if (section.gridEnabled) {
          html += `<div class="grid-container">`;
          if (this.sheetData.length > 0) {
            this.sheetData.forEach(item => {
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

    container.innerHTML = `<iframe class="preview-iframe" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation allow-presentation allow-downloads"></iframe>`;
    const iframe = container.querySelector('iframe');
    iframe.srcdoc = html;
  }

  convertGoogleDriveUrl(url) {
    if (!url) return '';
    
    const trimmedUrl = url.trim();
    
    if (trimmedUrl.includes('drive.google.com/file/d/')) {
      const idMatch = trimmedUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        const fileID = idMatch[1];
        const convertedUrl = `https://lh3.googleusercontent.com/d/${fileID}=w1600`;
        console.log('Converted URL:', trimmedUrl, '->', convertedUrl);
        return convertedUrl;
      }
    }
    
    if (trimmedUrl.includes('drive.google.com/open?id=')) {
      const idMatch = trimmedUrl.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        const fileID = idMatch[1];
        const convertedUrl = `https://lh3.googleusercontent.com/d/${fileID}=w1600`;
        console.log('Converted URL:', trimmedUrl, '->', convertedUrl);
        return convertedUrl;
      }
    }
    
    if (trimmedUrl.includes('docs.google.com/uc?id=')) {
      const idMatch = trimmedUrl.match(/docs\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        const fileID = idMatch[1];
        const convertedUrl = `https://lh3.googleusercontent.com/d/${fileID}=w1600`;
        console.log('Converted URL:', trimmedUrl, '->', convertedUrl);
        return convertedUrl;
      }
    }
    
    return trimmedUrl;
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

    for (const [field, possibleKeys] of Object.entries(dataMapping)) {
      let value = '';

      for (const key of possibleKeys) {
        if (item[key]) {
          value = item[key];
          break;
        }
      }

      if (!value) {
        const fieldConfig = this.currentStyle.fields?.[field];
        value = fieldConfig?.default || '';
      }

      if (field === 'image' && value) {
        value = this.convertGoogleDriveUrl(value);
      }

      const regex = new RegExp(`{{${field}}}`, 'g');
      template = template.replace(regex, value);
    }

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
      button: '.card button'
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
        if (section.gridEnabled) {
          html += `<div class="grid-container">`;
          if (this.sheetData.length > 0) {
            this.sheetData.forEach(item => {
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
    const url = document.getElementById('styleSheetUrl').value;
    if (!url) {
      this.showToast('Please enter a style sheet URL', 'error');
      return;
    }

    try {
      this.showToast('Loading style sheets...', 'info');
      
      const spreadsheetId = this.extractSpreadsheetId(url);
      if (!spreadsheetId) {
        throw new Error('Invalid Google Sheets URL');
      }

      const sheets = await this.connector.listSheets(spreadsheetId);
      
      const select = document.getElementById('styleSheetName');
      select.innerHTML = '<option value="">-- Select Style --</option>';
      
      sheets.forEach(sheet => {
        const option = document.createElement('option');
        option.value = sheet;
        option.textContent = sheet;
        select.appendChild(option);
      });

      this.styleSpreadsheetId = spreadsheetId;
      this.showToast(`Found ${sheets.length} style sheets`, 'success');
    } catch (error) {
      console.error('Failed to load style sheets:', error);
      this.showToast('Failed to load style sheets: ' + error.message, 'error');
    }
  }

  async loadSelectedStyle() {
    const sheetName = document.getElementById('styleSheetName').value;
    if (!sheetName || !this.styleSpreadsheetId) {
      return;
    }

    try {
      this.showToast('Loading style from sheet: ' + sheetName, 'info');
      
      const data = await this.connector.readSheet(this.styleSpreadsheetId, sheetName);
      if (!data || data.length === 0) {
        throw new Error('No data found in sheet');
      }

      const styleSet = this.parseStyleFromSheet(data);
      
      this.styleSets = [styleSet];
      this.currentStyle = styleSet;
      
      this.renderStyleSets();
      this.renderStylePreview(styleSet);
      
      this.showToast('Style loaded successfully: ' + styleSet.name, 'success');
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

  renderStylePreview(styleSet) {
    const previewContainer = document.getElementById('stylePreview');
    if (!previewContainer) return;

    let previewHtml = '';

    if (styleSet.isNewFormat && styleSet.template) {
      const previewData = this.getPreviewData(styleSet);
      
      if (previewData && styleSet.template.html) {
        const template = styleSet.template.html;
        const css = styleSet.template.css || '';
        const bg = styleSet.cardBg;
        const text = styleSet.cardText;
        const border = styleSet.cardBorder;
        const radius = styleSet.radius;
        const padding = styleSet.padding;
        const shadow = styleSet.cardShadow || 'md';
        const shadowValue = this.getShadowValue(shadow);

        const dataMapping = styleSet.dataMapping || {};
        const textStyles = styleSet.textStyles || {};
        
        let textStylesCSS = '';
        for (const [field, style] of Object.entries(textStyles)) {
          textStylesCSS += `.${field}-style { ${style} }`;
        }

        let filledTemplate = template;
        for (const [key, possibleKeys] of Object.entries(dataMapping)) {
          const actualKey = possibleKeys.find(k => previewData[k] !== undefined);
          let value = actualKey ? previewData[actualKey] : '';
          
          if (key === 'image' && value) {
            value = this.convertGoogleDriveUrl(value);
          }
          
          filledTemplate = filledTemplate.replace(new RegExp(`{${key}}`, 'g'), value || '');
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
            ${filledTemplate}
          </div>
        `;
      }
    }

    previewContainer.innerHTML = previewHtml || '<p>No preview available</p>';
  }

  addTallySection() {
    const url = document.getElementById('tallyUrl').value;
    const width = parseInt(document.getElementById('tallyWidth').value) || 1200;
    const paddingTop = parseInt(document.getElementById('tallyPaddingTop').value) || 60;
    const paddingBottom = parseInt(document.getElementById('tallyPaddingBottom').value) || 60;
    const paddingLeft = parseInt(document.getElementById('tallyPaddingLeft').value) || 20;
    const paddingRight = parseInt(document.getElementById('tallyPaddingRight').value) || 20;

    if (!url) {
      this.showToast('Please enter a Tally shared link', 'error');
      return;
    }

    const embedUrl = url.replace('https://tally.so/', 'https://tally.so/embed/');
    
    const section = {
      id: Date.now(),
      type: 'tally',
      url: embedUrl,
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
    this.renderSections();
    this.showToast('Tally form section added', 'success');
  }

  loadStyleFiles() {
    try {
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

        if (this.styleSets.length > 0 && !this.currentStyle) {
          this.currentStyle = this.styleSets[0];
        }

        console.log(`Total style sets loaded: ${this.styleSets.length}`);
        console.log('Style sets:', this.styleSets);
        this.renderStyleSets();
      } else {
        console.error('STYLE_SETS is not defined or empty');
      }
    } catch (error) {
      console.log('Failed to load style files:', error);
      console.error('Error details:', error);
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
