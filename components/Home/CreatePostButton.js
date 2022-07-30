import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AiFillPlusCircle } from 'react-icons/ai'
import CreatePostPopup from './CreatePostPopup'
import { useRouter } from 'next/router'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'

const CreatePostButton = () => {
  const router = useRouter()
  const { query } = router  
  const { showModal, hideModal } = usePopUpModal();

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
