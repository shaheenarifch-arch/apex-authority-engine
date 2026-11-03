import type { Article,SiteConfig,Topic } from "../../shared/src/types.js";
import slugify from "slugify";
import { z } from "zod";
// Talks to RAMBO's POST /v1/responses: either the BLACK gateway (black.getservices.ai, checks
// x-black-access) or the rambo-router API server (checks x-api-key). The same key goes in both
// headers. The gateway only accepts user/assistant messages and answers in markdown, so the
// instructions travel in the user message and the JSON is pulled out of the reply and validated.
const ArticleSchema=z.object({title:z.string().min(5),excerpt:z.string().min(10),markdown:z.string().min(200),faq:z.array(z.object({question:z.string().min(3),answer:z.string().min(3)})).default([]),keywords:z.array(z.string()).default([]),metaTitle:z.string().optional(),metaDescription:z.string().optional(),slug:z.string().optional()});
export function parseArticleJson(raw:unknown){let value:unknown=raw;if(typeof raw==="string"){const text=raw.replace(/```(?:json)?/gi,"");const a=text.indexOf("{"),b=text.lastIndexOf("}");if(a<0||b<=a)throw new Error("RAMBO_NO_JSON");value=JSON.parse(text.slice(a,b+1));}const parsed=ArticleSchema.safeParse(value);if(!parsed.success)throw new Error("RAMBO_BAD_ARTICLE");return parsed.data;}
export class RamboClient { constructor(private url:string,private key:string,private timeoutMs=120000){} async generate(site:SiteConfig,topic:Topic,brief:unknown,date:string):Promise<Article>{const prompt=`You are APEX, the editorial authority engine for GetServices.ai. Create a publication-ready article. Reply with ONLY one JSON object (no code fences, no text before or after) with these keys: title, excerpt, markdown, faq (array of {question, answer}), keywords (array of strings), metaTitle (max 60 characters), metaDescription (max 155 characters). Site: ${site.name}. Tone: ${site.tone}. Topic: ${topic.topic}. Brief: ${JSON.stringify(brief)}. Do not invent statistics, customers, endorsements, capabilities, or launch claims. Clearly label recommendations as recommendations.`;const r=await fetch(`${this.url.replace(/\/+$/,"")}/v1/responses`,{method:"POST",headers:{"content-type":"application/json","x-api-key":this.key,"x-black-access":this.key},body:JSON.stringify({applicationId:"apex",mode:"deep",taskType:"seo_content",output:{format:"json"},messages:[{role:"user",content:prompt}]}),signal:AbortSignal.timeout(this.timeoutMs)});if(!r.ok)throw new Error(`RAMBO_HTTP_${r.status}`);const body:any=await r.json();const a=parseArticleJson(body.output?.content??body);const title=a.title.trim();return {title,slug:a.slug??slugify(title,{lower:true,strict:true}),excerpt:a.excerpt.trim(),markdown:a.markdown,faq:a.faq,keywords:a.keywords,metaTitle:(a.metaTitle??title).slice(0,60),metaDescription:(a.metaDescription??a.excerpt).slice(0,155),siteId:site.id,date,topic};}}
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
