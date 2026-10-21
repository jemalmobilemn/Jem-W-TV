"use strict";

/* የተሻሻለ እትም:
   - ቻናሎችን በማስታወስ 2050 ተደጋግመው አይፈጠሩም፤ iptv-org playlists ጫንተው እውነተኛ stream URL ይወስዳል።
   - hls.js ከጠፋ በራስ-ሰር ይጨመራል።
   - CORS/timeout ሲከሰት proxy fallback ይሞክራል።
   ማስታወሻ: DRM/RTMP/RTSP/አገር-ተከልካይ ስትሪሞች በአሳሽ ሊከፈቱ አይችሉም። */

const i18n = {
  am: { appTitle:"📺 IPTV ቀጥታ ስርጭት", searchPlaceholder:"ቻናል ፈልግ...", allCategories:"ሁሉም ምድቦች", categoryNews:"ዜና", categorySports:"ስፖርት", categoryEntertainment:"መዝናኛ", homeBtn:"🏠 ቤት", settingsBtn:"⚙️ ቅንብሮች", defaultChannelTitle:"ምንም የተመረጠ ቻናል የለም", statusReady:"● ዝግጁ", statusLoading:"● በመጫን ላይ...", statusLive:"● LIVE", statusWaiting:"● በመጠበቅ ላይ...", statusError:"● ስህተት", statusNotSupported:"● አይደገፍም", msgChooseChannel:"ቻናል ይምረጡ...", msgLoading:"ስርጭቱ በመጫን ላይ ነው።", msgPlayPress:"ለመጀመር በቪዲዮው ላይ ▶ ይጫኑ።", msgLive:"ስርጭቱ በቀጥታ እየተጫወተ ነው።", msgWaiting:"ኔትወርክ እየጠበቀ ነው...", msgNoResults:"ምንም ቻናል አልተገኘም።", msgNotSupported:"ይህ አሳሽ ወይም ስትሪም አይደገፍም።", msgAllFailed:"ሁሉም ሙከራዎች አልተሳኩም። ሌላ ቻናል ይምረጡ።", msgSelectFirst:"መጀመሪያ ቻናል ይምረጡ።", msgVlcOpened:"በVLC ለመክፈት የሚሞክር...", msgLoadingChannels:"ቻናሎችን በመጫን ላይ...", showingFirst:"የመጀመሪያዎቹ 150 ውጤቶች ከ", showingRest:"ውጤቶች ውስጥ። ለልዩ ቻናል ፈልግ ይጠቀሙ።", channelsCount:"ቻናሎች", settingsTitle:"⚙️ ቅንብሮች", settingsDarkMode:"ጨለማ ሁነታ", settingsDarkModeDesc:"የገጹን ቀለም ወደ ጨለማ ይቀይሩ", settingsLanguage:"ቋንቋ", settingsLanguageDesc:"የገጹን ቋንቋ ይምረጡ", settingsAutoplay:"ራስ-ሰር ማጫወት", settingsAutoplayDesc:"ገጹ ሲከፈት የመጀመሪያው ቻናል ይጫወት", settingsLowData:"ዝቅተኛ ውሂብ", settingsLowDataDesc:"ጥራቱን በመቀነስ ዳታ ይቆጥቡ", settingsVLC:"🎬 በVLC ክፈት", settingsVLCDesc:"የአሁኑን ቻናል በVLC ይክፈቱ", settingsDefaultCategory:"ነባሪ ምድብ", settingsDefaultCategoryDesc:"ሲከፈት የሚታየው ምድብ", settingsAll:"ሁሉም", backBtn:"⬅️ ወደ ቻናሎች ተመለስ", liveStream:"የቀጥታ ስርጭት", vlcButton:"🎬 በVLC ክፈት" },
  en: { appTitle:"📺 IPTV Live", searchPlaceholder:"Search channels...", allCategories:"All Categories", categoryNews:"News", categorySports:"Sports", categoryEntertainment:"Entertainment", homeBtn:"🏠 Home", settingsBtn:"⚙️ Settings", defaultChannelTitle:"No channel selected", statusReady:"● Ready", statusLoading:"● Loading...", statusLive:"● LIVE", statusWaiting:"● Waiting...", statusError:"● Error", statusNotSupported:"● Not Supported", msgChooseChannel:"Choose a channel...", msgLoading:"Stream is loading.", msgPlayPress:"Press ▶ on the video to start.", msgLive:"Stream is playing live.", msgWaiting:"Waiting for network...", msgNoResults:"No channels found.", msgNotSupported:"This browser/stream is not supported.", msgAllFailed:"All attempts failed. Choose another channel.", msgSelectFirst:"Please select a channel first.", msgVlcOpened:"Trying to open in VLC...", msgLoadingChannels:"Loading channels...", showingFirst:"Showing first 150 of", showingRest:"results. Use search for specific channels.", channelsCount:"channels", settingsTitle:"⚙️ Settings", settingsDarkMode:"Dark Mode", settingsDarkModeDesc:"Switch the page to dark colors", settingsLanguage:"Language", settingsLanguageDesc:"Choose page language", settingsAutoplay:"Autoplay", settingsAutoplayDesc:"Play first channel automatically", settingsLowData:"Low Data Mode", settingsLowDataDesc:"Reduce quality to save data", settingsVLC:"🎬 Open in VLC", settingsVLCDesc:"Open current channel in VLC", settingsDefaultCategory:"Default Category", settingsDefaultCategoryDesc:"Category shown on load", settingsAll:"All", backBtn:"⬅️ Back to Channels", liveStream:"Live Stream", vlcButton:"🎬 Open in VLC" }
};

