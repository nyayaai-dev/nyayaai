# Vendored third-party libraries

Self-hosted (not loaded from a CDN) so the site's strict CSP (`script-src 'self'`) and its "nothing
leaves your browser" claims on `documents.html` hold for real. Only loaded on demand, when someone
uploads a PDF or image — never on page load, and never elsewhere on the site.

## pdfjs/ — PDF.js 3.11.174 (Mozilla, Apache License 2.0)

`pdf.min.js` + matching `pdf.worker.min.js` (legacy UMD build, for exact text extraction from PDFs).
License notice is embedded in the file header. Source: https://github.com/mozilla/pdf.js

## tesseract/ — Tesseract.js 7.0.0 + tesseract.js-core 6.1.2 (Apache License 2.0)

`tesseract.min.js` + `worker.min.js` (the JS API/worker), `tesseract-core-simd-lstm.wasm.js` (the
OCR engine core — SIMD + LSTM-only variant, the modern default for current browsers), and
`eng.traineddata.gz` (English-language OCR model data). Used for extracting text from uploaded
JPEG/PNG photos or scans — real on-device OCR, not a live API call. License files are the
`*.LICENSE.txt` sidecars. Source: https://github.com/naptha/tesseract.js

To upgrade either library, re-download the matching-version files from the same npm packages
(via `cdn.jsdelivr.net/npm/<package>@<version>/<path>`, which mirrors npm's published files) and
keep `pdf.min.js`/`pdf.worker.min.js` and `tesseract.min.js`/`worker.min.js`/the core file on the
same version pair — mismatched versions between a library and its worker/core are a common source
of silent failures.
