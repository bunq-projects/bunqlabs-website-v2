"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";

type StepId = "name" | "email" | "description";

interface Step {
  id: StepId;
  question: string;
  placeholder: string;
  type: "text" | "email";
  multiline?: boolean;
  autoComplete: string;
  validate: (value: string) => string | null; // error message, or null if ok
}

// Add/reorder steps here — the indicator, navigation and submit all derive
// from this array, so the flow scales without touching the component.
const STEPS: Step[] = [
  {
    id: "name",
    question: "What's your name?",
    placeholder: "Jane Doe",
    type: "text",
    autoComplete: "name",
    validate: (v) => (v.trim().length < 2 ? "Please enter your name." : null),
  },
  {
    id: "email",
    question: "What's your email?",
    placeholder: "jane@studio.com",
    type: "email",
    autoComplete: "email",
    validate: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? null
        : "Enter a valid email address.",
  },
  {
    id: "description",
    question: "Tell us about your project.",
    placeholder: "What are you building, and how can we help?",
    type: "text",
    multiline: true,
    autoComplete: "off",
    validate: (v) =>
      v.trim().length < 10 ? "A little more detail, please." : null,
  },
];

type Answers = Record<StepId, string>;
const EMPTY_ANSWERS: Answers = { name: "", email: "", description: "" };

export default function ContactModal() {
  const open = useAppStore((s) => s.contactOpen);
  const close = useAppStore((s) => s.closeContact);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // Fresh start each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setStep(0);
    setAnswers(EMPTY_ANSWERS);
    setError(null);
    setSubmitted(false);
  }, [open]);

  // Focus the field on open and on every step change.
  useEffect(() => {
    if (!open || submitted) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [open, step, submitted]);

  // Escape to close + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  if (!open) return null;

  const value = answers[current.id];

  const handleChange = (v: string) => {
    setAnswers((a) => ({ ...a, [current.id]: v }));
    if (error) setError(null);
  };

  const submit = (final: Answers) => {
    // Static export has no server. Wire this to an external endpoint when
    // ready — e.g. POST to Formspree / Resend / a serverless function:
    //   await fetch("https://formspree.io/f/XX': { method:'POST', body... })
    console.log("Contact submission:", final);
    setSubmitted(true);
  };

  const goNext = () => {
    const err = current.validate(value);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    if (isLast) submit(answers);
    else setStep((s) => s + 1);
  };

  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    // Single-line steps: Enter advances. Multiline: Enter is a newline, so
    // require ⌘/Ctrl+Enter to advance/submit.
    if (!current.multiline || e.metaKey || e.ctrlKey) {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <div
      className="contact-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Contact"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <button
        type="button"
        className="contact-close"
        onClick={close}
        aria-label="Close"
      >
        <CloseIcon />
      </button>

      <div className="contact-content">
        {submitted ? (
          <div className="contact-done">
            <p className="contact-eyebrow">Message sent</p>
            <h2 className="contact-question">Thanks — we&apos;ll be in touch.</h2>
            <button type="button" className="contact-submit" onClick={close}>
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Steps — above the question */}
            <ol className="contact-steps">
              {STEPS.map((s, i) => (
                <li
                  key={s.id}
                  className={
                    i === step ? "is-active" : i < step ? "is-done" : ""
                  }
                  aria-current={i === step ? "step" : undefined}
                >
                  {String(i + 1).padStart(2, "0")}
                </li>
              ))}
            </ol>

            {/* Question — above the input */}
            <h2 className="contact-question">{current.question}</h2>

            {current.multiline ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                className="contact-input"
                rows={3}
                value={value}
                placeholder={current.placeholder}
                autoComplete={current.autoComplete}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                className="contact-input"
                type={current.type}
                value={value}
                placeholder={current.placeholder}
                autoComplete={current.autoComplete}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            )}

            <div className="contact-error" role="alert">
              {error ?? ""}
            </div>

            <div className="contact-actions">
              {step > 0 && (
                <button
                  type="button"
                  className="contact-back"
                  onClick={goBack}
                >
                  Back
                </button>
              )}
              <button
                type="button"
                className="contact-submit"
                onClick={goNext}
              >
                {isLast ? "Send" : "Next"}
              </button>
            </div>

            <p className="contact-hint">
              {current.multiline
                ? "Press ⌘ / Ctrl + Enter to send"
                : "Press Enter to continue"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
