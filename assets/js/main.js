/* ============================================================
   main.js — copiar código y resaltar la sección activa
   ============================================================ */
(function () {
  "use strict";

  /* --- Botones "Copiar" de los bloques de código --- */
  var copyButtons = document.querySelectorAll(".copy-btn");

  function fallbackCopy(text, done) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (e) {
      /* sin soporte, se ignora */
    }
    document.body.removeChild(textarea);
    done();
  }

  copyButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.querySelector(btn.dataset.copyTarget);
      if (!target) {
        return;
      }
      var originalText = btn.textContent;
      var onDone = function () {
        btn.textContent = originalText;
        btn.classList.remove("is-copied");
      };
      var onCopied = function () {
        btn.classList.add("is-copied");
        setTimeout(onDone, 2000);
      };
      var text = target.textContent.trim() + "\n";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(onCopied).catch(function () {
          fallbackCopy(text, onCopied);
        });
      } else {
        fallbackCopy(text, onCopied);
      }
    });
  });

  /* --- Resaltar el enlace de la sección visible --- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll('.navbar-links a[href^="#"]');

  if ("IntersectionObserver" in window && sections.length > 0) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === "#" + entry.target.id
              );
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
