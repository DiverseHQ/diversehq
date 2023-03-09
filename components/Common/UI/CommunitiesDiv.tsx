import React, { FC } from 'react'
import RightSideCommunityComponent from '../../Home/RightSideCommunityComponent'

interface Props {
  text: string
  communitiesList: any[]
  Icon: React.FC
}

const CommunitiesDiv: FC<Props> = ({ text, communitiesList, Icon }) => {
  /*
      text is the heading text
      communitiesList is the list of communities to map over
      Icon is the icon to be shown on the left of the heading
    */
  return (
    <div className="flex flex-col mb-4 md:mb-6 bg-s-bg w-full rounded-[15px] border-[1px] border-s-border space-y-3 p-2">
      <div className="flex flex-row gap-1 xl:gap-2 items-center text-p-text px-3">
        <Icon />
        <h3 className="text-lg leading-6 font-medium">{text}</h3>
      </div>
      {communitiesList?.map((community, i) => {
        return <RightSideCommunityComponent key={i} community={community} />
      })}
    </div>
  )
}

export default CommunitiesDiv
