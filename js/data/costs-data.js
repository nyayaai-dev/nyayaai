/**
 * NyayaAI — Legal Cost Calculator matter-type definitions.
 * Each matter type declares the inputs it needs; js/costs-engine.js has the actual
 * range/average calculation per matter. Every figure here is an illustrative range
 * compiled from commonly published sources — not an official fee schedule (except
 * where explicitly noted as a government rate, e.g. MCA incorporation slabs and
 * trademark e-filing fees, which are fixed and cited).
 */
const COSTS_DATA = [
  {
    id: "property",
    icon: "🏠",
    name: "Property Purchase / Sale",
    tagline: "Stamp duty, registration & lawyer fees",
    lawArea: "property",
    inputs: [
      { id: "propertyValue", label: "Property value (₹)", type: "number", placeholder: "e.g. 6000000" },
      { id: "stateBucket", label: "Your state's stamp duty tends to be…", type: "select", options: ["Not sure — show typical range", "Lower (e.g. Gujarat, some NE states, ~4-5%)", "Typical (e.g. Maharashtra, Delhi, Karnataka, ~5-7%)", "Higher (e.g. UP, Kerala, Tamil Nadu, Rajasthan, ~7-8%+)"] }
    ]
  },
  {
    id: "civil-suit",
    icon: "📜",
    name: "Civil Suit / Money Recovery",
    tagline: "Court fees & litigation costs",
    lawArea: "civil",
    inputs: [
      { id: "claimValue", label: "Amount being claimed (₹)", type: "number", placeholder: "e.g. 500000" }
    ]
  },
  {
    id: "company-registration",
    icon: "🏢",
    name: "Company Registration",
    tagline: "MCA government fees & professional costs",
    lawArea: "corporate",
    inputs: [
      { id: "authCapital", label: "Authorised capital (₹)", type: "number", placeholder: "e.g. 1000000" },
      { id: "companyType", label: "Entity type", type: "select", options: ["Private Limited Company", "One Person Company (OPC)", "Limited Liability Partnership (LLP)"] }
    ]
  },
  {
    id: "trademark",
    icon: "💡",
    name: "Trademark Filing",
    tagline: "Government fee (fixed) + attorney costs",
    lawArea: "ip",
    inputs: [
      { id: "applicantType", label: "Applicant type", type: "select", options: ["Individual / Startup / MSME", "Company / LLP / Partnership / Other"] },
      { id: "numClasses", label: "Number of classes", type: "select", options: ["1", "2", "3", "4 or more"] }
    ]
  },
  {
    id: "consumer-complaint",
    icon: "🛒",
    name: "Consumer Complaint",
    tagline: "Nominal court fee, mostly self-filed",
    lawArea: "consumer",
    inputs: [
      { id: "claimValue", label: "Value of goods/services + compensation sought (₹)", type: "number", placeholder: "e.g. 100000" },
      { id: "hiringLawyer", label: "Are you hiring a lawyer, or representing yourself?", type: "select", options: ["Representing myself", "Hiring a lawyer"] }
    ]
  },
  {
    id: "divorce",
    icon: "👪",
    name: "Divorce",
    tagline: "Lawyer fees vary hugely by route",
    lawArea: "family",
    inputs: [
      { id: "route", label: "Route", type: "select", options: ["Mutual consent", "Contested"] }
    ]
  },
  {
    id: "criminal-defense",
    icon: "🔒",
    name: "Criminal Case Defense",
    tagline: "Lawyer fees — the main cost, highly variable",
    lawArea: "criminal",
    inputs: [
      { id: "severity", label: "Nature of the case", type: "select", options: ["Minor / bailable offence", "Serious / non-bailable offence (incl. bail application)", "Sessions trial / serious offence"] }
    ]
  },
  {
    id: "gst-registration",
    icon: "💰",
    name: "GST Registration",
    tagline: "Government fee is nil — only professional cost",
    lawArea: "tax",
    inputs: []
  },
  {
    id: "legal-notice",
    icon: "✉️",
    name: "Legal Notice",
    tagline: "Drafting fee only",
    lawArea: "civil",
    inputs: []
  }
];

if (typeof module !== "undefined") module.exports = COSTS_DATA;
