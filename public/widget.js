(function () {
  var d = document;
  var w = window;

  var currentScript = d.currentScript || (function() {
    var scripts = d.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var tenantId = currentScript ? currentScript.getAttribute('data-tenant') : 'default-tenant';

  // Create floating launcher button
  var btn = d.createElement('div');
  btn.id = 'pr-agent-widget-btn';
  btn.innerHTML = '💬';
  btn.style.cssText = 'position:fixed;bottom:24px;left:24px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;box-shadow:0 8px 24px rgba(139,92,246,0.5);z-index:999999;transition:transform 0.2s;';

  btn.onmouseover = function() { btn.style.transform = 'scale(1.08)'; };
  btn.onmouseout = function() { btn.style.transform = 'scale(1)'; };

  // Create iframe container
  var frame = d.createElement('iframe');
  frame.id = 'pr-agent-widget-frame';
  frame.src = 'https://pr-agent.vercel.app/inbox?embed=true&tenant=' + encodeURIComponent(tenantId);
  frame.style.cssText = 'position:fixed;bottom:90px;left:24px;width:380px;height:580px;max-width:calc(100vw - 48px);max-height:calc(100vh - 120px);border:1px solid rgba(168,85,247,0.3);border-radius:24px;background:#0B0B0D;box-shadow:0 16px 40px rgba(0,0,0,0.8);z-index:999999;display:none;';

  btn.onclick = function() {
    var isHidden = frame.style.display === 'none';
    frame.style.display = isHidden ? 'block' : 'none';
  };

  d.body.appendChild(btn);
  d.body.appendChild(frame);
})();
