// @ts-ignore
import omitDeep from 'omit-deep'
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
