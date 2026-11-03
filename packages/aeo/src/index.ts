import type {Article,SiteConfig} from "../../shared/src/types.js";
export class AeoOptimizer { optimize(article:Article,site:SiteConfig):Article {const faq=article.faq.slice(0,8);const schema={"@context":"https://schema.org","@graph":[{"@type":"Article",headline:article.title,description:article.excerpt,datePublished:article.date,author:{"@type":"Organization",name:site.name}},...(faq.length?[{"@type":"FAQPage",mainEntity:faq.map(x=>({"@type":"Question",name:x.question,acceptedAnswer:{"@type":"Answer",text:x.answer}}))}]:[])]};const faqMd=faq.map(x=>`### ${x.question}

${x.answer}`).join("\n\n");return {...article,markdown:`${article.markdown}

## Frequently asked questions

${faqMd}

<script type="application/ld+json">
${JSON.stringify(schema,null,2)}
</script>`};}}
