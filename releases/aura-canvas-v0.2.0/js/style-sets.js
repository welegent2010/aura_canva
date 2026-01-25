const STYLE_SETS = [
  {
    "id": "minimal-card-style",
    "name": "Minimal Card",
    "description": "Clean card style without animations",
    "version": "1.0.0",
    "thumbnail": "https://via.placeholder.com/300x200/1f2937/ffffff?text=Minimal+Card",
    "grid": {
      "columns": 4,
      "gap": 24,
      "minWidth": 280,
      "maxWidth": 1440
    },
    "cardStyle": {
      "bg": "#ffffff",
      "text": "#1f2937",
      "border": "#f3f4f6",
      "radius": 8,
      "padding": 16,
      "shadow": "none"
    },
    "textStyles": {
      "title": {
        "fontSize": 16,
        "fontWeight": 500,
        "color": "#111827",
        "lineHeight": 1.4,
        "letterSpacing": 0,
        "textAlign": "left",
        "textTransform": "none"
      },
      "subtitle": {
        "fontSize": 12,
        "fontWeight": 500,
        "color": "#9ca3af",
        "lineHeight": 1.5,
        "letterSpacing": 0,
        "textAlign": "left",
        "textTransform": "uppercase"
      },
      "description": {
        "fontSize": 13,
        "fontWeight": 400,
        "color": "#6b7280",
        "lineHeight": 1.5,
        "letterSpacing": 0,
        "textAlign": "left",
        "textTransform": "none"
      },
      "price": {
        "fontSize": 18,
        "fontWeight": 600,
        "color": "#111827",
        "lineHeight": 1.2,
        "letterSpacing": 0,
        "textAlign": "left",
        "textTransform": "none"
      },
      "badge": {
        "fontSize": 11,
        "fontWeight": 500,
        "color": "#ffffff",
        "lineHeight": 1.2,
        "letterSpacing": 0,
        "textAlign": "center",
        "textTransform": "uppercase"
      },
      "button": {
        "fontSize": 13,
        "fontWeight": 500,
        "color": "#111827",
        "lineHeight": 1.4,
        "letterSpacing": 0,
        "textAlign": "center",
        "textTransform": "none"
      }
    },
    "animation": {
      "enabled": false,
      "hover": {
        "cardLift": false,
        "liftDistance": 0,
        "cardShadow": false,
        "shadowIntensity": 0,
        "imageZoom": false,
        "imageScale": 1,
        "buttonColorChange": false,
        "buttonHoverColor": ""
      },
      "entry": {
        "enabled": false,
        "type": "none",
        "duration": 0,
        "delay": 0,
        "stagger": false
      }
    },
    "template": {
      "html": "<div class=\"card-inner\">\n  <div class=\"card-image\">\n    <img src=\"{{image}}\" alt=\"{{name}}\" />\n  </div>\n  <div class=\"card-content\">\n    <div class=\"card-subtitle\">{{category}}</div>\n    <h3 class=\"card-title\">{{name}}</h3>\n    <p class=\"card-description\">{{description}}</p>\n    <div class=\"card-footer\">\n      <span class=\"card-price\">{{price}}</span>\n    </div>\n  </div>\n</div>",
      "css": ".card {\n  background: var(--card-bg, #ffffff);\n  border-radius: var(--card-radius, 8px);\n  padding: var(--card-padding, 16px);\n  border: 1px solid var(--card-border, #f3f4f6);\n  overflow: hidden;\n}\n\n.card-image {\n  position: relative;\n  width: 100%;\n  aspect-ratio: 1/1;\n  margin-bottom: 12px;\n  overflow: hidden;\n  border-radius: 4px;\n}\n\n.card-image img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n.card-content {\n  display: flex;\n  flex-direction: column;\n}\n\n.card-subtitle {\n  font-size: var(--subtitle-font-size, 12px);\n  font-weight: var(--subtitle-font-weight, 500);\n  color: var(--subtitle-color, #9ca3af);\n  text-transform: var(--subtitle-text-transform, uppercase);\n  letter-spacing: var(--subtitle-letter-spacing, 0);\n  margin-bottom: 2px;\n}\n\n.card-title {\n  font-size: var(--title-font-size, 16px);\n  font-weight: var(--title-font-weight, 500);\n  color: var(--title-color, #111827);\n  margin: 0 0 6px 0;\n  line-height: var(--title-line-height, 1.4);\n}\n\n.card-description {\n  font-size: var(--description-font-size, 13px);\n  font-weight: var(--description-font-weight, 400);\n  color: var(--description-color, #6b7280);\n  line-height: var(--description-line-height, 1.5);\n  margin: 0 0 10px 0;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.card-footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: auto;\n}\n\n.card-price {\n  font-size: var(--price-font-size, 18px);\n  font-weight: var(--price-font-weight, 600);\n  color: var(--price-color, #111827);\n}"
    },
    "fields": {
      "image": {
        "required": true,
        "default": "https://via.placeholder.com/400x400/1f2937/ffffff?text=Product"
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
      }
    },
    "dataMapping": {
      "image": ["image", "url", "图片", "图片链接"],
      "name": ["name", "title", "商品名称", "名称"],
      "description": ["description", "desc", "描述", "商品描述"],
      "price": ["price", "价格", "售价"],
      "category": ["category", "分类"]
    }
  },
  {
    "id": "minimal-testimonial-card",
    "name": "Minimal Testimonial Card",
    "description": "Clean, modern testimonial card with quote, client name, and portrait image. Features subtle typography and ample whitespace.",
    "version": "1.0.0",
    "thumbnail": "https://via.placeholder.com/300x200/ffffff/1f2937?text=Testimonial+Card  ",
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
      "radius": 12,
      "padding": 24,
      "shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
    },
    "textStyles": {
      "title": {
        "fontSize": 14,
        "fontWeight": 600,
        "color": "#1f2937",
        "lineHeight": 1.4,
        "letterSpacing": 0.5,
        "textAlign": "left",
        "textTransform": "uppercase"
      },
      "description": {
        "fontSize": 22,
        "fontWeight": 400,
        "color": "#1f2937",
        "lineHeight": 1.5,
        "letterSpacing": 0,
        "textAlign": "left",
        "textTransform": "none"
      },
      "author": {
        "fontSize": 16,
        "fontWeight": 500,
        "color": "#1f2937",
        "lineHeight": 1.4,
        "letterSpacing": 0,
        "textAlign": "left",
        "textTransform": "none"
      },
      "role": {
        "fontSize": 14,
        "fontWeight": 400,
        "color": "#6b7280",
        "lineHeight": 1.4,
        "letterSpacing": 0,
        "textAlign": "left",
        "textTransform": "none"
      }
    },
    "animation": {
      "enabled": true,
      "hover": {
        "cardLift": true,
        "liftDistance": 4,
        "cardShadow": true,
        "shadowIntensity": 0.1,
        "imageZoom": false,
        "imageScale": 1.0,
        "buttonColorChange": false,
        "buttonHoverColor": ""
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
      "html": "<div class=\"card-inner\">\n  <div class=\"card-header\">\n    <span class=\"card-category\">{{title}}</span>\n  </div>\n  <div class=\"card-content\">\n    <blockquote class=\"quote\">{{description}}</blockquote>\n    <div class=\"author-info\">\n      <div class=\"author-name\">{{author}}</div>\n      <div class=\"author-role\">{{role}}</div>\n    </div>\n  </div>\n  <div class=\"card-image\">\n    <img src=\"{{image}}\" alt=\"{{author}}\">\n  </div>\n</div>",
      "css": ".card {\n  background: var(--card-bg, #ffffff);\n  border-radius: var(--card-radius, 12px);\n  padding: var(--card-padding, 24px);\n  border: 1px solid var(--card-border, #e5e7eb);\n  box-shadow: var(--card-shadow, 0 4px 6px -1px rgba(0,0,0,0.05));\n  display: flex;\n  gap: 24px;\n  transition: all 0.3s ease;\n  overflow: hidden;\n}\n\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 12px -2px rgba(0,0,0,0.1);\n}\n\n.card-header {\n  margin-bottom: 16px;\n}\n\n.card-category {\n  font-size: var(--title-font-size, 14px);\n  font-weight: var(--title-font-weight, 600);\n  color: var(--title-color, #1f2937);\n  line-height: var(--title-line-height, 1.4);\n  letter-spacing: var(--title-letter-spacing, 0.5px);\n  text-align: var(--title-text-align, left);\n  text-transform: var(--title-text-transform, uppercase);\n  display: inline-block;\n  position: relative;\n}\n\n.card-category::before {\n  content: \"◆ \";\n  color: #6b7280;\n  font-size: 0.8em;\n}\n\n.card-content {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n\n.quote {\n  font-size: var(--description-font-size, 22px);\n  font-weight: var(--description-font-weight, 400);\n  color: var(--description-color, #1f2937);\n  line-height: var(--description-line-height, 1.5);\n  letter-spacing: var(--description-letter-spacing, 0);\n  text-align: var(--description-text-align, left);\n  text-transform: var(--description-text-transform, none);\n  margin: 0 0 24px 0;\n  font-style: italic;\n}\n\n.author-info {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.author-name {\n  font-size: var(--author-font-size, 16px);\n  font-weight: var(--author-font-weight, 500);\n  color: var(--author-color, #1f2937);\n  line-height: var(--author-line-height, 1.4);\n  letter-spacing: var(--author-letter-spacing, 0);\n  text-align: var(--author-text-align, left);\n  text-transform: var(--author-text-transform, none);\n}\n\n.author-role {\n  font-size: var(--role-font-size, 14px);\n  font-weight: var(--role-font-weight, 400);\n  color: var(--role-color, #6b7280);\n  line-height: var(--role-line-height, 1.4);\n  letter-spacing: var(--role-letter-spacing, 0);\n  text-align: var(--role-text-align, left);\n  text-transform: var(--role-text-transform, none);\n}\n\n.card-image {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  overflow: hidden;\n  flex-shrink: 0;\n}\n\n.card-image img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}"
    },
    "fields": {
      "title": {
        "required": true,
        "default": "Client Stories"
      },
      "description": {
        "required": true,
        "default": "ARKAL transformed our space with clear vision and thoughtful design. Every detail felt intentional."
      },
      "author": {
        "required": true,
        "default": "Lydia Chen"
      },
      "role": {
        "required": true,
        "default": "Director, Arcadia Builders"
      },
      "image": {
        "required": true,
        "default": "https://via.placeholder.com/600x400/cccccc/000000?text=Client+Portrait"
      }
    },
    "dataMapping": {
      "title": ["title", "category", "标题", "分类"],
      "description": ["description", "quote", "描述", "引言"],
      "author": ["author", "clientName", "作者", "客户姓名"],
      "role": ["role", "position", "职位", "角色"],
      "image": ["image", "url", "图片", "图片链接"]
    }
  }
];