const FALLBACK_STREAMS = [
  { name:"Al Jazeera English", country:"Qatar", category:"NEWS", url:"https://live-hls-web-aje.getaj.net/AJE/index.m3u8", alt:["https://d1cy85syyhvqz5.cloudfront.net/v1/master/7b67fbda7ab859400a821e9aa0deda20ab7ca3d2/aljazeeraLive/AJE/index.m3u8"] },
  { name:"DW English", country:"Germany", category:"NEWS", url:"https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", alt:[] },
  { name:"France 24 English", country:"France", category:"NEWS", url:"https://live.france24.com/hls/live/2037222/F24_EN_HI_HLS/master.m3u8", alt:[] },
  { name:"TRT World", country:"Turkey", category:"NEWS", url:"https://trtworldlive.medya.trt.com.tr/master.m3u8", alt:[] },
  { name:"EDGEsport", country:"Global", category:"SPORTS", url:"https://edgesports-plex.amagi.tv/playlist.m3u8", alt:[] },
  { name:"NASA TV", country:"USA", category:"ENTERTAINMENT", url:"https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8", alt:[] }
];

const SOURCES = [
  { url:"https://iptv-org.github.io/iptv/categories/sports.m3u", cat:"SPORTS" },
  { url:"https://iptv-org.github.io/iptv/categories/news.m3u", cat:"NEWS" },
  { url:"https://iptv-org.github.io/iptv/categories/entertainment.m3u", cat:"ENTERTAINMENT" },
  { url:"https://iptv-org.github.io/iptv/countries/et.m3u", cat:"" },
  { url:"https://iptv-org.github.io/iptv/index.m3u", cat:"" }
];
const PROXIES = [u=>u, u=>"https://corsproxy.io/?url="+encodeURIComponent(u), u=>"https://api.allorigins.win/raw?url="+encodeURIComponent(u)];
const MAX_CHANNELS = 5000, DISPLAY_LIMIT = 150, HLS_CDN = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";

