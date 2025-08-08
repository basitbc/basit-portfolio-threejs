"use client"

import styles from "@/styles/menu.module.css"
import { User, BriefcaseBusiness, Boxes, Code2, GraduationCap, LanguagesIcon, AtSign } from 'lucide-react'
import type { UniverseSection } from "@/lib/three/universe-renderer"

type Props = {
  current: UniverseSection
  onSelect: (s: UniverseSection) => void
}

const items: { key: UniverseSection; label: string; Icon: React.FC<any> }[] = [
  { key: "summary", label: "Summary", Icon: User },
  { key: "projects", label: "Projects", Icon: Boxes },
  { key: "skills", label: "Skills", Icon: Code2 },
  { key: "experience", label: "Experience", Icon: BriefcaseBusiness },
  { key: "education", label: "Education", Icon: GraduationCap },
  { key: "languages", label: "Languages", Icon: LanguagesIcon },
  { key: "contact", label: "Contact", Icon: AtSign },
]

export default function MenuOverlay({ current, onSelect }: Props) {
  return (
    <nav className={styles.menu} aria-label="Sections">
      <div className={styles.group} role="tablist" aria-orientation="horizontal">
        {items.map(({ key, label, Icon }) => (
          <button
            key={key}
            role="tab"
            aria-selected={current === key}
            className={`${styles.tab} ${current === key ? styles.active : ""}`}
            onClick={() => onSelect(key)}
            title={label}
          >
            <Icon className={styles.icon} aria-hidden="true" />
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
