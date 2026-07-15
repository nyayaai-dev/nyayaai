/**
 * NyayaAI — Seeded current-affairs feed.
 * These are real, sourced items curated as of 2026-07-15 to bootstrap the News section.
 * Structured so a live feed (NewsAPI / PRS Legislative Research RSS / PIB) can replace
 * or append to this array later — see NEWS_CONFIG below and README.md.
 */
const NEWS_CONFIG = {
  liveFeedEndpoint: "", // e.g. "/api/news" — a backend proxy to NewsAPI/PIB/PRS. Empty = seeded data only.
};

const NEWS_DB = [
  {
    id: "waqf-sc-stay-2025",
    date: "2025-09-15",
    category: "constitution",
    tag: "Supreme Court",
    title: "Supreme Court stays key provisions of the Waqf (Amendment) Act, 2025",
    summary: "A bench led by CJI B.R. Gavai stayed provisions allowing waqf status to be suspended pending an officer's report and permitting revenue-record corrections by government officers, holding they breached separation of powers — while declining to stay the Act as a whole, in a 128-page ruling on 20 clubbed petitions.",
    source: "Supreme Court Observer",
    url: "https://www.scobserver.in/reports/constitutionality-of-waqf-amendment-act-interim-stay-judgement-pronouncement/",
    lawArea: "constitution"
  },
  {
    id: "labour-codes-central-rules-2026",
    date: "2026-05-08",
    category: "labour",
    tag: "Legislation",
    title: "Centre notifies final Central Rules for all four Labour Codes",
    summary: "The Ministry of Labour and Employment notified final rules under the Code on Wages, the Social Security Code, the OSH Code, and the Industrial Relations Code — operationalising the Codes that had formally taken effect on 21 November 2025 but remained largely dormant pending rules.",
    source: "KPMG Flash Alert",
    url: "https://kpmg.com/xx/en/our-insights/gms-flash-alert/2026/flash-alert-2026-127.html",
    lawArea: "labour"
  },
  {
    id: "bns-two-year-review-2026",
    date: "2026-07-01",
    category: "criminal",
    tag: "Policy Review",
    title: "Two years of BNS, BNSS & BSA: chargesheet compliance climbs, forensic gaps persist",
    summary: "60-day chargesheet-filing compliance rose from 51% in 2024 to 67% in 2026, and forensic-case disposal has nearly doubled, as India's new criminal codes complete two years in force. Training capacity, forensic infrastructure, and the digital divide remain flagged as ongoing implementation challenges.",
    source: "LegacyIAS / BW Legal World",
    url: "https://www.legacyias.com/new-criminal-laws-bns-bnss-bsa/",
    lawArea: "criminal"
  },
  {
    id: "sc-ai-fake-caselaw-2026",
    date: "2026-07-02",
    category: "cyber",
    tag: "Supreme Court",
    title: "Supreme Court confronts AI-generated fake case law cited before courts and tribunals",
    summary: "In Pooja Ramesh Singh v. Jammu & Kashmir Bank Ltd., the Supreme Court addressed the growing problem of AI-hallucinated citations being relied upon in judicial filings and orders, and laid down consequences for the integrity of judicial decision-making — a caution directly relevant to AI-assisted legal research tools.",
    source: "Lawctopus Academike",
    url: "https://www.lawctopus.com/academike/recent-developments-by-supreme-court-of-india-the-landmark-judgements-of-2026/",
    lawArea: "cyber"
  },
  {
    id: "euthanasia-ruling-2026",
    date: "2026-03-01",
    category: "constitution",
    tag: "Supreme Court",
    title: "Supreme Court permits passive euthanasia in definitive ruling",
    summary: "In Harish Rana v. Union of India, the Court allowed withdrawal of life-sustaining treatment for a patient in a persistent vegetative state for 13 years, establishing a clearer Article 21-based framework for passive euthanasia in India.",
    source: "Lawctopus Academike",
    url: "https://www.lawctopus.com/academike/recent-developments-by-supreme-court-of-india-the-landmark-judgements-of-2026/",
    lawArea: "constitution"
  },
  {
    id: "maternity-benefit-adoptive-2026",
    date: "2026-02-10",
    category: "labour",
    tag: "Supreme Court",
    title: "Section 60(4) of the Social Security Code struck down over adoptive-mother maternity benefits",
    summary: "In Hamsaanandini Nanduri v. Union of India, the Supreme Court held that restricting maternity benefits to adoptive mothers of children under three months old was arbitrary and unconstitutional, violating Articles 14 and 21.",
    source: "Lawctopus Academike",
    url: "https://www.lawctopus.com/academike/recent-developments-by-supreme-court-of-india-the-landmark-judgements-of-2026/",
    lawArea: "family"
  },
  {
    id: "women-permanent-commission-2026",
    date: "2026-01-20",
    category: "constitution",
    tag: "Supreme Court",
    title: "Permanent commissions for women SSC officers held a constitutional obligation, not discretion",
    summary: "In Pooja Pal v. Union of India, a bench led by CJI Surya Kant ruled that granting permanent commissions to women Short Service Commission officers in the Army is a constitutional obligation rather than a discretionary favour, calling out entrenched patriarchal assumptions in defence-sector policy.",
    source: "Lawctopus Academike",
    url: "https://www.lawctopus.com/academike/recent-developments-by-supreme-court-of-india-the-landmark-judgements-of-2026/",
    lawArea: "constitution"
  },
  {
    id: "income-tax-act-2025",
    date: "2026-04-01",
    category: "tax",
    tag: "Legislation",
    title: "Income Tax Act, 2025 takes effect for Assessment Year 2026-27",
    summary: "The simplified Income Tax Act, 2025 formally replaces the six-decade-old Income-tax Act, 1961, restructuring sections and terminology (introducing a unified 'tax year' concept) — taxpayers and practitioners are now transitioning reporting and filings to the new framework.",
    source: "Government of India",
    url: "https://www.india.gov.in/",
    lawArea: "tax"
  },
  {
    id: "dpdp-board-operational-2026",
    date: "2026-01-15",
    category: "cyber",
    tag: "Regulation",
    title: "Data Protection Board of India becomes fully operational",
    summary: "As DPDP Act rules were progressively notified through 2025-26, the Data Protection Board began actively handling personal-data-breach complaints, with penalty powers of up to ₹250 crore for significant non-compliance by Data Fiduciaries.",
    source: "Government of India",
    url: "https://www.india.gov.in/",
    lawArea: "cyber"
  }
];

if (typeof module !== "undefined") module.exports = { NEWS_DB: NEWS_DB, NEWS_CONFIG: NEWS_CONFIG };
