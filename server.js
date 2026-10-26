'use strict';

const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const COURSE_DIR = process.env.COURSE_DIR || '/root/courses/current/8DM60/md';
const PORT = Number(process.env.PORT || 8794);
const HOST = process.env.HOST || '127.0.0.1';
const TOKEN = process.env.GUIDE_TOKEN || '';
const CLAUDE_BIN = process.env.CLAUDE_BIN || '/usr/bin/claude';
const MODEL = process.env.GUIDE_MODEL || 'kimi-k3.1-pro';
const AGENT_TIMEOUT_MS = Number(process.env.AGENT_TIMEOUT_MS || 8 * 60 * 1000);
const SYSTEM_PROMPT = fs.readFileSync(path.join(ROOT, 'AGENT_PROMPT.md'), 'utf8');
const jobs = new Map();
let activeJob = null;

if (!TOKEN) {
  console.error('GUIDE_TOKEN is required');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(body);
}

function authorized(req) {
  const supplied = req.headers.authorization || '';
  const expected = `Bearer ${TOKEN}`;
  if (supplied.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 20 * 1024) throw new Error('Request body is too large');
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('Invalid JSON');
  }
}

function cleanContext(value) {
  if (!value || typeof value !== 'object') return null;
  const text = (input, max) => typeof input === 'string' ? input.slice(0, max) : '';
  const id = text(value.id, 80);
  return {
    id: /^[a-zA-Z][\w-]*$/.test(id) ? id : '',
    topicId: text(value.topicId, 80),
    topic: text(value.topic, 200),
    label: text(value.label, 60),
    question: text(value.question, 2500),
    source: text(value.source, 250)
  };
}

function publicSnapshot() {
  const hash = crypto.createHash('sha256');
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) {
        hash.update(path.relative(PUBLIC_DIR, full));
        hash.update(fs.readFileSync(full));
      }
    }
  }
  walk(PUBLIC_DIR);
  return hash.digest('hex');
}

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`${command} timed out`));
    }, options.timeout || 25000);
    child.stdout.on('data', chunk => { stdout += chunk.toString(); });
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', error => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', code => {
      clearTimeout(timer);
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error((stderr || stdout || `${command} exited ${code}`).trim().slice(0, 1500)));
    });
  });
}

async function commitAndPush(message) {
  await runProcess('git', ['add', '--', 'public']);
  const summary = message.replace(/\s+/g, ' ').replace(/[^\x20-\x7E]/g, '').slice(0, 60).trim();
  await runProcess('git', ['commit', '-m', `guide: ${summary || 'update from ask'}`]);
  await runProcess('git', ['push', 'origin', 'HEAD']);
}

function runClaude(prompt, sessionId, resume) {
  return new Promise((resolve, reject) => {
    const args = [
      '-p',
      '--output-format', 'json',
      '--restricted',
      '--settings', path.join(ROOT, 'agent.settings.json'),
      '--permission-mode', 'acceptEdits',
      '--permission-prompts', 'none',
      '--tools', 'Read,Write,Edit,Glob,Grep',
      '--add-dir', COURSE_DIR,
      '--model', MODEL,
      '--append-system-prompt', SYSTEM_PROMPT,
      '--prompt-suggestions', 'false'
    ];
    if (resume) args.push('--resume', sessionId);
    else args.push('--session-id', sessionId);

    const child = spawn(CLAUDE_BIN, args, {
      cwd: ROOT,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
      stdio: ['pipe', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
      setTimeout(() => child.kill('SIGKILL'), 5000).unref();
    }, AGENT_TIMEOUT_MS);

    child.stdout.on('data', chunk => {
      if (stdout.length < 2 * 1024 * 1024) stdout += chunk.toString();
    });
    child.stderr.on('data', chunk => {
      if (stderr.length < 64 * 1024) stderr += chunk.toString();
    });
    child.on('error', error => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', code => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (timedOut) {
        reject(new Error('Claude Code exceeded the 8-minute edit limit'));
        return;
      }
      let parsed = null;
      try { parsed = JSON.parse(stdout); } catch {}
      if (code !== 0 || parsed?.is_error) {
        const detail = parsed?.result || stderr || stdout || `Claude Code exited with status ${code}`;
        reject(new Error(String(detail).replace(/\x1b\[[0-9;]*m/g, '').slice(0, 4000)));
        return;
      }
      resolve({
        result: parsed?.result || stdout.trim() || 'Done',
        sessionId: parsed?.session_id || sessionId
      });
    });
    child.stdin.on('error', () => {});
    child.stdin.end(prompt);
  });
}

