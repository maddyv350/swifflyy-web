import { useEffect, useState } from 'react';

interface WordCyclerProps {
  words: readonly string[];
  /** ms each word stays. */
  interval?: number;
  animate?: boolean;
  className?: string;
}

/**
 * Cycles through `words` in place with a quick flip, underlined in coral.
 * When `animate` is false it just shows the first word.
 */
export function WordCycler({ words, interval = 1900, animate = true, className = '' }: WordCyclerProps) {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => {
      setOut(true);
      const t = setTimeout(() => {
        setI((p) => (p + 1) % words.length);
        setOut(false);
      }, 280);
      return () => clearTimeout(t);
    }, interval);
    return () => clearInterval(id);
  }, [animate, interval, words.length]);

  return (
    <span className={`relative inline-block align-bottom ${className}`}>
      <span
        className="inline-block text-accent transition-all duration-300"
        style={{
          opacity: out ? 0 : 1,
          transform: out ? 'translateY(-0.35em) rotate(-3deg)' : 'translateY(0) rotate(0)',
        }}
      >
        {words[i]}
      </span>
    </span>
  );
}
