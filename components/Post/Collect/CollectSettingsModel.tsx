import { MenuItem, Select, Switch } from '@mui/material'
import {
  ThemeProvider as MUIThemeProvider,
  createTheme
} from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useEnabledModulesQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { useDevice } from '../../Common/DeviceWrapper'
import { useTheme } from '../../Common/ThemeProvider'

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { AiOutlinePlus } from 'react-icons/ai'
import { HiOutlineUserRemove } from 'react-icons/hi'
import { RxSpaceEvenlyHorizontally } from 'react-icons/rx'
import getLensProfileInfo from '../../../lib/profile/get-profile-info'
import splitNumber from '../../../lib/splitNumber'
import { HANDLE_SUFFIX } from '../../../utils/config'
import { isValidEthereumAddress } from '../../../utils/helper'

export type Receipient = {
  recipient?: string
  split?: number
}

const CollectSettingsModel = ({ collectSettings, setCollectSettings }) => {
  const { isMobile } = useDevice()

  const [followerOnly, setFollowerOnly] = useState(
    collectSettings?.followerOnly ?? false
  )
  const [monetize, setMonetize] = useState(collectSettings?.amount ?? false)
  const [price, setPrice] = useState(
    collectSettings?.amount?.value
      ? Number(collectSettings?.amount?.value)
      : 0.01
  )
  const [currency, setCurrency] = useState<string | null>(
    collectSettings?.amount?.currency || null
  ) // default to WMATIC

  const [endTimestamp, setTimestamp] = useState<string | null>(
    collectSettings?.endTimestamp || null
  )

  const [referalPercentage, setReferalPercentage] = useState<number>(
    collectSettings?.referralFee || 0
  )

  const [collectLimit, setCollectLimit] = useState<string | null>(
    collectSettings?.collectLimit || null
  )

  const { data } = useEnabledModulesQuery()
  const { data: lensProfile } = useLensUserContext()
  const { theme }: any = useTheme()

  const [recipients, setRecipients] = useState<Receipient[]>([
    {
      recipient: lensProfile?.defaultProfile?.ownedBy,
      split: 100
    }
  ])

  useEffect(() => {
    if (currency) return
    setCurrency(data?.enabledModuleCurrencies[0]?.address)
  }, [data])

  const MUITheme = createTheme({
    palette: {
      mode: theme
    }
  })

  useEffect(() => {
    if (collectSettings) {
      const setting = {
        followerOnly: followerOnly
      }

      if (collectLimit) {
        setting['collectLimit'] = collectLimit
      } else {
        delete setting['collectLimit']
      }

      if (monetize) {
        setting['amount'] = {
          currency: currency,
          value: String(price)
        }
        setting['referralFee'] = referalPercentage || 0
        setting['recipients'] = recipients
      } else {
        delete setting['amount']
        delete setting['referralFee']
      }

      if (endTimestamp) {
        setting['endTimestamp'] = endTimestamp
      } else {
        delete setting['endTimestamp']
      }

      console.log('setting', setting)
      setCollectSettings(setting)
    }
  }, [
    followerOnly,
    monetize,
    price,
    currency,
    collectLimit,
    endTimestamp,
    referalPercentage,
    recipients
  ])

  const splitEvenlyAmongRecipients = () => {
    const equalSplits = splitNumber(100, recipients.length)
    setRecipients(
      recipients.map((recipient, i) => ({
        recipient: recipient.recipient,
        split: equalSplits[i]
      }))
    )
  }

  const getIsHandle = (handle: string) => {
    return handle === 'lensprotocol' ? true : handle.endsWith(HANDLE_SUFFIX)
  }

  const onRecipientChange = async (index: number, recipient: string) => {
    const newRecipients = [...recipients]
    newRecipients[index].recipient = recipient
    if (getIsHandle(recipient)) {
      const profile = await getLensProfileInfo({
        handle: recipient
      })
      if (!profile) return
      newRecipients[index].recipient = profile?.profile?.ownedBy
    }
    setRecipients(newRecipients)
  }

  const totalSplit = recipients.reduce((acc, recipient) => {
    return acc + recipient.split
  }, 0)

  const duplicateRecipient = recipients.some((recipient, index) => {
    return (
      recipients.findIndex((r) => r.recipient === recipient.recipient) !== index
    )
  })
  return (
    <div className="m-4 flex flex-col gap-y-2 relative">
      <h1
        className={`self-center font-medium text-lg mb-2.5 ${
          !isMobile ? 'hidden' : ''
        }`}
      >
        Collect Setting
      </h1>

      {/* toggle for if post is collectible */}
      <div className="start-row">
        <Switch
          checked={!!collectSettings}
          onChange={() => {
            if (collectSettings) {
              setCollectSettings(null)
            } else {
              setCollectSettings({
                followerOnly: false
              })
            }
          }}
          sx={{
            '& .MuiSwitch-track': {
              backgroundColor: 'grey',
              color: 'grey'
            }
          }}
        />
        <p>This post can be collected</p>
      </div>

      {/* settings you see after toggling collectible */}
      {collectSettings && (
        <div className="pl-4 gap-y-2 flex flex-col">
          {/* only followers can collect toggle */}
          <div className="start-row">
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
            <p>Only Followers can Collect</p>
          </div>

          {/* monetize toggle */}
          <div className="start-row">
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
            <p>Monetize your post</p>
          </div>

          {/* monetize settings */}
          {monetize && (
            <div className="flex flex-col gap-y-4 pl-12 mt-2">
              {/* select currency  */}
              <div className="flex flex-row items-center">
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

              {/* enter amount */}
              <div className="flex flex-row items-center">
                <div className="shrink-0">Price (min 0.001)</div>
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

              {/* referral fee percentage */}
              <div className="start-row">
                <div className="shrink-0">Mirror Referral Fee</div>
                <div className="start-row">
                  <input
                    type="number"
                    value={referalPercentage}
                    min={0}
                    max={100}
                    onChange={(e) =>
                      setReferalPercentage(Number(e.target.value))
                    }
                    className={`border  bg-s-bg outline-none ml-2 px-2 py-1 rounded-md ${
                      !isMobile ? 'w-20' : 'w-16'
                    } `}
                    placeholder="0"
                  />
                  <div className="ml-2">%</div>
                </div>
              </div>

              {/* recpients */}
              <div className="flex flex-col gap-y-3">
                <div>Recipients : </div>
                {recipients.map((recipient, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center gap-x-2"
                  >
                    <input
                      type="text"
                      value={recipient.recipient}
                      onChange={async (e) => {
                        await onRecipientChange(index, e.target.value)
                      }}
                      className={clsx(
                        `border w-full bg-s-bg outline-none px-2 py-1 rounded-md`,
                        !isMobile ? 'w-20' : 'w-16',
                        !isValidEthereumAddress(recipient.recipient) &&
                          'border-red-500'
                      )}
                      placeholder="0xB5221... or diversehq.lens"
                    />
                    <div className="start-row">
                      <input
                        type="number"
                        value={recipient.split}
                        min={0}
                        max={100}
                        onChange={(e) => {
                          const newRecipients = [...recipients]
                          newRecipients[index].split = Number(e.target.value)
                          setRecipients(newRecipients)
                        }}
                        className={clsx(
                          `border bg-s-bg outline-none ml-2 px-2 py-1 rounded-md`,
                          !isMobile ? 'w-20' : 'w-16',
                          isValidEthereumAddress(recipient.recipient) &&
                            recipient.split === 0 &&
                            'border-red-500'
                        )}
                      />
                      <div className="ml-2">%</div>
                    </div>

                    {/* remove button */}
                    {recipients.length > 1 && (
                      <button
                        onClick={() => {
                          const newRecipients = [...recipients]
                          newRecipients.splice(index, 1)
                          setRecipients(newRecipients)
                        }}
                        className="p-2 rounded-full hover:bg-s-hover transition ease-in-out duration-200"
                      >
                        <HiOutlineUserRemove className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {/* show error if total split is not 100 */}
                {totalSplit !== 100 && (
                  <div className="text-red-500">
                    Total split must be 100% (currently {totalSplit}%)
                  </div>
                )}

                {/* show error if duplicate recipients */}
                {duplicateRecipient && (
                  <div className="text-red-500">
                    Duplicate recipients not allowed
                  </div>
                )}

                {/* add recipient button */}
                <div className="flex flex-row justify-between items-center px-2">
                  {recipients.length <= 5 && (
                    <button
                      onClick={() =>
                        setRecipients([
                          ...recipients,
                          {
                            recipient: '',
                            split: 0
                          }
                        ])
                      }
                      className="flex flex-row items-center gap-x-2 rounded-md px-3 py-0.5 bg-s-bg border-s-border border hover:bg-s-hover transition ease-in-out duration-200"
                    >
                      <AiOutlinePlus className="w-4 h-4" />
                      <div>Add Recipient</div>
                    </button>
                  )}

                  <button
                    onClick={splitEvenlyAmongRecipients}
                    className="flex flex-row items-center gap-x-2 rounded-md px-3 py-0.5 bg-s-bg border-s-border border hover:bg-s-hover transition ease-in-out duration-200"
                  >
                    <RxSpaceEvenlyHorizontally className="w-4 h-4" />
                    <div>Split Evenly</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* limited time collect toggle row*/}
          <div className="start-row">
            <Switch
              checked={Boolean(endTimestamp)}
              onChange={() => {
                if (endTimestamp) {
                  setTimestamp(null)
                } else {
                  // set timestamp to 1 day from now
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  setTimestamp(tomorrow.toISOString())
                }
              }}
              sx={{
                '& .MuiSwitch-track': {
                  backgroundColor: 'grey',
                  color: 'grey'
                }
              }}
            />
            <div>Collectible for limited time</div>
          </div>

          {/* limited time collect settings */}
          {Boolean(endTimestamp) && (
            // select data and time for collect to end
            <div className="flex flex-row justify-between  pl-8 mt-2">
              <div className="flex flex-row items-center pl-2">
                <MUIThemeProvider theme={MUITheme}>
                  <DateTimePicker
                    value={dayjs(endTimestamp)}
                    onChange={(value) => {
                      // convert dayjs to iso string
                      setTimestamp(value.toISOString())
                    }}
                    label="Collectable until"
                  />
                </MUIThemeProvider>
              </div>
            </div>
          )}

          {/* limit number of allowed collects  toggle */}
          <div className="start-row">
            <Switch
              checked={Boolean(collectLimit)}
              onChange={() => {
                if (collectLimit) {
                  setCollectLimit(null)
                } else {
                  setCollectLimit('1')
                }
              }}
              sx={{
                '& .MuiSwitch-track': {
                  backgroundColor: 'grey',
                  color: 'grey'
                }
              }}
            />
            <div>Limit number of collects</div>
          </div>

          {/* limit number of collects settings */}
          {Boolean(collectLimit) && (
            <div className="flex flex-row justify-between  pl-8 mt-2">
              <div className="flex flex-row items-center">
                <div className="shrink-0">Limit</div>
                <input
                  type="number"
                  value={Number(collectLimit)}
                  min={1}
                  // @ts-ignore
                  onChange={(e) => setCollectLimit(String(e.target.value))}
                  className={`border  bg-s-bg outline-none ml-2 px-2 py-1 rounded-md ${
                    !isMobile ? 'w-20' : 'w-16'
                  } `}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CollectSettingsModel
