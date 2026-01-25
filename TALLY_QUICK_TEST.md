# 快速 Tally 测试步骤

## 1️⃣ 清空旧数据（必须做！）
- 打开 `editor.html` 
- 右上角点击 **"Clear Storage"** 按钮
- 确认并等待页面刷新

## 2️⃣ 打开开发者工具 (F12)
- 切换到 **Console** 标签页
- 这样你能看到所有调试日志

## 3️⃣ 测试 Method 1: 直接链接
1. 点击 **Tally Form Embed** 标签
2. 在 **Method 1: Direct Link** 框中粘贴：
```
https://tally.so/embed/7RKXAa?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1
```
3. 点击 **Add Tally Section** 
4. 检查日志：
   - 应该看到 `normalizeTallyUrl input: https://tally.so/embed/7RKXAa?...`
   - 应该看到 `URL already has all parameters, returning as-is`
   - 应该看到 `Final embed URL: https://tally.so/embed/7RKXAa?...`
5. 预览区应该显示绿色虚线框（表示检测到 Tally section）

## 4️⃣ 测试 Method 2: 嵌入代码
1. 点击 **Tally Form Embed** 标签
2. 清除 **Method 1** 的输入
3. 在 **Method 2: Embed HTML Code** 框中粘贴完整代码：
```html
<iframe data-tally-src="https://tally.so/embed/7RKXAa?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="0" frameborder="0" marginheight="0" marginwidth="0" title="Registration form"></iframe>
<script>var d=document,w="https://tally.so/widgets/embed.js",l=d.getElementsByTagName("head")[0],s=d.createElement("script");s.type="text/javascript";s.async=!0;s.src=w;l.appendChild(s);</script>
```
4. 点击 **Add Tally Section**
5. 检查日志：
   - 应该看到 `=== Using embed code (Method 2) ===`
   - 应该看到 `Extracted iframe from embed code:`
6. 预览区应该显示绿色虚线框

## ✅ 成功指标
- [ ] Console 中没有红色错误信息
- [ ] 看到日志 `Rendering Tally Section` 
- [ ] 预览中显示绿色虚线框和 "Tally Form" 标签
- [ ] 无法看到实际表单也没关系（Tally SDK 可能需要服务器）

## ⚠️ 常见问题
- **看不到日志**：确保你在浏览器 F12 console 中
- **看到红色错误框**：说明 URL 和代码都为空，检查输入
- **看到绿色框但没有表单**：Tally SDK 可能未加载，这是正常的（需要实际 Web 服务器）

---

完成测试后，你可以：
- 尝试导出 HTML（Export HTML 按钮）
- 验证导出的 HTML 包含 Tally SDK 脚本
- 在真实的 Web 服务器上运行测试
