import { Outlet, useLoaderData } from '@remix-run/react';
import { MDXProvider } from '@mdx-js/react';
import { Post, postMarkdown } from '~/layouts/post';
import { baseMeta } from '~/utils/meta';
import { getPost } from '../articles_._index/posts';

export async function clientLoader({ request }) {
  const slug = new URL(request.url).pathname.split('/').filter(Boolean).at(-1);
  const post = getPost(slug);

  if (!post) {
    throw new Response(null, { status: 404, statusText: 'Not found' });
  }

  return post;
}

export function meta({ data }) {
  const { title, abstract } = data?.frontmatter ?? {};
  return baseMeta({ title, description: abstract, prefix: '' });
}

export default function Articles() {
  const { frontmatter, timecode } = useLoaderData();

  return (
    <MDXProvider components={postMarkdown}>
      <Post {...frontmatter} timecode={timecode}>
        <Outlet />
      </Post>
    </MDXProvider>
  );
}
