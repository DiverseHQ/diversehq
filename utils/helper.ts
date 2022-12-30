export const isValidEthereumAddress = (address: string) => {
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

export const sleep = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
