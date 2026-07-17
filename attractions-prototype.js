(function () {
    "use strict";

    var header = document.querySelector("[data-header]");
    var menuButton = document.querySelector(".menu-toggle");
    var mobileMenu = document.getElementById("prototype-menu");
    var parallaxLayer = document.querySelector("[data-parallax]");
    var scrollShiftElements = document.querySelectorAll("[data-scroll-shift]");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateHeader() {
        if (header) {
            header.classList.toggle("is-scrolled", window.scrollY > 30);
        }
    }

    function setMenu(open) {
        if (!menuButton || !mobileMenu || !header) {
            return;
        }

        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
        mobileMenu.setAttribute("aria-hidden", String(!open));
        mobileMenu.classList.toggle("is-open", open);
        header.classList.toggle("is-menu-open", open);
        document.body.classList.toggle("menu-open", open);
    }

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", function () {
            setMenu(menuButton.getAttribute("aria-expanded") !== "true");
        });

        mobileMenu.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                setMenu(false);
            }
        });

        document.addEventListener("click", function (event) {
            if (menuButton.getAttribute("aria-expanded") === "true" &&
                !mobileMenu.contains(event.target) &&
                !menuButton.contains(event.target)) {
                setMenu(false);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
                setMenu(false);
                menuButton.focus();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 960) {
                setMenu(false);
            }
        });
    }

    document.querySelectorAll("[data-expand]").forEach(function (button) {
        var panel = document.getElementById(button.getAttribute("aria-controls"));
        var label = button.querySelector("span");
        var icon = button.querySelector("i");
        var section = button.closest("[data-section]");

        if (!panel) {
            return;
        }

        panel.setAttribute("aria-hidden", "true");

        button.addEventListener("click", function () {
            var open = button.getAttribute("aria-expanded") !== "true";
            button.setAttribute("aria-expanded", String(open));
            panel.setAttribute("aria-hidden", String(!open));
            panel.classList.toggle("is-open", open);

            if (section) {
                section.classList.toggle("is-expanded", open);
            }

            if (label) {
                label.textContent = open ? "Zwiń szczegóły" : "Dowiedz się więcej";
            }

            if (icon) {
                icon.textContent = open ? "−" : "+";
            }
        });
    });

    var revealElements = document.querySelectorAll(".reveal");

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    } else {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -8%"
        });

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    }

    var parallaxFrame = null;

    function updateParallax() {
        parallaxFrame = null;

        if (reduceMotion.matches || window.innerWidth <= 680) {
            if (parallaxLayer) {
                parallaxLayer.style.setProperty("--parallax-y", "0px");
            }

            scrollShiftElements.forEach(function (element) {
                element.style.setProperty("--scroll-shift", "0px");
            });
            return;
        }

        if (parallaxLayer) {
            var offset = Math.min(window.scrollY * 0.13, 86);
            parallaxLayer.style.setProperty("--parallax-y", offset + "px");
        }

        scrollShiftElements.forEach(function (element) {
            var rect = element.getBoundingClientRect();
            var distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
            var progress = Math.max(-1, Math.min(1, distanceFromCenter / window.innerHeight));
            var strength = Number(element.getAttribute("data-scroll-shift")) || 0;
            element.style.setProperty("--scroll-shift", (-progress * strength).toFixed(2) + "px");
        });
    }

    function requestParallaxUpdate() {
        if (parallaxFrame === null) {
            parallaxFrame = window.requestAnimationFrame(updateParallax);
        }
    }

    window.addEventListener("scroll", function () {
        updateHeader();
        requestParallaxUpdate();
    }, { passive: true });

    window.addEventListener("resize", requestParallaxUpdate);

    if (typeof reduceMotion.addEventListener === "function") {
        reduceMotion.addEventListener("change", requestParallaxUpdate);
    }

    updateHeader();
    updateParallax();
}());
