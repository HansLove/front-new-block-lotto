"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function ModalMyOwn({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed relavite inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
       
      <div
        ref={modalRef}
        className="max-h-[90vh] max-w-2xl overflow-auto rounded-lg  p-6 text-white shadow-xl sm:p-8"
      >
        {title && (
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

