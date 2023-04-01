import React from 'react'
import {
  IsFollowedLensCommunityType,
  useProfile
} from '../Common/WalletContext'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import getAvatar from '../User/lib/getAvatar'
import formatHandle from '../User/lib/formatHandle'

interface Props {
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  inputRef: React.RefObject<HTMLInputElement>
  onCommunitySelect: (community: IsFollowedLensCommunityType) => void
}

const LensCommunitiesSearchModal = ({
  searchTerm,
  setSearchTerm,
  inputRef,
  onCommunitySelect
}: Props) => {
  const { allLensCommunities } = useProfile()
  const [communities, setCommunities] = React.useState<
    IsFollowedLensCommunityType[]
  >([])

  const setCommunitiesOnSearchChange = async () => {
    if (searchTerm === '') {
      setCommunities([])
      return
    }
    // get top 5 matching communities from allLensCommunities
    const matchingCommunities = allLensCommunities
      .filter((community) => {
        return community.handle.toLowerCase().includes(searchTerm.toLowerCase())
      })
      .slice(0, 5)
    setCommunities(matchingCommunities)
  }

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setCommunities([])
    }
  }

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [inputRef])

  React.useEffect(() => {
    setCommunitiesOnSearchChange()
  }, [searchTerm])
  return (
    <>
      {communities.length > 0 && (
        <div>
          <div className="m-2 p-2 text-base font-bold">Lens Communities</div>
          {communities.map((community) => (
            <div
              className="m-2 flex flex-row p-1 hover:bg-s-hover underline-offset-4  items-center rounded-full cursor-pointer"
              key={community.handle}
              onClick={() => {
                inputRef.current.value = ''
                setSearchTerm('')
                onCommunitySelect(community)
              }}
            >
              <ImageWithPulsingLoader
                // @ts-ignore
                src={getAvatar(community)}
                className="w-8 h-8 mr-3 rounded-full object-cover"
              />
              <div className="text-sm">l/{formatHandle(community.handle)}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default LensCommunitiesSearchModal
