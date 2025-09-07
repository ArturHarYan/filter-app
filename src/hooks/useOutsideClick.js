import { useEffect } from 'react';

export const useOutsideClick = (ref, callback, condition) => {
  useEffect(() => {
    if (!condition) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, callback, condition]);
};
