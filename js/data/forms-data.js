/**
 * NyayaAI — Smart Legal Forms question definitions.
 * Each form is a short wizard; the actual generation logic (drafting the document,
 * computing jurisdiction/fees/thresholds, branching guidance) lives in
 * js/forms-engine.js, keyed by these step ids. Step types: "text", "textarea",
 * "select", "date", "checkboxes". A step may have `showIf: function(answers)` to
 * appear conditionally.
 */
const FORMS_DATA = [
  {
    id: "legal-notice",
    icon: "✉️",
    name: "Legal Notice",
    tagline: "Generate a draft notice ready to send",
    lawArea: "civil",
    steps: [
      { id: "noticeType", q: "What is this notice about?", type: "select", options: ["Recovery of unpaid dues", "Breach of contract", "Cheque bounce (Section 138, NI Act)", "Tenancy / property issue", "Employment issue", "Defamation", "Other"] },
      { id: "senderName", q: "Your full name", type: "text" },
      { id: "senderAddress", q: "Your address", type: "textarea" },
      { id: "recipientName", q: "Recipient's full name", type: "text" },
      { id: "recipientAddress", q: "Recipient's address", type: "textarea" },
      { id: "facts", q: "Briefly describe what happened", type: "textarea" },
      { id: "amount", q: "Amount involved, if any (₹)", type: "text", optional: true },
      { id: "demand", q: "What do you want them to do?", type: "textarea" },
      { id: "deadlineDays", q: "Response deadline", type: "select", options: ["7 days", "15 days", "30 days"] }
    ]
  },
  {
    id: "consumer-complaint",
    icon: "🛒",
    name: "Consumer Complaint",
    tagline: "Draft your complaint & find the right forum",
    lawArea: "consumer",
    steps: [
      { id: "issueType", q: "What went wrong?", type: "select", options: ["Defective product", "Deficient service", "Misleading advertisement", "Overcharging", "Refund/replacement denied", "Other"] },
      { id: "sellerName", q: "Seller / service provider's name", type: "text" },
      { id: "purchaseDate", q: "Date of purchase / service", type: "date" },
      { id: "amountPaid", q: "Amount you paid (₹)", type: "text" },
      { id: "description", q: "Describe the issue", type: "textarea" },
      { id: "triedContacting", q: "Have you already contacted the seller about this?", type: "select", options: ["Yes, no response", "Yes, they refused to help", "No, not yet"] },
      { id: "reliefSought", q: "What outcome do you want?", type: "select", options: ["Full refund", "Replacement", "Repair", "Compensation for loss/harm", "Refund + compensation"] }
    ]
  },
  {
    id: "fir-guidance",
    icon: "🚨",
    name: "FIR Guidance",
    tagline: "Prepare what to say at the police station",
    lawArea: "criminal",
    steps: [
      { id: "incidentType", q: "What type of incident is this?", type: "select", options: ["Theft/burglary", "Assault / physical harm", "Cheating / fraud", "Cybercrime", "Domestic violence", "Property damage / trespass", "Other"] },
      { id: "incidentDate", q: "When did it happen?", type: "date" },
      { id: "incidentLocation", q: "Where did it happen?", type: "text" },
      { id: "description", q: "Describe exactly what happened, in order", type: "textarea" },
      { id: "accusedKnown", q: "Do you know who's responsible?", type: "select", options: ["Yes, I know them", "I have a suspicion but I'm not sure", "No, unknown person(s)"] },
      { id: "evidence", q: "What evidence do you have?", type: "checkboxes", options: ["Witnesses", "CCTV footage", "Photos or videos", "Documents/messages", "None yet"] }
    ]
  },
  {
    id: "property-dispute",
    icon: "🏠",
    name: "Property Dispute",
    tagline: "Understand your dispute type & first steps",
    lawArea: "property",
    steps: [
      { id: "disputeType", q: "What kind of property dispute is this?", type: "select", options: ["Boundary / encroachment", "Title / ownership dispute", "Landlord-tenant issue", "Builder delay / possession", "Co-owner / inheritance dispute", "Other"] },
      { id: "propertyAddress", q: "Property address", type: "textarea" },
      { id: "opposingParty", q: "Who is the dispute with?", type: "text" },
      { id: "description", q: "Describe the dispute", type: "textarea" },
      { id: "desiredOutcome", q: "What outcome are you seeking?", type: "textarea" }
    ]
  },
  {
    id: "trademark-filing",
    icon: "💡",
    name: "Trademark Filing",
    tagline: "Filing checklist & fee estimate",
    lawArea: "ip",
    steps: [
      { id: "markType", q: "What type of mark are you filing?", type: "select", options: ["Word mark (just text)", "Logo / device mark", "Word + logo combined"] },
      { id: "markText", q: "Your brand name / mark", type: "text" },
      { id: "goodsServices", q: "Describe the goods/services this mark will cover", type: "textarea" },
      { id: "applicantType", q: "Who is the applicant?", type: "select", options: ["Individual", "Startup (DPIIT recognised)", "MSME / small enterprise", "Company / LLP / Partnership / Other"] },
      { id: "alreadyInUse", q: "Is the mark already in use in business?", type: "select", options: ["Yes, already in use", "No, proposed to be used"] }
    ]
  },
  {
    id: "company-registration",
    icon: "🏢",
    name: "Company Registration",
    tagline: "SPICe+ checklist tailored to your setup",
    lawArea: "corporate",
    steps: [
      { id: "companyType", q: "What are you registering?", type: "select", options: ["Private Limited Company", "One Person Company (OPC)", "Limited Liability Partnership (LLP)"] },
      { id: "numDirectors", q: "How many directors/partners will there be?", type: "select", options: ["1", "2", "3 or more"] },
      { id: "proposedName1", q: "Proposed company name (1st choice)", type: "text" },
      { id: "proposedName2", q: "Proposed company name (2nd choice)", type: "text", optional: true },
      { id: "businessActivity", q: "Briefly describe the business activity", type: "textarea" }
    ]
  },
  {
    id: "gst-registration",
    icon: "💰",
    name: "GST Registration",
    tagline: "Find out if you must register, and what's needed",
    lawArea: "tax",
    steps: [
      { id: "supplyType", q: "What do you primarily supply?", type: "select", options: ["Goods", "Services", "Both goods and services"] },
      { id: "annualTurnover", q: "Expected/actual annual turnover (₹)", type: "text" },
      { id: "state", q: "State of business", type: "select", options: ["Arunachal Pradesh", "Assam", "Jammu & Kashmir", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "Himachal Pradesh", "Uttarakhand", "Any other state/UT"] },
      { id: "sellsOnline", q: "Do you sell through an e-commerce platform (Amazon, Flipkart, etc.)?", type: "select", options: ["Yes", "No"] },
      { id: "interState", q: "Do you supply goods/services to other states?", type: "select", options: ["Yes", "No"] }
    ]
  },
  {
    id: "divorce",
    icon: "👪",
    name: "Divorce",
    tagline: "Understand your route & document checklist",
    lawArea: "family",
    steps: [
      { id: "applicableLaw", q: "Which law governs your marriage?", type: "select", options: ["Hindu Marriage Act (Hindu/Sikh/Jain/Buddhist)", "Special Marriage Act (civil/inter-faith marriage)", "Muslim Personal Law", "Indian Divorce Act (Christian)", "Not sure"] },
      { id: "route", q: "Do both spouses agree to the divorce?", type: "select", options: ["Yes — mutual consent", "No — one party is contesting"] },
      { id: "separationDuration", q: "How long have you been living separately?", type: "select", options: ["Less than 1 year", "1 year or more"], showIf: function (a) { return a.route === "Yes — mutual consent"; } },
      { id: "grounds", q: "What are the grounds for divorce? (select all that apply)", type: "checkboxes", options: ["Cruelty", "Desertion (2+ years)", "Adultery", "Conversion of religion", "Mental disorder", "Communicable disease", "Not sure yet"], showIf: function (a) { return a.route === "No — one party is contesting"; } },
      { id: "childrenInvolved", q: "Are there children from the marriage?", type: "select", options: ["Yes", "No"] }
    ]
  }
];

if (typeof module !== "undefined") module.exports = FORMS_DATA;
