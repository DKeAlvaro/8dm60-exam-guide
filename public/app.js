(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storage = {
    get(key, fallback = null) {
      try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
    },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} },
    remove(key) { try { localStorage.removeItem(key); } catch {} }
  };

  // The key can arrive in the URL fragment, which is never sent to the server or Caddy logs.
  const fragment = new URLSearchParams(location.hash.slice(1));
  const fragmentKey = fragment.get('key');
  if (fragmentKey) {
    storage.set('8dm60-owner-key', fragmentKey);
    history.replaceState(null, '', location.pathname + location.search);
  }
  let ownerKey = storage.get('8dm60-owner-key', '');
  let sessionId = storage.get('8dm60-claude-session', '');
  let context = null;
  let activeJob = null;
  let previousFocus = null;

  const drawer = $('#ask-drawer');
  const backdrop = $('#drawer-backdrop');
  const askInput = $('#ask-input');
  const askForm = $('#ask-form');
  const submitButton = $('.submit-ask');
  const statusBox = $('#ask-status');
  const keyPanel = $('#key-panel');

  function updateProgress() {
    const boxes = $$('[data-milestone]');
    const complete = boxes.filter(box => box.checked).length;
    $('#progress-text').textContent = `${complete} / ${boxes.length}`;
    $('#progress-fill').style.width = `${boxes.length ? complete / boxes.length * 100 : 0}%`;
  }

  try {
    const saved = JSON.parse(storage.get('8dm60-milestones', '{}'));
    $$('[data-milestone]').forEach(box => {
      box.checked = Boolean(saved[box.dataset.milestone]);
      box.addEventListener('change', () => {
        const current = JSON.parse(storage.get('8dm60-milestones', '{}'));
        current[box.dataset.milestone] = box.checked;
        storage.set('8dm60-milestones', JSON.stringify(current));
        updateProgress();
      });
    });
  } catch {
    storage.remove('8dm60-milestones');
  }
  updateProgress();

  const navLinks = $$('#topic-nav a');
  const topicObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (!visible.length) return;
    const id = visible[0].target.id;
    navLinks.forEach(link => {
      const active = link.hash === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
  $$('.topic').forEach(topic => topicObserver.observe(topic));

  function setContext(question) {
    if (!question) {
      context = null;
      $('#context-title').textContent = 'Whole guide';
      $('#clear-context').hidden = true;
      return;
    }
    const topic = question.closest('.topic');
    const label = $('.question-meta > span', question)?.textContent || 'Question';
    context = {
      id: question.id,
      topicId: topic.id,
      topic: topic.dataset.topic,
      label,
      question: $('h4', question).textContent.trim(),
      source: question.dataset.source || ''
    };
    $('#context-title').textContent = `${context.topic} · ${label}\n${context.question}`;
    $('#clear-context').hidden = false;
  }

  function openDrawer(question = null) {
    setContext(question);
    previousFocus = document.activeElement;
    drawer.hidden = false;
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    keyPanel.hidden = Boolean(ownerKey);
    statusBox.hidden = true;
    requestAnimationFrame(() => askInput.focus());
  }

  function closeDrawer() {
    drawer.hidden = true;
    backdrop.hidden = true;
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  }

  $$('[data-open-ask]').forEach(button => button.addEventListener('click', () => openDrawer()));
  $$('.ask-trigger').forEach(button => button.addEventListener('click', () => openDrawer(button.closest('.question'))));
  $('#close-ask').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  $('#clear-context').addEventListener('click', () => setContext(null));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !drawer.hidden) closeDrawer();
  });
  $$('.quick-prompts [data-prompt]').forEach(button => button.addEventListener('click', () => {
    askInput.value = button.dataset.prompt;
    askInput.focus();
  }));

  $('#save-key').addEventListener('click', () => {
    ownerKey = $('#key-input').value.trim();
    if (!ownerKey) return;
    storage.set('8dm60-owner-key', ownerKey);
    keyPanel.hidden = true;
    $('#key-input').value = '';
    showStatus('Key saved on this device.', 'success');
  });

  function showStatus(message, type = '') {
    statusBox.textContent = message;
    statusBox.className = `ask-status ${type}`.trim();
    statusBox.hidden = false;
  }

  async function api(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ownerKey}`,
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || `Request failed (${response.status})`);
      error.status = response.status;
      error.jobId = data.jobId;
      throw error;
    }
    return data;
  }

  function preserveView() {
    const returnTo = context?.id || $('.topic')?.id;
    if (returnTo) sessionStorage.setItem('8dm60-return', returnTo);
    const openTopics = $$('.question-bank[open]').map(details => details.closest('.topic').id);
    sessionStorage.setItem('8dm60-open-banks', JSON.stringify(openTopics));
  }

  function restoreView() {
    try {
      const openTopics = JSON.parse(sessionStorage.getItem('8dm60-open-banks') || '[]');
      openTopics.forEach(id => $(`#${CSS.escape(id)} .question-bank`)?.setAttribute('open', ''));
    } catch {}
    const returnTo = sessionStorage.getItem('8dm60-return');
    if (!returnTo) return;
    sessionStorage.removeItem('8dm60-return');
    requestAnimationFrame(() => {
      const target = document.getElementById(returnTo);
      if (!target) return;
      const details = target.closest('details');
      if (details) details.open = true;
      target.scrollIntoView({ block: 'start' });
    });
  }
  restoreView();

  async function pollJob(jobId) {
    const started = Date.now();
    while (activeJob === jobId) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      let job;
      try {
        job = await api(`/api/jobs/${encodeURIComponent(jobId)}`);
      } catch (error) {
        activeJob = null;
        submitButton.disabled = false;
        showStatus(error.message, 'error');
        return;
      }
      const elapsed = Math.round((Date.now() - started) / 1000);
      if (job.state === 'queued' || job.state === 'running') {
        showStatus(`Claude Code is ${job.state}… ${elapsed}s\nThe page will reload if the guide changes.`);
        continue;
      }
      activeJob = null;
      submitButton.disabled = false;
      if (job.state === 'failed') {
        storage.remove('8dm60-claude-session');
        sessionId = '';
        showStatus(job.error || 'Claude Code could not complete the edit.', 'error');
        return;
      }
      if (job.sessionId) {
        sessionId = job.sessionId;
        storage.set('8dm60-claude-session', sessionId);
      }
      if (job.changed) {
        preserveView();
        showStatus(`Guide updated${job.syncWarning ? ` (git warning: ${job.syncWarning})` : ''}. Reloading…`, 'success');
        setTimeout(() => location.reload(), 900);
      } else {
        showStatus(job.result || 'Done. No files changed.', 'success');
      }
      return;
    }
  }

  askForm.addEventListener('submit', async event => {
    event.preventDefault();
    const message = askInput.value.trim();
    if (!message || activeJob) return;
    if (!ownerKey) {
      keyPanel.hidden = false;
      showStatus('Add the owner key before editing.', 'error');
      $('#key-input').focus();
      return;
    }
    submitButton.disabled = true;
    showStatus('Starting Claude Code…');
    try {
      const job = await api('/api/ask', {
        method: 'POST',
        body: JSON.stringify({ message, context, sessionId: sessionId || undefined })
      });
      activeJob = job.id;
      pollJob(job.id);
    } catch (error) {
      submitButton.disabled = false;
      if (error.status === 401) {
        ownerKey = '';
        storage.remove('8dm60-owner-key');
        keyPanel.hidden = false;
      }
      showStatus(error.status === 409 ? 'Claude Code is already editing the guide. Try again shortly.' : error.message, 'error');
    }
  });
})();
