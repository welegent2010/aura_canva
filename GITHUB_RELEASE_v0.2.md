# Aura Canvas v0.2.0 - Grid & Style Improvements

**发布日期**: 2026年1月25日

## ✨ 新功能

### 双按钮网格控制
- **Apply Grid Config**: 全局设置（列数、间距、宽度）
- **Apply Modify**: 局部调整（内边距、间距），不会创建新section

### 样式预览自动展示
- 选择样式后自动显示第一张卡片预览
- 无需手动选择右侧面板卡片
- 实时渲染样式效果

### 样式文件管理优化
- 新增 `style/manifest.json` 统一管理
- 支持用户自定义 JSON 卡片样式
- 自动加载 style 文件夹中的所有样式

## 🐛 修复的问题

- ✅ 修复 Import HTML 和 Tally 按钮需要点击两次的问题
- ✅ 修复事件监听器重复绑定（使用 cloneNode 技术）
- ✅ 修复样式下拉列表出现重复条目
- ✅ 修复 Grid Config 自动创建不必要的 section
- ✅ 修复自定义 JSON 文件无法加载的问题
- ✅ 清理 JSON 文件中的 URL 尾随空格

## 🔧 改进

- 侧边栏拖拽手柄优化（6px宽度，更好的视觉反馈）
- 更好的错误处理和缺失图片显示
- 更直观的网格配置与修改工作流
- 更清晰的样式下拉列表（仅显示真实可用样式）

## 📦 下载

### 方式一：下载 ZIP 包
点击下方 **Assets** 区域的 `aura-canvas-v0.2.0.zip` 下载完整包

### 方式二：克隆仓库
```bash
git clone https://github.com/welegent2010/aura_canva.git
cd aura_canva
git checkout v0.2.0
```

## 🚀 快速开始

1. 解压下载的文件
2. 双击 `启动服务器.bat` 或直接打开 `editor.html`
3. 开始使用！

详细说明请查看 [RELEASE_v0.2_README.md](RELEASE_v0.2_README.md)

## 📋 系统要求

- 现代浏览器（Chrome/Firefox/Safari/Edge 90+）
- 支持 ES6 的 JavaScript 环境
- 推荐使用本地服务器运行（Live Server等）

## 🔄 从 v0.1 升级

完全向后兼容！直接替换文件即可，localStorage 数据会保留。

## 📝 下一步计划 (v0.3)

- [ ] 拖拽重排卡片顺序
- [ ] 高级颜色选择器
- [ ] 预设模板库
- [ ] 导出多种格式（PDF、Figma）
- [ ] 撤销/重做功能

---

**完整更新日志**: https://github.com/welegent2010/aura_canva/blob/master/RELEASE_NOTES.md
