# Tally 集成 - 完整实现总结

## 📋 功能概述

本项目现已支持在 Aura Canvas 编辑器中嵌入 Tally 表单。提供两种插入方式：

### 方法 1：直接链接（推荐）
- 粘贴 Tally 分享链接：`https://tally.so/r/abc123` 或 `https://tally.so/embed/abc123`
- 系统自动规范化 URL 并添加必要的参数
- 简单快速，推荐使用

### 方法 2：嵌入代码
- 从 Tally 复制完整的 embed 代码（包含 `<iframe>` 和 `<script>` 标签）
- 系统自动提取 iframe 标签
- 适合需要精细控制的场景

---

## 🏗️ 技术实现

### 前端 (`editor.html` 和 `js/editor.js`)

#### HTML 结构
```html
<!-- Method 1: Direct Link -->
<input type="text" id="tallyDirectUrl" placeholder="https://tally.so/r/abc123">

<!-- Method 2: Embed Code -->
<textarea id="tallyEmbedCode" placeholder="<iframe...></iframe>">

<!-- Configuration -->
<input type="number" id="tallyWidth" value="1200">
<input type="number" id="tallyPaddingTop" value="60">
<input type="number" id="tallyPaddingBottom" value="60">
<input type="number" id="tallyPaddingLeft" value="20">
<input type="number" id="tallyPaddingRight" value="20">
```

#### JavaScript 主要方法

##### 1. `addTallySection()`
- 读取两个输入字段（直接 URL 或嵌入代码）
- 调用 `normalizeTallyUrl()` 规范化 URL
- 从嵌入代码中提取 iframe（使用正则表达式）
- 创建或更新 Tally section
- 保存数据并重新渲染预览

##### 2. `normalizeTallyUrl(url)`
- **目的**：确保 Tally URL 格式一致且包含必要参数
- **处理流程**：
  1. 检查 URL 是否已包含所有必需参数（`alignLeft=1&hideTitle=1&transparentBackground=1`）
  2. 如果已有，直接返回原 URL
  3. 否则，从以下格式中提取表单 ID：
     - `https://tally.so/embed/{ID}`
     - `https://tally.so/r/{ID}`
     - `https://tally.so/{ID}`
  4. 生成标准化 URL：`https://tally.so/embed/{ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`

##### 3. `selectSection(id)` - Tally 支持
- 当选择 Tally section 时，自动填充编辑器中的所有字段
- 支持编辑现有的 Tally section

##### 4. `renderPreview()` - Tally 渲染
- 检测是否存在 Tally section
- 如果存在，注入 Tally SDK：`<script src="https://tally.so/widgets/embed.js"></script>`
- 为 URL 模式：创建带 `src` 属性的 iframe
- 为嵌入 HTML 模式：直接插入提取的 iframe 标签
- 两种模式都标记绿色虚线框（便于识别）

##### 5. `generateHtml()` - 导出
- 包含 Tally SDK 脚本
- 正确处理两种 Tally section 格式
- 保留所有配置（宽度、内边距等）

##### 6. `loadSavedData()` - 数据恢复
- 从 localStorage 加载已保存的数据
- **去重**：如果存在多个 Tally section，仅保留最后一个
- **清理**：检测并清除损坏的 URL（包含奇怪字符如 `igenLeft`、`2a1` 等）

#### Section 数据结构
```javascript
{
  id: 1234567890,
  name: "Tally Form",
  type: "tally",
  visible: true,
  url: "https://tally.so/embed/7RKXAa?...",  // 可选：直接链接模式
  embedHtml: "<iframe data-tally-src=...>",  // 可选：嵌入代码模式
  config: {
    width: 1200,
    padding: { top: 60, bottom: 60, left: 20, right: 20 }
  }
}
```

---

## 🐛 已修复的问题

### 问题 1：URL 参数重复
- **症状**：`https://tally.so/embed/7RKXAa?alignLeft=1&hideTitle=1&...?alignLeft=1&hideTitle=1&...`
- **原因**：没有检查 URL 是否已经包含必需参数
- **修复**：在 `normalizeTallyUrl()` 中添加参数检查逻辑

### 问题 2：嵌入代码未被正确提取
- **症状**：整个代码块（包括 `<script>` 标签）被插入到 iframe
- **原因**：没有使用正则表达式提取 iframe 标签
- **修复**：使用 `/data-tally-src/` 正则表达式提取 iframe

### 问题 3：重复的 Tally section
- **症状**：多次点击按钮导致多个 Tally section 被保存
- **原因**：没有去重逻辑
- **修复**：在 `loadSavedData()` 中添加去重代码

