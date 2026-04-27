"use strict";(()=>{var e={};e.id=911,e.ids=[911],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},1539:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>u,requestAsyncStorage:()=>d,routeModule:()=>l,serverHooks:()=>g,staticGenerationAsyncStorage:()=>p});var n=r(9303),s=r(8716),o=r(670),i=r(5797),c=e([i]);i=(c.then?(await c)():c)[0];let l=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/admin/ingestion/route",pathname:"/api/admin/ingestion",filename:"route",bundlePath:"app/api/admin/ingestion/route"},resolvedPagePath:"c:\\Users\\MickH\\Downloads\\ws\\scholarship-api\\service-ingestion\\src\\app\\api\\admin\\ingestion\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:d,staticGenerationAsyncStorage:p,serverHooks:g}=l,h="/api/admin/ingestion/route";function u(){return(0,o.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:p})}a()}catch(e){a(e)}})},5797:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{GET:()=>i});var n=r(7070),s=r(581),o=e([s]);let c=new(s=(o.then?(await o)():o)[0]).l;async function i(e){let t=e.headers.get("authorization");if(!t)return n.NextResponse.json({error:"Unauthorized",code:401},{status:401});try{if(!(await fetch(`${process.env.AUTH_SERVICE_URL||"http://localhost:3001"}/api/verify-admin`,{headers:{authorization:t}})).ok)return n.NextResponse.json({error:"Unauthorized",code:401},{status:401});let e=await c.getLatestLog();return n.NextResponse.json({data:e})}catch(e){return console.error("Error in ingestion status:",e),n.NextResponse.json({error:"Server Error",code:500},{status:500})}}a()}catch(e){a(e)}})},5748:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.d(t,{Z:()=>o});var n=r(8678),s=e([n]);let o=new(n=(s.then?(await s)():s)[0]).Pool({connectionString:process.env.DATABASE_URL});a()}catch(e){a(e)}})},581:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.d(t,{l:()=>o});var n=r(5748),s=e([n]);n=(s.then?(await s)():s)[0];class o{async createLog(e){return(await n.Z.query(`
      INSERT INTO ingestion_logs (source, status, started_at)
      VALUES ($1, 'running', NOW())
      RETURNING id
    `,[e])).rows[0].id}async updateLog(e,t,r=0,a=null){await n.Z.query(`
      UPDATE ingestion_logs
      SET status = $1, count_new = $2, error_msg = $3, finished_at = NOW()
      WHERE id = $4
    `,[t,r,a,e])}async saveScholarships(e){let t=0;for(let r of e)try{let e=await n.Z.query(`
          SELECT id FROM scholarships
          WHERE name = $1 AND source = $2
        `,[r.name,r.source]);0===e.rows.length&&(await n.Z.query(`
            INSERT INTO scholarships (name, level, field, country, deadline, amount, currency, url, source, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `,[r.name,r.level,r.field,r.country,r.deadline,r.amount,r.currency,r.url,r.source,r.description]),t++)}catch(e){console.error("Error saving scholarship:",r.name,e)}return t}async getLatestLog(){return(await n.Z.query(`
      SELECT * FROM ingestion_logs
      ORDER BY started_at DESC
      LIMIT 1
    `)).rows[0]||null}async getLogs(e=1,t=20){let[r,a]=await Promise.all([n.Z.query(`
        SELECT * FROM ingestion_logs
        ORDER BY started_at DESC
        LIMIT $1 OFFSET $2
      `,[t,(e-1)*t]),n.Z.query("SELECT COUNT(*) FROM ingestion_logs")]);return{logs:r.rows,total:parseInt(a.rows[0].count)}}}a()}catch(e){a(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[276,972],()=>r(1539));module.exports=a})();