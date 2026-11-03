#!/usr/bin/env node

/**
 * sync-figma.js
 *
 * Fetches data from the GOZ WEB Figma file via the Figma REST API and
 * displays a structured overview of styles, components, and variables.
 *
 * Usage:
 *   node ./scripts/sync-figma.js
 *   node ./scripts/sync-figma.js --json          (output raw JSON)
 *   node ./scripts/sync-figma.js --export-tokens  (re-export variables to figma-tokens/)
 *
 * Requires a .env file at the repo root with:
 *   FIGMA_TOKEN=<your-personal-access-token>
 *   FIGMA_FILE_KEY=<file-key-from-url>
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Load environment variables ─────────────────────────────────────────────
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
}

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error('❌  Missing FIGMA_TOKEN or FIGMA_FILE_KEY in .env');
  console.error('    Create a .env file at the repo root with:');
  console.error('    FIGMA_TOKEN=figd_...');
  console.error('    FIGMA_FILE_KEY=<file-key-from-figma-url>');
  process.exit(1);
}

const args = process.argv.slice(2);
const OUTPUT_JSON = args.includes('--json');
const EXPORT_TOKENS = args.includes('--export-tokens');

// ─── Figma API helper ────────────────────────────────────────────────────────
function figmaGet(apiPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.figma.com',
      path: apiPath,
      headers: { 'X-Figma-Token': FIGMA_TOKEN },
      timeout: 20000,
    };

    const req = https.get(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => (rawData += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          if (parsed.err) {
            reject(new Error(`Figma API error [${res.statusCode}]: ${parsed.err}`));
          } else {
            resolve({ status: res.statusCode, data: parsed });
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${rawData.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after 20s'));
    });
  });
}

// ─── Console formatting helpers ──────────────────────────────────────────────
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const MAGENTA = '\x1b[35m';
const BLUE = '\x1b[34m';
const RED = '\x1b[31m';

function header(title) {
  const line = '═'.repeat(60);
  console.log(`\n${CYAN}${BOLD}${line}${RESET}`);
  console.log(`${CYAN}${BOLD}  ${title}${RESET}`);
  console.log(`${CYAN}${BOLD}${line}${RESET}`);
}

function section(title) {
  console.log(`\n${YELLOW}${BOLD}▸ ${title}${RESET}`);
}

function item(icon, label, value = '') {
  const valueStr = value ? `${DIM} → ${RESET}${value}` : '';
  console.log(`  ${icon} ${BOLD}${label}${RESET}${valueStr}`);
}

// ─── Style type color ────────────────────────────────────────────────────────
function styleTypeColor(type) {
  switch (type) {
    case 'FILL':   return `${MAGENTA}FILL${RESET}`;
    case 'TEXT':   return `${BLUE}TEXT${RESET}`;
    case 'EFFECT': return `${GREEN}EFFECT${RESET}`;
    case 'GRID':   return `${YELLOW}GRID${RESET}`;
    default:       return type;
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${GREEN}${BOLD}🎨 Figma Sync — GOZ WEB${RESET}`);
  console.log(`${DIM}File: https://www.figma.com/design/${FIGMA_FILE_KEY}/GOZ-WEB${RESET}`);

  // ── 1. File metadata ───────────────────────────────────────────────────────
  process.stdout.write(`\n${DIM}Fetching file metadata...${RESET}`);
  const metaResp = await figmaGet(`/v1/files/${FIGMA_FILE_KEY}?depth=1`);
  const meta = metaResp.data;
  process.stdout.write(` ${GREEN}✓${RESET}\n`);

  header('📄 File Overview');
  item('📁', 'Name:', meta.name);
  item('🕒', 'Last Modified:', new Date(meta.lastModified).toLocaleString());
  item('📌', 'Version:', meta.version);
  if (meta.thumbnailUrl) item('🖼️ ', 'Thumbnail:', meta.thumbnailUrl);
  if (meta.document && meta.document.children) {
    item('📑', 'Pages:', meta.document.children.map((p) => p.name).join(', '));
  }

  if (OUTPUT_JSON) {
    console.log('\n[File Metadata JSON]');
    console.log(JSON.stringify({ name: meta.name, lastModified: meta.lastModified, version: meta.version }, null, 2));
  }

  // ── 2. Styles ──────────────────────────────────────────────────────────────
  process.stdout.write(`${DIM}Fetching styles...${RESET}`);
  const stylesResp = await figmaGet(`/v1/files/${FIGMA_FILE_KEY}/styles`);
  const styles = stylesResp.data.meta?.styles || [];
  process.stdout.write(` ${GREEN}✓${RESET}\n`);

  header(`🎨 Styles (${styles.length} total)`);

  const stylesByType = {};
  for (const style of styles) {
    if (!stylesByType[style.style_type]) stylesByType[style.style_type] = [];
    stylesByType[style.style_type].push(style);
  }

  for (const [type, typeStyles] of Object.entries(stylesByType)) {
    section(`${styleTypeColor(type)} styles (${typeStyles.length})`);
    for (const s of typeStyles) {
      const desc = s.description ? `  ${DIM}— ${s.description}${RESET}` : '';
      console.log(`    • ${BOLD}${s.name}${RESET}${desc}`);
      console.log(`      ${DIM}key: ${s.key}  node: ${s.node_id}${RESET}`);
    }
  }

  if (OUTPUT_JSON) {
    console.log('\n[Styles JSON]');
    console.log(JSON.stringify(styles, null, 2));
  }

  // ── 3. Components ──────────────────────────────────────────────────────────
  process.stdout.write(`${DIM}Fetching components...${RESET}`);
  const compsResp = await figmaGet(`/v1/files/${FIGMA_FILE_KEY}/components`);
  const components = compsResp.data.meta?.components || [];
  process.stdout.write(` ${GREEN}✓${RESET}\n`);

  header(`🧩 Components (${components.length} total)`);
  if (components.length === 0) {
    console.log(`  ${DIM}No published components found in this file.${RESET}`);
  } else {
    const groupedByPage = {};
    for (const c of components) {
      const page = c.containing_frame?.pageName || 'Unknown Page';
      if (!groupedByPage[page]) groupedByPage[page] = [];
      groupedByPage[page].push(c);
    }
    for (const [page, pageComps] of Object.entries(groupedByPage)) {
      section(`Page: ${page} (${pageComps.length} components)`);
      for (const c of pageComps.slice(0, 20)) {
        console.log(`    • ${BOLD}${c.name}${RESET}  ${DIM}[key: ${c.key}]${RESET}`);
      }
      if (pageComps.length > 20) {
        console.log(`    ${DIM}... and ${pageComps.length - 20} more${RESET}`);
      }
    }
  }

  // ── 4. Component Sets ──────────────────────────────────────────────────────
  process.stdout.write(`${DIM}Fetching component sets...${RESET}`);
  const setsResp = await figmaGet(`/v1/files/${FIGMA_FILE_KEY}/component_sets`);
  const componentSets = setsResp.data.meta?.component_sets || [];
  process.stdout.write(` ${GREEN}✓${RESET}\n`);

  if (componentSets.length > 0) {
    header(`📦 Component Sets (${componentSets.length} total)`);
    for (const cs of componentSets) {
      console.log(`  • ${BOLD}${cs.name}${RESET}  ${DIM}[key: ${cs.key}]${RESET}`);
    }
  }

  // ── 5. Variables (Figma API v2) ────────────────────────────────────────────
  process.stdout.write(`${DIM}Fetching variables (v2)...${RESET}`);
  try {
    const varsResp = await figmaGet(`/v2/files/${FIGMA_FILE_KEY}/variables/local`);
    const { variables, variableCollections } = varsResp.data.meta || {};
    process.stdout.write(` ${GREEN}✓${RESET}\n`);

    const varCount = variables ? Object.keys(variables).length : 0;
    const colCount = variableCollections ? Object.keys(variableCollections).length : 0;

    header(`🎛️  Variables (${varCount} variables in ${colCount} collections)`);

    if (variableCollections) {
      for (const [colId, col] of Object.entries(variableCollections)) {
        section(`Collection: ${col.name} (${col.modes?.length || 0} modes)`);
        col.modes?.forEach((m) => console.log(`    Mode: ${BOLD}${m.name}${RESET}  [id: ${m.modeId}]`));

        // Show variables in this collection
        const colVars = variables
          ? Object.values(variables).filter((v) => v.variableCollectionId === colId)
          : [];

        if (colVars.length > 0) {
          console.log(`\n    ${DIM}Variables (${colVars.length}):${RESET}`);
          colVars.slice(0, 15).forEach((v) => {
            const firstMode = Object.values(v.valuesByMode || {})[0];
            let valStr = '';
            if (firstMode !== undefined) {
              if (typeof firstMode === 'object' && firstMode !== null) {
                valStr = firstMode.r !== undefined
                  ? `rgba(${Math.round(firstMode.r * 255)}, ${Math.round(firstMode.g * 255)}, ${Math.round(firstMode.b * 255)}, ${firstMode.a?.toFixed(2) || 1})`
                  : JSON.stringify(firstMode);
              } else {
                valStr = String(firstMode);
              }
            }
            console.log(`    • ${BOLD}${v.name}${RESET}  ${DIM}[${v.resolvedType}]${RESET}  = ${CYAN}${valStr}${RESET}`);
          });
          if (colVars.length > 15) {
            console.log(`    ${DIM}... and ${colVars.length - 15} more${RESET}`);
          }
        }
      }
    }

    if (EXPORT_TOKENS && variables && variableCollections) {
      await exportTokens(variables, variableCollections);
    }
  } catch (err) {
    process.stdout.write(` ${RED}✗${RESET}\n`);
    if (err.message.includes('403') || err.message.includes('scope')) {
      console.log(`  ${YELLOW}⚠️  Variables API requires a paid Figma plan (Professional/Organization/Enterprise).${RESET}`);
      console.log(`  ${DIM}Your token has file_content:read scope, but the /v2/variables endpoint requires a higher plan.${RESET}`);
    } else if (err.message.includes('404')) {
      console.log(`  ${YELLOW}⚠️  Variables API not available for this file via REST API.${RESET}`);
      console.log(`  ${DIM}The existing figma-tokens/ JSON files were exported via the Figma Variables Plugin.${RESET}`);
      console.log(`  ${DIM}To update them: open the file in Figma → Plugins → Variables → Export JSON${RESET}`);
    } else {
      console.log(`  ${RED}Error: ${err.message}${RESET}`);
    }
  }

  // ── 6. Summary ─────────────────────────────────────────────────────────────
  header('✅ Summary');
  item('📄', 'File:', `${meta.name} (${FIGMA_FILE_KEY})`);
  item('🎨', 'Styles:', `${styles.length}`);
  item('🧩', 'Components:', `${components.length}`);
  item('📦', 'Component Sets:', `${componentSets.length}`);
  console.log(`\n${DIM}Run with --json for raw JSON output${RESET}`);
  console.log(`${DIM}Run with --export-tokens to re-sync Figma Variables → figma-tokens/ folder${RESET}\n`);
}

// ─── Export tokens to JSON files ─────────────────────────────────────────────
async function exportTokens(variables, variableCollections) {
  header('📤 Exporting Variables to figma-tokens/');
  const outputDir = path.join(__dirname, '../packages/design-system/src/lib/figma-tokens');
  fs.mkdirSync(outputDir, { recursive: true });

  for (const [colId, col] of Object.entries(variableCollections)) {
    const colVars = Object.values(variables).filter((v) => v.variableCollectionId === colId);
    const outputData = {};

    for (const variable of colVars) {
      const nameParts = variable.name.split('/');
      let current = outputData;
      for (let i = 0; i < nameParts.length - 1; i++) {
        const part = nameParts[i];
        if (!current[part]) current[part] = {};
        current = current[part];
      }
      const leafName = nameParts[nameParts.length - 1];
      const firstMode = Object.values(variable.valuesByMode || {})[0];
      current[leafName] = {
        $type: variable.resolvedType === 'COLOR' ? 'color' : variable.resolvedType.toLowerCase(),
        $value: firstMode,
        $extensions: {
          'com.figma.variableId': variable.id,
          'com.figma.scopes': variable.scopes || [],
        },
      };
    }

    const filename = `${col.name}.json`;
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`  ${GREEN}✓${RESET} Exported ${BOLD}${filename}${RESET} (${colVars.length} variables)`);
  }

  console.log(`\n  ${GREEN}✓ Done! Now run:${RESET} ${BOLD}pnpm build:tokens${RESET} to regenerate CSS`);
}

main().catch((err) => {
  console.error(`\n${RED}${BOLD}Fatal error:${RESET} ${err.message}`);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
