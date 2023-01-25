import React, { useEffect, useState } from 'react'
import { Switch } from '@mui/material'
import { useLensUserContext } from '../../../lib/LensUserContext'

// change this later and fetch from https://docs.lens.xyz/docs/enabled-modules-currencies
const CurrencyOptions = [
  {
    chainId: 80001,
    address: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'ipfs://QmXfzKRvjZz3u5JRgC4v5mGVbm9ahrUiB4DgzHBsnWbTMM'
  },
  {
    chainId: 80001,
    address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734'
  },
  {
    chainId: 80001,
    address: '0x3C68CE8504087f89c640D02d133646d98e64ddd9',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logoURI: 'https://polygonscan.com/token/images/wETH_32.png'
  },
  {
    chainId: 80001,
    address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    symbol: 'WMATIC',
    name: 'Wrapped Matic',
    decimals: 18,
    logoURI: 'https://polygonscan.com/token/images/wMatic_32.png'
  },
  {
    chainId: 80001,
    address: '0x7beCBA11618Ca63Ead5605DE235f6dD3b25c530E',
    symbol: 'NCT',
    name: 'Nature Carbon Tonne',
    decimals: 18,
    logoURI: 'https://polygonscan.com/token/images/toucannct_32.png'
  }
]

const CollectSettingsModel = ({ setCollectSettings }) => {
  const [followerOnly, setFollowerOnly] = useState(false)
  const [monetize, setMonetize] = useState(false)
  const [price, setPrice] = useState(0)
  const [currency, setCurrency] = useState<string>()
  const { data: lensProfile } = useLensUserContext()

  useEffect(() => {
    if (monetize) {
      // fee collect module
      setCollectSettings({
        feeCollectModule: {
          amount: {
            currency: currency,
            value: price.toString()
          },
          recipient: lensProfile?.defaultProfile?.ownedBy,
          referralFee: 0,
          followerOnly: followerOnly
        }
      })
    } else {
      // free collect module
      setCollectSettings({
        freeCollectModule: {
          followerOnly: followerOnly
        }
      })
    }
  }, [followerOnly, monetize, price, currency])
  return (
    <div className="m-4 flex flex-col">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row items-center">
          <Switch
            checked={followerOnly}
            onChange={() => setFollowerOnly(!followerOnly)}
          />
          <div>Only Followers can Collect</div>
        </div>
        <div className="flex flex-row items-center">
          <Switch checked={monetize} onChange={() => setMonetize(!monetize)} />
          <div>Monetize</div>
        </div>
        {monetize && (
          <div className="ml-[50px] flex flex-col gap-y-4">
            <div className="flex flex-row items-center">
              <div>Currency</div>
              <select
                onChange={(e) => {
                  setCurrency(e.target.value)
                }}
                className="bg-s-bg outline-none ml-2 px-2 py-1 rounded-md"
              >
                {CurrencyOptions.map((currency) => (
                  <option key={currency.address} value={currency.address}>
                    {currency.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row items-center">
              <div>Price</div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="bg-s-bg outline-none ml-2 px-2 py-1 rounded-md"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectSettingsModel
