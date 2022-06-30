import React, { useRef } from 'react'
import { useProfile } from '../../utils/WalletContext';
import apiEndpoint from '../Home/ApiEndpoint';

const CreateComment = ({postId}) => {
    const {user,connecting,token} = useProfile();
    const commentRef = useRef();
    const appreciateAmountRef= useRef();


    const createComment = async () => {
        const comment = commentRef.current.value;
        const appreciateAmount = appreciateAmountRef.current.value;
        if(!comment) return;
        const content = comment;
        console.log("postId",postId);
        console.log("comment",comment);
        try{
            const resp = await fetch(`${apiEndpoint}/comment`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    content,
                    postId,
                    appreciateAmount: appreciateAmount > 0? appreciateAmount : 0 
                })
            }).then(r => r);
            console.log(resp);
            if(!resp.ok) return;
            const comment = await resp.json();
            console.log(comment);
        }catch(error){
            console.log(error);
        }
    }
    return (
        <>
        {user && !connecting && (
            
            <div className="flex flex-row items-center m-2 w-96">
                <img src={user.profileImageUrl ? user.profileImageUrl : "/person.png"} className="rounded-full h-3 w-3 mr-2" />
                <div>{user.name ? user.name : user.walletAddress.substring(0,6) + "..."}</div>
                <input type="text" ref={commentRef} className="h-12 w-full bg-secondary-bg rounded-[55px]" placeholder="Write a comment..." />
                <input type="number" ref={appreciateAmountRef} className="h-12 w-16 bg-secondary-bg rounded-[55px]" placeholder="Appreciate amount..." />
                <button onClick={createComment}><img src='/send.png' className='w-8' /></button>
            </div>
        )}
        {!user && !connecting && (
            <div className="flex flex-row">Connecting...</div>)}
        </>
  )
}

export default CreateComment