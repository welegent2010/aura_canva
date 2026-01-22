# Aura Canvas - 基于Google Sheets的规划文档

## 项目概述

**项目名称**: Aura Canvas (HTML + Google Sheets 工具)

**定位**: 轻量化HTML拼接与动态制卡工具，通过 Google Sheets 作为数据源，实现像素级自适应卡片自动生成。

**核心价值**:
- 将 Aura 导出的 HTML 视为可编辑的画布
- 通过 Google Sheets 免鉴权读取管理内容
- 将 Sheet 数据转换为样式集配置的 HTML 卡片
- 拼接多个 HTML 片段成完整页面

**解决痛点**:
- Aura 导出后无法批量修改内容
- Notion API 调取数据技术路线复杂且不可行
- 需要免费、简单、免鉴权的内容管理方案
- 需要像素级自适应的网格布局

---

## 核心功能（4个）

### 1. HTML 解析与编辑器
- 导入 Aura 导出的 HTML 文件
- 可视化 HTML 结构树
- 识别并标注 `<section>` 区块
- 支持删除、保留特定 section
- 简单的文本编辑功能

### 2. Google Sheets 技术流集成
- 粘贴 Google Sheets URL（自动提取 ID）
- 通过 opensheet.elk.sh 免鉴权转发读取数据
- 字段标准化（自动小写化、去空格、驼峰转换）
- 字段校验（必填、类型、长度）
- 支持 JSON 配置和本地缓存

### 3. 样式集渲染引擎
- 样式集 JSON 配置（CSS Variables + 模板）
- 自适应网格计算（calc() 宽度公式）
- Handlebars 模板语法
- 支持多列、间距动态调整
- 保留原始 HTML 的 `<head>` 和全局样式

### 4. HTML 片段拼接与导出
- 将 Sheet 数据渲染的 HTML 卡片插入指定位置
- 保留原始 HTML 的 `<head>` 和全局样式
- 合并多个片段成完整 HTML
- 导出单文件 HTML

---

## 技术栈（极简）

| 组件 | 技术选择 | 理由 |
|------|----------|------|
| 前端框架 | 原生 HTML + Vanilla JS | 最小依赖，精简 |
| UI 框架 | Tailwind CSS (CDN) | 与 Aura 一致 |
| HTML 解析 | cheerio (Node.js) | 简单易用 |
| 模板引擎 | Handlebars | 轻量，语法简单 |
| 数据源 | Google Sheets + opensheet.elk.sh | 免鉴权，无API限制 |
| 本地存储 | IndexedDB | 存储配置和缓存 |
| 拖拽排序 | Sortable.js | 轻量拖拽库 |
| 文件操作 | Node.js fs | 原生支持 |

---

## 项目结构

```
aura-canvas/
├── index.html              # 主界面
├── css/
│   └── style.css           # 自定义样式
├── js/
│   ├── app.js              # 主逻辑
│   ├── sheets.js           # Google Sheets 封装
│   ├── parser.js           # HTML 解析器
│   ├── template.js         # 模板引擎
│   ├── grid.js             # 网格计算器
│   ├── storage.js          # IndexedDB 存储
│   └── exporter.js         # 导出功能
├── templates/              # Handlebars 模板
│   ├── card.hbs           # 卡片模板
│   ├── grid.hbs           # 网格模板
│   └── list.hbs           # 列表模板
├── style-sets/            # 样式集配置
│   ├── default.json       # 默认样式集
│   ├── blog.json          # 博客样式集
│   └── portfolio.json    # 作品集样式集
├── lib/
│   ├── cheerio.min.js     # DOM 操作库
│   ├── handlebars.min.js  # 模板引擎
│   └── sortable.min.js    # 拖拽排序
└── README.md
```

---

## 核心工作流

```
1. 用户导入 Aura HTML
   ↓
2. 显示 HTML 结构树
   ↓
3. 粘贴 Google Sheets URL
   ↓
4. 系统提取 Sheet ID 并加载数据
   ↓
5. 字段标准化与校验
   ↓
6. 选择样式集配置（JSON）
   ↓
7. 调整网格参数（列数、间距）
   ↓
8. 将 Sheet 数据渲染为 HTML 卡片
   ↓
9. 将卡片插入到 HTML 指定位置
   ↓
10. 导出完整 HTML 文件
```

---

## Google Sheets 技术流集成

