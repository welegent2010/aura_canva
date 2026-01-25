class GridGenerator {
  constructor() {
    this.defaultConfig = {
      columns: 3,
      gap: 24,
      minWidth: 300,
      maxWidth: 1200
    };
  }

  calculateColumnWidth(columns, gap) {
    if (columns < 1) {
      throw new Error('Columns must be at least 1');
    }
    
    if (gap < 0) {
      throw new Error('Gap must be non-negative');
    }
    
    if (columns === 1) {
      return '100%';
    }
    
    const totalGap = gap * (columns - 1);
    const remainingWidth = 100 - (totalGap / 10);
    const columnPercentage = remainingWidth / columns;
    
    return `calc(${columnPercentage}% - ${(gap * (columns - 1)) / columns}px)`;
  }

  calculateBreakpoint(columns, gap, minWidth) {
    return columns * minWidth + gap * (columns - 1);
  }

  generateGridCSS(config) {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const { columns, gap, minWidth, containerClass = '.grid-container' } = mergedConfig;
    
    const columnWidth = this.calculateColumnWidth(columns, gap);
    
    let css = `${containerClass} {
  display: grid;
  grid-template-columns: repeat(${columns}, ${columnWidth});
  gap: ${gap}px;
}

`;
    
    const breakpoint = this.calculateBreakpoint(columns, gap, minWidth);
    css += `@media (max-width: ${breakpoint}px) {
  ${containerClass} {
    grid-template-columns: repeat(auto-fit, minmax(${minWidth}px, 1fr));
  }
}`;
    
    return css.trim();
  }

  generateResponsiveGrid(config) {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const { columns, gap, minWidth, containerClass = '.grid-container' } = mergedConfig;
    
    const styles = [];
    
    for (let i = 1; i <= columns; i++) {
      const columnWidth = this.calculateColumnWidth(i, gap);
      const breakpoint = this.calculateBreakpoint(i, gap, minWidth);
      
      styles.push(`@media (min-width: ${breakpoint}px) {
  ${containerClass}.grid-${i}cols {
    grid-template-columns: repeat(${i}, ${columnWidth});
  }
}`);
    }
    
    return styles.join('\n\n');
  }

  generateFullGridCSS(config) {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const { columns, gap, minWidth, maxWidth, containerClass = '.grid-container' } = mergedConfig;
    
    let css = `/* Base Grid Styles */
${containerClass} {
  display: grid;
  gap: ${gap}px;
  max-width: ${maxWidth}px;
  width: 100%;
  margin: 0 auto;
}

@media (min-width: ${maxWidth + 1}px) {
  ${containerClass} {
    max-width: ${maxWidth}px;
    padding: 0 calc((100vw - ${maxWidth}px) / 2);
  }
}

`;

    css += `/* Mobile (1 column) - max 599px */
@media (max-width: 599px) {
  ${containerClass} {
    grid-template-columns: 1fr;
  }
}

`;

    css += `/* Tablet (3 columns) - 600px to 1023px */
@media (min-width: 600px) and (max-width: 1023px) {
  ${containerClass} {
    grid-template-columns: repeat(3, 1fr);
  }
}

`;

    for (let i = 2; i <= columns; i++) {
      if (i === 3) continue;
      const columnWidth = this.calculateColumnWidth(i, gap);
      const minBreakpoint = this.calculateBreakpoint(i - 1, gap, minWidth) + 1;
      const maxBreakpoint = this.calculateBreakpoint(i, gap, minWidth);
      
      if (i === columns) {
        css += `/* Desktop (${i} columns) - 1024px and up */
@media (min-width: 1024px) {
  ${containerClass} {
    grid-template-columns: repeat(${i}, ${columnWidth});
  }
}`;
      } else {
        css += `/* ${i} columns */
@media (min-width: ${minBreakpoint}px) and (max-width: ${maxBreakpoint}px) {
  ${containerClass} {
    grid-template-columns: repeat(${i}, ${columnWidth});
  }
}

`;
      }
    }
    
    return css.trim();
  }

  generateCardCSS(variables = {}) {
    const defaults = {
      '--card-bg': '#ffffff',
      '--card-text': '#1f2937',
      '--card-border': '#e5e7eb',
      '--card-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      '--card-radius': '12px',
      '--card-padding': '1.5rem'
    };
    
    const mergedVars = { ...defaults, ...variables };
    
    let css = `.card {
  background: ${mergedVars['--card-bg']};
  color: ${mergedVars['--card-text']};
  border: 1px solid ${mergedVars['--card-border']};
  box-shadow: ${mergedVars['--card-shadow']};
  border-radius: ${mergedVars['--card-radius']};
  padding: ${mergedVars['--card-padding']};
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: calc(${mergedVars['--card-radius']} - 4px);
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${mergedVars['--card-text']};
}

.card-description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${mergedVars['--card-text']};
  opacity: 0.8;
  margin-bottom: 1rem;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.card-tag {
  padding: 0.25rem 0.75rem;
  background: ${mergedVars['--card-border']};
  color: ${mergedVars['--card-text']};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}`;
    
    return css;
  }

  generateCompleteCSS(config) {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const { containerClass = '.grid-container', cardVariables = {} } = mergedConfig;
    
    let css = `/* Aura Canvas Grid System */
/* Generated by GridGenerator */

`;
    
    css += this.generateFullGridCSS(mergedConfig);
    css += '\n\n';
    css += this.generateCardCSS(cardVariables);
    
    return css.trim();
  }

  previewGrid(config, items = []) {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const { columns, gap, minWidth, containerClass = 'grid-container' } = mergedConfig;
    
    const columnWidth = this.calculateColumnWidth(columns, gap);
    
    let html = `<div class="${containerClass}">`;
    
    for (let i = 0; i < Math.max(items.length, 6); i++) {
      const item = items[i] || { title: `Card ${i + 1}`, description: 'Sample description' };
      html += `
  <div class="card">
    ${item.cover ? `<img src="${item.cover}" class="card-cover" alt="${item.title}">` : ''}
    <h3 class="card-title">${item.title}</h3>
    ${item.description ? `<p class="card-description">${item.description}</p>` : ''}
    ${item.tags ? `<div class="card-tags">${item.tags.split(',').map(tag => `<span class="card-tag">${tag.trim()}</span>`).join('')}</div>` : ''}
  </div>`;
    }
    
    html += `
</div>

<style>
  ${this.generateFullGridCSS(mergedConfig)}
  ${this.generateCardCSS()}
</style>`;
    
    return html;
  }

  exportToHTML(config, items, options = {}) {
    const { includeStyles = true, standalone = true } = options;
    const mergedConfig = { ...this.defaultConfig, ...config };
    
    let html = '';
    
    if (standalone) {
      html += `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aura Canvas Grid</title>
`;
      
      if (includeStyles) {
        html += `  <style>
    ${this.generateCompleteCSS(mergedConfig)}
  </style>
`;
      }
      
      html += `</head>
<body>
`;
    }
    
    html += this.previewGrid(mergedConfig, items);
    
    if (standalone) {
      html += `
</body>
</html>`;
    }
    
    return html;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GridGenerator };
}
