/* রূপালী — ইনস্টল করা অ্যাপের সাহায্যকারী (service worker)
   নেট থাকলে সবসময় সার্ভারের নতুন ফাইল (তাই আপডেট আটকে থাকে না); নেট না থাকলে শেষ দেখা কপি দিয়ে খোলে।
   Firebase বা অন্য সাইটের কিছুতে হাত দেয় না। */
const CACHE="rf-shell-v1";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin!==self.location.origin)return;
  const nav=r.mode==="navigate";
  if(!nav&&!/\.(png|json)$/.test(u.pathname))return;
  const key=nav?new Request(u.origin+u.pathname):r;
  e.respondWith(fetch(r).then(res=>{
    if(res&&res.ok){const c=res.clone();caches.open(CACHE).then(ca=>ca.put(key,c)).catch(()=>{})}
    return res;
  }).catch(()=>caches.match(key).then(m=>m||Response.error())));
});
