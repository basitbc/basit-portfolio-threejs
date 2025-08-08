import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Basit Bilal Channa | Full Stack Developer',
  description: 'Results-driven Full Stack MERN Developer with 5+ years building scalable web applications using React.js, Node.js, Express.js, and MongoDB. Expertise in microservices architecture and cloud deployment.',
  keywords: [
    'Full Stack Developer',
    'MERN Stack',
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'JavaScript',
    'TypeScript',
    'Next.js',
    'Microservices',
    'AWS',
    'Docker',
    'Kubernetes'
  ],
  authors: [{ name: 'Basit Bilal Channa' }],
  creator: 'Basit Bilal Channa',
  publisher: 'Basit Bilal Channa',
  openGraph: {
    title: 'Basit Bilal Channa | Full Stack Developer',
    description: 'Experienced Full Stack MERN Developer specializing in scalable web applications and microservices architecture.',
    url: 'https://basit.tech',
    siteName: 'Basit Channa Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Basit Bilal Channa | Full Stack Developer',
    description: 'Full Stack MERN Developer with 5+ years of experience in building scalable applications.',
    creator: '@basitchanna',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" bbai-tooltip-injected="true">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body style={{ fontFamily: GeistSans.style.fontFamily }}>
        {children}
      </body>
    </html>
  )
}
