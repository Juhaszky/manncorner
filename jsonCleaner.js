const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('dirty-assets.txt', 'utf8');

try {
  // Wrap code as an expression in parentheses so it can be evaluated as an object/array literal
  const wrappedCode = '(' + code + ')';

  // Use vm to safely evaluate code (no access to globals)
  const parsedData = vm.runInNewContext(wrappedCode);

  // Now convert to JSON string
  const json = JSON.stringify(parsedData, null, 2);
  fs.writeFileSync('clean-assets.json', json);
  console.log('✅ Successfully converted to JSON.');
} catch (err) {
  console.error('❌ Failed to parse JS object:', err);
}
