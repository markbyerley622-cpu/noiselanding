import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.2, 0.8, 0.2, 1] as const

/** Scroll-triggered fade-up. Wraps block content; reveals once when in view. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 26,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Container that staggers its Reveal children via index-based delay helper. */
export function stagger(i: number, base = 0.06) {
  return i * base
}
