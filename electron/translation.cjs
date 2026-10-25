const crypto=require('node:crypto');
const PROVIDERS=['microsoft-web','microsoft','deepl','mymemory'];
function cacheKey(provider,text,context=''){return crypto.createHash('sha256').update(JSON.stringify([provider,text,context])).digest('hex');}
function buildRequest(provider,{text,context='',key='',region='',deeplPlan='free'}){
 if(provider==='microsoft'){if(!key)throw Error('请在偏好设置中填写 Microsoft Translator API 密钥，或选择无需密钥的微软官方网页。');return {url:'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=zh-Hans',options:{method:'POST',headers:{'Content-Type':'application/json','Ocp-Apim-Subscription-Key':key,...(region?{'Ocp-Apim-Subscription-Region':region}:{})},body:JSON.stringify([{Text:text}])}};}
 if(provider==='deepl'){if(!key)throw Error('请在偏好设置中填写 DeepL API 密钥。');return {url:`https://${deeplPlan==='pro'?'api':'api-free'}.deepl.com/v2/translate`,options:{method:'POST',headers:{'Content-Type':'application/json',Authorization:'DeepL-Auth-Key '+key},body:JSON.stringify({text:[text],source_lang:'EN',target_lang:'ZH-HANS',...(context?{context}:{}),preserve_formatting:true})}};}
 if(provider==='mymemory'){if(Buffer.byteLength(text,'utf8')>500)throw Error('备用免费服务每次最多 500 字节。请缩短选文或切换 Microsoft / DeepL。');return {url:'https://api.mymemory.translated.net/get?q='+encodeURIComponent(text)+'&langpair=en%7Czh-CN',options:{}};}
 throw Error('请选择 API 翻译服务后再使用内嵌译文。');
}
function parseResponse(provider,data){let text;if(provider==='microsoft')text=data?.[0]?.translations?.[0]?.text;if(provider==='deepl')text=data?.translations?.[0]?.text;if(provider==='mymemory'){if(Number(data.responseStatus)!==200||data.quotaFinished)throw Error(data.responseDetails||'备用翻译服务达到配额');text=data.responseData?.translatedText;}if(typeof text!=='string'||!text.trim())throw Error('翻译服务未返回有效译文');return {text,provider:({microsoft:'Microsoft Translator',deepl:'DeepL',mymemory:'MyMemory · 备用'})[provider],at:Date.now()};}
module.exports={PROVIDERS,cacheKey,buildRequest,parseResponse};
