import { useRouter } from 'next/router'
import React, { useState } from 'react'
// import { HiOutlineSearch } from 'react-icons/hi'
import { AiOutlineSearch } from 'react-icons/ai'
import { searchCommunityFromName } from '../../api/community'

const SearchModal = () => {
  const router = useRouter()
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

  const handleCommunityClicked = (name) => {
    router.push(`/c/${name}`)
  }
  return (
    // <div className="relative">
    //   <label>
    //     <div className="w-[250px] flex flex-row items-center border rounded-xl border-p-border py-2 px-4 mb-6">
    //       <HiOutlineSearch />
    //       <input
    //         type="text"
    //         className={`w-full text-p-text bg-s-bg outline-none pl-3`}
    //         placeholder="Search"
    //         onChange={onChangeSearch}
    //       />
    //     </div>
    //   </label>
    // {communities.length > 0 && (
    //   <div className="bg-s-h-bg rounded-[25px] absolute w-[250px]">
    //     {communities.map((community) => (
    //       <div
    //         className="hover:bg-p-h-bg m-2 flex flex-row p-2 hover:underline underline-offset-4  items-center rounded-[25px] cursor-pointer"
    //         key={community._id}
    //         onClick={() => {
    //           handleCommunityClicked(community.name)
    //         }}
    //       >
    //         <img
    //           src={community.logoImageUrl}
    //           className="w-10 h-10 mr-5 rounded-full"
    //         />
    //         <div>{community.name}</div>
    //       </div>
    //     ))}
    //   </div>
    // )}
    // </div>

    <div className="relative hidden sm:flex flex-row items-center border-[1px] border-p-btn p-1 rounded-[50px] bg-s-text w-[200px] md:w-[300px] lg:w-[400px] xl:w-[450px] 2xl:w-[600px]  gap-2 md:gap-4">
      <div className="bg-p-btn rounded-[22px] py-1 px-2 md:px-3 ">
        <AiOutlineSearch className="w-[23px] h-[23px] text-s-text" />
      </div>
      <input
        className="bg-transparent mr-1 text-[14px] text-[#111] outline-none w-full"
        type="text"
        placeholder="Search Diverse"
        onChange={onChangeSearch}
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {communities.length > 0 && (
            <div className="bg-[#FFFFFF] rounded-[25px] absolute w-full top-[50px] z-100">
              {communities.map((community) => (
                <div
                  className="hover:bg-p-btn-hover m-2 flex flex-row p-2 hover:underline underline-offset-4  items-center rounded-[25px] cursor-pointer"
                  key={community._id}
                  onClick={() => {
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
