function i(i){let e,t,a=i.length;for(;a;)t=Math.floor(Math.random()*a--),e=i[a],i[a]=i[t],i[t]=e;return i}var e={id:"randomized",handler:(e,{services:t})=>{const{ItemsService:a}=t;e.get("/:collection",(async(e,t)=>{var n;const r=new a(e.params.collection,{schema:e.schema,accountability:e.accountability});try{if(+(null==(n=e.sanitizedQuery)?void 0:n.limit)>0){const a=e.sanitizedQuery.limit,n=function(i,e){let t,a,n=i.length,r=Math.min(e,n);for(;r;)a=Math.floor(Math.random()*n--),t=i[n],i[n]=i[a],i[a]=t,r--;return i.slice(n)}(await r.readByQuery({...e.sanitizedQuery,limit:-1,fields:["id"]}),a).map((({id:i})=>i)),o=e.sanitizedQuery.filter?{_and:[{id:{_in:n}},e.sanitizedQuery.filter]}:{id:{_in:n}},l=await r.readByQuery({...e.sanitizedQuery,filter:o});t.json(i(l))}else{const a=await r.readByQuery(e.sanitizedQuery);t.json(i(a))}}catch(i){t.json(i)}}))}};export{e as default};
