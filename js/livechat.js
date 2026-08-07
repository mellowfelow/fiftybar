/* =========================================================
   FIFTY BAR VAPE — JivoChat Live Chat
   Widget: xi0da3nAiQ | Position: bottom-left
   ========================================================= */
(function() {
  /* Load JivoChat widget */
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = '//code.jivosite.com/widget/xi0da3nAiQ';
  document.head.appendChild(s);

  /* Force bottom-left position via CSS override */
  /* JivoChat injects its button into #jivo_custom_widget or .jivo_animate */
  var style = document.createElement('style');
  style.textContent = [
    'jdiv, #jivo_custom_widget, .jvLauncher, .__jivoMobileButton {',
    '  left: 20px !important;',
    '  right: auto !important;',
    '}',
    /* Mobile */
    '@media(max-width:768px){',
    '  jdiv, #jivo_custom_widget, .jvLauncher, .__jivoMobileButton {',
    '    left: 12px !important;',
    '    right: auto !important;',
    '    bottom: 16px !important;',
    '  }',
    '}'
  ].join('');
  document.head.appendChild(style);
})();
