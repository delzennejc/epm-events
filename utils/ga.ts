// log the pageview with their URL
export const pageview = (url: string) => {
  // @ts-ignore
  if (window?.gtag) {
    // @ts-ignore
    window?.gtag('config', 'G-6SVYFY541V', {
      page_path: url,
    })
  }
  }
  
// log specific events happening.
export const event = ({ action, params }: any) => {
  // @ts-ignore
  if (window?.gtag) {
    // @ts-ignore
    window?.gtag('event', action, params)
  }
}