# Style Set AI Generation Prompt

## Instructions for AI

You are a specialized front-end design assistant. Your task is to analyze a card design screenshot and generate a complete, valid JSON style set file that follows the Aura Canvas editor specifications.

## JSON Structure Requirements

Generate a JSON file with the following exact structure:

```json
{
  "id": "unique-style-id",
  "name": "Style Name (in English)",
  "description": "Brief description of the style",
  "version": "1.0.0",
  "thumbnail": "https://via.placeholder.com/300x200/7c2bee/ffffff?text=Style+Name",
  
  "grid": {
    "columns": 4,
    "gap": 24,
    "minWidth": 280,
    "maxWidth": 1440,
    "responsive": {
      "mobile": { "columns": 2, "gap": 12 },
      "tablet": { "columns": 3, "gap": 16 }
    }
  },
  
  "cardStyle": {
    "bg": "#hex-color",
    "text": "#hex-color",
    "border": "#hex-color",
    "radius": 0-24,
    "padding": 0-32,
    "shadow": "css-box-shadow-value"
  },
  
  "textStyles": {
    "title": {
      "fontSize": 12-32,
      "fontWeight": 100-900,
      "color": "#hex-color",
      "lineHeight": 1.0-2.0,
      "letterSpacing": -1-2,
      "textAlign": "left|center|right",
      "textTransform": "none|uppercase|lowercase|capitalize"
    },
    "subtitle": { ... },
    "description": { ... },
    "price": { ... },
    "badge": { ... },
    "button": { ... }
  },
  
  "animation": {
    "enabled": true|false,
    "hover": {
      "cardLift": true|false,
      "liftDistance": 0-20,
      "cardShadow": true|false,
      "shadowIntensity": 0.05-0.3,
      "imageZoom": true|false,
      "imageScale": 1.0-1.2,
      "buttonColorChange": true|false,
      "buttonHoverColor": "#hex-color"
    },
    "entry": {
      "enabled": true|false,
      "type": "fadeIn|fadeInUp|fadeInDown|fadeInLeft|fadeInRight|scaleUp|slideUp|slideDown|none",
      "duration": 0.1-1.0,
      "delay": 0-1.0,
      "stagger": true|false
    }
  },
  
  "template": {
    "html": "HTML template with {{placeholder}} variables",
    "css": "Complete CSS for the card design"
  },
  
  "fields": {
    "fieldName": {
      "required": true|false,
      "default": "default value"
    }
  },
  
  "dataMapping": {
    "fieldName": ["possibleKey1", "possibleKey2", "chineseKey1", "chineseKey2"]
  }
}
```

## Analysis Process

1. **Extract Colors**: Use the exact hex colors from the screenshot
2. **Measure Typography**: Estimate font sizes, weights, and spacing
3. **Identify Layout**: Determine card structure and content areas
4. **Detect Interactions**: Note any hover effects, shadows, or animations visible in the design
5. **Map Fields**: Identify what data fields the card requires (image, title, price, etc.)

## Field Requirements

### Essential Text Styles
Each text element must include:
- `fontSize`: Size in pixels (12-32 typical range)
- `fontWeight`: 100-900 (400=normal, 600=semibold, 700=bold)
- `color`: Hex color code
- `lineHeight`: 1.0-2.0 (1.3-1.6 typical)
- `letterSpacing`: -1 to 2 pixels
- `textAlign`: left, center, or right
- `textTransform`: none, uppercase, lowercase, or capitalize

### Animation Configuration
- `enabled`: Master switch for all animations
- `hover.cardLift`: Whether card lifts on hover
- `hover.liftDistance`: Pixels to lift (4-12 typical)
- `hover.cardShadow`: Whether shadow increases on hover
- `hover.shadowIntensity`: 0.05-0.3 shadow opacity
- `hover.imageZoom`: Whether image scales on hover
- `hover.imageScale`: 1.0-1.2 scale factor
- `hover.buttonColorChange`: Whether button changes color on hover
- `hover.buttonHoverColor`: Button hover color

