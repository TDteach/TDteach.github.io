/* Archive enhancement only; every issue remains reachable without JavaScript. */
(() => {
  const archive = document.querySelector('[data-pn-archive]');
  if (!archive) return;
  const search = archive.querySelector('[data-pn-search]');
  const empty = archive.querySelector('[data-pn-empty]');
  const months = [...archive.querySelectorAll('.pn-archive-month')];
  const normalize = value => value.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  let savedOpen = null;
  search.addEventListener('input', () => {
    const query = normalize(search.value);
    if (query && !savedOpen) savedOpen = months.map(month => month.open);
    let visible = 0;
    months.forEach((month, index) => {
      let matches = 0;
      month.querySelectorAll('.pn-archive-row').forEach(row => {
        const haystack = normalize(row.dataset.search || row.textContent);
        const match = !query || query.split(' ').every(word => haystack.includes(word));
        row.hidden = !match;
        if (match) matches += 1;
      });
      month.hidden = matches === 0;
      if (query) month.open = matches > 0;
      else if (savedOpen) month.open = savedOpen[index];
      visible += matches;
    });
    empty.hidden = visible > 0;
    if (!query) savedOpen = null;
  });
})();
