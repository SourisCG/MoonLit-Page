/* ============================================================
   main.js — copiar código, resaltar sección activa y
   descarga directa del último release
   ============================================================ */
(function () {
  "use strict";

  /* --- Descarga directa de la última release (GitHub API) --- */
  var installerBtn = document.getElementById("btn-installer");
  var portableBtn = document.getElementById("btn-portable");
  var downloadStatus = document.getElementById("download-status");
  var RELEASES_URL = "https://github.com/SourisCG/MoonLit/releases";
  var API_URL = "https://api.github.com/repos/SourisCG/MoonLit/releases/latest";

  function applyDownloadButtons(data) {
    if (!data || !data.assets) {
      return false;
    }
    var installer = null;
    var portable = null;

    data.assets.forEach(function (asset) {
      var name = asset.name || "";
      if (!installer && /-Setup\.exe$/i.test(name)) {
        installer = asset;
      }
      if (!portable && /-x64\.zip$/i.test(name)) {
        portable = asset;
      }
    });

    if (installer && installerBtn) {
      installerBtn.href = installer.browser_download_url;
      installerBtn.setAttribute("download", installer.name);
    }
    if (portable && portableBtn) {
      portableBtn.href = portable.browser_download_url;
      portableBtn.setAttribute("download", portable.name);
    }

    var version = data.tag_name || "";
    var statusEl = downloadStatus;
    if (statusEl) {
      if (version) {
        var okText = document.documentElement.lang === "en" ? "Direct download of the latest version ({version})" : "Descarga directa de la última versión ({version})";
        statusEl.textContent = okText.replace("{version}", version);
      }
      statusEl.hidden = false;
    }
    return installer || portable;
  }

  if (installerBtn || portableBtn) {
    fetch(API_URL, { headers: { "Accept": "application/vnd.github+json" } })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        if (applyDownloadButtons(data)) {
          /* los botones ya apuntan al archivo directo */
        } else if (downloadStatus) {
          downloadStatus.hidden = true;
        }
      })
      .catch(function () {
        if (downloadStatus) {
          downloadStatus.hidden = true;
        }
        if (installerBtn) {
          installerBtn.href = RELEASES_URL;
        }
        if (portableBtn) {
          portableBtn.href = RELEASES_URL;
        }
      });
  }

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

  /* --- Efecto tilt del logo del hero --- */
  var heroLogo = document.getElementById("hero-logo");
  var heroSection = document.getElementById("hero");

  if (heroLogo && heroSection && window.matchMedia("(pointer: fine)").matches) {
    var rafPending = false;

    heroSection.addEventListener("mousemove", function (event) {
      if (rafPending) {
        return;
      }
      rafPending = true;
      requestAnimationFrame(function () {
        var rect = heroSection.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        heroLogo.style.transform =
          "rotateY(" + x * 16 + "deg) rotateX(" + y * -16 + "deg)";
        rafPending = false;
      });
    });

    heroSection.addEventListener("mouseleave", function () {
      heroLogo.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

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