async function runJob(job, input) {
  const before = publicSnapshot();
  const sessionId = input.sessionId || crypto.randomUUID();
  const contextText = input.context ? `\n\nSelected context:\n${JSON.stringify(input.context, null, 2)}` : '\n\nSelected context: whole guide (no individual question selected).';
  const prompt = `${input.message}${contextText}\n\nRemember: perform the requested edit directly in public/, then reply with one short summary.`;

  job.state = 'running';
  job.startedAt = Date.now();
  try {
    const result = await runClaude(prompt, sessionId, Boolean(input.sessionId));
    const changed = before !== publicSnapshot();
    job.changed = changed;
    job.sessionId = result.sessionId;
    job.result = result.result;
    if (changed) {
      try {
        await commitAndPush(input.message);
      } catch (error) {
        job.syncWarning = error.message;
        console.error(`[${job.id}] git sync failed: ${error.message}`);
      }
    }
    job.state = 'done';
  } catch (error) {
    job.state = 'failed';
    job.error = error.message;
    console.error(`[${job.id}] Claude Code failed: ${error.message}`);
  } finally {
    job.finishedAt = Date.now();
    activeJob = null;
  }
}

async function serveStatic(req, res, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch {
    sendJson(res, 400, { error: 'Invalid path' });
    return;
  }
  if (decoded.includes('\0')) {
    sendJson(res, 400, { error: 'Invalid path' });
    return;
  }
  const requested = decoded === '/' ? '/index.html' : decoded;
  const file = path.resolve(PUBLIC_DIR, `.${requested}`);
  if (file !== PUBLIC_DIR && !file.startsWith(`${PUBLIC_DIR}${path.sep}`)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }
  try {
    const stat = await fsp.stat(file);
    if (!stat.isFile()) throw new Error('Not a file');
    const ext = path.extname(file).toLowerCase();
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': ['.html', '.css', '.js'].includes(ext) ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff'
    };
    res.writeHead(200, headers);
    if (req.method === 'HEAD') res.end();
    else fs.createReadStream(file).pipe(res);
  } catch {
    sendJson(res, 404, { error: 'Not found' });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/api/health') {
      sendJson(res, 200, { ok: true, busy: Boolean(activeJob) });
      return;
    }
    if (url.pathname === '/api/ask' && req.method === 'POST') {
      if (!authorized(req)) {
        sendJson(res, 401, { error: 'Valid owner key required' });
        return;
      }
      if (activeJob) {
        sendJson(res, 409, { error: 'An edit is already running', jobId: activeJob });
        return;
      }
      const input = await readJson(req);
      input.message = typeof input.message === 'string' ? input.message.trim() : '';
      if (!input.message || input.message.length > 4000) {
        sendJson(res, 400, { error: 'Message must contain 1–4000 characters' });
        return;
      }
      if (input.sessionId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.sessionId)) {
        sendJson(res, 400, { error: 'Invalid session ID' });
        return;
      }
      input.context = cleanContext(input.context);
      const job = { id: crypto.randomUUID(), state: 'queued', createdAt: Date.now() };
      jobs.set(job.id, job);
      activeJob = job.id;
      runJob(job, input);
      sendJson(res, 202, { id: job.id, state: job.state });
      return;
    }
    const jobMatch = url.pathname.match(/^\/api\/jobs\/([0-9a-f-]{36})$/i);
    if (jobMatch && req.method === 'GET') {
      if (!authorized(req)) {
        sendJson(res, 401, { error: 'Valid owner key required' });
        return;
      }
      const job = jobs.get(jobMatch[1]);
      if (!job) {
        sendJson(res, 404, { error: 'Job not found' });
        return;
      }
      sendJson(res, 200, job);
      return;
    }
    if ((req.method === 'GET' || req.method === 'HEAD') && !url.pathname.startsWith('/api/')) {
      await serveStatic(req, res, url.pathname);
      return;
    }
    sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    sendJson(res, 400, { error: error.message || 'Bad request' });
  }
});

server.on('clientError', (error, socket) => socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'));
server.listen(PORT, HOST, () => console.log(`8DM60 guide listening on http://${HOST}:${PORT}`));

setInterval(() => {
  const cutoff = Date.now() - 60 * 60 * 1000;
  for (const [id, job] of jobs) if ((job.finishedAt || job.createdAt) < cutoff) jobs.delete(id);
}, 10 * 60 * 1000).unref();
