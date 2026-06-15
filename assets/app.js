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
        ${link("current.html","2026 Edition","current")}
        ${link("lectures.html","Lecture Library","lectures")}
        ${link("speakers.html","Speakers","speakers")}
        ${link("editions.html","Past Editions","editions")}
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
          <a href="index.html">Home</a><a href="current.html">2026 Edition</a>
          <a href="lectures.html">Lecture Library</a>
          <a href="speakers.html">Speakers</a><a href="editions.html">Past Editions</a>
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
          <span class="eyebrow">University of Urbino · since the late 1990s</span>
          <h1>The foundations of physics, in a Renaissance city</h1>
          <p class="lead">The ${esc(S.name)} brings the best young scholars to one of Europe's oldest universities to study the foundations of physics with the foremost experts in the field. Each year is devoted to a single frontier theme.</p>
          <div class="meta">
            <div><b>University of Urbino</b></div>
            <div><b>Annual · since the late 1990s</b></div>
            <div><b>Special issue of <em>Sophia</em></b></div>
          </div>
          <div class="cta-row">
            <a class="btn btn-gold" href="current.html">This year: ${esc(current.tag)} →</a>
            <a class="btn btn-ghost" href="lectures.html">Watch past lectures</a>
          </div>
        </div>
        <figure class="hero-fig"><img ${cover(current)} alt="${esc(current.tag)}"><figcaption>${current.roman} · ${esc(current.theme)}</figcaption></figure>
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
        <a class="feature card" href="editions.html"><div class="ic"></div><h3>Past editions</h3><p>The full record of themes and years, each linked to its lectures and original programme.</p></a>
      </div>
    </div></section>

    <section class="block"><div class="wrap">
      <div class="edition">
        <div class="head"><div>
          <div class="num">Current edition · ${current.roman} (${current.year})</div>
          <h3>${esc(current.theme)}</h3>
          <div class="when">${esc(current.dateRange)} · ${esc(current.location)}</div>
        </div>${current.status==="current"?'<span class="badge live">In progress</span>':''}</div>
        <div class="cta-row"><a class="btn btn-gold" href="current.html">About this year's school →</a></div>
      </div>
    </div></section>

    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Archive</div><h2>Recent editions</h2>
        <p>A growing record of the School's themes, speakers and years.</p></div>
      <div class="grid cols-3">${recent}</div>
      <div class="cta-row" style="margin-top:28px"><a class="btn btn-ghost" href="editions.html">See all past editions</a></div>
    </div></section>`;
  }

  /* ---------- LECTURE LIBRARY (all videos, filterable) ---------- */
  function renderLectures() {
    chrome("lectures");
    const lib = S.editions.filter(e => e.status === "past");
    const withV = lib.filter(e => e.lessons && e.lessons.length);
    const vids = [];
    withV.forEach(e => e.lessons.forEach(L => vids.push({
      id: L.id, title: L.t, tag: e.tag, roman: e.roman, year: e.year, playlist: e.playlist
    })));
    const themes = [...new Set(withV.map(e => e.tag))];
    const speakers = [...new Set(withV.flatMap(e => e.speakers.map(s => s.n)))].sort();
    const watch = (v) => `https://www.youtube.com/watch?v=${v.id}&list=${v.playlist}`;
    const card = (v) => `
      <article class="vcard2" data-tag="${esc(v.tag)}" data-title="${esc(v.title.toLowerCase())}">
        <a class="vthumb" href="${watch(v)}" target="_blank" rel="noopener">
          <img loading="lazy" src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="">
          <span class="vplay" aria-hidden="true">&#9658;</span>
        </a>
        <div class="vmeta">
          <div class="vtag">${esc(v.tag)} &middot; ${v.roman} &rsquo;${String(v.year).slice(2)}</div>
          <a class="vtitle" href="${watch(v)}" target="_blank" rel="noopener">${esc(v.title)}</a>
        </div>
      </article>`;
    byId("app").innerHTML = `
    <section class="hero" style="padding:64px 0 26px"><div class="wrap">
      <span class="eyebrow">Permanent archive</span>
      <h1 style="font-size:clamp(2rem,4.6vw,3rem)">Lecture Library</h1>
      <p class="lead">Every recorded lecture from the School, talk by talk &mdash; ${vids.length} videos across ${withV.length} editions. Filter by theme or speaker, or search a title. Videos are hosted on the School's <a href="${S.channel}" target="_blank" rel="noopener">YouTube channel</a>.</p>
    </div></section>
    <section class="block" style="border-top:none;padding-top:14px"><div class="wrap">
      <div class="filters">
        <label>Theme
          <select id="f-theme"><option value="">All themes</option>
            ${themes.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join("")}
          </select></label>
        <label>Speaker
          <select id="f-spk"><option value="">All speakers</option>
            ${speakers.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join("")}
          </select></label>
        <label>Search
          <input id="f-q" type="search" placeholder="Title keywords..."></label>
        <button id="f-reset" class="btn btn-ghost" style="padding:8px 16px">Reset</button>
      </div>
      <p id="vcount" style="color:var(--muted);margin:6px 0 18px;font-size:.9rem"></p>
      <div class="vgrid2" id="vgrid">${vids.map(card).join("")}</div>
      <p id="vempty" style="display:none;color:var(--muted);margin-top:20px">No lectures match those filters.</p>
      <p style="color:var(--muted);margin-top:26px;font-size:.92rem">The XXVIII edition (Quantum Gravity, 2025) lectures are on the <a href="${S.channel}" target="_blank" rel="noopener">YouTube channel</a> but not yet split into a dedicated playlist; they will be added here.</p>
    </div></section>`;
    const grid = byId("vgrid"), cards = [...grid.children];
    function apply(){
      const t=byId("f-theme").value, sp=byId("f-spk").value.toLowerCase(), q=byId("f-q").value.trim().toLowerCase();
      let shown=0;
      cards.forEach(c=>{
        const okT=!t||c.dataset.tag===t;
        const okS=!sp||c.dataset.title.includes(sp);
        const okQ=!q||c.dataset.title.includes(q);
        const ok=okT&&okS&&okQ; c.style.display=ok?"":"none"; if(ok)shown++;
      });
      byId("vempty").style.display=shown?"none":"";
      byId("vcount").textContent=shown+" / "+cards.length+" lectures shown";
    }
    byId("f-theme").onchange=apply; byId("f-spk").onchange=apply; byId("f-q").oninput=apply;
    byId("f-reset").onclick=()=>{byId("f-theme").value="";byId("f-spk").value="";byId("f-q").value="";apply();};
    apply();
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
                ? `<a class="btn btn-gold" href="current.html">About this year's school →</a>`
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

  /* ---------- CURRENT EDITION (this year) ---------- */
  function renderCurrent() {
    chrome("current");
    const program=[
      {day:"Day 1", date:"Monday, 15 June 2026", venue:"Aula Rossa, Palazzo Battiferri, Via Aurelio Saffi 42, Urbino", slots:[
        {time:"9.30 - 10.00", t:"Introductory Remarks", who:"Giorgio Calcagnini (Chancellor, University of Urbino) &middot; Andrea Vicer&eacute; (University of Urbino) &middot; Vincenzo Fano (University of Urbino)"},
        {time:"10.00 - 12.00", t:"Introduction to Quantum Wave Functions", who:"Wayne Myrvold (University of Western Ontario)"},
        {time:"12.00 - 14.30", t:"Lunch break", who:""},
        {time:"14.30 - 16.30", t:"The Case for Realism about Quantum States", who:"Wayne Myrvold (University of Western Ontario)"},
        {time:"16.30 - 17.00", t:"Coffee break", who:""},
        {time:"17.00 - 19.00", t:"The Wave Function is as the Wave Function does (1)", who:"Valia Allori (University of Bergamo)"}
      ]},
      {day:"Day 2", date:"Tuesday, 16 June 2026", venue:"Aula Rossa, Palazzo Battiferri, Via Aurelio Saffi 42, Urbino", slots:[
        {time:"10.00 - 12.00", t:"The Wave Function is as the Wave Function does (2)", who:"Valia Allori (University of Bergamo)"},
        {time:"12.00 - 14.30", t:"Lunch break", who:""},
        {time:"14.30 - 16.30", t:"The wave function: a role for history (1)", who:"Federico Laudisa (University of Trento)"},
        {time:"16.30 - 17.00", t:"Coffee break", who:""},
        {time:"17.00 - 19.00", t:"The wave function: a role for history (2)", who:"Federico Laudisa (University of Trento)"}
      ]},
      {day:"Day 3", date:"Wednesday, 17 June 2026", venue:"Aula Rossa, Palazzo Battiferri, Via Aurelio Saffi 42, Urbino", slots:[
        {time:"10.00 - 12.00", t:"Arguments for Wave Function Realism", who:"Alyssa Ney (LMU M&uuml;nchen)"},
        {time:"12.00 - 14.30", t:"Lunch break", who:""},
        {time:"14.30 - 16.30", t:"Student session &mdash; Mutual Ground: A Structural Realist Approach to Bohmian Mechanics; Disentangling the ontology and the epistemology problems of QM; Relativistic Localisation and Wave Function Realism", who:"Ada Koprululer (University of Barcelona) &middot; Margherita Moro (University of Leeds) &middot; Alexander Niederklapfer (LSE)"},
        {time:"16.30 - 17.00", t:"Coffee break", who:""},
        {time:"17.00 - 19.00", t:"Wave Functions or Density Matrices?", who:"Alyssa Ney (LMU M&uuml;nchen)"},
        {time:"20.00", t:"Social Dinner", who:"A restaurant in Urbino (covered by the conference fee)"}
      ]},
      {day:"Day 4", date:"Thursday, 18 June 2026", venue:"Aula Rossa, Palazzo Battiferri, Via Aurelio Saffi 42, Urbino", slots:[
        {time:"10.00 - 12.00", t:"QBism &sub; RQM &sub; EQM", who:"Andrea Di Biagio (IQOQI Vienna)"},
        {time:"12.00 - 14.30", t:"Lunch break", who:""},
        {time:"14.30 - 16.30", t:"QBism &sub; RQM &sub; EQM", who:"Andrea Di Biagio (IQOQI Vienna)"},
        {time:"16.30 - 16.40", t:"Closing Remarks", who:""},
        {time:"16.40 - 17.00", t:"Coffee break", who:""},
        {time:"17.00 - 17.30", t:"Measured Time and Celestial Predictions: Science, Calendars, and Instruments in the Age of Paolo of Middelburg", who:"Exhibition at the Church of San Girolamo &mdash; rare books from the University of Urbino collection on astronomy and timekeeping in the late Renaissance"}
      ]},
      {day:"Day 5", date:"Friday, 19 June 2026", venue:"Biblioteca Malatestiana, Sala Lignea, Piazza Maurizio Bufalini, Cesena", slots:[
        {time:"10.00 - 12.00", t:"Guided Visit to the Palazzo Ducale", who:"Ticket &euro;12.00 &mdash; please register by emailing the organizers by 18 June 2026"},
        {time:"17.00 - 19.00", t:"Processo Popolare: &laquo;Il caso della funzione d'onda&raquo;", who:"Giudice: Mario Alai &middot; Difesa: Gino Tarozzi, Marco Sanchioni &middot; Accusa: Niccol&ograve; Covoni, Andrea Di Biagio &middot; ed altri testimoni autorevoli"}
      ]}
    ];
    const bios=[
      {n:"Valia Allori", a:"University of Bergamo", b:"Valia Allori studied physics and philosophy first in Italy and then in the United States. She has worked on the foundations of quantum mechanics and of statistical mechanics, aiming to understand how our best physical theory can answer general metaphysical questions about the nature of reality. She is currently Associate Professor at the University of Bergamo."},
      {n:"Andrea Di Biagio", a:"Institute of Quantum Optics and Quantum Information, Vienna", b:"Andrea Di Biagio obtained his PhD in Theoretical Physics at Sapienza University of Rome and is a postdoctoral researcher at IQOQI Vienna. His research spans theoretical and conceptual aspects of low-energy quantum gravity experiments and the foundations of quantum theory, including Rovelli's relational interpretation."},
      {n:"Federico Laudisa", a:"University of Trento", b:"Federico Laudisa holds a PhD in Philosophy from the University of Florence. After teaching at Milan-Bicocca, Milan-San Raffaele and Bologna, he is full professor in Logic and Philosophy of Science at the University of Trento, where he coordinates the PhD School in European Cultures. He is a member of the Faculty of the John Bell Institute. His research focuses on the philosophy, history and foundations of quantum mechanics, with special attention to non-locality."},
      {n:"Wayne Myrvold", a:"University of Western Ontario", b:"Wayne Myrvold is professor in the department of philosophy at the University of Western Ontario. His work focuses on philosophy of physics, including the foundations of quantum mechanics and thermodynamics. He is the subject editor for Quantum Mechanics for the Stanford Encyclopedia of Philosophy, and the author of Beyond Chance and Credence (OUP 2021)."},
      {n:"Alyssa Ney", a:"Ludwig-Maximilians-Universit&auml;t M&uuml;nchen", b:"Alyssa Ney is Professor of Metaphysics and Vice-Dean for Research at LMU Munich, and a member of the Munich Center for Quantum Science and Technology (MCQST). Her research focuses on fundamentality, the unity of science, and the interpretation of quantum theories. She holds an MS in Physics from UC Davis and a PhD in Philosophy from Brown University; she previously taught at UC Davis and Rochester."}
    ];
    const participants=["Anna Gabetti (Politecnico Torino)","Dorian Schiffer (TU Vienna)","Silvia Miloso (University of Florence)","Sofia Di Pirro (Pontificia Universit&agrave; Lateranense / Perugia)","Roberta Serafini (University of Roma 3)","Arianna Laura Savelli (University of Trento)","Margherita Moro (University of Leeds)","Damiano Santoferrara (CEA Saclay, Paris)","Floris Eskens (University of Oslo)","Charlene Laffond (University of Vienna)","Joppe Widstam (MPI for the Physics of Complex Systems)","Simon Peter Leban (Ljubljana University)","Paolo Di Sia (University of Padua)","Giulia Ferrigno","Gianluca Bona (IISS Gandhi)","Sauro Niccolai (IISS G. Peano)","Anna Michelini (University of Trento)","Alessandro Mengoni (University of Torino)","Paolo Faglia (University of Oxford)","Niamh Marquess-Bowler (University of Bristol)","Nina Mazurewicz (University of Warsaw)","Ada Koprululer (University of Barcelona)","Piergiuseppe Sancetta (University of Edinburgh)","Giorgia Moioli (University of Milan)","Berfu Nacar (Yeditepe University)","Carla Torn&eacute; Pujol (University of Barcelona)","Giulia Romanini (University of Trento)","C&eacute;leste M.E. Hogan (Simon's Rock at Bard College)","Aric Hackebill (University of Vermont)","Jessica Pohlmann (Rutgers University)","John Stark (University of Western Ontario)","Xingyu Lyu (University of Mannheim)","Giovanni Rizzotto (Universit&agrave; della Svizzera Italiana)","Anna Mazzocchi (Copenhagen University)","Francisco Pipa (University of Queensland)","Cedric Igelspacher (LMU)","Elias Carlini (University of Milan)","Alex Gough (University of Birmingham)","Alexander Niederklapfer (LSE)","Emily Patterson (University of Toronto)","Alessandro Spizzico (Universit&agrave; della Svizzera Italiana)","Jordan Grujic (University of Pittsburgh)","Davide Romano (University of Verona)","Dario Aversa (University of Foggia)","Daniele Pizzocaro (UC Louvain)","Valentina Ruggiero (University of Graz)","Mia Nascimben (University of Bologna)","Alberto Bucci (University of Urbino)"];
    const hotels=[
      {n:"Bonconte ****", d:"Via delle Mura 28 &middot; 0722.2463 &middot; bonconte@viphotels.it"},
      {n:"Italia ***", d:"Corso Garibaldi 32 &middot; 0722.2701 &middot; info@albergo-italia-urbino.it"},
      {n:"San Domenico ****", d:"Piazza Rinascimento 3 &middot; 0722.2626 &middot; sandomenico@viphotels.it"},
      {n:"Dei Duchi ***", d:"Via Dini 12 &middot; 0722.328226"},
      {n:"Frontespino ***", d:"Loc. Tufo, Via Fontespino 8/10 &middot; 0722.57331"},
      {n:"La Meridiana ***", d:"Loc. Trasanni, Via Urbinate 43 &middot; 0722.320169"},
      {n:"Nen&egrave; ***", d:"Loc. Crocicchia, Via Biancalana 39 &middot; 0722.2996"},
      {n:"Raffaello ***", d:"Via Santa Margherita 40 &middot; 0722.4784"},
      {n:"La Tortorina ***", d:"Via Ottaviano Petrucci 4 &middot; 0722.327715"},
      {n:"Mamiani ****", d:"Via Bernini 6 &middot; 0722.322309"}
    ];
    const bnbs=[
      {n:"Abaco &ndash; Alma Domus", d:"Via Mainardi 1 &middot; 0722.4311 &middot; almadomus@gmail.com"},
      {n:"Al Nido", d:"SP Montefabbri 32 &middot; 346.0917264"},
      {n:"A C&agrave; Maggio", d:"Via S. Maria di Pomonte 21"},
      {n:"Acacia", d:"Via S.P. Feltresca 63 &middot; 0722.2082"},
      {n:"Cipressi", d:"Via B. Mainardo 3 &middot; 0722.4311"},
      {n:"Alveape", d:"Loc. S. Marino, Via Montebagno 8 &middot; 0722.340212"},
      {n:"Aquilone", d:"Via Gramsci 22 &middot; 0722.328154"},
      {n:"Il Campo degli Olivi", d:"Via Colonna 7/c &middot; 0722.327656"},
      {n:"C&agrave; Giovanni", d:"Via S. Lorenzo in Solfinelli 5 &middot; 347.5844707"},
      {n:"C&agrave; Lajala", d:"Loc. San Marino, Via Sant'Eufemia 5 &middot; 0722.53179"},
      {n:"C&agrave; Il Governatore", d:"Loc. Trasanni, SP Montefabbri 30/32 &middot; 0722.327060"},
      {n:"Il Giuggiolo", d:"0722.2930 &middot; 349.5706290"},
      {n:"Il Monte di Sant'Eufemia", d:"Loc. San Marino, Via Sant'Eufemia 1 &middot; 0722.53557"},
      {n:"Il Posto delle Fate", d:"Via Duchi di Montefeltro 26 &middot; 0722.345176"},
      {n:"L'Oasi", d:"Loc. Tufo, Via del Cardellino 2 &middot; 0722.339004"},
      {n:"Il Cortegiano", d:"Via Veterani 1 int. C &middot; 0722.2278"},
      {n:"L'Orologio", d:"Via dell'Orologio di Sotto 11 &middot; 0722.327071"},
      {n:"Il Sogno di Gaia", d:"Via Molinaccio 1 &middot; 0722.345413"},
      {n:"Monte delle Allodole", d:"Via Ca' Bergamo 6 &middot; 0722.52614"},
      {n:"Montefeltro", d:"Loc. Schieti, Via del Forno 8 &middot; 0722.59315"},
      {n:"Raffaello (B&amp;B)", d:"Via Virgili 13 &middot; 328.1169594"},
      {n:"Santa Maria delle Grazie", d:"Loc. Forcuini, SP Montefabbri 100 &middot; 348.3621692"}
    ];
    const slot=x=>`<div class="slot"><div class="t">${x.time}</div><div><b>${x.t}</b>${x.who?`<div class="who">${x.who}</div>`:""}</div></div>`;
    const dayBlock=d=>`<div class="prog-day"><h3>${d.day}</h3><div class="when">${d.date} &middot; ${d.venue}</div>${d.slots.map(slot).join("")}</div>`;
    const accCard=x=>`<div class="acc"><b>${x.n}</b><span class="d">${x.d}</span></div>`;
    byId("app").innerHTML=`
    <section class="hero" style="padding:64px 0 22px"><div class="wrap">
      <span class="eyebrow">${current.roman} Edition${current.status==="current"?" &middot; in progress":""} &middot; ${esc(current.dateRange)}</span>
      <h1 style="font-size:clamp(2rem,4.6vw,3rem)">${esc(current.theme)}</h1>
      <p class="lead">${esc(current.blurb)}</p>
      <div class="cta-row">
        <a class="btn btn-gold" href="${current.official}" target="_blank" rel="noopener">Official edition page &#8599;</a>
        <a class="btn btn-ghost" href="lectures.html">Lecture Library</a>
      </div>
    </div></section>

    <nav class="subnav"><div class="wrap">
      <a href="#overview">Overview</a><a href="#speakers">Speakers</a><a href="#program">Programme</a>
      <a href="#participation">Participation</a><a href="#participants">Participants</a>
      <a href="#travel">Getting there</a><a href="#accommodation">Accommodation</a><a href="#contacts">Contacts</a>
    </div></nav>

    <section id="overview" class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Overview</div><h2>History and Philosophy of the Wave Function</h2></div>
      <p>The XXIX International Philosophy of Physics Summer School of the University of Urbino addresses a crucial topic at the intersection of physics and philosophy: the epistemological and ontological status of the wave function. The School explores both the physical and conceptual dimensions of one of the central entities of quantum theory &mdash; examining the mathematical role of the wave function, its historical development within quantum mechanics, and contemporary philosophical debates concerning its interpretation and ontology.</p>
      <p>This year's edition is part of the broader celebrations marking the centenary of the birth of quantum mechanics, hosted across European institutions, and aims to offer an original contribution to this collective reflection on the genesis and meaning of the theory. The programme combines plenary lectures with seminars and student presentations, fostering dialogue among physicists and philosophers, PhD students and early-career researchers.</p>
      <dl class="info">
        <dt>Dates</dt><dd>${esc(current.dateRange)}</dd>
        <dt>Main venue</dt><dd>Aula Rossa, Palazzo Battiferri, Via Aurelio Saffi 42, Urbino</dd>
        <dt>Director</dt><dd>Vincenzo Fano (University of Urbino)</dd>
        <dt>Organizers</dt><dd>Marco Sanchioni (Sophia University Institute) &middot; Niccol&ograve; Covoni (University of Urbino / USI)</dd>
        <dt>Publication</dt><dd>Selected workshop papers appear in a special issue of <a href="https://journal.sophiauniversity.org/" target="_blank" rel="noopener"><em>Sophia</em></a></dd>
      </dl>
    </div></section>

    <section id="speakers" class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Speakers</div><h2>Plenary speakers</h2></div>
      ${bios.map(p=>`<div class="bio"><h3>${p.n}</h3><div class="aff">${p.a}</div><p>${p.b}</p></div>`).join("")}
    </div></section>

    <section id="program" class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Programme</div><h2>Five days in Urbino</h2>
        <p>All times are CEST (UTC+2).</p></div>
      ${program.map(dayBlock).join("")}
    </div></section>

    <section id="participation" class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Participation</div><h2>Application, abstracts &amp; fee</h2>
        <p>Applications for the ${current.year} edition are now closed &mdash; the School is in progress.</p></div>
      <div class="edition">
        <dl class="info">
          <dt>Application</dt><dd>Cover letter (motivation) and a CV. Deadline was 29 March 2026; acceptance notified by 10 April 2026.</dd>
          <dt>Call for abstracts</dt><dd>Four young researchers present original papers in a dedicated workshop. Extended abstract (&le; 2000 words, prepared for blind review) plus a title page.</dd>
          <dt>Fee</dt><dd>&euro;100 contribution to SILFS &mdash; covers attendance, school materials, social dinner and coffee breaks. Accommodation, lunch and dinner are not included.</dd>
          <dt>Social dinner</dt><dd>Wednesday 17 June, at a restaurant in Urbino, covered by the fee. All participants are warmly invited.</dd>
        </dl>
      </div>
    </div></section>

    <section id="participants" class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Participants</div><h2>Selected participants</h2>
        <p>${participants.length} young researchers from across Europe and beyond.</p></div>
      <div class="plist">${participants.map(p=>`<div>${p}</div>`).join("")}</div>
    </div></section>

    <section id="travel" class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Getting there</div><h2>How to reach Urbino</h2></div>
      <dl class="info">
        <dt>By air</dt><dd><b>Ancona</b>, <b>Bologna</b> or <b>Rome</b> airports. From Ancona or Bologna, take a bus to the train station, a train to Pesaro, then a bus to Urbino. From Rome, the Adriabus coach connects Roma Tiburtina to Urbino. Get off at &ldquo;Urbino &mdash; parcheggio Santa Lucia&rdquo;.</dd>
        <dt>By train</dt><dd>The nearest station is <b>Pesaro</b> (Trenitalia). From Pesaro, take a bus to Urbino and get off at &ldquo;Urbino &mdash; parcheggio Santa Lucia&rdquo;.</dd>
        <dt>By car</dt><dd>From the south: exit the A14 at &ldquo;Fano&rdquo;, then follow &ldquo;Urbino&rdquo;. From the north: exit at &ldquo;Pesaro e Urbino&rdquo;, then follow &ldquo;Urbino&rdquo;. Park at &ldquo;Parcheggio Santa Lucia&rdquo;.</dd>
        <dt>To Palazzo Battiferri</dt><dd>From Parcheggio Santa Lucia, take the two elevators to Porta Santa Lucia; the Palazzo is about 800 m inside the old town.</dd>
      </dl>
    </div></section>

    <section id="accommodation" class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Accommodation</div><h2>Where to sleep in Urbino</h2>
        <p>A selection of hotels and B&amp;Bs. Accommodation is not included in the fee.</p></div>
      <h3 style="margin:6px 0 12px">Hotels</h3>
      <div class="acc-grid">${hotels.map(accCard).join("")}</div>
      <h3 style="margin:26px 0 12px">Bed &amp; Breakfasts</h3>
      <div class="acc-grid">${bnbs.map(accCard).join("")}</div>
      <p style="color:var(--muted);margin-top:18px;font-size:.92rem">For the Day 5 excursion in Cesena and the full accommodation list, see the <a href="${current.official}/urbino/where-to-sleep" target="_blank" rel="noopener">official page</a>.</p>
    </div></section>

    <section id="contacts" class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Contacts</div><h2>Get in touch</h2></div>
      <dl class="info">
        <dt>Director</dt><dd>Prof. Vincenzo Fano (DiSPeA, University of Urbino)</dd>
        <dt>Organizers</dt><dd>Niccol&ograve; Covoni (University of Urbino / USI) &middot; Marco Sanchioni (Sophia University Institute)</dd>
        <dt>Email</dt><dd><a href="mailto:${S.email}">${S.email}</a></dd>
        <dt>Official site</dt><dd><a href="${current.official}" target="_blank" rel="noopener">${current.official} &#8599;</a></dd>
      </dl>
    </div></section>`;
  }

  window.UPSS = { renderHome, renderCurrent, renderLectures, renderSpeakers, renderEditions, renderAbout };
})();
