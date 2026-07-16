/**
 * NyayaAI Legal Cost Calculator — estimation engine.
 * Every function returns an array of rows: { category, low, high, note }, where
 * category is one of "Lawyer fees" / "Court fees" / "Registration costs" /
 * "Government fees" / "Stamp duty". Figures are illustrative ranges compiled from
 * commonly published sources, not official quotes — except where marked as a fixed
 * government rate (MCA incorporation slabs, trademark e-filing fees), which are
 * cited, current published figures.
 */
const CostsEngine = (function () {
  function row(category, low, high, note) {
    return { category: category, low: low, high: high, note: note || "" };
  }

  function calcProperty(a) {
    const value = parseFloat(a.propertyValue) || 0;
    const bucketRates = {
      "Lower (e.g. Gujarat, some NE states, ~4-5%)": [0.04, 0.05],
      "Typical (e.g. Maharashtra, Delhi, Karnataka, ~5-7%)": [0.05, 0.07],
      "Higher (e.g. UP, Kerala, Tamil Nadu, Rajasthan, ~7-8%+)": [0.07, 0.085]
    };
    const rate = bucketRates[a.stateBucket] || [0.04, 0.08];
    const stampLow = value * rate[0], stampHigh = value * rate[1];
    const regLow = Math.min(value * 0.01, 30000), regHigh = Math.min(value * 0.01, 30000) * 1.2;

    return [
      row("Stamp Duty", stampLow, stampHigh, "Stamp duty varies by state, and many states offer a 1-2% concession for women buyers. Calculated on the higher of transaction value or the local circle rate."),
      row("Registration Costs", regLow, regHigh, "Typically ~1% of property value; several states cap this (e.g. Karnataka caps around ₹15,000, Maharashtra around ₹30,000)."),
      row("Lawyer Fees", 15000, 50000, "Title verification, due diligence, sale deed drafting, and registration assistance — scales up for high-value or complex/disputed properties.")
    ];
  }

  function calcCivilSuit(a) {
    const value = parseFloat(a.claimValue) || 0;
    const feeLow = value * 0.01, feeHigh = Math.min(value * 0.10, value * 0.06 + 20000);
    return [
      row("Court Fees", feeLow, feeHigh, "Ad valorem (percentage-of-claim) court fees under the Court Fees Act, 1870 and state amendments — the exact slab varies significantly by state; many states use degressive slabs so the effective % is often lower for high-value claims."),
      row("Lawyer Fees", 15000, 75000, "Filing plus multiple hearings at the district court level for a straightforward recovery matter — complex, multi-year, or higher-court litigation costs substantially more.")
    ];
  }

  function calcCompanyRegistration(a) {
    const capital = parseFloat(a.authCapital) || 0;
    const isLLP = a.companyType === "Limited Liability Partnership (LLP)";
    let govtFee = 0, govtNote = "MCA incorporation fee is nil for authorised capital up to ₹15 lakh.";
    if (!isLLP) {
      if (capital > 10000000) { govtFee = 4000; govtNote = "MCA fee slabs continue incrementally above ₹1 crore authorised capital — shown here is the ₹25L–1Cr slab rate as a floor."; }
      else if (capital > 2500000) { govtFee = 4000; govtNote = "MCA incorporation fee for authorised capital between ₹25 lakh and ₹1 crore."; }
      else if (capital > 1500000) { govtFee = 2000; govtNote = "MCA incorporation fee for authorised capital between ₹15 lakh and ₹25 lakh."; }
      else { govtFee = 0; }
    } else {
      govtFee = 500; govtNote = "LLP incorporation (FiLLiP) government fee depends on contribution amount; a nominal small-LLP fee is shown.";
    }
    return [
      row("Government Fees", govtFee, govtFee, govtNote + " (Fixed MCA rate, not a range.)"),
      row("Stamp Duty", 500, 10000, "Stamp duty on the e-MoA/e-AoA (or LLP Agreement) is a state-level charge calculated on authorised capital/contribution — varies materially by state."),
      row("Lawyer / CA-CS Fees", isLLP ? 5000 : 8000, isLLP ? 15000 : 25000, "Professional fees for drafting, DSC/DIN assistance, and filing — beyond the government fee itself.")
    ];
  }

  function calcTrademark(a) {
    const perClass = a.applicantType === "Individual / Startup / MSME" ? 4500 : 9000;
    const classes = a.numClasses === "4 or more" ? 4 : parseInt(a.numClasses || "1", 10);
    const govtFee = perClass * classes;
    return [
      row("Government Fees", govtFee, govtFee, "Fixed IP India e-filing rate: ₹" + perClass.toLocaleString("en-IN") + " per class × " + classes + " class(es). (Not a range — this is the official published fee.)"),
      row("Lawyer / Agent Fees", 2000 * classes, 15000 * classes, "Trademark search, drafting, and filing assistance — increases with the number of classes and if you need opposition/objection handling later.")
    ];
  }

  function calcConsumerComplaint(a) {
    const value = parseFloat(a.claimValue) || 0;
    const hiringLawyer = a.hiringLawyer === "Hiring a lawyer";
    const feeLow = value <= 500000 ? 100 : value <= 2000000 ? 500 : 2000;
    const feeHigh = feeLow * 3;
    const rows = [row("Court Fees", feeLow, feeHigh, "Consumer Commission fees are nominal and scale modestly with claim value — far lower than ordinary civil court fees.")];
    if (hiringLawyer) rows.push(row("Lawyer Fees", 5000, 20000, "Optional — the Consumer Protection Act specifically allows self-representation, so many complainants file without a lawyer."));
    else rows.push(row("Lawyer Fees", 0, 0, "You can represent yourself — no advocate is required for consumer complaints."));
    return rows;
  }

  function calcDivorce(a) {
    const mutual = a.route === "Mutual consent";
    return [
      row("Court Fees", 500, 2000, "Nominal, fixed court fee for filing a divorce petition — low compared to money-suit court fees."),
      row("Lawyer Fees", mutual ? 15000 : 50000, mutual ? 50000 : 300000, mutual ? "Mutual consent cases are usually faster and simpler — both parties often share drafting costs." : "Contested divorces vary enormously by duration, number of hearings, and issues involved (custody, alimony, property) — costs can run well beyond this range for prolonged litigation.")
    ];
  }

  function calcCriminalDefense(a) {
    const tiers = {
      "Minor / bailable offence": [10000, 50000],
      "Serious / non-bailable offence (incl. bail application)": [50000, 200000],
      "Sessions trial / serious offence": [100000, 500000]
    };
    const t = tiers[a.severity] || tiers["Minor / bailable offence"];
    return [
      row("Court Fees", 0, 500, "Criminal court fees for the defence are typically minimal or nil — the state bears prosecution costs; your primary cost is legal representation."),
      row("Lawyer Fees", t[0], t[1], "Highly variable by city, advocate seniority, and case complexity — a Sessions Court trial with a senior advocate in a metro city can run well above this range.")
    ];
  }

  function calcGSTRegistration() {
    return [
      row("Government Fees", 0, 0, "GST registration itself is free — there is no government fee for filing on the GST portal."),
      row("Lawyer / CA Fees", 500, 5000, "Optional professional assistance with documentation and filing — many businesses complete this themselves at no cost.")
    ];
  }

  function calcLegalNotice() {
    return [row("Lawyer Fees", 1500, 10000, "Drafting a legal notice is usually billed as a standalone service — cost depends on complexity and the advocate's seniority, not on the amount involved.")];
  }

  const CALCULATORS = {
    "property": calcProperty,
    "civil-suit": calcCivilSuit,
    "company-registration": calcCompanyRegistration,
    "trademark": calcTrademark,
    "consumer-complaint": calcConsumerComplaint,
    "divorce": calcDivorce,
    "criminal-defense": calcCriminalDefense,
    "gst-registration": calcGSTRegistration,
    "legal-notice": calcLegalNotice
  };

  function calculate(matterId, answers) {
    const fn = CALCULATORS[matterId];
    if (!fn) return null;
    const rows = fn(answers);
    const totalLow = rows.reduce(function (sum, r) { return sum + r.low; }, 0);
    const totalHigh = rows.reduce(function (sum, r) { return sum + r.high; }, 0);
    return { rows: rows, totalLow: totalLow, totalHigh: totalHigh, totalAverage: (totalLow + totalHigh) / 2 };
  }

  function formatINR(n) {
    return "₹" + Math.round(n).toLocaleString("en-IN");
  }

  return { calculate: calculate, formatINR: formatINR };
})();
