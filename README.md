# NyayaAI — AI Legal Consultation Platform (India)

A fully static (no build step) website: an AI-operated legal information platform covering 13
practice areas of Indian law (Constitutional, Criminal (BNS/BNSS/BSA), Civil, Corporate, Family,
Property, Labour, Tax, Cyber, Consumer, Intellectual Property, Banking & Finance, Traffic & Road
Law), plus a curated Current Affairs feed, practical step-by-step guides, an AI Document
Intelligence tool, 8 Smart Legal Forms wizards, a Legal Cost Calculator, site-wide search, and an
FAQ/Contact section.

Design: monochrome (black/white/gray) throughout — see `css/style.css`.

## Running it locally right now

No installation needed — it's plain HTML/CSS/JS. Just open `index.html` in a browser, or serve the
folder with any static server, e.g.:

```
npx serve .
```

(or Python: `python -m http.server 8000`)

## Project structure

```
index.html            Landing page
chat.html              AI consultation chat UI
documents.html          AI Document Intelligence — analyze/compare contracts, NDAs, rental agreements, etc.
forms.html               Smart Legal Forms — 8 guided wizards that draft documents/checklists from your answers
costs.html               Legal Cost Calculator — lawyer/court/registration/government fees & stamp duty, as ranges
laws.html               Practice-area hub (grid of all 13 categories)
laws/<category>.html    13 thin page shells — all content is rendered by js/law-page.js from laws-data.js
news.html               Current-affairs feed
insights.html            Practical step-by-step guides (file an FIR, register a trademark, etc.)
faq.html                 Honest, conversational FAQ (accordion)
contact.html             Feedback form (mailto-based — no backend yet)
about.html               How NyayaAI works / limitations / who maintains it
disclaimer.html          Legal Disclaimer (what NyayaAI is/isn't, limits of AI-generated legal info)
privacy.html             Privacy Policy (DPDP Act, 2023 aligned — data collected, rights, grievance contact)
terms.html               Terms of Use (acceptable use, IP, liability, governing law, grievance officer)

css/style.css            Shared design system
js/main.js               Nav toggle, active-link highlighting, site-wide search, entry disclaimer modal,
                          and JS-injected Documents/Insights/FAQ/Contact links (no page hand-authors them)
js/ai-config.js           Shared AI_CONFIG (apiEndpoint + system prompts) used by both chat.js and
                          documents-page.js — set apiEndpoint once here to enable a live backend for both
js/chat.js                Chat engine (demo-mode retrieval + live-backend hook)
js/law-page.js            Renders a category page from laws-data.js
js/insights-page.js       Renders insights.html from insights-data.js
js/doc-analysis.js        Document Intelligence's local analysis engine (dates, payments, obligations,
                          risky-phrase flags, missing-clause checklist, paragraph diff) — pure text
                          processing, no AI, runs entirely in the browser
js/documents-page.js      Controller for documents.html — wires the UI to doc-analysis.js, handles the
                          AI-gated deep-analysis buttons (summarize/explain/suggest), and PDF report
                          generation via the browser's native print-to-PDF
js/data/laws-data.js      The legal knowledge base (edit this to add/update law content)
js/data/news-data.js      Seeded current-affairs items + NEWS_CONFIG for a future live feed
js/data/insights-data.js  Step-by-step practical guides
js/data/document-checklists.js   Risky-phrase dictionary, obligation/payment keywords, and per-document-type
                          "commonly expected clause" checklists used by doc-analysis.js
js/forms-engine.js        Smart Legal Forms' generation logic — jurisdiction thresholds, fee tables,
                          applicable-law branching, and document templating, per form
js/forms-page.js          Controller for forms.html — drives the step-by-step wizard (incl. conditional
                          steps), validates answers, renders the generated output + PDF export
js/data/forms-data.js     Question definitions for all 8 form wizards
js/costs-engine.js        Legal Cost Calculator's estimation logic — MCA fee slabs, trademark e-filing
                          fees, ad valorem court fee ranges, stamp duty ranges, lawyer fee ranges
js/costs-page.js          Controller for costs.html — matter picker, inline inputs, results table
js/data/costs-data.js     Matter-type + input-field definitions for all 9 cost calculators

server/chat-proxy-example.js   Reference Express backend to proxy chat to an LLM (not run automatically)
```

