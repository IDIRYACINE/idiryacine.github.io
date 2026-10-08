import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { useState } from 'react';
import styles from './section-intro.module.css';

/**
 * Section opener styled as an anime episode title card: an ink panel with the
 * episode number and kanji title, the English title set like a manga cover
 */
export function SectionIntro({
  id,
  sectionRef,
  visible: sectionVisible,
  episode,
  number,
  kanji,
  label,
  title,
  description,
}) {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.sectionIntro}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={sectionVisible || focused} timeout={0}>
        {({ visible, nodeRef }) => (
          <div className={styles.content} ref={nodeRef}>
            <div className={styles.card} data-visible={visible} aria-hidden>
              <span className={styles.episode}>{`第${episode}話`}</span>
              <span className={styles.kanji}>{kanji}</span>
            </div>
            <div className={styles.text}>
              <p className={styles.label} data-visible={visible}>
                {`Episode ${String(number).padStart(2, '0')}`}
                <span className={styles.labelName}>{label}</span>
              </p>
              <Heading
                level={2}
                as="h2"
                className={styles.title}
                data-visible={visible}
                id={titleId}
              >
                {title}
              </Heading>
              <Text className={styles.description} data-visible={visible} size="l" as="p">
                {description}
              </Text>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
}
