import React from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { IoIosArrowUp } from 'react-icons/io'
import { RiMailAddLine } from 'react-icons/ri'
import { useMessageStore } from '../../store/message'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import getAvatar from '../User/lib/getAvatar'

const MessageHeader = ({ profile, open, setOpen }) => {
  const setConversationKey = useMessageStore(
    (state) => state.setConversationKey
  )
  const handleShowProfiles = async () => {}
  const handleShowConversations = async (e) => {
    // don't call parent onclick function
    e.stopPropagation()
    setConversationKey('')
  }
  return (
    <div
      className="h-[50px] flex flex-row justify-between px-4 py-2 cursor-pointer items-center"
      onClick={() => {
        setOpen(!open)
      }}
    >
      {!profile && (
        <div className="font-semibold text-2xl tracking-wide">Messages</div>
      )}
      {profile && (
        <div className="flex flex-row items-center space-x-2">
          {open && (
            <div
              className="hover:bg-p-hover p-1.5 rounded-full flex justify-center items-center cursor-pointer"
              onClick={handleShowConversations}
            >
              <BiArrowBack className="w-5 h-5" />
            </div>
          )}
          <ImageWithPulsingLoader
            src={getAvatar(profile)}
            className="w-8 h-8 rounded-full"
            alt={profile?.handle}
          />
          <div className="flex flex-col text-sm leading-4">
            {profile?.name && (
              <div className="font-semibold tracking-wide">{profile?.name}</div>
            )}
            <div className="">{profile?.handle && `u/${profile?.handle}`}</div>
          </div>
        </div>
      )}
      <div className="flex flex-row items-center space-x-2">
        {/* <div
          className="hover:bg-p-hover p-1.5 rounded-full flex justify-center items-center cursor-pointer"
          onClick={handleShowProfiles}
        >
          <RiMailAddLine className="w-6 h-6" />
        </div> */}
        <div
          className="hover:bg-p-hover p-1.5 rounded-full flex justify-center items-center cursor-pointer"
          onClick={() => {
            setOpen(!open)
          }}
        >
          <IoIosArrowUp
            className={`w-6 h-6 duration-700 transition-transform ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export default MessageHeader
