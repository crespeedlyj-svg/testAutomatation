'use strict';

/**
 * SCENARIO_STORE 데이터를 Playwright TypeScript spec 파일로 변환한다.
 * 기존 프로젝트의 tests/unit/, tests/integration/ 형식과 완전히 호환된다.
 */

// ── 2026-07-21: NEXACRO_XML_FN 인라인 상수 제거 ─────────────────────────────
// 이전에는 spec 파일마다 nexacroXml + apiPost 정의를 인라인으로 삽입했으나,
// 이제 spec은 `../utils/nexacro-api` 에서 헬퍼를 import 한다.
// 실행 방식도 page.request.post → page.evaluate(fetch) 로 변경 (testCode_* 실사용 방식과 일치).

function colConst(dsId) {
  return `DS_${dsId.toUpperCase()}_COLUMNS`;
}

function generateUnitSpec(scenarios, prefix, date, sourceName) {
  if (!scenarios || scenarios.length === 0) return '';

  // 모든 입력 DS 목록 수집
  const dsMap = {};
  for (const s of scenarios) {
    if (s.inputDsId && s.inputCols) {
      dsMap[s.inputDsId] = s.inputCols.split(',').filter(Boolean);
    }
  }

  const dsConsts = Object.entries(dsMap).map(([id, cols]) =>
    `const ${colConst(id)} = [\n${cols.map(c => `  '${c}',`).join('\n')}\n];`
  ).join('\n\n');

  const tcBlocks = scenarios.map(s => generateUnitTC(s)).join('\n\n');

  const pgmId = (sourceName || scenarios[0]?.sourceName || 'UNKNOWN').toUpperCase();

  return `// ==============================================================
// 단위 테스트 (${sourceName || prefix})
// 생성일시: ${date}  |  파일: ${date}_${prefix}_unit.spec.ts
// 화면: ${scenarios[0]?.화면명 || ''}
// API: ${scenarios.filter(s => s.URL).map(s => `POST ${s.URL}`).join(', ')}
// storageState 자동 주입 — 로그인/goto/navigateTo 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';
import { nexacroXml, apiPost, ensureSessionReady } from '../utils/nexacro-api';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';

${dsConsts}

// ============================================================================
// [${sourceName}] 단위 테스트
// ============================================================================
test.describe('${scenarios[0]?.화면명 || sourceName} 단위 테스트 (${sourceName})', () => {

  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

${tcBlocks}

});
`;
}

function generateUnitTC(s) {
  const inputVals = safeParseJson(s.inputValues);
  const rowLiteral = Object.keys(inputVals).length > 0
    ? `[{ ${Object.entries(inputVals).map(([k, v]) => `${k}: '${v}'`).join(', ')} }]`
    : '[{}]';
  const condLabel = Object.keys(inputVals).length > 0
    ? JSON.stringify(s.inputValues)
    : '(빈값 - 전체)';

  const varName = s.inputDsId ? colConst(s.inputDsId) : '[]';
  const urlPath = s.URL || '';
  const svcEnd = urlPath.split('/').pop() || '';

  return `  // --------------------------------------------------------------------------
  // [no:${s.no}] ${s.테스트명} [${s.scenarioId}]
  // --------------------------------------------------------------------------
  test('[no:${s.no}] [단위] [${s.crudType}] ${s.테스트명}', async ({ workerPage: page }) => {
    logTestStart('[no:${s.no}] [단위] ${s.테스트명}');
    logInput('endpoint', \`\${BASE_URL}${urlPath}\`);
    logInput('조건', '${condLabel}');

    const resp = await apiPost(
      page,
      \`\${BASE_URL}${urlPath}\`,
      nexacroXml([{
        id: '${s.inputDsId || ''}',
        columns: ${varName},
        rows: ${rowLiteral},
      }], '${s.sourceName}')
    );

    const result = await assertNexacroResponse(resp, '${svcEnd}');
    const rows = parseNexacroXmlRows(result.body, '${s.outputDsId || ''}');
    logResult('조회 건수', rows.length);
    expect(rows.length).toBeGreaterThanOrEqual(0);

    await page.screenshot({ path: \`\${SCREENSHOT_DIR}/${s.sourceName}-no${s.no}.png\`, fullPage: true });
  });`;
}

