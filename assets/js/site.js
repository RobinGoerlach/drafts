
(function(){
  document.querySelectorAll('[data-menu-toggle]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = document.getElementById(btn.getAttribute('data-menu-toggle'));
      if(!target) return;
      var open = target.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  document.querySelectorAll('[data-obfuscate]').forEach(function(node){
    var type = node.getAttribute('data-obfuscate');
    if(type === 'email') {
      var user = node.getAttribute('data-user') || '';
      var domain = node.getAttribute('data-domain') || '';
      var value = user + '@' + domain;
      var a = document.createElement('a');
      a.href = 'mailto:' + value;
      a.textContent = value;
      node.replaceChildren(a);
    }
    if(type === 'phone') {
      var parts = [
        node.getAttribute('data-p1') || '',
        node.getAttribute('data-p2') || '',
        node.getAttribute('data-p3') || ''
      ].filter(Boolean);
      var pretty = parts.join(' ');
      var digits = parts.join('');
      var a = document.createElement('a');
      a.href = 'tel:' + digits;
      a.textContent = pretty;
      node.replaceChildren(a);
    }
  });
})();
