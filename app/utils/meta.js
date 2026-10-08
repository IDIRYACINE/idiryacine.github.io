import config from '~/config.json';

const { name, url } = config;

export function baseMeta({ title, description, prefix = name }) {
  const titleText = [prefix, title].filter(Boolean).join(' | ');

  return [
    { title: titleText },
    { name: 'description', content: description },
    { name: 'author', content: name },
    { property: 'og:title', content: titleText },
    { property: 'og:site_name', content: name },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:description', content: description },
    { property: 'twitter:card', content: 'summary' },
    { property: 'twitter:description', content: description },
    { property: 'twitter:title', content: titleText },
  ];
}
