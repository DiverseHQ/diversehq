import React, { ChangeEvent, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoChevronBackSharp } from 'react-icons/io5'
import { GrFormClose } from 'react-icons/gr'
import {
  Profile,
  SearchRequestTypes,
  useSearchProfilesQuery
} from '../../graphql/generated'
import { stringToLength } from '../../utils/utils'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import getAvatar from '../User/lib/getAvatar'

interface Props {
  placeholder?: string
  className?: string
  modalClassName?: string
  // eslint-disable-next-line no-unused-vars
  onProfileSelected?: (profile: Profile) => void
}

const Search = ({
  placeholder = 'Search...',
  className,
  modalClassName,
  onProfileSelected
}: Props) => {
  const [searchText, setSearchText] = useState('')
  const searchProfileQuery = useSearchProfilesQuery({
    request: {
      query: searchText,
      type: SearchRequestTypes.Profile,
      limit: 10
    }
  })
  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value
    setSearchText(keyword)
  }
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full flex flex-row items-center bg-p-bg space-x-2 px-4">
        {searchText === '' && (
          <AiOutlineSearch className="text-s-text w-5 h-5" />
        )}
        {searchText.length > 0 && (
          <IoChevronBackSharp
            className="text-s-text- w-5 h-5 cursor-pointer"
            onClick={() => setSearchText('')}
          />
        )}
        <input
          className="w-full ml-2 focus:outline-none p-2 bg-p-bg"
          placeholder={placeholder}
          value={searchText}
          onChange={handleSearch}
        />
        {searchText.length > 0 && (
          <GrFormClose
            className="text-s-text w-6 h-6 cursor-pointer"
            onClick={() => setSearchText('')}
          />
        )}
      </div>
      {((searchProfileQuery?.data?.search?.__typename ===
        'ProfileSearchResult' &&
        searchProfileQuery?.data?.search?.items?.length > 0) ||
        searchProfileQuery.isLoading) && (
        <div className="abosulte h-[500px] overflow-y-auto">
          {/* @ts-ignore */}
          {searchProfileQuery?.data?.search?.items?.map((profile: Profile) => (
            <div
              key={profile.id}
              className={`cursor-pointer hover:bg-p-btn-hover px-3 py-2 flex flex-row justify-between border-b border-s-border ${modalClassName}`}
              onClick={() => onProfileSelected(profile)}
            >
              <div className="flex flex-row items-center space-x-2">
                <ImageWithPulsingLoader
                  src={getAvatar(profile)}
                  className="w-7 h-7 rounded-full"
                  alt={profile?.handle}
                />
                <div className="flex flex-col justify-center">
                  <div className="flex flex-row space-x-2 items-center">
                    <span className="text-md">
                      {stringToLength(profile?.name, 15)}{' '}
                    </span>
                    <span className="text-sm text-s-text">
                      {profile?.handle && `u/${profile?.handle}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search
