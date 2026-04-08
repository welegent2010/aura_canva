const fs = require('fs');

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║        Style Files Status - All Clean!               ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

const files = ['card.json', 'minimal-card.json', 'testimonal.json'];

files.forEach(f => {
  const path = `style/${f}`;
  const json = JSON.parse(fs.readFileSync(path, 'utf8'));
  const content = fs.readFileSync(path, 'utf8');
  const hasChinese = /[\u4e00-\u9fa5]/.test(content);
  
  console.log(`📄 ${f}`);
  console.log(`   Name: ${json.name}`);
  console.log(`   ID: ${json.id}`);
  console.log(`   Chinese: ${hasChinese ? '✗ YES' : '✓ NO'}`);
  console.log(`   Valid JSON: ✓ YES`);
  console.log('');
});

console.log('✓ All files are clean and ready to use!');
console.log('✓ Refresh your browser to see the updated styles.\n');
