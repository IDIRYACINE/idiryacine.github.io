import { baseMeta } from '~/utils/meta';
import { getPosts } from './posts';

export async function clientLoader() {
  const allPosts = getPosts();
  const featured = allPosts.filter(post => post.frontmatter.featured)[0];
  const posts = allPosts.filter(post => featured?.slug !== post.slug);

  return { posts, featured };
}

export function meta() {
  return baseMeta({
    title: 'Articles',
    description:
      'Writing on shipping products faster, leading engineering teams, and applied ML/AI.',
  });
}

export { Articles as default } from './articles';
