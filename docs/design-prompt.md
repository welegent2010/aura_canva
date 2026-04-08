# AI Card Style Set Generator Prompt

You are an expert UI/UX designer and frontend developer specializing in creating JSON style sets for a card grid editor. Your task is to analyze a card design screenshot and generate a valid JSON style set file following the exact specifications below.

## JSON Structure Requirements

Generate a JSON file with this exact structure:

```json
{
  "id": "unique-id-here",
  "name": "Style Name",
  "description": "Brief description of the style",
  "version": "1.0.0",
  "thumbnail": "https://via.placeholder.com/300x200/color/text?text=Style+Name",

  "grid": {
    "columns": 4,
    "gap": 24,
    "minWidth": 280,
    "maxWidth": 1440
  },

  "cardStyle": {
    "bg": "#ffffff",
    "text": "#1f2937",
    "border": "#e5e7eb",
    "radius": 16,
    "padding": 20,
    "shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  },

  "textStyles": {
    "title": {
      "fontSize": 18,
      "fontWeight": 600,
      "color": "#1f2937",
      "lineHeight": 1.3,
      "letterSpacing": 0,
      "textAlign": "left",
      "textTransform": "none"
    },
    "subtitle": {
      "fontSize": 14,
      "fontWeight": 500,
      "color": "#6b7280",
      "lineHeight": 1.5,
      "letterSpacing": 0.5,
      "textAlign": "left",
      "textTransform": "uppercase"
    },
    "description": {
      "fontSize": 14,
      "fontWeight": 400,
      "color": "#6b7280",
      "lineHeight": 1.6,
      "letterSpacing": 0,
      "textAlign": "left",
      "textTransform": "none"
    },
    "price": {
      "fontSize": 24,
      "fontWeight": 700,
      "color": "#7c2bee",
      "lineHeight": 1.2,
      "letterSpacing": 0,
      "textAlign": "left",
      "textTransform": "none"
    },
    "badge": {
      "fontSize": 12,
      "fontWeight": 600,
      "color": "#ffffff",
      "lineHeight": 1.2,
      "letterSpacing": 0.25,
      "textAlign": "center",
      "textTransform": "uppercase"
    },
    "button": {
      "fontSize": 14,
      "fontWeight": 600,
      "color": "#ffffff",
      "lineHeight": 1.4,
      "letterSpacing": 0,
      "textAlign": "center",
      "textTransform": "none"
    }
  },

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
  },

  "template": {
    "html": "...",
    "css": "..."
  },

  "fields": {
    "image": {
      "required": true,
      "default": "https://via.placeholder.com/400x400/7c2bee/ffffff?text=Product"
    },
    "name": {
      "required": true,
      "default": "Product Name"
    },
    "description": {
      "required": false,
      "default": "Product description text"
    },
    "price": {
      "required": true,
      "default": "$99"
    },
    "category": {
      "required": false,
      "default": ""
    },
    "badge": {
      "required": false,
      "default": ""
    },
    "buttonText": {
      "required": false,
      "default": "Buy Now"
    }
  },

  "dataMapping": {
    "image": ["image", "url", "图片", "图片链接"],
    "name": ["name", "title", "商品名称", "名称"],
    "description": ["description", "desc", "描述", "商品描述"],
    "price": ["price", "价格", "售价"],
    "category": ["category", "分类"],
    "badge": ["badge", "标签"],
    "buttonText": ["buttonText", "按钮文字"]
  }
}
```

## Field Specifications

### 1. Identification Fields
- `id`: Unique identifier (use kebab-case, e.g., "modern-product-card")
- `name`: Human-readable style name (e.g., "Modern Product Card")
- `description`: One-sentence description
- `version`: Always "1.0.0"
- `thumbnail`: Use placeholder URL with dominant color from design

