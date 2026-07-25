(function () {
    "use strict";

    var header = document.querySelector("[data-header]");
    var menuButton = document.querySelector(".menu-toggle");
    var mobileMenu = document.getElementById("prototype-menu");
    var parallaxLayer = document.querySelector("[data-parallax]");
    var scrollShiftElements = document.querySelectorAll("[data-scroll-shift]");
    var hero = document.querySelector(".hero");
    var introCard = document.querySelector(".intro-card");
    var scrollCue = document.querySelector(".scroll-cue");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateHeader() {
        if (header) {
            header.classList.toggle("is-scrolled", window.scrollY > 80);
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
            if (window.innerWidth > 880) {
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

    var revealElements = document.querySelectorAll(".reveal:not(.intro-card)");

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

    var beachSwitcher = document.querySelector("[data-beach-switcher]");
    var beachControls = document.querySelectorAll("[data-beach-target]");
    var beachImages = beachSwitcher ?
        beachSwitcher.querySelectorAll("[data-beach-image]") :
        [];

    function selectBeachImage(selectedControl) {
        var selectedImage = selectedControl.getAttribute("data-beach-target");

        beachControls.forEach(function (control) {
            var isActive = control === selectedControl;
            control.classList.toggle("is-active", isActive);
            control.setAttribute("aria-pressed", String(isActive));
        });

        beachImages.forEach(function (image) {
            var isActive = image.getAttribute("data-beach-image") === selectedImage;
            image.classList.toggle("is-active", isActive);
            image.setAttribute("aria-hidden", String(!isActive));
        });
    }

    if (beachSwitcher && beachControls.length && beachImages.length) {
        beachControls.forEach(function (control) {
            control.addEventListener("click", function () {
                selectBeachImage(control);
            });
        });
    }

    var introOpen = false;
    var introAnimating = false;
    var introScrollTarget = 0;
    var introUnlockTimer = null;
    var wheelDelta = 0;
    var wheelResetTimer = null;
    var wheelThreshold = 28;

    function getDocumentOffsetTop(element) {
        var offset = 0;
        var currentElement = element;

        while (currentElement) {
            offset += currentElement.offsetTop;
            currentElement = currentElement.offsetParent;
        }

        return offset;
    }

    function measureIntroPosition() {
        if (!hero || !introCard) {
            return;
        }

        var cardTop = getDocumentOffsetTop(introCard);
        var preferredOffset = Math.min(380, window.innerHeight * 0.45);
        introScrollTarget = Math.max(300, Math.min(520, cardTop - preferredOffset));
    }

    function updateIntroAccessibility(open) {
        if (!introCard || !scrollCue) {
            return;
        }

        introCard.setAttribute("aria-hidden", String(!open));
        scrollCue.setAttribute("aria-hidden", String(open));

        if (open) {
            scrollCue.setAttribute("tabindex", "-1");
        } else {
            scrollCue.removeAttribute("tabindex");
        }
    }

    function finishIntroTransition() {
        introAnimating = false;

        if (introUnlockTimer !== null) {
            window.clearTimeout(introUnlockTimer);
            introUnlockTimer = null;
        }
    }

    function setIntroState(open, options) {
        if (!introCard || !scrollCue || !hero) {
            return;
        }

        options = options || {};

        if (introOpen === open && !options.force) {
            return;
        }

        var reduceImmediately = reduceMotion.matches && !options.immediate;

        if (reduceImmediately) {
            document.body.classList.add("intro-no-transition");
        }

        introOpen = open;
        document.body.classList.toggle("intro-open", open);
        updateIntroAccessibility(open);

        if (options.immediate) {
            finishIntroTransition();
            return;
        }

        if (reduceImmediately) {
            if (options.adjustScroll !== false) {
                window.scrollTo({
                    top: open ? introScrollTarget : 0,
                    behavior: "auto"
                });
            }

            void introCard.offsetWidth;
            document.body.classList.remove("intro-no-transition");
            finishIntroTransition();
            return;
        }

        introAnimating = true;

        if (options.adjustScroll !== false) {
            window.scrollTo({
                top: open ? introScrollTarget : 0,
                behavior: reduceMotion.matches ? "auto" : "smooth"
            });
        }

        introUnlockTimer = window.setTimeout(
            finishIntroTransition,
            reduceMotion.matches ? 220 : 840
        );
    }

    function initializeIntroState() {
        if (!introCard || !scrollCue || !hero) {
            return;
        }

        measureIntroPosition();
        document.body.classList.add("intro-no-transition");
        introOpen = window.scrollY > Math.min(120, introScrollTarget * 0.25);
        document.body.classList.toggle("intro-open", introOpen);
        updateIntroAccessibility(introOpen);
        void introCard.offsetWidth;
        document.body.classList.remove("intro-no-transition");
    }

    function isIntroTransitionArea() {
        return window.scrollY <= introScrollTarget + 160;
    }

    function normalizeWheelDelta(event) {
        if (event.deltaMode === 1) {
            return event.deltaY * 16;
        }

        if (event.deltaMode === 2) {
            return event.deltaY * window.innerHeight;
        }

        return event.deltaY;
    }

    function resetWheelDeltaSoon() {
        if (wheelResetTimer !== null) {
            window.clearTimeout(wheelResetTimer);
        }

        wheelResetTimer = window.setTimeout(function () {
            wheelDelta = 0;
            wheelResetTimer = null;
        }, 120);
    }

    function handleIntroWheel(event) {
        if (!introCard || !scrollCue || !hero) {
            return;
        }

        if (introAnimating && isIntroTransitionArea()) {
            event.preventDefault();
            return;
        }

        wheelDelta += normalizeWheelDelta(event);
        resetWheelDeltaSoon();

        if (Math.abs(wheelDelta) < wheelThreshold) {
            return;
        }

        if (wheelDelta > 0 && !introOpen && window.scrollY <= hero.offsetHeight * 0.65) {
            event.preventDefault();
            wheelDelta = 0;
            setIntroState(true);
        } else if (wheelDelta < 0 && introOpen && isIntroTransitionArea()) {
            event.preventDefault();
            wheelDelta = 0;
            setIntroState(false);
        }
    }

    function isInteractiveTarget(target) {
        return target instanceof Element &&
            Boolean(target.closest("input, textarea, select, button, a, [contenteditable='true']"));
    }

    function handleIntroKeydown(event) {
        if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey ||
            isInteractiveTarget(event.target)) {
            return;
        }

        var opensIntro = event.key === "ArrowDown" || event.key === "PageDown" ||
            ((event.key === " " || event.key === "Spacebar") && !event.shiftKey);
        var closesIntro = event.key === "ArrowUp" || event.key === "PageUp" ||
            ((event.key === " " || event.key === "Spacebar") && event.shiftKey);

        if (!opensIntro && !closesIntro) {
            return;
        }

        if (introAnimating && isIntroTransitionArea()) {
            event.preventDefault();
            return;
        }

        if (opensIntro && !introOpen && window.scrollY <= hero.offsetHeight * 0.65) {
            event.preventDefault();
            setIntroState(true);
        } else if (closesIntro && introOpen && isIntroTransitionArea()) {
            event.preventDefault();
            setIntroState(false);
        }
    }

    if (introCard && scrollCue && hero) {
        introCard.addEventListener("transitionend", function (event) {
            if (introAnimating && event.propertyName === "transform") {
                finishIntroTransition();
            }
        });

        scrollCue.addEventListener("click", function (event) {
            event.preventDefault();

            if (!introOpen && !introAnimating) {
                setIntroState(true);
            }
        });

        window.addEventListener("wheel", handleIntroWheel, { passive: false });
        document.addEventListener("keydown", handleIntroKeydown);
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

        if (introOpen && !introAnimating && window.scrollY <= 1) {
            setIntroState(false, { adjustScroll: false });
        } else if (!introOpen && !introAnimating && window.scrollY >= introScrollTarget) {
            setIntroState(true, { adjustScroll: false });
        }

        requestParallaxUpdate();
    }, { passive: true });

    window.addEventListener("resize", function () {
        measureIntroPosition();
        requestParallaxUpdate();
    });

    if (typeof reduceMotion.addEventListener === "function") {
        reduceMotion.addEventListener("change", function () {
            finishIntroTransition();
            measureIntroPosition();
            requestParallaxUpdate();
        });
    }

    updateHeader();
    initializeIntroState();
    updateParallax();
}());
