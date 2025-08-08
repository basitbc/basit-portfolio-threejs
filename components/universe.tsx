"use client"

import { useEffect, useRef } from "react"
import styles from "@/styles/universe.module.css"
import { initUniverse, type UniverseInstance, type UniverseSection } from "@/lib/three/universe-renderer"

type Props = {
  currentSection?: UniverseSection
  onSelectSection?: (block: "mern" | "blockchain" | "ai") => void
}

export default function Universe({ currentSection = "summary", onSelectSection }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<UniverseInstance | null>(null)
  const latestSectionRef = useRef<UniverseSection>(currentSection)
  const latestSelectRef = useRef<typeof onSelectSection | undefined>(onSelectSection)

  useEffect(() => {
    latestSectionRef.current = currentSection
    latestSelectRef.current = onSelectSection
  }, [currentSection, onSelectSection])

  useEffect(() => {
    if (!containerRef.current) return
    const instance = initUniverse(containerRef.current, (block) => {
      // Emit to parent; parent decides next section based on current
      latestSelectRef.current?.(block)
    })
    instanceRef.current = instance
    // initial focus
    instance.focus(currentSection)
    return () => {
      instance.destroy()
      instanceRef.current = null
    }
  }, [])

  useEffect(() => {
    instanceRef.current?.focus(currentSection)
  }, [currentSection])

  return <div className={styles.canvasWrap} ref={containerRef} role="region" aria-label="Floating Code Blocks Universe" />
}
