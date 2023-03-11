// @ts-ignore
import omitDeep from 'omit-deep'
import { baseXP, xpMultiplier } from '../utils/config'
export const sleep = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export const omit = (object: any, name: string) => {
  return omitDeep(object, name)
}

// function to covert a date time to a local time with am/pm
export const localTime = (date: Date) => {
  // const options = { hour: 'numeric', minute: 'numeric', hour12: true }
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}

export const getLevelAndThresholdXP = (totalXP: number) => {
  let level = 1
  let thresholdXP = baseXP

  while (totalXP >= thresholdXP) {
    totalXP -= thresholdXP
    level++
    thresholdXP = Math.round(thresholdXP * xpMultiplier)
  }

  return {
    level: level - 1,
    currentXP: totalXP,
    thresholdXP
  }
}

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

export const shortFormOfLink = (link: string) => {
  return link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
}
