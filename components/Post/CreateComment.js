import React, { useEffect, useRef, useState } from 'react'
import { useProfile } from '../Common/WalletContext'
import apiEndpoint from '../../api/ApiEndpoint'
import { postComment } from '../../api/comment'
import Image from 'next/image'
import useDevice from '../Common/useDevice'
import { FiSend } from 'react-icons/fi'
import {FaHandSparkles} from 'react-icons/fa'
import { useContractWrite, useSigner  } from 'wagmi'
import { DIVE_CONTRACT_ADDRESS_RINKEBY } from '../../utils/commonUtils'
import ABI from '../../utils/DiveToken.json'
import { ethers, utils } from 'ethers'

const CreateComment = ({ postId, addCommentIdToComments, authorAddress }) => {
  const { user, token, address } = useProfile()
  const commentRef = useRef()
  const appreciateAmountRef = useRef()
  const { isDesktop } = useDevice()
  const { data: signer } = useSigner();
  const [diveContract,setDiveContract] = useState(null)

  useEffect(() => {
    if(signer){
      const contract = new ethers.Contract(DIVE_CONTRACT_ADDRESS_RINKEBY, ABI, signer)
      setDiveContract(contract)
    }
  },[signer])
  


  const transferGiveAppreciateAmount = async (appreciateAmount) => {
    try{
      console.log("authroAddress",authorAddress)
      console.log("appreciateAddress",appreciateAmount)
      const args = [authorAddress,authorAddress]
      if(!diveContract) return;

      await diveContract.transfer(authorAddress,appreciateAmount, 
        {gasLimit: 3000000, gasPrice: 30000000000}
      )

    } catch(error){
      console.log(error);
    }
  }


  const createComment = async () => {
    const comment = commentRef.current.value
    const appreciateAmount = appreciateAmountRef.current.value
    if (!comment) return
    const content = comment
    console.log('postId', postId)
    console.log('comment', comment)
    try {
      const comment = await postComment(token, content, postId, appreciateAmount);
      console.log(comment)
      addCommentIdToComments(comment._id)
      if(appreciateAmount > 0){
        let wei = utils.parseEther(appreciateAmount).toString()
        console.log("wei",wei)
        transferGiveAppreciateAmount(wei)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
        <>
        {user && token && (
            <div className="px-3 sm:px-5 items-center w-full bg-s-bg py-3 sm:rounded-3xl ">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row items-center">
                <Image src={user.profileImageUrl ? user.profileImageUrl : '/gradient.jpg'} width={isDesktop ? 30 : 25} height={isDesktop ? 30 : 25} className="rounded-full" />
                <div className='ml-2 font-bold text-xs sm:text-xl'>{user.name ? user.name : user.walletAddress.substring(0, 6) + '...'}</div>
                </div>
                <div className='flex flex-row items-center justify-center'>
                  <FaHandSparkles className='w-5 h-5 sm:w-7 sm:h-7' />
                  <input type="number" ref={appreciateAmountRef} className="outline-none pl-3 w-8 sm:w-12 mr-2 text-xs sm:text-xl font-bold" placeholder="1" />
                  <FiSend onClick={createComment} className="w-4 h-4 sm:w-7 sm:h-7 text-p-text"/>
                </div>
              </div>
              <div>
                <input type="text" ref={commentRef} className="border-none outline-none w-full mt-3 text-xs sm:text-base" placeholder="Write a comment..." />
              </div>

            </div>
        )}
        {!user && !token && (
            <div className="flex flex-row">Connect Wallet</div>)}
        </>
  )
}

export default CreateComment
