# 项目结构说明

## 目录结构

```
html编辑器/
├── editor.html              # 编辑器主页面（入口文件）
├── index.html               # 项目首页
├── README.md                # 项目说明文档
├── AURA_CANVAS_PLANNING.md  # 项目规划文档
├── package.json             # 项目配置文件
├── 启动服务器.bat            # 启动脚本
│
├── css/                     # 样式文件目录
│   └── editor.css           # 编辑器样式
│
├── js/                      # JavaScript 文件目录
│   ├── editor.js            # 编辑器主逻辑
│   ├── grid.js              # 网格系统
│   └── sheets.js            # Google Sheets 连接器
│
├── style/                   # 样式集目录
│   ├── README.md            # 样式集使用指南
│   ├── product-card.json    # 商品卡片样式（旧格式）
│   ├── blog-card.json       # 博客卡片样式（旧格式）
│   ├── modern-product-card.json  # 现代商品卡片（新格式）
│   └── minimal-blog-card.json    # 极简博客卡片（新格式）
│
└── export/                  # 导出文件目录
    └── *.html               # 导出的 HTML 文件
```

## 核心文件说明

### editor.html
编辑器的入口页面，包含所有必要的 HTML 结构。

### js/editor.js
编辑器核心逻辑，负责：
- HTML 导入和解析
- 区块管理
- 样式集管理
- 预览渲染
- Google Sheets 数据加载

### js/grid.js
网格系统，负责：
- 生成网格 CSS
- 响应式布局
- 容器宽度控制（最大 1440px）

### js/sheets.js
Google Sheets 连接器，负责：
- 连接 Google Sheets API
- 读取表格数据
- 数据转换和处理

### style/
存放所有样式集文件，支持两种格式：

#### 旧格式（向后兼容）
```json
{
  "name": "样式名称",
  "description": "样式描述",
  "cardBg": "#ffffff",
  "cardText": "#1f2937",
  "cardBorder": "#e5e7eb",
  "cardAccent": "#7c2bee",
  "cardRadius": 12,
  "cardPadding": 16,
  "cardShadow": "md",
  "fields": {...},
  "hover": {...}
}
```

#### 新格式（推荐，支持 AI 生成）
```json
{
  "id": "样式ID",
  "name": "样式名称",
  "description": "样式描述",
  "version": "1.0.0",
  "thumbnail": "预览图URL",
  "grid": {...},
  "cardStyle": {...},
  "template": {
    "html": "...",
    "css": "..."
  },
  "fields": {...},
  "dataMapping": {...},
  "animations": {...}
}
```

详见 [style/README.md](style/README.md)

### export/
导出的 HTML 文件存放目录，导出时自动生成。

## 使用流程

1. **启动编辑器**
   - 双击 `启动服务器.bat` 或在命令行运行 `npx http-server`

2. **打开编辑器**
   - 浏览器访问 `http://localhost:8080/editor.html`

3. **导入 HTML**
   - 点击"导入 HTML"按钮选择 HTML 文件

4. **加载数据**
   - 配置 Google Sheets URL
   - 点击"加载数据"按钮

5. **应用样式**
   - 在"样式集"面板选择样式
   - 点击"应用"按钮

6. **导出结果**
   - 点击"导出 HTML"按钮
   - 导出的文件保存在 `export/` 目录

## 创建新样式集

### 方法一：手动创建

1. 在 `style/` 目录下创建新的 JSON 文件
2. 按照格式填写样式配置
3. 重启编辑器自动加载

### 方法二：AI 辅助创建

1. 准备卡片设计截图或设计稿
2. 使用 AI 识别设计并生成 JSON 样式集
3. 保存到 `style/` 目录
4. 重启编辑器自动加载

详见 [style/README.md](style/README.md)

## 技术栈

- **前端框架**: 原生 JavaScript（无框架）
- **样式**: CSS3
- **数据源**: Google Sheets API
- **本地服务器**: http-server
- **构建工具**: 无（纯静态文件）

## 开发说明

### 添加新功能

编辑 `js/editor.js` 文件，核心类是 `AuraCanvasEditor`。

### 修改样式

编辑 `css/editor.css` 文件。

### 添加新样式集

在 `style/` 目录下创建新的 JSON 文件，参考现有格式。

### 调试

打开浏览器控制台（F12）查看日志：
- 样式集加载日志
- 数据加载日志
- 图片加载日志

## 常见问题

### 样式集不加载？
检查 JSON 格式是否正确，确保文件以 `.json` 结尾。

### 图片不显示？
检查 Google Drive URL 权限，或使用其他图床（如 Supabase）。

### 导出文件在哪里？
导出的文件保存在 `export/` 目录。

### 如何自定义网格配置？
在样式集 JSON 的 `grid` 字段中配置，详见 [style/README.md](style/README.md)。

## 许可证

本项目仅供学习和个人使用。
