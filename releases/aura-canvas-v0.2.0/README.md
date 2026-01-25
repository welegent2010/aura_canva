# Aura Canvas - 可视化编辑器

**当前版本**: v0.2.0 (2026年1月25日)

一款轻量化的HTML拼接与动态制卡工具，专为Aura.build生态系统优化。

## 🚀 快速开始

### 启动方式

**最简单的方式：直接打开**
- 双击 `editor.html` 文件即可开始使用

**使用本地服务器（推荐用于开发）**
- 双击运行 `启动服务器.bat` 文件
- 在浏览器访问：`http://localhost:3000/editor.html`

## ✨ 核心功能

### 1. HTML 导入与解析
- 支持导入 Aura 导出的 HTML 文件
- 自动解析并拆分为可编辑的 Sections
- 支持拖拽排序、显示/隐藏、编辑、删除

### 2. Google Sheets 数据连接
- 免鉴权读取 Google Sheets 数据
- 自动字段标准化与验证
- 本地缓存提升加载速度
- 数据预览表格展示

### 3. 网格配置系统
- 自适应 CSS Grid 布局
- 可调节列数、间距、最小/最大宽度
- 响应式断点自动生成
- 实时预览网格效果

### 4. 样式集管理
- 可视化颜色选择器
- 圆角、内边距、阴影强度调节
- 保存多个样式集
- 快速应用不同样式

### 5. 实时预览
- 桌面/平板/手机三种预览模式
- 即时渲染效果
- 支持手动刷新

### 6. 导出功能
- 导出为完整 HTML 文件
- 导出项目配置（JSON）
- 所有样式和配置包含在内

## 📖 使用指南

### 第一步：导入 HTML
1. 点击顶部"导入 HTML"按钮
2. 选择 Aura 导出的 HTML 文件
3. 编辑器会自动解析并拆分为 Sections

### 第二步：连接数据源（可选）
1. 切换到"数据源"标签页
2. 输入 Google Sheets URL
3. 确保 Sheet 已设置为"任何知道链接的人都可以查看"
4. 点击"加载数据"

**数据格式要求：**
```
Title       Description              Cover                        Tags
项目1       这是项目1的描述         https://example.com/img1.jpg  设计,开发
项目2       这是项目2的描述         https://example.com/img2.jpg  营销,运营
```

### 第三步：配置网格
1. 选择一个 Section
2. 切换到"网格配置"标签页
3. 调整列数、间距、宽度参数
4. 点击"应用网格配置"

### 第四步：自定义样式
1. 切换到"样式集"标签页
2. 配置颜色、圆角、阴影等
3. 输入样式集名称
4. 点击"保存样式集"
5. 点击"应用"使用样式

### 第五步：预览与导出
1. 使用顶部工具栏切换预览尺寸
2. 点击"刷新预览"查看最新效果
3. 点击"导出 HTML"下载最终文件

## 🎨 界面说明

### 侧边栏标签
- **Sections**: 管理页面区块，支持排序、编辑、删除
- **数据源**: 连接 Google Sheets，加载数据
- **网格配置**: 设置网格布局参数
- **样式集**: 创建和管理自定义样式

### 顶部工具栏
- **新建项目**: 清空当前项目
- **导入 HTML**: 导入 Aura 导出的 HTML
- **导出 HTML**: 导出最终 HTML 文件

### 预览工具栏
- **桌面/平板/手机**: 切换预览尺寸
- **刷新预览**: 重新渲染预览
- **导出项目**: 导出项目配置文件

## 🔧 技术栈

- **前端框架**: 原生 JavaScript (ES6+)
- **CSS**: 原生 CSS3 + CSS Variables
- **数据连接**: opensheet.elk.sh (免鉴权)
- **本地存储**: IndexedDB + localStorage
- **拖拽排序**: Sortable.js
- **HTML解析**: DOMParser API

## 📁 项目结构

```
e:\Do\html编辑器\
├── editor.html           # 主编辑器入口
├── css/
│   └── editor.css        # 编辑器样式
├── js/
│   ├── sheets.js         # Google Sheets 连接器
│   ├── grid.js           # CSS Grid 生成器
│   └── editor.js         # 编辑器核心逻辑
├── index.html            # 简单示例（已废弃）
├── 启动服务器.bat        # 启动脚本
└── README.md            # 本文件
```

## ⚠️ 注意事项

### Google Sheets 权限设置
1. 打开您的 Google Sheet
2. 点击右上角"共享"按钮
3. 设置为"任何知道链接的人都可以查看"
4. 复制并粘贴到编辑器

### 数据字段映射
编辑器会自动识别以下字段：
- `Title` / `标题`: 卡片标题
- `Description` / `描述`: 卡片描述
- `Cover` / `Image` / `图片`: 封面图片
- `Tags` / `标签`: 标签（用逗号分隔）

### 导出的 HTML
- 包含完整的样式定义
- 可直接在浏览器中打开
- 可部署到任何静态托管服务

## 🐛 故障排除

**问题1：无法加载 Google Sheets 数据**
- 检查 URL 格式是否正确
- 确认 Sheet 已设置为公开访问
- 检查网络连接

**问题2：导入 HTML 后无内容**
- 确认 HTML 文件格式正确
- 检查文件是否包含有效的 HTML 结构
- 尝试用浏览器打开原始 HTML 确认

**问题3：预览样式不正确**
- 确保浏览器支持 CSS Grid
- 尝试刷新页面
- 检查是否应用了样式集

**问题4：导出的 HTML 无法正常显示**
- 确保图片链接可公开访问
- 检查是否有外部资源被阻止

## 🎯 使用场景

- Aura 导出内容的批量修改
- 网页片段的拼接与重组
- Google Sheets 数据的可视化展示
- 响应式卡片的快速生成
- 样式统一化与标准化

## 📝 开发计划

- [ ] 支持导入 Aura 项目配置
- [ ] 更多预设样式模板
- [ ] 支持自定义 CSS 类名
- [ ] 导出为 React/Vue 组件
- [ ] 云端项目保存
- [ ] 团队协作功能

## 📄 许可证

MIT License

---

**Aura Canvas** - 让 HTML 编辑更简单

<a href="https://www.buymeacoffee.com/xiaodong"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=xiaodong&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
