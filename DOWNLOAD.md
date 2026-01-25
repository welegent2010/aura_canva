# 📥 Aura Canvas v0.2.0 - 下载说明

**最新版本**: v0.2.0 (2026年1月25日)

---

## 🎯 快速下载

### 方式1: 直接下载压缩包 (推荐)

点击下载完整发布包：
**[下载 aura-canvas-v0.2.0.zip](releases/aura-canvas-v0.2.0.zip)** 

- 文件大小: ~100KB
- 包含所有必需文件
- 即开即用，无需安装

---

## 📋 安装步骤

### Windows 用户

1. **下载** `aura-canvas-v0.2.0.zip`
2. **解压** 到任意文件夹（例如：`C:\Tools\aura-canvas\`）
3. **双击运行**：
   - 方法A: 直接双击 `editor.html` 
   - 方法B: 双击 `启动服务器.bat` （推荐，提供本地服务器）

### Mac/Linux 用户

1. **下载** `aura-canvas-v0.2.0.zip`
2. **解压** 到任意文件夹
3. **打开终端**，进入解压目录
4. **启动服务器**:
   ```bash
   python3 start-server.py
   ```
5. **打开浏览器**: 访问 `http://localhost:3000/editor.html`

---

## 🚀 首次使用

启动后，你会看到 Aura Canvas 编辑器界面：

### 快速入门
1. **导入HTML** - 点击 "Import HTML" 按钮导入现有页面
2. **连接数据** - 在 "Data Source" 标签中连接Google Sheets
3. **配置网格** - 在 "Grid Config" 设置卡片布局
4. **应用样式** - 在 "Style Sets" 选择卡片样式
5. **导出结果** - 点击 "Export HTML" 保存最终页面

---

## ✨ v0.2.0 新功能

### 🎛️ 双重网格控制
- **Apply Grid Config**: 全局网格设置（列数、间距）
- **Apply Modify**: 仅调整间距（不影响结构）

### 🎨 智能样式预览
- 选择样式时自动显示第一张卡片
- 无需手动点击卡片即可预览

### 📁 自定义样式支持
- 支持加载 `style/` 文件夹中的所有JSON样式
- 通过 `manifest.json` 管理样式文件

---

## 🔧 系统要求

### 浏览器
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

### 操作系统
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (任何发行版)

### 可选依赖
- Python 3.x (如果使用 `start-server.py`)
- Node.js (如果使用 `npm start`)

---

## 📚 文档和支持

### 文档
- [完整用户手册](README.md)
- [v0.2.0 详细更新](RELEASE_v0.2_README.md)
- [更新日志](RELEASE_NOTES.md)

### 问题反馈
如遇到问题：
1. 查看浏览器控制台 (F12) 是否有错误
2. 确认浏览器版本符合要求
3. 尝试使用本地服务器而非直接打开HTML文件

---

## 🔄 从旧版本升级

### 从 v0.1 升级
✅ **完全兼容** - 直接使用新版即可

- localStorage数据会自动保留
- 无需额外配置
- 所有现有项目继续工作

### 升级建议
1. 备份当前项目（导出HTML）
2. 下载并解压v0.2.0
3. 打开 `editor.html`
4. 你的数据会自动加载

---

## 🎁 文件清单

下载包包含以下文件：

```
aura-canvas-v0.2.0/
├── editor.html                 # 主编辑器文件
├── README.md                   # 用户手册
├── RELEASE_v0.2_README.md      # 版本说明
├── package.json                # 项目配置
├── VERSION                     # 版本信息
├── 启动服务器.bat              # Windows启动脚本
├── start-server.py             # Python启动脚本
├── css/
│   └── editor.css              # 编辑器样式
├── js/
│   ├── editor.js               # 核心逻辑
│   ├── grid.js                 # 网格生成器
│   ├── sheets.js               # Google Sheets连接
│   └── style-sets.js           # 样式管理
└── style/
    ├── manifest.json           # 样式清单
    ├── card.json               # 卡片样式1
    ├── minimal-card.json       # 简约卡片
    └── testimonal.json         # 推荐卡片
```

总大小: ~100KB (未压缩)

---

## 💡 使用技巧

### 推荐工作流程
1. 先配置Grid Config (列数、间距)
2. 连接Google Sheets导入数据
3. 选择Style应用样式
4. 使用Apply Modify微调间距
5. 导出最终HTML

### 性能优化
- 使用本地服务器而非直接打开HTML
- 定期清理缓存 (Clear Storage按钮)
- 限制卡片显示数量 (Grid Config中的Max Cards)

---

## 🆕 下一版本预告 (v0.3)

计划功能：
- [ ] 拖拽卡片重新排序
- [ ] 高级颜色选择器
- [ ] 模板库
- [ ] 导出PDF功能
- [ ] 撤销/重做
- [ ] 多断点响应式预览

---

**下载遇到问题？** 请确保：
1. 网络连接正常
2. 有足够磁盘空间（至少10MB）
3. 杀毒软件未阻止下载

**立即下载**: [aura-canvas-v0.2.0.zip](releases/aura-canvas-v0.2.0.zip)

---

*Aura Canvas - 让卡片设计更简单* ✨
