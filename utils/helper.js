export const isValidEthereumAddress = (address) => {
  if (typeof address !== 'string') {
    return false
  }

  if (address.length !== 42) {
    return false
  }

  if (!address.startsWith('0x')) {
    return false
  }

  if (!/^[0-9a-f]+$/i.test(address.slice(2))) {
    return false
  }

  return true
}
