// Red 4-point sparkle that sits above the hero heading (per the design).
// Color comes from --brand-red via currentColor.
export default function Sparkle() {
  return (
    <svg
      className="sparkle"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 0c.6 6.6 4.8 10.8 12 12-7.2 1.2-11.4 5.4-12 12-.6-6.6-4.8-10.8-12-12 7.2-1.2 11.4-5.4 12-12Z"
        fill="currentColor"
      />
    </svg>
  );
}
