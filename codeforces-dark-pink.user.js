// ==UserScript==
// @name         Codeforces Dark Pink
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Tema oscuro rosa — sin blancos
// @author       Candy Camila uwu
// @match        https://codeforces.com/*
// @match        http://codeforces.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @resource     darkPinkCSS  https://raw.githubusercontent.com/TU-USUARIO/codeforces-dark-pink/main/styles.css
// ==/UserScript==

(function () {
  'use strict';

  // Inyecta el CSS desde el archivo separado
  GM_addStyle(GM_getResourceText('darkPinkCSS'));

  
  function overrideStyle(elm, prop, value) {
    elm.setAttribute('style', (elm.getAttribute('style') || '') + `; ${prop}: ${value} !important;`);
  }

  function waitFor(sel, fn) {
    const elms = document.querySelectorAll(sel);
    if (!elms.length) return setTimeout(waitFor, 100, sel, fn);
    elms.forEach(fn);
  }

  waitFor(
    '#pageContent div div h3 a, .comment-table.highlight-blue .right .ttypography p, .comment-table.highlight-blue .right .info',
    elm => {
      overrideStyle(elm, 'color', '#f0dce8');
      new MutationObserver(() => overrideStyle(elm, 'color', '#f0dce8'))
        .observe(elm, { attributes: true });
    }
  );

  waitFor('.datatable div:nth-child(5)', elm => elm.classList.add('dark'));

  waitFor('.unread td', elm => {
    elm.style.setProperty('background-color', '#1a0028', 'important');
  });

  (function fixGreenContrast() {
    if (document.readyState !== 'complete') return setTimeout(fixGreenContrast, 100);
    document.querySelectorAll('*').forEach(el => {
      if (getComputedStyle(el).color === 'rgb(0, 128, 0)')
        overrideStyle(el, 'color', '#a5d6a7');
    });
    document.querySelectorAll('font').forEach(el => {
      if (el.getAttribute('color') === 'red') el.setAttribute('color', '#ff80ab');
      if (el.getAttribute('color') === 'green') el.setAttribute('color', '#a5d6a7');
    });
  })();

  waitFor('.rtable span', elm => {
    if (elm.style && elm.style.color === 'rgb(0, 0, 0)')
      overrideStyle(elm, 'color', '#f0dce8');
  });

  (function fixInlineWhiteBGs() {
    if (document.readyState !== 'complete') return setTimeout(fixInlineWhiteBGs, 100);
    const whiteBGs = ['rgb(255, 255, 255)', 'rgb(240, 240, 240)', 'rgb(250, 250, 250)',
                      'rgb(245, 245, 245)', 'rgb(248, 248, 248)', '#fff', '#ffffff'];
    document.querySelectorAll('*').forEach(el => {
      const bg = el.style.backgroundColor;
      if (bg && (whiteBGs.includes(bg) || bg.startsWith('rgb(25') || bg === 'white')) {
        el.style.setProperty('background-color', '#1a0016', 'important');
      }
    });
  })();

  const bgObserver = new MutationObserver(mutations => {
    mutations.forEach(({ target }) => {
      const el = target;
      const bg = el.style?.backgroundColor;
      if (!bg) return;
      if (bg === 'rgb(255, 255, 255)' || bg === 'white' || bg === '#ffffff' || bg === '#fff') {
        el.style.setProperty('background-color', '#1a0016', 'important');
      }
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    bgObserver.observe(document.body, {
      subtree: true,
      attributeFilter: ['style', 'bgcolor']
    });
  });

  (function fixTestCaseLines() {
    const CLS = 'test-example-line';
    function applyBG(elm) {
      if (elm.style.cssText === '') return;
      if (!elm.style.cssText.includes('(30') && !elm.style.cssText.includes('#1e'))
        elm.style.cssText = 'background-color: rgb(30, 0, 24) !important;';
    }
    const obs = new MutationObserver(list =>
      list.forEach(m => { if (m.target.classList?.contains(CLS)) applyBG(m.target); })
    );
    waitFor('.' + CLS, () =>
      obs.observe(document.body, { subtree: true, attributeFilter: ['style'] })
    );
  })();

  waitFor('#editor', elm => {
    try {
      const monokaiCSS = GM_getResourceText('monokaiEditorTheme');
      GM_addStyle(monokaiCSS);
    } catch(e) {}
    const ACE = 'ace-chrome';
    elm.classList.remove(ACE);
    elm.classList.add('ace-monokai');
    setInterval(() => {
      if (elm.classList.contains(ACE)) elm.classList.remove(ACE);
    }, 10);
  });

  waitFor('.second-level-menu-list li.backLava', elm => {
    elm.style.backgroundImage =
      'url(https://github.com/GaurangTandon/codeforces-darktheme/raw/master/imgs/lava-right2.png)';
    if (elm.firstElementChild)
      elm.firstElementChild.style.backgroundImage =
        'url(https://github.com/GaurangTandon/codeforces-darktheme/raw/master/imgs/lava-left2.png)';
  });

  waitFor('body > h3', elm => {
    if (elm.innerText?.startsWith('The requested URL was not found'))
      document.body.classList.add('notfoundpage');
  });

})();