## AI Document Intelligence — what actually works without a backend

`documents.html` lets you paste or upload (.txt only for now) a contract, NDA, rental agreement,
employment contract, sale deed, partnership deed, court order, or legal notice. Several features are
**genuinely functional today with zero AI backend**, because they're real text processing on your
actual document, not fabricated output:

- Extracting dates, payment amounts, and obligation-language sentences
- Flagging phrases commonly worth a closer look (indemnification, liquidated damages, sole discretion,
  auto-renewal, etc. — see `RISKY_PHRASES` in `js/data/document-checklists.js`)
- Checking for commonly-expected clauses that seem to be missing, per document type
- Comparing two documents paragraph-by-paragraph (a real LCS diff, not an approximation)
- A composite "executive summary" built from the above (not AI-written prose, but not fake either)
- Generating a PDF report via the browser's own print-to-PDF

**Summarize / Explain every paragraph / Suggest improvements** are the exception — those need genuine
language understanding, so they're gated exactly like the chat: with `AI_CONFIG.apiEndpoint` unset,
clicking them shows an honest "no AI backend connected" message rather than faking a response. Set
`apiEndpoint` in `js/ai-config.js` once to enable live AI for *both* the chat and these three buttons.

## Smart Legal Forms — also fully functional without a backend

`forms.html` has 8 short wizards (Legal Notice, Consumer Complaint, FIR Guidance, Property Dispute,
Trademark Filing, Company Registration, GST Registration, Divorce). Every one of these is genuinely
rule-based — no AI needed — because drafting a document from structured answers, or applying a
jurisdiction/fee/threshold rule, is a deterministic task once the branching logic is defined:

- Legal Notice / Consumer Complaint / FIR Guidance generate a real draft document from your answers
- Consumer Complaint computes the correct forum (District/State/National Commission) from the claim
  value against the actual 2021-amended pecuniary jurisdiction thresholds
- GST Registration determines whether registration is mandatory from turnover vs. the correct
  goods/services threshold for your state (including the special-category state rules)
- Trademark Filing estimates the government fee (₹4,500 vs ₹9,000/class) from applicant type
- Divorce branches its guidance by applicable law, mutual-consent vs. contested route, and separation
  duration (including the Amardeep Singh v. Harveen Kaur cooling-off-waiver point)
- Company Registration tailors its checklist to Private Limited vs. OPC vs. LLP

Every generated draft is clearly labelled as a starting point, not a certified or filed legal
document — see the disclaimer on `forms.html` itself. Add new forms by extending `js/data/forms-data.js`
(questions, with optional `showIf` branching) and adding a generator function to `js/forms-engine.js`.

## Legal Cost Calculator — ranges and averages, not fake precision

`costs.html` estimates lawyer fees, court fees, registration costs, government fees, and stamp duty
for 9 common situations (Property Purchase/Sale, Civil Suit, Company Registration, Trademark Filing,
Consumer Complaint, Divorce, Criminal Case Defense, GST Registration, Legal Notice). Every category is
shown as a **Low / Average / High** row plus a total estimated range, deliberately — court fees, stamp
duty, and especially lawyer fees genuinely vary by state, city, and advocate, so a single number would
be misleadingly precise.

Two kinds of figures are mixed in deliberately:
- **Fixed government rates** (MCA incorporation fee slabs, IP India trademark e-filing fees, GST
  registration being free) are cited, current official rates — shown as a "range" only for table
  consistency (low = high).
- **Everything else** (stamp duty, ad valorem court fees, lawyer/CA fees) is an illustrative range
  compiled from commonly published sources, clearly caveated as needing confirmation with your
  advocate, Sub-Registrar, or court. Add new matter types by extending `js/data/costs-data.js` and
  adding a calculator function to `js/costs-engine.js`.

## Notable behavior worth knowing about

- **Entry disclaimer modal**: shown once per browser (localStorage-gated) — the standard convention
  on Indian legal/advocate websites, given Bar Council of India restrictions on solicitation.
- **Site-wide search**: a 🔍 button injected into the nav on every page (press `/` to open it too),
  searching across practice areas, provisions, news, and guides — entirely client-side, no backend.
- **Insights/FAQ/Contact links are not hand-written into every page's HTML.** `js/main.js` injects
  them into the nav and footer at runtime. This means adding a 13th practice area or a new top-level
  page mostly just requires adding data — not editing 20 HTML files by hand.
