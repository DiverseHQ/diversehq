import React, { FC } from 'react'
import { Profile } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useMessageStore } from '../../store/message'
import useMessagePreviews from './hooks/useMessagePreviews'
import buildConversationId from './lib/buildConversationId'
import { buildConversationKey } from './lib/conversationKey'
import Preview from './Preview'
import Search from './Search'
import { IoMailOpenOutline } from 'react-icons/io5'
import { BiArrowBack } from 'react-icons/bi'

interface Props {
  className?: string
  selectedConversationKey: string
}

const PreviewList: FC<Props> = ({ className, selectedConversationKey }) => {
  const { data: lensProfile } = useLensUserContext()
  const addProfile = useMessageStore((state) => state.addProfile)
  const setConversationKey = useMessageStore(
    (state) => state.setConversationKey
  )
  const selectedTab = useMessageStore((state) => state.selectedTab)
  const setSelectedTab = useMessageStore((state) => state.setSelectedTab)
  const currentProfile = lensProfile?.defaultProfile
  const {
    authenticating,
    loading,
    messages,
    profilesToShow,
    profilesError,
    requestedCount
  } = useMessagePreviews()

  const sortedProfiles = Array.from(profilesToShow).sort(([keyA], [keyB]) => {
    const messageA = messages.get(keyA)
    const messageB = messages.get(keyB)
    return (messageA?.sent?.getTime() || 0) >= (messageB?.sent?.getTime() || 0)
      ? -1
      : 1
  })
  const showAuthenticating = currentProfile && authenticating
  const showLoading =
    loading && (messages.size === 0 || profilesToShow.size === 0)

  const onProfileSelected = (profile: Profile) => {
    const conversationId = buildConversationId(currentProfile?.id, profile.id)
    const conversationKey = buildConversationKey(
      profile.ownedBy,
      conversationId
    )
    addProfile(conversationKey, profile)
    setConversationKey(conversationKey)
  }

  const PreviewLoader = () => (
    <div className="hover:bg-s-hover p-3 flex flex-row justify-between items-center">
      <div className="flex flex-row items-center space-x-2">
        <div className="w-12 h-12 rounded-full bg-s-border animate-pulse" />
        <div className="flex flex-col justify-center">
          <div className="flex flex-row items-center space-x-2">
            <div className="w-20 h-4 bg-s-border rounded-md animate-pulse" />
            <div className="w-10 h-3 bg-s-border rounded-md animate-pulse" />
          </div>

          <div className="w-40 h-3 mt-1 bg-s-border rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="text-s-text text-xs shrink-0">
        <div className="w-10 h-2 bg-s-border rounded-full animate-pulse" />
      </div>
    </div>
  )

  return (
    <div className={`flex flex-col  h-full ${className}`}>
      {/* todo search profile and message */}
      <Search
        placeholder="Search someone to chat with..."
        onProfileSelected={onProfileSelected}
      />
      {/* profiles and preview message */}
      {/* {showAuthenticating && (
        <div className="flex w-full h-full justify-center item-center">
          Authenticating...
        </div>
      )}
      {showLoading && (
        <div className="flex w-full h-full justify-center item-center">
          Loading...
        </div>
      )} */}
      {showAuthenticating && !showLoading && (
        <div className="centered-row w-full pt-4">
          <div className="spinner border-p-text w-4 h-4" />
          <div className="ml-2 text-s-text">{'Authenticating...'}</div>
        </div>
      )}
      {showLoading && !showAuthenticating && (
        <>
          <PreviewLoader />
          <PreviewLoader />
          <PreviewLoader />
          <PreviewLoader />
          <PreviewLoader />
        </>
      )}

      {profilesError && (
        <div className="flex w-full h-full justify-center item-center">
          Error loading messages
        </div>
      )}

      {!showAuthenticating && !showLoading && !profilesError && (
        <div className="flex flex-col h-full pb-20 sm:h-[450px] overflow-y-auto">
          {selectedTab === 'Following' && (
            <button
              className="start-row py-2 pl-2 space-x-2 hover:bg-s-bg-hover"
              onClick={() => {
                setSelectedTab('Requested')
              }}
            >
              <div className="p-2">
                <IoMailOpenOutline className="w-4 h-4 rounded-full" />
              </div>
              <div className="text-s-text">
                View <span className="font-semibold">{requestedCount}</span>{' '}
                Requested messages
              </div>
            </button>
          )}
          {selectedTab === 'Requested' && (
            <button
              className="start-row py-2 pl-2 space-x-2 hover:bg-s-bg-hover"
              onClick={() => {
                setSelectedTab('Following')
              }}
            >
              <div className="p-2.5">
                <BiArrowBack className="w-4 h-4 rounded-full" />
              </div>
              <div className=" text-s-text">Go back to Following messages</div>
            </button>
          )}
          {sortedProfiles?.map(([key, profile]) => {
            const message = messages.get(key)
            if (!message) {
              return null
            }

            return (
              <Preview
                isSelected={key === selectedConversationKey}
                key={key}
                profile={profile}
                conversationKey={key}
                message={message}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PreviewList
