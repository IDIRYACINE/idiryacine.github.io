import { useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import styles from './cleave.module.css';

const LIFETIME = 500;

/**
 * Leaves a short crimson slash wherever the visitor clicks
 */
export function Cleave() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const handlePointerDown = event => {
      if (event.button !== 0) return;

      const cut = document.createElement('span');
      cut.className = styles.cut;
      cut.setAttribute('aria-hidden', 'true');
      cut.style.left = `${event.clientX}px`;
      cut.style.top = `${event.clientY}px`;
      cut.style.setProperty('--angle', `${-50 + Math.random() * 30}deg`);
      document.body.appendChild(cut);
      setTimeout(() => cut.remove(), LIFETIME);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [reduceMotion]);

  return null;
}
