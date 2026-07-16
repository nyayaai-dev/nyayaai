/**
 * NyayaAI — Document Intelligence knowledge base.
 * Curated patterns used by js/doc-analysis.js to genuinely process uploaded document
 * text (not AI-generated per-request) — risky-phrase flags, obligation/payment
 * language, and per-document-type "commonly expected clause" checklists.
 */

const DOCUMENT_TYPES = [
  {
    id: "contract",
    name: "General Contract / Agreement",
    checklist: [
      { key: "parties", label: "Identification of parties", hints: ["party", "parties", "between", "and\\s"] },
      { key: "effective-date", label: "Effective date / commencement", hints: ["effective date", "commencement", "with effect from"] },
      { key: "term", label: "Term / duration", hints: ["term of this agreement", "duration", "shall remain in force", "expire"] },
      { key: "payment", label: "Payment terms", hints: ["payment", "consideration", "fee", "amount payable"] },
      { key: "termination", label: "Termination clause", hints: ["terminat", "notice of termination"] },
      { key: "governing-law", label: "Governing law & jurisdiction", hints: ["governing law", "governed by", "jurisdiction"] },
      { key: "dispute", label: "Dispute resolution", hints: ["dispute", "arbitration", "mediation", "conciliation"] },
      { key: "confidentiality", label: "Confidentiality", hints: ["confidential", "non-disclosure"] },
      { key: "force-majeure", label: "Force majeure", hints: ["force majeure", "act of god"] },
      { key: "signatures", label: "Signatures / execution", hints: ["signed", "signature", "in witness whereof", "executed"] }
    ]
  },
  {
    id: "nda",
    name: "NDA / Confidentiality Agreement",
    checklist: [
      { key: "definition", label: "Definition of 'Confidential Information'", hints: ["confidential information means", "definition of confidential"] },
      { key: "exclusions", label: "Exclusions from confidentiality", hints: ["shall not include", "excludes", "exclusion"] },
      { key: "duration", label: "Duration of confidentiality obligation", hints: ["period of", "years from", "survive termination"] },
      { key: "permitted-disclosure", label: "Permitted disclosures (e.g. by law)", hints: ["required by law", "court order", "permitted disclosure"] },
      { key: "return-info", label: "Return/destruction of information", hints: ["return or destroy", "return all", "destroy all"] },
      { key: "remedies", label: "Remedies for breach", hints: ["injunctive relief", "remedies", "irreparable harm"] },
      { key: "governing-law", label: "Governing law & jurisdiction", hints: ["governing law", "jurisdiction"] }
    ]
  },
  {
    id: "rental",
    name: "Rental / Lease Agreement",
    checklist: [
      { key: "property", label: "Property description", hints: ["premises", "property situated at", "schedule of property"] },
      { key: "rent", label: "Rent amount & due date", hints: ["monthly rent", "rent of rs", "rent shall be paid"] },
      { key: "deposit", label: "Security deposit amount & refund terms", hints: ["security deposit", "refundable deposit"] },
      { key: "duration", label: "Lease duration", hints: ["lease period", "term of.{0,10}months", "term of.{0,10}years", "eleven months"] },
      { key: "maintenance", label: "Maintenance responsibilities", hints: ["maintenance", "repairs shall be"] },
      { key: "notice-period", label: "Notice period for termination", hints: ["notice period", "(day|week|month)s?.{0,3}s?.{0,15}notice", "notice.{0,15}(day|week|month)"] },
      { key: "restrictions", label: "Restrictions (subletting, alterations, pets)", hints: ["sublet", "sub-let", "alteration", "without.{0,15}consent"] },
      { key: "registration", label: "Registration of agreement", hints: ["registration", "registered under"] }
    ]
  },
  {
    id: "employment",
    name: "Employment Contract",
    checklist: [
      { key: "designation", label: "Designation & role", hints: ["designation", "position of", "job title"] },
      { key: "compensation", label: "Compensation & benefits", hints: ["salary", "compensation", "ctc", "remuneration"] },
      { key: "probation", label: "Probation period", hints: ["probation"] },
      { key: "hours", label: "Working hours", hints: ["working hours", "hours of work"] },
      { key: "leave", label: "Leave policy", hints: ["leave policy", "annual leave", "casual leave", "sick leave"] },
      { key: "notice-period", label: "Notice period (resignation/termination)", hints: ["notice period", "(day|week|month)s?.{0,3}s?.{0,15}notice", "notice.{0,15}(day|week|month)"] },
      { key: "confidentiality", label: "Confidentiality obligations", hints: ["confidential", "non-disclosure"] },
      { key: "non-compete", label: "Non-compete / non-solicitation", hints: ["non-compete", "non-solicitation", "competing business"] },
      { key: "termination-grounds", label: "Grounds for termination", hints: ["grounds for termination", "termination for cause", "misconduct"] },
      { key: "grievance", label: "Grievance / dispute mechanism", hints: ["grievance", "dispute resolution"] }
    ]
  },
  {
    id: "sale-deed",
    name: "Sale Deed",
    checklist: [
      { key: "parties", label: "Vendor & purchaser details", hints: ["vendor", "purchaser", "seller", "buyer"] },
      { key: "property", label: "Property description & boundaries", hints: ["schedule of property", "bounded by", "survey no"] },
      { key: "consideration", label: "Sale consideration / price", hints: ["sale consideration", "total consideration", "sum of rs"] },
      { key: "payment-schedule", label: "Payment schedule", hints: ["payment schedule", "paid in the following manner", "instalment"] },
      { key: "possession", label: "Possession date", hints: ["possession", "handed over"] },
      { key: "title-warranty", label: "Title / ownership warranty", hints: ["absolute owner", "clear and marketable title", "good right"] },
      { key: "encumbrance", label: "Encumbrance-free declaration", hints: ["free from all encumbrances", "encumbrance"] },
      { key: "registration", label: "Registration & stamp duty", hints: ["registration", "stamp duty", "sub-registrar"] }
    ]
  },
  {
    id: "partnership-deed",
    name: "Partnership Deed",
    checklist: [
      { key: "partners", label: "Partners' names & contributions", hints: ["partners", "capital contribution"] },
      { key: "profit-sharing", label: "Profit/loss sharing ratio", hints: ["profit.{0,10}sharing", "sharing ratio", "in the ratio"] },
      { key: "roles", label: "Roles & responsibilities", hints: ["duties of partners", "roles and responsibilities"] },
      { key: "decision-making", label: "Decision-making process", hints: ["decision", "majority", "unanimous"] },
      { key: "admission-retirement", label: "Admission/retirement of partners", hints: ["admission of a new partner", "retirement of a partner"] },
      { key: "dissolution", label: "Dissolution terms", hints: ["dissolution", "dissolved"] },
      { key: "dispute", label: "Dispute resolution", hints: ["dispute", "arbitration"] }
    ]
  },
  {
    id: "court-order",
    name: "Court Order",
    checklist: [
      { key: "case-number", label: "Case/petition number", hints: ["case no", "petition no", "cnr", "c\\.?r\\.?no"] },
      { key: "court-name", label: "Court name & bench", hints: ["court of", "high court", "district court", "tribunal"] },
      { key: "parties", label: "Parties named", hints: ["petitioner", "respondent", "appellant", "plaintiff", "defendant"] },
      { key: "order-date", label: "Date of order", hints: ["dated", "order dated", "pronounced on"] },
      { key: "directions", label: "Directions / operative order", hints: ["it is ordered", "directed that", "hereby order"] },
      { key: "compliance-deadline", label: "Compliance deadline", hints: ["within.{0,10}days", "within.{0,10}weeks", "comply"] },
      { key: "appeal", label: "Appeal rights / next steps", hints: ["appeal", "right to appeal"] }
    ]
  },
  {
    id: "legal-notice",
    name: "Legal Notice",
    checklist: [
      { key: "sender", label: "Sender's details", hints: ["on behalf of my client", "i, the undersigned", "advocate for"] },
      { key: "recipient", label: "Recipient's details", hints: ["to,", "addressed to", "you are"] },
      { key: "date", label: "Date of notice", hints: ["dated", "date:"] },
      { key: "facts", label: "Statement of facts", hints: ["facts", "whereas", "it is submitted"] },
      { key: "demand", label: "Demand / relief sought", hints: ["you are hereby called upon", "demand", "required to"] },
      { key: "deadline", label: "Response deadline", hints: ["within.{0,10}days", "failing which"] },
      { key: "consequences", label: "Consequences of non-compliance", hints: ["legal action", "proceedings shall be initiated", "without further notice"] }
    ]
  }
];

