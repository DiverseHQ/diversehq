import { Tooltip } from '@mui/material'
import React, { memo } from 'react'
import { useState } from 'react'
import { AiFillGift, AiOutlineGift } from 'react-icons/ai'
import { BsCollection, BsCollectionFill } from 'react-icons/bs'
import { CollectModule, Profile, Publication } from '../../../graphql/generated'
import { stringToLength } from '../../../utils/utils'
import HoverModalWrapper from '../../Common/UI/HoverModalWrapper'
import formatHandle from '../../User/lib/formatHandle'
import Attachment from '../Attachment'
import FeeCollectPopUp from './FeeCollectPopUp'
import FreeCollectPopUp from './FreeCollectPopUp'
import { useDevice } from '../../Common/DeviceWrapper'
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
  const { isMobile } = useDevice()
  return (
    <>
      <HoverModalWrapper
        disabled={isCollected || hasCollectedByMe}
        position="top"
        HoverModal={({
          setIsDrawerOpen,
          setShowOptionsModal,
          setIsCollecting
        }) => {
          return (
            <div className="w-full">
              {isMobile && (
                <div className="flex items-center flex-col justify-center px-4 text-p-text">
                  <div className="mb-2 self-start ">
                    <h1 className="font-medium text-lg ">
                      Post By u/{formatHandle(publication.profile?.handle)}
                    </h1>
                    <p className="font-normal text-sm">
                      {stringToLength(publication.metadata?.name, 20)}
                    </p>
                  </div>
                  <>
                    {publication?.metadata?.media.length > 0 && (
                      <div className="w-full mb-1">
                        <Attachment
                          publication={publication}
                          attachments={publication?.metadata?.media}
                          className="max-h-[250px] rounded-xl"
                        />
                      </div>
                    )}
                  </>
                </div>
              )}
              {collectModule?.__typename === 'FreeCollectModuleSettings' && (
                <FreeCollectPopUp
                  setIsCollected={setIsCollected}
                  setCollectCount={setCollectCount}
                  collectModule={collectModule}
                  publication={publication}
                  author={author}
                  setIsDrawerOpen={setIsDrawerOpen}
                  setShowOptionsModal={setShowOptionsModal}
                  setIsCollecting={setIsCollecting}
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
                  setIsCollecting={setIsCollecting}
                />
              )}
            </div>
          )
        }}
      >
        <Tooltip
          enterDelay={1000}
          leaveDelay={200}
          title={isCollected || hasCollectedByMe ? 'Collected' : 'Collect'}
          arrow
        >
          <div className="hover:bg-s-hover active:bg-s-hover rounded-md px-2 py-1.5 cursor-pointer flex flex-row items-center">
            {collectModule.__typename === 'FreeCollectModuleSettings' && (
              <>
                {isCollected || hasCollectedByMe ? (
                  <BsCollectionFill className="w-4 h-4 text-p-btn" />
                ) : (
                  <BsCollection className="w-4 h-4 text-[#687684]" />
                )}
              </>
            )}
            {collectModule.__typename === 'FeeCollectModuleSettings' && (
              <>
                {isCollected || hasCollectedByMe ? (
                  <AiFillGift className="w-4 h-4 text-[#687684]" />
                ) : (
                  <AiOutlineGift className="w-4 h-4 text-[#687684]" />
                )}
              </>
            )}
            <div className="ml-2 font-medium text-[#687684]">
              {collectCount}
            </div>
          </div>
        </Tooltip>
      </HoverModalWrapper>
    </>
  )
}

export default memo(LensCollectButton)
