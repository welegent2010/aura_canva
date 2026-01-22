# 样式集使用指南

## 目录结构

```
style/
├── README.md                  # 本文件
├── product-card.json          # 商品卡片样式（旧格式，向后兼容）
├── blog-card.json             # 博客卡片样式（旧格式，向后兼容）
├── modern-product-card.json   # 现代商品卡片（新格式，推荐）
└── minimal-blog-card.json     # 极简博客卡片（新格式，推荐）
```

## 样式集文件格式

样式集使用 **JSON** 格式，包含以下结构：

### 基本信息字段

```json
{
  "id": "样式集唯一ID",
  "name": "样式集显示名称",
  "description": "样式集描述",
  "version": "1.0.0",
  "thumbnail": "预览缩略图URL"
}
```

### 网格配置（grid）

控制卡片的布局和响应式行为：

```json
{
  "grid": {
    "columns": 4,              // 桌面端列数
    "gap": 24,                // 卡片间距（px）
    "minWidth": 280,          // 卡片最小宽度（px）
    "maxWidth": 1440,         // 容器最大宽度（px）
    "responsive": {
      "mobile": {             // 手机端（≤599px）
        "columns": 2,
        "gap": 12
      },
      "tablet": {             // 平板端（600-1023px）
        "columns": 3,
        "gap": 16
      }
    }
  }
}
```

### 卡片样式（cardStyle）

卡片的基本样式属性：

```json
{
  "cardStyle": {
    "bg": "#ffffff",          // 背景色
    "text": "#1f2937",        // 文字颜色
    "border": "#e5e7eb",      // 边框颜色
    "radius": 16,             // 圆角大小（px）
    "padding": 20,            // 内边距（px）
    "shadow": "0 4px 6px rgba(0,0,0,0.1)"  // 阴影
  }
}
```

### 模板配置（template）

这是样式集的核心，定义卡片的结构和样式：

#### HTML 模板

使用 `{{字段名}}` 作为变量占位符：

```json
{
  "template": {
    "html": "<div class=\"card-inner\">
  <img src=\"{{image}}\" alt=\"{{name}}\" />
  <h3>{{name}}</h3>
  <p>{{description}}</p>
  <span class=\"price\">{{price}}</span>
</div>"
  }
}
```

#### CSS 样式

定义模板中使用的CSS类：

```json
{
  "template": {
    "css": ".card-inner {
  padding: 16px;
}
.card-inner img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 8px;
}
.card-inner h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 12px 0 8px;
}
.card-inner .price {
  font-size: 20px;
  font-weight: 700;
  color: #7c2bee;
}"
  }
}
```

### 字段定义（fields）

定义卡片需要的所有数据字段：

```json
{
  "fields": {
    "image": {
      "required": true,
      "default": "https://via.placeholder.com/400x400"
    },
    "name": {
      "required": true,
      "default": "商品名称"
    },
    "price": {
      "required": true,
      "default": "¥99"
    }
  }
}
```

### 数据映射（dataMapping）

定义 Google Sheets 列名到模板字段的映射：

```json
{
  "dataMapping": {
    "image": ["image", "url", "图片", "图片链接"],
    "name": ["name", "title", "商品名称", "名称"],
    "price": ["price", "价格", "售价"]
  }
}
```

系统会自动查找匹配的列名，优先级从前到后。

### 动画效果（animations）

```json
{
  "animations": {
    "entry": "fadeInUp",    // 入场动画
    "hover": "lift"         // 悬停效果
  }
}
```

## 如何制作新样式集

### 方法一：使用 AI 辅助制作

1. **准备参考图片**
   - 找到你想模仿的卡片设计截图
   - 或者在 Figma/Sketch 等工具中设计好卡片

2. **使用 AI 识别**
   - 将设计图发送给 AI（如 Claude、GPT-4V 等）
   - 提示词示例：
   ```
   请分析这个卡片设计，提取以下信息：
   1. HTML 结构（使用 {{字段名}} 作为变量）
   2. CSS 样式代码
   3. 需要哪些数据字段
   4. 适合的网格配置（列数、间距等）
   
   输出格式：完整的 JSON 样式集文件
   ```