// Keyword sets used by DocAnalysis.classifyDocumentType() to guess a document's type from its
// text (keyword-overlap scoring, same approach as the IP Toolkit's class finder) — not a trained
// ML classifier, just a fast first guess you can override via the dropdown.
const CLASSIFY_KEYWORDS = {
  contract: ["agreement", "party of the first part", "party of the second part", "consideration", "covenants", "in witness whereof"],
  nda: ["confidential information", "non-disclosure", "confidentiality agreement", "disclosing party", "receiving party"],
  rental: ["landlord", "tenant", "lessor", "lessee", "rent", "lease", "premises", "security deposit"],
  employment: ["employee", "employer", "salary", "designation", "probation", "ctc", "notice period", "resignation", "appointment letter"],
  "sale-deed": ["vendor", "vendee", "sale deed", "sale consideration", "conveyance", "immovable property", "title deed"],
  "partnership-deed": ["partner", "partnership firm", "profit sharing", "capital contribution", "partnership deed", "managing partner"],
  "court-order": ["hon'ble court", "petitioner", "respondent", "judgment", "hereby ordered", "in the matter of", "appellant"],
  "legal-notice": ["legal notice", "hereby called upon", "notice is hereby given", "failing which", "advocate for", "on behalf of my client"]
};

// Seeded list used by DocAnalysis.extractNamedEntities() to flag Indian place names —
// simple whole-word matching against a known list, not a trained NER model.
const INDIAN_PLACES = [
  "Mumbai", "Delhi", "New Delhi", "Bengaluru", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Surat", "Nagpur", "Indore", "Bhopal", "Patna",
  "Gurugram", "Gurgaon", "Noida", "Kochi", "Coimbatore", "Visakhapatnam", "Vadodara", "Nashik",
  "Faridabad", "Ghaziabad", "Thane", "Maharashtra", "Karnataka", "Tamil Nadu", "Telangana", "Gujarat",
  "Rajasthan", "Uttar Pradesh", "West Bengal", "Punjab", "Haryana", "Kerala", "Bihar", "Madhya Pradesh",
  "Odisha", "Andhra Pradesh", "Assam", "Jharkhand", "Chhattisgarh", "Uttarakhand", "Goa"
];

