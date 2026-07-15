/**
 * NyayaAI — Insights: practical, step-by-step guides.
 * Distinct from the Practice Area pages (which explain the law) and the News feed
 * (which tracks current affairs) — these are "what do I actually do" walkthroughs.
 */
const INSIGHTS_DB = [
  {
    id: "file-fir",
    icon: "🚨",
    lawArea: "criminal",
    title: "How to File an FIR in India",
    dek: "Whether it's a theft, an assault, or something more serious — here's what actually happens at the police station, and what your rights are if they're reluctant to register it.",
    steps: [
      { h: "Go to the police station with jurisdiction", b: "Under BNSS §173, you can now file a Zero-FIR at any police station regardless of where the offence occurred — it gets transferred to the right jurisdiction later. You don't need to find the 'correct' station first." },
      { h: "Give your information — orally or in writing", b: "You can narrate what happened and have the officer write it down, or submit it in writing yourself. For certain offences against women, the statement should be recorded by a woman police officer where the victim requests it." },
      { h: "Insist on registration if it's a cognizable offence", b: "Police are legally required to register an FIR for cognizable offences (serious crimes like theft, assault, murder). Refusal to register one is itself an offence under BNSS. Get a free copy of the FIR — it's your legal right." },
      { h: "If they refuse: escalate", b: "You can approach the Superintendent of Police in writing (BNSS §173(4)), file a complaint before a Magistrate under BNSS §175(3), or use online FIR portals now available in most states." },
      { h: "Keep the FIR number safe", b: "You'll need it for everything downstream — bail applications, insurance claims, court proceedings, and tracking investigation status." }
    ],
    related: ["bnss173"]
  },
  {
    id: "register-trademark",
    icon: "💡",
    lawArea: "ip",
    title: "How to Register a Trademark for Your Business",
    dek: "Your brand name and logo are assets — here's the actual process for locking them down under the Trade Marks Act, without needing to hire anyone just to file the application.",
    steps: [
      { h: "Search before you file", b: "Use the IP India public search tool to check no one has already registered an identical or confusingly similar mark in your class of goods/services. Skipping this step is the #1 reason applications get opposed." },
      { h: "Pick the right class(es)", b: "Trademarks are registered under the Nice Classification (45 classes covering goods and services). A software product and a restaurant with the same name can usually coexist if they're in different classes — but choose carefully." },
      { h: "File Form TM-A", b: "Filed online via the IP India e-filing portal, with your mark, applicant details, class, and (if already trading) a Statement of User with proof of first use, or file as 'proposed to be used' if you haven't launched yet." },
      { h: "Respond to any Examination Report", b: "The Registrar may raise objections (similarity to existing marks, descriptiveness). You typically get 30 days to respond with arguments or evidence of distinctiveness." },
      { h: "Publication & opposition window", b: "If accepted, your mark is published in the Trade Marks Journal. Third parties get 4 months to oppose. No opposition (or opposition resolved in your favour) → registration certificate issues, valid for 10 years, renewable indefinitely." }
    ],
    related: ["tma29"]
  },
  {
    id: "send-legal-notice",
    icon: "✉️",
    lawArea: "civil",
    title: "How to Send a Legal Notice",
    dek: "Before you sue anyone, a well-drafted legal notice often gets the result you want — payment, an apology, or a stopped behaviour — without the cost of litigation.",
    steps: [
      { h: "Confirm you actually need one", b: "For many disputes (unpaid dues, breach of contract, defective goods, defamation), a legal notice is a strong first move — it's evidence you tried to resolve things amicably, and can be required before filing certain suits (e.g., against government bodies under CPC §80)." },
      { h: "State the facts clearly and factually", b: "What happened, when, what agreement/right was violated, and what you're asking for — a specific amount, an action, or a deadline. Avoid exaggeration; a notice with inflated claims weakens your credibility later." },
      { h: "Set a reasonable deadline", b: "15–30 days is standard. Mention clearly that you'll pursue legal remedies (civil suit, consumer complaint, criminal complaint, as applicable) if there's no response." },
      { h: "Send it properly", b: "Registered post with acknowledgement due (RPAD), and ideally also email, so you have proof of delivery — you may need this later in court." },
      { h: "Keep everything", b: "The notice, proof of dispatch, delivery acknowledgment, and any reply. These become part of your evidence if the matter escalates." }
    ],
    related: ["ca73"]
  },
  {
    id: "register-company",
    icon: "🏢",
    lawArea: "corporate",
    title: "Steps to Register a Private Limited Company",
    dek: "The actual sequence for incorporating a startup or small business in India, from reserving a name to getting your Certificate of Incorporation.",
    steps: [
      { h: "Get Digital Signature Certificates (DSC)", b: "Every proposed director needs a DSC to sign electronic incorporation forms — obtained from a certifying authority, usually within a day." },
      { h: "Apply for Director Identification Number (DIN)", b: "Each director needs a DIN, applied for directly within the incorporation form (SPICe+) itself for new companies — no separate application needed anymore." },
      { h: "Reserve your company name", b: "Via the SPICe+ Part A form on the MCA portal — propose up to 2 names; the Registrar checks for conflicts with existing companies/trademarks." },
      { h: "File SPICe+ Part B with MOA & AOA", b: "Memorandum of Association (what the company can do) and Articles of Association (its internal rules), plus registered office proof, director consents, and PAN/TAN applications — all bundled into one integrated filing." },
      { h: "Receive your Certificate of Incorporation", b: "Issued by the Registrar of Companies under Companies Act §7 once everything checks out — this includes your Corporate Identification Number (CIN), PAN, and TAN. You're now legally a company, typically within 7–10 working days of a clean filing." }
    ],
    related: ["ca2013-7"]
  },
  {
    id: "consumer-complaint",
    icon: "🛒",
    lawArea: "consumer",
    title: "How to File a Consumer Complaint Online",
    dek: "Faulty product, denied refund, deficient service — here's how to actually file a complaint without a lawyer, using the government's own e-Daakhil portal.",
    steps: [
      { h: "Try the seller/company first — in writing", b: "Email or written complaint, keeping records. Many disputes resolve here, and it strengthens your case if it doesn't." },
      { h: "Try the National Consumer Helpline", b: "Call 1915 or use the UMANG app / INGRAM portal — government-run mediation that resolves a large share of complaints without formal litigation." },
      { h: "File on e-Daakhil if unresolved", b: "The Ministry of Consumer Affairs' e-Daakhil portal lets you file a formal complaint before the relevant District/State/National Consumer Commission entirely online, based on the value of goods/services paid (CPA §17)." },
      { h: "Attach your evidence", b: "Invoice/receipt, warranty card, correspondence with the seller, photos of the defect — the stronger your documentation, the faster the resolution." },
      { h: "Track and attend hearings", b: "Many Commissions now allow video-conference hearings. Filing fees are minimal to nil for smaller claims, and you can represent yourself — you don't need an advocate." }
    ],
    related: ["cpa17"]
  },
  {
    id: "know-your-rights-arrest",
    icon: "🛡️",
    lawArea: "criminal",
    title: "What to Do If You're Arrested — Your Rights",
    dek: "Being arrested is disorienting by design. Knowing these rights in advance — for yourself or someone you're helping — makes a real difference.",
    steps: [
      { h: "You must be told the grounds of arrest", b: "The police must inform you why you're being arrested — this is a constitutional requirement under Article 22(1), reinforced under BNSS." },
      { h: "You have the right to inform someone", b: "You can have a friend, relative, or anyone you nominate informed of your arrest and where you're being held (BNSS §37 read with Article 22)." },
      { h: "You must be produced before a Magistrate within 24 hours", b: "Excluding travel time — this is a core constitutional safeguard (Article 22(2)) against indefinite detention." },
      { h: "You have the right to legal representation", b: "You're entitled to consult a lawyer of your choice. If you can't afford one, you can request free legal aid through the District Legal Services Authority (DLSA) under the Legal Services Authorities Act, 1987." },
      { h: "For offences under 3 years, arrest isn't automatic", b: "Under BNSS §35, police must record reasons for arrest and may instead issue a notice of appearance for less serious offences — arrest isn't the only path." }
    ],
    related: ["bnss35"]
  },
  {
    id: "rental-agreement",
    icon: "🏠",
    lawArea: "property",
    title: "How to Draft a Rental Agreement That Protects You",
    dek: "Whether you're the tenant or the landlord, a clear written agreement prevents most of the disputes that end up in court — here's what to actually put in it.",
    steps: [
      { h: "Put everything in writing — always", b: "Verbal agreements are legally weaker and much harder to enforce. Even short-term or informal arrangements should have a signed document." },
      { h: "State the security deposit clearly", b: "Under the Model Tenancy Act framework (where adopted), residential deposits are capped around 2 months' rent. Specify the amount, and the exact conditions for deductions and the refund timeline." },
      { h: "Define maintenance & repair responsibilities", b: "Who pays for what — routine wear and tear vs. structural repairs vs. appliance breakdowns. Ambiguity here is one of the most common sources of landlord-tenant disputes." },
      { h: "Set the notice period for termination", b: "Under TPA §106, absent a contrary agreement, either party can terminate a lease of uncertain duration with 15 days' (movable) or 6 months' (immovable, non-agricultural) notice — but most agreements specify a shorter, mutually agreed notice period instead." },
      { h: "Register it if the term exceeds 11 months", b: "Agreements for a term of 12 months or more generally require registration under the Registration Act to be fully enforceable — many landlords use 11-month terms specifically to avoid this, which is legal but worth knowing." }
    ],
    related: ["mta-deposit"]
  },
  {
    id: "cyber-crime-victim",
    icon: "🛡️",
    lawArea: "cyber",
    title: "What to Do If You're a Victim of Cyber Crime",
    dek: "Phishing, cyberbullying, a hacked account, a stalker who won't stop messaging, an intimate photo shared without consent — the first hour matters. Here's exactly what to do, and who to call.",
    steps: [
      { h: "For financial fraud, call 1930 immediately — don't wait", b: "If money has been debited via UPI, net-banking, a card, or a fraudulent loan app, call the National Cyber Crime Helpline (1930) right away. Banks can freeze funds still sitting in the fraudster's account if you report within the 'golden hour' — the longer you wait, the more likely the money is already moved out and unrecoverable." },
      { h: "Preserve everything — don't delete, don't confront", b: "Screenshot the messages, profile, emails, or fake website (including the URL). Note transaction IDs, phone numbers, UPI IDs, and timestamps. Don't delete the evidence trying to 'get rid of it,' and don't engage further with a stalker or blackmailer — that can escalate things and doesn't help your complaint." },
      { h: "File a complaint on cybercrime.gov.in", b: "Beyond the 1930 call, file a full complaint on the National Cyber Crime Reporting Portal — choose 'Report Financial Fraud' for money-related cases, or 'Report Other Cyber Crimes' for phishing, hacking, cyberbullying, cyberstalking, or non-consensual intimate images. Crimes against women and children have a dedicated, more private track on the same portal." },
      { h: "For a minor involved, also call 1098", b: "If the victim is a child — CSAM, online grooming, or a child being bullied or threatened online — call CHILDLINE (1098) alongside the cybercrime portal. This also engages POCSO Act protections, not just the IT Act." },
      { h: "Report to the platform directly, too", b: "Report the account, post, or message to the platform itself (Instagram, WhatsApp, Facebook, X, etc.) for takedown — platforms are required under the IT Rules, 2021 to act on flagged content within set timelines, and this often works faster than waiting for legal process to remove something." },
      { h: "Know the specific law that applies to you", b: "Phishing/fake websites: IT Act §66D. Hacked account or stolen data: §66 / §66C. Threatening or anonymous messages: BNS §351(4). Being followed or monitored online: BNS §78 (stalking). Intimate images shared without consent: IT Act §66E. This matters because it tells the investigating officer exactly what to charge — vague complaints move slower." },
      { h: "If it's a woman-specific safety concern, 181 is also an option", b: "The Women Helpline (181) offers counselling and legal guidance alongside the cybercrime process, particularly useful for cyberstalking, harassment, or NCII cases where you want support navigating next steps, not just a case number." }
    ],
    related: ["it66d", "bns78", "it67b"]
  },
  {
    id: "road-accident",
    icon: "🚦",
    lawArea: "traffic",
    title: "What to Do After a Road Accident in India",
    dek: "Whether you're involved, or you're the first person to arrive at the scene — knowing these steps (and your legal protections) in the first hour genuinely changes outcomes.",
    steps: [
      { h: "Call 112 first — safety and medical help before anything else", b: "Move to safety if possible, and call the Emergency Response Support System (112) for police and ambulance. If you're a bystander helping, you are protected — see the next step." },
      { h: "If you're helping as a bystander, you're legally protected", b: "Under MV Act §134A, a Good Samaritan who helps an accident victim in good faith cannot be held liable for what happens next, cannot be forced to reveal their identity, and cannot be made to pay any expenses or get pulled into police/court proceedings as a witness against their will. You can also claim a ₹25,000 reward under the Rah-Veer scheme for helping within the first 60 minutes." },
      { h: "The hospital cannot refuse treatment or demand payment", b: "Under the Cashless Treatment of Road Accident Victims Scheme, 2025, any hospital must admit and treat a road accident victim immediately, with up to ₹1.5 lakh of the first 7 days' treatment covered directly — no upfront deposit, no 'pay first' delay. If a hospital refuses or demands payment, that itself is a violation you can report." },
      { h: "Get an FIR registered", b: "For any accident involving injury, death, or significant damage, ensure an FIR is filed — this is essential for both the insurance claim and any compensation claim later. If the other party fled the scene, that's a hit-and-run — mention this explicitly, as it changes which compensation route applies (the Motor Vehicle Accident Fund, under MV Act §162, exists specifically for hit-and-run and uninsured-vehicle cases)." },
      { h: "Inform your insurer and preserve evidence", b: "Photograph the vehicles, the scene, license plates, and any visible injuries. Note witness contact details. Most insurance policies require you to report a claim within a set number of days — don't delay this alongside the FIR." },
      { h: "File a compensation claim with the MACT if there's injury, death, or major loss", b: "You (or, in a fatal case, your legal heirs) can file a claim before the Motor Accident Claims Tribunal (MACT) under MV Act §166 — against the driver, the vehicle owner, and/or the insurer directly, without needing a separate civil suit." },
      { h: "Check and settle any challan through official channels only", b: "If you receive a traffic challan related to the incident (or any challan generally), verify and pay it only through echallan.parivahan.gov.in or the mParivahan app — never a third-party link. Challans must be paid or formally disputed within 45 days." }
    ],
    related: ["mva134a", "mva162", "mva166"]
  }
];

if (typeof module !== "undefined") module.exports = INSIGHTS_DB;
