import type { Article,SiteConfig,Topic } from "../../shared/src/types.js";
import slugify from "slugify";
export class RamboClient { constructor(private url:string,private key:string){} async generate(site:SiteConfig,topic:Topic,brief:unknown,date:string):Promise<Article>{const prompt=`Create a publication-ready article as JSON with title, excerpt, markdown, faq array, keywords array, metaTitle and metaDescription. Site: ${site.name}. Tone: ${site.tone}. Topic: ${topic.topic}. Brief: ${JSON.stringify(brief)}. Do not invent statistics, customers, endorsements, capabilities, or launch claims. Clearly label recommendations as recommendations.`;const r=await fetch(`${this.url}/v1/responses`,{method:"POST",headers:{"content-type":"application/json","x-api-key":this.key},body:JSON.stringify({applicationId:"apex",mode:"deep",taskType:"long_form_writing",output:{format:"json"},messages:[{role:"system",content:"You are APEX, the editorial authority engine for GetServices.ai."},{role:"user",content:prompt}]})});if(!r.ok)throw new Error(`RAMBO_HTTP_${r.status}`);const body:any=await r.json();const raw=body.output?.content??body;const parsed=typeof raw==="string"?JSON.parse(raw):raw;return {...parsed,slug:parsed.slug??slugify(parsed.title,{lower:true,strict:true}),siteId:site.id,date,topic};}}
export class LocalDraftGenerator { generate(site:SiteConfig,topic:Topic,_brief:unknown,date:string):Article {const title=`${topic.topic}: A Practical Guide from ${site.name}`;const slug=slugify(title,{lower:true,strict:true});const excerpt=`A practical overview of ${topic.topic} and how leaders can evaluate its role in modern operations.`;const markdown=`# ${title}

## Executive summary

${excerpt}

## The business problem

Organizations need clearer ways to connect AI initiatives with measurable operating goals. ${topic.topic} should be evaluated against reliability, governance, cost, and business value.

## How the approach works

${site.name} frames this topic around ${site.focus.join(", ")}. The recommended approach is to begin with a controlled workflow, define approvals, maintain audit records, and measure outcomes before expanding automation.

## Practical use cases

- Reduce repetitive operating work.
- Improve access to structured business intelligence.
- Standardize repeatable workflows.
- Create reusable knowledge assets.

## Implementation considerations

Start in draft or approval mode. Protect credentials, validate source data, log changes, and avoid unsupported claims.

## Conclusion

${site.cta}.`;
return {title,slug,excerpt,markdown,faq:[{question:`What is ${topic.topic}?`,answer:`${topic.topic} is an approach organizations can evaluate for improving AI-enabled workflows and decision support.`},{question:"How should teams start?",answer:"Begin with one controlled use case, define approval and audit requirements, and measure results before expanding."}],keywords:[topic.cluster,...site.focus],metaTitle:title.slice(0,60),metaDescription:excerpt.slice(0,155),siteId:site.id,date,topic};}}
