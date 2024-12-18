import { useEffect, useState } from 'react'

const useTimeline = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date())

      const now = new Date()
      const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds())
      setTimeout(update, delay)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setCurrentTime(new Date())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    const timeoutId = setTimeout(update, 60000)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const currentHour = currentTime.getHours()
  const currentMinutes = currentTime.getMinutes()
  const currentPosition = ((currentHour * 60 + currentMinutes) / (24 * 60)) * 100

  return { currentTime, currentHour, currentMinutes, currentPosition }
}

export default useTimeline
