import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — LocalServe` : 'LocalServe — Local Service Booking Platform';
    return () => { document.title = prev; };
  }, [title]);
}
