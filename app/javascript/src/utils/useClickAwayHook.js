/* istanbul ignore file */
import { useEffect } from 'react';

export default function useClickAwayHook(ref, handleClick ) {
  useEffect(() => {
    /**
     * function fired on clicked of outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClick()
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}