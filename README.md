# NyayaAI — AI Legal Consultation Platform (India)

A fully static (no build step) website: an AI-operated legal information platform covering 13
practice areas of Indian law (Constitutional, Criminal (BNS/BNSS/BSA), Civil, Corporate, Family,
Property, Labour, Tax, Cyber, Consumer, Intellectual Property, Banking & Finance, Traffic & Road
Law), plus a curated Current Affairs feed, practical step-by-step guides, an AI Document
Intelligence tool (now with PDF/image upload, OCR, named entity recognition, and document-type
classification), 8 Smart Legal Forms wizards, a Legal Cost Calculator, Smart Notifications
(court/consultation/compliance reminders with rule-based recommendations), an IP Toolkit
(trademark similarity checker, class finder, copyright/patent guidance, brand protection), an
[AI Technologies](ai-technologies.html) status page, speech recognition and text-to-speech in
AI Consultation, site-wide search, and an FAQ/Contact section. English only.

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
index.html            Landing page — dark glassmorphic design (see "Homepage design" below),
                          scoped to this page only; every other page keeps the monochrome system
chat.html              AI consultation chat UI
documents.html          AI Document Intelligence — analyze/compare contracts, NDAs, rental agreements, etc.
forms.html               Smart Legal Forms — 8 guided wizards that draft documents/checklists from your answers
costs.html               Legal Cost Calculator — lawyer/court/registration/government fees & stamp duty, as ranges
notifications.html       Smart Notifications — court/consultation reminders, document expiry, compliance
                          deadlines, and rule-based recommendations, all stored in browser localStorage
ip-tools.html            IP Toolkit — trademark similarity checker, trademark class finder, copyright
                          guidance, patent guidance with a patentability quick-check, and brand protection
ai-technologies.html     Honest status catalog of every AI/ML-style technique on the site — what's
                          genuinely live and local vs. what needs a connected AI backend
404.html                 Custom not-found page — GitHub Pages serves this automatically for any
                          unmatched URL
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
js/chat-engine.js         Pure chat retrieval/reply logic (demo-mode retrieval + live-backend hook,
                          no DOM) — shared by js/chat.js and the homepage's live demo widget
js/chat.js                Controller for chat.html — wires the chat UI to ChatEngine, plus mic
                          dictation, text-to-speech, quick prompts, and the ?q= prefill param
js/index-page.js          Controller for the redesigned index.html — stats, practice-area chips,
                          features, the live demo chat widget (wired to ChatEngine), FAQ accordion,
                          scroll/spotlight effects
js/law-page.js            Renders a category page from laws-data.js
js/insights-page.js       Renders insights.html from insights-data.js
js/doc-analysis.js        Document Intelligence's local analysis engine (dates, payments, obligations,
                          risky-phrase flags, missing-clause checklist, paragraph diff) — pure text
                          processing, no AI, runs entirely in the browser
js/documents-page.js      Controller for documents.html — wires the UI to doc-analysis.js, handles
                          PDF/image text extraction (lazy-loading js/vendor/ libraries on upload),
                          the AI-gated deep-analysis buttons (summarize/explain/suggest), and PDF
                          report generation via the browser's native print-to-PDF
js/vendor/                Self-hosted PDF.js (PDF text extraction) and Tesseract.js (image OCR) —
                          see js/vendor/README.md for versions/licenses; loaded on demand, not on
                          page load, and only on documents.html
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
js/notifications-engine.js   Smart Notifications' logic — reminder CRUD, urgency classification, the
                          Notification API wrapper, tool-usage tracking, and the rule-based
                          recommendation engine — all backed by localStorage, no server involved
js/notifications-page.js  Controller for notifications.html — permission UI, add-reminder form,
                          compliance quick-add, recommendations panel, and the grouped upcoming list
js/data/compliance-deadlines.js   Recurring statutory deadline templates (ITR, advance tax, GSTR-3B,
                          ROC filings) used by the quick-add panel to compute the next occurrence
js/ip-tools-engine.js     IP Toolkit's logic — Levenshtein similarity + a simplified phonetic key for
                          the trademark similarity checker, keyword matching for the class finder, and
                          a rule-based screen against the Patents Act §3 exclusions
js/ip-tools-page.js       Controller for ip-tools.html — tabs, similarity checker, class finder,
                          patentability quick-check, and the trademark-renewal reminder cross-link
js/data/trademark-database.js   Seeded reference data: the 45-class NICE classification (with keywords
                          for the class finder) and ~80 real, well-known Indian trademarks used only as
                          a comparison set for the similarity checker demo
js/ai-technologies-page.js   Controller + inline content for ai-technologies.html — the honest
                          live-vs-backend-gated status catalog for every AI technique on the site
