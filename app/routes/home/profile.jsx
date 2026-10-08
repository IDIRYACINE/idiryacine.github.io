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
import config from '~/config.json';
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

const registration = [
  { kanji: '氏名', label: 'Name', value: config.name },
  { kanji: '等級', label: 'Grade', value: 'Special Grade' },
  { kanji: '術式', label: 'Technique', value: 'Shipping outcomes, fast' },
  { kanji: '所属', label: 'Affiliation', value: 'Infraxcode · Tech Lead' },
];

// Styled as a Jujutsu High sorcerer registration card, outcomes as the record
const RegistrationCard = ({ visible }) => (
  <div className={styles.card} data-visible={visible}>
    <p className={styles.cardHeader}>
      <span className={styles.cardKanji}>呪術師登録証</span>
      Sorcerer registration
    </p>
    <dl className={styles.fields}>
      {registration.map(({ kanji, label, value }) => (
        <div className={styles.field} key={label}>
          <dt>
            <span className={styles.fieldKanji}>{kanji}</span>
            {label}
          </dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
    <span className={styles.cardStamp} aria-hidden>
      特級
    </span>
    <p className={styles.recordHeader}>
      <span className={styles.fieldKanji}>戦績</span>
      Record
    </p>
    <ul className={styles.outcomes}>
      {outcomes.map(({ value, label }) => (
        <li className={styles.outcome} key={label}>
          <span className={styles.outcomeValue}>{value}</span>
          <span className={styles.outcomeLabel}>{label}</span>
        </li>
      ))}
    </ul>
  </div>
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
                  About me
                </div>
              </div>
              <div className={styles.image}>
                <RegistrationCard visible={visible} />
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
