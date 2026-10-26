'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
const errors = [];

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const uniqueIds = new Set(ids);
if (ids.length !== uniqueIds.size) {
  const seen = new Set();
  const duplicates = ids.filter(id => seen.size === seen.add(id).size);
  errors.push(`Duplicate IDs: ${[...new Set(duplicates)].join(', ')}`);
}

const questions = [...html.matchAll(/<article class="question"[\s\S]*?<\/article>/g)].map(match => match[0]);
if (questions.length < 60) errors.push(`Expected at least 60 skeleton questions, found ${questions.length}`);
questions.forEach((question, index) => {
  if (!/\bid="[^"]+"/.test(question)) errors.push(`Question ${index + 1} has no ID`);
  if (!/<h4>[\s\S]+?<\/h4>/.test(question)) errors.push(`Question ${index + 1} has no prompt`);
  if (!/<div class="response"><\/div>/.test(question) && !/<div class="response">[\s\S]+<\/div>/.test(question)) errors.push(`Question ${index + 1} has no response container`);
  if (!/class="ask-trigger"/.test(question)) errors.push(`Question ${index + 1} has no Ask control`);
});

const milestones = [...html.matchAll(/data-milestone="([^"]+)"/g)].map(match => match[1]);
if (milestones.length !== 35) errors.push(`Expected 35 milestones, found ${milestones.length}`);
if (new Set(milestones).size !== milestones.length) errors.push('Milestone IDs are not unique');

for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  if (!uniqueIds.has(match[1])) errors.push(`Broken local link: #${match[1]}`);
}
for (const match of html.matchAll(/<section class="topic[^"]*" id="([^"]+)"/g)) {
  if (!html.includes(`href="#${match[1]}"`)) errors.push(`Topic has no navigation link: ${match[1]}`);
}

for (const file of ['server.js', 'public/app.js', 'scripts/verify.js']) {
  try { execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'pipe' }); }
  catch (error) { errors.push(`${file}: ${error.stderr}`); }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Verified ${questions.length} questions, ${milestones.length} milestones, ${uniqueIds.size} unique IDs, and JavaScript syntax.`);
