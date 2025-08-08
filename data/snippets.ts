import { profile } from "./profile"
import { skills } from "./skills"
import { projects } from "./projects"

export type Snippet = {
  id: string
  title: string
  code: string
}

export type StackKey = "mern" | "blockchain" | "ai"

function asConst<T extends string>(v: T) { return v }

const topLangs = skills.programmingLanguages.slice(0, 4).map(s => s.split(" ")[0])
const topFE = skills.frontend.slice(0, 3)
const topBE = skills.backend.slice(0, 3)

export const snippets: Snippet[] = [
  {
    id: asConst("intro"),
    title: "whoami.ts",
    code: `const developer = {
  name: "${profile.name}",
  title: "${profile.title}",
  email: "${profile.email}",
  github: "${profile.github}",
  website: "${profile.website}",
  yearsOfExperience: 4 +,
};`,
  },
  {
    id: asConst("skills-core"),
    title: "skills/core.ts",
    code: `export const languages = ${JSON.stringify(topLangs)};
export const frontend = ${JSON.stringify(topFE)};
export const backend = ${JSON.stringify(topBE)};`,
  },
  {
    id: asConst("api-microservices"),
    title: "arch/microservices.ts",
    code: `import { Service, Gateway } from "micro"
const services = ["auth", "jobs", "payments", "notifications"]
const gateway = new Gateway({ rateLimit: "1k/rps", jwt: true })
services.forEach((name) => new Service(name).mount(gateway))`,
  },
  {
    id: asConst("db-optimization"),
    title: "db/optimization.ts",
    code: `// MongoDB aggregation & indexes
db.jobs.createIndex({ title: "text", skills: 1, location: 1 })
db.jobs.aggregate([
  { $match: { status: "active" } },
  { $sort: { createdAt: -1 } },
  { $limit: 20 }
])`,
  },
  {
    id: asConst("project-cert"),
    title: "projects/ai-certs365.ts",
    code: `// Tamper-proof certificates via smart contracts
type Cert = { id: string; hash: string; owner: string }
function verify(cert: Cert) { return blockchain.verify(cert.hash) }`,
  },
  {
    id: asConst("project-marvel"),
    title: "projects/marvel-minds.ts",
    code: `// Elasticsearch powered search
const results = await es.search({ index: "jobs", q: "react developer dubai" })`,
  },
  {
    id: asConst("devops-cicd"),
    title: "devops/cicd.ts",
    code: `pipeline("deploy")
  .use(docker())
  .use(tests({ coverage: 90 }))
  .use(kubernetes({ replicas: 3 }))`,
  },
  {
    id: asConst("realtime"),
    title: "realtime/socket.ts",
    code: `io.on("connection", (s) => {
  s.join("updates")
  s.emit("hello", { ok: true })
  s.on("progress", (p) => s.to("updates").emit("progress", p))
})`,
  },
  {
    id: asConst("serverless"),
    title: "serverless/video.ts",
    code: `export const handler = async (evt) => {
  const job = await encodeVideo(evt.input, { preset: "fast" })
  return { id: job.id, status: job.status }
}`,
  },
  {
    id: asConst("clean-arch"),
    title: "architecture/clean.ts",
    code: `// Ports & Adapters
interface UseCase<I, O> { execute(input: I): Promise<O> }
class CreateUser implements UseCase<Input, Output> { /* ... */ }`,
  },
  {
    id: asConst("stack-mern"),
    title: "stack/mern.ts",
    code: `import express from "express"
import mongoose from "mongoose"

const app = express()
app.get("/api/health", (_, res) => res.json({ ok: true }))

await mongoose.connect("mongodb://localhost:27017/app")
app.listen(3000, () => console.log("MERN up on :3000"))`,
  },
  {
    id: asConst("stack-blockchain"),
    title: "stack/blockchain.sol",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certs {
  mapping(bytes32 => address) public ownerOf;
  function issue(bytes32 hash) public { ownerOf[hash] = msg.sender; }
  function verify(bytes32 hash) public view returns (bool) { return ownerOf[hash] != address(0); }
}`,
  },
  {
    id: asConst("stack-ai"),
    title: "stack/ai.ts",
    code: `import * as tf from "@tensorflow/tfjs"
const model = await tf.loadLayersModel("/model.json")
const pred = model.predict(tf.tensor([/* features */])) as tf.Tensor
console.log("Prediction:", await pred.data())`,
  },
  ...projects.slice(0, 3).map((p, i) => ({
    id: `proj-${i}`,
    title: `highlights/${p.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ts`,
    code: p.highlights.map(h => `// ${h}`).join("\n"),
  })),
]

function findById(id: string) {
  const s = snippets.find((x) => x.id === id)
  if (!s) {
    return { title: id, code: "// snippet not found" }
  }
  return { title: s.title, code: s.code }
}

export const stackSnippets: Record<StackKey, { title: string; code: string }> = {
  mern: findById("stack-mern"),
  blockchain: findById("stack-blockchain"),
  ai: findById("stack-ai"),
}