### 数据连接协议

```javascript
// 1. 从 URL 提取 Sheet ID
function extractSheetId(url) {
  const regex = /\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// 2. 通过 opensheet.elk.sh 免鉴权转发
async function fetchSheetData(sheetId, sheetName = 'Sheet1') {
  const response = await fetch(`https://opensheet.elk.sh/${sheetId}/${sheetName}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sheet data');
  }
  return await response.json();
}

// 3. 字段标准化
function normalizeFields(data) {
  if (!data || data.length === 0) return [];
  
  const normalized = data.map(row => {
    const normalizedRow = {};
    for (const [key, value] of Object.entries(row)) {
      // 小写化 + 去空格 + 驼峰转换
      const normalizedKey = key
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      normalizedRow[normalizedKey] = value;
    }
    return normalizedRow;
  });
  
  return normalized;
}

// 4. 字段校验
function validateFields(data, schema) {
  const errors = [];
  
  data.forEach((row, index) => {
    for (const [field, rules] of Object.entries(schema)) {
      const value = row[field];
      
      if (rules.required && !value) {
        errors.push(`Row ${index + 1}: Missing required field '${field}'`);
      }
      
      if (value && rules.type && typeof value !== rules.type) {
        errors.push(`Row ${index + 1}: Field '${field}' should be ${rules.type}`);
      }
      
      if (value && rules.maxLength && String(value).length > rules.maxLength) {
        errors.push(`Row ${index + 1}: Field '${field}' exceeds max length of ${rules.maxLength}`);
      }
    }
  });
  
  return errors;
}
```

### 数据规范化输出
```javascript
// Google Sheets 原始数据 → 简化格式
[
  {
    "title": "项目名称",
    "description": "项目描述",
    "cover": "https://...",
    "tags": "标签1, 标签2",
    "date": "2025-01-20",
    "link": "https://..."
  }
]
```

### 支持的字段类型
- **string**: 文本字段
- **number**: 数字字段
- **boolean**: 布尔字段
- **url**: 链接字段
- **date**: 日期字段
- **array**: 数组字段（逗号分隔）

---

## 样式集配置系统

### 样式集 JSON 结构
```json
{
  "name": "Blog Cards",
  "description": "博客卡片样式集",
  "cssVariables": {
    "--card-bg": "#ffffff",
    "--card-text": "#1f2937",
    "--card-border": "#e5e7eb",
    "--card-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "--card-radius": "12px"
  },
  "gridConfig": {
    "columns": 3,
    "gap": "24px",
    "minWidth": "300px"
  },
  "template": "card",
  "fields": {
    "title": {
      "required": true,
      "type": "string",
      "maxLength": 100
    },
    "description": {
      "required": true,
      "type": "string",
      "maxLength": 500
    },
    "cover": {
      "required": false,
      "type": "string"
    },
    "tags": {
      "required": false,
      "type": "string"
    }
  }
}
```

### CSS Variables 应用
```css
.card {
  background: var(--card-bg);
  color: var(--card-text);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  border-radius: var(--card-radius);
}
```

---

## 自适应网格计算器

### 网格宽度公式
```javascript
// 计算单列宽度（calc() 公式）
function calculateColumnWidth(columns, gap) {
  const gapPercentage = (gap / 100) * (columns - 1);
  const widthPercentage = (100 - gapPercentage) / columns;
  return `calc(${widthPercentage}% - ${gap / columns * (columns - 1)}px)`;
}

