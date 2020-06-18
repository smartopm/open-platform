import { useState, useEffect } from 'react'

/**
 *
 * @param {Number} initialTime
 * @param {Number} delay
 * @description returns remaining time in seconds
 * @returns time in seconds
 */
export default function useTimer(initialTime, delay) {
  const [time, setTime] = useState(initialTime)
  useEffect(() => {
    if (!time) return
    const intervalId = setInterval(() => {
      setTime(time - 1)
    }, delay)
    return () => clearInterval(intervalId)
  }, [delay, time])

  return time
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}

/**
 *
 * @description return current width and height of the window
 */
export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}


/**
 * 
 * @param {string} url API endpoint to fetch from
 * @param {object} options include headers and http method here [GET, POST, ...]
 * @returns {object} response and error
 * 
 */
export function useFetch(url, options){
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  // we might not need the options anymore since we don't need auth for GET(which is the default)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url, options);
        const json = await res.json();
        setResponse(json);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return { response, error };
};