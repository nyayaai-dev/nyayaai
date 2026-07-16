/**
 * Core i18n lookup — persists the chosen language in localStorage and resolves translation
 * keys against js/data/i18n-data.js's TRANSLATIONS, falling back to English for any key/language
 * that isn't covered (which, by design, is everything except site chrome — see i18n-data.js).
 */
const I18N = (function () {
  const KEY = "nyayaai_lang_v1";

  function safeGet(k) {
    try { return window.localStorage.getItem(k); } catch (err) { return null; }
  }
  function safeSet(k, v) {
    try { window.localStorage.setItem(k, v); } catch (err) { /* ignore */ }
  }

  function getLang() {
    const saved = safeGet(KEY);
    return (saved && TRANSLATIONS[saved]) ? saved : "en";
  }

  function setLang(code) {
    if (!TRANSLATIONS[code]) return;
    safeSet(KEY, code);
  }

  function nativeName(code) {
    const l = LANGUAGES.find(function (x) { return x.code === code; });
    return l ? l.native : code;
  }

  function t(key) {
    const lang = getLang();
    const fromLang = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
    return fromLang || TRANSLATIONS.en[key] || key;
  }

  return { getLang: getLang, setLang: setLang, nativeName: nativeName, t: t, LANGUAGES: LANGUAGES };
})();
