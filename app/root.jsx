import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useRouteError,
} from '@remix-run/react';
import { ThemeProvider, themeStyles } from '~/components/theme-provider';
import GothamBook from '~/assets/fonts/gotham-book.woff2';
import GothamMedium from '~/assets/fonts/gotham-medium.woff2';
import { useEffect, useState } from 'react';
import { Error } from '~/layouts/error';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Navbar } from '~/layouts/navbar';
import { Progress } from '~/components/progress';
import config from '~/config.json';
import { baseMeta } from '~/utils/meta';
import styles from './root.module.css';
import resetStylesUrl from './reset.css?url';
import globalStylesUrl from './global.css?url';

export const links = () => [
  { rel: 'stylesheet', href: resetStylesUrl },
  { rel: 'stylesheet', href: globalStylesUrl },
  {
    rel: 'preload',
    href: GothamMedium,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  {
    rel: 'preload',
    href: GothamBook,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  { rel: 'manifest', href: '/manifest.json' },
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'shortcut_icon', href: '/shortcut.png', type: 'image/png', sizes: '64x64' },
  { rel: 'apple-touch-icon', href: '/icon-256.png', sizes: '256x256' },
  { rel: 'author', href: '/humans.txt', type: 'text/plain' },
];

// Default meta for the prerendered index.html, routes override it once loaded
export const meta = () =>
  baseMeta({
    title: 'Fullstack & AI Engineer',
    description: `${config.name}: fullstack and ML/AI engineer and tech lead. Faster time to market, high-output delivery, product discovery and hard problems solved.`,
  });

const THEME_KEY = 'theme';

// Runs before hydration so a stored light theme doesn't flash dark first
const themeScript = `try{var t=localStorage.getItem('${THEME_KEY}');if(t)document.body.dataset.theme=t}catch(e){}`;

// The document shell: Remix prerenders this into index.html and keeps it mounted
// through hydration, so the stored theme never flashes
export function Layout({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_KEY);
      if (storedTheme) setTheme(storedTheme);
    } catch {
      // Storage can be unavailable in private browsing, fall back to light
    }
  }, []);

  function toggleTheme(newTheme) {
    const nextTheme = newTheme ? newTheme : theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);

    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      // The theme still applies for this visit without storage
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Theme color doesn't support oklch so I'm hard coding these hexes for now */}
        <meta name="theme-color" content={theme === 'dark' ? '#0b0b0c' : '#f3f1ea'} />
        <meta
          name="color-scheme"
          content={theme === 'light' ? 'light dark' : 'dark light'}
        />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
        <link rel="canonical" href={config.url} />
      </head>
      <body data-theme={theme} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { state } = useNavigation();

  useEffect(() => {
    console.info(
      `${config.ascii}\n`,
      `Taking a peek huh? Check out the source code: ${config.repo}\n\n`
    );
  }, []);

  return (
    <>
      <Progress />
      <VisuallyHidden showOnFocus as="a" className={styles.skip} href="#main-content">
        Skip to main content
      </VisuallyHidden>
      <Navbar />
      <main
        id="main-content"
        className={styles.container}
        tabIndex={-1}
        data-loading={state === 'loading'}
      >
        <Outlet />
      </main>
    </>
  );
}

// Shown in the prerendered index.html until the app hydrates
export function HydrateFallback() {
  return null;
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <Error error={error} />;
}
