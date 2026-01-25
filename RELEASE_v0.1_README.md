# Aura Canvas v0.1 - 开发版本发布

## 快速开始

### 方式一：直接打开（推荐）
1. 下载并解压本版本
2. 直接用浏览器打开 `editor.html` 文件即可使用

### 方式二：使用本地服务器
如果你需要使用Google Sheets数据加载功能，建议使用本地服务器：

**Windows用户：**
```bash
# 双击运行
启动服务器.bat
```

**或使用Python：**
```bash
python start-server.py
```

**或使用Node.js：**
```bash
npm install
npm start
```

然后在浏览器中访问：http://localhost:3000

## 主要功能

### 1. HTML页面拼接
- 导入HTML文件进行编辑
- 动态添加/删除/编辑Section
- 实时预览

### 2. Google Sheets数据集成
- 支持加载Google Sheets数据
- 自动缓存数据，提升加载速度
- 一键清除缓存功能

### 3. Grid卡片生成
- 可配置列数、间距、卡片大小
- 支持卡片数量限制（0=无限制）
- 自动响应式布局

### 4. 样式集系统
- 支持自定义样式集
- 模板化卡片设计
- 新旧格式兼容

### 5. Tally表单嵌入
- 支持Tally表单嵌入
- 可配置容器宽度和内边距
- 自动调整表单高度

## 文件结构

```
aura-canvas-v0.1/
├── editor.html              # 主编辑器入口
├── css/
│   └── editor.css          # 样式文件
├── js/
│   ├── editor.js           # 核心编辑器逻辑
│   ├── grid.js             # Grid生成逻辑
│   ├── sheets.js           # Google Sheets集成
│   └── style-sets.js       # 样式集管理
├── style/
│   ├── STYLE_FORMAT_GUIDE.md     # 样式集格式指南
│   ├── STYLE_SET_TEMPLATE.json  # 样式集模板
│   ├── card.json                # 卡片样式示例
│   ├── card_style_testimonal.json
│   ├── minimal-card.json        # 简约卡片样式
│   └── testimonal.json          # 评价样式
├── example/
│   └── generated-page.html  # 示例生成的页面
├── start-server.py          # Python服务器脚本
├── 启动服务器.bat            # Windows启动脚本
└── README.md               # 项目说明文档
```

## 使用说明

### 加载Google Sheets数据
1. 在"Data Source"标签页中
2. 输入Google Sheet ID（URL中的ID部分）
3. 点击"Load Data"按钮
4. 数据将自动加载并生成Grid Section

### 添加Tally表单
1. 切换到"Tally Form"标签页
2. 输入Tally共享链接
3. 配置容器宽度和内边距
4. 点击"Add Tally Section"

### 配置Grid
1. 切换到"Grid Config"标签页
2. 设置列数、间距、卡片大小等参数
3. 点击"Apply Grid Config"应用配置

### 加载样式集
1. 切换到"Style Sets"标签页
2. 点击"Load Style Set"选择JSON文件
3. 应用到特定Section

## 技术栈

- 纯前端实现，无需后端
- 支持Google Sheets API
- IndexedDB本地缓存
- 响应式设计
- 跨浏览器兼容

## 注意事项

1. **CORS问题**：使用Google Sheets数据加载功能时，建议使用本地服务器，直接打开HTML文件可能会遇到CORS限制
2. **Google Sheets权限**：确保你的Sheet是公开可访问的
3. **浏览器兼容性**：推荐使用最新版本的Chrome、Firefox或Edge浏览器
4. **Tally表单**：确保Tally链接是共享链接格式

## 已知问题

- 某些特殊字符在Google Sheets中可能显示异常
- Tally表单在某些网络环境下加载较慢
- 图片URL转换需要正确的Google Drive链接格式

## 下一步计划

- [ ] 增加更多样式集模板
- [ ] 支持更多数据源（Airtable、Notion等）
- [ ] 优化性能和加载速度
- [ ] 增加更多导出格式
- [ ] 添加撤销/重做功能

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过GitHub Issues联系。
