import { useEffect, useState } from 'react';

export const useDebounce = (val, delay = 500) => {
  const [debouncedVal, setDebouncedVal] = useState(val);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVal(val);
    }, delay);

    return () => clearTimeout(timer);
  }, [val, delay]);

  return debouncedVal;
};
