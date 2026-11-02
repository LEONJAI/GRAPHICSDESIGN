(function(){
 var colors=["#2B3BFF","#FF4F8B","#1B1F3B","#0E9F6E"];
 var track=document.getElementById("track"),stage=document.getElementById("stage"),
     dots=document.getElementById("dots"),count=document.getElementById("count"),
     n=track.children.length,i=0;
 for(var k=0;k<n;k++){(function(k){var b=document.createElement("button");b.setAttribute("aria-label","Go to project "+(k+1));b.onclick=function(){go(k)};dots.appendChild(b)})(k)}
 function go(x){
  i=(x+n)%n;
  track.style.transform="translateX(-"+i*100+"%)";
  stage.style.background=colors[i];
  count.textContent=(i+1)+" / "+n;
  Array.prototype.forEach.call(dots.children,function(d,j){d.setAttribute("aria-current",j===i)});
 }
 document.getElementById("prev").onclick=function(){go(i-1)};
 document.getElementById("next").onclick=function(){go(i+1)};
 stage.tabIndex=0;
 stage.addEventListener("keydown",function(e){if(e.key==="ArrowLeft")go(i-1);if(e.key==="ArrowRight")go(i+1)});
 var sx=null;
 track.addEventListener("pointerdown",function(e){sx=e.clientX});
 window.addEventListener("pointerup",function(e){if(sx===null)return;var d=e.clientX-sx;if(Math.abs(d)>50)go(d<0?i+1:i-1);sx=null});
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
})();