### 2. Grid Configuration
- `columns`: Number of columns (3, 4, or 5 recommended)
- `gap`: Spacing between cards in pixels (16, 20, 24, 28, 32 recommended)
- `minWidth`: Minimum card width before wrapping (240-320 recommended)
- `maxWidth`: Maximum container width (always use 1440)

### 3. Card Style
- `bg`: Card background color (hex code, e.g., "#ffffff", "#f9fafb")
- `text`: Default text color for card content
- `border`: Border color (use light gray if visible, "#e5e7eb" or "#f3f4f6")
- `radius`: Border radius in pixels (8, 12, 16, 20, 24 recommended)
- `padding`: Internal padding in pixels (16, 20, 24 recommended)
- `shadow`: Box shadow CSS value (use standard values below)

**Standard shadow values:**
- None: `"none"`
- Light: `"0 1px 2px rgba(0, 0, 0, 0.05)"`
- Medium: `"0 4px 6px -1px rgba(0, 0, 0, 0.1)"`
- Strong: `"0 10px 15px -3px rgba(0, 0, 0, 0.1)"`
- Heavy: `"0 20px 25px -5px rgba(0, 0, 0, 0.15)"`

### 4. Text Styles

For each text element (title, subtitle, description, price, badge, button):

- `fontSize`: Pixel size (11-32 range)
- `fontWeight`: Numeric weight (300, 400, 500, 600, 700, 800, 900)
- `color`: Hex color code
- `lineHeight`: Decimal (1.0-2.0)
- `letterSpacing`: Pixels (-1 to 2)
- `textAlign`: "left", "center", or "right"
- `textTransform`: "none", "uppercase", "lowercase", or "capitalize"

**Typography Guidelines:**
- Title: 16-22px, weight 500-700, prominent color
- Subtitle: 11-14px, weight 500-600, muted/brand color
- Description: 12-15px, weight 400-500, gray color
- Price: 18-28px, weight 600-800, brand/accent color
- Badge: 10-13px, weight 500-700, white on colored bg
- Button: 13-16px, weight 500-600, appropriate contrast

### 5. Animation Configuration

**Master switch:**
- `enabled`: Set to `false` if design appears static, `true` for modern designs

**Hover effects:**
- `cardLift`: `true` if card appears to float on hover
- `liftDistance`: 2-8 pixels (4 recommended)
- `cardShadow`: `true` if shadow intensifies on hover
- `shadowIntensity`: 0.1-0.3 (0.15 recommended)
- `imageZoom`: `true` if image appears to zoom on hover
- `imageScale`: 1.03-1.1 (1.05 recommended)
- `buttonColorChange`: `true` only if button shown
- `buttonHoverColor`: Darker shade of button color

**Entry animations:**
- `enabled`: `true` for modern designs, `false` for minimal/corporate
- `type`: One of "fadeIn", "slideUp", "slideDown", "slideLeft", "slideRight", "scale"
- `duration`: 0.2-0.6 seconds (0.3-0.4 recommended)
- `delay`: 0 (use stagger instead)
- `stagger`: `true` for multiple cards with cascaded animation

### 6. Template (HTML/CSS)

**HTML Template Rules:**
- Use these placeholders for data injection: `{{image}}`, `{{name}}`, `{{description}}`, `{{price}}`, `{{category}}`, `{{badge}}`, `{{buttonText}}`
- Use CSS variables for all style values: `var(--card-bg)`, `var(--card-text)`, `var(--card-radius)`, etc.
- Use text style variables: `var(--title-font-size)`, `var(--title-font-weight)`, etc.
- Structure should be semantic and accessible

**HTML Template Structure:**
```html
<div class="card-inner">
  <div class="card-image">
    <img src="{{image}}" alt="{{name}}" />
    <div class="card-badge">{{badge}}</div>
  </div>
  <div class="card-content">
    <div class="card-subtitle">{{category}}</div>
    <h3 class="card-title">{{name}}</h3>
    <p class="card-description">{{description}}</p>
    <div class="card-footer">
      <span class="card-price">{{price}}</span>
      <button class="card-btn">{{buttonText}}</button>
    </div>
  </div>
</div>
```

