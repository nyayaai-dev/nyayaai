/**
 * NyayaAI — recurring Indian compliance deadline templates, for the "quick add"
 * feature on notifications.html. Dates are the commonly published statutory due
 * dates; js/notifications-engine.js computes the *next* actual occurrence from
 * today's date. Where a deadline depends on circumstances that vary (e.g. a
 * company's specific AGM date), that's noted explicitly rather than presented as
 * exact for every entity.
 */
const COMPLIANCE_DEADLINES = [
  {
    id: "itr-individual",
    name: "Income Tax Return — Individuals (non-audit)",
    category: "Compliance Deadline",
    dates: [{ month: 7, day: 31 }],
    note: "The standard ITR filing deadline for individuals/HUFs not requiring a tax audit. This date is sometimes extended by CBDT notification — always check for the current year's extension."
  },
  {
    id: "itr-audit",
    name: "Income Tax Return — Audit cases (companies, audited firms)",
    category: "Compliance Deadline",
    dates: [{ month: 10, day: 31 }],
    note: "For taxpayers whose accounts require a tax audit under Section 44AB."
  },
  {
    id: "advance-tax",
    name: "Advance Tax Instalment",
    category: "Compliance Deadline",
    dates: [{ month: 6, day: 15 }, { month: 9, day: 15 }, { month: 12, day: 15 }, { month: 3, day: 15 }],
    note: "Four instalments (15%, 45%, 75%, 100% of estimated annual tax liability, cumulatively) — applies if your estimated tax liability for the year exceeds ₹10,000."
  },
  {
    id: "gstr-3b",
    name: "GSTR-3B Filing (monthly)",
    category: "Compliance Deadline",
    dates: [{ month: 1, day: 20 }, { month: 2, day: 20 }, { month: 3, day: 20 }, { month: 4, day: 20 }, { month: 5, day: 20 }, { month: 6, day: 20 }, { month: 7, day: 20 }, { month: 8, day: 20 }, { month: 9, day: 20 }, { month: 10, day: 20 }, { month: 11, day: 20 }, { month: 12, day: 20 }],
    note: "20th of every month for regular monthly filers. QRMP-scheme taxpayers have different (state-grouped) dates — confirm your specific due date on the GST portal."
  },
  {
    id: "roc-aoc4",
    name: "ROC Annual Filing — AOC-4 (financial statements)",
    category: "Compliance Deadline",
    dates: [{ month: 10, day: 29 }],
    note: "Typically due within 30 days of the AGM; shown here assuming the common 30 September AGM date — adjust if your company's AGM date differs."
  },
  {
    id: "roc-mgt7",
    name: "ROC Annual Filing — MGT-7/7A (annual return)",
    category: "Compliance Deadline",
    dates: [{ month: 11, day: 29 }],
    note: "Typically due within 60 days of the AGM; shown here assuming the common 30 September AGM date — adjust if your company's AGM date differs."
  }
];

if (typeof module !== "undefined") module.exports = COMPLIANCE_DEADLINES;
