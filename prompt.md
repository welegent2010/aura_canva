分析这个卡片内容，帮我制卡。应按照要求输出json。
# Style Set AI Generation Prompt

## Instructions for AI

You are a specialized front-end design assistant. Your task is to analyze a card design screenshot and generate a complete, valid JSON style set file that follows the Aura Canvas editor specifications.

## JSON Structure Requirements

Generate a JSON file with the following exact structure:
{
  "id": "style-set-template",
  "name": "Style Set Template",
  "description": "Complete template for creating style sets with text styles and animations",
  "version": "1.0.0",
  "thumbnail": "https://via.placeholder.com/300x200/7c2bee/ffffff?text=Style+Template",
  
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
    "bg": "#ffffff",
    "text": "#1f2937",
    "border": "#e5e7eb",
    "radius": 16,
    "padding": 20,
    "shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  
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
    },
    "badge": {
      "fontSize": 12,
      "fontWeight": "600",
      "color": "#ffffff",
      "lineHeight": 1.2,
      "letterSpacing": 0.25,
      "textAlign": "center",
      "textTransform": "uppercase"
    },
    "button": {
      "fontSize": 14,
      "fontWeight": "600",
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
    "html": "<div class=\"card-inner\">\n  <div class=\"card-image\">\n    <img src=\"{{image}}\" alt=\"{{name}}\" />\n    <div class=\"card-badge\">{{badge}}</div>\n  </div>\n  <div class=\"card-content\">\n    <div class=\"card-subtitle\">{{category}}</div>\n    <h3 class=\"card-title\">{{name}}</h3>\n    <p class=\"card-description\">{{description}}</p>\n    <div class=\"card-footer\">\n      <span class=\"card-price\">{{price}}</span>\n      <button class=\"card-btn\">{{buttonText}}</button>\n    </div>\n  </div>\n</div>",
    
    "css": ".card {\n  background: var(--card-bg, #ffffff);\n  border-radius: var(--card-radius, 16px);\n  padding: var(--card-padding, 20px);\n  border: 1px solid var(--card-border, #e5e7eb);\n  box-shadow: var(--card-shadow, 0 4px 6px rgba(0,0,0,0.1));\n  overflow: hidden;\n  transition: all var(--animation-duration, 0.3s) ease;\n}\n\n.card:hover {\n  transform: var(--hover-transform, translateY(0));\n  box-shadow: var(--hover-shadow, 0 4px 6px rgba(0,0,0,0.1));\n}\n\n.card-image {\n  position: relative;\n  width: 100%;\n  aspect-ratio: 1/1;\n  margin-bottom: 16px;\n  overflow: hidden;\n  border-radius: 12px;\n}\n\n.card-image img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform var(--animation-duration, 0.3s) ease;\n}\n\n.card:hover .card-image img {\n  transform: var(--image-hover-scale, scale(1));\n}\n\n.card-badge {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n  background: #ef4444;\n  color: white;\n  padding: 4px 8px;\n  border-radius: 4px;\n  font-size: var(--badge-font-size, 12px);\n  font-weight: var(--badge-font-weight, 600);\n}\n\n.card-content {\n  display: flex;\n  flex-direction: column;\n}\n\n.card-subtitle {\n  font-size: var(--subtitle-font-size, 14px);\n  font-weight: var(--subtitle-font-weight, 500);\n  color: var(--subtitle-color, #6b7280);\n  text-transform: var(--subtitle-text-transform, uppercase);\n  letter-spacing: var(--subtitle-letter-spacing, 0.5px);\n  margin-bottom: 4px;\n}\n\n.card-title {\n  font-size: var(--title-font-size, 18px);\n  font-weight: var(--title-font-weight, 600);\n  color: var(--title-color, #1f2937);\n  margin: 0 0 8px 0;\n  line-height: var(--title-line-height, 1.3);\n}\n\n.card-description {\n  font-size: var(--description-font-size, 14px);\n  font-weight: var(--description-font-weight, 400);\n  color: var(--description-color, #6b7280);\n  line-height: var(--description-line-height, 1.6);\n  margin: 0 0 16px 0;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.card-footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: auto;\n}\n\n.card-price {\n  font-size: var(--price-font-size, 24px);\n  font-weight: var(--price-font-weight, 700);\n  color: var(--price-color, #7c2bee);\n  line-height: var(--price-line-height, 1.2);\n}\n\n.card-btn {\n  background: #7c2bee;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 8px;\n  font-size: var(--button-font-size, 14px);\n  font-weight: var(--button-font-weight, 600);\n  cursor: pointer;\n  transition: background 0.2s ease;\n}\n\n.card-btn:hover {\n  background: var(--button-hover-color, #6b21a8);\n}"
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