const $ = id => document.getElementById(id);
const player=$("tv-player"), playlist=$("channels-playlist"), searchInput=$("search-input"), categoryFilter=$("category-filter"), channelCount=$("channel-count"), playingTitle=$("playing-title"), playingCategory=$("playing-category"), playingCode=$("playing-code"), playerStatus=$("player-status"), playerMessage=$("player-message");
if(!player || !playlist || !searchInput || !categoryFilter) throw new Error("Missing HTML IDs");

let tvChannels=[], id=1, hls=null, activeChannel=null, currentActiveId=null, userGestured=false, hlsLoader=null;
const settings={darkMode:true, autoplay:true, lowData:false, defaultCategory:"all", language:"am"};
const t=k=>(i18n[settings.language]&&i18n[settings.language][k])||i18n.en[k]||k;

function loadSettings(){ try{Object.assign(settings, JSON.parse(localStorage.getItem("iptv-settings")||"{}"));}catch(e){}
  $("toggle-dark")?.classList.toggle("active", settings.darkMode); $("toggle-autoplay")?.classList.toggle("active", settings.autoplay); $("toggle-lowdata")?.classList.toggle("active", settings.lowData);
  if($("default-category")) $("default-category").value=settings.defaultCategory; if($("language-select")) $("language-select").value=settings.language;
  document.documentElement.dataset.theme=settings.darkMode?"dark":"light"; document.documentElement.lang=settings.language; }
function saveSettings(){ try{localStorage.setItem("iptv-settings", JSON.stringify(settings));}catch(e){} }
function setStatus(k){ playerStatus.dataset.statusKey=k; playerStatus.textContent=t(k); }
function setMessage(k){ playerMessage.dataset.msgKey=k; playerMessage.textContent=t(k); playerMessage.style.display="block"; }
function updateCount(){ const n=getFiltered().length.toLocaleString(); channelCount.textContent=`${n} ${t("channelsCount")}`; }
function applyLanguage(){ document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n)); document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));
  document.title=t("appTitle").replace("📺 ",""); const at=$("app-title"); if(at) at.textContent=t("appTitle");
  if(!activeChannel){ playingTitle.textContent=t("defaultChannelTitle"); setStatus("statusReady"); setMessage("msgChooseChannel"); }
  updateCount(); renderPlaylist(); }

