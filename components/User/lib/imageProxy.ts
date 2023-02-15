import { IMAGE_KIT_ENDPOINT } from '../../../utils/config'

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */

const imageProxy = (url: string, tr: string = ''): string => {
  return `${IMAGE_KIT_ENDPOINT}/tr:di-placeholder.webp,${tr}/${url}`
}

export default imageProxy
