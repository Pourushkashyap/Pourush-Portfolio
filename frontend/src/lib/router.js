import { useEffect, useState } from 'react';

// Tiny hash router: "#/about" -> "/about". Swap for react-router-dom whenever you like.
function readRoute() {
  try {
    const h = window.location.hash.replace(/^#/, '');
    return h && h !== '/' ? h : '/';
  } catch {
    return '/';
  }
}

export function useRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onChange = () => {
      setRoute(readRoute());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
