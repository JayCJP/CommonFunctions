// max width 440px; 1rem = 10px;
!function(e, t) {
  var n = t.documentElement,
  d = e.devicePixelRatio || 1;
  var MAXW = 440;
  function i() {
	var w = n.offsetWidth;
    var e = w / 3.75;
    n.style.fontSize = e + "px"
	
    if (navigator.userAgent.indexOf('Window') >= 0) {
      n.style.fontSize = (MAXW / 3.75) + "px";
	  n.style.width = MAXW + "px";
	  n.style.margin = '0 auto';
	}
  }
  if (function e() {
    t.body ? t.body.style.fontSize = "14px": t.addEventListener("DOMContentLoaded", e)
  } (), i(), e.addEventListener("resize", i), e.addEventListener("pageshow",
  function(e) {
    e.persisted && i()
  }), 2 <= d) {
    var o = t.createElement("body"),
    a = t.createElement("div");
    a.style.border = ".5px solid transparent",
    o.appendChild(a),
    n.appendChild(o),
    1 === a.offsetHeight && n.classList.add("hairlines"),
    n.removeChild(o)
  }
}(window, document)