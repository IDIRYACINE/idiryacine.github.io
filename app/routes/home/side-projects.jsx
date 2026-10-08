import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { cssProps } from '~/utils/style';
import styles from './side-projects.module.css';

function getLink({ website, playstore, github }) {
  if (website) return { text: 'View website', href: website };
  if (playstore) return { text: 'Get the app', href: playstore };
  if (github) return { text: 'View source', href: github };
  return null;
}

export function SideProjects({ id, sectionRef, visible, projects }) {
  return (
    <Section className={styles.sideProjects} as="section" id={id} ref={sectionRef}>
      <Transition in={visible} timeout={0}>
        {({ visible, nodeRef }) => (
          <ul className={styles.grid} ref={nodeRef}>
            {projects.map((project, index) => {
              const link = getLink(project.actions);

              return (
                <li
                  className={styles.card}
                  data-visible={visible}
                  style={cssProps({ delay: index * 100 })}
                  key={project.slug}
                >
                  <Text className={styles.context} size="s" as="p">
                    {project.context}
                  </Text>
                  <Heading level={4} as="h3" className={styles.title}>
                    {project.name}
                  </Heading>
                  <Text className={styles.description} size="s" as="p">
                    {project.description}
                  </Text>
                  {link && (
                    <Button
                      secondary
                      iconHoverShift
                      className={styles.button}
                      href={link.href}
                      iconEnd="arrow-right"
                    >
                      {link.text}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Transition>
    </Section>
  );
}
