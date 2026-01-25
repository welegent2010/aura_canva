# Tally Section 使用说明

## 添加 Tally 表单的两种方式

### 方式 1：直接链接（推荐）
1. 在 Tally 面板的输入框中粘贴 Tally 链接
2. 支持的链接格式：
   - `https://tally.so/r/abc123`
   - `https://tally.so/embed/abc123`
   - `https://tally.so/abc123`

示例：
```
https://tally.so/r/mJQk9v
```

### 方式 2：Embed 代码
1. 从 Tally 复制完整的 embed 代码（包含 `<iframe>` 标签）
2. 粘贴到输入框

示例：
```html
<iframe src="https://tally.so/embed/mJQk9v?alignLeft=1&hideTitle=1&transparentBackground=1" width="100%" height="500" frameborder="0" marginheight="0" marginwidth="0" title="Tally Form"></iframe>
```

## 调整边距
- **Container Width**: 表单容器宽度（320-1440px）
- **Padding Top/Bottom/Left/Right**: 上下左右边距

## 更新已有 Tally Section
1. 在左侧 Sections 列表中点击已有的 Tally section
2. 修改 Tally 面板中的链接或 embed 代码
3. 调整边距
4. 点击 "Add Tally Section" 按钮（会自动更新而不是创建新的）

## 调试
打开浏览器控制台（F12）可以看到详细日志：
- Section 数据
- URL 或 embed HTML 内容
- 渲染过程

## 常见问题
**Q: 预览时看不到表单？**
- 检查控制台是否有错误日志
- 确认输入的是有效的 Tally 链接或完整的 embed 代码
- 如果使用 embed 代码，确保包含完整的 `<iframe>` 标签

**Q: 表单高度不对？**
- 使用直接链接方式，系统会自动添加 `dynamicHeight=1` 参数
- 或在 embed 代码中手动设置 `height` 属性