- **Contact form** builds a `mailto:` link (to a placeholder `hello@nyayaai.example` address — swap
  this for a real inbox in `contact.html`) rather than pretending to submit to a backend that doesn't
  exist yet.
- **Placeholder email addresses to replace before going live**: `hello@nyayaai.example` (contact.html),
  `privacy@nyayaai.example` (privacy.html — the DPDP Act "Grievance Officer / Data Protection" contact),
  and `grievance@nyayaai.example` (terms.html — the IT Rules, 2021 grievance officer contact). All three
  use the reserved, non-resolving `.example` domain deliberately — swap them for real inboxes you
  actually monitor before this goes live, since the IT Rules require a working, published channel.

## The AI chat (and document deep-analysis) currently run in "demo mode"

`js/ai-config.js` has an empty `AI_CONFIG.apiEndpoint`, so `chat.js` answers using a local
keyword-matching engine over `js/data/laws-data.js`, and `documents-page.js`'s Summarize/Explain/
Suggest buttons show an honest "no backend connected" message — no external API calls, no cost,
works offline. This is enough to demo the full UX, but it is **not a general-purpose LLM**: the chat
can only surface what's in the seeded knowledge base, and the AI-only document features do nothing
until a backend is connected (the extraction features on `documents.html` work fully regardless — see
above).

### To wire up a real AI (recommended: Anthropic Claude)

1. Install [Node.js](https://nodejs.org) (LTS) — not currently installed on this machine.
2. `cd server && npm init -y && npm install express cors @anthropic-ai/sdk dotenv`
3. Create `server/.env` with `ANTHROPIC_API_KEY=sk-ant-...` (get a key at console.anthropic.com — keep
   it server-side, never put it in frontend JS).
4. `node server/chat-proxy-example.js` — starts a proxy on `http://localhost:8787`.
5. In `js/ai-config.js`, set `AI_CONFIG.apiEndpoint = "http://localhost:8787/api/chat"` — this enables
   both the chat and the document deep-analysis buttons at once.
6. For production, deploy the proxy (Vercel/Netlify function, Render, Railway, etc.) and point
   `apiEndpoint` at the deployed URL instead of localhost.

The frontend already POSTs `{ system, messages }` and expects `{ reply }` back — any backend that
speaks that contract works, so you can swap in OpenAI, a self-hosted model, or a RAG pipeline instead.

## Making Current Affairs live

`js/data/news-data.js` currently holds ~9 real, sourced items curated as of 15 July 2026. To make it
live:

1. Get an API key from a news source — e.g. [NewsAPI.org](https://newsapi.org), or scrape/subscribe to
   [PRS Legislative Research](https://prsindia.org) RSS for bill tracking, or [PIB](https://pib.gov.in)
   press releases for government/ministry announcements.
2. Build a small backend route (similar pattern to the chat proxy) that fetches and normalises articles
   into the same shape as items in `NEWS_DB` (`id, date, category, tag, title, summary, source, url,
   lawArea`).
3. Set `NEWS_CONFIG.liveFeedEndpoint` in `js/data/news-data.js`, and update `news.html`'s script to
   `fetch()` that endpoint and merge/replace the seeded array.

## Expanding the legal knowledge base

Everything in `laws/*.html` is a 10-line shell — all real content (acts, sections, articles, current
status) lives in `js/data/laws-data.js` as one object per category. To add a new provision, amendment,
or an entirely new practice area (e.g. Environmental Law, IP Law, Banking Law), add an entry to that
file; the category page, chat retrieval engine, and homepage grid all pick it up automatically. To add
a new category page shell, copy any existing `laws/*.html` file and change only the
`const CATEGORY_ID = "...")` line to match the new `id` in `laws-data.js`.

## Important: this is legal information, not legal advice

See [`disclaimer.html`](disclaimer.html). Keep the topbar disclaimer banner and the in-chat disclaimer
line intact on any deployment — this is both an ethical requirement and reduces legal risk to whoever
operates the site. Courts (including the Indian Supreme Court, July 2026) have begun explicitly warning
against AI-hallucinated case citations — treat demo-mode and even live-LLM answers as a research
starting point requiring verification against the official bare act/judgment text, not a final answer.
