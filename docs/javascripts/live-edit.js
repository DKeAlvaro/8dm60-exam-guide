(() => {
  'use strict';

  function boot() {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
    const storage = {
      get(key, fallback = null) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
      set(key, value) { try { localStorage.setItem(key, value); } catch {} },
      remove(key) { try { localStorage.removeItem(key); } catch {} }
    };

    const fragment = new URLSearchParams(location.hash.slice(1));
    if (fragment.get('key')) {
      storage.set('8dm60-owner-key', fragment.get('key'));
      history.replaceState(null, '', location.pathname + location.search);
    }
    let ownerKey = storage.get('8dm60-owner-key', '');
    let sessionId = storage.get('8dm60-claude-session', '');
    let context = null;
    let activeJob = null;
    let previousFocus = null;

    // MkDocs task lists become persistent milestones rather than disabled decorations.
    const progressKey = `8dm60-progress:${location.pathname}`;
    let savedProgress = {};
    try { savedProgress = JSON.parse(storage.get(progressKey, '{}')); } catch {}
    const milestoneBoxes = $$('.md-typeset .task-list-item input[type="checkbox"]');
    const progressLabel = document.createElement('div');
    progressLabel.className = 'milestone-progress';
    function updateMilestones() {
      const complete = milestoneBoxes.filter(box => box.checked).length;
      progressLabel.textContent = `${complete} / ${milestoneBoxes.length} reached on this page`;
      milestoneBoxes.forEach((box, index) => {
        box.closest('.task-list-item')?.classList.toggle('task-done', box.checked);
        savedProgress[index] = box.checked;
      });
      storage.set(progressKey, JSON.stringify(savedProgress));
    }
    milestoneBoxes.forEach((box, index) => {
      box.disabled = false;
      box.checked = Boolean(savedProgress[index]);
      box.addEventListener('change', updateMilestones);
    });
    const milestoneHeading = $('#milestones');
    if (milestoneHeading && milestoneBoxes.length) {
      milestoneHeading.after(progressLabel);
      updateMilestones();
    }

    // Every question is a normal Markdown h3 with an ID and course source.
    $$('.md-typeset h3[id][data-source]').forEach(heading => {
      heading.classList.add('question-heading');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'question-ask';
      button.textContent = 'Ask';
      button.setAttribute('aria-label', `Ask Claude Code about ${heading.id}`);
      button.addEventListener('click', () => openDrawer(heading));
      heading.prepend(button);
    });

    const ui = document.createElement('div');
    ui.innerHTML = `
      <button id="ask-toggle" type="button"><span class="dot"></span>Ask Claude Code</button>
      <div id="ask-backdrop" hidden></div>
      <aside id="ask-panel" role="dialog" aria-modal="true" aria-labelledby="ask-title" hidden>
        <header class="ask-head">
          <div class="ask-head-text"><strong id="ask-title">Build this guide</strong><span>Claude Code edits the Markdown directly</span></div>
          <button id="ask-close" class="ask-btn" type="button" aria-label="Close">×</button>
        </header>
        <div class="ask-body">
          <div id="ask-context" class="ask-context"><span>CONTEXT</span><strong id="ask-context-title">Whole guide</strong><button id="ask-clear" type="button" hidden>Clear</button></div>
          <div class="ask-quick">
            <button type="button" data-prompt="Explain this from zero, using only the course material. Add the explanation here.">From zero</button>
            <button type="button" data-prompt="Add a small visual that makes this question easier to understand.">Add a visual</button>
            <button type="button" data-prompt="Turn this into a short active-recall check with a hidden answer.">Quiz me</button>
          </div>
          <form id="ask-form">
            <label for="ask-input">What should Claude Code add or change?</label>
            <textarea id="ask-input" rows="6" maxlength="4000" placeholder="Ask about this question, or request any UI change…" required></textarea>
            <button class="ask-submit" type="submit">Edit the guide <span>↗</span></button>
          </form>
          <div id="ask-status" role="status" aria-live="polite" hidden></div>
          <div id="ask-key-panel" hidden>
            <label for="ask-key">Owner key</label>
            <input id="ask-key" type="password" autocomplete="current-password" placeholder="Required only for editing">
            <button id="ask-save-key" type="button">Save on this device</button>
            <p>The key stays in this browser. Course content remains public.</p>
          </div>
          <p class="ask-note">The guide stays sparse until you ask. Each completed edit is built and saved automatically.</p>
        </div>
      </aside>`;
    document.body.appendChild(ui);

    const panel = $('#ask-panel');
    const backdrop = $('#ask-backdrop');
    const input = $('#ask-input');
    const submit = $('.ask-submit');
    const status = $('#ask-status');
    const keyPanel = $('#ask-key-panel');

    function questionContext(heading) {
      const clone = heading.cloneNode(true);
      clone.querySelectorAll('.question-ask,.headerlink').forEach(el => el.remove());
      const filename = location.pathname.split('/').pop() || 'index.html';
      return {
        id: heading.id,
        topicId: location.pathname,
        topic: $('.md-typeset h1')?.textContent.replace('#', '').trim() || document.title,
        label: clone.textContent.split('—')[0].trim(),
        question: clone.textContent.trim(),
        source: heading.dataset.source || '',
        file: `docs/${filename.replace(/\.html?$/, '') || 'index'}.md`
      };
    }

    function setContext(heading) {
      context = heading ? questionContext(heading) : null;
      $('#ask-context-title').textContent = context ? `${context.topic}\n${context.question}` : 'Whole guide';
      $('#ask-clear').hidden = !context;
    }

    function openDrawer(heading = null) {
      setContext(heading);
      previousFocus = document.activeElement;
      panel.hidden = false;
      backdrop.hidden = false;
      requestAnimationFrame(() => {
        panel.classList.add('open');
        document.body.style.overflow = 'hidden';
        input.focus();
      });
      keyPanel.hidden = Boolean(ownerKey);
      status.hidden = true;
    }

    function closeDrawer() {
      panel.classList.remove('open');
      backdrop.hidden = true;
      document.body.style.overflow = '';
      setTimeout(() => { panel.hidden = true; }, 220);
      previousFocus?.focus();
    }

    $('#ask-toggle').addEventListener('click', () => openDrawer());
    $('#ask-close').addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    $('#ask-clear').addEventListener('click', () => setContext(null));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !panel.hidden) closeDrawer();
    });
    $$('.ask-quick [data-prompt]').forEach(button => button.addEventListener('click', () => {
      input.value = button.dataset.prompt;
      input.focus();
    }));

    function showStatus(message, type = '') {
      status.textContent = message;
      status.className = type;
      status.hidden = false;
    }

    $('#ask-save-key').addEventListener('click', () => {
      ownerKey = $('#ask-key').value.trim();
      if (!ownerKey) return;
      storage.set('8dm60-owner-key', ownerKey);
      $('#ask-key').value = '';
      keyPanel.hidden = true;
      showStatus('Key saved on this device.', 'success');
    });

    async function api(path, options = {}) {
      const response = await fetch(path, {
        ...options,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ownerKey}`, ...(options.headers || {}) }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(data.error || `Request failed (${response.status})`);
        error.status = response.status;
        throw error;
      }
      return data;
    }

    async function pollJob(jobId) {
      const started = Date.now();
      while (activeJob === jobId) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        let job;
        try { job = await api(`/api/jobs/${encodeURIComponent(jobId)}`); }
        catch (error) {
          activeJob = null;
          submit.disabled = false;
          showStatus(error.message, 'error');
          return;
        }
        if (job.state === 'queued' || job.state === 'running') {
          showStatus(`Claude Code is ${job.state}… ${Math.round((Date.now() - started) / 1000)}s\nThe page will reload after the Markdown is rebuilt.`);
          continue;
        }
        activeJob = null;
        submit.disabled = false;
        if (job.state === 'failed') {
          sessionId = '';
          storage.remove('8dm60-claude-session');
          showStatus(job.error || 'Claude Code could not complete the edit.', 'error');
          return;
        }
        if (job.sessionId) {
          sessionId = job.sessionId;
          storage.set('8dm60-claude-session', sessionId);
        }
        if (job.changed) {
          if (context?.id) sessionStorage.setItem('8dm60-return', context.id);
          showStatus(`Guide updated${job.syncWarning ? ` (git warning: ${job.syncWarning})` : ''}. Reloading…`, 'success');
          setTimeout(() => location.reload(), 900);
        } else {
          showStatus(job.result || 'Done. No files changed.', 'success');
        }
        return;
      }
    }

    const returnTo = sessionStorage.getItem('8dm60-return');
    if (returnTo) {
      sessionStorage.removeItem('8dm60-return');
      requestAnimationFrame(() => document.getElementById(returnTo)?.scrollIntoView({ block: 'start' }));
    }

    $('#ask-form').addEventListener('submit', async event => {
      event.preventDefault();
      const message = input.value.trim();
      if (!message || activeJob) return;
      if (!ownerKey) {
        keyPanel.hidden = false;
        showStatus('Add the owner key before editing.', 'error');
        $('#ask-key').focus();
        return;
      }
      submit.disabled = true;
      showStatus('Starting Claude Code…');
      try {
        const job = await api('/api/ask', {
          method: 'POST',
          body: JSON.stringify({ message, context, sessionId: sessionId || undefined })
        });
        activeJob = job.id;
        pollJob(job.id);
      } catch (error) {
        submit.disabled = false;
        if (error.status === 401) {
          ownerKey = '';
          storage.remove('8dm60-owner-key');
          keyPanel.hidden = false;
        }
        showStatus(error.status === 409 ? 'Claude Code is already editing the guide. Try again shortly.' : error.message, 'error');
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
