import React from 'react'
import { useState } from 'react'
import { BsCollection, BsCollectionFill } from 'react-icons/bs'
import { CollectModule, Profile, Publication } from '../../../graphql/generated'
import { modalType, usePopUpModal } from '../../Common/CustomPopUpProvider'
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
  const { showModal }: any = usePopUpModal()

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
            publication={publication}
            author={author}
          />
        ),
        type: modalType.normal,
        onAction: () => {},
        extraaInfo: {}
      })
    }
    if (collectModule.__typename === 'FeeCollectModuleSettings') {
      showModal({
        component: (
          <FeeCollectPopUp
            setIsCollected={setIsCollected}
            setCollectCount={setCollectCount}
            collectModule={collectModule}
            publication={publication}
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
      title="Collect"
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
