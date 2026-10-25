const crypto = require('node:crypto');
const sources = require('../data/sources.cjs');
const {qualitySignals}=require('./quality.cjs');
const STOP = new Set('this that with from have will what when where which their about into over after more could would should says said they them than your been being also amid here through first these those world news live'.split(' '));
function safeUrl(value) { try { const u=new URL(value); return ['https:','http:'].includes(u.protocol) && !u.username && !u.password ? u.href : null; } catch { return null; } }
function clean(value='') { return String(value).replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim(); }
function tokens(text) { return new Set((text.toLowerCase().match(/[a-z]{4,}/g)||[]).filter(t=>!STOP.has(t))); }
function normalize(item, source, fetchedAt=Date.now()) {
 const url=safeUrl(item.link); const title=clean(item.title); if(!url||!title)return null;
 const time=Date.parse(item.isoDate||item.pubDate||item.date||'');
 return {id:crypto.createHash('sha256').update(url).digest('hex').slice(0,20),title,url,sourceId:source.id,source:source.name,category:source.category,region:source.region,reach:source.reach,description:clean(item.contentSnippet||item.summary||item.description||'').slice(0,360),publishedAt:Number.isFinite(time)?time:null,fetchedAt};
}
const defaults={freshness:30,reach:20,buzz:15,frontier:20,learning:15};
function rankArticles(articles, weights=defaults, now=Date.now(), interests=[]) {
 const valid=articles.filter(a=>safeUrl(a.url)); const sets=valid.map(a=>tokens(a.title));
 // Token postings count only pairs that actually share words. Similarity is computed once.
 const postings=new Map(),overlap=Array.from({length:valid.length},()=>new Map());
 sets.forEach((set,i)=>{for(const word of set){const prior=postings.get(word)||[];for(const j of prior){overlap[i].set(j,(overlap[i].get(j)||0)+1);overlap[j].set(i,(overlap[j].get(i)||0)+1);}prior.push(i);postings.set(word,prior);}});
 const duplicateNeighbors=Array.from({length:valid.length},()=>[]),peerCounts=[];
 for(let i=0;i<valid.length;i++){const peers=new Set();for(const [j,shared] of overlap[i]){const ratio=shared/Math.max(1,Math.min(sets[i].size,sets[j].size));if(ratio>.65)duplicateNeighbors[i].push(j);if(valid[i].sourceId!==valid[j].sourceId&&shared>=3&&ratio>=.38)peers.add(valid[j].sourceId);}peerCounts[i]=peers.size;}

 const ranked=valid.map((a,i)=>{
  const age=a.publishedAt?(now-a.publishedAt)/3600000:null;
  const freshness=age===null||age< -1?20:Math.round(100*Math.exp(-Math.max(0,age)/(a.category==='学术'?168:60)));
  const buzz=Math.min(100,peerCounts[i]*20);
  const front=(a.title+' '+a.description).match(/\b(research|discover\w*|breakthrough|artificial intelligence|AI|quantum|robot\w*|climate|energy|trial|genom\w*|semiconductor\w*|space|innovation|technology|science)\b/gi)||[];
  const frontier=Math.min(100,(['科技','学术'].includes(a.category)?45:15)+new Set(front.map(s=>s.toLowerCase())).size*15);
  const learning=Math.min(100,40+(a.description.length>100?20:0)+(/\b(why|how|analysis|explained|essay|research|opinion)\b/i.test(a.title)?30:0)+(a.title.split(' ').length>=8?10:0));
  const metrics={freshness,reach:(a.reach||3)*20,buzz,frontier,learning};
  const sum=Object.keys(defaults).reduce((n,k)=>n+(Number(weights[k])||0),0)||1;
  const quality=qualitySignals(a);
  const baseScore=Math.round(Object.entries(metrics).reduce((n,[k,v])=>n+v*(Number(weights[k])||0),0)/sum);
  const score=Math.round(baseScore*.8+quality.score*.2);
  return {...a,_rankIndex:i,score,quality,metrics,peerCount:peerCounts[i],interest:interests.includes(a.category)?8:0};
 }).sort((a,b)=>(b.score+b.interest)-(a.score+a.interest));
 // Greedy diversity selection tracks topic overlap incrementally, preserving the same scoring rule.
 const result=[],used={},cats={},duplicated=new Uint8Array(valid.length);
 while(ranked.length){let best=0,score=-Infinity;for(let i=0;i<ranked.length;i++){const a=ranked[i];const candidate=a.score+a.interest-(used[a.sourceId]||0)*13-(cats[a.category]||0)*3-(duplicated[a._rankIndex]?16:0);if(candidate>score){score=candidate;best=i;}}const [a]=ranked.splice(best,1);for(const j of duplicateNeighbors[a._rankIndex])duplicated[j]=1;const {_rankIndex,...value}=a;result.push(value);used[a.sourceId]=(used[a.sourceId]||0)+1;cats[a.category]=(cats[a.category]||0)+1;}
 return result;
}
function mergeArticles(oldItems,newItems){const map=new Map();for(const a of [...oldItems,...newItems])if(a&&safeUrl(a.url))map.set(a.id,a);return [...map.values()].sort((a,b)=>(b.publishedAt||0)-(a.publishedAt||0)).slice(0,2500);}
function reviewCard(card,known,now=Date.now()){const level=known?Math.min((card.level||0)+1,6):0;return {...card,level,dueAt:now+(known?[1,1,3,7,14,30,60][level]*86400000:600000),reviewedAt:now};}
function csvCell(v){let s=String(v??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
module.exports={sources,defaults,safeUrl,clean,normalize,rankArticles,mergeArticles,reviewCard,csvCell};
