import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import formatHandle from '../User/lib/formatHandle'
import CommunitiesSearchModal from './CommunitiesSearchModal'
import LensProfilesSearchModal from './LensProfilesSearchModal'

const SearchModal = () => {
  const inputRef = useRef()
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  useEffect(() => {
    if (router.pathname === '/search') {
      inputRef.current.focus()
    }
  }, [router])
  return (
    <div className="relative flex flex-row items-center sm:border-[1px] sm:border-s-border dark:border-0 p-1 pl-2 rounded-xl bg-s-bg dark:bg-[#272729] w-full sm:w-[300px] gap-2 md:gap-4">
      <div className="text-p-text rounded-lg py-1">
        <AiOutlineSearch className="w-[23px] h-[23px] text-s-text" />
      </div>
      <input
        className="bg-transparent mr-1 text-[14px] text-[#111] dark:text-p-btn-text outline-none w-full"
        type="text"
        placeholder="Search..."
        ref={inputRef}
        onChange={() => setSearchTerm(inputRef.current.value)}
      />
      <div className="bg-s-bg rounded-lg absolute w-full top-[50px] text-p-text shadow-nav">
        <CommunitiesSearchModal
          searchTerm={searchTerm}
          inputRef={inputRef}
          setSearchTerm={setSearchTerm}
          onCommunitySelect={(community) => {
            if (community?.handle) {
              router.push(`/l/${formatHandle(community.handle)}`)
              return
            }
            router.push(`/c/${community.name}`)
          }}
        />
        {/* <LensCommunitiesSearchModal
          inputRef={inputRef}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onCommunitySelect={(community) => {
            router.push(`/l/${formatHandle(community.handle)}`)
          }}
        /> */}
        <LensProfilesSearchModal
          searchTerm={searchTerm}
          inputRef={inputRef}
          setSearchTerm={setSearchTerm}
          onProfileSelect={(profile) => {
            router.push(`/u/${formatHandle(profile?.handle)}`)
          }}
        />
      </div>
      {searchTerm !== '' && (
        <div
          className="text-p-text rounded-full py-1 px-1 mr-2 hover:bg-s-bg cursor-pointer"
          onClick={() => {
            setSearchTerm('')
            inputRef.current.value = ''
          }}
        >
          <AiOutlineClose className="w-[15px] h-[15px] text-p-text" />
        </div>
      )}
    </div>
  )
}

export default SearchModal
