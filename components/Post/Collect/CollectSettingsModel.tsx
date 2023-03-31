import React, { useEffect, useState } from 'react'
import { MenuItem, Select, Switch } from '@mui/material'
import { useLensUserContext } from '../../../lib/LensUserContext'
import useDevice from '../../Common/useDevice'
import {
  ThemeProvider as MUIThemeProvider,
  createTheme
} from '@mui/material/styles'
import { useTheme } from '../../Common/ThemeProvider'
import { useEnabledModulesQuery } from '../../../graphql/generated'

const CollectSettingsModel = ({ collectSettings, setCollectSettings }) => {
  const { isMobile } = useDevice()
  let _followerOnly = false
  if (collectSettings) {
    if (collectSettings.feeCollectModule) {
      _followerOnly = collectSettings.feeCollectModule.followerOnly
    } else if (collectSettings.freeCollectModule) {
      _followerOnly = collectSettings.freeCollectModule.followerOnly
    }
  }
  const [followerOnly, setFollowerOnly] = useState(_followerOnly)
  const [monetize, setMonetize] = useState(
    collectSettings?.feeCollectModule ? true : false
  )
  const [price, setPrice] = useState(
    collectSettings?.feeCollectModule?.amount?.value
      ? Number(collectSettings?.feeCollectModule?.amount?.value)
      : 0.01
  )
  const [currency, setCurrency] = useState<string>(
    collectSettings?.feeCollectModule?.amount?.currency
  ) // default to WMATIC

  const { data } = useEnabledModulesQuery()
  const { data: lensProfile } = useLensUserContext()
  const { theme }: any = useTheme()

  const MUITheme = createTheme({
    palette: {
      mode: theme
    }
  })

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
  }, [followerOnly, monetize, price, currency, lensProfile])
  return (
    <div className="m-4 flex flex-col">
      <div className="flex flex-col gap-y-4 relative">
        <h1
          className={`self-center font-medium text-lg mb-2.5 ${
            !isMobile ? 'hidden' : ''
          }`}
        >
          Collect Setting
        </h1>
        <div className="flex flex-row items-center justify-between">
          <p>Only Followers can Collect</p>
          <Switch
            checked={followerOnly}
            onChange={() => setFollowerOnly(!followerOnly)}
            sx={{
              '& .MuiSwitch-track': {
                backgroundColor: 'grey',
                color: 'grey'
              }
            }}
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <p>Monetize</p>
          <Switch
            checked={monetize}
            onChange={() => setMonetize(!monetize)}
            sx={{
              '& .MuiSwitch-track': {
                backgroundColor: 'grey',
                color: 'grey'
              }
            }}
          />
        </div>
        {monetize && (
          <div className=" flex flex-row  flex-row lg:gap-y-4 space-x-10 lg:space-x-32">
            <div className="flex flex-row items-center ">
              <div>Currency</div>
              <MUIThemeProvider theme={MUITheme}>
                <Select
                  onChange={(e) => {
                    setCurrency(e.target.value)
                  }}
                  className={` text-p-text border outline-none ml-2 px-1 py-2 h-8  rounded-md`}
                  value={currency}
                >
                  {data?.enabledModuleCurrencies.map((currency) => (
                    <MenuItem key={currency.address} value={currency.address}>
                      {currency.symbol}
                    </MenuItem>
                  ))}
                </Select>
              </MUIThemeProvider>
            </div>
            <div className="flex flex-row items-center">
              <div>Price (min 0.001)</div>
              <input
                type="number"
                value={price}
                min={0.001}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={`border  bg-s-bg outline-none ml-2 px-2 py-1 rounded-md ${
                  !isMobile ? 'w-20' : 'w-16'
                } `}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectSettingsModel
