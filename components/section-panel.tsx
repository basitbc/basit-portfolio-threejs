"use client"

import styles from "@/styles/panel.module.css"
import { profile } from "@/data/profile"
import { projects } from "@/data/projects"
import { skills } from "@/data/skills"
import type { UniverseSection } from "@/lib/three/universe-renderer"

type Props = {
  current: UniverseSection
}

export default function SectionPanel({ current }: Props) {
  return (
    <aside className={styles.panel} aria-live="polite">
      {current === "summary" && (
        <div>
          <h2 className={styles.h2}>Summary</h2>
          <p className={styles.p}>{profile.summary}</p>
          <div className={styles.meta}>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <span>•</span>
            <a href={profile.website} target="_blank" rel="noreferrer">Website</a>
            <span>•</span>
            <a href={`mailto:${profile.email}`}>Email</a>
          </div>
        </div>
      )}
      {current === "projects" && (
        <div>
          <h2 className={styles.h2}>Projects</h2>
          <ul className={styles.list}>
            {projects.slice(0, 3).map((p) => (
              <li key={p.name} className={styles.item}>
                <div className={styles.itemTitle}>{p.name}</div>
                <div className={styles.tags}>
                  {p.tech.slice(0, 5).map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {current === "skills" && (
        <div>
          <h2 className={styles.h2}>Skills</h2>
          <div className={styles.columns}>
            <div>
              <h3 className={styles.h3}>Languages</h3>
              <ul className={styles.bullets}>
                {skills.programmingLanguages.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className={styles.h3}>Frontend</h3>
              <ul className={styles.bullets}>
                {skills.frontend.slice(0, 8).map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className={styles.h3}>Backend</h3>
              <ul className={styles.bullets}>
                {skills.backend.slice(0, 8).map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
