(function(){
 var colors=["#2B3BFF","#FF4F8B","#1B1F3B","#0E9F6E","#2B3BFF","#1B1F3B","#FF4F8B","#0E9F6E","#1B1F3B","#2B3BFF","#0E9F6E","#FF4F8B"];
 var track=document.getElementById("track"),stage=document.getElementById("stage"),
     dots=document.getElementById("dots"),count=document.getElementById("count"),auto=document.getElementById("auto"),
     n=track.children.length,i=0,DELAY=5000,timer=null,
     userPaused=window.matchMedia("(prefers-reduced-motion: reduce)").matches,
     hover=false,focused=false,inView=true,moved=false;
 for(var k=0;k<n;k++){(function(k){var b=document.createElement("button");b.setAttribute("aria-label","Go to project "+(k+1));b.onclick=function(){go(k)};dots.appendChild(b)})(k)}
 function run(){
  clearInterval(timer);timer=null;
  if(!userPaused&&!hover&&!focused&&inView&&!document.hidden)timer=setInterval(function(){go(i+1)},DELAY);
  count.setAttribute("aria-live",timer?"off":"polite");
 }
 function paintAuto(){
  auto.setAttribute("aria-label",userPaused?"Play slideshow":"Pause slideshow");
  auto.innerHTML=userPaused?"&#9654;":"&#10074;&#10074;";
 }
 function go(x){
  i=(x+n)%n;
  track.style.transform="translateX(-"+i*100+"%)";
  stage.style.background=colors[i];
  count.textContent=(i+1)+" / "+n;
  Array.prototype.forEach.call(dots.children,function(d,j){d.setAttribute("aria-current",j===i)});
  run();
 }
 document.getElementById("prev").onclick=function(){go(i-1)};
 document.getElementById("next").onclick=function(){go(i+1)};
 auto.onclick=function(){userPaused=!userPaused;paintAuto();run()};
 stage.tabIndex=0;
 stage.addEventListener("keydown",function(e){if(e.key==="ArrowLeft")go(i-1);if(e.key==="ArrowRight")go(i+1)});
 stage.addEventListener("pointerenter",function(e){if(e.pointerType==="mouse"){hover=true;run()}});
 stage.addEventListener("pointerleave",function(e){if(e.pointerType==="mouse"){hover=false;run()}});
 stage.addEventListener("focusin",function(){focused=true;run()});
 stage.addEventListener("focusout",function(){focused=false;run()});
 document.addEventListener("visibilitychange",run);
 if("IntersectionObserver" in window)new IntersectionObserver(function(en){inView=en[0].isIntersecting;run()},{threshold:.25}).observe(stage);
 var sx=null;
 track.addEventListener("pointerdown",function(e){sx=e.clientX;moved=false});
 window.addEventListener("pointerup",function(e){if(sx===null)return;var d=e.clientX-sx;moved=Math.abs(d)>10;if(Math.abs(d)>50)go(d<0?i+1:i-1);sx=null});
 track.addEventListener("click",function(){if(!moved)go(i+1)});
 paintAuto();
 go(0);

 var play=document.getElementById("play"),sp=play.querySelectorAll("span"),f=[40,-60,90];
 function move(e){
  var r=play.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  for(var j=0;j<sp.length;j++)sp[j].style.transform="translate("+(x*f[j])+"px,"+(y*f[j])+"px)";
 }
 play.addEventListener("pointermove",move);
 play.addEventListener("pointerleave",function(){for(var j=0;j<sp.length;j++)sp[j].style.transform=""});

 document.getElementById("mail").onclick=function(){
  var b=this,t="hello@jeisaru.com";
  try{navigator.clipboard.writeText(t)}catch(e){}
  b.textContent="Copied: "+t;setTimeout(function(){b.textContent="Copy our email"},2500);
 };

 var ds=document.getElementById("darkSwitch");
 if(ds){
  var isDark=function(){var t=document.documentElement.getAttribute("data-theme");return t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches};
  var sync=function(){ds.setAttribute("aria-checked",String(isDark()))};
  ds.onclick=function(){
   var next=isDark()?"light":"dark";
   document.documentElement.setAttribute("data-theme",next);
   try{localStorage.setItem("theme",next)}catch(e){}
   sync();
  };
  sync();
 }

 var mb=document.getElementById("menuBtn"),nav=document.getElementById("nav");
 if(mb&&nav){
  var shut=function(){nav.classList.remove("open");mb.setAttribute("aria-expanded","false")};
  mb.onclick=function(e){e.stopPropagation();var o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",String(o))};
  nav.addEventListener("click",function(e){if(e.target.closest("a"))shut()});
  document.addEventListener("click",function(e){if(!nav.contains(e.target))shut()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")shut()});
 }
})();
