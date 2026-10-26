import fs from "node:fs"; import path from "node:path";
export function ensureDir(dir:string){fs.mkdirSync(dir,{recursive:true});}
export function readJson<T>(file:string):T{return JSON.parse(fs.readFileSync(file,"utf8")) as T;}
export function writeJson(file:string,value:unknown){ensureDir(path.dirname(file));fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n");}
export function today(){return new Date().toISOString().slice(0,10);}
export function safeText(value:string){return value.replace(/[<>]/g,"").trim();}
