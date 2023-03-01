import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import CommunitiesSearchModal from './CommunitiesSearchModal'
import LensProfilesSearchModal from './LensProfilesSearchModal'

const SearchModal = () => {
  const inputRef = useRef()
  const [searchTerm, setSearchTerm] = useState('')
  const [communities, setCommunities] = useState([])
  const [lensProfiles, setLensProfiles] = useState([])
  const router = useRouter()

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setCommunities([])
      setLensProfiles([])
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [inputRef])

  useEffect(() => {
    if (router.pathname === '/search') {
      inputRef.current.focus()
    }
  }, [router])
  return (
    <div className="relative flex flex-row items-center sm:border-[1px] sm:border-s-border dark:border-0 p-1 rounded-[14px] bg-s-bg dark:bg-[#272729] w-full sm:w-[300px] gap-2 md:gap-4">
      <div className="text-p-text rounded-[12px] py-1">
        <AiOutlineSearch className="w-[23px] h-[23px] text-s-text" />
      </div>
      <input
        className="bg-transparent mr-1 text-[14px] text-[#111] dark:text-p-btn-text outline-none w-full"
        type="text"
        placeholder="Search..."
        ref={inputRef}
        onChange={() => setSearchTerm(inputRef.current.value)}
      />
      <div className="bg-s-bg rounded-2xl absolute w-full top-[50px] text-p-text shadow-nav">
        <CommunitiesSearchModal
          searchTerm={searchTerm}
          inputRef={inputRef}
          communities={communities}
          setCommunities={setCommunities}
          setSearchTerm={setSearchTerm}
        />
        <LensProfilesSearchModal
          searchTerm={searchTerm}
          inputRef={inputRef}
          lensProfiles={lensProfiles}
          setLensProfiles={setLensProfiles}
          setSearchTerm={setSearchTerm}
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
