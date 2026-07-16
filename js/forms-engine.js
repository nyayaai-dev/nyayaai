/**
 * NyayaAI Smart Legal Forms — generation engine.
 * Pure, rule-based logic (jurisdiction thresholds, fee tables, applicable-law
 * branching, document templating) run entirely in the browser on your answers —
 * no AI call, nothing fabricated. Each generate* function returns:
 *   { summary, guidance: [...], checklist: [...], draftDocument: string|null, relatedLawLinks: [...] }
 */
const FormsEngine = (function () {
  function today() {
    return new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  }

  function generateLegalNotice(a) {
    const lawNotes = {
      "Cheque bounce (Section 138, NI Act)": "This falls under Section 138 of the Negotiable Instruments Act, 1881 — the notice must be sent within 30 days of receiving the bank's cheque-return memo, and a criminal complaint can only be filed if payment isn't made within 15 days of the recipient receiving this notice.",
      "Recovery of unpaid dues": "This is a civil recovery matter — if unresolved, you can pursue a civil suit for recovery of the amount with interest.",
      "Breach of contract": "Under the Indian Contract Act, 1872 (§73), you may claim compensation for loss naturally arising from the breach.",
      "Tenancy / property issue": "Reference the Model Tenancy Act (where adopted by your state) or the Transfer of Property Act.",
      "Employment issue": "Reference the specific clauses of your employment contract and the applicable Labour Code provisions.",
      "Defamation": "This can give rise to both a civil claim for damages and, separately, a criminal complaint under BNS §356."
    };
    const amountClause = a.amount ? "The amount involved in this matter is Rs. " + a.amount + "/-.\n\n" : "";
    const doc =
      "LEGAL NOTICE\n\nDate: " + today() + "\n\nTo,\n" + a.recipientName + "\n" + a.recipientAddress +
      "\n\nFrom,\n" + a.senderName + "\n" + a.senderAddress +
      "\n\nSubject: Legal Notice regarding " + a.noticeType +
      "\n\nSir/Madam,\n\nUnder instructions from and on behalf of " + a.senderName + " (\"my client\"), I address you as follows:\n\n" +
      a.facts + "\n\n" + amountClause +
      "You are hereby called upon to " + a.demand + ", within " + a.deadlineDays + " from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you — entirely at your risk, cost, and consequences, without any further notice.\n\n" +
      "A copy of this notice is retained for record and future reference.\n\nYours faithfully,\n\n" + a.senderName;

    return {
      summary: 'Draft legal notice for "' + a.noticeType + '" prepared below.',
      guidance: [lawNotes[a.noticeType], "Send this by Registered Post with Acknowledgement Due (RPAD), and ideally also by email, so you have proof of delivery.", "Keep a copy of the notice, the postal receipt, and any reply — you'll need these if the matter escalates."].filter(Boolean),
      checklist: ["Proof of postage (RPAD receipt)", "Copy of the notice sent", "Supporting documents referenced (invoices, contracts, photos)"],
      draftDocument: doc,
      relatedLawLinks: [{ label: "Civil & Contract Law", href: "laws/civil.html" }]
    };
  }

  function generateConsumerComplaint(a) {
    const amount = parseFloat((a.amountPaid || "0").replace(/[^\d.]/g, "")) || 0;
    let forum, forumNote;
    if (amount <= 5000000) { forum = "District Consumer Disputes Redressal Commission"; forumNote = "claims up to ₹50 lakh"; }
    else if (amount <= 20000000) { forum = "State Consumer Disputes Redressal Commission"; forumNote = "claims between ₹50 lakh and ₹2 crore"; }
    else { forum = "National Consumer Disputes Redressal Commission"; forumNote = "claims above ₹2 crore"; }

    const doc =
      "CONSUMER COMPLAINT\n\nBefore the " + forum + "\n\nOpposite Party: " + a.sellerName +
      "\n\nDate of purchase/service: " + a.purchaseDate + "\nAmount paid: Rs. " + a.amountPaid + "/-\n\nFACTS:\n" + a.description +
      "\n\nThe Complainant approached the Opposite Party regarding this issue (" + a.triedContacting + ") without satisfactory resolution.\n\n" +
      "RELIEF SOUGHT:\n" + a.reliefSought + ", along with any applicable compensation for inconvenience and cost of these proceedings.\n\n" +
      "[Attach: purchase invoice/receipt, correspondence with seller, photos/evidence]";

    return {
      summary: "Based on the ₹" + a.amountPaid + " amount involved, your complaint falls under the " + forum + " (" + forumNote + ").",
      guidance: [
        "Before filing formally, try the National Consumer Helpline (dial 1915) or the INGRAM portal — many complaints resolve through mediation there.",
        "File your formal complaint on e-Daakhil (edaakhil.nic.in), the government's online consumer complaint portal, addressed to the " + forum + ".",
        "You can represent yourself — no advocate is required for consumer complaints."
      ],
      checklist: ["Purchase invoice / receipt", "Written communication with the seller", "Photos or evidence of the defect/issue", "Proof of the amount paid"],
      draftDocument: doc,
      relatedLawLinks: [{ label: "Consumer Protection Law", href: "laws/consumer.html" }]
    };
  }

  function generateFIRGuidance(a) {
    const isCyber = a.incidentType === "Cybercrime";
    const guidance = [];
    if (isCyber) {
      guidance.push("For cybercrime specifically, don't go to a police station first — call the National Cyber Crime Helpline (1930) immediately if money is involved, and file at cybercrime.gov.in.");
    } else {
      guidance.push("You can file a Zero-FIR at ANY police station regardless of where the incident happened (BNSS §173) — you don't need to find the 'correct' jurisdiction first.");
      guidance.push("Police are legally required to register an FIR for cognizable offences. Refusal to register one is itself an offence.");
      guidance.push("If they refuse, you can approach the Superintendent of Police in writing, or a Magistrate under BNSS §175(3).");
    }
    const doc =
      "COMPLAINT STATEMENT (for filing at the police station)\n\nDate of incident: " + a.incidentDate +
      "\nLocation: " + a.incidentLocation + "\nType of incident: " + a.incidentType +
      "\n\nWhat happened:\n" + a.description +
      "\n\nPerson(s) responsible: " + a.accusedKnown +
      "\n\nEvidence available: " + ((a.evidence || []).join(", ") || "None yet") +
      "\n\nI request that this complaint be registered as an FIR and investigated accordingly.";

    return {
      summary: "Preparation notes for reporting: " + a.incidentType + ".",
      guidance: guidance,
      checklist: ["Government-issued photo ID", "Any evidence you have (see above)", "A written copy of this statement to hand over", "Note the officer's name and FIR number once registered — insist on a free copy"],
      draftDocument: isCyber ? null : doc,
      relatedLawLinks: [isCyber ? { label: "Cyber & Data Protection Law", href: "laws/cyber.html" } : { label: "Criminal Law", href: "laws/criminal.html" }]
    };
  }

  function generatePropertyDispute(a) {
    const typeGuidance = {
      "Boundary / encroachment": "Get a survey/demarcation done by a licensed surveyor first — this creates objective evidence before you approach anyone. A civil suit for injunction may be needed if encroachment continues.",
      "Title / ownership dispute": "Check the encumbrance certificate and title chain at the Sub-Registrar's office. A declaratory civil suit may be necessary to establish clear title.",
      "Landlord-tenant issue": "Check whether your state has adopted the Model Tenancy Act — this determines whether you go to a Rent Authority/Rent Court or a regular civil court.",
      "Builder delay / possession": "Check if the project is RERA-registered — if so, a complaint with the State RERA Authority for delayed possession is typically faster than a civil suit.",
      "Co-owner / inheritance dispute": "This usually requires either a partition suit or mediation among co-owners/legal heirs — succession law (e.g. the Hindu Succession Act) determines shares."
    };
    return {
      summary: "Guidance for a " + a.disputeType + " dispute.",
      guidance: [typeGuidance[a.disputeType], "A well-drafted legal notice to the opposing party is usually the right first formal step before litigation — use the Legal Notice tool for this.", "Keep all property documents (sale deed, tax receipts, possession proof) organised — you'll need them regardless of which forum you end up in."].filter(Boolean),
      checklist: ["Sale deed / title documents", "Property tax receipts", "Prior correspondence about the dispute", "Photos / survey documents if relevant"],
      draftDocument: null,
      relatedLawLinks: [{ label: "Property & Real Estate Law", href: "laws/property.html" }]
    };
  }

  function generateTrademarkFiling(a) {
    const concessional = a.applicantType === "Individual" || a.applicantType === "Startup (DPIIT recognised)" || a.applicantType === "MSME / small enterprise";
    const fee = concessional ? "₹4,500 per class (online filing)" : "₹9,000 per class (online filing)";
    return {
      summary: 'Estimated government fee: ' + fee + ', filing "' + a.markText + '" as a ' + a.markType.toLowerCase() + ".",
      guidance: [
        "Search the IP India public search tool first for identical/similar existing marks in your class — skipping this is the #1 reason applications get opposed.",
        a.alreadyInUse === "Yes, already in use"
          ? "Since the mark is already in use, you'll file a Statement of User with proof of first use (invoices, dated marketing material)."
          : "Since the mark isn't in use yet, you'll file as 'proposed to be used' — no usage proof needed at filing, but you can't claim prior rights until you actually start using it.",
        concessional ? "You qualify for the concessional ₹4,500/class fee — for 'Startup,' you need DPIIT recognition; for 'Individual,' the mark must be filed in your personal name." : "Filing as a company/LLP/partnership means the standard ₹9,000/class fee applies."
      ],
      checklist: ["Clear image of the logo (if applicable)", "List of goods/services + correct Nice Classification class", "Proof of applicant identity/incorporation", a.alreadyInUse === "Yes, already in use" ? "Proof of first use (invoices, dated marketing material)" : "", "Power of Attorney (Form TM-48) if filing through an agent"].filter(Boolean),
      draftDocument: null,
      relatedLawLinks: [{ label: "Intellectual Property Law", href: "laws/ip.html" }]
    };
  }

  function generateCompanyRegistration(a) {
    const isOPC = a.companyType === "One Person Company (OPC)";
    const isLLP = a.companyType === "Limited Liability Partnership (LLP)";
    const roleWord = isLLP ? "Designated Partners" : "Directors";
    return {
      summary: "Checklist for registering a " + a.companyType + " with " + a.numDirectors + " " + roleWord.toLowerCase() + ".",
      guidance: [
        isOPC ? "An OPC needs exactly 1 director, plus a nominee who takes over if something happens to you — the nominee's consent (Form INC-3) is mandatory." : ("A " + a.companyType + " needs at least " + (isOPC ? 1 : 2) + " " + roleWord.toLowerCase() + "."),
        "Registration is done through the MCA's integrated SPICe+ form, which bundles name reservation, incorporation, PAN, and TAN into one filing.",
        isLLP ? "LLPs are registered via the FiLLiP form (not SPICe+), with the LLP Agreement filed separately (Form 3) within 30 days of incorporation." : ""
      ].filter(Boolean),
      checklist: ["Digital Signature Certificate (DSC) for each " + roleWord.toLowerCase().replace(/s$/, ""), "Director Identification Number (DIN) — applied for within the incorporation form for new companies", "Proposed name(s) checked for availability", "Registered office address proof", isLLP ? "LLP Agreement" : "Memorandum & Articles of Association (MOA/AOA)", isOPC ? "Nominee's consent (Form INC-3)" : ""].filter(Boolean),
      draftDocument: null,
      relatedLawLinks: [{ label: "Corporate & Business Law", href: "laws/corporate.html" }]
    };
  }

  function generateGSTRegistration(a) {
    const specialGoodsStates = ["Arunachal Pradesh", "Assam", "Jammu & Kashmir", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "Himachal Pradesh", "Uttarakhand"];
    const specialServiceStates4 = ["Manipur", "Mizoram", "Nagaland", "Tripura"];
    const turnover = parseFloat((a.annualTurnover || "0").replace(/[^\d.]/g, "")) || 0;
    const isSpecialGoods = specialGoodsStates.indexOf(a.state) !== -1;
    const isSpecialService4 = specialServiceStates4.indexOf(a.state) !== -1;

    let threshold;
    if (a.supplyType === "Goods") threshold = isSpecialGoods ? 2000000 : 4000000;
    else threshold = isSpecialService4 ? 1000000 : 2000000; // Services, or Both (services threshold governs mixed suppliers)

    const mandatoryByTurnover = turnover >= threshold;
    const reasons = [];
    if (mandatoryByTurnover) reasons.push("your turnover (₹" + a.annualTurnover + ") is at or above the ₹" + (threshold / 100000) + " lakh threshold for " + a.supplyType.toLowerCase() + " in " + a.state);
    if (a.sellsOnline === "Yes") reasons.push("you sell through an e-commerce platform (registration is mandatory for this regardless of turnover)");
    if (a.interState === "Yes") reasons.push("you supply across state lines (registration is mandatory for this regardless of turnover)");
    const mandatory = reasons.length > 0;

    return {
      summary: mandatory
        ? "GST registration is mandatory for you: " + reasons.join("; ") + "."
        : ("Based on your answers, GST registration doesn't appear mandatory yet (threshold: ₹" + (threshold / 100000) + " lakh for " + a.supplyType.toLowerCase() + " in " + a.state + ") — though you can still register voluntarily."),
      guidance: [
        mandatory ? "" : "Registering voluntarily lets you claim input tax credit on your purchases and can make you a more credible vendor to GST-registered business customers.",
        a.supplyType === "Both goods and services" ? "Since you supply both goods and services, the services threshold typically governs mixed suppliers — verify your specific case with a tax professional." : ""
      ].filter(Boolean),
      checklist: ["PAN of the business/proprietor", "Proof of business address", "Bank account details", "Digital signature (companies/LLPs) or Aadhaar e-KYC (proprietors)", "Photographs of proprietor/partners/directors"],
      draftDocument: null,
      relatedLawLinks: [{ label: "Tax Law", href: "laws/tax.html" }]
    };
  }

  function generateDivorce(a) {
    const isMutual = a.route === "Yes — mutual consent";
    const guidance = [];
    if (isMutual) {
      if (a.separationDuration === "Less than 1 year") {
        guidance.push("Mutual consent divorce under Section 13B of the Hindu Marriage Act (or the equivalent under your applicable law) generally requires living separately for at least 1 year before filing.");
      } else {
        guidance.push("With 1+ year of separation, you can file a joint mutual consent petition. This involves two motions: the first when you file, and a second after a 6-month 'cooling-off' period (extendable up to 18 months).");
        guidance.push("The Supreme Court (Amardeep Singh v. Harveen Kaur, 2017, reaffirmed in 2026) has held this 6-month period can be waived if reconciliation is impossible and all matters (alimony, custody, property) are already settled — ask your advocate about a waiver application.");
      }
    } else {
      guidance.push("A contested divorce requires proving specific grounds in court — typically a longer process (often 1-3+ years) than mutual consent.");
      if (!a.grounds || a.grounds.length === 0 || a.grounds.indexOf("Not sure yet") !== -1) {
        guidance.push("If you're not sure which grounds apply, this is exactly the kind of judgment call worth discussing with a family law advocate before filing — the wrong ground can weaken your case.");
      }
    }
    if (a.childrenInvolved === "Yes") {
      guidance.push("With children involved, custody, visitation, and maintenance will need to be addressed — either by mutual agreement or as contested issues alongside the divorce.");
    }
    guidance.push("This process differs meaningfully depending on which personal law applies to your marriage — the guidance above is general; an advocate can confirm the exact route for your situation.");

    return {
      summary: (isMutual ? "Mutual consent" : "Contested") + " divorce under " + a.applicableLaw + ".",
      guidance: guidance,
      checklist: ["Marriage certificate", isMutual ? "Proof of separation (separate addresses, witness affidavits, etc.)" : "", "Address proof for both parties", "Income/asset documents (relevant to maintenance/alimony)", a.childrenInvolved === "Yes" ? "Children's birth certificates" : ""].filter(Boolean),
      draftDocument: null,
      relatedLawLinks: [{ label: "Family Law", href: "laws/family.html" }]
    };
  }

  const GENERATORS = {
    "legal-notice": generateLegalNotice,
    "consumer-complaint": generateConsumerComplaint,
    "fir-guidance": generateFIRGuidance,
    "property-dispute": generatePropertyDispute,
    "trademark-filing": generateTrademarkFiling,
    "company-registration": generateCompanyRegistration,
    "gst-registration": generateGSTRegistration,
    "divorce": generateDivorce
  };

  function generate(formId, answers) {
    const fn = GENERATORS[formId];
    if (!fn) return null;
    return fn(answers);
  }

  return { generate: generate };
})();