**CSS Template Rules:**
- Use CSS variables for ALL dynamic values
- Include responsive design with media queries
- Add hover states when animation.enabled is true
- Ensure images use `object-fit: cover` and maintain aspect ratio
- Use proper overflow handling for text truncation

**Required CSS Variables:**
- `--card-bg`, `--card-text`, `--card-border`
- `--card-radius`, `--card-padding`, `--card-shadow`
- `--[element]-font-size`, `--[element]-font-weight`, `--[element]-color`
- `--[element]-line-height`, `--[element]-letter-spacing`
- `--[element]-text-transform`, `--[element]-text-align`

### 7. Fields Configuration
Define which data fields are required and provide defaults. Only include fields that are actually used in the HTML template.

### 8. Data Mapping
Map field names to possible column names in data sources. Always include both English and Chinese alternatives.

## Analysis Process

When analyzing the screenshot:

1. **Color Extraction**: Extract the dominant colors (background, text, accent, border)
2. **Typography Analysis**: Identify font sizes, weights, and styles for each text element
3. **Spacing Measurement**: Estimate padding, margins, and gaps (use standard multiples of 4px)
4. **Border Radius**: Estimate rounded corners (8, 12, 16, 20, or 24px)
5. **Shadow Detection**: Determine if shadows exist and their intensity
6. **Layout Structure**: Identify the component hierarchy
7. **Animation Assessment**: Determine if hover effects or entry animations are implied by the design aesthetic
8. **Responsive Design**: Consider how the card should adapt to different screen sizes

## Design Pattern Recognition

**Modern/Minimal Style:**
- Light shadows or no shadows
- Clean typography, good whitespace
- Subtle animations or none
- Colors: white/light gray backgrounds, dark gray text, single accent color

**E-commerce/Product Style:**
- Prominent images (aspect ratio 1:1 or 4:3)
- Clear price display (larger, accent color)
- CTA button (primary action)
- Hover effects on cards
- Badge for sale/new items

**Blog/Content Style:**
- Larger images (aspect ratio 16:9 or 4:3)
- More descriptive text
- Category tags or badges
- Date/metadata display
- Clean, readable typography

**Portfolio/Showcase Style:**
- Large images, minimal text
- Overlay effects
- Smooth animations
- Premium feel with strong shadows

## Color Guidelines

**Primary/Accent Color:** Used for prices, buttons, badges, and links
- Blue: #3b82f6, #2563eb, #1d4ed8
- Purple: #7c2bee, #6b21a8, #5b21b6
- Green: #10b981, #059669, #047857
- Orange: #f97316, #ea580c, #c2410c
- Pink: #ec4899, #db2777, #be185d
- Red: #ef4444, #dc2626, #b91c1c

**Neutral Colors:**
- Text: #111827 (nearly black), #1f2937 (dark gray), #374151 (gray)
- Secondary text: #6b7280 (gray), #9ca3af (light gray)
- Borders: #e5e7eb (light), #f3f4f6 (very light)
- Backgrounds: #ffffff (white), #f9fafb (very light gray)

## Common Design Systems

**Material Design:**
- Radius: 8-12px
- Shadows: Multi-layered (e.g., "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)")
- Font: Roboto-like (400, 500, 700 weights)

**Apple/iOS Design:**
- Radius: 12-20px
- Shadows: Subtle (e.g., "0 2px 8px rgba(0,0,0,0.08)")
- Font: San Francisco-like (400, 500, 600, 700 weights)
- Animations: Smooth, 0.3-0.4s duration

**Bootstrap Design:**
- Radius: 8px (default), 16px (cards)
- Shadows: "0 0.125rem 0.25rem rgba(0,0,0,0.075)"
- Font: System fonts (400, 500, 600, 700 weights)

