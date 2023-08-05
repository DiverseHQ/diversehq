import Link from 'next/link'
import { Profile, useProfilesQuery } from '../../../graphql/generated'
import { POLYGONSCAN_URL } from '../../../utils/config'
import { stringToLength } from '../../../utils/utils'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import formatHandle from '../../User/lib/formatHandle'
import getAvatar from '../../User/lib/getAvatar'
import getStampFyiURL from '../../User/lib/getStampFyiURL'
import { Receipient } from './CollectSettingsModel'

const Splits = ({ recipients }: { recipients: Receipient[] }) => {
  const { data: recipientProfilesData } = useProfilesQuery(
    {
      request: {
        ownedBy: recipients.map((r) => r.recipient)
      }
    },
    {
      enabled: !!recipients.length
    }
  )

  if (recipients.length === 0) {
    return null
  }

  const getProfileByAddress = (address: string) => {
    const profiles = recipientProfilesData?.profiles?.items
    if (profiles) {
      return profiles.find((p) => p.ownedBy === address)
    }
  }

  return (
    <div className="space-y-2 py-3">
      <div className="mb-2 font-bold">Revenue Splits :</div>

      {recipients.map((recipient) => {
        const { recipient: address, split } = recipient
        const profile = getProfileByAddress(address) as Profile

        return (
          <div
            key={address}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex w-full items-center space-x-2">
              <>
                <ImageWithPulsingLoader
                  className="h-5 w-5 rounded-full border bg-gray-200 dark:border-gray-700"
                  src={profile ? getAvatar(profile) : getStampFyiURL(address)}
                  alt="Avatar"
                />
                {profile ? (
                  <Link href={`/u/${formatHandle(profile?.handle)}`}>
                    {`u/${formatHandle(profile?.handle)}`}
                  </Link>
                ) : (
                  <Link
                    href={`${POLYGONSCAN_URL}/address/${address}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {stringToLength(address, 6)}
                  </Link>
                )}
              </>
            </div>
            <div className="font-bold">{split}%</div>
          </div>
        )
      })}
    </div>
  )
}

export default Splits
