export type SiteId = "getservices" | "black" | "studio" | "atlas" | "relay";
export type WorkflowStatus = "DRAFT" | "APPROVED" | "PUBLISHED" | "FAILED";
export interface SiteConfig { id: SiteId; name: string; baseUrl: string; contentDir: string; focus: string[]; tone: string; cta: string; }
export interface Topic { topic: string; cluster: string; intent: string; }
export interface Article { title: string; slug: string; excerpt: string; markdown: string; faq: Array<{question:string;answer:string}>; keywords: string[]; metaTitle: string; metaDescription: string; siteId: SiteId; date: string; topic: Topic; }
export interface ManifestItem { siteId: SiteId; file: string; title: string; slug: string; status: WorkflowStatus; generatedAt: string; publishedAt?: string; publicationUrl?: string; error?: string; }
