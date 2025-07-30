// ==UserScript==
// @name         Typing Race Auto-Typer After First Word (70 WPM)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Starts auto-typing after first word manually typed at ~70 WPM
// @author       Malusi
// @match        https://10fastfingers.com/*
// @match        https://www.keybr.com/*
// @match        https://www.typing.com/*
// @match        https://monkeytype.com/*
// @match        https://typelit.io/*
// @match        https://www.nitrotype.com/*
// @match        https://zty.pe/*
// @match        https://typingtest.com/*
// @match        https://www.typing.academy/*
// @match        https://www.typingclub.com/*
// @match        https://somewheretypingtest.com/test*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let manualStart = false;
    let startedTyping = false;

    // 🌐 Site-specific selectors
    function getCurrentWordElement() {
        // Add site-specific logic if needed
        return document.querySelector("span[data-current='true']") || document.querySelector(".highlight");
    }

    function getTextarea() {
        return document.querySelector("textarea.notranslate[placeholder='Start typing...']") ||
               document.querySelector("input[type='text']") ||
               document.querySelector("textarea") ||
               document.querySelector(".input") ||
               document.querySelector("input");
    }

    function simulateTyping(textarea, word) {
        textarea.focus();
        textarea.setRangeText(word + ' ', textarea.selectionStart, textarea.selectionEnd, 'end');
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function monitorManualTyping() {
        const inputBox = getTextarea();
        if (!inputBox) return;

        inputBox.addEventListener("input", () => {
            const typed = inputBox.value.trim();
            if (!startedTyping && typed.length > 0) {
                startedTyping = true;
                setTimeout(() => {
                    manualStart = true;
                }, 300); // slight delay to allow timer to kick in properly
            }
        });
    }

    function startAutoTypingLoop() {
        setInterval(() => {
            if (!manualStart) return;

            const currentWordEl = getCurrentWordElement();
            const inputBox = getTextarea();

            if (currentWordEl && inputBox) {
                const word = currentWordEl.textContent.trim();
                simulateTyping(inputBox, word);
            }
        }, 860); // ~70 WPM
    }

    // 🧠 Wait until page is ready
    window.addEventListener('load', () => {
        const waitUntilReady = setInterval(() => {
            if (getTextarea() && getCurrentWordElement()) {
                clearInterval(waitUntilReady);
                monitorManualTyping();
                startAutoTypingLoop();
            }
        }, 100);
    });
})();