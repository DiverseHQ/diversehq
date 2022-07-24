import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AiFillPlusCircle } from 'react-icons/ai'
import CreatePostPopup from './CreatePostPopup'
import { useRouter } from 'next/router'

const CreatePostButton = () => {
  const router = useRouter()
  const { query } = router

  return (
    <>
    <Link href={'/?post=submit'} as="/submit" >< AiFillPlusCircle className="w-12 h-12 mb-7 text-p-btn hover:cursor-pointer" /></Link>
    {
      (query.post === 'submit') && (<CreatePostPopup />)
    }

    </>
  )
}

export default CreatePostButton
