'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const localBinary = path.join(root, '.venv', process.platform === 'win32' ? 'Scripts' : 'bin', process.platform === 'win32' ? 'mkdocs.exe' : 'mkdocs');
const command = process.env.MKDOCS_BIN || (fs.existsSync(localBinary) ? localBinary : 'mkdocs');
const result = spawnSync(command, ['build', '--clean'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32' && command === 'mkdocs'
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
