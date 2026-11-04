import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
export function Tooth({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="30"
      height="32"
      viewBox="0 0 32 36"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 5C5-1 0 6 4 17c2 6 2 15 6 15 3 0 2-13 6-13s3 13 6 13c4 0 4-9 6-15C32 6 27-1 16 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m13 4 8 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Reveal({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45 }}
    >
      {children}
    </motion.div>
  );
}
export function SectionHeading({
  tag,
  title,
  intro,
}: {
  tag: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{tag}</span>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}