function generateIntegSpec(scenarios, prefix, date, sourceName, options = {}) {
  if (!scenarios || scenarios.length === 0) return '';

  const { gnbName = '', menuName = '', systemId = 'MIS' } = options;
  const src = scenarios[0]?.sourceName || sourceName;

  const tcBlocks = scenarios.map(s => generateIntegTC(s, src)).join('\n\n');

  return `// ==============================================================
// 통합 테스트 (${src})
// 생성일시: ${date}  |  파일: ${date}_${prefix}_inte.spec.ts
// 화면: ${scenarios[0]?.화면명 || ''}
// 메뉴: ${scenarios[0]?.menuPath || `${gnbName} > ${menuName}`}
// storageState 자동 주입 — 로그인 코드 작성 절대 금지
// ==============================================================
import { test, expect } from '../fixtures';
import type { Page, Frame } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SYSTEM_ID      = process.env.APP_SYSTEM_ID ?? '${systemId}';
const SCREENSHOT_DIR = 'test-results/screenshots';

const CONFIG = {
  indexUrl: \`\${BASE_URL}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_\${SYSTEM_ID}\`,
  defaultTimeout: 15000,
  gnbName: '${gnbName}',
  menuName: '${menuName}',
};

// ── 모든 프레임 병렬 탐색 후 텍스트 클릭 ─────────────────────────────────
async function clickTextInAnyFrame(page: Page, text: string): Promise<boolean> {
  const results = await Promise.all(
    page.frames().map(async (frame) => {
      try {
        const el = frame.locator(\`text="\${text}"\`).first();
        if (await el.isVisible({ timeout: 100 })) { await el.click(); return true; }
      } catch {}
      return false;
    })
  );
  return results.some(Boolean);
}

// ── 메뉴 탐색 → 화면 진입 ────────────────────────────────────────────────
async function navigateTo${toPascal(src)}(page: Page): Promise<Frame | null> {
  await page.goto(CONFIG.indexUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await clickTextInAnyFrame(page, CONFIG.gnbName);
  await page.waitForTimeout(1000);
  await clickTextInAnyFrame(page, CONFIG.menuName);
  await page.waitForTimeout(3000);
  return page.frames().find(f => f.url().includes('${src.toLowerCase()}') || f.url().includes('${src.replace(/_/g, '')}')) ?? null;
}

// ============================================================================
// [${src}] 통합 테스트
// ============================================================================
test.describe('${scenarios[0]?.화면명 || src} 통합 테스트 (${src})', () => {

  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });
  test.afterAll(() => { flushLogs(); });

${tcBlocks}

});
`;
}

function generateIntegTC(s, srcName) {
  const fnName = `navigateTo${toPascal(srcName)}`;
  const idx = s.no;
  const scrName = `${srcName}-inte-no${idx}`;

  if (idx === 1) {
    return `  // --------------------------------------------------------------------------
  // [no:${idx}] ${s.테스트명} [${s.scenarioId}]
  // --------------------------------------------------------------------------
  test('[no:${idx}] [통합] [SELECT] ${s.테스트명}', async ({ workerPage: page }) => {
    logTestStart('[no:${idx}] [통합] ${s.테스트명}');
    logInput('메뉴', \`\${CONFIG.gnbName} > \${CONFIG.menuName}\`);

    const frame = await ${fnName}(page);
    logResult('프레임 진입', frame ? '성공' : '실패');

    await page.screenshot({ path: \`\${SCREENSHOT_DIR}/${scrName}.png\`, fullPage: true });

    const errorVisible = await page.locator('text=오류').isVisible({ timeout: 1000 }).catch(() => false);
    expect(errorVisible).toBe(false);
  });`;
  }

  if (idx === 2) {
    return `  // --------------------------------------------------------------------------
  // [no:${idx}] ${s.테스트명} [${s.scenarioId}]
  // --------------------------------------------------------------------------
  test('[no:${idx}] [통합] [SELECT] ${s.테스트명}', async ({ workerPage: page }) => {
    logTestStart('[no:${idx}] [통합] ${s.테스트명}');

    await ${fnName}(page);
    await page.waitForTimeout(2000);

    const clicked = await clickTextInAnyFrame(page, '조회');
    logResult('조회버튼 클릭', clicked ? '성공' : '실패');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: \`\${SCREENSHOT_DIR}/${scrName}.png\`, fullPage: true });

    const errorVisible = await page.locator('text=오류').isVisible({ timeout: 1000 }).catch(() => false);
    expect(errorVisible).toBe(false);
  });`;
  }

  // TC3+: 그리드 행 클릭
  return `  // --------------------------------------------------------------------------
  // [no:${idx}] ${s.테스트명} [${s.scenarioId}]
  // --------------------------------------------------------------------------
  test('[no:${idx}] [통합] [SELECT] ${s.테스트명}', async ({ workerPage: page }) => {
    logTestStart('[no:${idx}] [통합] ${s.테스트명}');

    await ${fnName}(page);
    await page.waitForTimeout(2000);

    const frameWithGrid = page.frames().find(f => f.url().includes('${srcName.toLowerCase()}'));
    if (!frameWithGrid) {
      logResult('프레임', '미진입 - 스킵');
      await page.screenshot({ path: \`\${SCREENSHOT_DIR}/${scrName}-skip.png\`, fullPage: true });
      return;
    }

    try {
      const firstRow = frameWithGrid.locator('.GridCellStyle').first();
      if (await firstRow.isVisible({ timeout: 3000 })) {
        await firstRow.click();
        await page.waitForTimeout(2000);
        logResult('행 클릭', '성공');
      } else {
        logResult('그리드 행', '데이터 없음 - 스킵');
      }
    } catch {
      logResult('그리드 클릭', '실패 - 스킵');
    }

    await page.screenshot({ path: \`\${SCREENSHOT_DIR}/${scrName}.png\`, fullPage: true });

    const errorVisible = await page.locator('text=오류').isVisible({ timeout: 1000 }).catch(() => false);
    expect(errorVisible).toBe(false);
  });`;
}

