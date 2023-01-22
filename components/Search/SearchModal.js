import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
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
    <div className="relative flex flex-row items-center border-[1px] border-p-btn p-1 rounded-[50px] bg-s-bg w-[300px] lg:w-[400px] xl:w-[450px] 2xl:w-[650px]  gap-2 md:gap-4">
      <div className="rounded-[22px] py-1 pl-1 md:px-3 ">
        <AiOutlineSearch className="w-5 h-5 text-p-text" />
      </div>
      <input
        className="bg-transparent text-sm text-p-text outline-none w-full"
        type="text"
        placeholder="Search Communities and Lens Profiles"
        ref={inputRef}
        onChange={() => setSearchTerm(inputRef.current.value)}
      />
      <div className="bg-s-bg rounded-2xl absolute w-full top-[50px]">
        <CommunitiesSearchModal
          searchTerm={searchTerm}
          inputRef={inputRef}
          communities={communities}
          setCommunities={setCommunities}
        />
        <LensProfilesSearchModal
          searchTerm={searchTerm}
          inputRef={inputRef}
          lensProfiles={lensProfiles}
          setLensProfiles={setLensProfiles}
        />
      </div>
    </div>
  )
}

export default SearchModal
