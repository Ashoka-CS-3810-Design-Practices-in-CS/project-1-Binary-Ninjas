"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

const FAQS = [
  {
    q: "What is DS Visualizer?",
    a: "DS Visualizer is a tool that helps you understand data structures and algorithms by showing how they work step by step.",
  },
  {
    q: "How do I start a visualization?",
    a: "Pick a data structure from the sidebar. Then use the controls on the page to insert, delete, search, or run the algorithm.",
  },
  {
    q: "Can I control the animation speed?",
    a: "Yes. Use the speed control on each visualizer to slow down or speed up the animation, or step through it manually.",
  },
  {
    q: "Which data structures are supported?",
    a: "All the ones listed in the sidebar. New visualizers are added regularly, so check back often.",
  },
  {
    q: "I found a bug or have a suggestion. What should I do?",
    a: "Please reach out to the Binary Ninjas team with the details and we'll look into it.",
  },
]

export default function FAQ() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => setMounted(true), [])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  if (!mounted) return null

  return createPortal(
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open FAQ"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span aria-hidden="true">❓</span>
        FAQ
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-title"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-background text-foreground shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 id="faq-title" className="text-lg font-bold">
                Frequently Asked Questions
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close FAQ"
                className="rounded-md px-2 py-1 text-xl leading-none text-muted-foreground hover:bg-muted"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-2">
              {FAQS.map((item, i) => {
                const isOpen = openIndex === i
                return (
                  <div key={item.q} className="border-b last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold"
                    >
                      {item.q}
                      <span
                        aria-hidden="true"
                        className={`shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </button>
                    {isOpen && (
                      <p className="pb-4 text-sm leading-6 text-muted-foreground">
                        {item.a}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  )
}