#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Régénère le bloc WEEKS de distance.js à partir de program.json.
//
//   node scripts/extract-program.js
//
// Pour chaque semaine on extrait : index, date, phase (cycleTheme), volume
// total prévu (km) et distance de la sortie longue (km). Le résultat remplace
// le contenu entre les marqueurs « <WEEKS:start> » et « <WEEKS:end> ».
// Aucune dépendance : Node seul.
// ---------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PROGRAM = path.join(ROOT, "program.json");
const TARGET = path.join(ROOT, "distance.js");

const START = "// <WEEKS:start>";
const END = "// <WEEKS:end>";

const round2 = (n) => Math.round(n * 100) / 100;

function isLongRun(session) {
  return session.trainingCategory === "road_long_run" || session.trainingType === "SL";
}

function extract(program) {
  return program
    .map((week) => {
      const sessions = Array.isArray(week.sessions) ? week.sessions : [];
      const longRun = sessions
        .filter(isLongRun)
        .reduce((sum, s) => sum + ((s.stats && s.stats.expectedDistance) || 0), 0);
      return {
        index: week.goalDuration && week.goalDuration.index,
        date: week.weekDate,
        theme: week.context && week.context.cycleTheme,
        total: round2((week.weekStats && week.weekStats.expectedDistance) || 0),
        longRun: round2(longRun),
      };
    })
    .sort((a, b) => a.index - b.index);
}

function format(rows) {
  const lines = rows.map(
    (r) =>
      `  { index: ${r.index}, date: ${r.date}, theme: ${JSON.stringify(r.theme)}, total: ${r.total}, longRun: ${r.longRun} },`
  );
  return `${START}\nconst WEEKS = [\n${lines.join("\n")}\n];\n${END}`;
}

function main() {
  if (!fs.existsSync(PROGRAM)) {
    console.error(`program.json introuvable à ${PROGRAM}`);
    process.exit(1);
  }

  const program = JSON.parse(fs.readFileSync(PROGRAM, "utf8"));
  if (!Array.isArray(program) || program.length === 0) {
    console.error("program.json doit être un tableau non vide de semaines.");
    process.exit(1);
  }

  const rows = extract(program);
  const block = format(rows);

  const source = fs.readFileSync(TARGET, "utf8");
  const startIdx = source.indexOf(START);
  const endIdx = source.indexOf(END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    console.error(`Marqueurs ${START} / ${END} introuvables dans distance.js`);
    process.exit(1);
  }

  const next = source.slice(0, startIdx) + block + source.slice(endIdx + END.length);
  fs.writeFileSync(TARGET, next);

  const themes = [...new Set(rows.map((r) => r.theme))];
  console.log(`✓ ${rows.length} semaines écrites dans distance.js`);
  console.log(`  phases : ${themes.join(", ")}`);
}

main();
