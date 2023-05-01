import { Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { useDevice } from '../../Common/DeviceWrapper'
import { FiSettings } from 'react-icons/fi'
import PostPerferenceSettings from './PostPerferenceSettings'
import { usePopUpModal } from '../../Common/CustomPopUpProvider'
import BottomDrawerWrapper from '../../Common/BottomDrawerWrapper'
import PostPreferenceDrawerModal from './PostPreferenceDrawerModal'

const PostPreferenceButton = ({ disabled = false }: { disabled?: boolean }) => {
  const { isMobile } = useDevice()
  const { showModal } = usePopUpModal()
  const [showGiphyDrawer, setShowGiphyDrawer] = useState(false)

  const showPostPreferenceModal = () => {
    showModal({
      component: <PostPerferenceSettings />
    })
  }
  return (
    <>
      <BottomDrawerWrapper
        isDrawerOpen={showGiphyDrawer}
        setIsDrawerOpen={setShowGiphyDrawer}
        showClose
        position="bottom"
      >
        <PostPreferenceDrawerModal />
      </BottomDrawerWrapper>
      <Tooltip
        placement="bottom"
        enterDelay={200}
        leaveDelay={200}
        title="Preferences"
        arrow
      >
        <button
          onClick={() => {
            if (isMobile) {
              setShowGiphyDrawer(!showGiphyDrawer)
            } else {
              showPostPreferenceModal()
            }
          }}
          disabled={disabled}
          className="rounded-full hover:bg-s-hover active:bg-s-hover p-2 cursor-pointer"
        >
          <FiSettings className="w-5 h-5" />
        </button>
      </Tooltip>
    </>
  )
}

export default PostPreferenceButton
