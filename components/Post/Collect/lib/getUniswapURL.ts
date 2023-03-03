import { isMainnet } from '../../../../utils/config'

/**
 *
 * @param amount - Amount to swap
 * @param outputCurrency - Output currency symbol
 * @returns uniswap link
 */
const getUniswapURL = (amount: number, outputCurrency: string): string => {
  return `https://app.uniswap.org/#/swap?exactField=output&exactAmount=${amount}&outputCurrency=${outputCurrency}&chain=${
    isMainnet ? 'polygon' : 'polygon_mumbai'
  }`
}

export default getUniswapURL
