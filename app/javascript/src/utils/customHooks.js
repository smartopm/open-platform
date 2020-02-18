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
  }, [time])

  return time
}
