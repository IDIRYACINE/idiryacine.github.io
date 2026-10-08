import { formatTimecode } from '~/utils/timecode';

const modules = import.meta.glob('../articles.*.mdx', { eager: true });
const WORDS_PER_MINUTE = 225;

function getSlug(file) {
  return file.replace('../articles.', '').replace(/\.mdx$/, '');
}

export function getPost(slug) {
  const file = `../articles.${slug}.mdx`;
  if (!modules[file]) return null;

  // wordCount is added to the frontmatter at build time in vite.config.js
  const { frontmatter } = modules[file];
  const readTime = (frontmatter.wordCount / WORDS_PER_MINUTE) * 60 * 1000;

  return { slug, frontmatter, timecode: formatTimecode(readTime) };
}

export function getPosts() {
  return Object.keys(modules)
    .map(file => getPost(getSlug(file)))
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}
