import { IMAGE_KIT_ENDPOINT } from '../../../utils/config'
import getIPFSLink from './getIPFSLink'

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */
// eslint-disable-next-line no-unused-vars
const imageProxy = (url: string, tr: string = '', name?: string): string => {
  // for now, returning the original url
  // return url
  if (url?.startsWith('https://firebasestorage.googleapis.com/')) {
    return url
  }
  if (!url.startsWith('https://') || !url.startsWith('http://')) {
    return url
  }
  return `${IMAGE_KIT_ENDPOINT}/tr:di-placeholder.webp,n-${name},${tr}/${getIPFSLink(
    url
  )}`
}

export default imageProxy
