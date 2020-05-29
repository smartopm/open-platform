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