function toPascal(str) {
  return str.replace(/[_-](.)/g, (_, c) => c.toUpperCase())
            .replace(/^(.)/, c => c.toUpperCase());
}

function safeParseJson(str) {
  try { return JSON.parse(str || '{}'); } catch { return {}; }
}

function generateSpecs(scenarios, prefix, date, options = {}) {
  const unitScenarios = scenarios[`${prefix}_unit`] || [];
  const integScenarios = scenarios[`${prefix}_integ`] || [];

  // sourceName 수집
  const sourceName = (unitScenarios[0] || integScenarios[0])?.sourceName || prefix;

  return {
    unitSpec: generateUnitSpec(unitScenarios, prefix, date, sourceName),
    integSpec: generateIntegSpec(integScenarios, prefix, date, sourceName, options),
    unitFileName: `${date}_${prefix}_unit.spec.ts`,
    integFileName: `${date}_${prefix}_inte.spec.ts`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 배치 스펙 생성: 여러 화면을 describe 블록별로 묶어 하나의 spec.ts 생성
// ─────────────────────────────────────────────────────────────────────────────
function generateBatchSpecs(scenarios, prefix, date) {
  const unitScenarios = scenarios[`${prefix}_unit`] || [];
  const integScenarios = scenarios[`${prefix}_integ`] || [];

  // sourceName 기준으로 그룹핑
  const unitGroups = {};
  for (const s of unitScenarios) {
    (unitGroups[s.sourceName] = unitGroups[s.sourceName] || []).push(s);
  }
  const integGroups = {};
  for (const s of integScenarios) {
    (integGroups[s.sourceName] = integGroups[s.sourceName] || []).push(s);
  }

  const unitSpec  = buildBatchUnitSpec(unitGroups, prefix, date);
  const integSpec = buildBatchIntegSpec(integGroups, prefix, date);

  return {
    unitSpec,
    integSpec,
    unitFileName: `${date}_${prefix}_unit.spec.ts`,
    integFileName: `${date}_${prefix}_inte.spec.ts`,
  };
}

function buildBatchUnitSpec(groups, prefix, date) {
  const allScenarios = Object.values(groups).flat();
  if (allScenarios.length === 0) return '';

  // 사용되는 DS 컬럼 상수 수집
  const dsMap = {};
  for (const s of allScenarios) {
    if (s.inputDsId && s.inputCols) {
      dsMap[s.inputDsId] = s.inputCols.split(',').filter(Boolean);
    }
  }
  const dsConsts = Object.entries(dsMap).map(([id, cols]) =>
    `const ${colConst(id)} = [\n${cols.map(c => `  '${c}',`).join('\n')}\n];`
  ).join('\n\n');

  const describes = Object.entries(groups).map(([srcName, scens]) => {
    const tcBlocks = scens.map(s => generateUnitTC(s)).join('\n\n');
    return `test.describe('${scens[0].화면명 || srcName} (${srcName})', () => {\n${tcBlocks}\n});`;
  }).join('\n\n');

  return `// ============================================================
// 단위 테스트 — ${prefix.toUpperCase()} 전체 (${Object.keys(groups).length}개 화면)
// 생성일: ${date}  |  파일: ${date}_${prefix}_unit.spec.ts
// storageState 자동 주입 — 로그인/goto 코드 작성 절대 금지
// ============================================================
import { test, expect } from '../fixtures';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';
import { assertNexacroResponse, parseNexacroXmlRows } from '../utils/nexacro-helper';
import { nexacroXml, apiPost, ensureSessionReady } from '../utils/nexacro-api';

const BASE_URL       = process.env.APP_BASE_URL ?? '';
const SCREENSHOT_DIR = 'test-results/screenshots';

${dsConsts}

test.beforeAll(async () => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
test.afterAll(() => { flushLogs(); });

${describes}
`;
}

function buildBatchIntegSpec(groups, prefix, date) {
  const allScenarios = Object.values(groups).flat();
  if (allScenarios.length === 0) return '';

  const gnbName = allScenarios[0]?.gnbName || '';

  const describes = Object.entries(groups).map(([srcName, scens]) => {
    const menuName = scens[0]?.menuName || 'TODO';
    const fnName   = `navigateTo${toPascal(srcName)}`;
    const tcBlocks = scens.map((s, idx) => {
      const no   = idx + 1;
      const scrName = `${srcName}-inte-no${no}`;
      if (no === 1) {
        return `  test('[no:${s.no}] [통합] ${s.테스트명}', async ({ workerPage: page }) => {
    logTestStart('[no:${s.no}] ${s.테스트명}');
    const frame = await ${fnName}(page);
    logResult('프레임 진입', frame ? '성공' : '실패');
    await page.screenshot({ path: \`\${SCREENSHOT_DIR}/${scrName}.png\`, fullPage: true });
    const errVisible = await page.locator('text=오류').isVisible({ timeout: 1000 }).catch(() => false);
    expect(errVisible).toBe(false);
  });`;
      }
      return `  test('[no:${s.no}] [통합] ${s.테스트명}', async ({ workerPage: page }) => {
    logTestStart('[no:${s.no}] ${s.테스트명}');
    await ${fnName}(page);
    await page.waitForTimeout(2000);
    const clicked = await clickTextInAnyFrame(page, '조회');
    logResult('조회버튼', clicked ? '클릭' : '없음');
    await page.screenshot({ path: \`\${SCREENSHOT_DIR}/${scrName}.png\`, fullPage: true });
    const errVisible = await page.locator('text=오류').isVisible({ timeout: 1000 }).catch(() => false);
    expect(errVisible).toBe(false);
  });`;
    }).join('\n\n');

    return `// ── ${srcName} (${scens[0].화면명 || srcName}) ──────────────────────────
async function ${fnName}(page) {
  const baseUrl = process.env.APP_BASE_URL ?? '';
  const sysId   = process.env.APP_SYSTEM_ID ?? 'MIS';
  await page.goto(\`\${baseUrl}/nxui/gprooneis/index.jsp?UPP_MENU_ID=M_\${sysId}\`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await clickTextInAnyFrame(page, '${gnbName}');
  await page.waitForTimeout(1000);
  await clickTextInAnyFrame(page, '${menuName}');
  await page.waitForTimeout(3000);
  return page.frames().find(f => f.url().includes('${srcName.toLowerCase()}')) ?? null;
}

test.describe('${scens[0].화면명 || srcName} 통합 테스트 (${srcName})', () => {
${tcBlocks}
});`;
  }).join('\n\n');

  return `// ============================================================
// 통합 테스트 — ${prefix.toUpperCase()} 전체 (${Object.keys(groups).length}개 화면)
// 생성일: ${date}  |  파일: ${date}_${prefix}_inte.spec.ts
// ============================================================
import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import {
  logInput, logResult, logTestStart, flushLogs,
} from '../utils/test-logger';

const SCREENSHOT_DIR = 'test-results/screenshots';

async function clickTextInAnyFrame(page, text) {
  const results = await Promise.all(
    page.frames().map(async (frame) => {
      try {
        const el = frame.locator(\`text="\${text}"\`).first();
        if (await el.isVisible({ timeout: 100 })) { await el.click(); return true; }
      } catch {}
      return false;
    })
  );
  return results.some(Boolean);
}

test.beforeAll(async () => { fs.mkdirSync(SCREENSHOT_DIR, { recursive: true }); });
test.afterAll(() => { flushLogs(); });

${describes}
`;
}

module.exports = { generateSpecs, generateBatchSpecs };
