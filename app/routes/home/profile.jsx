import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { Fragment, useState } from 'react';
import { profile } from '~/data/profile.json';
import { outcomes } from '~/data/about.json';
import katakana from './katakana.svg';
import styles from './profile.module.css';

const ProfileText = ({ visible, titleId }) => (
  <Fragment>
    <Heading className={styles.title} data-visible={visible} level={3} id={titleId}>
      <DecoderText text="Hi there" start={visible} delay={500} />
    </Heading>
    {profile.biography.map(paragraph => (
      <Text
        key={paragraph}
        className={styles.description}
        data-visible={visible}
        size="l"
        as="p"
      >
        {paragraph}
      </Text>
    ))}
  </Fragment>
);

const Outcomes = ({ visible }) => (
  <ul className={styles.outcomes} data-visible={visible}>
    {outcomes.map(({ value, label }) => (
      <li className={styles.outcome} key={label}>
        <span className={styles.outcomeValue}>{value}</span>
        <span className={styles.outcomeLabel}>{label}</span>
      </li>
    ))}
  </ul>
);

export const Profile = ({ id, visible, sectionRef }) => {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.profile}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {({ visible, nodeRef }) => (
          <div className={styles.content} ref={nodeRef}>
            <div className={styles.column}>
              <ProfileText visible={visible} titleId={titleId} />
              <div className={styles.buttons} data-visible={visible}>
                <Button secondary className={styles.button} href="/contact" icon="send">
                  Send me a message
                </Button>
                <Button secondary className={styles.button} href="/Resume.pdf" icon="link">
                  Resume
                </Button>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.tag} aria-hidden>
                <Divider
                  notchWidth="64px"
                  notchHeight="8px"
                  collapsed={!visible}
                  collapseDelay={1000}
                />
                <div className={styles.tagText} data-visible={visible}>
                  Outcomes
                </div>
              </div>
              <div className={styles.image}>
                <Outcomes visible={visible} />
                <svg className={styles.svg} data-visible={visible} viewBox="0 0 136 766">
                  <use href={`${katakana}#katakana-profile`} />
                </svg>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
