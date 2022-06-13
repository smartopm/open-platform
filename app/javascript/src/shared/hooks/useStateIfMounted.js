import { useEffect, useRef, useState } from 'react';

export default function useStateIfMounted(initialState) {
  const isMounted = useRef(true);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setStateIfMounted = newState => {
    if (isMounted.current) {
      setState(newState);
    }
  };

  return [state, setStateIfMounted];
}
