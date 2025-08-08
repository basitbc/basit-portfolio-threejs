export type Experience = {
  company: string
  title: string
  period: string
  bullets: string[]
}

export const experience: Experience[] = [
  {
    company: "NetCom Learning",
    title: "Full Stack Developer",
    period: "Jan 2024 – Present",
    bullets: [
      "Architected scalable MERN solutions serving 100k+ users, achieving 99.9% uptime.",
      "Led cross-functional team of 8; +30% productivity and 50% faster sprints.",
      "Optimized React/Node/Mongo for 40% faster loads and +25% user retention.",
      "RESTful APIs (50k+ daily) with JWT, rate limiting, robust error handling.",
      "CI/CD with Docker and automated testing; 3x faster zero-downtime deploys.",
    ],
  },
  {
    company: "Widski Technologies",
    title: "SDE-II",
    period: "May 2023 – Jan 2024",
    bullets: [
      "Migrated monolith to microservices; developed 50+ RESTful APIs.",
      "Next.js SSR: +60% SEO and Core Web Vitals 95+.",
      "Realtime features for 10k+ users with WebSockets/Socket.io.",
      "MongoDB indexing/aggregations cut queries from 2.5s to 300ms.",
    ],
  },
  {
    company: "Red Stag Labs",
    title: "Software Developer",
    period: "Jan 2021 – May 2023",
    bullets: [
      "Delivered 20+ MERN apps across e‑commerce, fintech, healthcare.",
      "Responsive React with Redux; Lighthouse 95+.",
      "Node backends for 100k+ daily API calls; Redis caching 70% faster.",
      "Docker + Kubernetes ensuring HA across multiple regions.",
    ],
  },
]
