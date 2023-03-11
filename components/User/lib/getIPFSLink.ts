import { LensInfuraEndpoint } from '../../../utils/config'

/**
 *
 * @param hash - IPFS hash
 * @returns IPFS link
 */
const getIPFSLink = (hash: string): string => {
  if (!hash) {
    return ''
  }
  const gateway = LensInfuraEndpoint

  return hash
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${gateway}${hash}`)
    .replace('https://ipfs.io/ipfs/', gateway)
    .replace('ipfs://', gateway)
}

export const isIpfsHashLink = (hash: string): boolean => {
  if (!hash) {
    return false
  }
  let regex =
    /^((ipfs:\/\/|https:\/\/ipfs\.io\/ipfs\/)?)Qm[1-9A-HJKa-km-z]{44}$/
  return regex.test(hash)
}

export default getIPFSLink
