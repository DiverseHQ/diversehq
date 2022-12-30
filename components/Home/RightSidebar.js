import React from 'react'

const RightSidebar = () => {
  const createdCommunities = [
    { name: 'Lens Community' },
    { name: 'Clash of Clans' },
    { name: 'Developers' }
  ]

  const mostVisitedCommunities = [
    { name: 'Lens Community' },
    { name: 'Clash of Clans' },
    { name: 'Developers' }
  ]

  const recommendedCommunities = [
    { name: 'Lens Community' },
    { name: 'Clash of Clans' }
  ]

  return (
    <div className="relative hidden lg:flex flex-col border-l-[1px] border-p-btn sticky top-[64px] h-[calc(100vh-62px)] w-[150px] md:w-[200px] lg:w-[300px] xl:w-[350px] py-8 px-4 md:px-6 lg:px-10 xl:px-12">
      <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
        <h3 className="text-[18px] font-medium border-b-[1px] border-[#B1B2FF]">
          Created Communities
        </h3>
        {createdCommunities.map((community, i) => {
          return (
            <div
              key={i}
              className="flex flex-row gap-2 items-center hover:bg-[#eee] rounded-full p-0.5"
            >
              <div className="w-[40px] h-[40px] bg-[#D9D9D9] rounded-full"></div>
              <span>{community.name}</span>
            </div>
          )
        })}
      </div>
      <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
        <h3 className="text-[18px] font-medium border-b-[1px] border-[#B1B2FF]">
          Most Visited Communities
        </h3>
        {mostVisitedCommunities.map((community, i) => {
          return (
            <div key={i} className="flex flex-row gap-2 items-center">
              <div className="w-[40px] h-[40px] bg-[#D9D9D9] rounded-full"></div>
              <span>{community.name}</span>
            </div>
          )
        })}
      </div>
      <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
        <h3 className="text-[18px] font-medium border-b-[1px] border-[#B1B2FF]">
          Recommended Communities
        </h3>
        {recommendedCommunities.map((community, i) => {
          return (
            <div key={i} className="flex flex-row gap-2 items-center">
              <div className="w-[40px] h-[40px] bg-[#D9D9D9] rounded-full"></div>
              <span>{community.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RightSidebar
