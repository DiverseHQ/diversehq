import { IMAGE_KIT_ENDPOINT } from '../../../utils/config'
import getIPFSLink, { isIpfsHashLink } from './getIPFSLink'

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */
// eslint-disable-next-line no-unused-vars
const imageProxy = (url: string, tr: string = '', name?: string): string => {
  // for now, returning the original url
  if (!url) {
    return ''
  }

  if (url.startsWith('https://ik.imagekit.io/lens/media-snapshot')) {
    // add tr to the url

    const defualtTr = 'q-40,pr'
    return `${url}?tr=${tr ? `${tr},` : ''}${defualtTr}`
  }

  // return url
  if (!isIpfsHashLink(url)) {
    // return url.replace(
    //   'https://firebasestorage.googleapis.com',
    //   `${IMAGE_KIT_ENDPOINT}${tr ? tr : ''}}`
    // )
    // temperory returning the original url
    return url
  }
  return `${IMAGE_KIT_ENDPOINT}/tr:di-placeholder.webp,${
    name ? `n-${name},` : ''
  }${tr ? tr : ''}/${getIPFSLink(url)}`
}

export default imageProxy