// Phrases commonly worth a closer look in Indian contracts — flagged descriptively,
// not as a verdict. Presence isn't inherently bad; it's a prompt to read that clause
// carefully (or run it past an advocate) rather than skim past it.
const RISKY_PHRASES = [
  { pattern: "sole discretion", label: "Sole discretion", explanation: "Gives one party unilateral decision-making power over something — worth checking what exactly is left to their judgment alone." },
  { pattern: "irrevocable", label: "Irrevocable", explanation: "Something here cannot be undone or cancelled once given — make sure you're comfortable with that being permanent." },
  { pattern: "indemnif", label: "Indemnification", explanation: "You (or the other party) may be on the hook for the other side's losses, costs, or legal fees — check the scope and any cap." },
  { pattern: "liquidated damages", label: "Liquidated damages", explanation: "A pre-agreed penalty amount for breach — check whether the amount is proportionate to the actual likely loss." },
  { pattern: "\\bpenalty\\b", label: "Penalty clause", explanation: "A direct financial penalty is specified — Indian courts scrutinise penalty clauses for being genuine pre-estimates of loss rather than punitive amounts." },
  { pattern: "non-compet", label: "Non-compete restriction", explanation: "Restricts your ability to work with competitors or start a competing business — note the restricted scope and duration; Indian courts are often unwilling to enforce broad restraints of trade." },
  { pattern: "waiv", label: "Waiver", explanation: "You (or the other party) may be giving up a legal right — check exactly what's being waived." },
  { pattern: "automatically renew|auto-renew", label: "Auto-renewal", explanation: "The agreement continues automatically unless you actively cancel — note the cancellation deadline so you don't get locked in unintentionally." },
  { pattern: "unlimited liability", label: "Unlimited liability", explanation: "No cap on how much you could ultimately owe — worth comparing against clauses in similar agreements, which often cap liability." },
  { pattern: "as[\\s-]is", label: "'As is' condition", explanation: "You're accepting something in its current condition with no warranties — relevant for property, goods, or software being provided." },
  { pattern: "without (?:prior )?notice", label: "Action without notice", explanation: "The other party can take an action (terminate, change terms, etc.) without warning you first." },
  { pattern: "unilateral(?:ly)?", label: "Unilateral change", explanation: "One party alone can decide or change something — check what exactly can be changed unilaterally, and whether you're notified." },
  { pattern: "forfeit", label: "Forfeiture", explanation: "You could lose money or property already paid or handed over under specified conditions." },
  { pattern: "personal guarantee", label: "Personal guarantee", explanation: "An individual (not just a company) becomes personally liable — this can put personal assets at risk, not just business ones." },
  { pattern: "time is of the essence", label: "Strict deadlines", explanation: "Deadlines here are treated as strict — a delay may be treated as a breach of contract rather than a minor slip." },
  { pattern: "arbitrat", label: "Arbitration clause", explanation: "Disputes go to arbitration instead of regular courts — check the seat of arbitration and rules, since this affects cost, speed, and your ability to appeal." },
  { pattern: "assign(?:ed|ment)? .{0,20}without.{0,15}consent", label: "Assignment without consent", explanation: "The contract (or obligations under it) may be transferred to a third party without needing your agreement." },
  { pattern: "cross[\\s-]default", label: "Cross-default", explanation: "A default on one obligation can trigger default on other, unrelated obligations — this can escalate a small problem quickly." }
];

// Sentence-level obligation language — used to surface candidate "who must do what" text.
const OBLIGATION_KEYWORDS = ["shall", "must", "is required to", "are required to", "agrees to", "undertakes to", "is obligated to", "are obligated to", "is responsible for", "are responsible for", "covenants to", "shall not", "is liable to", "are liable to"];

// Payment-related keywords used alongside currency-amount detection to surface payment terms.
const PAYMENT_KEYWORDS = ["payment", "payable", "due", "invoice", "instalment", "installment", "advance", "deposit", "fee", "penalty", "interest", "consideration", "remuneration", "salary", "rent", "arrears"];

if (typeof module !== "undefined") module.exports = { DOCUMENT_TYPES, RISKY_PHRASES, OBLIGATION_KEYWORDS, PAYMENT_KEYWORDS };
