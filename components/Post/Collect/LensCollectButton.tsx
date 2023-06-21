import { Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import { memo, useState } from 'react'
import { BsCollection, BsCollectionFill } from 'react-icons/bs'
import { Publication } from '../../../graphql/generated'
import BottomDrawerWrapper from '../../Common/BottomDrawerWrapper'
import { modalType, usePopUpModal } from '../../Common/CustomPopUpProvider'
import { useDevice } from '../../Common/DeviceWrapper'
import PopUpWrapper from '../../Common/PopUpWrapper'
import CollectInfo from './CollectInfo'
type Props = {
  publication: Publication
}

const LensCollectButton = ({ publication }: Props) => {
  console.log(publication)
  const [collectCount, setCollectCount] = useState(
    publication?.stats?.totalAmountOfCollects ?? 0
  )
  const [isCollected, setIsCollected] = useState(
    publication?.hasCollectedByMe ?? false
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { isMobile } = useDevice()
  const router = useRouter()
  const { showModal } = usePopUpModal()
  return (
    <>
      <BottomDrawerWrapper
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        position="bottom"
        showClose={false}
      >
        <CollectInfo
          isCollected={isCollected}
          publication={publication}
          setCollectCount={setCollectCount}
          setIsCollected={setIsCollected}
          collectCount={collectCount}
        />
      </BottomDrawerWrapper>
      <Tooltip
        enterDelay={1000}
        leaveDelay={200}
        title={
          isCollected || publication?.hasCollectedByMe ? 'Collected' : 'Collect'
        }
        arrow
      >
        <button
          className="hover:bg-s-hover active:bg-s-hover rounded-md px-2 py-1.5 cursor-pointer flex flex-row items-center"
          onClick={() => {
            if (isMobile) {
              setIsDrawerOpen(true)
            } else {
              showModal({
                component: (
                  <PopUpWrapper title="Collect">
                    <CollectInfo
                      publication={publication}
                      setCollectCount={setCollectCount}
                      setIsCollected={setIsCollected}
                      collectCount={collectCount}
                      isCollected={isCollected}
                    />
                  </PopUpWrapper>
                ),
                type: modalType.normal
              })
            }
          }}
        >
          {isCollected || publication?.hasCollectedByMe ? (
            <BsCollectionFill className="w-4 h-4 text-p-btn" />
          ) : (
            <BsCollection className="w-4 h-4 text-[#687684]" />
          )}

          {/* {collectModule.__typename === 'FeeCollectModuleSettings' && (
              <>
                {isCollected || hasCollectedByMe ? (
                  <AiFillGift className="w-4 h-4 text-[#687684]" />
                ) : (
                  <AiOutlineGift className="w-4 h-4 text-[#687684]" />
                )}
              </>
            )} */}
          {!router.pathname.startsWith('/p/') && (
            <div className="ml-2 font-medium text-[#687684]">
              {collectCount}
            </div>
          )}
        </button>
      </Tooltip>
    </>
  )
}

export default memo(LensCollectButton)
