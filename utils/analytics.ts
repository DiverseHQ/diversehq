// google tag manager

export const track = (event_name: string, event_object: any = {}) => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.dataLayer = window.dataLayer || []

    // @ts-ignore
    window.dataLayer.push({
      event: event_name,
      ...event_object
    })
  }
}
