import { Tooltip } from '@mui/material'
import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { CgClose } from 'react-icons/cg'
import {
  addModeratorsToCommunity,
  removeModeratorFromCommunity
} from '../../../../apiHelper/community'
import { Profile, useProfilesQuery } from '../../../../graphql/generated'
import { CommunityType } from '../../../../types/community'
import { useNotify } from '../../../Common/NotifyContext'
import ImageWithPulsingLoader from '../../../Common/UI/ImageWithPulsingLoader'
import MessageButton from '../../../Messages/MessageButton'
import LensProfilesSearchModal from '../../../Search/LensProfilesSearchModal'
import formatHandle from '../../../User/lib/formatHandle'
import getAvatar from '../../../User/lib/getAvatar'

const ModeratorSection = ({ _community }: { _community: CommunityType }) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedProfiles, setSelectedProfiles] = React.useState<Profile[]>([])
  const [community, setCommunity] = React.useState<CommunityType>(_community)
  const { notifyError } = useNotify()
  const [addingModerators, setAddingModerators] = React.useState<boolean>(false)

  const { data, isLoading } = useProfilesQuery(
    {
      request: {
        ownedBy: community?.moderators,
        limit: 50
      }
    },
    {
      enabled: !!community?.moderators
    }
  )

  const handleAddModerators = async () => {
    try {
      setAddingModerators(true)
      const moderatorsToAdd = selectedProfiles.map((profile) => profile.ownedBy)
      const res = await addModeratorsToCommunity(
        community.name,
        moderatorsToAdd
      )
      if (res.status === 200) {
        const resJson = await res.json()
        setCommunity(resJson)
        setSelectedProfiles([])
      } else {
        const resJson = await res.json()
        notifyError(resJson.msg)
        console.log(res)
      }
    } catch (error) {
      notifyError("Couldn't add moderators")
      console.log(error)
    } finally {
      setAddingModerators(false)
    }
  }

  const handleRemoveModerator = async (moderator: string) => {
    try {
      const res = await removeModeratorFromCommunity(community.name, moderator)
      if (res.status === 200) {
        const resJson = await res.json()
        setCommunity(resJson)
      } else {
        const resJson = await res.json()
        notifyError(resJson.msg)
        console.log(res)
      }
    } catch (error) {
      notifyError("Couldn't remove moderator")
      console.log(error)
    }
  }

  return (
    <div className="p-2 w-full sm:p-3 space-y-2">
      <div className=" font-medium leading-3">Manage Moderators</div>
      <div className="text-xs text-s-text leading-3">
        Moderators have power to ban users, hide posts and edit rules.
      </div>
      {/* search row*/}
      <div className="relative flex flex-row items-center space-x-2 py-2">
        {/* search input box */}
        <div className="flex w-full flex-row items-center space-x-2 border border-s-border  rounded-xl p-2">
          <AiOutlineSearch className="text-s-text w-4 h-4" />
          {/* showing selected users here */}
          <div className="flex flex-row flex-wrap gap-y-2 items-center space-x-2 w-full">
            {selectedProfiles.map((profile) => (
              <div
                className="flex flex-row items-center space-x-1.5 hover:bg-s-hover cursor-pointer bg-p-bg rounded-full px-2 py-1"
                key={profile.id}
              >
                <ImageWithPulsingLoader
                  className="w-5 h-5 rounded-full bg-p-bg"
                  src={getAvatar(profile)}
                />
                <div className="text-sm font-medium">
                  u/{formatHandle(profile.handle)}
                </div>
                <div
                  className="text-xs text-s-text cursor-pointer"
                  onClick={() => {
                    setSelectedProfiles(
                      selectedProfiles.filter((p) => p.id !== profile.id)
                    )
                  }}
                >
                  <CgClose />
                </div>
              </div>
            ))}
            <input
              type="text"
              placeholder="Search Users"
              className="bg-s-bg text-sm text-p-text w-40 focus:outline-none w-[150px]"
              ref={inputRef}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* invite button */}
        <button
          className={`${
            addingModerators || selectedProfiles.length === 0
              ? 'bg-p-btn-disabled'
              : 'bg-p-btn'
          } text-p-btn-text rounded-md px-3 py-1`}
          onClick={handleAddModerators}
          disabled={addingModerators || selectedProfiles.length === 0}
        >
          {addingModerators ? 'Adding...' : 'Add'}
        </button>

        <div className="bg-s-bg rounded-2xl absolute w-full top-[50px] text-p-text shadow-nav">
          <LensProfilesSearchModal
            inputRef={inputRef}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onProfileSelect={(profile) => {
              if (selectedProfiles.find((p) => p.id === profile.id)) return
              setSelectedProfiles([...selectedProfiles, profile])
            }}
            showLable={false}
          />
        </div>
      </div>

      {/* list of moderators */}
      <div className="font-medium text-sm">
        Moderators ({data?.profiles?.items?.length ?? 0}
        {/* {data?.profiles?.items?.filter((profile) => profile?.isDefault)
          ?.length ?? 0} */}
        )
      </div>
      <div>
        {isLoading && (
          <div className="flex flex-row items-center justify-center space-x-2">
            <div className="w-4 h-4 border-t-2 border-p-btn rounded-full animate-spin" />
            <div className="text-sm text-s-text">Loading...</div>
          </div>
        )}
        {data?.profiles &&
          data?.profiles?.items
            // data?.profiles?.items
            //   ?.filter((profile) => profile?.isDefault)
            .map((profile) => (
              <div
                className="flex flex-row w-full items-center justify-between space-x-2 py-2 border-b border-s-border"
                key={profile?.id}
              >
                <div className="flex flex-row items-center space-x-2">
                  <ImageWithPulsingLoader
                    className="w-8 h-8 rounded-full bg-p-bg"
                    // @ts-ignore
                    src={getAvatar(profile)}
                  />
                  {profile?.name && (
                    <div className="text-sm font-medium">{profile.name}</div>
                  )}
                  <div className="text-sm text-s-text font-medium">
                    u/{formatHandle(profile.handle)}
                  </div>
                  {/* @ts-ignore */}
                  <MessageButton userLensProfile={profile} />
                </div>
                <Tooltip title={`Remove from mods`} arrow placement="top">
                  <div
                    className="text-s-text cursor-pointer p-1 hover:bg-s-hover rounded-full"
                    onClick={() => {
                      handleRemoveModerator(profile.ownedBy)
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

export default ModeratorSection
