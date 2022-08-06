import React from 'react'
import { AiFillPlusCircle } from 'react-icons/ai'
import CreatePostPopup from './CreatePostPopup'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'

const CreatePostButton = () => {
  const { showModal } = usePopUpModal();

  const creatPost = () => {
        // setShowOptions(!showOptions)
        showModal( 
          {
            component: <CreatePostPopup />,
            type: modalType.normal,
            onAction: () => {},
            extraaInfo: {
              
            }
          }
        )
      }

  return (
    <>
    <button onClick={creatPost} >< AiFillPlusCircle className="w-12 h-12 mb-7 text-p-btn hover:cursor-pointer" /></button>
    </>
  )
}

export default CreatePostButton
