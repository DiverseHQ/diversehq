import React from 'react'
import { useState } from 'react'
import { BsCollection, BsCollectionFill } from 'react-icons/bs'
import { modalType, usePopUpModal } from '../../Common/CustomPopUpProvider'
import FreeCollectPopUp from './FreeCollectPopUp'

const LensCollectButton = ({
  publicationId,
  totalCollects,
  hasCollectedByMe,
  author,
  collectModule
}) => {
  const [collectCount, setCollectCount] = useState(totalCollects)
  const [isCollected, setIsCollected] = useState(hasCollectedByMe)
  const { showModal } = usePopUpModal()

  const handleCollectClick = async () => {
    console.log('handleCollectClick')
    console.log('collectModule', collectModule)
    console.log('isCollected', isCollected)
    if (isCollected || !collectModule) return
    if (collectModule.__typename === 'FreeCollectModuleSettings') {
      showModal({
        component: (
          <FreeCollectPopUp
            setIsCollected={setIsCollected}
            setCollectCount={setCollectCount}
            collectModule={collectModule}
            publicationId={publicationId}
            author={author}
          />
        ),
        type: modalType.normal,
        onAction: () => {},
        extraaInfo: {}
      })
    }
  }
  return (
    <button
      disabled={isCollected || hasCollectedByMe}
      className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer flex flex-row items-center"
      onClick={handleCollectClick}
    >
      {isCollected || hasCollectedByMe ? (
        <BsCollectionFill className="w-5 h-5" />
      ) : (
        <BsCollection className="w-5 h-5" />
      )}
      <div className="ml-2">{collectCount}</div>
    </button>
  )
}

export default LensCollectButton
