# Style JSON Format Guide

样式 JSON 文件定义了卡片的样式、布局和模板。本文档说明如何创建和修改样式 JSON 文件。

## 文件位置

样式文件应该放在 `style/` 目录下，文件名建议使用英文描述，例如：
- `minimal-card.json` - 简约卡片样式
- `testimonal.json` - 评价卡片样式
- `elegant-product.json` - 优雅商品样式

## JSON 结构

样式 JSON 文件必须包含以下顶级字段：

### 1. 基本信息

```json
{
  "id": "unique-style-id",
  "name": "Style Name",
  "description": "Style description",
  "version": "1.0.0",
  "thumbnail": "https://example.com/thumbnail.jpg"
}
```

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| id | string | 是 | 唯一标识符，建议使用 kebab-case 格式 |
| name | string | 是 | 样式名称，将在下拉框中显示 |
| description | string | 否 | 样式描述 |
| version | string | 否 | 版本号 |
| thumbnail | string | 否 | 预览图 URL |

### 2. Grid 网格设置

```json
{
  "grid": {
    "columns": 4,
    "gap": 24,
    "minWidth": 280,
    "maxWidth": 1440,
    "responsive": {
      "mobile": { "columns": 2, "gap": 12 },
      "tablet": { "columns": 3, "gap": 16 }
    }
  }
}
```

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| columns | number | 是 | 默认列数 |
| gap | number | 是 | 卡片间距（像素） |
| minWidth | number | 是 | 最小卡片宽度（像素） |
| maxWidth | number | 是 | 最大容器宽度（像素） |
| responsive | object | 否 | 响应式设置 |

### 3. cardStyle 卡片样式

```json
{
  "cardStyle": {
    "bg": "#ffffff",
    "text": "#1f2937",
    "border": "#e5e7eb",
    "radius": 16,
    "padding": 20,
    "shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  }
}
```

**重要提示**：`cardStyle` 中的属性会被映射到顶级样式属性，用于 CSS 变量注入：

| cardStyle 字段 | 映射到顶级字段 | 说明 |
|----------------|----------------|------|
| bg | cardBg | 卡片背景色 |
| text | cardText | 文字颜色 |
| border | cardBorder | 边框颜色 |
| radius | cardRadius | 圆角大小 |
| padding | cardPadding | 内边距 |
| shadow | cardShadow | 阴影效果 |

### 4. textStyles 文字样式

```json
{
  "textStyles": {
    "title": {
      "fontSize": 18,
      "fontWeight": "600",
      "color": "#1f2937",
      "lineHeight": 1.3,
      "letterSpacing": 0,
      "textAlign": "left",
      "textTransform": "none"
    },
    "subtitle": {
      "fontSize": 14,
      "fontWeight": "500",
      "color": "#6b7280",
      "lineHeight": 1.5,
      "letterSpacing": 0.5,
      "textAlign": "left",
      "textTransform": "uppercase"
    },
    "description": {
      "fontSize": 14,
      "fontWeight": "400",
      "color": "#6b7280",
      "lineHeight": 1.6,
      "letterSpacing": 0,
      "textAlign": "left",
      "textTransform": "none"
    },
    "price": {
      "fontSize": 24,
      "fontWeight": "700",
      "color": "#7c2bee",
      "lineHeight": 1.2,
      "letterSpacing": 0,
      "textAlign": "left",
      "textTransform": "none"
    }
  }
}
```

| 文字类型 | 说明 |
|---------|------|
| title | 标题样式 |
| subtitle | 副标题样式 |
| description | 描述文本样式 |
| price | 价格样式 |
| badge | 标签样式 |
| button | 按钮样式 |

每个文字样式包含以下字段：
- fontSize: 字体大小（像素）
- fontWeight: 字体粗细（100-900）
- color: 文字颜色（HEX 值）
- lineHeight: 行高（数字）
- letterSpacing: 字间距（像素）
- textAlign: 对齐方式（left/center/right）
- textTransform: 文字转换（none/uppercase/lowercase/capitalize）

### 5. animation 动画设置

```json
{
  "animation": {
    "enabled": true,
    "hover": {
      "cardLift": true,
      "liftDistance": 4,
      "cardShadow": true,
      "shadowIntensity": 0.15,
      "imageZoom": true,
      "imageScale": 1.05,
      "buttonColorChange": false,
      "buttonHoverColor": "#6b21a8"
    },
    "entry": {
      "enabled": true,
      "type": "fadeInUp",
      "duration": 0.3,
      "delay": 0,
      "stagger": true
    }
  }
}
```

