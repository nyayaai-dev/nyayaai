/**
 * NyayaAI — Seed legal knowledge base.
 * Educational reference content, not a substitute for the bare acts / official gazette text.
 * Section numbers for the new criminal codes (BNS/BNSS/BSA) are provided as commonly-cited
 * mappings from the repealed IPC/CrPC/Evidence Act and should be cross-checked against the
 * official text for anything filed in court.
 */
const LAWS_DB = {
  lastReviewed: "2026-07-15",
  categories: [
    {
      id: "constitution",
      name: "Constitutional Law",
      icon: "🏛️",
      color: "gold",
      tagline: "The supreme law of India",
      summary: "The Constitution of India (1950) — Fundamental Rights, Directive Principles, Fundamental Duties, and the structure of the Union, States, and judiciary. All other Indian law derives its validity from it.",
      status: "In force since 26 January 1950, amended 106 times as of 2026. Basic Structure doctrine (Kesavananda Bharati, 1973) still governs the limits of Parliament's amending power under Article 368.",
      keyActs: [
        { name: "Constitution of India", year: "1950", note: "395 original Articles (now reorganised), 12 Schedules, 22 Parts" },
        { name: "Constitution (106th Amendment) Act — Nari Shakti Vandan Adhiniyam", year: "2023", note: "33% reservation for women in Lok Sabha & State Assemblies (effective from next delimitation)" }
      ],
      sections: [
        { id: "art14", ref: "Article 14", title: "Right to Equality", body: "State shall not deny any person equality before the law or equal protection of the laws within the territory of India." },
        { id: "art19", ref: "Article 19", title: "Protection of Six Freedoms", body: "Freedom of speech & expression, assembly, association, movement, residence, and profession — subject to reasonable restrictions under Article 19(2)-(6)." },
        { id: "art21", ref: "Article 21", title: "Right to Life & Personal Liberty", body: "No person shall be deprived of life or personal liberty except according to procedure established by law. Judicially expanded to include privacy (Puttaswamy, 2017), dignity, livelihood, clean environment, and health." },
        { id: "art21a", ref: "Article 21A", title: "Right to Education", body: "Free and compulsory education for children aged 6–14 years, implemented via the Right to Education Act, 2009." },
        { id: "art32", ref: "Article 32", title: "Right to Constitutional Remedies", body: "Right to move the Supreme Court directly for enforcement of Fundamental Rights, through writs — habeas corpus, mandamus, prohibition, quo warranto, certiorari. Dr. Ambedkar called it the 'heart and soul' of the Constitution." },
        { id: "art356", ref: "Article 356", title: "President's Rule", body: "Allows the Union to take over State administration on failure of constitutional machinery in a State, subject to judicial review (S.R. Bommai, 1994) and Parliamentary approval within two months." },
        { id: "art368", ref: "Article 368", title: "Amending Power", body: "Parliament's power to amend the Constitution — limited by the Basic Structure doctrine, which protects core features like democracy, secularism, judicial review, and federalism from being altered." },
        { id: "dpsp", ref: "Part IV (Arts. 36–51)", title: "Directive Principles of State Policy", body: "Non-justiciable guidelines directing the State toward a welfare state — uniform civil code (Art. 44), living wage, environment protection, village panchayats, international peace." },
        { id: "duties", ref: "Article 51A", title: "Fundamental Duties", body: "11 duties of every citizen, added by the 42nd Amendment (1976) — respect the Constitution, protect sovereignty, preserve heritage, protect environment, develop scientific temper, and (11th, added 2002) duty of parents/guardians to provide education to children aged 6–14." }
      ],
      recentUpdates: [
        "Waqf (Amendment) Act, 2025 — Supreme Court (CJI B.R. Gavai bench) stayed key provisions on 15 Sept 2025 in 'In re: Waqf (Amendment) Act 2025', holding parts of it violated separation of powers, while declining to stay the Act in its entirety.",
        "Nari Shakti Vandan Adhiniyam (106th Amendment, 2023) — women's reservation in legislatures remains pending implementation until the next Census-based delimitation exercise.",
        "Supreme Court continues to expand Article 21 jurisprudence — March 2026 ruling in Harish Rana v. Union of India permitted passive euthanasia/withdrawal of life support in a definitive framework."
      ]
    },
    {
      id: "criminal",
      name: "Criminal Law",
      icon: "🔒",
      color: "red",
      tagline: "BNS · BNSS · BSA — India's new criminal codes",
      summary: "On 1 July 2024, three new codes — Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) — replaced the colonial-era Indian Penal Code (1860), Code of Criminal Procedure (1973), and Indian Evidence Act (1872).",
      status: "In force since 1 July 2024 (two years as of July 2026). Chargesheet-filing compliance within 60 days has risen from 51% (2024) to 67% (2026) as the system transitions to e-FIR, Zero-FIR nationwide, and mandatory forensic visits for serious offences.",
      keyActs: [
        { name: "Bharatiya Nyaya Sanhita (BNS)", year: "2023", note: "Substantive criminal law — defines offences & punishments (replaces IPC 1860)" },
        { name: "Bharatiya Nagarik Suraksha Sanhita (BNSS)", year: "2023", note: "Criminal procedure — arrest, investigation, trial, bail (replaces CrPC 1973)" },
        { name: "Bharatiya Sakshya Adhiniyam (BSA)", year: "2023", note: "Law of evidence, incl. electronic/digital evidence (replaces Evidence Act 1872)" },
        { name: "Protection of Children from Sexual Offences (POCSO) Act", year: "2012", note: "Continues in force alongside BNS for offences against minors" },
        { name: "Narcotic Drugs and Psychotropic Substances (NDPS) Act", year: "1985", note: "Drug offences — special/stringent bail provisions" }
      ],
      sections: [
        { id: "bns103", ref: "BNS §103", title: "Murder", body: "Punishment for murder — corresponds to the repealed IPC §302. Death penalty or life imprisonment, plus fine." },
        { id: "bns101", ref: "BNS §101", title: "Culpable Homicide not amounting to Murder", body: "Corresponds to former IPC §299/§304." },
        { id: "bns109", ref: "BNS §109", title: "Attempt to Murder", body: "Corresponds to former IPC §307." },
        { id: "bns63", ref: "BNS §63–64", title: "Rape & Punishment for Rape", body: "Corresponds to former IPC §375/§376, with enhanced provisions for gang rape and offences against minors." },
        { id: "bns85", ref: "BNS §85", title: "Cruelty by Husband or Relatives", body: "Corresponds to former IPC §498A — cruelty towards a married woman by husband or his relatives." },
        { id: "bns318", ref: "BNS §318", title: "Cheating", body: "Punishment for cheating — corresponds to former IPC §420. Whoever cheats and dishonestly induces delivery of property, or alters/destroys a valuable security, is punishable with imprisonment (up to 7 years depending on the specific clause) and fine." },
        { id: "bns152", ref: "BNS §152", title: "Acts Endangering Sovereignty, Unity & Integrity of India", body: "Replaces the repealed sedition provision (former IPC §124A) with a narrower offence targeting secession, armed rebellion, or subversive activities." },
        { id: "bnss173", ref: "BNSS §173", title: "Registration of FIR", body: "Corresponds to former CrPC §154. Zero-FIR (filing at any police station regardless of jurisdiction) and e-FIR for certain offences are now expressly enabled nationwide." },
        { id: "bnss35", ref: "BNSS §35", title: "Arrest — Conditions & Safeguards", body: "Corresponds to former CrPC §41. For offences punishable with under 3 years, arrest requires recorded reasons; notice of appearance may be issued instead." },
        { id: "bsa63", ref: "BSA §63", title: "Admissibility of Electronic Evidence", body: "Corresponds to former Evidence Act §65B — lays down the certificate requirement for electronic/digital records (emails, CCTV, WhatsApp chats) to be admissible in court." }
      ],
      recentUpdates: [
        "Two-year review (July 2026): 60-day chargesheet compliance up from 51% to 67%; forensic-case disposal has nearly doubled, per government data — while training gaps, forensic capacity, and the digital divide remain flagged challenges.",
        "Supreme Court, 2 July 2026 (Pooja Ramesh Singh v. Jammu & Kashmir Bank Ltd.), cracked down on reliance on AI-generated fake/hallucinated case citations in filings and judicial orders — a caution relevant to any AI-assisted legal research, including this platform.",
        "e-Sakshya (digital evidence app), e-Summons, and the Inter-operable Criminal Justice System (ICJS) linking police, courts, prisons, forensics and prosecution are being rolled out under the 'One Data, One Entry' framework."
      ]
    },
    {
      id: "civil",
      name: "Civil & Contract Law",
      icon: "📜",
      color: "blue",
      tagline: "Contracts, torts, and civil procedure",
      summary: "Governs private disputes between individuals/entities — contracts, torts (civil wrongs), specific relief, and the procedure for civil litigation before courts.",
      status: "Indian Contract Act (1872) and Civil Procedure Code (1908) remain in force, unlike the criminal codes; amendments have been incremental (e.g., Commercial Courts Act, 2015; Arbitration & Conciliation Act amendments).",
      keyActs: [
        { name: "Indian Contract Act", year: "1872", note: "Formation, performance, breach & remedies for contracts" },
        { name: "Specific Relief Act", year: "1963", note: "Amended 2018 — specific performance now the rule rather than the exception for most contracts" },
        { name: "Code of Civil Procedure (CPC)", year: "1908", note: "Procedure for filing, trying, and executing civil suits" },
        { name: "Limitation Act", year: "1963", note: "Prescribes time limits for filing different types of suits" },
        { name: "Arbitration and Conciliation Act", year: "1996", note: "Amended 2015, 2019, 2021 — governs domestic & international arbitration" },
        { name: "Commercial Courts Act", year: "2015", note: "Fast-track resolution of high-value commercial disputes, mandatory pre-institution mediation" }
      ],
      sections: [
        { id: "ca10", ref: "Contract Act §10", title: "What Agreements are Contracts", body: "An agreement is a contract if made by free consent of parties competent to contract, for lawful consideration and object, and not expressly declared void." },
        { id: "ca73", ref: "Contract Act §73", title: "Compensation for Breach", body: "The party suffering from a breach is entitled to compensation for loss/damage naturally arising from the breach, in the usual course of things." },
        { id: "sra10", ref: "Specific Relief Act §10 (post-2018)", title: "Specific Performance", body: "Since the 2018 amendment, specific performance of a contract is the general rule, not discretionary as earlier — courts must enforce it save in defined exceptions." },
        { id: "cpc9", ref: "CPC §9", title: "Courts to Try All Civil Suits", body: "Courts have jurisdiction to try all suits of a civil nature except those expressly or impliedly barred." },
        { id: "limitation", ref: "Limitation Act, Art. 113 (Schedule)", title: "General Limitation for Suits", body: "3 years from when the right to sue accrues, where no specific period is prescribed elsewhere in the Schedule." },
        { id: "arb34", ref: "Arbitration Act §34", title: "Setting Aside an Arbitral Award", body: "Narrow, specified grounds (incapacity, invalid agreement, no proper notice, award beyond scope, public policy) — courts cannot review an award on merits." }
      ],
      recentUpdates: [
        "Mediation Act, 2023 institutionalises pre-litigation mediation; commercial disputes below a threshold require mandatory pre-institution mediation under the Commercial Courts Act before a suit can be filed.",
        "Courts continue applying the post-2018 Specific Relief Act regime, making specific performance the default remedy in most contract-breach suits rather than damages alone."
      ]
    },
    {
      id: "corporate",
      name: "Corporate & Business Law",
      icon: "🏢",
      color: "gold",
      tagline: "Companies, competition, insolvency & startups",
      summary: "Regulates incorporation and governance of companies and LLPs, mergers, competition/antitrust, securities markets, foreign investment, and corporate insolvency.",
      status: "Companies Act 2013 remains the primary statute; IBC continues to be refined through amendments and NCLAT/Supreme Court rulings on resolution timelines.",
      keyActs: [
        { name: "Companies Act", year: "2013", note: "Incorporation, governance, CSR (mandatory 2% spend), audits, director duties" },
        { name: "Limited Liability Partnership (LLP) Act", year: "2008", note: "Hybrid structure — partnership flexibility with limited liability" },
        { name: "Insolvency and Bankruptcy Code (IBC)", year: "2016", note: "Time-bound corporate insolvency resolution (CIRP), typically within 330 days" },
        { name: "Competition Act", year: "2002", note: "Regulates anti-competitive agreements, abuse of dominance, and combinations (M&A) via the CCI" },
        { name: "SEBI Act & regulations", year: "1992", note: "Securities market regulation — listing, insider trading, takeovers, LODR" },
        { name: "Foreign Exchange Management Act (FEMA)", year: "1999", note: "Cross-border investment & foreign exchange transactions" }
      ],
      sections: [
        { id: "ca2013-7", ref: "Companies Act §7", title: "Incorporation & Registration of a Company", body: "To register a company — including a Private Limited Company or a startup — promoters file incorporation documents (Memorandum & Articles of Association, declarations) with the Registrar of Companies through the MCA's SPICe+ portal. A Private Limited Company needs a minimum of 2 directors and 2 shareholders (a One Person Company needs just 1), a registered office address, and DIN/DSC for directors. On approval, the Registrar issues a Certificate of Incorporation and the company comes into legal existence." },
        { id: "ca2013-135", ref: "Companies Act §135", title: "Corporate Social Responsibility", body: "Companies meeting net worth/turnover/profit thresholds must spend at least 2% of average net profits of preceding 3 years on CSR activities." },
        { id: "ca2013-166", ref: "Companies Act §166", title: "Duties of Directors", body: "Directors must act in good faith to promote the company's objects, exercise independent judgment, and avoid conflicts of interest." },
        { id: "ibc7", ref: "IBC §7", title: "Initiation of CIRP by Financial Creditor", body: "A financial creditor may file an application before the NCLT on default by the corporate debtor to trigger the Corporate Insolvency Resolution Process." },
        { id: "ibc12", ref: "IBC §12", title: "Time-limit for Completion of CIRP", body: "CIRP to be completed within 180 days, extendable by 90 days; outer limit of 330 days including litigation time (per amendment)." },
        { id: "comp4", ref: "Competition Act §4", title: "Abuse of Dominant Position", body: "Prohibits an enterprise in a dominant position from imposing unfair conditions/prices or limiting production to the detriment of consumers." },
        { id: "comp6", ref: "Competition Act §6", title: "Regulation of Combinations", body: "Mergers/acquisitions above prescribed asset/turnover thresholds require prior CCI approval." }
      ],
      recentUpdates: [
        "Jan Vishwas (Amendment of Provisions) Act, 2023 decriminalised several minor/technical offences under the Companies Act and other business statutes, replacing jail terms with monetary penalties to ease compliance.",
        "CCI continues to tighten scrutiny of digital-market mergers and 'deal value'-based combination thresholds for high-value tech acquisitions.",
        "IBC amendments and NCLAT practice continue to focus on reducing resolution delays beyond the statutory 330-day outer limit."
      ]
    },
    {
      id: "family",
      name: "Family Law",
      icon: "👪",
      color: "green",
      tagline: "Marriage, divorce, succession & maintenance",
      summary: "India follows personal laws by religion for marriage, divorce, adoption, and succession (Hindu, Muslim, Christian, Parsi), alongside secular options like the Special Marriage Act.",
      status: "Uniform Civil Code (Art. 44 DPSP) remains a live policy debate; Uttarakhand implemented a state-level UCC in 2024. Personal laws otherwise continue to apply by religion.",
      keyActs: [
        { name: "Hindu Marriage Act", year: "1955", note: "Marriage, divorce & judicial separation for Hindus, Sikhs, Jains, Buddhists" },
        { name: "Special Marriage Act", year: "1954", note: "Secular civil marriage regardless of religion" },
        { name: "Hindu Succession Act", year: "1956", note: "Amended 2005 — daughters have equal coparcenary rights in ancestral property" },
        { name: "Muslim Personal Law (Shariat) Application Act", year: "1937", note: "Governs marriage, divorce & inheritance for Muslims" },
        { name: "Muslim Women (Protection of Rights on Marriage) Act", year: "2019", note: "Criminalised instant triple talaq (talaq-e-biddat)" },
        { name: "Protection of Women from Domestic Violence Act", year: "2005", note: "Civil remedies — protection orders, residence rights, monetary relief" },
        { name: "Juvenile Justice (Care and Protection of Children) Act", year: "2015", note: "Adoption procedure via CARA, juvenile justice framework" }
      ],
      sections: [
        { id: "hma13", ref: "Hindu Marriage Act §13", title: "Grounds for Divorce", body: "Cruelty, desertion (2+ years), conversion, unsoundness of mind, communicable disease, and mutual consent (§13B) among the grounds." },
        { id: "crpc125", ref: "BNSS §144 (formerly CrPC §125)", title: "Maintenance of Wife, Children & Parents", body: "A person with sufficient means neglecting to maintain a wife/minor child/aged parent unable to maintain themselves can be ordered to pay monthly maintenance — religion-neutral provision." },
        { id: "dv12", ref: "DV Act §12", title: "Application to Magistrate", body: "An aggrieved woman may apply for protection, residence, monetary relief, custody and compensation orders under the Domestic Violence Act." },
        { id: "hsa6", ref: "Hindu Succession Act §6 (post-2005)", title: "Daughter's Coparcenary Right", body: "Since the 2005 amendment, a daughter is a coparcener by birth in a Hindu joint family, with the same rights and liabilities as a son (affirmed in Vineeta Sharma v. Rakesh Sharma, 2020)." }
      ],
      recentUpdates: [
        "Uttarakhand's Uniform Civil Code, 2024 (first state-level UCC) continues implementation, covering marriage registration, live-in relationship disclosure, and inheritance for all residents regardless of religion (with Scheduled Tribes exempted).",
        "Supreme Court, 2026 (Hamsaanandini Nanduri v. Union of India), struck down §60(4) of the Code on Social Security as unconstitutional for arbitrarily restricting maternity benefits for adoptive mothers of children over three months old."
      ]
    },
    {
      id: "property",
      name: "Property & Real Estate Law",
      icon: "🏠",
      color: "blue",
      tagline: "Land, transfer of property & RERA",
      summary: "Governs ownership, sale, lease, mortgage and inheritance of immovable property, and consumer-protective regulation of real-estate developers.",
      status: "RERA implementation continues to mature across states, with most State Real Estate Regulatory Authorities now operational and hearing homebuyer complaints.",
      keyActs: [
        { name: "Transfer of Property Act", year: "1882", note: "Sale, mortgage, lease, exchange & gift of immovable property" },
        { name: "Registration Act", year: "1908", note: "Compulsory registration of documents affecting immovable property above value thresholds" },
        { name: "Indian Stamp Act", year: "1899", note: "Stamp duty on property/legal instruments (state amendments vary duty rates)" },
        { name: "Real Estate (Regulation and Development) Act (RERA)", year: "2016", note: "Mandatory project registration, escrow of 70% of buyer funds, homebuyer grievance redressal" },
        { name: "Right to Fair Compensation and Transparency in Land Acquisition Act (LARR)", year: "2013", note: "Land acquisition, compensation & resettlement" },
        { name: "Model Tenancy Act (MTA)", year: "2021", note: "Model law offered to states to adopt for rent/tenancy — security deposit caps, rent authority, landlord & tenant obligations" }
      ],
      sections: [
        { id: "tpa54", ref: "TPA §54", title: "Sale of Immovable Property", body: "Transfer of ownership in exchange for a price; for tangible immovable property of value ≥ ₹100, sale can only be made by a registered instrument." },
        { id: "tpa105", ref: "TPA §105–106", title: "Lease of Immovable Property & Rent", body: "A lease is a transfer of the right to enjoy property for a term in exchange for rent/premium. Absent a contrary contract, either party may terminate a lease of uncertain duration with 15 days' (moveable) or 6 months' (immoveable, non-agricultural) notice." },
        { id: "mta-deposit", ref: "Model Tenancy Act §4", title: "Security Deposit — Cap & Refund", body: "Under the Model Tenancy Act, 2021 (adopted with variations by several states), a landlord cannot demand a security deposit exceeding 2 months' rent for residential premises (up to 6 months for non-residential), and must refund it on the date of taking back vacant possession, after lawful deductions. A tenant refused a deposit refund can approach the state's Rent Authority/Rent Court where the state has adopted the MTA, or a civil court/consumer forum otherwise." },
        { id: "rera4", ref: "RERA §4", title: "Registration of Real Estate Projects", body: "Projects above prescribed area thresholds must be registered with the State RERA before advertising, marketing, booking or selling any unit." },
        { id: "rera18", ref: "RERA §18", title: "Return of Amount & Compensation", body: "If a promoter fails to complete/hand over possession as per the agreement, the allottee may withdraw and claim refund with interest, or claim compensation." },
        { id: "regact17", ref: "Registration Act §17", title: "Documents of Which Registration is Compulsory", body: "Instruments of gift, and non-testamentary instruments affecting immovable property worth ₹100 or more, must be registered." }
      ],
      recentUpdates: [
        "State RERA authorities continue clearing backlog homebuyer complaints; several states have strengthened penalty enforcement against non-compliant developers.",
        "Digitisation of land records (SVAMITVA scheme, DILRMP) continues to expand, aimed at reducing property-title litigation nationwide."
      ]
    },
    {
      id: "labour",
      name: "Labour & Employment Law",
      icon: "🧑‍🏭",
      color: "gold",
      tagline: "The Four Labour Codes",
      summary: "India has consolidated 29 central labour laws into four Codes — Wages, Industrial Relations, Social Security, and Occupational Safety, Health & Working Conditions — now formally in force pending full central and state rule notification.",
      status: "The four Labour Codes took effect from 21 November 2025. The Union government notified final Central Rules for all four codes on 8 May 2026; several states (Gujarat, Haryana, Karnataka, Madhya Pradesh, Maharashtra, Arunachal Pradesh) have notified their own final state rules, while others remain at the draft-rules stage as of mid-2026.",
      keyActs: [
        { name: "Code on Wages", year: "2019", note: "Universal minimum wage floor, timely payment, equal pay for equal work, in force 21 Nov 2025" },
        { name: "Industrial Relations Code", year: "2020", note: "Trade unions, standing orders, layoff/retrenchment (threshold raised to establishments with 300+ workers for prior government permission)" },
        { name: "Code on Social Security", year: "2020", note: "PF, ESI, gratuity, maternity benefit, and — for the first time — gig & platform workers brought within a social security net" },
        { name: "Occupational Safety, Health and Working Conditions Code", year: "2020", note: "Consolidates safety/welfare laws, appointment letters mandatory, work-hour limits" }
      ],
      sections: [
        { id: "cow-wage", ref: "Code on Wages §5", title: "Prohibition of Wage Discrimination", body: "Employers must pay equal wages to all genders for the same work or work of a similar nature; no discrimination on grounds of gender in matters of wages or recruitment for the same work." },
        { id: "ss-gig", ref: "Social Security Code, Ch. IX", title: "Gig & Platform Worker Welfare", body: "Establishes a social security fund for gig/platform workers (e.g., delivery and ride-hailing workers), funded partly by aggregator contributions — a first for Indian labour law." },
        { id: "irc-layoff", ref: "Industrial Relations Code §77–78", title: "Layoff & Retrenchment Threshold", body: "Establishments with 300 or more workers now require prior government permission for layoff, retrenchment or closure (raised from the earlier 100-worker threshold under the Industrial Disputes Act)." },
        { id: "osh-hours", ref: "OSH Code", title: "Working Hours & Appointment Letters", body: "Caps daily/weekly working hours (with overtime wages at twice the ordinary rate) and makes a formal appointment letter mandatory for every employee." }
      ],
      recentUpdates: [
        "8 May 2026 — Union government notified final Central Rules for the Code on Wages, Social Security Code, OSH Code and Industrial Relations Code, operationalising provisions that had been dormant since the 21 Nov 2025 notification of the Codes themselves.",
        "State-level rule notification remains uneven: several states had finalised their rules by early-to-mid 2026, while others are still processing objections on draft rules — meaning some Code provisions are enforceable only partially depending on the state.",
        "Supreme Court, 2026 (Hamsaanandini Nanduri v. Union of India) struck down §60(4) of the Social Security Code as unconstitutional for restricting maternity benefit eligibility for adoptive mothers."
      ]
    },
    {
      id: "tax",
      name: "Tax Law",
      icon: "💰",
      color: "green",
      tagline: "Income Tax, GST & customs",
      summary: "Direct taxation (income tax) and indirect taxation (GST, customs) form the core of India's fiscal law, with GST unifying most indirect taxes since 2017.",
      status: "The Income-tax Act, 1961 was replaced by the Income Tax Act, 2025, effective from Assessment Year 2026-27, simplifying language and restructuring sections; GST continues to see periodic rate rationalisation by the GST Council.",
      keyActs: [
        { name: "Income Tax Act", year: "2025", note: "Replaces the 1961 Act from AY 2026-27 — simplified structure, 'tax year' terminology replaces 'previous year/assessment year' distinction" },
        { name: "Central Goods and Services Tax (CGST) Act", year: "2017", note: "Along with SGST/IGST/UTGST Acts — unified indirect tax regime" },
        { name: "Customs Act", year: "1962", note: "Import/export duties, valuation, and customs procedure" },
        { name: "Black Money (Undisclosed Foreign Income and Assets) and Imposition of Tax Act", year: "2015", note: "Stringent penalties for undisclosed foreign assets/income" }
      ],
      sections: [
        { id: "gst9", ref: "CGST Act §9", title: "Levy and Collection", body: "Central GST is levied on intra-state supply of goods/services (except alcohol for human consumption and certain petroleum products), at rates notified by the GST Council." },
        { id: "gst16", ref: "CGST Act §16", title: "Input Tax Credit", body: "A registered person may claim credit of input tax charged on inward supplies used in the course of business, subject to conditions (possession of invoice, receipt of goods/services, tax actually paid, return filed)." },
        { id: "ita-newregime", ref: "Income Tax Act, 2025 — Default Regime", title: "New (Concessional) Tax Regime", body: "The new tax regime with lower slab rates but fewer deductions/exemptions continues as the default regime, with taxpayers retaining the option to opt for the old regime where beneficial." },
        { id: "customs14", ref: "Customs Act §14", title: "Valuation of Goods", body: "Assessable value for customs duty is ordinarily the transaction value — the price actually paid or payable for goods when sold for export to India." }
      ],
      recentUpdates: [
        "Income Tax Act, 2025 is now the governing statute from Assessment Year 2026-27, replacing the six-decade-old 1961 Act with simplified drafting; taxpayers and practitioners are transitioning to updated section references.",
        "GST Council continues periodic rate-slab rationalisation exercises aimed at correcting inverted duty structures across sectors."
      ]
    },
    {
      id: "cyber",
      name: "Cyber & Data Protection Law",
      icon: "💻",
      color: "blue",
      tagline: "Cybercrime, IT Act, DPDP Act & online safety",
      summary: "Covers the full range of cybercrime — hacking, phishing, identity theft, cyberstalking, cyberbullying, online obscenity and child-safety offences — alongside electronic contracts, intermediary liability, and a comprehensive personal data protection framework.",
      status: "Digital Personal Data Protection Act, 2023 rules were notified in 2025-26, bringing the Data Protection Board into effective operation; India's dedicated cybercrime helpline (1930) and reporting portal (cybercrime.gov.in) continue to be the primary route for victims, handling lakhs of complaints and saving thousands of crores in frozen fraudulent transactions.",
      keyActs: [
        { name: "Information Technology Act", year: "2000", note: "Amended 2008 — hacking, identity theft, phishing, obscenity, cyberstalking-adjacent offences, electronic records/signatures, intermediary due diligence" },
        { name: "Bharatiya Nyaya Sanhita (BNS)", year: "2023", note: "Stalking (incl. cyberstalking), criminal intimidation by anonymous communication, defamation — apply equally when committed online" },
        { name: "Digital Personal Data Protection (DPDP) Act", year: "2023", note: "India's comprehensive data-protection law — consent, purpose limitation, data principal rights, Data Protection Board" },
        { name: "IT (Intermediary Guidelines and Digital Media Ethics Code) Rules", year: "2021", note: "Due diligence for social media/OTT/digital news intermediaries, mandatory grievance officers, content takedown timelines" },
        { name: "Protection of Children from Sexual Offences (POCSO) Act", year: "2012", note: "Applies alongside IT Act §67B whenever a cybercrime victim is a minor" }
      ],
      sections: [
        { id: "it43", ref: "IT Act §43", title: "Penalty for Damage to Computer/System", body: "Civil liability for unauthorised access, downloading, introducing viruses, or damaging computer systems/data — compensation to the affected person." },
        { id: "it66", ref: "IT Act §66", title: "Hacking & Computer-Related Offences", body: "Doing any act referred to in §43 dishonestly or fraudulently — unauthorised access, data theft, introducing malware/ransomware — is punishable with imprisonment up to 3 years and/or fine up to ₹5 lakh." },
        { id: "it66c", ref: "IT Act §66C", title: "Identity Theft", body: "Fraudulent/dishonest use of another person's electronic signature, password, or unique identification (e.g. stolen login credentials, cloned SIM/UPI identity) — up to 3 years imprisonment and fine up to ₹1 lakh." },
        { id: "it66d", ref: "IT Act §66D", title: "Phishing — Cheating by Personation", body: "Cheating by personation using a computer resource or communication device — the primary provision used against phishing emails/SMS, fake bank websites, and fraudulent job/loan offers impersonating real institutions. Up to 3 years imprisonment and fine up to ₹1 lakh." },
        { id: "it66e", ref: "IT Act §66E", title: "Violation of Privacy", body: "Capturing, publishing, or transmitting images of a person's private area without consent — covers 'revenge porn'/non-consensual intimate imagery (NCII) and hidden-camera voyeurism. Up to 3 years imprisonment and fine up to ₹2 lakh." },
        { id: "it67", ref: "IT Act §67", title: "Publishing Obscene Material Electronically", body: "Publishing or transmitting obscene material in electronic form — up to 3 years imprisonment and fine up to ₹5 lakh on first conviction; up to 5 years and ₹10 lakh on repeat conviction." },
        { id: "it67a", ref: "IT Act §67A", title: "Sexually Explicit Material", body: "Publishing or transmitting material containing sexually explicit acts electronically — a more severe offence than §67, with correspondingly higher penalties." },
        { id: "it67b", ref: "IT Act §67B", title: "Child Sexual Abuse Material (CSAM)", body: "Publishing, transmitting, creating, collecting, browsing, or distributing material depicting children in sexually explicit acts, or online grooming/inducement of a child — up to 5 years imprisonment and fine up to ₹10 lakh on first conviction, up to 7 years on repeat conviction. Applies alongside the POCSO Act where the victim is a minor." },
        { id: "bns78", ref: "BNS §78", title: "Stalking (including Cyberstalking)", body: "Following a person and repeatedly contacting them despite disinterest, or monitoring their use of the internet, email, or electronic communication, causing fear or distress — explicitly covers cyberstalking conducted entirely through messaging, social media, or tracking. Up to 3 years imprisonment (first conviction), up to 5 years (repeat)." },
        { id: "bns351", ref: "BNS §351(4)", title: "Criminal Intimidation by Anonymous Communication", body: "Threatening messages sent anonymously or with the sender's identity concealed — commonly used against anonymous trolling, threatening DMs, and cyberbullying involving threats — carries up to 2 years imprisonment in addition to the base criminal intimidation punishment." },
        { id: "bns356", ref: "BNS §356", title: "Defamation (incl. Cyber Defamation)", body: "Making or publishing any imputation intending to harm a person's reputation — applies equally to defamatory posts, reviews, or messages published online, in addition to any civil defamation remedy." },
        { id: "dpdp4", ref: "DPDP Act §4", title: "Grounds for Processing Personal Data", body: "Personal data may be processed only for a lawful purpose with the data principal's consent, or for specified 'legitimate uses' listed in the Act." },
        { id: "dpdp8", ref: "DPDP Act §8", title: "Obligations of Data Fiduciary", body: "Must implement reasonable security safeguards, notify the Board and affected data principals of a personal data breach, and cannot retain data beyond the purpose for which it was collected." }
      ],
      helplines: [
        { name: "National Cyber Crime Helpline", number: "1930", note: "24/7 toll-free — call immediately for financial fraud (UPI, net-banking, card, loan-app scams) to request a transaction freeze within the 'golden hour' before funds move further." },
        { name: "National Cyber Crime Reporting Portal", number: "cybercrime.gov.in", note: "File a formal complaint online for any cybercrime — hacking, phishing, stalking, obscene content, financial fraud. Has a dedicated, partly-anonymous reporting track for crimes against women & children." },
        { name: "CHILDLINE India", number: "1098", note: "Child helpline — for any cybercrime involving a minor, including CSAM, online grooming, or a child being cyberbullied." },
        { name: "Women Helpline", number: "181", note: "Counselling, legal assistance, and support for online harassment, cyberstalking, NCII/revenge-porn, and abuse targeting women." },
        { name: "Emergency Response Support System", number: "112", note: "India's unified emergency number — police, medical, fire, and immediate women's/child safety response." }
      ],
      recentUpdates: [
        "The National Cyber Crime Reporting Portal (relaunched December 2023) and the 1930 helpline together have handled over 9.9 lakh complaints and helped save more than ₹3,431 crore in frozen fraudulent transactions, per government figures.",
        "Data Protection Board of India, established under the DPDP Act, has become operational for handling data-breach complaints and imposing penalties (up to ₹250 crore for significant breaches) as rules were progressively notified through 2025-26.",
        "Courts continue to grapple with AI-related evidentiary issues — see the Supreme Court's July 2026 caution (Pooja Ramesh Singh v. J&K Bank) against AI-hallucinated case law being cited in filings."
      ]
    },
    {
      id: "consumer",
      name: "Consumer Protection Law",
      icon: "🛒",
      color: "green",
      tagline: "Consumer rights, e-commerce & product liability",
      summary: "Modernised consumer-protection framework covering unfair trade practices, misleading advertisements, e-commerce, and product liability, enforced through a three-tier Consumer Commission structure.",
      status: "Consumer Protection Act, 2019 (in force since 2020) continues to be the primary statute, with the Central Consumer Protection Authority (CCPA) actively penalising misleading ads and dark patterns in e-commerce.",
      keyActs: [
        { name: "Consumer Protection Act", year: "2019", note: "Replaced the 1986 Act — CCPA, product liability, e-commerce rules, mediation" },
        { name: "Consumer Protection (E-Commerce) Rules", year: "2020", note: "Disclosure obligations for online marketplaces & inventory-based e-commerce entities" },
        { name: "Legal Metrology Act", year: "2009", note: "Weights, measures & mandatory declarations on packaged goods" }
      ],
      sections: [
        { id: "cpa2", ref: "CPA §2(47)", title: "Unfair Trade Practice", body: "Defines a broad range of practices — false representation, misleading advertisement, hoarding, refusal to take back defective goods, non-issue of bills — as unfair trade practices." },
        { id: "cpa17", ref: "CPA §17", title: "Where Complaint to be Filed", body: "Jurisdiction of District, State, and National Consumer Commissions is based on the value of goods/services paid as consideration, not merely the compensation claimed (post-2019 change)." },
        { id: "cpa84", ref: "CPA §84", title: "Product Liability Action", body: "A manufacturer, product service provider, or seller can be held liable for harm caused by a defective product or deficient service." },
        { id: "cpa89", ref: "CPA §89", title: "Punishment for False/Misleading Advertisement", body: "Manufacturers/endorsers of false or misleading advertisements prejudicial to consumer interest face fines up to ₹10 lakh (up to ₹50 lakh for repeat offences) and imprisonment up to 5 years." }
      ],
      recentUpdates: [
        "CCPA continues active enforcement against 'dark patterns' in e-commerce (fake urgency, forced subscriptions, hidden costs) under its 2023 guidelines, with penalty orders against several major platforms.",
        "Product liability and e-commerce disclosure norms remain a growing area of consumer litigation as online retail expands."
      ]
    },
    {
      id: "ip",
      name: "Intellectual Property Law",
      icon: "💡",
      color: "blue",
      tagline: "Trademarks, patents, copyright & designs",
      summary: "Protects creations of the mind — brand names, inventions, creative works, and product designs — through registration with the Indian IP Office and enforcement against infringement and counterfeiting.",
      status: "India's Trade Marks Registry and Patent Office have both cut examination and disposal timelines in recent years under Ease-of-Doing-Business IP reforms; enforcement against online counterfeiting remains an active litigation area.",
      keyActs: [
        { name: "Trade Marks Act", year: "1999", note: "Trademark registration, infringement & passing off" },
        { name: "Patents Act", year: "1970 (amended 2005)", note: "Patent registration; product patents recognised post-2005 for TRIPS compliance" },
        { name: "Copyright Act", year: "1957", note: "Literary, artistic, musical & software works; amended 2012 for digital-era rights" },
        { name: "Designs Act", year: "2000", note: "Registration of industrial/product designs" },
        { name: "Geographical Indications of Goods (Registration & Protection) Act", year: "1999", note: "GI tags — e.g. Darjeeling Tea, Basmati Rice" }
      ],
      sections: [
        { id: "tma29", ref: "Trade Marks Act §29", title: "Infringement of a Registered Trademark", body: "Using an identical or deceptively similar mark for similar goods/services without authorisation infringes a registered trademark, entitling the proprietor to an injunction and damages." },
        { id: "pa48", ref: "Patents Act §48", title: "Rights of a Patentee", body: "Exclusive right to prevent others from making, using, selling, or importing the patented product or process in India, for 20 years from the date of filing." },
        { id: "ca1957-14", ref: "Copyright Act §14", title: "Meaning of Copyright", body: "Exclusive rights to reproduce, issue copies of, perform, translate, or adapt a work. Copyright arises automatically on creation — registration is optional but useful as evidence of ownership." },
        { id: "ca1957-51", ref: "Copyright Act §51", title: "Infringement", body: "Doing anything the copyright owner has the exclusive right to do, without a licence, infringes copyright — subject to 'fair dealing' exceptions for research, review, and reporting under §52." }
      ],
      recentUpdates: [
        "India's Patent Office and Trade Marks Registry have significantly reduced examination and disposal timelines in recent years as part of Ease-of-Doing-Business IP reforms.",
        "The Delhi High Court's specialised IP Division continues to see a steady rise in enforcement litigation against online counterfeiting and trademark squatting on e-commerce marketplaces."
      ]
    },
    {
      id: "banking",
      name: "Banking & Finance Law",
      icon: "🏦",
      color: "gold",
      tagline: "RBI regulation, NBFCs & debt recovery",
      summary: "Governs banks, NBFCs, and financial institutions in India — RBI regulatory compliance, lending, security interests, and the recovery of debts through specialised tribunals.",
      status: "RBI continues tightening digital-lending and NBFC governance norms; SARFAESI/DRT recovery remains the primary route for secured creditors, alongside the IBC for corporate insolvency-linked defaults.",
      keyActs: [
        { name: "Banking Regulation Act", year: "1949", note: "Licensing & regulation of banking companies" },
        { name: "Reserve Bank of India Act", year: "1934", note: "RBI's regulatory & monetary powers" },
        { name: "SARFAESI Act", year: "2002", note: "Lets secured creditors enforce security interests without court intervention on default" },
        { name: "Recovery of Debts and Bankruptcy Act (RDB Act)", year: "1993", note: "Debt Recovery Tribunals (DRTs) for bank/financial-institution dues above the prescribed threshold" },
        { name: "Payment and Settlement Systems Act", year: "2007", note: "Regulates digital payment systems" }
      ],
      sections: [
        { id: "sarfaesi13", ref: "SARFAESI Act §13(2)", title: "Enforcement of Security Interest", body: "On default (loan classified as an NPA), a secured creditor may issue a 60-day demand notice, after which it can take possession of and sell the secured asset without approaching a court." },
        { id: "sarfaesi17", ref: "SARFAESI Act §17", title: "Application Against Enforcement", body: "A borrower aggrieved by enforcement measures under the Act may approach the Debt Recovery Tribunal (DRT) within 45 days of the measure being taken." },
        { id: "rdb19", ref: "RDB Act §19", title: "Application to the DRT", body: "Banks and financial institutions can file recovery applications before the Debt Recovery Tribunal for outstanding dues above the prescribed threshold (currently ₹20 lakh)." },
        { id: "bra5b", ref: "Banking Regulation Act §5(b)", title: "'Banking' Defined", body: "Accepting deposits of money from the public, repayable on demand or otherwise, for the purpose of lending or investment." }
      ],
      recentUpdates: [
        "RBI's tightened digital-lending guidelines — covering First Loss Default Guarantee norms and lending-app regulation — continue to reshape the fintech-NBFC lending ecosystem through 2025-26.",
        "Debt Recovery Tribunals continue to face case backlogs, keeping policy attention on tribunal capacity alongside the IBC as an alternative recovery route for corporate defaults."
      ]
    },
    {
      id: "traffic",
      name: "Traffic & Road Law",
      icon: "🚦",
      color: "red",
      tagline: "Motor Vehicles Act, licences, challans & accidents",
      summary: "Covers driving licences, traffic offences and fines under the Motor Vehicles Act, e-challans, mandatory insurance, and — critically — what the law guarantees you after a road accident, from Good Samaritan protection to cashless emergency treatment and compensation.",
      status: "The e-Challan system now runs on a 45-day pay-or-dispute window nationwide, with RTO services/licence action possible if a challan sits unpaid 30 days past that; the nationwide Cashless Treatment of Road Accident Victims Scheme, 2025 and the Rah-Veer Good Samaritan reward scheme are both operational.",
      keyActs: [
        { name: "Motor Vehicles Act", year: "1988 (amended 2019)", note: "Licensing, traffic offences & penalties, insurance, accident compensation — the core road law statute" },
        { name: "Central Motor Vehicles Rules", year: "1989", note: "Procedural rules — licence forms, helmet/safety standards, registration, fitness certificates" },
        { name: "Cashless Treatment of Road Accident Victims Scheme", year: "2025", note: "Nationwide scheme guaranteeing cashless emergency treatment following a Supreme Court Article 21 direction" },
        { name: "National Highways Act", year: "1956", note: "Regulates national highways — tolls, access control, land acquisition for highway development" }
      ],
      sections: [
        { id: "mva3", ref: "MV Act §3", title: "Requirement of a Valid Driving Licence", body: "No person may drive a motor vehicle in a public place unless they hold a driving licence authorising them to drive that class of vehicle — the foundational licensing requirement." },
        { id: "mva181", ref: "MV Act §181", title: "Driving Without a Licence", body: "Driving without a valid licence, or in breach of licence conditions, is punishable with imprisonment up to 3 months and/or a fine up to ₹5,000." },
        { id: "mva183", ref: "MV Act §183", title: "Driving at Excessive Speed", body: "Overspeeding beyond the prescribed limit attracts a fine of ₹1,000–₹2,000 for a first offence (light motor vehicles), rising for repeat offences and for larger vehicles." },
        { id: "mva184", ref: "MV Act §184", title: "Dangerous Driving (incl. Mobile Phone Use)", body: "Driving in a manner dangerous to the public, including using a handheld mobile phone while driving, is punishable with imprisonment up to 6 months to 1 year and/or a fine of ₹1,000–₹5,000 for a first offence, higher on repeat conviction." },
        { id: "mva185", ref: "MV Act §185", title: "Drunk Driving / Driving Under the Influence", body: "A driver found drunk or under the influence of alcohol or drugs is punishable with imprisonment up to 6 months and/or a fine up to ₹10,000 for a first offence; up to 2 years imprisonment and/or ₹15,000 fine for a subsequent offence." },
        { id: "mva194b", ref: "MV Act §194B", title: "Seat Belts & Child Safety", body: "Driving without wearing a seat belt, or carrying a child under 14 without a seat belt/child restraint system, is punishable with a fine of ₹1,000." },
        { id: "mva194d", ref: "MV Act §194D", title: "Riding Without a Helmet", body: "Riding or carrying a passenger on a two-wheeler without wearing protective headgear is punishable with a fine of ₹1,000 and disqualification from holding a licence for 3 months." },
        { id: "mva196", ref: "MV Act §196", title: "Driving Without Insurance", body: "Driving (or allowing a vehicle to be driven) without a valid third-party insurance policy is punishable with imprisonment up to 3 months and/or a fine up to ₹2,000 for a first offence, higher on repeat conviction. Third-party insurance is legally mandatory for every vehicle on Indian roads." },
        { id: "mva134a", ref: "MV Act §134A", title: "Good Samaritan Protection", body: "A person who in good faith renders emergency medical or non-medical assistance to an accident victim cannot be held liable for any injury or death that follows, cannot be compelled to disclose their name/details unless they choose to, and cannot be forced to bear medical or other expenses. This exists specifically to stop bystanders from avoiding accident victims out of fear of legal or police harassment." },
        { id: "mva162", ref: "MV Act §162", title: "Motor Vehicle Accident Fund & Rah-Veer Scheme", body: "Funds interim relief for hit-and-run and uninsured-vehicle victims, and now underpins the Rah-Veer Yojana, which rewards a Good Samaritan ₹25,000 for helping an accident victim within the first 60 minutes ('golden hour') after an accident." },
        { id: "mva166", ref: "MV Act §166", title: "Compensation Claims (MACT)", body: "A road-accident victim (or their legal heirs, in a fatal accident) can file a claim for compensation before the Motor Accident Claims Tribunal (MACT) against the driver, owner, and/or insurer — no separate civil suit is required." },
        { id: "mva199a", ref: "MV Act §199A", title: "Owner/Guardian Liability for Juvenile Driving", body: "If a minor drives a motor vehicle, the owner and the guardian/parent of the minor are deemed guilty (subject to specified exceptions), face imprisonment up to 3 years and a fine up to ₹25,000, and the vehicle's registration can be cancelled; the juvenile is also barred from getting a licence until age 25." },
        { id: "mva200", ref: "MV Act §200", title: "Traffic Challans — Composition of Offences", body: "Many traffic offences (unpaid challans for speeding, no helmet, no seat belt, driving without a licence, and similar violations) can be 'compounded' — settled by paying a fixed fine directly to a traffic officer or online, instead of going through a court prosecution. Serious offences — drunk driving, causing death or grievous injury, hit-and-run — cannot be compounded this way and must go through the courts. Check and pay any challan only via the official e-Challan portal or mParivahan app, within the 45-day window." },
        { id: "cashless2025", ref: "Cashless Treatment Scheme, 2025", title: "Guaranteed Cashless Emergency Treatment", body: "Following a Supreme Court direction that golden-hour trauma care is a constitutional right under Article 21, every hospital must now admit and treat a road accident victim immediately, with up to ₹1.5 lakh of treatment covered directly for the first 7 days. A hospital cannot demand upfront payment or refuse admission — doing so is itself a violation you can report." }
      ],
      helplines: [
        { name: "Traffic e-Challan Portal", number: "echallan.parivahan.gov.in", note: "Check and pay traffic challans online using your vehicle number, DL number, or challan number — the only official portal; challans must be paid or disputed within 45 days." },
        { name: "mParivahan App", number: "mParivahan", note: "Official app for your digital driving licence and RC — DigiLocker/mParivahan documents are legally valid nationwide, so traffic police must accept them instead of physical copies." },
        { name: "Emergency Response Support System", number: "112", note: "Unified emergency number for road accidents — connects to police, ambulance, and fire response." }
      ],
      recentUpdates: [
        "Supreme Court's January 2025 ruling that golden-hour trauma care is a constitutional right under Article 21 led to the nationwide Cashless Treatment of Road Accident Victims Scheme, 2025 — up to ₹1.5 lakh covered per victim for the first 7 days, with hospitals barred from demanding upfront payment or refusing admission.",
        "The Rah-Veer Good Samaritan reward scheme (₹25,000 for helping a victim within the golden hour) is now operational alongside the pre-existing legal protections under MV Act §134A.",
        "The e-Challan payment/dispute window is now standardised at 45 days nationwide, with RTO service blocks or licence action possible if a challan remains unpaid 30 days beyond that."
      ]
    }
  ]
};

if (typeof module !== "undefined") module.exports = LAWS_DB;
