function qualitySignals(a){const text=(a.title+' '+(a.description||'')).toLowerCase(),reasons=[];let score=45;
 if(/\b(why|how|analysis|explained|investigation|essay|in.depth|what .+ means)\b/.test(text)){score+=18;reasons.push('含解释、分析或调查信号');}
 if(/\b(study|research|evidence|data|survey|trial|report|peer.review|scientists)\b/.test(text)){score+=15;reasons.push('摘要出现研究或数据证据信号');}
 if(/\b(climate|health|economy|education|energy|housing|inequality|democracy|policy|trade|artificial intelligence|public|society|war)\b/.test(text)){score+=12;reasons.push('具有公共议题关联');}
 if(/\b(may|might|uncertain|limits|limitations|suggest|risk|however|although)\b/.test(text)){score+=7;reasons.push('摘要包含不确定性或边界表述');}
 if((a.description||'').length>=160){score+=6;reasons.push('摘要信息较充足');}
 if(/\b(live updates?|liveblog|watch live|breaking|minute.by.minute)\b/.test(a.title.toLowerCase())){score-=22;reasons.push('滚动快讯精读降权');}
 if(/\b(you won't believe|shocking|must.see|deals|coupon|buy now)\b/.test(text)){score-=25;reasons.push('促销或吸睛措辞降权');}
 if(a.sourceId==='arxiv'){score-=12;reasons.push('预印本，同行评审状态未核验');}
 if(!reasons.length)reasons.push('标题与摘要不足以判断全文深度');score=Math.max(0,Math.min(100,score));return {score,reasons,label:score>=80?'优先精读':score>=65?'值得深入':'拓展阅读',basis:'标题与摘要启发式信号，非全文事实核查'};
}
module.exports={qualitySignals};