| hover 动画字段 | 说明 |
|----------------|------|
| cardLift | 悬停时卡片上浮 |
| liftDistance | 上浮距离（像素） |
| cardShadow | 悬停时阴影变化 |
| shadowIntensity | 阴影强度（0-1） |
| imageZoom | 图片缩放 |
| imageScale | 缩放比例 |
| buttonColorChange | 按钮颜色变化 |
| buttonHoverColor | 悬停按钮颜色 |

| entry 动画字段 | 说明 |
|-----------------|------|
| enabled | 是否启用入场动画 |
| type | 动画类型（fadeInUp/fadeIn/slideUp） |
| duration | 动画时长（秒） |
| delay | 延迟时间（秒） |
| stagger | 是否错开显示 |

### 6. template 模板

```json
{
  "template": {
    "html": "<div class=\"card-inner\">\n  <div class=\"card-image\">\n    <img src=\"{{image}}\" alt=\"{{name}}\" />\n  </div>\n  <div class=\"card-content\">\n    <h3 class=\"card-title\">{{name}}</h3>\n    <p class=\"card-description\">{{description}}</p>\n    <span class=\"card-price\">{{price}}</span>\n  </div>\n</div>",
    "css": ".card {\n  background: var(--card-bg, #ffffff);\n  border-radius: var(--card-radius, 16px);\n  padding: var(--card-padding, 20px);\n  border: 1px solid var(--card-border, #e5e7eb);\n}\n..."
  }
}
```

**HTML 模板说明**：
- 使用 `{{字段名}}` 作为占位符
- 字段名必须与 Google Sheet 列名匹配
- 必须使用 `\n` 表示换行

**CSS 样式说明**：
- 使用 CSS 变量实现动态样式
- 变量格式：`var(--变量名, 默认值)`
- 常用变量：
  - `--card-bg`: 卡片背景
  - `--card-radius`: 圆角
  - `--card-padding`: 内边距
  - `--card-border`: 边框颜色
  - `--card-shadow`: 阴影
  - `--title-font-size`: 标题字号
  - `--description-color`: 描述颜色
  - 等等...

### 7. fields 字段定义

```json
{
  "fields": {
    "image": {
      "required": true,
      "default": "https://via.placeholder.com/400x400"
    },
    "name": {
      "required": true,
      "default": "Product Name"
    },
    "description": {
      "required": false,
      "default": "Product description"
    },
    "price": {
      "required": true,
      "default": "$99"
    }
  }
}
```

| 字段 | 说明 |
|------|------|
| required | 是否必需字段 |
| default | 默认值（当数据缺失时使用） |

### 8. dataMapping 数据映射

```json
{
  "dataMapping": {
    "image": ["image", "url", "图片", "图片链接"],
    "name": ["name", "title", "商品名称", "名称"],
    "description": ["description", "desc", "描述", "商品描述"],
    "price": ["price", "价格", "售价"]
  }
}
```

| 说明 |
|------|
| 定义字段可能的列名（中英文） |
| 系统会按顺序查找匹配的列 |
| 支持中文列名 |

## 完整示例：商品卡片样式

