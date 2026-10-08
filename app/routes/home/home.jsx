import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
import config from '~/config.json';
import { projects } from '~/data/projects.json';
import styles from './home.module.css';

// Prefetch draco decoader wasm
export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
  ];
};

export const meta = () => {
  return baseMeta({
    title: 'Fullstack & AI Engineer',
    description: `${config.name} — fullstack and ML/AI engineer and tech lead. Faster time to market, high-output delivery, product discovery and hard problems solved.`,
  });
};

function getProjectAction({ website, playstore, github }) {
  if (website) return { buttonText: 'View website', buttonLink: website };
  if (playstore) return { buttonText: 'Get the app', buttonLink: playstore };
  if (github) return { buttonText: 'View source', buttonLink: github };
  return {};
}

function getProjectModel({ slug, device, name }) {
  if (device === 'phone') {
    const texture = {
      srcSet: `/images/projects/${slug}-phone.png 375w`,
      placeholder: `/images/projects/${slug}-phone.png`,
    };
    return { type: device, alt: name, textures: [texture, texture] };
  }

  const texture = {
    srcSet: `/images/projects/${slug}.png 1280w`,
    placeholder: `/images/projects/${slug}.png`,
  };
  return { type: device, alt: name, textures: [texture] };
}

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectRefs = useRef([]);
  const details = useRef();

  useEffect(() => {
    const sections = [intro, ...projectRefs.current.map(current => ({ current })), details];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      {projects.map((project, index) => (
        <ProjectSummary
          key={project.name}
          id={`project-${index + 1}`}
          alternate={index % 2 === 1}
          sectionRef={element => (projectRefs.current[index] = element)}
          visible={visibleSections.includes(projectRefs.current[index])}
          index={index + 1}
          title={project.name}
          context={project.context}
          description={project.description}
          tags={project.outcomes}
          model={getProjectModel(project)}
          {...getProjectAction(project.actions)}
        />
      ))}
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </div>
  );
};