// 生成完整的 grid CSS
function generateGridCSS(config) {
  const { columns, gap, minWidth } = config;
  const columnWidth = calculateColumnWidth(columns, gap);
  
  return `
.container {
  display: grid;
  grid-template-columns: repeat(${columns}, ${columnWidth});
  gap: ${gap}px;
}

@media (max-width: ${minWidth * columns + gap * (columns - 1)}px) {
  .container {
    grid-template-columns: repeat(auto-fit, minmax(${minWidth}px, 1fr));
  }
}
  `.trim();
}
```

### 动态网格生成示例
```javascript
// 根据列数和间距生成响应式网格
function generateResponsiveGrid(columns, gap, minWidth = 300) {
  const styles = [];
  
  for (let i = 1; i <= columns; i++) {
    const columnWidth = calculateColumnWidth(i, gap);
    const breakpoint = minWidth * i + gap * (i - 1);
    
    styles.push(`
@media (min-width: ${breakpoint}px) {
  .grid-${i}cols {
    grid-template-columns: repeat(${i}, ${columnWidth});
  }
}
    `);
  }
  
  return styles.join('\n');
}
```

---

## Handlebars 模板

### 卡片模板 (card.hbs)
```html
<div class="card">
  {{#if cover}}
  <img src="{{cover}}" class="card-cover" alt="{{title}}">
  {{/if}}
  <div class="card-content">
    <h3 class="card-title">{{title}}</h3>
    {{#if description}}
    <p class="card-description">{{description}}</p>
    {{/if}}
    {{#if tags}}
    <div class="card-tags">
      {{#splitString tags ","}}
      <span class="card-tag">{{this}}</span>
      {{/splitString}}
    </div>
    {{/if}}
  </div>
</div>
```

### 网格模板 (grid.hbs)
```html
<div class="container {{gridClass}}">
  {{#each items}}
  <div class="card">
    <img src="{{cover}}" class="card-cover" alt="{{title}}">
    <div class="card-content">
      <h4 class="card-title">{{title}}</h4>
      <p class="card-description">{{description}}</p>
    </div>
  </div>
  {{/each}}
</div>
```

---

## 关键技术实现

### HTML 解析器 (parser.js)
```javascript
const cheerio = require('cheerio');

function parseHTML(html) {
  const $ = cheerio.load(html);
  const sections = [];

  $('section').each((i, el) => {
    sections.push({
      index: i,
      html: $(el).html(),
      classes: $(el).attr('class'),
      id: $(el).attr('id')
    });
  });

  return {
    sections,
    head: $('head').html(),
    body: $('body').html()
  };
}
```

### Google Sheets 连接器 (sheets.js)
```javascript
async function loadSheetData(url, sheetName = 'Sheet1') {
  const sheetId = extractSheetId(url);
  if (!sheetId) {
    throw new Error('Invalid Google Sheets URL');
  }
  
  const raw = await fetchSheetData(sheetId, sheetName);
  const normalized = normalizeFields(raw);
  
  return normalized;
}

function extractSheetId(url) {
  const regex = /\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function fetchSheetData(sheetId, sheetName) {
  const response = await fetch(`https://opensheet.elk.sh/${sheetId}/${sheetName}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sheet data');
  }
  return await response.json();
}

function normalizeFields(data) {
  if (!data || data.length === 0) return [];
  
  return data.map(row => {
    const normalizedRow = {};
    for (const [key, value] of Object.entries(row)) {
      const normalizedKey = key
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      normalizedRow[normalizedKey] = value;
    }
    return normalizedRow;
  });
}

function validateFields(data, schema) {
  const errors = [];
  
  data.forEach((row, index) => {
    for (const [field, rules] of Object.entries(schema)) {
      const value = row[field];
      
      if (rules.required && !value) {
        errors.push(`Row ${index + 1}: Missing required field '${field}'`);
      }
      
      if (value && rules.type && typeof value !== rules.type) {
        errors.push(`Row ${index + 1}: Field '${field}' should be ${rules.type}`);
      }
      
      if (value && rules.maxLength && String(value).length > rules.maxLength) {
        errors.push(`Row ${index + 1}: Field '${field}' exceeds max length of ${rules.maxLength}`);
      }
    }
  });
  
  return errors;
}
```

### 网格计算器 (grid.js)
```javascript
function calculateColumnWidth(columns, gap) {
  const gapPercentage = (gap / 100) * (columns - 1);
  const widthPercentage = (100 - gapPercentage) / columns;
  return `calc(${widthPercentage}% - ${gap / columns * (columns - 1)}px)`;
}

function generateGridCSS(config) {
  const { columns, gap, minWidth } = config;
  const columnWidth = calculateColumnWidth(columns, gap);
  
  return `
.container {
  display: grid;
  grid-template-columns: repeat(${columns}, ${columnWidth});
  gap: ${gap}px;
}

@media (max-width: ${minWidth * columns + gap * (columns - 1)}px) {
  .container {
    grid-template-columns: repeat(auto-fit, minmax(${minWidth}px, 1fr));
  }
}
  `.trim();
}

function generateResponsiveGrid(columns, gap, minWidth = 300) {
  const styles = [];
  
  for (let i = 1; i <= columns; i++) {
    const columnWidth = calculateColumnWidth(i, gap);
    const breakpoint = minWidth * i + gap * (i - 1);
    
    styles.push(`
@media (min-width: ${breakpoint}px) {
  .grid-${i}cols {
    grid-template-columns: repeat(${i}, ${columnWidth});
  }
}
    `);
  }
  
  return styles.join('\n');
}
```

### IndexedDB 存储 (storage.js)
```javascript
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
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    return new Promise((resolve, reject) => {
      const request = store.put({ id, data, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async load(id) {
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  }
}
```

### 模板引擎 (template.js)
```javascript
const Handlebars = require('handlebars');

Handlebars.registerHelper('splitString', function(str, separator) {
  if (!str) return [];
  return str.split(separator).map(s => s.trim());
});

function renderTemplate(templatePath, data) {
  const template = fs.readFileSync(templatePath, 'utf-8');
  const compiled = Handlebars.compile(template);
  return compiled(data);
}

function applyCSSVariables(css, variables) {
  let styledCSS = css;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`var\\(${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
    styledCSS = styledCSS.replace(regex, value);
  }
  return styledCSS;
}
```

### HTML 拼接与导出 (exporter.js)
```javascript
function exportHTML(originalHTML, newSections, insertPosition) {
  const $ = cheerio.load(originalHTML);

  switch(insertPosition) {
    case 'body':
      $('body').append(newSections);
      break;
    case 'header-after':
      $('header').after(newSections);
      break;
    case 'footer-before':
      $('footer').before(newSections);
      break;
  }

  return $.html();
}

function mergeCSS(originalCSS, newCSS) {
  return `${originalCSS}\n\n/* Aura Canvas Generated Styles */\n${newCSS}`;
}
```

---

## 开发阶段

### 阶段 1: 基础框架
- [ ] 创建 HTML 界面
- [ ] 实现 HTML 文件导入
- [ ] 显示 HTML 结构树
- [ ] 实现 section 删除/保留功能

### 阶段 2: Google Sheets 集成
- [ ] 实现 Sheet ID 提取
- [ ] 实现 opensheet.elk.sh 数据读取
- [ ] 实现字段标准化
- [ ] 实现字段校验
- [ ] 实现 IndexedDB 存储

### 阶段 3: 样式集与网格
- [ ] 创建样式集 JSON 配置系统
- [ ] 实现网格计算器
- [ ] 实现 CSS Variables 应用
- [ ] 创建 Handlebars 模板
- [ ] 实现自适应渲染

### 阶段 4: 拼接与导出
- [ ] 实现 HTML 片段插入
- [ ] 保留原始样式
- [ ] 导出完整 HTML
- [ ] 测试与优化

---

## 部署方式

### 本地运行
```bash
# 1. 克隆项目
git clone https://github.com/yourusername/aura-canvas.git

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

### 单文件分发
- 打包为单 HTML 文件（包含所有 JS）
- 用户直接双击打开使用

---

## 使用流程示例

```
1. 打开 Aura Canvas
2. 导入 Aura 导出的 index.html
3. 看到 HTML 结构树，删除不需要的 section
4. 粘贴 Google Sheets URL
5. 系统自动提取 Sheet ID 并加载数据
6. 选择样式集配置（如博客卡片）
7. 调整网格参数（3列，24px间距）
8. 点击"生成并插入"
9. 预览效果，满意后点击"导出 HTML"
10. 得到包含 Sheet 数据的完整 HTML 文件
```

---

## 成功标准

| 指标 | 目标 |
|------|------|
| 核心功能可用 | ✅ |
| 支持 Google Sheets | ✅ |
| 免鉴权读取 | ✅ |
| 字段标准化 | ✅ |
| 自适应网格 | ✅ |
| HTML 导入导出 | ✅ |
| 代码量 | < 2500 行 |
| 文件大小 | < 150KB (压缩后) |

---

## 不包含的功能（明确排除）

- ❌ Notion API 集成
- ❌ Aura API 集成
- ❌ 云协作功能
- ❌ AI 增强
- ❌ 其他 CMS 支持
- ❌ 复杂的可视化拖拽编辑器
- ❌ 模板版本管理
- ❌ 批量处理多个文件
- ❌ 实时预览（使用简单刷新即可）
- ❌ 差异对比视图

---

**文档版本**: v3.0 (Google Sheets 版)
**最后更新**: 2026-01-22
**状态**: 已更新