function clean(u){ u=String(u||"").trim().replace(/^vlc:\/\//i,""); if(u.startsWith("//")) u="https:"+u; return u; }
function playable(u){ u=clean(u).toLowerCase(); return /^https?:\/\//.test(u) && !/rtmp:|rtsp:|mms:|mmsh:|\.mpd($|\?)|youtube\.com|youtu\.be|facebook\.com|tiktok\.com/.test(u); }
async function fetchText(url, ms=18000){ const c=new AbortController(); const timer=setTimeout(()=>c.abort(), ms); try{const r=await fetch(url,{signal:c.signal,cache:"no-store"}); if(!r.ok) throw new Error("HTTP "+r.status); return await r.text();} finally{clearTimeout(timer);} }
function attrs(line){ const out={}; const re=/([\w-]+)="([^"]*)"/g; let m; while((m=re.exec(line))) out[m[1]]=m[2]; return out; }
function mapCat(g){ g=String(g||"").toLowerCase(); if(/sport|football|soccer|nba|nfl|boxing|ufc|cricket|tennis|racing/.test(g)) return "SPORTS"; if(/news|current|business|weather|politic/.test(g)) return "NEWS"; return "ENTERTAINMENT"; }
function parseM3U(text, forceCat){ const lines=String(text).split(/\r?\n/), out=[]; let a=null; for(let raw of lines){ const line=raw.trim(); if(!line) continue;
  if(line.startsWith("#EXTINF:")){ const i=line.lastIndexOf(","); a=attrs(line.slice(0,i)); a.__name=i>-1?line.slice(i+1).trim():(a["tvg-id"]||"Channel"); if(forceCat) a["group-title"]=forceCat; continue; }
  if(line.startsWith("#EXTGRP:")&&a){ a["group-title"]=line.slice(8).trim(); if(forceCat) a["group-title"]=forceCat; continue; }
  if(line.startsWith("#")) continue; const u=clean(line); if(!playable(u)){a=null;continue;} out.push({name:a.__name||"Channel", logo:a["tvg-logo"]||"", group:a["group-title"]||forceCat||"", tvgId:a["tvg-id"]||"", url:u, alt:[]}); a=null; } return out; }
async function loadOne(src){ const txt=await fetchText(src.url); const list=parseM3U(txt, src.cat); if(!list.length) throw new Error("empty"); return list; }
async function loadChannels(){ setStatus("statusLoading"); setMessage("msgLoadingChannels"); const res=await Promise.allSettled(SOURCES.map(loadOne)); let rows=res.filter(r=>r.status==="fulfilled").flatMap(r=>r.value);
  if(!rows.length) rows=FALLBACK_STREAMS.map(s=>({name:s.name,country:s.country,category:s.category,url:s.url,alt:s.alt,group:s.category,logo:"",tvgId:""}));
  const seen=new Set(); tvChannels=[]; for(const r of rows){ const u=clean(r.url); if(!playable(u)) continue; const key=(r.name+"|"+u).toLowerCase(); if(seen.has(key)) continue; seen.add(key);
    tvChannels.push({id:id++, code:(r.tvgId||r.name||"CH").replace(/[^a-z0-9]/gi,"").slice(0,4).toUpperCase()||("CH"+id), name:String(r.name||"Channel").trim(), country:r.country||(/ \(([^)]+)\)$/.exec(r.group||"")?.[1]||"International"), category:mapCat(r.group||r.category), group:r.group||"", logo:r.logo||"", streamUrl:u, altUrls:(r.alt||[]).map(clean).filter(playable)}); if(tvChannels.length>=MAX_CHANNELS) break; }
  updateCount(); }

function getFiltered(){ const q=searchInput.value.trim().toLowerCase(), cat=categoryFilter.value; return tvChannels.filter(c=>((c.name+" "+c.country+" "+c.code+" "+c.group).toLowerCase().includes(q))&&(cat==="all"||c.category===cat)); }
function catLabel(c){ return c==="SPORTS"?t("categorySports"):c==="NEWS"?t("categoryNews"):t("categoryEntertainment"); }
function renderPlaylist(){ const data=getFiltered(); playlist.replaceChildren(); channelCount.textContent=`${data.length.toLocaleString()} ${t("channelsCount")}`; if(!data.length){const p=document.createElement("p");p.className="player-message";p.textContent=t("msgNoResults");playlist.appendChild(p);return;}
  const frag=document.createDocumentFragment(); data.slice(0,DISPLAY_LIMIT).forEach(c=>{ const b=document.createElement("button"); b.type="button"; b.className="playlist-item"+(c.id===currentActiveId?" active":""); b.title=c.streamUrl;
    const code=document.createElement("span"); code.className="playlist-code"; code.textContent=c.code.slice(0,4);
    const info=document.createElement("span"); info.className="playlist-text"; const strong=document.createElement("strong"); strong.textContent=c.name; const small=document.createElement("small"); small.textContent=`${c.country} • ${catLabel(c.category)}`; info.append(strong,small);
    const icon=document.createElement("span"); icon.className="play-icon"; icon.textContent="▶"; b.append(code,info,icon); b.onclick=()=>playChannel(c); frag.appendChild(b); });
  playlist.appendChild(frag); if(data.length>DISPLAY_LIMIT){const d=document.createElement("div");d.style.cssText="text-align:center;padding:10px;color:var(--muted);font-size:12px";d.textContent=`${t("showingFirst")} ${data.length.toLocaleString()} ${t("showingRest")}`;playlist.appendChild(d);} }

function stopPlayer(){ if(hls){try{hls.destroy();}catch(e){} hls=null;} try{player.pause(); player.removeAttribute("src"); player.load();}catch(e){} }
function noGesture(e){ return e&&(e.name==="NotAllowedError"||/user gesture|notallowed|play\(\) failed/i.test(String(e.message||e))); }
function netErr(e){ return e&&(e.kind==="network"||/timeout|network|http|failed to fetch|manifestload|levelload|fragload|cors/i.test(String(e.message||e))); }
function hlsAvailable(){ if(window.Hls&&Hls.isSupported()) return Promise.resolve("hls"); if(player.canPlayType("application/vnd.apple.mpegurl")) return Promise.resolve("native");
  hlsLoader ||= new Promise((ok,no)=>{const s=document.createElement("script");s.src=HLS_CDN;s.async=true;const timer=setTimeout(()=>no(new Error("hls timeout")),10000);s.onload=()=>{clearTimeout(timer); (window.Hls&&Hls.isSupported())?ok("hls"):no(new Error("hls unsupported"));};s.onerror=()=>{clearTimeout(timer);no(new Error("hjs load failed"));};document.head.appendChild(s);}); hlsLoader.catch(()=>{hlsLoader=null;}); return hlsLoader; }
function nativePlay(url){ return new Promise((ok,no)=>{let done=false; const end=(f,a)=>{if(done)return;done=true;clearTimeout(tm);player.removeEventListener("error",bad);f(a);}; const bad=()=>end(no,Object.assign(new Error("native error"),{kind:"network"})); const tm=setTimeout(()=>end(no,new Error("timeout")),16000); player.addEventListener("error",bad); player.src=url; player.load(); player.play().then(()=>end(ok)).catch(e=>noGesture(e)?end(ok):end(no,e)); }); }
function hlsPlay(url){ return new Promise((ok,no)=>{ if(hls){try{hls.destroy();}catch(e){}hls=null;} let done=false, rec=false; const end=(f,a)=>{if(done)return;done=true;clearTimeout(tm);try{hls&&hls.off(Hls.Events.ERROR,onErr);}catch(e){}f(a);};
  const tm=setTimeout(()=>end(no,new Error("timeout")),20000); const onErr=(ev,d)=>{ if(!d||!d.fatal)return; const e=new Error(d.details||"fatal"); if(d.type===Hls.ErrorTypes.NETWORK_ERROR)e.kind="network"; if(d.type===Hls.ErrorTypes.MEDIA_ERROR&&!rec){rec=true;try{hls.recoverMediaError();return;}catch(e){}} try{hls.destroy();}catch(e){} hls=null; end(no,e); };
  try{ hls=new Hls({enableWorker:true,lowLatencyMode:true,maxBufferLength:settings.lowData?10:30,startLevel:settings.lowData?0:-1,manifestLoadingTimeOut:12000,manifestLoadingMaxRetry:1,levelLoadingTimeOut:12000,levelLoadingMaxRetry:1,fragLoadingTimeOut:20000,fragLoadingMaxRetry:2,xhrSetup:x=>x.withCredentials=false}); hls.on(Hls.Events.ERROR,onErr); hls.on(Hls.Events.MANIFEST_PARSED,()=>player.play().then(()=>end(ok)).catch(e=>noGesture(e)?end(ok):end(no,e))); hls.loadSource(url); hls.attachMedia(player);}catch(e){end(no,e);} }); }
function tryUrl(u){ u=clean(u); if(!playable(u)) return Promise.reject(new Error("unsupported")); return hlsAvailable().then(mode=>{ player.muted=settings.autoplay&&!userGestured; return mode==="native"?nativePlay(u):hlsPlay(u); }); }
function candidates(c){ const list=[]; const add=u=>{u=clean(u); if(playable(u)&&!list.includes(u))list.push(u);}; add(c.streamUrl); (c.altUrls||[]).forEach(add); const out=[]; for(const u of list){ for(const p of PROXIES){ const x=p(u); if(x.length<1800&&!out.includes(x)) out.push(x); } } return out.slice(0,9); }
async function playChannel(c){ activeChannel=c; currentActiveId=c.id; playingTitle.textContent=c.name; playingCategory.textContent=`${c.country} • ${catLabel(c.category)}`; playingCode.textContent=c.code.slice(0,4); setStatus("statusLoading"); setMessage("msgLoading"); stopPlayer(); renderPlaylist(); toggleVlc(true);
  const urls=candidates(c); let last=null; for(const u of urls){ try{ await tryUrl(u); return; }catch(e){ last=e; console.warn("fail",u,e); if(!netErr(e)&&!/unsupported/i.test(String(e.message))) break; } }
  if(last&&/unsupported|hls|DASH/i.test(String(last.message||last))){setStatus("statusNotSupported");setMessage("msgNotSupported");} else {setStatus("statusError");setMessage("msgAllFailed");} }
function toggleVlc(show){ const b=$("vlc-btn"); if(b)b.style.display=show?"inline-block":"none"; }
function openVlc(){ if(!activeChannel)return setMessage("msgSelectFirst"); const a=document.createElement("a"); a.href="vlc://"+clean(activeChannel.streamUrl); a.style.display="none"; document.body.appendChild(a); a.click(); a.remove(); setMessage("msgVlcOpened"); }

player.addEventListener("playing",()=>{setStatus("statusLive"); if(player.muted&&!userGestured)setMessage("msgPlayPress"); else {setMessage("msgLive"); playerMessage.style.display="none";}});
player.addEventListener("waiting",()=>{setStatus("statusWaiting");setMessage("msgWaiting");});
player.addEventListener("error",()=>{ if(!activeChannel)return; setStatus("statusError"); setMessage("msgAllFailed"); });
window.addEventListener("pointerdown",()=>{userGestured=true; try{player.muted=false;}catch(e){}},{passive:true});
searchInput.addEventListener("input",renderPlaylist); categoryFilter.addEventListener("change",renderPlaylist);
$("retry-btn")?.addEventListener("click",()=>activeChannel?playChannel(activeChannel):setMessage("msgSelectFirst"));
$("settings-btn")?.addEventListener("click",()=>{$("tv-view").hidden=true;$("settings-view").hidden=false;$("settings-btn").classList.add("active");$("home-btn").classList.remove("active");});
function showTV(){$("settings-view").hidden=true;$("tv-view").hidden=false;$("settings-btn").classList.remove("active");$("home-btn").classList.add("active");}
$("back-btn")?.addEventListener("click",showTV); $("home-btn")?.addEventListener("click",showTV);
$("toggle-dark")?.addEventListener("click",()=>{settings.darkMode=!settings.darkMode;$("toggle-dark").classList.toggle("active",settings.darkMode);document.documentElement.dataset.theme=settings.darkMode?"dark":"light";saveSettings();});
$("toggle-autoplay")?.addEventListener("click",()=>{settings.autoplay=!settings.autoplay;$("toggle-autoplay").classList.toggle("active",settings.autoplay);saveSettings();});
$("toggle-lowdata")?.addEventListener("click",()=>{settings.lowData=!settings.lowData;$("toggle-lowdata").classList.toggle("active",settings.lowData);saveSettings();if(activeChannel)playChannel(activeChannel);});
$("default-category")?.addEventListener("change",e=>{settings.defaultCategory=e.target.value;categoryFilter.value=e.target.value;renderPlaylist();saveSettings();});
$("language-select")?.addEventListener("change",e=>{settings.language=e.target.value;document.documentElement.lang=settings.language;applyLanguage();saveSettings();});
$("vlc-btn")?.addEventListener("click",openVlc);

loadSettings(); categoryFilter.value=settings.defaultCategory; applyLanguage();
(async()=>{ try{ await loadChannels(); applyLanguage(); if(settings.autoplay&&tvChannels.length) playChannel(tvChannels[0]); }catch(e){ console.error(e); setStatus("statusError"); setMessage("msgAllFailed"); } })();