js/ui-fx.js               Shared, dependency-free toast notifications and confetti burst — loaded
                          on every page
js/404-page.js            Controller for 404.html — wires its "Search the site" button to the same
                          overlay the nav search uses

server/chat-proxy-example.js   Reference Express backend to proxy chat to an LLM (not run automatically)
```

## AI Document Intelligence — what actually works without a backend

`documents.html` lets you paste or upload a contract, NDA, rental agreement, employment contract,
sale deed, partnership deed, court order, or legal notice — as pasted text, a `.txt` file, a `.pdf`,
or a `.jpg`/`.png` photo or scan. Several features are **genuinely functional today with zero AI
backend**, because they're real text processing on your actual document, not fabricated output:

- Extracting dates, payment amounts, and obligation-language sentences
- Flagging phrases commonly worth a closer look (indemnification, liquidated damages, sole discretion,
  auto-renewal, etc. — see `RISKY_PHRASES` in `js/data/document-checklists.js`)
- Checking for commonly-expected clauses that seem to be missing, per document type
- Comparing two documents paragraph-by-paragraph (a real LCS diff, not an approximation)
- A composite "executive summary" built from the above (not AI-written prose, but not fake either)
- **Named Entity Recognition**: pattern/list-based extraction of persons, organizations, defined
  parties (e.g. `("Landlord")`), and Indian locations — `DocAnalysis.extractNamedEntities()`, driven
  by `CLASSIFY_KEYWORDS`/`INDIAN_PLACES` in `js/data/document-checklists.js`. Not a trained NER model.
- **AI-style classification**: the "🔍 Detect" button next to the document-type dropdown guesses the
  type from pasted/uploaded text via keyword-overlap scoring — `DocAnalysis.classifyDocumentType()`,
  the same technique the IP Toolkit's class finder uses. Not a trained classifier.
- Generating a PDF report via the browser's own print-to-PDF

**Uploading a PDF or image** extracts real text before any of the above runs, entirely on-device:
- **`.pdf`** — exact text extraction via a locally-vendored PDF.js (`js/vendor/pdfjs/`), no OCR
  guessing involved. If a PDF is actually a scanned image with no selectable text, that's flagged so
  you know to re-upload it as a photo instead.
- **`.jpg` / `.png`** — real optical character recognition via a locally-vendored Tesseract.js
  (`js/vendor/tesseract/`), which downloads its ~10MB OCR engine once, on demand, only when you
  upload an image. Unlike PDF text, OCR output is machine-read and can misread words — the result is
  labeled as such, with a prompt to double-check it against the original photo, especially for
  numbers, dates, and signatures.

Both run entirely in the browser via files served from this same site (see `js/vendor/README.md`
for exact versions/licenses) — no CDN calls, nothing uploaded anywhere, consistent with the rest of
this page's "processed locally" claim.

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

## Smart Notifications — real reminders, entirely client-side

`notifications.html` tracks four kinds of reminders (Court Reminder, Consultation Reminder, Document
Expiry, Compliance Deadline), all stored in `localStorage` (`nyayaai_reminders_v1`) — nothing is sent
to a server, so reminders don't sync across devices and disappear if browser data is cleared. This is
disclosed up front in the page's topbar and an explainer alert, not buried in a privacy policy.

- **Manual reminders** and a **compliance quick-add** panel (`js/data/compliance-deadlines.js`) that
  computes the next real occurrence of recurring deadlines (ITR, advance tax instalments, monthly
  GSTR-3B, ROC AOC-4/MGT-7) from today's date — genuine date math, not hardcoded strings.
- **Cross-links from other tools**: dates extracted by AI Document Intelligence get a "🔔 Remind me"
  button (`js/documents-page.js`), and a generated Legal Notice gets a "🔔 Remind me to follow up"
  button that computes the response-deadline date automatically (`js/forms-page.js`). Both record which
  tool was used (`NotificationsEngine.recordToolUsage`) so the recommendation engine can react to it.
- **Rule-based recommendations** (`NotificationsEngine.getRecommendations` in
  `js/notifications-engine.js`) — e.g. nudging you to set a follow-up reminder before a tracked document
  expires, or pointing out you've used Document Intelligence but never saved any of its extracted dates.
  These are deterministic `if` rules over your own local data, explicitly not AI-generated, and each one
  can be dismissed permanently (`nyayaai_dismissed_recs_v1`).
- **Real browser notifications** (`Notification.requestPermission()` / `new Notification(...)`) fire for
  anything due today, but only while a NyayaAI tab is open — this is disclosed as not being a background
  push service, and the UI suggests also using a phone calendar for anything critical like a court date.
- A **bell icon with an unread-count badge** is injected into the nav on every page by
  `injectNotificationBell` in `js/main.js`, reading `NotificationsEngine.dueSoonCount()`.

Add a new recurring compliance deadline by extending the `COMPLIANCE_DEADLINES` array in
`js/data/compliance-deadlines.js`; add a new cross-link by calling `NotificationsEngine.addReminder(...)`
from any page that already loads `js/notifications-engine.js`.

## IP Toolkit — a real algorithm, not a live government search

`ip-tools.html` covers the five things people actually ask about IP: a trademark search starting
point, copyright guidance, patent guidance, brand protection, and an "AI" trademark similarity
checker. The topbar and an in-page alert both say plainly what's real and what isn't:

- **Trademark similarity checker** (`js/ip-tools-engine.js`) runs a genuine Levenshtein edit-distance
  calculation plus a simplified phonetic key (so near-homophones like "Kwikk" vs "Quick" still match)
  against `TRADEMARK_DB` in `js/data/trademark-database.js` — a small seeded list (~80 marks) of
  real, well-known Indian trademarks, used purely as a comparison set. This is **not** a connection
  to the IP India Trade Marks Registry database, and every result panel says so — a clean result is
  not legal clearance, only a first screen.
- **Trademark class finder** matches a plain-language business description against keyword lists for
  all 45 NICE classification classes (the same classification India's Trade Marks Registry uses) —
  real keyword matching, not AI.
- **Copyright guidance** and **patent guidance** are structured, cited content (duration, fair
  dealing, registration process, provisional vs. complete specification, fee slabs).
- **Patentability quick-check** is a rule-based screen against the major Patents Act §3 exclusions
  (algorithms/business methods, mere discovery, medical treatment methods, mental acts, traditional
  knowledge, aesthetic creations) — it flags likely statutory bars, but cannot check novelty or prior
  art, which needs a real search and a patent agent's opinion.
- **Brand protection** guidance cross-links to the Trademark Filing and Legal Notice Smart Forms, and
  a "🔔 Set a 10-year renewal reminder" button that adds a real entry to Smart Notifications.

Add more reference trademarks or classes by extending `js/data/trademark-database.js`; the similarity
threshold, scoring, and phonetic algorithm all live in `js/ip-tools-engine.js`.

## AI Technologies — [ai-technologies.html](ai-technologies.html) is the honest index

That page catalogs every AI/ML-adjacent technique on the site with a clear ✅ live-and-local vs.
🔌 needs-a-backend badge, so "AI-powered" branding doesn't blur genuinely-running local features
together with ones that are only real once a backend is connected. Two more live-and-local pieces,
not covered elsewhere in this README:

- **Speech recognition** (dictate into AI Consultation via the 🎤 button) uses the browser's native
  Web Speech API. Caveat, stated in the UI itself: in Chrome/Edge this sends audio to the browser
  vendor's own servers for transcription — it never touches NyayaAI's code or any NyayaAI server,
  but unlike the OCR/TTS features it isn't purely on-device either. The button is hidden entirely in
  browsers that don't support the API (progressive enhancement, no broken UI).
- **Text-to-speech** (🔊 "read aloud" on any AI Consultation answer) uses `speechSynthesis` — genuinely
  on-device in effectively all browser implementations, no network call.

LLM-powered Q&A, Retrieval-Augmented Generation, true semantic embeddings, and AI summarization are
all shown on that page as requiring a connected backend — see "The AI chat... currently run in demo
mode" below for exactly how to wire one up. AI translation was evaluated and intentionally not built
(see git history) — the site is English-only by design for now.

## Small details

A handful of sitewide polish items, added in one pass:

- **Loading screen** — a brief branded fade-out on every page load, pure CSS (`body::before`/
  `::after` in `css/style.css`, no markup or JS needed anywhere), respects
  `prefers-reduced-motion`, hidden in print.
- **Custom favicon** — replaced the generic ⚖️ emoji favicon with a proper branded mark (black
  rounded square + "न्या", matching the header brand logo exactly) across every page.
- **Custom 404 page** — [404.html](404.html) matches the site's design and links back to the
  main tools; GitHub Pages serves it automatically for any unmatched URL, no config needed.
- **Empty states** — audited every filterable list; fixed a real gap where filtering
  [news.html](news.html) by a practice area with no seeded articles (IP, Banking, Traffic, Civil,
  Corporate, Property, Consumer) rendered a silent blank grid. Now shows an explanatory message
  with a link straight to chat. New `.empty-state` CSS component for reuse elsewhere.
- **Confetti** — the site has no literal "booking" flow, so this fires at the closest real
  equivalent: successfully generating a document in Smart Forms (`js/forms-page.js`). Dependency-free
  canvas burst in `js/ui-fx.js`, grayscale to match the monochrome design system, skipped entirely
  under `prefers-reduced-motion`.
- **Toast notifications** — `NyayaFX.toast()` in `js/ui-fx.js`, loaded on every page. Wired into
  the two places that genuinely lacked any success feedback: adding a manual reminder and
  quick-adding a compliance deadline on [notifications.html](notifications.html). Left the
  existing inline "✓ Copied" / "✓ Reminder set" button-text feedback alone elsewhere rather than
  duplicating it.
- **Keyboard shortcuts** — `Ctrl/Cmd+K` now works as an alias for the existing `/` search
  shortcut, and `?` opens a shortcuts help modal (`injectKeyboardShortcuts()` in `js/main.js`).

## Homepage design — imported from Claude Design, adapted for honesty

`index.html` was redesigned from a Claude Design Composer project (a dark, glassmorphic landing
page) at the user's request, scoped to the homepage only — every other page keeps the site's
regular monochrome design system, by explicit choice, rather than a full site-wide redesign.

The source file (`.dc.html`) isn't plain HTML — it's a proprietary preview format with template
bindings (`{{ }}`, `sc-for`, `sc-if`) and a React-style component that only runs inside claude.ai's
own design tool. Getting it onto a static GitHub Pages site meant a real translation, not a copy
paste, and a few things were deliberately changed rather than carried over as-is:

- **The "AI Demo" chat called `window.claude.complete()`** — a claude.ai-only API that doesn't exist
  on a deployed static site and would fail silently. It's wired instead to `js/chat-engine.js`, the
  same real local retrieval engine `chat.html` uses (refactored out of the old `js/chat.js` into a
  shared module specifically so both chat surfaces answer identically instead of drifting apart).
  Demo mode by default; genuinely LLM-powered if you connect `AI_CONFIG.apiEndpoint`, same as
  everywhere else on the site.
- **Fabricated social proof was removed, not toned down.** The source design shipped a trust-logo
  strip ("STARTUP CO.", "LEX & PARTNERS", ...), a usage-stats counter (10,000+ queries, 98%
  satisfaction), and a testimonials carousel with literal placeholder text ("Placeholder testimonial
  — real quote to be supplied", "Client name"). This is a solo AI-built project with no real clients,
  partners, or usage data — shipping any of that as real would be actively deceptive, not just
  unfinished. The stats section instead shows the same honest numbers the old homepage did (13 real
  Practice Areas, 24/7, ₹0 fee, 0 human gatekeepers, computed from `LAWS_DB` rather than hardcoded),
  and the trust-logo and testimonial sections were dropped entirely rather than replaced with
  something equally fake.
- **A "Case Prediction" feature card and a "Lawyer Verified" / "Multilingual" claim were in the
  source design but don't exist on this site** (there's no outcome-prediction tool, no advocate
  review pipeline, and multilingual support was built and then explicitly removed earlier — see git
  history). The features and "why choose us" sections were rewritten to describe the six things that
  are actually live: AI Legal Chat, Document Intelligence, Smart Legal Forms, Cost Calculator, IP
  Toolkit, and Smart Notifications.
- **The FAQ answers were rewritten for accuracy** — e.g. the source's privacy answer claimed
  encryption and "no training without consent" (neither is implemented, there's no backend to train
  anything); the real answer is that nothing is sent anywhere unless you connect a live AI backend,
  and local features store data only in your own browser.
- **The command palette (⌘K) was replaced with the site's real search**, not rebuilt as a second,
  separate mock search with 3 hardcoded items — clicking it or pressing `Ctrl/Cmd+K` opens the exact
  same site-wide search overlay every other page uses (`main.js`'s `.search-trigger`, re-skinned for
  the dark theme via page-scoped CSS).
- **Google Fonts (`fonts.googleapis.com`) was dropped** in favour of the site's existing system-font
  stack, to keep the zero-external-dependency posture already established for PDF.js/Tesseract.js —
  no new CSP relaxation, nothing fetched from a third party.
- The footer's fake newsletter signup and dead social icons (`X`, `in`, `IG`, `YT`, all `href="#"`)
  were replaced with real links to every actual page on the site (Documents, Forms, Costs, IP
  Toolkit, Reminders, Practice Areas, AI Technologies, Insights, About, Contact, and all three legal
  pages) so nothing becomes unreachable from the new homepage.

Everything else — the scroll progress bar, cursor spotlight, animated background grid, orbiting
hero visual, animated stat counters, FAQ accordion — is a faithful, real (non-mocked) implementation
of what the design specified, in vanilla JS matching the rest of the codebase's style (no framework,
no build step). See `js/index-page.js`.

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
