// 毛概题库清洗：maogai_full.json + hgdmy-maogai.json -> 毛概-清洗.json
// 用法: node _tools/maogai_clean.mjs <maogai_full.json> <hgdmy-maogai.json> <输出.json>
import fs from "node:fs";

const [srcFull, srcHgd, outPath] = process.argv.slice(2);
if (!srcFull || !srcHgd || !outPath) {
  console.error("参数: <maogai_full.json> <hgdmy-maogai.json> <输出.json>");
  process.exit(1);
}

const CHAPTERS = ["导论", "第一章", "第二章", "第三章", "第四章", "第五章", "第六章", "第七章", "第八章"];
const TYPE_MAP = { 单选: "single", 多选: "multiple", 判断: "judge", 填空: "fill" };
const normStem = (s) =>
  String(s).replace(/\s+/g, "").replace(/[（(]/g, "(").replace(/[）)]/g, ")")
    .replace(/[，,]/g, ",").toLowerCase();

const clean = (s) => String(s ?? "").replace(/\u3000/g, " ").trim();

function parseLetters(raw, optionsLen) {
  const letters = String(raw).toUpperCase().split(/[、，,\s]+/).filter((ch) => /^[A-H]$/.test(ch));
  return letters.map((ch) => ch.charCodeAt(0) - 65);
}

const anomalies = [];
const full = JSON.parse(fs.readFileSync(srcFull, "utf8"));
const seen = new Set();
const questions = [];
let dupInFull = 0;

for (const q of full) {
  const type = TYPE_MAP[q["题型名称"]];
  const question = clean(q["题干"]);
  if (!type || !question) { anomalies.push(`跳过无效题 ${q["题目ID"]}`); continue; }

  const key = `${type}|${normStem(question)}`;
  if (seen.has(key)) { dupInFull++; continue; }

  let options = [];
  let answer = null;
  if (type === "judge") {
    options = ["正确", "错误"]; // 源数据固定 {A:正确, B:错误}
    answer = [String(q["正确答案"]).trim().toUpperCase() === "A" ? 0 : 1];
  } else if (type === "fill") {
    options = [];
    answer = clean(q["正确答案"]);
    if (!answer) anomalies.push(`填空缺答案 ${q["题目ID"]}`);
  } else {
    const raw = q["选项"] || {};
    options = Object.keys(raw).sort().map((k) => clean(raw[k]).replace(/^[A-H][.、．)）]\s*/, ""));
    const idx = parseLetters(q["正确答案"], options.length);
    if (!idx.length || idx.some((i) => i >= options.length)) {
      anomalies.push(`答案无法匹配选项 ${q["题目ID"]}（${q["正确答案"]}）`);
      continue;
    }
    if (type === "single" && idx.length !== 1) anomalies.push(`单选多答案 ${q["题目ID"]}`);
    if (type === "multiple" && idx.length < 2) anomalies.push(`多选仅${idx.length}个答案 ${q["题目ID"]}`);
    answer = [...new Set(idx)].sort((a, b) => a - b);
  }

  seen.add(key);
  questions.push({
    id: String(q["题目ID"]),
    source: "maogai_full",
    type,
    question,
    options,
    answer,
    chapter: CHAPTERS[Number(q["章节ID"]) - 1] ?? null,
    explanation: clean(q["解析"]),
  });
}

const hgd = JSON.parse(fs.readFileSync(srcHgd, "utf8"));
const hgdList = Array.isArray(hgd) ? hgd : hgd.questions ?? [];
let overlap = 0;
for (let i = 0; i < hgdList.length; i++) {
  const q = hgdList[i];
  const type = { single: "single", multiple: "multiple", judge: "judge" }[q.type];
  const question = clean(q.stem);
  const tag = q.id ?? `#${i + 1}`;
  if (!type || !question) { anomalies.push(`跳过 hgdmy 无效题 ${tag}`); continue; }
  if (seen.has(`${type}|${normStem(question)}`)) { overlap++; continue; }

  // hgdmy 判断题不带 options，与 QuestionBank 前端一致合成 正确/错误
  const options = type === "judge" && !(q.options ?? []).length
    ? ["正确", "错误"]
    : (q.options ?? []).map(clean);

  let answer;
  if (type === "judge") answer = [q.answer === true ? 0 : 1];
  else if (Array.isArray(q.answer)) answer = [...new Set(q.answer)].sort((a, b) => a - b);
  else answer = [q.answer];
  if (answer.some((idx) => idx >= options.length)) {
    anomalies.push(`hgdmy 答案越界 ${tag}（${question.slice(0, 24)}…）`);
    continue;
  }

  seen.add(`${type}|${normStem(question)}`);
  questions.push({
    id: `HGD-${q.id ?? i + 1}`,
    source: "hgdmy",
    type,
    question,
    options,
    answer,
    chapter: null,
    explanation: clean(q.analysis),
  });
}

fs.writeFileSync(outPath, JSON.stringify(questions, null, 2) + "\n", "utf8");

const byType = {}, byCh = {};
for (const q of questions) {
  byType[q.type] = (byType[q.type] || 0) + 1;
  const c = q.chapter ?? "(无章节)";
  byCh[c] = (byCh[c] || 0) + 1;
}
console.log(`输入: maogai_full ${full.length} 题 + hgdmy ${hgdList.length} 题`);
console.log(`输出: ${questions.length} 题 -> ${outPath}`);
console.log(`库内去重: ${dupInFull} | 与 hgdmy 重叠剔除: ${overlap}`);
console.log(`题型: ${JSON.stringify(byType)}`);
console.log(`章节: ${JSON.stringify(byCh)}`);
console.log(`异常 ${anomalies.length} 条:`);
for (const a of anomalies) console.log("  -", a);
