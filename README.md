# 8DM60 exam guide

A deliberately sparse exam skeleton for **8DM60 Multimodal AI in Biomedicine**. It starts with topics, subtitles, possible exam questions, and pass milestones. Explanations and UI changes are added only when Álvaro asks Claude Code from the page.

## Architecture

- `public/`: the complete static guide; no framework or build step.
- `server.js`: dependency-free Node server, owner-key authentication, background Claude Code jobs, and git snapshots.
- `AGENT_PROMPT.md`: editing contract passed to Claude Code.
- `deploy/`: systemd and Caddy configuration.
- Course references stay outside this repository at `/root/courses/current/8DM60/md/` on the VPS.

The browser never receives model credentials. A request starts real Claude Code in restricted, non-interactive mode with read/write/edit tools. Claude edits `public/`; the backend detects changes, commits them, and pushes them. The page reloads after a completed edit.

## Local checks

```sh
npm test
```

No `npm install` is needed.

## Run

```sh
GUIDE_TOKEN='replace-me' node server.js
```

Defaults to `127.0.0.1:8794`. Optional environment variables: `HOST`, `PORT`, `COURSE_DIR`, `CLAUDE_BIN`, `GUIDE_MODEL`, `AGENT_TIMEOUT_MS`.

## Editing from the browser

Open the owner URL containing `#key=...` once. The key is moved to localStorage and removed from the address bar. It is required only for `/api/ask` and `/api/jobs/*`; the guide itself is readable without it.

Choose **Ask** on a question to give Claude Code that exact context, or **Ask Claude Code** for a whole-guide/UI request. Follow-up requests resume the browser's Claude Code session.

## Source

Initial questions come from the course's guided self-study problem sets and Mentimeter recall questions. Lecture 7 is excluded because the course states it is not exam material.
