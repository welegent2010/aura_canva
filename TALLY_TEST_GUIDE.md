# Tally 测试指南

## 准备工作

### 步骤 1：清空旧数据
1. 在编辑器中，点击右上角的 **"Clear Storage"** 按钮
2. 确认清空
3. 页面会自动刷新

### 步骤 2：打开浏览器开发者工具
按 `F12` 或 `Ctrl+Shift+I` 打开开发者工具，切换到 **Console** 标签页，这样可以看到所有的调试日志。

---

## 测试方法 1：直接链接

### 测试数据
```
URL: https://tally.so/embed/7RKXAa?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1
```

### 步骤
1. 切换到 **Tally Form Embed** 标签
2. 在 **Method 1: Direct Link** 输入框中粘贴上面的 URL
3. 保持其他输入框为默认值
4. 点击 **Add Tally Section** 按钮
5. 查看控制台输出中的日志，确认：
   - `normalizeTallyUrl input:` 显示你粘贴的 URL
   - `URL already has all parameters, returning as-is` 说明 URL 被正确识别
   - `Final embed URL:` 显示最终的 URL（应该与输入相同）
6. 在预览区域中，应该看到绿色虚线框标记的 Tally 表单
7. 打开预览 iframe 的控制台（右键 > 检查元素，找到 iframe），查看是否有错误

---

## 测试方法 2：嵌入代码

### 测试数据
```html
<iframe data-tally-src="https://tally.so/embed/7RKXAa?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="0" frameborder="0" marginheight="0" marginwidth="0" title="Registration form"></iframe>
<script>var d=document,w="https://tally.so/widgets/embed.js",l=d.getElementsByTagName("head")[0],s=d.createElement("script");s.type="text/javascript";s.async=!0;s.src=w;l.appendChild(s);</script>
```

### 步骤
1. 切换到 **Tally Form Embed** 标签
2. 点击 **Method 2: Embed HTML Code** 标签页
3. 粘贴上面的完整代码
4. 点击 **Add Tally Section** 按钮
5. 查看控制台输出中的日志，确认：
   - `=== Using embed code (Method 2) ===`
   - `Extracted iframe from embed code:` 显示提取的 iframe 标签
   - 如果看不到提取信息，可能是因为正则表达式没有匹配，查看 `Using entire embed code as-is`
6. 在预览区域中，应该看到绿色虚线框标记的 Tally 表单
7. 打开预览 iframe 的控制台，查看是否有错误

---

## 常见问题排查

### 预览中看到错误框而不是表单
- **错误信息**：红色虚线框 + "ERROR" 标签
- **原因**：URL 或 embedHtml 为空
- **解决**：
  1. 检查输入是否正确粘贴
  2. 查看控制台日志中的 "Final embed URL" 和 "embedHtml content"
  3. 如果是红色错误消息，说明两个字段都为空

### 预览中看到绿色框但表单不显示
- **可能原因**：
  1. Tally SDK 脚本没有加载
  2. iframe 的 src 属性不正确
  3. 浏览器安全策略阻止了 iframe 加载
- **解决**：
  1. 打开预览 iframe 的控制台（右键 > 检查元素）
  2. 查看 Network 标签，看是否有加载 `tally.so` 的请求
  3. 查看是否有 CORS 错误
  4. 检查 iframe sandbox 属性是否包含 `allow-same-origin`

### URL 显示为损坏（包含奇怪字符）
- **示例**：`7RKXAa2a1igenLeft=1` 而不是 `7RKXAa`
- **原因**：可能是旧的损坏数据从 localStorage 中加载
- **解决**：点击 **Clear Storage** 清空所有数据，重新加载

### 无法找到 Tally 表单 ID
- **症状**：`normalizeTallyUrl` 输出 "Could not extract form ID"
- **原因**：URL 格式不被识别
- **支持的格式**：
  - `https://tally.so/embed/7RKXAa`（带参数或不带）
  - `https://tally.so/r/7RKXAa`
  - `https://tally.so/7RKXAa`

---

## 日志关键字检查清单

### 成功迹象
- ✅ `=== Adding Tally Section ===`
- ✅ `Final embed URL:` 显示有效的 tally.so URL
- ✅ `Adding new Tally section:` 或 `Updated section:`
- ✅ `Sections count after adding/updating Tally:` 数量增加
- ✅ 预览中看到绿色虚线框
- ✅ 没有红色错误消息

### 调试信息
- 🔍 `Direct URL input:` - 检查输入的 URL
- 🔍 `Embed code input length:` - 检查代码长度
- 🔍 `normalizeTallyUrl input:` - 检查 URL 处理前的样子
- 🔍 `URL already has all parameters, returning as-is` - URL 被正确识别
- 🔍 `Extracted iframe from embed code:` - iframe 标签被成功提取

---

## 如果仍然无法工作

### 获取诊断信息
1. 打开浏览器开发者工具（F12）
2. 切换到 Console 标签
3. 执行以下命令：
```javascript
// 查看 localStorage 中的所有数据
console.log(JSON.parse(localStorage.getItem('auraCanvasData')));

// 查看特定的 Tally section
const data = JSON.parse(localStorage.getItem('auraCanvasData'));
console.log(data.sections.filter(s => s.type === 'tally'));

// 检查是否有损坏的 URL
data.sections.filter(s => s.type === 'tally').forEach(s => {
  if (s.url && (s.url.includes('igenLeft') || s.url.includes('2a1'))) {
    console.warn('CORRUPTED URL DETECTED:', s.url);
  }
});
```

### 收集日志并报告
1. 在控制台中，右键点击第一条日志 "=== Adding Tally Section ===" 或之前的日志
2. 选择 "Copy visible console contents"
3. 将日志粘贴到问题报告中

---

## 预期结果

### 使用 Direct Link 时
- 预览中应该显示一个 Tally 表单
- 表单应该可以交互（点击、输入等）
- 没有错误消息

### 使用 Embed Code 时
- 预览中应该显示同样的 Tally 表单
- 表单应该可以交互
- 没有错误消息

### 导出 HTML 时
- 导出的 HTML 应该包含：
  - Tally SDK 脚本：`<script src="https://tally.so/widgets/embed.js"></script>`
  - Tally iframe 或嵌入代码
  - 所有必要的样式和配置

---

## 联系支持
如果上述步骤都无法解决问题，请：
1. 收集控制台日志
2. 记录你的浏览器版本和操作系统
3. 提供具体的错误消息或表现
