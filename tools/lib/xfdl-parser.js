'use strict';

/**
 * XFDL 파일(XML 기반)을 파싱하여 구조화된 데이터를 반환한다.
 * AI API 없이 정규식 기반으로만 동작한다.
 */

function resolveToken(token, varMap) {
  const t = token.trim().replace(/^["']|["']$/g, '');
  // 변수 참조인 경우 varMap에서 해소
  return varMap[t] !== undefined ? varMap[t] : t;
}

function extractDsName(token) {
  // "ds_list=Row:0:1" → "ds_list"
  return token.split('=')[0].split(':')[0].trim();
}

function detectCrudType(serviceId) {
  const sid = serviceId.toLowerCase();
  if (/save|insert|add|reg|regist|create/.test(sid)) return 'INSERT';
  if (/update|modify|edit|chg/.test(sid)) return 'UPDATE';
  if (/delete|del|remove|drop/.test(sid)) return 'DELETE';
  return 'SELECT';
}

function detectDateCols(columns) {
  const sdt = columns.find(c => /_SDT$/i.test(c) || /^FROM_/i.test(c));
  const edt = columns.find(c => /_EDT$/i.test(c) || /^TO_/i.test(c));
  return sdt && edt ? { sdt, edt } : null;
}

function detectStatusCol(columns) {
  return columns.find(c =>
    /_STAT_CD$/i.test(c) || /APV_STAT/i.test(c) || /_STATUS$/i.test(c)
  ) || null;
}

function detectKeywordCols(columns) {
  const cls = columns.find(c => /SRCH_CLS$/i.test(c));
  const key = columns.find(c => /SRCH_KEY$/i.test(c));
  return cls && key ? { cls, key } : null;
}

function parseXfdl(content, filename) {
  const sourceName = filename.replace(/\.xfdl$/i, '');

  // 1. Form 속성
  const formMatch = content.match(/<Form\b[^>]*\bid="([^"]+)"[^>]*>/);
  const titleMatch = content.match(/titletext="([^"]+)"/);
  const gridTitleMatch = content.match(/id="sta_title"[^>]*text="([^"]+)"/);

  // 2. Dataset 추출: id → columns[]
  const datasets = {};
  const dsRe = /<Dataset\s+id="([^"]+)"[^>]*>[\s\S]*?<ColumnInfo>([\s\S]*?)<\/ColumnInfo>/g;
  let dm;
  while ((dm = dsRe.exec(content)) !== null) {
    const dsId = dm[1];
    if (dsId === 'innerdataset') continue;
    const cols = [];
    const colRe = /<Column\s+id="([^"]+)"/g;
    let cm;
    while ((cm = colRe.exec(dm[2])) !== null) {
      if (!cols.includes(cm[1])) cols.push(cm[1]);
    }
    if (cols.length > 0) datasets[dsId] = cols;
  }

  // 3. Script CDATA 추출
  const scriptMatch = content.match(/<Script[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/Script>/);
  const script = scriptMatch ? scriptMatch[1] : '';

  // 4. 변수 선언 맵 구성 (var x = "val")
  const varMap = {};
  const varRe = /\bvar\s+(\w+)\s*=\s*["']([^"']+)["']/g;
  let vm;
  while ((vm = varRe.exec(script)) !== null) varMap[vm[1]] = vm[2];

  // 5. gfn_tran 호출 추출
  // 형태: gfn_tran(this, "svcId", "/url", inDs, outDs, ...)
  // 또는: gfn_tran("svcId", "/url", "inDs", "outDs")
  const transactions = [];
  const tranRe = /gfn_tran\s*\(\s*(?:this\s*,\s*)?["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*,\s*([^\s,)]+)\s*,\s*([^\s,)]+)/g;
  let tm;
  while ((tm = tranRe.exec(script)) !== null) {
    const serviceId = tm[1];
    const url = tm[2];
    const inputDs = extractDsName(resolveToken(tm[3], varMap));
    const outputDs = extractDsName(resolveToken(tm[4], varMap));
    // URL 이 /mis/ 또는 /pms/ 형태인 경우만 포함
    if (!/^\//.test(url)) continue;
    transactions.push({ serviceId, url, inputDs, outputDs, crudType: detectCrudType(serviceId) });
  }

  // 6. 버튼 추출
  const buttons = [];
  const btnRe = /<Button\s+id="([^"]+)"[^>]*text="([^"]+)"/g;
  let bm;
  while ((bm = btnRe.exec(content)) !== null) {
    buttons.push({ id: bm[1], text: bm[2] });
  }

  // 7. Grid 존재 여부 및 binddataset
  const gridMatch = content.match(/<Grid\s[^>]*binddataset="([^"]+)"/);
  const hasGrid = !!gridMatch;
  const gridDataset = gridMatch ? gridMatch[1] : null;

  // 8. 팝업 호출 여부 (fn_popupAfter 분석)
  const popupMatch = script.match(/sPopupId\s*==\s*["']([^"']+M)["']/g);
  const popups = popupMatch
    ? popupMatch.map(m => m.match(/["']([^"']+)["']/)[1])
    : [];

  return {
    sourceName,
    screenTitle: titleMatch ? titleMatch[1] : sourceName,
    gridTitle: gridTitleMatch ? gridTitleMatch[1] : '',
    datasets,
    transactions,
    buttons,
    hasGrid,
    gridDataset,
    popups,
  };
}

module.exports = { parseXfdl };
