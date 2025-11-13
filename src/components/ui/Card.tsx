import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`border rounded-lg p-4 shadow-md ${className}`}>
      {children}
    </div>
  )
}