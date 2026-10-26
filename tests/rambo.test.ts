import{describe,it,expect,vi,afterEach}from"vitest";import{RamboClient,parseArticleJson}from"../packages/intelligence/src/index.js";
const site:any={id:"black",name:"BLACK",tone:"premium",focus:["executive AI"],cta:"Unlock BLACK"},topic:any={topic:"Executive AI decision support",cluster:"executive-ai",intent:"education"};
const article={title:"Executive AI Decision Support",excerpt:"How leaders can use AI to support decisions.",markdown:"# Executive AI\n\n"+"Body text. ".repeat(40),faq:[{question:"What is it?",answer:"An approach."}],keywords:["executive AI"],metaTitle:"Executive AI",metaDescription:"How leaders use AI."};
afterEach(()=>vi.unstubAllGlobals());
describe("RamboClient",()=>{
  it("sends the gateway contract and parses fenced JSON from a markdown answer",async()=>{
    const fetchMock=vi.fn(async()=>new Response(JSON.stringify({status:"completed",output:{type:"markdown",content:"Here you go:\n```json\n"+JSON.stringify(article)+"\n```"}}),{status:200}));
    vi.stubGlobal("fetch",fetchMock);
    const a=await new RamboClient("https://black.getservices.ai/","k1").generate(site,topic,{},"2026-10-26");
    const [url,init]:any=fetchMock.mock.calls[0];const body=JSON.parse(init.body);
    expect(url).toBe("https://black.getservices.ai/v1/responses");
    expect(init.headers["x-black-access"]).toBe("k1");expect(init.headers["x-api-key"]).toBe("k1");
    expect(body.messages.every((m:any)=>m.role==="user")).toBe(true);expect(body.taskType).toBe("seo_content");
    expect(a.slug).toBe("executive-ai-decision-support");expect(a.siteId).toBe("black");expect(a.faq).toHaveLength(1);
  });
  it("rejects HTTP errors and replies without a valid article",async()=>{
    vi.stubGlobal("fetch",vi.fn(async()=>new Response("{}",{status:401})));
    await expect(new RamboClient("https://x","k").generate(site,topic,{},"2026-10-26")).rejects.toThrow("RAMBO_HTTP_401");
    expect(()=>parseArticleJson("no json here")).toThrow("RAMBO_NO_JSON");
    expect(()=>parseArticleJson({title:"Hi"})).toThrow("RAMBO_BAD_ARTICLE");
  });
});
