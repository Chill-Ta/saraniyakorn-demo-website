const fs = require('fs');
const path = require('path');

const tokenFiles = [
  {
    name: 'primitive',
    path: path.join(
      __dirname,
      '../libs/design-system/src/lib/figma-tokens/Mode 1.Primitive.json',
    ),
  },
  {
    name: 'alias',
    path: path.join(
      __dirname,
      '../libs/design-system/src/lib/figma-tokens/Mode 1.Alias.json',
    ),
  },
  {
    name: 'components',
    path: path.join(
      __dirname,
      '../libs/design-system/src/lib/figma-tokens/Mode 1.Components.json',
    ),
  },
];

const outputPath = path.join(
  __dirname,
  '../libs/design-system/src/lib/design-system.css',
);

let cssContent = `@import "tailwindcss";\n\n@theme {\n`;

function convertToCssVariables(obj, prefix = '') {
  let lines = '';
  for (const key in obj) {
    if (key.startsWith('$')) continue;

    const value = obj[key];
    const cleanKey = key
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/-$/, '')
      .replace(/^-/, '');

    const currentPrefix = prefix ? `${prefix}-${cleanKey}` : cleanKey;

    if (value && typeof value === 'object' && !value['$value']) {
      lines += convertToCssVariables(value, currentPrefix);
    } else if (value && value['$value'] !== undefined) {
      let finalVal = value['$value'];

      if (typeof finalVal === 'object' && finalVal.hex) {
        finalVal = finalVal.hex;
      }

      if (
        typeof finalVal === 'number' &&
        finalVal !== 0 &&
        !currentPrefix.includes('weight')
      ) {
        finalVal = `${finalVal}px`;
      }

      let variableName = currentPrefix;
      if (variableName.startsWith('color-')) {
        variableName = `--color-${variableName.replace('color-', '')}`;
      } else if (variableName.startsWith('spacing-')) {
        variableName = `--spacing-${variableName.replace('spacing-', '')}`;
      } else if (variableName.startsWith('radius-')) {
        variableName = `--radius-${variableName.replace('radius-', '')}`;
      } else if (variableName.startsWith('sizing-')) {
        variableName = `--size-${variableName.replace('sizing-', '')}`;
      } else if (variableName.includes('font-family')) {
        variableName = `--font-${variableName.replace('-font-family', '').replace('typography-', '')}`;
      } else if (variableName.includes('font-size')) {
        variableName = `--text-${variableName.replace('-font-size', '').replace('typography-', '')}`;
      } else if (variableName.includes('line-height')) {
        variableName = `--leading-${variableName.replace('-line-height', '').replace('typography-', '')}`;
      } else if (variableName.includes('font-weight')) {
        variableName = `--font-weight-${variableName.replace('-font-weight', '').replace('typography-', '')}`;
      } else {
        variableName = `--${variableName}`;
      }

      lines += `  ${variableName}: ${finalVal};\n`;
    }
  }
  return lines;
}

tokenFiles.forEach((file) => {
  if (fs.existsSync(file.path)) {
    console.log(`กำลังประมวลผลไฟล์: ${file.name}...`);
    const rawData = fs.readFileSync(file.path, 'utf8');
    const jsonData = JSON.parse(rawData);
    cssContent += `  /* =========================================\n     Tokens from: ${file.name}\n     ========================================= */\n`;
    cssContent += convertToCssVariables(jsonData);
  } else {
    console.log(`⚠️ ไม่พบไฟล์โทเคนในพิกัด: ${file.path}`);
  }
});

cssContent += `}\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, cssContent, 'utf8');
console.log(`\n🎉 แปลงไฟล์ดีไซน์สำเร็จ! บันทึกไว้ที่: ${outputPath}`);
