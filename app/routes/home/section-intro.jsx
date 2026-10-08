import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { useState } from 'react';
import styles from './section-intro.module.css';

export function SectionIntro({ id, sectionRef, visible: sectionVisible, label, title, description }) {
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
            <div aria-hidden className={styles.tag}>
              <Divider
                notchWidth="64px"
                notchHeight="8px"
                collapsed={!visible}
                collapseDelay={600}
              />
              <span className={styles.tagText} data-visible={visible}>
                {label}
              </span>
            </div>
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
        )}
      </Transition>
    </Section>
  );
}
