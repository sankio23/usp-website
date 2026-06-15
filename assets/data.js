/* =========================================================================
   UP²S² — single source of truth for the whole site.
   To add a new edition each year: copy one block in `editions` (newest first),
   fill the fields, set status, add the YouTube playlist id once videos are up.
   No build step required — every page reads from window.SCHOOL.
   ========================================================================= */
window.SCHOOL = {
  name: "Urbino Philosophy of Physics Summer School",
  acronym: "UP²S²",
  tagline: "An annual international school on the foundations of physics, in the Renaissance city of Urbino since the late 1990s.",
  org: "Organised by the Inter-University Center for Philosophy and Foundations of Physics (CIRFIS), the University of Urbino “Carlo Bo” — Department of Pure and Applied Sciences, and the Italian Society for Logic and Philosophy of Science (SILFS).",
  email: "cirfis.scuolaestiva@gmail.com",
  channel: "https://www.youtube.com/@filosofiaurbino5391",
  fee: "A contribution of €70 to SILFS covers attendance, school materials and coffee breaks. Accommodation, lunch and dinner are not included.",
  venue: {
    institution: "University of Urbino “Carlo Bo” — Department of Pure and Applied Sciences",
    address: "Via Timoteo Viti 10, 61029 Urbino (PU), Italy",
    note: "Urbino is a UNESCO World Heritage hill town in the Marche region. The University, founded in 1506, is one of the oldest in Europe."
  },
  partners: [
    { name: "CIRFIS", url: "https://cirfis.uniurb.it/" },
    { name: "SILFS", url: "https://www.silfs.it/en/home/" },
    { name: "University of Urbino", url: "https://www.uniurb.it/" },
    { name: "Sophia (journal)", url: "https://journal.sophiauniversity.org/" }
  ],
  director: "Vincenzo Fano (University of Urbino)",
  organizers: [
    "Marco Sanchioni (Sophia University Institute)",
    "Niccolò Covoni (University of Urbino / Università della Svizzera Italiana)"
  ],
  committee: [
    { n: "Mario Alai", a: "Académie Internationale de Philosophie des Sciences" },
    { n: "Francesca Battistoni", a: "University of Urbino" },
    { n: "Matteo Bedetti", a: "University of Urbino" },
    { n: "Claudio Calosi", a: "University of Venice Ca' Foscari" },
    { n: "Niccolò Covoni", a: "University of Urbino / USI" },
    { n: "Vincenzo Fano", a: "University of Urbino" },
    { n: "Giovanni Galli", a: "University of Teramo" },
    { n: "Pierluigi Graziani", a: "University of Urbino" },
    { n: "Giovanni Macchia", a: "University of Urbino" },
    { n: "Vincenzo Nespeca", a: "University of Urbino" },
    { n: "Davide Pietrini", a: "University of Urbino" },
    { n: "Simone Salzano", a: "University of Urbino / LMU München" },
    { n: "Marco Sanchioni", a: "Sophia University Institute" },
    { n: "Mirko Tagliaferri", a: "University of Urbino" },
    { n: "Gino Tarozzi", a: "University of Urbino" },
    { n: "Isabella Tassani", a: "University of Urbino" }
  ],

  // ---- EDITIONS (newest first) -------------------------------------------
  editions: [
    {
      roman: "XXIX", num: 29, year: 2026, slug: "xxix",
      theme: "History and Philosophy of the Wave Function",
      tag: "Wave Function", art: "assets/art/wave-function.svg",
      cover: "https://lh3.googleusercontent.com/sitesv/AA5AbUAvO3Y98z-dEB-_3MRiLtqHWgt2-rd1jdFQ7bA4IkhBMU68ItcOZK86yWmxJjYbTSSl4aSfn2iAtR8CQA5hvqbKEx-yCS0IuXYkC0LH3URuN1FHzXp3FLS3hiHf5J9_7r7heXs2PWwy3uOI0SQydwaxPcSmV1KMYgp6umeYCLBpH553wdPk4-dcunevm54=w1600",
      dateRange: "15–19 June 2026",
      location: "Palazzo Battiferri, Via Aurelio Saffi 42, Urbino",
      status: "current", format: "in person",
      blurb: "Addresses the epistemological and ontological status of the wave function — its mathematical role, its historical development within quantum mechanics, and contemporary debates over its interpretation and ontology. Part of the worldwide centenary celebrations of quantum mechanics.",
      speakers: [
        { n: "Valia Allori", a: "University of Bergamo", u: "https://www.unibg.it/ugov/person/151867" },
        { n: "Andrea Di Biagio", a: "IQOQI Vienna", u: "https://www.qiss.fr/andrea-di-biagio-2/" },
        { n: "Federico Laudisa", a: "University of Trento", u: "https://webapps.unitn.it/du/en/Persona/PER0203521/Curriculum" },
        { n: "Alyssa Ney", a: "LMU München", u: "https://sites.google.com/site/alyssaney/" },
        { n: "Wayne Myrvold", a: "University of Western Ontario", u: "https://www.uwo.ca/philosophy/people/myrvold.html" }
      ],
      playlist: null,
      official: "https://sites.google.com/campus.uniurb.it/xxix-urbino-summer-school/home",
      apply: "https://sites.google.com/campus.uniurb.it/xxix-urbino-summer-school/call-for-participations",
      deadline: "29 March 2026 (acceptance by 10 April 2026)"
    },
    {
      roman: "XXVIII", num: 28, year: 2025, slug: "xxviii",
      theme: "Epistemology of Quantum Gravity",
      tag: "Quantum Gravity", art: "assets/art/quantum-gravity.svg",
      cover: "https://lh3.googleusercontent.com/sitesv/AA5AbUDLpyO6ZZwjhIyN9NCS4plFnULrl9aoqsTx8ur2qRJTRvxSAKwGq-XuIgphX-ERwMDcISX8oOJOZ9EEbF2p9y31xVCWOfgIi4M8xNsqkkSD9QoOHkpNQ9ea4ong2ng9-sd2SIGJATK_5ennq7I0lQV4TnNQ9t4fg6uy32fvPRysOE_4nBYR4YttT0t4JXg=w1600",
      dateRange: "26–30 May 2025",
      location: "Palazzo Albani, Via Timoteo Viti 10, Urbino",
      status: "past", format: "in person",
      blurb: "Explores the epistemological status of quantum gravity theories: how can such a theory be formulated without empirical data, and how can its progress be evaluated? Lectures span the physics, philosophy and conceptual foundations of quantum gravity and its links to cosmology, epistemology and metaphysics.",
      speakers: [
        { n: "Eugenia Colafranceschi", a: "University of Western Ontario", u: "https://uwaterloo.ca/math/news/banting-fellow-dr-eugenia-colafranceschi-will-join-applied" },
        { n: "Karen Crowther", a: "University of Oslo", u: "https://www.hf.uio.no/ifikk/english/people/aca/philosophy/tenured/karencr/" },
        { n: "Erik Curiel", a: "University of Bonn", u: "https://www.mcmp.philosophie.uni-muenchen.de/people/faculty/curiel/index.html" },
        { n: "Richard Dawid", a: "Stockholm University", u: "https://www.su.se/english/profiles/r/rdawi" },
        { n: "Philipp Hoehn", a: "OIST", u: "https://www.oist.jp/research/research-units/quast/philipp-hohn" }
      ],
      playlist: null, // dedicated playlist not published; lectures on the channel
      official: "https://sites.google.com/view/xxviii-urbino-summer-school/"
    },
    {
      roman: "XXVII", num: 27, year: 2024, slug: "xxvii",
      theme: "Philosophy of Dark Energy",
      tag: "Dark Energy", art: "assets/art/dark-energy.svg",
      cover: "https://lh3.googleusercontent.com/sitesv/AA5AbUCaqErW3tCvj1O5cYbwacPY3w6__anGtf7zeZA9NUsMpBrgQ17f27FD96MGDCmKssoXA7FoKe2x5--WJReew41NFZ11uPGrJWAVNF4OkNxKdx--YTowg1qkfo_6KTYkstT4jtHiwJzr91WmNRO_tfQ-zEn7Ao-AJNKbGFVTs-ruskUCbxxKMyhX-OZs=w1600",
      dateRange: "3–7 June 2024",
      location: "Palazzo Albani, Via Timoteo Viti 10, Urbino",
      status: "past", format: "in person",
      blurb: "In-depth lectures on the physics, philosophy and conceptual foundations of dark energy and its relations to cosmology, epistemology and metaphysics.",
      speakers: [
        { n: "Erik Curiel", a: "University of Bonn", u: "https://www.mcmp.philosophie.uni-muenchen.de/people/faculty/curiel/index.html" },
        { n: "Viatcheslav Mukhanov", a: "LMU Munich", u: "https://www.theorie.physik.uni-muenchen.de/cosmology/members/professors/mukhanov/index.html" },
        { n: "Vera Matarese", a: "University of Perugia", u: "https://www.unipg.it/personale/vera.matarese/en" },
        { n: "Juliusz Doboszewski", a: "University of Bonn", u: "https://www.philosophie.uni-bonn.de/institut/personen/wissenschaftliches-personal/lichtenberg-professur-fuer-philosophie-und-geschichte-der-physik-prof-dr-dennis-lehmkuhl/juliusz-doboszewski" }
      ],
      playlist: "PLGB6R7lq1LX9Ez9sU2gjPQXd3MHeS2JmY",
      official: "https://sites.google.com/view/xxvii-urbino-summer-school/home"
    },
    {
      roman: "XXVI", num: 26, year: 2023, slug: "xxvi",
      theme: "Philosophy of Dark Matter",
      tag: "Dark Matter", art: "assets/art/dark-matter.svg",
      cover: "https://lh3.googleusercontent.com/sitesv/AA5AbUC8E1gbHwyRPcf6P3AUq9Ts7WhaCLDzz7WUy7x6R7A7kUEujsd2FjoKib4ZPfV5h5UEyr81kq1y-P9EP65nCm8hrF0AvMzaBqs6vYSY1OG_0dRHVDvdNvb1VT3gRvT4HnMQvw6vDnzcQDokeFMV_7HndrNvpkolS4JELNRKOH4IlZlkDMJpNfeUBevNZx4=w1600",
      dateRange: "5–9 June 2023",
      location: "University of Urbino",
      status: "past", format: "in person",
      blurb: "A focus on dark matter across physics and philosophy — its conceptual foundations and relations to cosmology, epistemology and metaphysics. With the media partnership of Entropy.",
      speakers: [
        { n: "Francesca Vidotto", a: "UWO / Rotman", u: "https://physics.uwo.ca/people/faculty_web_pages/vidotto.html" },
        { n: "Piero Ullio", a: "SISSA", u: "https://www.sissa.it/tpp/members.php?ID=82" },
        { n: "Siska De Baerdemaeker", a: "University of Stockholm", u: "https://www.su.se/english/profiles/s/side3694" },
        { n: "Niels Martens", a: "University of Utrecht", u: "https://www.uu.nl/en/research/utrecht-philosophy-of-astronomy-cosmology/people/niels-martens" },
        { n: "Nicola Rossi", a: "Gran Sasso", u: "https://sciprofiles.com/profile/1466899" }
      ],
      playlist: "PLGB6R7lq1LX8IzpJZehTnsTXiI8-AfuPo", firstVideo: "EkdTxOjHm6c",
      official: "https://sites.google.com/view/xxvi-urbino-summer-school/home"
    },
    {
      roman: "XXV", num: 25, year: 2022, slug: "xxv",
      theme: "Dualities Between Physics and Philosophy",
      tag: "Dualities", art: "assets/art/dualities.svg",
      cover: "assets/covers/xxv-dualities.jpg",
      dateRange: "6–11 June 2022",
      location: "University of Urbino (hybrid)",
      status: "past", format: "hybrid",
      blurb: "Dualities — in particular their gauge/gravity incarnation — and their philosophical implications. The end-of-school workshop featured senior speakers Jeremy Butterfield (Cambridge) and Baptiste Le Bihan (Geneva).",
      speakers: [
        { n: "Jonathan Bain", a: "NYU", u: "https://engineering.nyu.edu/faculty/jonathan-bain" },
        { n: "Johanna Erdmenger", a: "University of Würzburg", u: "https://www.physik.uni-wuerzburg.de/en/tp3/people/chairholder/prof-dr-johanna-erdmenger/" },
        { n: "Sebastian De Haro", a: "UvA", u: "https://www.uva.nl/en/profile/h/a/s.deharoolle/s.de-haro-olle.html" }
      ],
      playlist: "PLGB6R7lq1LX-w5sSgaGqrHMgCEgZaCl3o", firstVideo: "lE4CI7LMJlE",
      official: "https://sites.google.com/view/xxv-urbino-summer-school/home"
    },
    {
      roman: "XXIV", num: 24, year: 2021, slug: "xxiv",
      theme: "Black Holes and the Information Loss Paradox",
      tag: "Black Holes", art: "assets/art/black-holes.svg",
      cover: "assets/covers/xxiv-black-holes.jpg",
      dateRange: "7–12 June 2021",
      location: "Online (COVID-19)",
      status: "past", format: "online",
      blurb: "Focused on a theme recognised by the 2020 Nobel Prize in Physics: black holes, and in particular the paradoxes connected to their quantum description. Afternoon tutorials by Christian Wüthrich, Sebastian De Haro and Patricia Palacios.",
      speakers: [
        { n: "Daniel Harlow", a: "MIT", u: "https://physics.mit.edu/faculty/daniel-harlow/" },
        { n: "Erik Curiel", a: "LMU Munich", u: "https://www.mcmp.philosophie.uni-muenchen.de/people/faculty/curiel/index.html" },
        { n: "Christian Wüthrich", a: "University of Geneva", u: "https://www.wuthrich.net/" },
        { n: "Sebastian De Haro", a: "UvA", u: "https://www.uva.nl/en/profile/h/a/s.deharoolle/s.de-haro-olle.html" },
        { n: "Patricia Palacios", a: "University of Salzburg", u: "https://www.plus.ac.at/philosophy-gw/the-department/personal/patricia-palacios/?lang=en" }
      ],
      playlist: "PLGB6R7lq1LX8eO7Ijy4B-sL-J8cTfmwKE", firstVideo: "3zDSWeUvrlw",
      official: "https://sites.google.com/view/xxivurbinosummerschool/home"
    }
  ]
};
