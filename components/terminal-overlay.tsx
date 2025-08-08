"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import styles from "@/styles/terminal.module.css"
import { profile } from "@/data/profile"
import { projects } from "@/data/projects"
import { skills } from "@/data/skills"
import { experience } from "@/data/experience"
import { education } from "@/data/education"
import { languages } from "@/data/languages"
import type { UniverseSection } from "@/lib/three/universe-renderer"

function useTypewriter(lines: string[], speed = 10, pause = 520) {
  // faster typing (lower ms per char)
  const [output, setOutput] = useState<string[]>([])
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    let i = 0
    let j = 0
    let current = ""
    const out: string[] = []
    let typing: ReturnType<typeof setInterval> | null = null
    let blinking: ReturnType<typeof setInterval> | null = null

    function startBlink() {
      blinking = setInterval(() => setCursor((c) => !c), 500)
    }

    function typeNext() {
      if (i >= lines.length) {
        if (!blinking) startBlink()
        return
      }
      const line = lines[i]
      typing = setInterval(() => {
        current += line[j] || ""
        setOutput([...out, current])
        j++
        if (j > line.length) {
          clearInterval(typing!)
          typing = null
          out.push(current)
          current = ""
          j = 0
          setTimeout(() => {
            i++
            setOutput([...out])
            typeNext()
          }, pause)
        }
      }, speed)
    }

    typeNext()
    return () => {
      if (typing) clearInterval(typing)
      if (blinking) clearInterval(blinking)
    }
  }, [lines, speed, pause])

  return { output, cursor }
}

type Props = { current: UniverseSection }

export default function TerminalOverlay({ current }: Props) {
  const lines = useMemo(() => {
    switch (current) {
      case "summary": {
        return [
          `basit@universe:~$ whoami`,
          `Name: ${profile.name}`,
          `Title: ${profile.title}`,
          `Email: ${profile.email}`,
          `Phone: ${profile.phone}`,
          `Summary: ${profile.summary}`,
        ]
      }
      case "skills": {
        return [
          `basit@universe:~$ skills`,
          `Languages: ${skills.programmingLanguages.join(", ")}`,
          `Frontend: ${skills.frontend.join(", ")}`,
          `Backend: ${skills.backend.join(", ")}`,
          `Databases: ${skills.databases.join(", ")}`,
          `DevOps: ${skills.devops.join(", ")}`,
        ]
      }
      case "projects": {
        const list = projects.slice(0, 3).flatMap((p) => [
          `• ${p.name}`,
          `Tech: ${p.tech.slice(0, 8).join(", ")}`,
        ])
        return [`basit@universe:~$ projects --top`, ...list]
      }
      case "experience": {
        const list = experience.flatMap((e) => [
          `• ${e.company} — ${e.title} (${e.period})`,
          `  ${e.bullets[0]}`,
          `  ${e.bullets[1] ?? ""}`,
        ])
        return [`basit@universe:~$ experience`, ...list]
      }
      case "education": {
        const e = education[0]
        return [
          `basit@universe:~$ education`,
          `Institution: ${e.institution}`,
          `Degree: ${e.degree}`,
          `Period: ${e.period}`,
          `CGPA: ${e.cgpa}`,
          `Coursework: ${e.coursework.join(", ")}`,
        ]
      }
      case "languages": {
        return [`basit@universe:~$ languages`, `Proficiency: ${languages.join(", ")}`]
      }
      case "contact": {
        return [
          `basit@universe:~$ contact`,
          `Email: ${profile.email}`,
          `Phone: ${profile.phone}`,
          `GitHub: ${profile.github}`,
          `Website: ${profile.website}`,
        ]
      }
      default:
        return [`basit@universe:~$ echo "Hello"`]
    }
  }, [current])

  const { output, cursor } = useTypewriter(lines, 10, 480)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [output, current])

  const isSummary = current === "summary"

  return (
    <div className={`${styles.terminal} ${isSummary ? styles.large : ""}`} aria-live="polite">
      <div className={styles.header}>
        <div className={styles.dot} style={{ backgroundColor: "#ff5f56" }} />
        <div className={styles.dot} style={{ backgroundColor: "#ffbd2e" }} />
        <div className={styles.dot} style={{ backgroundColor: "#27c93f" }} />
        <div className={styles.title}>Floating Code Blocks Universe — {current}</div>
      </div>
      <div className={styles.body} ref={containerRef}>
        <div className={styles.bob}>
          <div className={styles.contentWrap}>
            <div className={styles.lines}>
              {output.map((line, idx) => (
                <Line key={idx} text={line} />
              ))}
              <div className={styles.line}>{cursor ? "▌" : " "}</div>
            </div>
            {isSummary ? (
              <div className={styles.portraitWrap}>
                <img
                  src="/images/portrait1.jpg"
                  alt="Portrait photograph"
                  className={styles.portrait}
                  loading="eager"
                  decoding="async"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function Line({ text }: { text: string }) {
  // classify for styling: command, bullet, key:value, title — value
  if (text.startsWith("basit@universe")) {
    const [cmd, ...rest] = text.split("$")
    return (
      <div className={`${styles.line} ${styles.cmdLine}`}>
        <span className={styles.cmd}>{cmd}$</span>
        <span className={styles.cmdValue}>{rest.join("$")}</span>
      </div>
    )
  }
  const trimmed = text.trim()
  if (trimmed.startsWith("•")) {
    return (
      <div className={`${styles.line} ${styles.bullet}`}>
        <span className={styles.bulletDot}>•</span>
        <span className={styles.value}>{trimmed.slice(1).trim()}</span>
      </div>
    )
  }
  const dash = text.indexOf(" — ")
  if (dash > -1) {
    return (
      <div className={styles.line}>
        <span className={styles.key}>{text.slice(0, dash).trim()}</span>
        <span className={styles.sep}> — </span>
        <span className={styles.value}>{text.slice(dash + 3).trim()}</span>
      </div>
    )
  }
  const col = text.indexOf(": ")
  if (col > -1) {
    return (
      <div className={styles.line}>
        <span className={styles.key}>{text.slice(0, col).trim()}</span>
        <span className={styles.sep}>: </span>
        <span className={styles.value}>{text.slice(col + 2)}</span>
      </div>
    )
  }
  return <div className={styles.line}>{text}</div>
}
