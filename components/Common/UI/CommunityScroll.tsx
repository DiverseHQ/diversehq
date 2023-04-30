import React from 'react'
import RightSidebarThumnailTypeCommunity, {
  RightSidebarCommunity
} from './RightSidebarThumnailTypeCommunity'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import clsx from 'clsx'

// a vertical component  that displays 3 communities at a time, and has two buttons to show the next 3 communities or go back to the previous 3 communities

const CommunityScroll = ({
  communities
}: {
  communities: RightSidebarCommunity[]
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(3)

  const handleNext = () => {
    if (currentIndex + 3 < communities.length) {
      setCurrentIndex(currentIndex + 3)
    }
  }

  const handlePrevious = () => {
    if (currentIndex - 3 > 0) {
      setCurrentIndex(currentIndex - 3)
    }
  }

  if (communities.length === 0) {
    return null
  }
  return (
    <div className="flex flex-col mb-4 md:mb-6 bg-s-bg w-full rounded-[15px] border-[1px] border-s-border space-y-1 p-2">
      <div className="flex flex-col gap-1 xl:gap-2 text-p-text px-3">
        <div className="space-between-row mb-3">
          <div className="text-lg leading-6 font-medium">Recommended</div>

          <div className="flex flex-row gap-1 items-center">
            <button
              onClick={handlePrevious}
              className="hover:bg-s-hover rounded-md p-1.5"
            >
              <BiChevronLeft />
            </button>
            <button
              onClick={handleNext}
              className="hover:bg-s-hover rounded-md p-1.5"
            >
              <BiChevronRight />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-3">
        {communities.map((community, idx) => (
          <div
            className={clsx(
              idx < currentIndex && currentIndex - 3 <= idx ? 'block' : 'hidden'
            )}
            key={idx}
          >
            <RightSidebarThumnailTypeCommunity community={community} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommunityScroll
