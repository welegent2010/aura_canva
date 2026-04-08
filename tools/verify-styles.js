const fs = require('fs');

console.log('=== 验证 Style 配置 ===\n');

// 1. 读取 manifest
const manifest = JSON.parse(fs.readFileSync('E:\\Do\\html编辑器\\style\\manifest.json', 'utf8'));
console.log('Manifest 中的样式:');
manifest.forEach((s, i) => {
  console.log(`  ${i+1}. ${s.name}`);
  console.log(`     文件: ${s.file}`);
});

console.log(`\n✓ Manifest 包含 ${manifest.length} 个样式\n`);

// 2. 检查文件是否存在
console.log('验证文件存在性:');
manifest.forEach(s => {
  const exists = fs.existsSync(s.file);
  const status = exists ? '✓' : '✗';
  console.log(`  ${status} ${s.file} ${exists ? '' : '(不存在)'}`);
});

console.log('\n完成！现在刷新编辑器查看效果。');
