/* ============================================================
   i18n.js — idiomas
   Lee los textos de locales/es.json y locales/en.json y los
   aplica a los elementos con data-i18n.
   ============================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "moonlit-lang";
  var DEFAULT_LANG = "es";
  var currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  var loadedLang = null;

  document.documentElement.lang = currentLang;

  var buttons = document.querySelectorAll(".lang-btn");

  function setActiveButton() {
    buttons.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.lang === currentLang);
    });
  }

  function applyTranslations(data) {
    document.title = data["meta.title"] || document.title;
    var metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && data["meta.description"]) {
      metaDescription.setAttribute("content", data["meta.description"]);
    }

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (data[key] !== undefined) {
        el.textContent = data[key];
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (data[key] !== undefined) {
        el.setAttribute("aria-label", data[key]);
      }
    });
  }

  function loadLang(lang) {
    if (loadedLang === lang) {
      return;
    }
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    fetch("locales/" + lang + ".json")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        loadedLang = lang;
        applyTranslations(data);
        setActiveButton();
      })
      .catch(function () {
        console.error("No se pudo cargar locales/" + lang + ".json");
      });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      loadLang(btn.dataset.lang);
    });
  });

  setActiveButton();
  loadLang(currentLang);
})();
