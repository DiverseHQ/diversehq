import React from 'react'
import { useState } from 'react'
import { BsCollection, BsCollectionFill } from 'react-icons/bs'
import { CollectModule, Profile, Publication } from '../../../graphql/generated'
// import { usePopUpModal } from '../../Common/CustomPopUpProvider'
// import useDevice from '../../Common/useDevice'
// import FeeCollectPopUp from './FeeCollectPopUp'
// import FreeCollectPopUp from './FreeCollectPopUp'
// import FreeCollectDrawer from './FreeCollectDrawer'
// import FeeCollectDrawer from './FeeCollectDrawer'
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
  // const { showModal }: any = usePopUpModal()
  // const { isMobile } = useDevice()
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // const handleCollectClick = async () => {
  //   console.log('handleCollectClick')
  //   console.log('collectModule', collectModule)
  //   console.log('isCollected', isCollected)
  //   if (isCollected || !collectModule) return
  //   if (isMobile) {
  //     setIsDrawerOpen(true)
  //     return
  //   }
  //   if (collectModule.__typename === 'FreeCollectModuleSettings') {
  //     showModal({
  //       component: (
  //         <FreeCollectPopUp
  //           setIsCollected={setIsCollected}
  //           setCollectCount={setCollectCount}
  //           collectModule={collectModule}
  //           publication={publication}
  //           author={author}
  //         />
  //       ),
  //       type: modalType.normal,
  //       onAction: () => {},
  //       extraaInfo: {}
  //     })
  //   }
  //   if (collectModule.__typename === 'FeeCollectModuleSettings') {
  //     showModal({
  //       component: (
  //         <FeeCollectPopUp
  //           setIsCollected={setIsCollected}
  //           setCollectCount={setCollectCount}
  //           collectModule={collectModule}
  //           publication={publication}
  //           author={author}
  //         />
  //       ),
  //       type: modalType.normal,
  //       onAction: () => {},
  //       extraaInfo: {}
  //     })
  //   }
  // }
  return (
    <>
      <HoverModalWrapper
        disabled={isCollected || hasCollectedByMe}
        position="top"
        HoverModal={() => {
          return (
            <>
              {collectModule?.__typename === 'FreeCollectModuleSettings' && (
                <FreeCollectPopUp
                  setIsCollected={setIsCollected}
                  setCollectCount={setCollectCount}
                  collectModule={collectModule}
                  publication={publication}
                  author={author}
                />
                // <FreeCollectDrawer
                //   setIsCollected={setIsCollected}
                //   isCollected={isCollected}
                //   setCollectCount={setCollectCount}
                //   collectModule={collectModule}
                //   publication={publication}
                //   author={author}
                //   isDrawerOpen={isDrawerOpen}
                //   setIsDrawerOpen={setIsDrawerOpen}
                // />
              )}
              {collectModule?.__typename === 'FeeCollectModuleSettings' && (
                <FeeCollectPopUp
                  author={author}
                  collectModule={collectModule}
                  publication={publication}
                  setCollectCount={setCollectCount}
                  setIsCollected={setIsCollected}
                />
                // <FeeCollectDrawer
                //   isDrawerOpen={isDrawerOpen}
                //   setIsDrawerOpen={setIsDrawerOpen}
                //   setIsCollected={setIsCollected}
                //   setCollectCount={setCollectCount}
                //   collectModule={collectModule}
                //   publication={publication}
                //   author={author}
                //   isCollected={isCollected}
                // />
              )}
            </>
          )
        }}
      >
        <div className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer flex flex-row items-center">
          {isCollected || hasCollectedByMe ? (
            <BsCollectionFill className="w-5 h-5" />
          ) : (
            <BsCollection className="w-5 h-5" />
          )}
          <div className="ml-2">{collectCount}</div>
        </div>
      </HoverModalWrapper>
    </>
  )
}

export default LensCollectButton
