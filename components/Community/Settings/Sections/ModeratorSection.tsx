import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { CgClose } from 'react-icons/cg'
import { Profile } from '../../../../graphql/generated'
import ImageWithPulsingLoader from '../../../Common/UI/ImageWithPulsingLoader'
import LensProfilesSearchModal from '../../../Search/LensProfilesSearchModal'
import formatHandle from '../../../User/lib/formatHandle'
import getAvatar from '../../../User/lib/getAvatar'

const ModeratorSection = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedProfiles, setSelectedProfiles] = React.useState<Profile[]>([])
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
              className="bg-s-bg text-sm text-p-text w-40 focus:outline-none"
              ref={inputRef}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* invite button */}
        <button className="bg-p-btn text-p-btn-text rounded-md px-3 py-1">
          Add
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
      {/* <div className="flex flex-col space-y-2">
        <div className="flex flex-row items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-p-bg"></div>
          <div className="flex flex-col">
            <div className="text-xs font-medium">Username</div>
            <div className="text-xs text-s-text">Moderator</div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <div className="text-xs text-s-text">Remove</div>
            <div className="text-xs text-s-text">Edit</div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default ModeratorSection
