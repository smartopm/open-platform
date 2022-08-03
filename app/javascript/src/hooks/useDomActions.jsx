import { useState, useEffect } from 'react';

/**
 *
 * @param {*} id
 * The id of DOM element we wish to scroll into view and
 * remove the background color effect.
 * @param {*} time
 * how long we wish to keep the background color before it is removed
 * @returns boolean (true/false)
 */

const getDomElement = id => window.document.getElementById(id);

export const useScroll = id => {
  useEffect(() => {
    const domElement = getDomElement(id);
    if (domElement) { domElement.scrollIntoView({ behavior: 'smooth' }); }
  }, [id]);
};

export const useRemoveBackground = (id, time) => {
  const [isBgColor, setIsBgColor] = useState(true);

  useEffect(() => {
    let btTimer = false;
    if (getDomElement(id)) {
      btTimer = setTimeout(() => { setIsBgColor(false); }, time);
    }

    return () => {
      if (btTimer) { clearTimeout(btTimer); } };
  }, [id, time]);

  return isBgColor;
};