import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { SectionIntro } from './section-intro';
import { SideProjects } from './side-projects';
import { Fragment, useEffect, useRef, useState } from 'react';
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

const sections = [
  {
    id: 'software',
    category: 'software',
    label: 'Software',
    title: 'Products that ship, and move the business',
    description:
      'Leading teams from discovery to delivery: shorter time to market, platforms that hold up in production, and costs that go down instead of up.',
  },
  {
    id: 'ai',
    category: 'ai',
    label: 'AI / ML',
    title: 'Research-grade AI, built to run for real',
    description:
      'Models that need less data and less compute to be accurate, from medical imaging to real-time computer vision.',
  },
];

const sideProjectsSection = {
  id: 'side-projects',
  category: 'side',
  label: 'Side projects',
  title: 'Things I build for fun',
  description: 'Hackathons, community tools and experiments outside of client work.',
};

const showSideProjects = true;

// Only the first render of the home page after a document load should reset scroll
let hasLanded = false;

function getProjects(category) {
  return projects.filter(project => project.category === category);
}

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
  const sectionRefs = useRef({});

  const registerSection = key => element => {
    sectionRefs.current[key] = element;
  };

  const isVisible = key => visibleSections.includes(sectionRefs.current[key]);

  // A fresh page load (including refresh) always lands on the intro, instead of
  // the browser restoring the last scroll position or jumping to a stale hash
  useEffect(() => {
    if (hasLanded) return;
    hasLanded = true;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      window.history.replaceState(window.history.state, '', window.location.pathname);
    }

    // Wait a frame so this runs after Remix's ScrollRestoration has restored
    const frame = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
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

    [intro.current, ...Object.values(sectionRefs.current)]
      .filter(Boolean)
      .forEach(section => sectionObserver.observe(section));

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
      {sections.map(section => (
        <Fragment key={section.id}>
          <SectionIntro
            {...section}
            sectionRef={registerSection(section.id)}
            visible={isVisible(section.id)}
          />
          {getProjects(section.category).map((project, index) => (
            <ProjectSummary
              key={project.slug}
              id={`${section.id}-${index + 1}`}
              alternate={index % 2 === 1}
              sectionRef={registerSection(project.slug)}
              visible={isVisible(project.slug)}
              index={index + 1}
              title={project.name}
              context={project.context}
              description={project.description}
              tags={project.outcomes}
              model={getProjectModel(project)}
              {...getProjectAction(project.actions)}
            />
          ))}
        </Fragment>
      ))}
      {showSideProjects && (
        <>
          <SectionIntro
            {...sideProjectsSection}
            sectionRef={registerSection(sideProjectsSection.id)}
            visible={isVisible(sideProjectsSection.id)}
          />
          <SideProjects
            id={`${sideProjectsSection.id}-list`}
            sectionRef={registerSection('side-projects-list')}
            visible={isVisible('side-projects-list')}
            projects={getProjects(sideProjectsSection.category)}
          />
        </>
      )}
      <Profile
        sectionRef={registerSection('details')}
        visible={isVisible('details')}
        id="details"
      />
      <Footer />
    </div>
  );
};
