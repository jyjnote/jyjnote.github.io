(() => {
  'use strict';
  const template = document.getElementById('blog-insights-template');
  if (!template || document.querySelector('.bi')) return;
  const normalize = (path) => path.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  if (normalize(location.pathname) !== normalize(template.dataset.home)) return;
  const root = template.content.firstElementChild.cloneNode(true);
  const main = document.querySelector('main') || document.getElementById('core-wrapper');
  if (!main) return;
  const panel = document.getElementById('panel-wrapper');
  const media = matchMedia('(min-width: 1200px)');
  function mount() {
    if (media.matches && panel) panel.append(root);
    else {
      const tree = main.querySelector('.truthmap');
      if (tree) tree.after(root);
      else main.prepend(root);
    }
  }
  mount();
  media.addEventListener('change', mount);
  const find = (name) => root.querySelector(`[data-bi="${name}"]`);
  const number = (value) => value.toLocaleString('ko-KR');
  const dayMs = 86400000;
  const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
  const parseDay = (date) => {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NaN;
    const ms = Date.parse(date + 'T00:00:00Z');
    return Number.isFinite(ms) && iso(ms) === date ? ms : NaN;
  };
  const todayParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const part = (type) => todayParts.find((item) => item.type === type).value;
  const today = `${part('year')}-${part('month')}-${part('day')}`;
  const todayMs = parseDay(today);
  const koreanDay = (date) => `${Number(date.slice(5, 7))}월 ${Number(date.slice(8))}일`;
  const validCount = (count) => Number.isSafeInteger(count) && count >= 0;

  async function load(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error('data unavailable');
      return await response.json();
    } finally { clearTimeout(timer); }
  }

  function renderPosts(data) {
    if (!Array.isArray(data.posts)) throw new Error('invalid posts');
    const posts = new Map();
    for (const post of data.posts) {
      const dateMs = parseDay(post.date);
      const published = Date.parse(post.published_at);
      if (!Number.isFinite(dateMs) || dateMs > todayMs || !Number.isFinite(published) || published > Date.now()) continue;
      if (typeof post.title !== 'string' || typeof post.url !== 'string') continue;
      const url = new URL(post.url, location.href);
      if (url.origin !== location.origin) continue;
      if (!posts.has(post.date)) posts.set(post.date, []);
      posts.get(post.date).push({ title: post.title, url: url.href });
    }
    const mondayOffset = (new Date(todayMs).getUTCDay() + 6) % 7;
    const start = todayMs - (mondayOffset + 15 * 7) * dayMs;
    let total = 0, active = 0, streak = 0, longest = 0;
    for (let date = start; date <= todayMs; date += dayMs) {
      const count = (posts.get(iso(date)) || []).length;
      total += count;
      if (count) { active++; streak++; longest = Math.max(longest, streak); }
      else streak = 0;
    }
    find('post-total').textContent = number(total);
    find('post-caption').textContent = `${koreanDay(iso(start))} — ${koreanDay(today)} · 최근 16주`;
    find('active-days').textContent = `${number(active)}일`;
    find('streak').textContent = `${number(longest)}일`;
    const weekdays = document.createElement('div'); weekdays.className = 'bi-weekdays';
    for (const label of ['', '월', '', '수', '', '금', '', '일']) {
      const span = document.createElement('span'); span.textContent = label; weekdays.append(span);
    }
    const body = document.createElement('div'); body.className = 'bi-calendar-body';
    const months = document.createElement('div'); months.className = 'bi-months';
    let lastMonth = '';
    for (let week = 0; week < 16; week++) {
      const date = iso(start + week * 7 * dayMs);
      const month = date.slice(0, 7);
      const span = document.createElement('span');
      if (month !== lastMonth) { span.textContent = `${Number(date.slice(5, 7))}월`; lastMonth = month; }
      months.append(span);
    }
    const cells = document.createElement('div'); cells.className = 'bi-cells';
    const buttons = [];
    let selected = null;
    function closeDetail() {
      find('day-detail').hidden = true;
      if (selected) { selected.setAttribute('aria-pressed', 'false'); selected.focus(); selected = null; }
    }
    root.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDetail(); });
    for (let i = 0; i < 112; i++) {
      const dateMs = start + i * dayMs, date = iso(dateMs);
      const items = posts.get(date) || [];
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'bi-cell';
      button.dataset.level = Math.min(items.length, 4);
      button.dataset.date = date;
      button.disabled = dateMs > todayMs;
      button.tabIndex = date === today ? 0 : -1;
      button.title = `${date} · 게시글 ${items.length}편`;
      button.setAttribute('aria-label', button.title);
      button.setAttribute('aria-pressed', 'false');
      if (date === today) button.classList.add('is-today');
      button.addEventListener('focus', () => {
        buttons.forEach((item) => { item.tabIndex = item === button ? 0 : -1; });
        find('post-hint').textContent = `${koreanDay(date)} · ${items.length ? `게시글 ${items.length}편` : '잠시 쉬어간 날'}`;
      });
      button.addEventListener('mouseenter', () => { find('post-hint').textContent = `${koreanDay(date)} · 게시글 ${items.length}편`; });
      button.addEventListener('click', () => {
        if (selected === button && !find('day-detail').hidden) { closeDetail(); return; }
        if (selected) selected.setAttribute('aria-pressed', 'false');
        selected = button; button.setAttribute('aria-pressed', 'true');
        const detail = find('day-detail'); detail.replaceChildren(); detail.hidden = false;
        const heading = document.createElement('div'); heading.className = 'bi-detail-title';
        const label = document.createElement('strong'); label.textContent = `${koreanDay(date)} · ${items.length}편`;
        const close = document.createElement('button'); close.className = 'bi-close'; close.type = 'button'; close.textContent = '×'; close.setAttribute('aria-label', '작성한 글 목록 닫기'); close.addEventListener('click', closeDetail);
        heading.append(label, close); detail.append(heading);
        for (const post of items) {
          const link = document.createElement('a'); link.href = post.url; link.textContent = post.title; detail.append(link);
        }
        if (!items.length) { const p = document.createElement('p'); p.textContent = '이날은 작성한 글이 없습니다.'; detail.append(p); }
      });
      button.addEventListener('keydown', (event) => {
        const moves = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };
        if (!(event.key in moves)) return;
        const target = buttons[i + moves[event.key]];
        if (target && !target.disabled) { event.preventDefault(); target.focus(); }
      });
      buttons.push(button); cells.append(button);
    }
    body.append(months, cells); find('calendar').replaceChildren(weekdays, body);
  }

  const ns = 'http://www.w3.org/2000/svg';
  function svgNode(tag, attrs = {}, value) {
    const node = document.createElementNS(ns, tag);
    for (const [key, val] of Object.entries(attrs)) node.setAttribute(key, val);
    if (value !== undefined) node.textContent = value;
    return node;
  }
  function makeChart(days) {
    const chart = find('chart'); chart.replaceChildren();
    const svg = svgNode('svg', { viewBox: '0 0 240 117', role: 'group', 'aria-label': '최근 30일 방문 기록. 방향키로 날짜를 이동할 수 있습니다.' });
    chart.append(svg);
    const values = days.filter((item) => item.visits !== null).map((item) => item.visits);
    const maximum = Math.max(1, ...values);
    const unit = Math.pow(10, Math.floor(Math.log10(maximum)));
    const ceiling = Math.max(2, Math.ceil(maximum / (2 * unit)) * 2 * unit);
    const x = (i) => 27 + (208 * i / 29), y = (count) => 87 - (count / ceiling) * 70;
    for (const value of [0, ceiling / 2, ceiling]) {
      const rowY = y(value);
      svg.append(svgNode('line', { x1: 27, x2: 235, y1: rowY, y2: rowY, class: 'bi-grid-line' }));
      svg.append(svgNode('text', { x: 19, y: rowY + 3, 'text-anchor': 'end' }, number(Math.round(value))));
    }
    const labels = days.length ? [koreanDay(days[0].date), koreanDay(days[29].date)] : ['30일 전', '최근 집계'];
    svg.append(svgNode('text', { x: 27, y: 109 }, labels[0]));
    svg.append(svgNode('text', { x: 235, y: 109, 'text-anchor': 'end' }, labels[1]));
    if (!values.length) return;
    const defs = svgNode('defs');
    const gradient = svgNode('linearGradient', { id: 'bi-visit-gradient', x1: 0, x2: 0, y1: 0, y2: 1 });
    gradient.append(svgNode('stop', { offset: '0%', 'stop-color': 'var(--bi-teal)', 'stop-opacity': '.27' }), svgNode('stop', { offset: '100%', 'stop-color': 'var(--bi-teal)', 'stop-opacity': '.015' }));
    defs.append(gradient); svg.append(defs);
    let segment = [];
    function flush() {
      if (!segment.length) return;
      const line = segment.map((point, i) => `${i ? 'L' : 'M'}${point[0].toFixed(2)},${point[1].toFixed(2)}`).join(' ');
      const first = segment[0], last = segment[segment.length - 1];
      svg.append(svgNode('path', { d: `${line} L${last[0]},87 L${first[0]},87 Z`, fill: 'url(#bi-visit-gradient)' }));
      svg.append(svgNode('path', { d: line, class: 'bi-chart-line' }));
      if (segment.length === 1) svg.append(svgNode('circle', { cx: first[0], cy: first[1], r: 2, fill: 'var(--bi-teal)' }));
      segment = [];
    }
    days.forEach((day, i) => { if (day.visits === null) flush(); else segment.push([x(i), y(day.visits)]); });
    flush();
    const focusLine = svgNode('line', { y1: 12, y2: 87, class: 'bi-focus-line', visibility: 'hidden', 'pointer-events': 'none' });
    const dot = svgNode('circle', { r: 3.5, class: 'bi-focus-dot', visibility: 'hidden', 'pointer-events': 'none' });
    svg.append(focusLine, dot);
    const hits = [];
    days.forEach((day, i) => {
      const hit = svgNode('rect', { x: Math.max(24, x(i) - 3.7), y: 0, width: 7.4, height: 94, class: 'bi-chart-hit', tabindex: i === 29 ? 0 : -1, role: 'button', 'aria-label': `${day.date} · ${day.visits === null ? '집계 전' : `${day.visits}회 방문`}` });
      function select() {
        find('chart-readout').textContent = `${koreanDay(day.date)} · ${day.visits === null ? '집계 전' : `${number(day.visits)}회 방문`}`;
        const visible = day.visits === null ? 'hidden' : 'visible';
        focusLine.setAttribute('visibility', visible); dot.setAttribute('visibility', visible);
        focusLine.setAttribute('x1', x(i)); focusLine.setAttribute('x2', x(i)); dot.setAttribute('cx', x(i)); dot.setAttribute('cy', y(day.visits || 0));
      }
      hit.addEventListener('mouseenter', select); hit.addEventListener('focus', () => { hits.forEach((item) => item.setAttribute('tabindex', item === hit ? 0 : -1)); select(); });
      hit.addEventListener('click', select);
      hit.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault(); hits[Math.max(0, Math.min(29, i + (event.key === 'ArrowLeft' ? -1 : 1)))].focus();
        }
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); }
      });
      hits.push(hit); svg.append(hit);
    });
    chart.addEventListener('mouseleave', () => { focusLine.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); });
  }

  function renderVisits(data) {
    if (data.status !== 'ready') { renderEmpty('통계 연결 대기'); return; }
    if (!Array.isArray(data.days) || !Number.isFinite(parseDay(data.end_date)) || !Number.isFinite(Date.parse(data.updated_at))) throw new Error('invalid visits');
    const end = Math.min(parseDay(data.end_date), todayMs);
    const counts = new Map();
    data.days.forEach((day) => {
      if (!Number.isFinite(parseDay(day.date)) || !(day.visits === null || validCount(day.visits)) || counts.has(day.date)) throw new Error('invalid day');
      counts.set(day.date, day.visits);
    });
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = iso(end - (29 - i) * dayMs);
      return { date, visits: counts.get(date) ?? null };
    });
    const known = days.filter((day) => day.visits !== null);
    if (!known.length) { renderEmpty('집계된 기록이 없습니다'); return; }
    const total = known.reduce((sum, day) => sum + day.visits, 0);
    find('visit-total').textContent = number(total);
    find('average').textContent = (total / known.length).toLocaleString('ko-KR', { maximumFractionDigits: 1 });
    find('peak').textContent = number(Math.max(...known.map((day) => day.visits)));
    const latest = known[known.length - 1];
    find('latest-label').textContent = koreanDay(latest.date);
    find('latest-count').textContent = number(latest.visits);
    find('visit-caption').textContent = `${koreanDay(days[0].date)} — ${koreanDay(days[29].date)} · ${known.length < 30 ? `${known.length}일 집계` : '최근 30일'}`;
    const updated = new Date(data.updated_at);
    const stale = Date.now() - updated.getTime() > 48 * 3600000;
    find('visit-status').textContent = stale ? '이전 집계' : '기록 중';
    find('visit-status').classList.toggle('is-ready', !stale);
    find('updated').textContent = `${updated.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })} 갱신 · 일별 방문 수 합계`;
    const recent = days.slice(-7), previous = days.slice(-14, -7);
    if ([...recent, ...previous].every((day) => day.visits !== null)) {
      const sum = (list) => list.reduce((result, day) => result + day.visits, 0);
      const a = sum(recent), b = sum(previous), trend = find('visit-trend');
      trend.textContent = b === 0 ? (a > 0 ? '새로운 발걸음' : '지난주와 같음') : `${a >= b ? '↗' : '↘'} ${Math.abs((a - b) / b * 100).toFixed(0)}%`;
      trend.title = '최근 7일과 그 이전 7일의 방문 수 비교'; trend.classList.toggle('is-down', a < b);
    }
    makeChart(days);
    find('chart-readout').textContent = '그래프 위에서 날짜별 방문을 살펴보세요.';
    const table = find('visit-table'); table.hidden = false;
    const tbody = table.querySelector('tbody'); tbody.replaceChildren();
    [...days].reverse().forEach((day) => {
      const tr = document.createElement('tr'), date = document.createElement('td'), value = document.createElement('td');
      date.textContent = day.date; value.textContent = day.visits === null ? '집계 전' : `${number(day.visits)}회`; tr.append(date, value); tbody.append(tr);
    });
  }
  function renderEmpty(label) {
    makeChart([]);
    const message = document.createElement('div'); message.className = 'bi-chart-empty'; message.textContent = label; find('chart').append(message);
  }
  async function initialize() {
    const results = await Promise.allSettled([load(template.dataset.posts), load(template.dataset.visits)]);
    try {
      if (results[0].status !== 'fulfilled') throw new Error('post data unavailable');
      renderPosts(results[0].value);
    } catch {
      find('post-caption').textContent = '글 작성 기록을 불러오지 못했습니다.';
      find('post-hint').textContent = '잠시 뒤 페이지를 새로고침해 주세요.';
    }
    try {
      if (results[1].status !== 'fulfilled') throw new Error('visit data unavailable');
      renderVisits(results[1].value);
    } catch {
      find('visit-status').textContent = '확인 필요'; renderEmpty('기록을 불러오지 못했습니다');
      find('chart-readout').textContent = '잠시 뒤 페이지를 새로고침해 주세요.';
    }
  }
  initialize();
})();
