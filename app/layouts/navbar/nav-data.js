import config from '~/config.json';

export const navLinks = [
  {
    label: 'Software',
    pathname: '/#software',
  },
  {
    label: 'AI / ML',
    pathname: '/#ai',
  },
  {
    label: 'Details',
    pathname: '/#details',
  },
  {
    label: 'Articles',
    pathname: '/articles',
  },
  {
    label: 'Contact',
    pathname: '/contact',
  },
];

export const socialLinks = [
  {
    label: 'Github',
    url: `https://github.com/${config.github}`,
    icon: 'github',
  },
  {
    label: 'Email',
    url: `mailto:${config.email}`,
    icon: 'send',
  },
  {
    label: 'Resume',
    url: '/Resume.pdf',
    icon: 'link',
  },
];
