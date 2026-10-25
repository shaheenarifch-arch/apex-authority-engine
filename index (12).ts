import type { SiteConfig, Topic } from "../../shared/src/types.js";
export class TopicPlanner {
  select(site:SiteConfig, topics:Topic[], date:string):Topic {
    const seed=[...`${site.id}-${date}`].reduce((n,c)=>n+c.charCodeAt(0),0);
    const relevant=topics.filter(t=>site.focus.some(f=>`${t.topic} ${t.cluster}`.toLowerCase().includes(f.split(" ")[0]!.toLowerCase())));
    const pool=relevant.length?relevant:topics;
    return pool[seed%pool.length]!;
  }
  brief(site:SiteConfig, topic:Topic){return {audience: site.id==="black"?"founders, executives and operators":"business and technology leaders", angle:`Explain ${topic.topic} through ${site.name}'s product perspective`, requiredSections:["Executive summary","The business problem","How the approach works","Practical use cases","Implementation considerations","Frequently asked questions"], exclusions:["unverified statistics","unsupported customer claims","competitor disparagement"]};}
}
