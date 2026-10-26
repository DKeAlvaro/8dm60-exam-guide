# 8DM60 exam guide

A deliberately sparse **MkDocs Material** exam skeleton for **8DM60 Multimodal AI in Biomedicine**. It starts with Markdown topic pages, possible exam questions, and pass milestones. Explanations and UI changes are added only when Álvaro asks Claude Code from the page.

## Architecture

- `docs/*.md`: one Markdown page per topic; generated explanations live in each question's `response` block.
- `docs/javascripts/live-edit.js`: question context, owner-key handling, and Claude Code job polling.
- `docs/stylesheets/`: the same Material visual language as the 5CTA0 guide.
- `mkdocs.yml`: Material theme, navigation, Markdown extensions, and KaTeX.
- `server.js`: dependency-free Node static server, authenticated Claude Code jobs, verification, MkDocs builds, and git snapshots.
- `AGENT_PROMPT.md`: editing contract passed to Claude Code.
- `site/`: generated output, ignored by git and rebuilt automatically.

The browser never receives model credentials. A request starts real Claude Code in restricted, non-interactive mode with read/write/edit tools. Claude edits the Markdown/MkDocs source; the backend validates it, runs `mkdocs build --clean`, commits, and pushes. The page reloads after a completed edit. `agent.settings.json` connects to the VPS's existing Claude Code router; no API key is stored in this repository.

## Local checks

```sh
npm test
```

Requires Node 20+, Python, and `mkdocs-material`. There are no Node dependencies to install.

## Run

```sh
mkdocs build --clean
GUIDE_TOKEN='replace-me' MKDOCS_BIN='mkdocs' node server.js
```

Defaults to `127.0.0.1:8794`. Optional environment variables: `HOST`, `PORT`, `COURSE_DIR`, `CLAUDE_BIN`, `GUIDE_MODEL`, `AGENT_TIMEOUT_MS`.

## Editing from the browser

Open the owner URL containing `#key=...` once. The key is moved to localStorage and removed from the address bar. It is required only for `/api/ask` and `/api/jobs/*`; the guide itself is readable without it.

Choose **Ask** on a question to give Claude Code that exact Markdown file, heading ID, and course source. Highlight any passage for an **Ask about this** bubble with that passage as context. The floating bubble (drag it anywhere) opens the panel for whole-guide/UI requests. The panel's MODEL row picks the model and provider for the job — the list comes from the local Claude router (`/api/models`, PrimaLabs + Moonshot) and is remembered per device. Follow-up requests resume the browser's Claude Code session.

## Source

Initial questions come from the course's guided self-study problem sets and Mentimeter recall questions. Lecture 7 is excluded because the course states it is not exam material.
