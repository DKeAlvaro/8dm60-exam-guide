'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const errors = [];
const topicFiles = ['language.md', 'vision.md', 'omics.md', 'hospital.md', 'workflow.md', 'agents.md', 'project.md'];
const config = fs.readFileSync(path.join(root, 'mkdocs.yml'), 'utf8');
let questionCount = 0;
let milestoneCount = 0;
let responseCount = 0;
const ids = new Set();

for (const file of topicFiles) {
  const full = path.join(root, 'docs', file);
  if (!fs.existsSync(full)) {
    errors.push(`Missing topic: docs/${file}`);
    continue;
  }
  const markdown = fs.readFileSync(full, 'utf8');
  if (!config.includes(`: ${file}`)) errors.push(`Topic is missing from MkDocs nav: ${file}`);
  milestoneCount += (markdown.match(/^- \[ \] /gm) || []).length;
  responseCount += (markdown.match(/<div class="response"(?: markdown)?><\/div>|<div class="response"(?: markdown)?>[\s\S]*?<\/div>/g) || []).length;

  const heading = /^### (?:OPEN|RECALL|CASE|PROJECT) · Q\d+ — .+ \{#([a-z][\w-]*) data-source="([^"]+)"\}\s*$/gm;
  let match;
  while ((match = heading.exec(markdown))) {
    questionCount++;
    if (ids.has(match[1])) errors.push(`Duplicate question ID: ${match[1]}`);
    ids.add(match[1]);
    if (!match[2].trim()) errors.push(`Question ${match[1]} has no source`);
    const remainder = markdown.slice(heading.lastIndex);
    if (!/^\s*<div class="response"(?: markdown)?>/.test(remainder)) errors.push(`Question ${match[1]} has no immediate response block`);
  }
}

if (questionCount !== 66) errors.push(`Expected 66 skeleton questions, found ${questionCount}`);
if (milestoneCount !== 35) errors.push(`Expected 35 milestones, found ${milestoneCount}`);
if (responseCount !== questionCount) errors.push(`Question/response mismatch: ${questionCount} questions, ${responseCount} responses`);

for (const file of ['server.js', 'docs/javascripts/live-edit.js', 'docs/javascripts/katex.js', 'scripts/verify.js']) {
  try { execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'pipe' }); }
  catch (error) { errors.push(`${file}: ${error.stderr}`); }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Verified ${topicFiles.length} Markdown topics, ${questionCount} questions, ${milestoneCount} milestones, and JavaScript syntax.`);
