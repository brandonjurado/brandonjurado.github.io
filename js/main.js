// generic fade

var el = document.getElementById("fade");

function fadeIn(el) {
  el.style.opacity = 0;

  var tick = function() {
    el.style.opacity = +el.style.opacity + 0.01;
    
    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
    }
  };

  tick();
}

fadeIn(el);

// list fade

var count = $('li').length;
var start = 0;

function sequence(){
  $('li').eq(start).fadeIn(900,function(){
    start++;

    if(start<count) sequence();
  });
}

sequence();