```json
{
  "id": "minimal-card",
  "name": "Minimal Product Card",
  "description": "Clean and simple product card with top-bottom layout",
  "version": "1.0.0",
  "thumbnail": "https://via.placeholder.com/300x200/7c2bee/ffffff?text=Minimal+Card",
  
  "grid": {
    "columns": 4,
    "gap": 24,
    "minWidth": 300,
    "maxWidth": 1200
  },
  
  "cardStyle": {
    "bg": "#ffffff",
    "text": "#1f2937",
    "border": "#f3f4f6",
    "radius": 8,
    "padding": 16,
    "shadow": "0 1px 3px rgba(0,0,0,0.1)"
  },
  
  "textStyles": {
    "title": {
      "fontSize": 16,
      "fontWeight": "600",
      "color": "#1f2937",
      "lineHeight": 1.4
    },
    "description": {
      "fontSize": 14,
      "fontWeight": "400",
      "color": "#6b7280",
      "lineHeight": 1.6
    },
    "price": {
      "fontSize": 18,
      "fontWeight": "700",
      "color": "#7c2bee",
      "lineHeight": 1.2
    }
  },
  
  "animation": {
    "enabled": true,
    "hover": {
      "cardLift": true,
      "liftDistance": 4,
      "cardShadow": true,
      "shadowIntensity": 0.1,
      "imageZoom": true,
      "imageScale": 1.05
    },
    "entry": {
      "enabled": false
    }
  },
  
  "template": {
    "html": "<div class=\"card-inner\">\n  <div class=\"card-image\">\n    <img src=\"{{image}}\" alt=\"{{name}}\" />\n  </div>\n  <div class=\"card-content\">\n    <h3 class=\"card-title\">{{name}}</h3>\n    <p class=\"card-description\">{{description}}</p>\n    <span class=\"card-price\">{{price}}</span>\n  </div>\n</div>",
    "css": ".card {\n  background: var(--card-bg, #ffffff);\n  border-radius: var(--card-radius, 8px);\n  padding: var(--card-padding, 16px);\n  border: 1px solid var(--card-border, #f3f4f6);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n\n.card-image {\n  width: 100%;\n  aspect-ratio: 1/1;\n  margin-bottom: 12px;\n  overflow: hidden;\n  border-radius: 4px;\n}\n\n.card-image img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.3s ease;\n}\n\n.card:hover .card-image img {\n  transform: scale(1.05);\n}\n\n.card-content {\n  display: flex;\n  flex-direction: column;\n}\n\n.card-title {\n  font-size: var(--title-font-size, 16px);\n  font-weight: var(--title-font-weight, 600);\n  color: var(--title-color, #1f2937);\n  margin: 0 0 8px 0;\n  line-height: var(--title-line-height, 1.4);\n}\n\n.card-description {\n  font-size: var(--description-font-size, 14px);\n  font-weight: var(--description-font-weight, 400);\n  color: var(--description-color, #6b7280);\n  line-height: var(--description-line-height, 1.6);\n  margin: 0 0 12px 0;\n  flex: 1;\n}\n\n.card-price {\n  font-size: var(--price-font-size, 18px);\n  font-weight: var(--price-font-weight, 700);\n  color: var(--price-color, #7c2bee);\n}"
  },
  
  "fields": {
    "image": {
      "required": true,
      "default": "https://via.placeholder.com/400x400"
    },
    "name": {
      "required": true,
      "default": "Product Name"
    },
    "description": {
      "required": false,
      "default": "Product description"
    },
    "price": {
      "required": true,
      "default": "$99"
    }
  },
  
  "dataMapping": {
    "image": ["image", "url", "图片", "图片链接"],
    "name": ["name", "title", "商品名称", "名称"],
    "description": ["description", "desc", "描述", "商品描述"],
    "price": ["price", "价格", "售价"]
  }
}
```

## 布局类型说明

### 1. 上下布局（商品卡片）
```css
.card {
  display: flex;
  flex-direction: column;
}
```

### 2. 左右布局（评价卡片）
```css
.card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
```

## CSS 变量完整列表

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| --card-bg | #ffffff | 卡片背景 |
| --card-text | #1f2937 | 默认文字颜色 |
| --card-border | #e5e7eb | 边框颜色 |
| --card-radius | 12px | 圆角 |
| --card-padding | 20px | 内边距 |
| --card-shadow | 0 4px 6px rgba(0,0,0,0.1) | 阴影 |
| --title-font-size | 18px | 标题字号 |
| --title-font-weight | 600 | 标题字重 |
| --title-color | #1f2937 | 标题颜色 |
| --title-line-height | 1.3 | 标题行高 |
| --subtitle-font-size | 14px | 副标题字号 |
| --subtitle-font-weight | 500 | 副标题字重 |
| --subtitle-color | #6b7280 | 副标题颜色 |
| --description-font-size | 14px | 描述字号 |
| --description-font-weight | 400 | 描述字重 |
| --description-color | #6b7280 | 描述颜色 |
| --price-font-size | 24px | 价格字号 |
| --price-font-weight | 700 | 价格字重 |
| --price-color | #7c2bee | 价格颜色 |
| --badge-font-size | 12px | 标签字号 |
| --badge-font-weight | 600 | 标签字重 |
| --button-font-size | 14px | 按钮字号 |
| --button-font-weight | 600 | 按钮字重 |
| --animation-duration | 0.3s | 动画时长 |
| --hover-transform | translateY(0) | 悬停变换 |
| --hover-shadow | 0 4px 6px rgba(0,0,0,0.1) | 悬停阴影 |
| --image-hover-scale | scale(1) | 图片悬停缩放 |

## 常见问题

**Q: 为什么我的样式没有生效？**
A: 请确保：
1. `cardStyle` 中的属性值正确
2. CSS 中使用了正确的变量名
3. JSON 文件格式正确（没有语法错误）

**Q: 如何支持中文字段名？**
A: 在 `dataMapping` 中添加中文列名即可，系统会自动匹配。

**Q: 可以自定义更多字段吗？**
A: 可以，在 `template.html`、`fields` 和 `dataMapping` 中添加新字段即可。
