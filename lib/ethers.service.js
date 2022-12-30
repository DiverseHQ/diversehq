import { utils } from 'ethers'

export const splitSignature = (signature) => {
  return utils.splitSignature(signature)
}