### 问题 4：Preview iframe 沙箱限制
- **症状**：Tally 资源无法在预览中加载
- **原因**：iframe 沙箱属性过于严格
- **修复**：添加 `allow-same-origin` 和 `allow-pointer-lock`

### 问题 5：Tally SDK 未注入
- **症状**：Tally 表单不显示
- **原因**：预览和导出中没有加载 Tally SDK
- **修复**：在 `renderPreview()` 和 `generateHtml()` 中条件性注入 SDK 脚本

---

## 📦 数据存储

### localStorage 结构
```javascript
{
  sections: [
    { /* Tally section */ },
    { /* Grid section */ },
    { /* Custom HTML section */ }
  ],
  styleSets: [ /* ... */ ],
  currentStyleId: "...",
  gridConfig: { /* ... */ },
  originalHead: "",
  originalHtmlClass: ""
}
```

### 清空存储
用户界面提供 "Clear Storage" 按钮，一键清空：
- localStorage
- sessionStorage
- IndexedDB (`SheetCache` 数据库)

---

## 🧪 测试方法

### 基本测试（不需要服务器）
1. 打开 `editor.html`
2. 切换到 "Tally Form Embed" 标签
3. 粘贴测试 URL 或嵌入代码
4. 点击 "Add Tally Section"
5. 检查预览中是否显示绿色虚线框

### 完整测试（需要服务器）
1. 启动 Web 服务器：`python start-server.py`
2. 访问 `http://localhost:3000/editor.html`
3. 添加 Tally section
4. 在预览中应该看到实际的 Tally 表单
5. 导出 HTML 并在浏览器中打开

---

## 📝 API 端点

### `/styles` (GET)
返回 `style/` 目录中所有可用的 JSON 样式文件列表

```bash
GET http://localhost:3000/styles
```

响应：
```json
["minimal-card", "testimonal", "card"]
```

---

## 🚀 性能优化

### 预缓存
- Google Sheets 数据使用 IndexedDB 缓存（TTL: 1小时）
- 样式文件在首次加载时获取

### 预加载
- Tally SDK 在检测到 Tally section 时才注入
- 未使用的库不加载

---

## 🔄 版本历史

### v1.0 - Tally 集成完成
- ✅ 两种插入方法（直接链接 + 嵌入代码）
- ✅ URL 规范化
- ✅ 嵌入代码提取
- ✅ 配置管理（宽度、内边距）
- ✅ 预览渲染
- ✅ HTML 导出
- ✅ 数据持久化
- ✅ 错误处理

---

## 📚 相关文件

- **主编辑器**: [`editor.html`](editor.html)
- **核心逻辑**: [`js/editor.js`](js/editor.js)
- **快速测试**: [`TALLY_QUICK_TEST.md`](TALLY_QUICK_TEST.md)
- **详细指南**: [`TALLY_TEST_GUIDE.md`](TALLY_TEST_GUIDE.md)
- **使用说明**: [`TALLY_USAGE.md`](TALLY_USAGE.md)

---

## 🎯 未来改进

- [ ] 支持多个 Tally section
- [ ] Tally 响应数据导入（CSV/JSON）
- [ ] 高级配置面板（主题、字段映射等）
- [ ] 实时预览更新
- [ ] 响应式设计预览（移动端、平板端）

---

## 💡 常见问题

**Q: 为什么预览中看不到实际的表单？**
A: 这是正常的，除非使用真实的 Web 服务器运行。本地打开 HTML 文件由于跨域限制可能无法加载 Tally SDK。

**Q: 可以添加多个 Tally 表单吗？**
A: 当前版本支持添加，但 loadSavedData() 会自动去重保留最后一个。未来版本会改进这一点。

**Q: 导出的 HTML 可以单独使用吗？**
A: 可以。导出的 HTML 包含所有必要的脚本和样式，可以直接在浏览器中打开。

**Q: 如何自定义 Tally 表单的外观？**
A: 使用"宽度"和"内边距"选项。Tally 自身的样式在其服务中配置。

---

## 🐞 已知限制

1. **跨域限制**：本地文件协议 (`file://`) 下某些资源可能无法加载
2. **单 Tally**：当前版本在 localStorage 中保留最后一个 Tally section
3. **响应式**：Tally 表单的响应式行为由 Tally 服务控制

---

## 📞 支持

如遇到问题：
1. 查看浏览器控制台中的日志（F12 → Console）
2. 参考 [`TALLY_QUICK_TEST.md`](TALLY_QUICK_TEST.md) 进行故障排除
3. 检查 Tally section 数据：
   ```javascript
   console.log(JSON.parse(localStorage.getItem('auraCanvasData')).sections.filter(s => s.type === 'tally'));
   ```
