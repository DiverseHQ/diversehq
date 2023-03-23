import { Tooltip } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { CgClose } from 'react-icons/cg'
import {
  addBannedUserToLensCommunity,
  removeBannedUserFromLensCommunity
} from '../../../../api/lensCommunity'
import { Profile, useProfilesQuery } from '../../../../graphql/generated'
import { BannedUser, LensCommunity } from '../../../../types/community'
import { useNotify } from '../../../Common/NotifyContext'
import ImageWithPulsingLoader from '../../../Common/UI/ImageWithPulsingLoader'
import MessageButton from '../../../Messages/MessageButton'
import LensProfilesSearchModal from '../../../Search/LensProfilesSearchModal'
import formatHandle from '../../../User/lib/formatHandle'
import getAvatar from '../../../User/lib/getAvatar'

const UserManagementSection = ({ community }: { community: LensCommunity }) => {
  console.log('community', community)
  const [bannedUsers, setBannedUsers] = React.useState<BannedUser[]>(
    community?.bannedUsers ?? []
  )
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = React.useState<string>('')
  const [selectedProfile, setSelectedProfile] = React.useState<Profile>(null)
  const [ruleViolated, setRuleViolated] = React.useState<string>(
    community?.rules?.[0].title ?? null
  )
  const [extraReason, setExtraReason] = React.useState<string>('')
  const { notifyInfo, notifyError } = useNotify()

  const { data, isLoading } = useProfilesQuery(
    {
      request: {
        profileIds: bannedUsers.map((user) => user.profileId),
        limit: 50
      }
    },
    {
      enabled: !!bannedUsers
    }
  )

  const handleBan = async () => {
    if (!selectedProfile) return
    try {
      const bannedUser: BannedUser = {
        address: selectedProfile.ownedBy,
        profileId: selectedProfile.id,
        reason: `Violated rule : ${ruleViolated} \n Other Reason : ${extraReason}`
      }
      const res = await addBannedUserToLensCommunity(community?._id, bannedUser)
      if (res.status === 200) {
        setBannedUsers([...bannedUsers, bannedUser])
        setSelectedProfile(null)
        setRuleViolated(community?.rules[0].title ?? null)
        setExtraReason('')
      } else {
        const resJson = await res.json()
        notifyInfo(resJson.msg)
      }
    } catch (error) {
      console.log(error)
      notifyError('Unable to ban the user at the moment')
    }
  }

  const handleRemoveBan = async (address: string) => {
    if (!address) return
    try {
      const res = await removeBannedUserFromLensCommunity(
        community?._id,
        address.toLowerCase()
      )
      if (res.status === 200) {
        const newBannedUsers = bannedUsers.filter(
          (user) => user.address.toLowerCase() !== address.toLowerCase()
        )
        setBannedUsers(newBannedUsers)
      } else {
        const resJson = await res.json()
        console.log(resJson)
        notifyInfo(resJson.msg)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-2 w-full sm:p-3 space-y-2 min-h-[500px]">
      {/* permanent ban section */}
      <div className=" font-medium leading-3">Manage Banned Users</div>
      <div className="text-xs text-s-text leading-4">
        Banned users will not be able to join the community again, post on the
        community, and all their previous posts will be hidden.
      </div>
      <div className="relative items-center space-x-2 py-2">
        <div className="flex w-full flex-row items-center space-x-2 border border-s-border  rounded-xl p-2">
          <AiOutlineSearch className="text-s-text w-4 h-4" />
          <input
            type="text"
            placeholder="Search user to ban"
            className="bg-s-bg text-sm text-p-text w-full focus:outline-none w-[150px]"
            ref={inputRef}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-s-bg rounded-2xl absolute w-full top-[50px] text-p-text shadow-nav">
          <LensProfilesSearchModal
            inputRef={inputRef}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onProfileSelect={(profile) => {
              setSelectedProfile(profile)
            }}
            showLable={false}
          />
        </div>
        {selectedProfile && (
          <div className="rounded-xl absolute top-[60px] w-full sm:w-[500px] bg-s-bg border border-s-border p-3 space-y-2">
            {/* banned user info */}
            <div className="flex flex-row items-center space-x-1.5">
              <div className="font-medium pr-1">Ban </div>

              <ImageWithPulsingLoader
                className="w-6 h-6 rounded-full"
                src={getAvatar(selectedProfile)}
              />
              {selectedProfile?.name && (
                <div className="font-medium">{selectedProfile.name}</div>
              )}
              <Link href={`/u/${formatHandle(selectedProfile.handle)}`}>
                <span className="cursor-pointer hover:underline text-s-text">
                  u/{formatHandle(selectedProfile.handle)}
                </span>
              </Link>
            </div>

            {/* select rule violation */}
            <div>
              <div className="text-sm">
                Select the rule that the user violated. This will be shown to
                the user as a reason of ban.
              </div>
              <select
                onChange={(e) => {
                  setRuleViolated(e.target.value)
                }}
                value={ruleViolated}
                placeholder="Select rule violated"
                className="w-full bg-s-bg p-2 border border-s-border rounded-xl mt-2 text-sm"
              >
                {community?.rules?.map((rule, index) => (
                  <option
                    key={rule.title}
                    className="w-[500px]"
                    value={rule.title}
                  >
                    Rule{index + 1} : {rule.title}
                  </option>
                ))}
              </select>
            </div>

            {/* extra reason */}
            <div>
              <input
                type="text"
                placeholder="(Optional) Any addition reason or last words of advice.. ?"
                className="w-full bg-s-bg p-2 border border-s-border rounded-xl mt-2 text-sm"
                onChange={(e) => setExtraReason(e.target.value)}
              />
            </div>

            {/* ban button and cancel button */}
            <div className="flex flex-row items-center space-x-2">
              <button
                className="bg-s-bg text-p-text border border-s-border rounded-xl p-2 w-full text-sm"
                onClick={() => {
                  setSelectedProfile(null)
                  setRuleViolated(community?.rules[0].title ?? null)
                  setExtraReason('')
                }}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-p-btn-text font-bold tracking-wider border border-p-base rounded-xl p-2 w-full text"
                onClick={handleBan}
              >
                Ban
              </button>
            </div>
          </div>
        )}
      </div>

      {/* banned users list */}
      <div className="font-medium">Banned Users</div>
      <div>
        {isLoading && (
          <div className="flex flex-row items-center justify-center space-x-2">
            <div className="w-4 h-4 border-t-2 border-p-btn rounded-full animate-spin" />
            <div className="text-sm text-s-text">Loading...</div>
          </div>
        )}
        {data?.profiles &&
          data?.profiles?.items?.map((profile) => (
            <div
              className="flex flex-row w-full items-center justify-between space-x-2 py-2 border-b border-s-border"
              key={profile?.id}
            >
              <div className="flex flex-row items-start space-x-2">
                <ImageWithPulsingLoader
                  className="w-8 h-8 rounded-full bg-p-bg"
                  // @ts-ignore
                  src={getAvatar(profile)}
                />
                <div>
                  <div className="flex flex-row items-center space-x-2">
                    {profile?.name && (
                      <div className="text-sm font-medium">{profile.name}</div>
                    )}
                    <div className="text-sm text-s-text font-medium">
                      u/{formatHandle(profile.handle)}
                    </div>
                    {/* @ts-ignore */}
                    <MessageButton userLensProfile={profile} />
                  </div>
                  {/* reason of ban */}
                  <div className="text-xs text-s-text w-full">
                    {
                      bannedUsers.find((user) => user.profileId === profile.id)
                        .reason
                    }
                  </div>
                </div>
              </div>
              <Tooltip title={`Remove ban`} arrow placement="top">
                <div
                  className="text-s-text cursor-pointer p-1 hover:bg-s-hover rounded-full"
                  onClick={() => {
                    handleRemoveBan(profile.ownedBy)
                  }}
                >
                  <CgClose className="w-5 h-5" />
                </div>
              </Tooltip>
            </div>
          ))}
      </div>
    </div>
  )
}

export default UserManagementSection
