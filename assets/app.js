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
        <div class="navdrop${active==="current"?" active":""}">
          <a class="navdrop-top" href="current.html">2026 Edition &#9662;</a>
          <div class="navdrop-menu">
            <a href="current.html">Overview</a>
            <a href="2026-speakers.html">Speakers</a>
            <a href="2026-program.html">Programme</a>
            <a href="2026-participation.html">Call for Participations</a>
            <a href="2026-participants.html">Participants</a>
            <a href="2026-urbino.html">Urbino &amp; Accommodation</a>
            <a href="2026-contacts.html">Contacts</a>
          </div>
        </div>
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
      </a>`).join("");

    byId("app").innerHTML = `
    <section class="hero hero-home home-hero" style="background-image:url('assets/art/hero-cosmos.svg')">
      <div class="wrap">
        <span class="eyebrow">University of Urbino · since the late 1990s</span>
        <h1 class="home-title">Philosophy of Physics<br>Summer School</h1>
        <p class="lead home-lead">One frontier theme each year, in the Renaissance city of Urbino.</p>
        <div class="cta-row">
          <a class="btn btn-gold" href="current.html">2026 · ${esc(current.tag)} →</a>
          <a class="btn btn-ghost" href="lectures.html">Lectures</a>
        </div>
      </div>
    </section>

    <section class="block"><div class="wrap">
      <div class="tiles">
        <a class="tile" href="lectures.html" style="--img:url('assets/art/hero-cosmos.svg')">
          <span class="tile-art"></span>
          <span class="tile-cap"><b>Lecture Library</b><span class="tile-sub">Every talk, by year &amp; speaker</span></span>
          <span class="tile-go">&#8599;</span>
        </a>
        <a class="tile" href="speakers.html" style="--img:url('assets/art/wave-function.svg')">
          <span class="tile-art"></span>
          <span class="tile-cap"><b>Speakers</b><span class="tile-sub">Physicists &amp; philosophers</span></span>
          <span class="tile-go">&#8599;</span>
        </a>
        <a class="tile" href="editions.html" style="--img:url('assets/art/dark-matter.svg')">
          <span class="tile-art"></span>
          <span class="tile-cap"><b>Past Editions</b><span class="tile-sub">Themes since the 1990s</span></span>
          <span class="tile-go">&#8599;</span>
        </a>
      </div>
    </div></section>

    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Recent editions</div></div>
      <div class="grid cols-3">${recent}</div>
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
          <dt>Deadline</dt><dd>${esc(current.deadline || "see the 2026 Edition page")}</dd>
          <dt>Publication</dt><dd>Selected papers appear in a special issue of <em>Sophia</em>.</dd>
          <dt>Contact</dt><dd><a href="mailto:${S.email}">${S.email}</a></dd>
        </dl>
        <div class="cta-row"><a class="btn btn-gold" href="2026-participation.html">Participation &amp; fees</a></div>
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

  /* ---------- 2026 EDITION (multi-page) ---------- */
  const Y2026 = {
    bios:[
      {slug:"allori", init:"VA", n:"Valia Allori", a:"University of Bergamo", b:"Valia Allori studied physics and philosophy in Italy and the United States. She works on the foundations of quantum mechanics and statistical mechanics, aiming to understand how our best physical theory can answer general metaphysical questions about the nature of reality. She is currently Associate Professor at the University of Bergamo."},
      {slug:"dibiagio", init:"AD", n:"Andrea Di Biagio", a:"IQOQI, Vienna", b:"Andrea Di Biagio obtained his PhD in Theoretical Physics at Sapienza University of Rome and is a postdoctoral researcher at the Institute for Quantum Optics and Quantum Information in Vienna. His research spans the conceptual aspects of low-energy quantum gravity experiments and the foundations of quantum theory, including Rovelli's relational interpretation."},
      {slug:"laudisa", init:"FL", n:"Federico Laudisa", a:"University of Trento", b:"Federico Laudisa holds a PhD in Philosophy from the University of Florence. After teaching at Milan-Bicocca, Milan-San Raffaele and Bologna, he is full professor in Logic and Philosophy of Science at the University of Trento, where he coordinates the PhD School in European Cultures. He is a member of the Faculty of the John Bell Institute. His research focuses on the philosophy, history and foundations of quantum mechanics, with special attention to non-locality."},
      {slug:"myrvold", init:"WM", n:"Wayne Myrvold", a:"University of Western Ontario", b:"Wayne Myrvold is professor of philosophy at the University of Western Ontario. His work focuses on philosophy of physics, including the foundations of quantum mechanics and thermodynamics. He is the subject editor for Quantum Mechanics for the Stanford Encyclopedia of Philosophy and the author of Beyond Chance and Credence (OUP 2021)."},
      {slug:"ney", init:"AN", n:"Alyssa Ney", a:"LMU München", b:"Alyssa Ney is Professor of Metaphysics and Vice-Dean for Research at LMU Munich, and a member of the Munich Center for Quantum Science and Technology (MCQST). Her research focuses on fundamentality, the unity of science, and the interpretation of quantum theories. She holds an MS in Physics from UC Davis and a PhD in Philosophy from Brown University, and previously taught at UC Davis and Rochester."}
    ],
    program:[
      {day:"Day 1", date:"Monday, 15 June 2026", venue:"Aula Rossa, Palazzo Battiferri, Via Aurelio Saffi 42, Urbino", slots:[
        {time:"9.30 - 10.00", t:"Introductory Remarks", who:"Giorgio Calcagnini (Chancellor, University of Urbino) &middot; Andrea Viceré (University of Urbino) &middot; Vincenzo Fano (University of Urbino)"},
        {time:"10.00 - 12.00", t:"Introduction to Quantum Wave Functions", who:"Wayne Myrvold (University of Western Ontario)"},
        {time:"12.00 - 14.30", t:"Lunch break", who:""},
        {time:"14.30 - 16.30", t:"The Case for Realism about Quantum States", who:"Wayne Myrvold (University of Western Ontario)"},
        {time:"16.30 - 17.00", t:"Coffee break", who:""},
        {time:"17.00 - 19.00", t:"The Wave Function is as the Wave Function does (1)", who:"Valia Allori (University of Bergamo)"}
      ]},
      {day:"Day 2", date:"Tuesday, 16 June 2026", venue:"Aula Rossa, Palazzo Battiferri, Urbino", slots:[
        {time:"10.00 - 12.00", t:"The Wave Function is as the Wave Function does (2)", who:"Valia Allori (University of Bergamo)"},
        {time:"12.00 - 14.30", t:"Lunch break", who:""},
        {time:"14.30 - 16.30", t:"The wave function: a role for history (1)", who:"Federico Laudisa (University of Trento)"},
        {time:"16.30 - 17.00", t:"Coffee break", who:""},
        {time:"17.00 - 19.00", t:"The wave function: a role for history (2)", who:"Federico Laudisa (University of Trento)"}
      ]},
      {day:"Day 3", date:"Wednesday, 17 June 2026", venue:"Aula Rossa, Palazzo Battiferri, Urbino", slots:[
        {time:"10.00 - 12.00", t:"Arguments for Wave Function Realism", who:"Alyssa Ney (LMU München)"},
        {time:"12.00 - 14.30", t:"Lunch break", who:""},
        {time:"14.30 - 16.30", t:"Student session", who:"Ada Koprululer (Barcelona) &middot; Margherita Moro (Leeds) &middot; Alexander Niederklapfer (LSE)"},
        {time:"16.30 - 17.00", t:"Coffee break", who:""},
        {time:"17.00 - 19.00", t:"Wave Functions or Density Matrices?", who:"Alyssa Ney (LMU München)"},
        {time:"20.00", t:"Social Dinner", who:"A restaurant in Urbino (covered by the fee)"}
      ]},
      {day:"Day 4", date:"Thursday, 18 June 2026", venue:"Aula Rossa, Palazzo Battiferri, Urbino", slots:[
        {time:"10.00 - 12.00", t:"QBism &sub; RQM &sub; EQM", who:"Andrea Di Biagio (IQOQI Vienna)"},
        {time:"12.00 - 14.30", t:"Lunch break", who:""},
        {time:"14.30 - 16.30", t:"QBism &sub; RQM &sub; EQM", who:"Andrea Di Biagio (IQOQI Vienna)"},
        {time:"16.30 - 16.40", t:"Closing Remarks", who:""},
        {time:"17.00 - 17.30", t:"Measured Time and Celestial Predictions", who:"Exhibition at the Church of San Girolamo &mdash; rare books on astronomy and timekeeping in the late Renaissance"}
      ]},
      {day:"Day 5", date:"Friday, 19 June 2026", venue:"Biblioteca Malatestiana, Sala Lignea, Cesena", slots:[
        {time:"10.00 - 12.00", t:"Guided Visit to the Palazzo Ducale", who:"Ticket &euro;12 &mdash; register by emailing the organizers by 18 June 2026"},
        {time:"17.00 - 19.00", t:"Processo Popolare: &laquo;Il caso della funzione d'onda&raquo;", who:"Giudice: Mario Alai &middot; Difesa: Gino Tarozzi, Marco Sanchioni &middot; Accusa: Niccolò Covoni, Andrea Di Biagio"}
      ]}
    ],
    participants:["Anna Gabetti (Politecnico Torino)","Dorian Schiffer (TU Vienna)","Silvia Miloso (Florence)","Sofia Di Pirro (Lateranense / Perugia)","Roberta Serafini (Roma 3)","Arianna Laura Savelli (Trento)","Margherita Moro (Leeds)","Damiano Santoferrara (CEA Saclay)","Floris Eskens (Oslo)","Charlene Laffond (Vienna)","Joppe Widstam (MPI Complex Systems)","Simon Peter Leban (Ljubljana)","Paolo Di Sia (Padua)","Giulia Ferrigno","Gianluca Bona (IISS Gandhi)","Sauro Niccolai (IISS G. Peano)","Anna Michelini (Trento)","Alessandro Mengoni (Torino)","Paolo Faglia (Oxford)","Niamh Marquess-Bowler (Bristol)","Nina Mazurewicz (Warsaw)","Ada Koprululer (Barcelona)","Piergiuseppe Sancetta (Edinburgh)","Giorgia Moioli (Milan)","Berfu Nacar (Yeditepe)","Carla Torné Pujol (Barcelona)","Giulia Romanini (Trento)","Céleste M.E. Hogan (Bard College)","Aric Hackebill (Vermont)","Jessica Pohlmann (Rutgers)","John Stark (Western Ontario)","Xingyu Lyu (Mannheim)","Giovanni Rizzotto (USI)","Anna Mazzocchi (Copenhagen)","Francisco Pipa (Queensland)","Cedric Igelspacher (LMU)","Elias Carlini (Milan)","Alex Gough (Birmingham)","Alexander Niederklapfer (LSE)","Emily Patterson (Toronto)","Alessandro Spizzico (USI)","Jordan Grujic (Pittsburgh)","Davide Romano (Verona)","Dario Aversa (Foggia)","Daniele Pizzocaro (UC Louvain)","Valentina Ruggiero (Graz)","Mia Nascimben (Bologna)","Alberto Bucci (Urbino)"],
    hotels:[
      {n:"Bonconte ★★★★", d:"Via delle Mura 28 &middot; 0722.2463 &middot; bonconte@viphotels.it"},
      {n:"San Domenico ★★★★", d:"Piazza Rinascimento 3 &middot; 0722.2626 &middot; sandomenico@viphotels.it"},
      {n:"Mamiani ★★★★", d:"Via Bernini 6 &middot; 0722.322309"},
      {n:"Italia ★★★", d:"Corso Garibaldi 32 &middot; 0722.2701 &middot; info@albergo-italia-urbino.it"},
      {n:"Dei Duchi ★★★", d:"Via Dini 12 &middot; 0722.328226"},
      {n:"Raffaello ★★★", d:"Via Santa Margherita 40 &middot; 0722.4784"},
      {n:"La Meridiana ★★★", d:"Loc. Trasanni, Via Urbinate 43 &middot; 0722.320169"},
      {n:"Nenè ★★★", d:"Loc. Crocicchia, Via Biancalana 39 &middot; 0722.2996"},
      {n:"La Tortorina ★★★", d:"Via Ottaviano Petrucci 4 &middot; 0722.327715"},
      {n:"Frontespino ★★★", d:"Loc. Tufo, Via Fontespino 8/10 &middot; 0722.57331"}
    ],
    bnbs:[
      {n:"Abaco &ndash; Alma Domus", d:"Via Mainardi 1 &middot; 0722.4311 &middot; almadomus@gmail.com"},
      {n:"Aquilone", d:"Via Gramsci 22 &middot; 0722.328154"},
      {n:"Il Campo degli Olivi", d:"Via Colonna 7/c &middot; 0722.327656"},
      {n:"Il Cortegiano", d:"Via Veterani 1 int. C &middot; 0722.2278"},
      {n:"L'Orologio", d:"Via dell'Orologio di Sotto 11 &middot; 0722.327071"},
      {n:"L'Oasi", d:"Loc. Tufo, Via del Cardellino 2 &middot; 0722.339004"},
      {n:"Il Posto delle Fate", d:"Via Duchi di Montefeltro 26 &middot; 0722.345176"},
      {n:"Cà Lajala", d:"Loc. San Marino, Via Sant'Eufemia 5 &middot; 0722.53179"},
      {n:"Cà Il Governatore", d:"Loc. Trasanni, SP Montefabbri 30/32 &middot; 0722.327060"},
      {n:"Monte delle Allodole", d:"Via Ca' Bergamo 6 &middot; 0722.52614"},
      {n:"Montefeltro", d:"Loc. Schieti, Via del Forno 8 &middot; 0722.59315"},
      {n:"Santa Maria delle Grazie", d:"Loc. Forcuini, SP Montefabbri 100 &middot; 348.3621692"}
    ]
  };

  function c26hero() {
    return `
    <section class="hero c26hero" style="background-image:url('assets/art/hero-cosmos.svg')"><div class="wrap hero-grid">
      <div>
        <span class="eyebrow">${current.roman} Edition${current.status==="current"?" &middot; in progress":""} &middot; ${esc(current.dateRange)}</span>
        <h1>${esc(current.theme)}</h1>
        <p class="lead">XXIX International Philosophy of Physics Summer School &middot; University of Urbino</p>
      </div>
      <figure class="hero-fig"><img src="assets/art/wave-function.svg" alt="${esc(current.tag)}"><figcaption>${esc(current.tag)}</figcaption></figure>
    </div></section>`;
  }
  function c26nav(active) {
    const items=[["current.html","Overview","home"],["2026-speakers.html","Speakers","speakers"],["2026-program.html","Programme","program"],["2026-participation.html","Call for Participations","participation"],["2026-participants.html","Participants","participants"],["2026-urbino.html","Urbino &amp; Accommodation","urbino"],["2026-contacts.html","Contacts","contacts"]];
    return `<nav class="subnav"><div class="wrap">${items.map(([h,l,k])=>`<a href="${h}"${k===active?' class="on"':''}>${l}</a>`).join("")}</div></nav>`;
  }
  const spkCard=p=>`
    <div class="spk-card">
      <div class="spk-photo">
        <span class="spk-mono">${p.init}</span>
        <img src="assets/speakers/${p.slug}.jpg" alt="${esc(p.n)}" loading="lazy" onerror="this.remove()">
      </div>
      <div class="spk-body"><h3>${esc(p.n)}</h3><div class="aff">${p.a}</div><p>${p.b}</p></div>
    </div>`;
  const slot=x=>`<div class="slot"><div class="t">${x.time}</div><div><b>${x.t}</b>${x.who?`<div class="who">${x.who}</div>`:""}</div></div>`;
  const dayBlock=d=>`<div class="prog-day"><h3>${d.day}</h3><div class="when">${d.date} &middot; ${d.venue}</div>${d.slots.map(slot).join("")}</div>`;
  const accCard=x=>`<div class="acc"><b>${x.n}</b><span class="d">${x.d}</span></div>`;

  function renderCurrentHome() {
    chrome("current");
    byId("app").innerHTML = c26hero() + c26nav("home") + `
    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">The 2026 edition</div><h2>History and Philosophy of the Wave Function</h2></div>
      <p>The XXIX International Philosophy of Physics Summer School of the University of Urbino addresses a crucial topic at the intersection of physics and philosophy: the epistemological and ontological status of the wave function. The School explores both the physical and conceptual dimensions of one of the central entities of quantum theory &mdash; its mathematical role, its historical development within quantum mechanics, and contemporary debates over its interpretation and ontology.</p>
      <p>This year's edition is part of the worldwide celebrations marking the centenary of quantum mechanics. The programme combines plenary lectures with seminars and student presentations, fostering dialogue among physicists and philosophers, PhD students and early-career researchers.</p>
      <div class="meta">
        <div><b>${esc(current.dateRange)}</b></div>
        <div><b>Palazzo Battiferri</b>, Urbino</div>
        <div><b>5</b> plenary speakers</div>
      </div>
      <div class="cta-row">
        <a class="btn btn-gold" href="2026-program.html">See the programme</a>
        <a class="btn btn-ghost" href="2026-speakers.html">Meet the speakers</a>
      </div>
      <dl class="info" style="margin-top:26px">
        <dt>Director</dt><dd>Vincenzo Fano (University of Urbino)</dd>
        <dt>Organizers</dt><dd>Marco Sanchioni (Sophia University Institute) &middot; Niccolò Covoni (University of Urbino / USI)</dd>
        <dt>Publication</dt><dd>Selected workshop papers appear in a special issue of <a href="https://journal.sophiauniversity.org/" target="_blank" rel="noopener"><em>Sophia</em></a></dd>
      </dl>
    </div></section>`;
  }
  function renderCurrentSpeakers() {
    chrome("current");
    byId("app").innerHTML = c26nav("speakers") + `
    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Speakers</div><h2>Plenary speakers</h2>
        <p>Five internationally renowned speakers across physics and philosophy.</p></div>
      <div class="spk-grid">${Y2026.bios.map(spkCard).join("")}</div>
    </div></section>`;
  }
  function renderCurrentProgram() {
    chrome("current");
    byId("app").innerHTML = c26nav("program") + `
    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Programme</div><h2>Five days in Urbino</h2>
        <p>All times are CEST (UTC+2). Main venue: Palazzo Battiferri.</p></div>
      ${Y2026.program.map(dayBlock).join("")}
    </div></section>`;
  }
  function renderCurrentParticipation() {
    chrome("current");
    byId("app").innerHTML = c26nav("participation") + `
    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Call for Participations</div><h2>Application, abstracts &amp; fee</h2>
        <p>Applications for the ${current.year} edition are now closed &mdash; the School is in progress.</p></div>
      <dl class="info">
        <dt>Application</dt><dd>Cover letter (motivation) and a CV. Deadline was 29 March 2026; acceptance notified by 10 April 2026.</dd>
        <dt>Call for abstracts</dt><dd>Four young researchers present original papers in a dedicated workshop. Extended abstract (&le; 2000 words, prepared for blind review) plus a title page.</dd>
        <dt>Fee</dt><dd>&euro;100 contribution to SILFS &mdash; covers attendance, school materials, social dinner and coffee breaks. Accommodation, lunch and dinner are not included.</dd>
        <dt>Social dinner</dt><dd>Wednesday 17 June, at a restaurant in Urbino, covered by the fee. All participants are warmly invited.</dd>
        <dt>Publication</dt><dd>Selected papers appear in a special issue of <a href="https://journal.sophiauniversity.org/" target="_blank" rel="noopener"><em>Sophia</em></a>.</dd>
      </dl>
    </div></section>`;
  }
  function renderCurrentParticipants() {
    chrome("current");
    byId("app").innerHTML = c26nav("participants") + `
    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Participants</div><h2>Selected participants</h2>
        <p>${Y2026.participants.length} young researchers from across Europe and beyond.</p></div>
      <div class="plist">${Y2026.participants.map(p=>`<div>${p}</div>`).join("")}</div>
    </div></section>`;
  }
  function renderCurrentUrbino() {
    chrome("current");
    byId("app").innerHTML = c26nav("urbino") + `
    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Getting there</div><h2>How to reach Urbino</h2></div>
      <dl class="info">
        <dt>By air</dt><dd><b>Ancona</b>, <b>Bologna</b> or <b>Rome</b> airports. From Ancona or Bologna take a bus to the train station, a train to Pesaro, then a bus to Urbino. From Rome, the Adriabus coach connects Roma Tiburtina to Urbino. Get off at &ldquo;Urbino &mdash; parcheggio Santa Lucia&rdquo;.</dd>
        <dt>By train</dt><dd>Nearest station: <b>Pesaro</b> (Trenitalia). From Pesaro take a bus to Urbino, getting off at &ldquo;Urbino &mdash; parcheggio Santa Lucia&rdquo;.</dd>
        <dt>By car</dt><dd>From the south: exit the A14 at &ldquo;Fano&rdquo;. From the north: exit at &ldquo;Pesaro e Urbino&rdquo;. Then follow &ldquo;Urbino&rdquo; and park at &ldquo;Parcheggio Santa Lucia&rdquo;.</dd>
        <dt>To Palazzo Battiferri</dt><dd>From Parcheggio Santa Lucia take the two elevators to Porta Santa Lucia; the Palazzo is about 800 m inside the old town.</dd>
      </dl>
    </div></section>
    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Accommodation</div><h2>Where to sleep in Urbino</h2>
        <p>A selection of hotels and B&amp;Bs. Accommodation is not included in the fee.</p></div>
      <h3 style="margin:6px 0 12px">Hotels</h3>
      <div class="acc-grid">${Y2026.hotels.map(accCard).join("")}</div>
      <h3 style="margin:26px 0 12px">Bed &amp; Breakfasts</h3>
      <div class="acc-grid">${Y2026.bnbs.map(accCard).join("")}</div>
    </div></section>`;
  }
  function renderCurrentContacts() {
    chrome("current");
    byId("app").innerHTML = c26nav("contacts") + `
    <section class="block"><div class="wrap">
      <div class="section-head"><div class="kicker">Contacts</div><h2>Get in touch</h2></div>
      <dl class="info">
        <dt>Director</dt><dd>Prof. Vincenzo Fano (DiSPeA, University of Urbino)</dd>
        <dt>Organizers</dt><dd>Niccolò Covoni (University of Urbino / USI) &middot; Marco Sanchioni (Sophia University Institute)</dd>
        <dt>Email</dt><dd><a href="mailto:${S.email}">${S.email}</a></dd>
        <dt>Lectures</dt><dd><a href="${S.channel}" target="_blank" rel="noopener">YouTube channel &#8599;</a></dd>
      </dl>
    </div></section>`;
  }

  /* ---------- scroll-reveal animations ---------- */
  (function(){
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const app = document.getElementById('app');
    if(!app || reduce) return;
    const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold:0.06, rootMargin:'0px 0px -32px 0px' });
    const SEL = '.section-head, .card, .tile, .vcard2, .spk-card, .prog-day, .acc, .bio, .feature, dl.info, .edition, .filters, .vgrid2 > *, .plist';
    function tag(){
      let i=0, last=null;
      app.querySelectorAll(SEL).forEach(el=>{
        if(el.dataset.rev) return; el.dataset.rev='1';
        const p=el.parentElement; if(p!==last){ i=0; last=p; }
        el.classList.add('reveal'); el.style.transitionDelay=Math.min(i*45,260)+'ms'; i++;
        io.observe(el);
      });
    }
    new MutationObserver(()=>requestAnimationFrame(tag)).observe(app,{childList:true});
    requestAnimationFrame(tag);
  })();

  window.UPSS = { renderHome, renderCurrentHome, renderCurrentSpeakers, renderCurrentProgram, renderCurrentParticipation, renderCurrentParticipants, renderCurrentUrbino, renderCurrentContacts, renderLectures, renderSpeakers, renderEditions, renderAbout };
})();
