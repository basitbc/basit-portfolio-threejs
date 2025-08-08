export type Project = {
  name: string
  tech: string[]
  highlights: string[]
}

export const projects: Project[] = [
  {
    name: "AI CERTS365 - Blockchain Certificate Generation Platform",
    tech: ["Next.js", "Node.js", "Express.js", "MongoDB", "Blockchain", "Docker", "Nginx", "Azure"],
    highlights: [
      "Enterprise certificate generation for 50+ institutions, 100,000+ certificates",
      "Blockchain-backed authenticity via smart contracts",
      "REST APIs for generation/verification/management",
      "Containerized deployment with Docker",
      "CDN optimization reducing latency by 70% (GCC regions)",
    ],
  },
  {
    name: "Marvel Minds - AI-Powered Job Portal",
    tech: ["React.js", "Node.js", "MongoDB", "Elasticsearch", "Machine Learning", "Redux"],
    highlights: [
      "Connects 50,000+ job seekers with employers",
      "Sub-second search across 1M+ listings with Elasticsearch",
      "Recommendation engine improves match accuracy by 85%",
      "Responsive UI with Arabic/English support",
      "Secure payments generating AED 500K+ monthly revenue",
    ],
  },
  {
    name: "AI Audio and Avatar Video Generator",
    tech: ["React.js", "Node.js", "Python", "AWS Lambda", "WebRTC", "FFmpeg"],
    highlights: [
      "Voice synthesis, avatar animation, chatbot integration",
      "Serverless pipeline reduces costs by 60%",
      "Real-time processing for 1,000+ concurrent requests",
      "WebSockets dashboard with live progress and analytics",
    ],
  },
]
