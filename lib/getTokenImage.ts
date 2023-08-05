/**
 * Returns the URL for the token image with the specified symbol.
 *
 * @param symbol The token symbol.
 * @returns The token image URL.
 */
const getTokenImage = (symbol: string): string => {
  const symbolLowerCase = symbol?.toLowerCase() ?? ''
  return `https://static-assets.lenster.xyz/images/tokens/${symbolLowerCase}.svg`
}

export default getTokenImage
