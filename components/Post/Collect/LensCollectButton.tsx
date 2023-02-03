import React from 'react'
import { useState } from 'react'
import { AiFillGift, AiOutlineGift } from 'react-icons/ai'
import { BsCollection, BsCollectionFill } from 'react-icons/bs'
import { CollectModule, Profile, Publication } from '../../../graphql/generated'
import HoverModalWrapper from '../../Common/UI/HoverModalWrapper'
import FeeCollectPopUp from './FeeCollectPopUp'
import FreeCollectPopUp from './FreeCollectPopUp'
type Props = {
  publication: Publication
  totalCollects: number
  hasCollectedByMe: boolean
  author: Profile
  collectModule: CollectModule
}

const LensCollectButton = ({
  publication,
  totalCollects,
  hasCollectedByMe,
  author,
  collectModule
}: Props) => {
  const [collectCount, setCollectCount] = useState(totalCollects)
  const [isCollected, setIsCollected] = useState(hasCollectedByMe)

  return (
    <>
      <HoverModalWrapper
        disabled={isCollected || hasCollectedByMe}
        position="top"
        collectModule={collectModule}
        setIsCollected={setIsCollected}
        setCollectCount={setCollectCount}
        publication={publication}
        author={author}
        HoverModal={({ setIsDrawerOpen, setShowOptionsModal }) => {
          return (
            <>
              {collectModule?.__typename === 'FreeCollectModuleSettings' && (
                <FreeCollectPopUp
                  setIsCollected={setIsCollected}
                  setCollectCount={setCollectCount}
                  collectModule={collectModule}
                  publication={publication}
                  author={author}
                  setIsDrawerOpen={setIsDrawerOpen}
                  setShowOptionsModal={setShowOptionsModal}
                />
              )}
              {collectModule?.__typename === 'FeeCollectModuleSettings' && (
                <FeeCollectPopUp
                  author={author}
                  collectModule={collectModule}
                  publication={publication}
                  setCollectCount={setCollectCount}
                  setIsCollected={setIsCollected}
                  setIsDrawerOpen={setIsDrawerOpen}
                  setShowOptionsModal={setShowOptionsModal}
                />
              )}
            </>
          )
        }}
      >
        <div className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer flex flex-row items-center">
          {collectModule.__typename === 'FreeCollectModuleSettings' && (
            <>
              {isCollected || hasCollectedByMe ? (
                <BsCollectionFill className="w-5 h-5" />
              ) : (
                <BsCollection className="w-5 h-5" />
              )}
            </>
          )}
          {collectModule.__typename === 'FeeCollectModuleSettings' && (
            <>
              {isCollected || hasCollectedByMe ? (
                <AiFillGift className="w-5 h-5" />
              ) : (
                <AiOutlineGift className="w-5 h-5" />
              )}
            </>
          )}
          <div className="ml-2">{collectCount}</div>
        </div>
      </HoverModalWrapper>
    </>
  )
}

export default LensCollectButton
