"use client"

import { useState, useCallback } from "react"
import Universe from "@/components/universe"
import MenuOverlay from "@/components/menu-overlay"
import TerminalOverlay from "@/components/terminal-overlay"
import styles from "@/styles/page.module.css"
import type { UniverseSection } from "@/lib/three/universe-renderer"

export default function Page() {
  const [section, setSection] = useState<UniverseSection>("summary")

  const handleBlockSelect = useCallback((block: "mern" | "blockchain" | "ai") => {
    setSection((curr) => {
      switch (block) {
        case "mern":
          return curr === "summary" ? "experience" : "summary"
        case "blockchain":
          return curr === "projects" ? "education" : "projects"
        case "ai":
          return curr === "skills" ? "languages" : "skills"
        default:
          return curr
      }
    })
  }, [])

  return (
    <main className={styles.main}>
      <Universe currentSection={section} onSelectSection={handleBlockSelect} />
      <MenuOverlay current={section} onSelect={setSection} />
      <TerminalOverlay current={section} />
    </main>
  )
}