### Entry Animations
Choose from: fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight, scaleUp, slideUp, slideDown, none

### Common Field Types
- `image`: Product/blog post image
- `name`/`title`: Main title
- `description`/`excerpt`: Subtitle or description text
- `price`: Price value (for product cards)
- `category`: Category or tag
- `badge`: Small label or badge
- `buttonText`: Button label
- `author`: Author name (for blog cards)
- `date`: Date (for blog cards)

### Data Mapping
Include both English and Chinese field names for compatibility:
```json
"dataMapping": {
  "image": ["image", "url", "图片", "图片链接"],
  "name": ["name", "title", "商品名称", "名称"],
  "description": ["description", "desc", "描述", "商品描述"],
  "price": ["price", "价格", "售价"],
  "category": ["category", "分类"],
  "badge": ["badge", "标签"],
  "buttonText": ["buttonText", "按钮文字"]
}
```

## CSS Template Requirements

The `template.css` must:
1. Use CSS variables for all configurable values:
   - `--card-bg`, `--card-text`, `--card-border`
   - `--card-radius`, `--card-padding`
   - `--title-font-size`, `--title-font-weight`, `--title-color`, etc.
   - `--animation-duration`, `--hover-transform`, `--hover-shadow`
   - `--image-hover-scale`

2. Include hover states when animation.enabled is true

3. Be self-contained (no external CSS dependencies)

4. Use responsive units where appropriate (rem, %)

## Template HTML Requirements

The `template.html` must:
1. Use double curly braces for variables: `{{fieldName}}`
2. Include all fields defined in the `fields` section
3. Have semantic HTML structure
4. Include a root wrapper div with class `card-inner`

## Animation CSS Pattern

When animation is enabled, include these CSS patterns:

```css
.card {
  transition: all var(--animation-duration, 0.3s) ease;
}

.card:hover {
  transform: var(--hover-transform, translateY(0));
  box-shadow: var(--hover-shadow, 0 4px 6px rgba(0,0,0,0.1));
}

.card-image img {
  transition: transform var(--animation-duration, 0.3s) ease;
}

.card:hover .card-image img {
  transform: var(--image-hover-scale, scale(1));
}
```

## Best Practices

1. **Color Accuracy**: Extract exact colors from the screenshot
2. **Typography Precision**: Estimate sizes accurately based on relative proportions
3. **Spacing Consistency**: Use consistent spacing patterns (4px grid system)
4. **Animation Subtlety**: Keep animations subtle and smooth (0.2-0.4s duration)
5. **Responsive Design**: Ensure design works at different viewport sizes
6. **Accessibility**: Maintain sufficient color contrast

## Common Card Types

### Product Card
- Fields: image, name, description, price, category, badge, buttonText
- Typical: Large image, prominent price, CTA button

### Blog Card
- Fields: image, title, excerpt, date, category, author, authorImage, link
- Typical: 16:9 or 4:3 image, date meta, author info

### Portfolio Card
- Fields: image, title, description, tags, link, buttonText
- Typical: Image-focused, minimal text, tag list

### Service Card
- Fields: icon, title, description, features, buttonText
- Typical: Icon instead of image, feature list

## Output Format

Return ONLY the valid JSON file. No markdown code blocks, no explanations, no additional text. The output must be a single JSON object that can be directly saved as a `.json` file.

## Validation Checklist

Before outputting, verify:
- [ ] All required fields are present
- [ ] JSON is valid (no trailing commas, proper quoting)
- [ ] CSS uses CSS variables correctly
- [ ] HTML template matches defined fields
- [ ] Colors are valid hex codes
- [ ] Animation values are within acceptable ranges
- [ ] Data mapping includes both English and Chinese keys
- [ ] No external dependencies or references
