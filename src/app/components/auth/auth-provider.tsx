'use client'

import { ReactNode } from 'react'

/**
 * Auth.js Session Provider Wrapper (No longer needed for Better Auth but kept for structure)
 * @param children
 * @constructor
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
