// import { IMAGE_KIT_ENDPOINT } from '../../../utils/config'

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */
// eslint-disable-next-line no-unused-vars
const imageProxy = (url: string, tr: string = ''): string => {
  // for now, returning the original url
  return url
  // return `${IMAGE_KIT_ENDPOINT}/tr:di-placeholder.webp,${tr}/${url}`
}

export default imageProxy
