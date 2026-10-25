const {rankArticles}=require('./core.cjs');
function createRankingCache(){let lastItems,lastKey,lastResult;return function(items,weights,now,interests){const key=JSON.stringify([weights,interests,Math.floor(now/60000)]);if(items!==lastItems||key!==lastKey){lastResult=rankArticles(items,weights,now,interests);lastItems=items;lastKey=key;}return lastResult;};}
module.exports={createRankingCache};
