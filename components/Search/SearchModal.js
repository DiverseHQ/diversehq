import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
// import { HiOutlineSearch } from 'react-icons/hi'
import { AiOutlineSearch } from 'react-icons/ai'
import { searchCommunityFromName } from '../../api/community'

const SearchModal = () => {
  const router = useRouter()
  const inputRef = useRef()
  const [communities, setCommunities] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const onChangeSearch = async (e) => {
    const { value } = e.target
    if (value === '') {
      setCommunities([])
      return
    }
    setIsLoading(true)
    const res = await searchCommunityFromName(value)
    setIsLoading(false)
    console.log(res)
    setCommunities(res)
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setCommunities([])
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [inputRef])

  const handleCommunityClicked = (name) => {
    router.push(`/c/${name}`)
  }
  return (
    <div className="relative flex flex-row items-center border-[1px] border-p-btn p-1 rounded-[50px] bg-s-bg w-[300px] md:w-[300px] lg:w-[400px] xl:aw-[450px] 2xl:w-[600px]  gap-2 md:gap-4">
      <div className="bg-p-btn rounded-[22px] py-1 px-2 md:px-3 ">
        <AiOutlineSearch className="w-[23px] h-[23px] text-s-bg" />
      </div>
      <input
        className="bg-transparent mr-1 text-[14px] text-[#111] outline-none w-full"
        type="text"
        placeholder="Search Diverse Communities"
        ref={inputRef}
        onChange={onChangeSearch}
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {communities.length > 0 && (
            <div className="bg-[#FFFFFF] rounded-[25px] absolute w-full top-[50px] z-100 max-h-[500px] overflow-y-auto overflow-x-hidden">
              {communities.map((community) => (
                <div
                  className="hover:bg-p-btn-hover m-2 flex flex-row p-2 hover:underline underline-offset-4  items-center rounded-[25px] cursor-pointer"
                  key={community._id}
                  onClick={() => {
                    inputRef.current.value = ''
                    handleCommunityClicked(community.name)
                  }}
                >
                  <img
                    src={community.logoImageUrl}
                    className="w-10 h-10 mr-5 rounded-full"
                  />
                  <div>{community.name}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SearchModal
