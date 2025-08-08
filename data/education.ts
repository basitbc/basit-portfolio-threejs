export type Education = {
  institution: string
  degree: string
  period: string
  cgpa: string
  coursework: string[]
}

export const education: Education[] = [
  {
    institution: "University of Mumbai",
    degree: "Bachelor of Engineering",
    period: "Aug 2019",
    cgpa: "7.79/10",
    coursework: [
      "Mathematical Principles",
      "Calculus & Linear Algebra",
      "Data Analysis & Interpretation",
    ],
  },
]
