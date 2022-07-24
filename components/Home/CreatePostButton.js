import Link from 'next/link';
import React, {useEffect, useState} from 'react'
import { AiFillPlusCircle } from 'react-icons/ai'
import CreatePostPopup from './CreatePostPopup';
import { useRouter } from 'next/router'

const CreatePostButton = () => {
  const router = useRouter()
  const { query } = router


  return (
    <>
    {/* <button onClick={() => {router.push(`/?post=${submit}`),{ shallow: true }}} className="rounded w-12 h-12" >
        < AiFillPlusCircle className="w-12 h-12" />
    </button> */}
    <Link href={`/?post=submit`} as="/submit" >< AiFillPlusCircle className="w-12 h-12" /></Link>
    {
      (query.post === 'submit') && ( <CreatePostPopup  /> )
    }
    
    
    </>
  )
}

export default CreatePostButton