import { useEffect, useState } from 'react';
import styles from './domain-expansion.module.css';

const SEEN_KEY = 'domain-expanded';
const DURATION = 2800;
const SKIP_DURATION = 300;

// Runs in <head> before first paint so returning visitors never see the intro flash
export const domainExpansionScript = `try{if(sessionStorage.getItem('${SEEN_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.domain='skip'}catch(e){}`;

/**
 * Opening sequence styled after a Domain Expansion: the whole thing is CSS
 * animation so it plays from the prerendered HTML, React only removes it
 */
export function DomainExpansion() {
  const [state, setState] = useState('playing');

  useEffect(() => {
    if (document.documentElement.dataset.domain === 'skip') {
      setState('done');
      return;
    }

    try {
      sessionStorage.setItem(SEEN_KEY, 'true');
    } catch {
      // Without storage the intro simply plays again next visit
    }

    let timeout = setTimeout(() => setState('done'), DURATION);

    const skip = () => {
      clearTimeout(timeout);
      setState('skipping');
      timeout = setTimeout(() => setState('done'), SKIP_DURATION);
    };

    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    events.forEach(event => window.addEventListener(event, skip, { once: true }));

    return () => {
      clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, skip));
    };
  }, []);

  if (state === 'done') return null;

  return (
    <div className={styles.domain} data-state={state} aria-hidden>
      <div className={styles.panel} data-half="top" />
      <div className={styles.panel} data-half="bottom" />
      <div className={styles.content}>
        <div className={styles.ring} />
        <p className={styles.incantation}>領域展開</p>
        <p className={styles.name}>伏魔御廚子</p>
        <p className={styles.translation}>Malevolent Shrine</p>
      </div>
      <svg className={styles.slash} viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="-2" y1="66" x2="102" y2="34" />
      </svg>
    </div>
  );
}
