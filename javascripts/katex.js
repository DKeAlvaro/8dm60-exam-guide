function renderGuideMath(root = document.body) {
  if (typeof renderMathInElement !== 'function' || !root) return;
  renderMathInElement(root, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true }
    ],
    ignoredClasses: ['md-search', 'md-header'],
    throwOnError: false
  });
}

if (typeof document$ !== 'undefined') {
  document$.subscribe(({ body }) => renderGuideMath(body));
}
renderGuideMath();
