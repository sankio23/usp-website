/* =========================================================================
   UP²S² — rendering layer. Reads window.SCHOOL and builds each page.
   Runs from file:// (no fetch). Add a page renderer, then call it from the
   page's inline <script>.
   ========================================================================= */
(function () {
  const S = window.SCHOOL;
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const byId = (id) => document.getElementById(id);
  // real cover image with automatic fallback to the bespoke SVG artwork
  const cover = (e) => e.cover
    ? `src="${e.cover}" onerror="this.onerror=null;this.src='${e.art}'"`
    : `src="${e.art}"`;

  const current = S.editions.find(e => e.status === "current") || S.editions[0];
  const past = S.editions.filter(e => e !== current);

  /* ---------- shared chrome ---------- */
  function header(active) {
    const link = (href, label, id) =>
      `<a href="${href}"${id===active?' class="active"':''}>${label}</a>`;
    return `
    <header class="nav"><div class="wrap">
      <a class="brand" href="index.html" aria-label="UP2S2 home">
        <img class="mark" src="assets/logo-mark.png" alt="UP²S²" style="height:30px;width:auto">
        <span style="margin-left:2px">Urbino Philosophy of<br>Physics Summer School</span>
      </a>
      <nav>
        ${link("index.html","Home","home")}
        ${link("lectures.html","Lecture Library","lectures")}
        ${link("speakers.html","Speakers","speakers")}
        ${link("editions.html","Editions","editions")}
        ${link("about.html","About &amp; Apply","about")}
      </nav>
    </div></header>`;
  }

  function footer() {
    const partners = S.partners.map(p => `<a href="${p.url}" target="_blank" rel="noopener">${esc(p.name)} ↗</a>`).join("");
    return `
    <footer><div class="wrap">
      <div class="cols">
        <div>
          <h4>${S.acronym} — ${esc(S.name)}</h4>
          <p>${esc(S.org)}</p>
          <p><a href="mailto:${S.email}">${S.email}</a> · <a href="${S.channel}" target="_blank" rel="noopener">YouTube channel ↗</a></p>
        </div>
        <div><h4>Navigate</h4>
          <a href="index.html">Home</a><a href="lectures.html">Lecture Library</a>
          <a href="speakers.html">Speakers</a><a href="editions.html">Editions</a>
          <a href="about.html">About &amp; Apply</a>
        </div>
        <div><h4>Partners</h4>${partners}</div>
      </div>
      <div class="fine">© ${new Date().getFullYear()} ${esc(S.name)} · ${esc(S.venue.address)}</div>
    </div></footer>`;
  }

  function chrome(active) {
    const h = byId("site-header"); if (h) h.outerHTML = header(active);
    const f = byId("site-footer"); if (f) f.outerHTML = footer();
  }

  const speakerLine = (sp) => sp.map(s => `<div class="spk"><b>${esc(s.n)}</b> <span>· ${esc(s.a)}</span></div>`).join("");

  /* ---------- HOME ---------- */
  function renderHome() {
    chrome("home");
    const recent = past.slice(0, 3).map(e => `
      <a class="card" href="editions.html#${e.slug}">
        <img class="cthumb" ${cover(e)} alt="${esc(e.tag)}">
        <div class="year">${e.roman} · ${e.year}</div>
        <h3>${esc(e.theme)}</h3>
        <div class="when">${esc(e.dateRange)}</div>
        <p>${esc(e.blurb.split(". ")[0])}.</p>
        <div class="speakers"><b>Speakers:</b> ${e.speakers.map(s=>esc(s.n.split(" ").slice(-1))).join(", ")}</div>
      </a>`).join("");

    byId("app").innerHTML = `
    <section class="hero hero-home" style="background-image:url('assets/art/hero-cosmos.svg')">
      <div class="wrap hero-grid">
        <div>
          <span class="eyebrow">${current.roman} Edition · ${esc(current.dateRange)}${current.status==="current"?" · current":""}</span>
          <h1>${esc(current.theme)}</h1>
          <p class="lead">The ${esc(S.name)} brings the best young scholars to one of Europe's oldest universities to study the foundations of physics with the foremost experts in the field.</p>
          <div class="meta">
            <div><b>University of Urbino</b></div>
            <div><b>${esc(current.dateRange)}</b></div>
            <div><b>${current.roman}</b> edition</div>
          </div>
          <div class="cta-row">
            <a class="btn btn-gold" href="about.html#apply">How to apply</a>
            <a class="btn btn-ghost" href="lectures.html">Watch past lectures</a>
          </div>
        </div>
        <figure class="hero-fig"><img ${cover(current)} alt="${esc(current.tag)}"><figcaption>${esc(current.tag)}</figcaption></figure>
      </div>
    </section>

    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">The School</div>
        <h2>One home for a long tradition</h2>
        <p>${esc(S.tagline)} Each year focuses on a single frontier theme, combining plenary lectures by leading speakers with seminars and a workshop for young researchers — whose selected papers appear in a special issue of <em>Sophia</em>.</p>
      </div>
      <div class="features">
        <a class="feature card" href="lectures.html"><div class="ic"></div><h3>Lecture Library</h3><p>Every edition's lectures, gathered as a permanent video archive you can browse by year, theme or speaker.</p></a>
        <a class="feature card" href="speakers.html"><div class="ic"></div><h3>Speakers</h3><p>The cumulative who's-who of physicists and philosophers who have taught at the School over the years.</p></a>
        <a class="feature card" href="editions.html"><div class="ic"></div><h3>Editions archive</h3><p>The full record of themes and years, each linked to its lectures and original programme.</p></a>
      </div>
    </div></section>

    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Current Edition</div>
        <h2>${current.roman} · ${esc(current.theme)}</h2>
        <p>${esc(current.blurb)}</p>
      </div>
      <div class="edition">
        <img class="ebanner" ${cover(current)} alt="${esc(current.tag)}">
        <div class="head"><div>
          <div class="num">${current.roman} International Summer School</div>
          <h3>${esc(current.theme)}</h3>
          <div class="when">${esc(current.dateRange)} · ${esc(current.location)}</div>
        </div>${current.status==="current"?'<span class="badge live">In progress</span>':''}</div>
        <div class="spk-list" style="margin-top:14px">${speakerLine(current.speakers)}</div>
        <div class="cta-row">
          <a class="btn btn-gold" href="about.html#apply">How to apply</a>
          <a class="btn btn-ghost" href="lectures.html">Lecture Library</a>
        </div>
      </div>
    </div></section>

    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Archive</div><h2>Recent editions</h2>
        <p>A growing record of the School's themes, speakers and years.</p></div>
      <div class="grid cols-3">${recent}</div>
      <div class="cta-row" style="margin-top:28px"><a class="btn btn-ghost" href="editions.html">See all editions</a></div>
    </div></section>`;
  }

  /* ---------- LECTURE LIBRARY ---------- */
  function renderLectures() {
    chrome("lectures");
    const lib = S.editions.filter(e => e.status === "past");
    const speakers = [...new Set(lib.flatMap(e => e.speakers.map(s => s.n)))].sort();

    const card = (e) => `
      <article class="vcard" data-tag="${esc(e.tag)}" data-speakers="${esc(e.speakers.map(s=>s.n).join("|"))}">
        <div class="vembed">
          ${e.playlist
            ? `<iframe loading="lazy" src="${e.firstVideo ? `https://www.youtube.com/embed/${e.firstVideo}?list=${e.playlist}&rel=0` : `https://www.youtube.com/embed/videoseries?list=${e.playlist}`}" title="${esc(e.roman)} — ${esc(e.theme)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
            : `<div class="vplaceholder" style="background-image:url('${e.art}')"><span>Lectures on the<br><a href="${S.channel}" target="_blank" rel="noopener">Filosofia Urbino channel ↗</a></span></div>`}
        </div>
        <div class="vbody">
          <div class="year">${e.roman} · ${e.year}</div>
          <h3>${esc(e.theme)}</h3>
          <p class="vspk">${e.speakers.map(s=>esc(s.n)).join(" · ")}</p>
          ${e.playlist?`<a class="vlink" href="https://www.youtube.com/playlist?list=${e.playlist}" target="_blank" rel="noopener">Open playlist on YouTube ↗</a>`:""}
        </div>
      </article>`;

    byId("app").innerHTML = `
    <section class="hero" style="padding:64px 0 26px"><div class="wrap">
      <span class="eyebrow">Permanent archive</span>
      <h1 style="font-size:clamp(2rem,4.6vw,3rem)">Lecture Library</h1>
      <p class="lead">Every edition's lectures in one place — organised by year and theme, not by day. Filter by theme or speaker to find a talk. Videos are hosted on the School's <a href="${S.channel}" target="_blank" rel="noopener">YouTube channel</a>.</p>
    </div></section>
    <section class="block" style="border-top:none;padding-top:14px"><div class="wrap">
      <div class="filters">
        <label>Theme
          <select id="f-theme"><option value="">All themes</option>
            ${lib.map(e=>`<option value="${esc(e.tag)}">${esc(e.tag)} (${e.roman})</option>`).join("")}
          </select></label>
        <label>Speaker
          <select id="f-spk"><option value="">All speakers</option>
            ${speakers.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join("")}
          </select></label>
        <button id="f-reset" class="btn btn-ghost" style="padding:8px 16px">Reset</button>
      </div>
      <div class="vgrid" id="vgrid">${lib.map(card).join("")}</div>
      <p id="vempty" style="display:none;color:var(--muted);margin-top:20px">No lectures match those filters.</p>
      <p style="color:var(--muted);margin-top:26px;font-size:.92rem">Earlier editions (e.g. XXIII) are also available on the <a href="${S.channel}" target="_blank" rel="noopener">Filosofia Urbino channel</a>; their playlists can be added here over time.</p>
    </div></section>`;

    const grid = byId("vgrid"), cards = [...grid.children];
    function apply() {
      const t = byId("f-theme").value, sp = byId("f-spk").value; let shown = 0;
      cards.forEach(c => {
        const okT = !t || c.dataset.tag === t;
        const okS = !sp || c.dataset.speakers.split("|").includes(sp);
        const ok = okT && okS; c.style.display = ok ? "" : "none"; if (ok) shown++;
      });
      byId("vempty").style.display = shown ? "none" : "";
    }
    byId("f-theme").onchange = apply; byId("f-spk").onchange = apply;
    byId("f-reset").onclick = () => { byId("f-theme").value=""; byId("f-spk").value=""; apply(); };
  }

  /* ---------- SPEAKERS (cumulative) ---------- */
  function renderSpeakers() {
    chrome("speakers");
    const map = new Map();
    S.editions.forEach(e => e.speakers.forEach(s => {
      const k = s.n;
      if (!map.has(k)) map.set(k, { n: s.n, a: s.a, u: s.u, eds: [] });
      if (s.u && !map.get(k).u) map.get(k).u = s.u;
      map.get(k).eds.push({ roman: e.roman, year: e.year, tag: e.tag, slug: e.slug });
    }));
    const people = [...map.values()].sort((a,b) => a.n.split(" ").slice(-1)[0].localeCompare(b.n.split(" ").slice(-1)[0]));
    const cards = people.map(p => `
      <div class="card scard">
        <h3>${esc(p.n)}</h3>
        <div class="when">${esc(p.a)}</div>
        <div class="spk-eds">${p.eds.map(e=>`<a href="editions.html#${e.slug}" title="${esc(e.tag)}">${e.roman} ’${String(e.year).slice(2)}</a>`).join("")}</div>
        ${p.u?`<a class="btn btn-ghost spk-profile" href="${esc(p.u)}" target="_blank" rel="noopener">Institutional profile ↗</a>`:""}
      </div>`).join("");
    byId("app").innerHTML = `
    <section class="hero" style="padding:64px 0 26px"><div class="wrap">
      <span class="eyebrow">Across all editions</span>
      <h1 style="font-size:clamp(2rem,4.6vw,3rem)">Speakers</h1>
      <p class="lead">The physicists and philosophers who have lectured at the School. Each tag links to the edition they taught in; the button opens their institutional profile.</p>
    </div></section>
    <section class="block" style="border-top:none;padding-top:14px"><div class="wrap">
      <div class="grid cols-3">${cards}</div>
    </div></section>`;
  }

  /* ---------- EDITIONS ARCHIVE ---------- */
  function renderEditions() {
    chrome("editions");
    const ed = (e) => `
      <article class="edition" id="${e.slug}">
        <img class="ebanner" ${cover(e)} alt="${esc(e.tag)}">
        <div class="head"><div>
          <div class="num">${e.roman} · ${e.year}</div>
          <h3>${esc(e.theme)}</h3>
          <div class="when">${esc(e.dateRange)} · ${esc(e.location)}</div>
        </div>${e.status==="current"?'<span class="badge live">Current</span>':(e.format==="online"?'<span class="badge online">Online</span>':"")}</div>
        <p class="desc">${esc(e.blurb)}</p>
        <div class="spk-list">${speakerLine(e.speakers)}</div>
        <div class="cta-row">
          ${e.playlist
            ? `<a class="btn btn-gold" href="lectures.html">Watch lectures</a>`
            : (e.status==="current"
                ? `<a class="btn btn-gold" href="about.html#apply">How to apply</a>`
                : `<a class="btn btn-ghost" href="${S.channel}" target="_blank" rel="noopener">Lectures on YouTube ↗</a>`)}
        </div>
      </article>`;
    byId("app").innerHTML = `
    <section class="hero" style="padding:64px 0 26px"><div class="wrap">
      <span class="eyebrow">Archive · ${past[past.length-1].year} → ${current.year}</span>
      <h1 style="font-size:clamp(2rem,4.6vw,3rem)">Editions of the School</h1>
      <p class="lead">Each year the School devotes itself to a single frontier theme in the foundations of physics. Most recent first.</p>
    </div></section>
    <section class="block" style="border-top:none;padding-top:14px"><div class="wrap">
      ${S.editions.map(ed).join("")}
      <p style="color:var(--muted);margin-top:24px;font-size:.95rem">The School has run annually for nearly three decades. Earlier editions (I–XXIII) predate this web archive; some lectures are on the <a href="${S.channel}" target="_blank" rel="noopener">YouTube channel</a> and entries can be added here over time.</p>
    </div></section>`;
  }

  /* ---------- ABOUT & APPLY ---------- */
  function renderAbout() {
    chrome("about");
    const committee = S.committee.map(c => `<p><b>${esc(c.n)}</b> · ${esc(c.a)}</p>`).join("");
    byId("app").innerHTML = `
    <section class="hero" style="padding:64px 0 26px"><div class="wrap">
      <span class="eyebrow">About the School</span>
      <h1 style="font-size:clamp(2rem,4.6vw,3rem)">A meeting point for physics and philosophy</h1>
      <p class="lead">${esc(S.venue.note)} Every year it hosts the International Summer School in Philosophy of Physics, which brings the best young students in the field to learn from its foremost experts.</p>
    </div></section>

    <section class="block" style="border-top:none;padding-top:18px"><div class="wrap">
      <div class="section-head"><div class="kicker">Format</div><h2>How the School works</h2>
        <p>Each edition focuses on a single theme and combines plenary lectures by internationally renowned speakers with seminars and a workshop for young researchers. Selected papers are published in a special issue of <a href="https://journal.sophiauniversity.org/" target="_blank" rel="noopener"><em>Sophia</em></a>.</p></div>
      <div class="features">
        <div class="feature card"><div class="ic"></div><h3>Who should attend</h3><p>Graduate students, postgraduates and early-career researchers in philosophy of physics, physics and the foundations of science.</p></div>
        <div class="feature card"><div class="ic"></div><h3>Two tracks</h3><p>Apply to <b>participate</b> (cover letter + CV) or respond to the <b>call for abstracts</b> to present an original paper in the workshop.</p></div>
        <div class="feature card"><div class="ic"></div><h3>Fee</h3><p>${esc(S.fee)}</p></div>
      </div>
    </div></section>

    <section class="block" id="apply"><div class="wrap">
      <div class="section-head"><div class="kicker">Apply</div><h2>How to apply</h2>
        <p>Applications are managed through the current edition's official page. For ${current.roman} (${current.year}):</p></div>
      <div class="edition">
        <dl class="info">
          <dt>Application</dt><dd>Submit a cover letter (motivation) and a CV via the official form.</dd>
          <dt>Call for abstracts</dt><dd>Selected young researchers present original work in a dedicated workshop (extended abstract ≤ 2000 words, prepared for blind review, plus a title page).</dd>
          <dt>Deadline</dt><dd>${esc(current.deadline || "see the official page")}</dd>
          <dt>Publication</dt><dd>Selected papers appear in a special issue of <em>Sophia</em>.</dd>
          <dt>Contact</dt><dd><a href="mailto:${S.email}">${S.email}</a></dd>
        </dl>
        <div class="cta-row"><a class="btn btn-gold" href="${current.apply || current.official}" target="_blank" rel="noopener">Apply for ${current.year} ↗</a></div>
      </div>
    </div></section>

    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Venue</div><h2>Urbino</h2>
        <p>The School is hosted by the Department of Pure and Applied Sciences of the University of Urbino. Affordable B&amp;Bs and hotels are available; accommodation guidance is published on each edition's page.</p></div>
      <dl class="info">
        <dt>Institution</dt><dd>${esc(S.venue.institution)}</dd>
        <dt>Address</dt><dd>${esc(S.venue.address)}</dd>
      </dl>
    </div></section>

    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">People</div><h2>Direction &amp; organising committee</h2>
        <p>Composition as of the ${current.year} edition.</p></div>
      <div class="edition">
        <p style="margin-top:0"><span style="color:var(--gold);font-weight:600">Director</span> — ${esc(S.director)}</p>
        <p><span style="color:var(--gold);font-weight:600">School Organizers</span> — ${S.organizers.map(esc).join(" · ")}</p>
        <p style="color:var(--gold);font-weight:600;margin-bottom:8px">Organizing Committee</p>
        <div class="people">${committee}</div>
      </div>
    </div></section>`;
  }

  window.UPSS = { renderHome, renderLectures, renderSpeakers, renderEditions, renderAbout };
})();