3. **调整和测试**
   - 将生成的 JSON 保存到 `style/` 文件夹
   - 重启编辑器查看效果
   - 根据需要微调

### 方法二：手动创建

1. **复制模板**
   ```bash
   cp style/modern-product-card.json style/your-style.json
   ```

2. **修改基本信息**
   ```json
   {
     "id": "your-style",
     "name": "你的样式名称",
     "description": "样式描述"
   }
   ```

3. **编写 HTML 模板**
   - 使用 `{{变量名}}` 占位符
   - 保持结构清晰
   - 使用有意义的 class 名称

4. **编写 CSS**
   - 使用 CSS 变量方便主题切换
   - 添加 hover 效果
   - 确保响应式兼容

5. **定义字段和映射**
   - 列出所有需要的字段
   - 设置默认值
   - 添加常见的中文列名映射

## 样式集加载

编辑器启动时会自动加载 `style/` 文件夹下所有 `.json` 文件。

### 向后兼容

- **旧格式**（如 `product-card.json`）：仍然支持，使用默认渲染器
- **新格式**（如 `modern-product-card.json`）：支持自定义 HTML/CSS 模板

## 最佳实践

### HTML 模板

✅ **推荐做法：**
- 使用语义化标签（`<article>`, `<section>`, `<header>`）
- 保持结构扁平，避免过度嵌套
- 使用清晰的 class 命名

❌ **避免：**
- 使用内联样式（应该放到 CSS 中）
- 使用 JavaScript 代码（编辑器暂不支持）
- 使用外部资源链接（图片除外）

### CSS 样式

✅ **推荐做法：**
- 使用 CSS 变量（`var(--card-bg)`）
- 使用相对单位（`rem`, `%`, `em`）
- 添加过渡动画（`transition`）
- 保持响应式友好

❌ **避免：**
- 使用 `!important`（除非必要）
- 使用固定宽度（应使用百分比或 flex/grid）
- 使用过于复杂的 CSS 特性

### 数据映射

✅ **推荐做法：**
- 提供多个可能的列名
- 包含中英文变体
- 按优先级排序

```json
{
  "dataMapping": {
    "image": ["image", "url", "图片", "图片链接", "cover", "thumbnail"]
  }
}
```

## 调试技巧

### 1. 查看控制台

样式集加载错误会显示在浏览器控制台（F12）：
```
[Style Loader] Error loading style: your-style.json
```

### 2. 验证 JSON

使用在线工具验证 JSON 格式：
- https://jsonlint.com/

### 3. 测试模板

创建测试数据验证模板：

```json
{
  "image": "https://via.placeholder.com/400x400",
  "name": "测试商品",
  "price": "¥199",
  "description": "这是一个测试描述"
}
```

## 示例样式集

### 商品卡片系列

1. `product-card.json` - 基础商品卡片
2. `modern-product-card.json` - 现代商品卡片

### 博客卡片系列

1. `blog-card.json` - 基础博客卡片
2. `minimal-blog-card.json` - 极简博客卡片

## 常见问题

### Q: 样式集不显示？
A: 检查 JSON 格式是否正确，字段名是否匹配。

### Q: 图片不显示？
A: 确认 Google Drive URL 权限已开启，或使用 Supabase 等外部图床。

### Q: 卡片样式混乱？
A: 检查 CSS 选择器是否正确，避免与全局样式冲突。

### Q: 响应式不生效？
A: 检查 `grid.responsive` 配置和 CSS 媒体查询。

## 进阶技巧

### 1. 使用 CSS 变量

```css
.card {
  background: var(--card-bg, #ffffff);
  color: var(--card-text, #1f2937);
}
```

### 2. 添加徽章/标签

```html
<div class="card-badge {{badgeClass}}">{{badge}}</div>
```

```css
.card-badge.new {
  background: #10b981;
}
.card-badge.hot {
  background: #ef4444;
}
```

### 3. 悬停动画

```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px rgba(0,0,0,0.15);
}
```

## 技术支持

如有问题，请查看：
- 编辑器控制台日志
- 样式集文件格式检查
- Google Sheets 数据格式验证