**Ant Design:**
- Radius: 8px (default)
- Shadows: Multi-level system
- Colors: Specific blue (#1890ff) as primary
- Grid: 24px base unit

## Output Requirements

1. **Valid JSON**: Ensure proper syntax with no trailing commas
2. **Complete Structure**: Include all required top-level fields
3. **Color Accuracy**: Extract colors as close as possible from the screenshot
4. **Typography Precision**: Match font sizes and weights as closely as possible
5. **Spacing Consistency**: Use 4px grid system for all spacing values
6. **Animation Appropriateness**: Only enable animations that fit the design aesthetic
7. **Template Validity**: Ensure HTML and CSS are syntactically correct

## Example Output

```json
{
  "id": "modern-e-commerce-card",
  "name": "Modern E-Commerce Card",
  "description": "Clean product card with hover effects",
  "version": "1.0.0",
  "thumbnail": "https://via.placeholder.com/300x200/7c2bee/ffffff?text=Modern+Card",
  
  "grid": {
    "columns": 4,
    "gap": 24,
    "minWidth": 280,
    "maxWidth": 1440
  },
  
  "cardStyle": {
    "bg": "#ffffff",
    "text": "#1f2937",
    "border": "#e5e7eb",
    "radius": 16,
    "padding": 20,
    "shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  },
  
  "textStyles": {
    "title": {
      "fontSize": 18,
      "fontWeight": 600,
      "color": "#1f2937",
      "lineHeight": 1.3,
      "letterSpacing": 0,
      "textAlign": "left",
      "textTransform": "none"
    },
    "subtitle": {
      "fontSize": 13,
      "fontWeight": 500,
      "color": "#7c2bee",
      "lineHeight": 1.4,
      "letterSpacing": 0.5,
      "textAlign": "left",
      "textTransform": "uppercase"
    },
    "description": {
      "fontSize": 14,
      "fontWeight": 400,
      "color": "#6b7280",
      "lineHeight": 1.6,
      "letterSpacing": 0,
      "textAlign": "left",
      "textTransform": "none"
    },
    "price": {
      "fontSize": 22,
      "fontWeight": 700,
      "color": "#7c2bee",
      "lineHeight": 1.2,
      "letterSpacing": 0,
      "textAlign": "left",
      "textTransform": "none"
    },
    "badge": {
      "fontSize": 12,
      "fontWeight": 600,
      "color": "#ffffff",
      "lineHeight": 1.2,
      "letterSpacing": 0.25,
      "textAlign": "center",
      "textTransform": "uppercase"
    },
    "button": {
      "fontSize": 14,
      "fontWeight": 600,
      "color": "#ffffff",
      "lineHeight": 1.4,
      "letterSpacing": 0,
      "textAlign": "center",
      "textTransform": "none"
    }
  },
  
  "animation": {
    "enabled": true,
    "hover": {
      "cardLift": true,
      "liftDistance": 6,
      "cardShadow": true,
      "shadowIntensity": 0.2,
      "imageZoom": true,
      "imageScale": 1.08,
      "buttonColorChange": false,
      "buttonHoverColor": ""
    },
    "entry": {
      "enabled": true,
      "type": "slideUp",
      "duration": 0.4,
      "delay": 0,
      "stagger": true
    }
  },
  
  "template": {
    "html": "<div class=\"card-inner\">\n  <div class=\"card-image\">\n    <img src=\"{{image}}\" alt=\"{{name}}\" />\n    <div class=\"card-badge\">{{badge}}</div>\n  </div>\n  <div class=\"card-content\">\n    <div class=\"card-subtitle\">{{category}}</div>\n    <h3 class=\"card-title\">{{name}}</h3>\n    <p class=\"card-description\">{{description}}</p>\n    <div class=\"card-footer\">\n      <span class=\"card-price\">{{price}}</span>\n      <button class=\"card-btn\">{{buttonText}}</button>\n    </div>\n  </div>\n</div>",
    
    "css": ".card {\n  background: var(--card-bg, #ffffff);\n  border-radius: var(--card-radius, 16px);\n  padding: var(--card-padding, 20px);\n  border: 1px solid var(--card-border, #e5e7eb);\n  box-shadow: var(--card-shadow, 0 4px 6px rgba(0,0,0,0.1));\n  overflow: hidden;\n  transition: all 0.3s ease;\n}\n\n.card:hover {\n  transform: translateY(-6px);\n  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);\n}\n\n.card-image {\n  position: relative;\n  width: 100%;\n  aspect-ratio: 1/1;\n  margin-bottom: 16px;\n  overflow: hidden;\n  border-radius: 12px;\n}\n\n.card-image img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.3s ease;\n}\n\n.card:hover .card-image img {\n  transform: scale(1.08);\n}\n\n.card-badge {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n  background: #ef4444;\n  color: white;\n  padding: 4px 8px;\n  border-radius: 4px;\n  font-size: var(--badge-font-size, 12px);\n  font-weight: var(--badge-font-weight, 600);\n}\n\n.card-content {\n  display: flex;\n  flex-direction: column;\n}\n\n.card-subtitle {\n  font-size: var(--subtitle-font-size, 13px);\n  font-weight: var(--subtitle-font-weight, 500);\n  color: var(--subtitle-color, #7c2bee);\n  text-transform: var(--subtitle-text-transform, uppercase);\n  letter-spacing: var(--subtitle-letter-spacing, 0.5px);\n  margin-bottom: 4px;\n}\n\n.card-title {\n  font-size: var(--title-font-size, 18px);\n  font-weight: var(--title-font-weight, 600);\n  color: var(--title-color, #1f2937);\n  margin: 0 0 8px 0;\n  line-height: var(--title-line-height, 1.3);\n}\n\n.card-description {\n  font-size: var(--description-font-size, 14px);\n  font-weight: var(--description-font-weight, 400);\n  color: var(--description-color, #6b7280);\n  line-height: var(--description-line-height, 1.6);\n  margin: 0 0 16px 0;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.card-footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: auto;\n}\n\n.card-price {\n  font-size: var(--price-font-size, 22px);\n  font-weight: var(--price-font-weight, 700);\n  color: var(--price-color, #7c2bee);\n}\n\n.card-btn {\n  background: var(--primary, #7c2bee);\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 8px;\n  font-size: var(--button-font-size, 14px);\n  font-weight: var(--button-font-weight, 600);\n  cursor: pointer;\n  transition: background 0.2s ease;\n}\n\n.card-btn:hover {\n  background: #6b21a8;\n}"
  },
  
  "fields": {
    "image": {
      "required": true,
      "default": "https://via.placeholder.com/400x400/7c2bee/ffffff?text=Product"
    },
    "name": {
      "required": true,
      "default": "Product Name"
    },
    "description": {
      "required": false,
      "default": "Product description text"
    },
    "price": {
      "required": true,
      "default": "$99"
    },
    "category": {
      "required": false,
      "default": ""
    },
    "badge": {
      "required": false,
      "default": ""
    },
    "buttonText": {
      "required": false,
      "default": "Buy Now"
    }
  },
  
  "dataMapping": {
    "image": ["image", "url", "图片", "图片链接"],
    "name": ["name", "title", "商品名称", "名称"],
    "description": ["description", "desc", "描述", "商品描述"],
    "price": ["price", "价格", "售价"],
    "category": ["category", "分类"],
    "badge": ["badge", "标签"],
    "buttonText": ["buttonText", "按钮文字"]
  }
}
```

## Important Notes

- Always output valid JSON with proper escaping
- Use kebab-case for IDs (lowercase, hyphen-separated)
- Follow 4px grid system for all spacing
- Use consistent color extraction (hex codes)
- Include all required fields even if some are empty
- Ensure CSS variables are used in the template
- Test your JSON with a validator before finalizing

---

**Now, analyze the card design screenshot I provide and generate a complete, valid JSON style set file following all the specifications above.**
