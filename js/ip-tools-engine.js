/**
 * IP Toolkit's local logic — real string-matching and rule-based checks, no AI backend needed:
 * - Trademark similarity checker: Levenshtein edit-distance + a simplified phonetic key, scored
 *   against the small seeded TRADEMARK_DB reference set (js/data/trademark-database.js).
 * - Trademark class finder: keyword overlap against NICE_CLASSES.
 * - Patentability quick-check: rule-based screen against the major Patents Act §3 exclusions.
 * None of this is a live government database lookup — every result panel says so.
 */
const IPToolsEngine = (function () {
  function normalize(str) {
    return String(str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function levenshtein(a, b) {
    a = normalize(a); b = normalize(b);
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const prev = new Array(n + 1);
    const curr = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      curr[0] = i;
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      }
      for (let j = 0; j <= n; j++) prev[j] = curr[j];
    }
    return prev[n];
  }

  function similarityPercent(a, b) {
    const na = normalize(a), nb = normalize(b);
    const maxLen = Math.max(na.length, nb.length);
    if (maxLen === 0) return 100;
    const dist = levenshtein(na, nb);
    return Math.round((1 - dist / maxLen) * 100);
  }

  // A simplified phonetic key — not a formal linguistic algorithm, just consonant-grouping
  // and vowel-stripping so near-homophones (e.g. "Kwikk" vs "Quick") still surface as a match
  // even when their spelled-out edit distance looks large.
  function phoneticKey(str) {
    let s = normalize(str);
    if (!s) return "";
    const first = s[0];
    s = s
      .replace(/ph/g, "f")
      .replace(/[cqk]/g, "k")
      .replace(/[vw]/g, "v")
      .replace(/[sz]/g, "s")
      .replace(/[jg]/g, "j")
      .replace(/[aeiou]/g, "")
      .replace(/(.)\1+/g, "$1");
    return first + s;
  }

  function checkTrademarkSimilarity(proposedName, classNum) {
    const name = String(proposedName || "").trim();
    if (!name) return [];
    const proposedPhonetic = phoneticKey(name);
    const results = TRADEMARK_DB.map(function (mark) {
      const base = similarityPercent(name, mark.name);
      const phoneticMatch = phoneticKey(mark.name) === proposedPhonetic && proposedPhonetic.length > 1;
      const sameClass = !classNum || mark.classes.indexOf(Number(classNum)) !== -1;
      let score = base;
      if (phoneticMatch) score = Math.max(score, 80);
      if (!sameClass) score = Math.round(score * 0.55); // cross-class conflicts are weaker in Indian TM law, but well-known marks can still get wider protection
      return { mark: mark.name, category: mark.category, classes: mark.classes, sameClass: sameClass, score: score, phoneticMatch: phoneticMatch };
    })
      .filter(function (r) { return r.score >= 35 || r.phoneticMatch; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 8)
      .map(function (r) {
        r.risk = r.score >= 70 ? "High" : r.score >= 45 ? "Medium" : "Low";
        return r;
      });
    return results;
  }

  function findTrademarkClasses(description) {
    const text = String(description || "").toLowerCase();
    if (!text.trim()) return [];
    const scored = NICE_CLASSES.map(function (c) {
      let score = 0;
      c.keywords.forEach(function (kw) {
        if (text.indexOf(kw) !== -1) score += kw.split(" ").length; // multi-word keyword hits count more
      });
      return { num: c.num, title: c.title, score: score };
    }).filter(function (c) { return c.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 3);
    return scored;
  }

  const PATENT_EXCLUSIONS = [
    { id: "algorithm", label: "It's mainly an algorithm, mathematical method, or computer program by itself (no new hardware or technical effect)", cite: "Patents Act §3(k)", note: "Mathematical methods, business methods, and computer programs 'per se' are excluded — but software tied to a new technical effect or hardware improvement can still qualify." },
    { id: "business-method", label: "It's fundamentally a way of doing business (a business method)", cite: "Patents Act §3(k)", note: "Pure business methods are excluded, regardless of novelty." },
    { id: "discovery", label: "It's a discovery of a scientific principle, or an already-existing natural substance/organism", cite: "Patents Act §3(c)/§3(d)", note: "Mere discoveries aren't inventions. A new form of a known substance is also excluded unless it shows significantly enhanced efficacy (the Novartis/Glivec principle)." },
    { id: "treatment", label: "It's a method of medical, surgical, or diagnostic treatment for humans or animals", cite: "Patents Act §3(i)", note: "Treatment methods themselves aren't patentable in India, though a novel device or drug composition used in the treatment can be." },
    { id: "mental-act", label: "It's a mental act, a rule for playing a game, or a scheme for doing something, on its own", cite: "Patents Act §3(m)", note: "Purely mental/abstract schemes and game rules are excluded." },
    { id: "traditional", label: "It's based on traditional knowledge or an aggregation/duplication of already-known properties", cite: "Patents Act §3(p)", note: "Traditional knowledge and mere admixtures of known components (without a new synergistic effect) are excluded." },
    { id: "aesthetic", label: "It's purely an artistic, literary, or aesthetic creation with no technical/functional aspect", cite: "Patents Act §3(f)", note: "Aesthetic creations belong to copyright or design law, not patents." }
  ];

  function checkPatentability(answers) {
    const triggered = PATENT_EXCLUSIONS.filter(function (ex) { return answers[ex.id]; });
    return { triggered: triggered, clear: triggered.length === 0 };
  }

  return {
    levenshtein: levenshtein,
    similarityPercent: similarityPercent,
    phoneticKey: phoneticKey,
    checkTrademarkSimilarity: checkTrademarkSimilarity,
    findTrademarkClasses: findTrademarkClasses,
    checkPatentability: checkPatentability,
    PATENT_EXCLUSIONS: PATENT_EXCLUSIONS
  };
})();
