import matter from "gray-matter"; import type {Article,SiteConfig} from "../../shared/src/types.js";
export function serializeArticle(article:Article,site:SiteConfig,status="DRAFT"){return matter.stringify(article.markdown,{title:article.title,slug:article.slug,date:article.date,status,site:site.name,siteId:site.id,excerpt:article.excerpt,metaTitle:article.metaTitle,metaDescription:article.metaDescription,keywords:article.keywords,canonical:`${site.baseUrl}/blog/${article.slug}`});}
export function socialAssets(article:Article){return {linkedin:`${article.title}

${article.excerpt}

#AI #Automation #GetServicesAI`,x:`${article.title}

${article.excerpt.slice(0,180)}`,newsletter:{subject:article.title,intro:article.excerpt}};}
