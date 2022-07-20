import React, { useState, useContext, useEffect, useRef } from 'react'
import { Web3Storage } from 'web3.storage'
import { useProfile } from '../../utils/WalletContext'
import apiEndpoint from '../../api/ApiEndpoint';
import Select, {components} from 'react-select'

const CreatePostPopup = () => {
  const [showModal, setShowModal] = useState(false)
  const [files, setFiles] = useState()
  const [title, setTitle] = useState('')
  const [communityId, setCommunityId] = useState([])
  const { user, token } = useProfile()
  const [loading, setLoading] = useState(false)
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [option, setOption] = useState(null)
  const [isDropDown, setIsDropDown] = useState(false)

  const optionRef = useRef(null)
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    console.log(files)
    // change space to _ for all file in files
    if (files.length != 1) {  
      setLoading(false)
      alert('Select only one file')
      return
    }
    // files[0].name = files[0].name.replace(/\s/g, "_");
    const newFiles = [
      new File([files[0]], files[0].name.replace(/\s/g, '_'), { type: files[0].type })
    ]

    // const newfiles = files.map(file => file.name.replace(/\s/g, "_"));
    console.log(newFiles)
    console.log(files[0].type.split('/')[0] === 'image')
    console.log(files[0].type.split('/')[0] === 'video')
    const token = process.env.NEXT_PUBLIC_WEB_STORAGE
    const storage = new Web3Storage({ token })
    if (files[0].type.split('/')[0] === 'image') {
      const cid = await storage.put(newFiles)
      console.log(cid)
      const Post = `https://dweb.link/ipfs/${cid}/${newFiles[0].name}`
      handleCreatePost(Post)
    }
    if (files[0].type.split('/')[0] === 'video') {
      const cid = await storage.put(newFiles)
      console.log(cid)
      const Post = `https://dweb.link/ipfs/${cid}/${newFiles[0].name}`
      handleVideoPost(Post)
    }
    setLoading(false)
    setShowModal(false)
  }
  const handleCreatePost = async (Post) => {
    console.log("Hey , I'm here in Image ")
    const postData = {
      communityId,
      author: user.walletAddress,
      title,
      postImageUrl: Post
    }
    if (communityId && user.walletAddress && title && Post) {
      try {
        await fetch(`${apiEndpoint}/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
          body: JSON.stringify(postData)
        }).then(res => res.json()).then(res => {
          console.log(res)
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleVideoPost = async (Post) => {
    console.log("Hey I'm in Video ")
    const postData = {
      communityId,
      author: user.walletAddress,
      title,
      postVideoUrl: Post
    }
    if (communityId && user.walletAddress && title && Post) {
      try {
        await fetch(`${apiEndpoint}/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
          body: JSON.stringify(postData)
        }).then(res => res.json()).then(res => {
          console.log(res)
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
  const handleInputChange = value => {
    setValue(value)
  }

  const handleDropDown = (e) => {
    setOption(e.target.value);
    setIsDropDown(!isDropDown);
  }
 

  const getJoinedCommunities = async () => {
    console.log('pancho')
    if (user.walletAddress) {
      try {
        const response = await fetch(`${apiEndpoint}/community/getJoinedCommunitiesOfUser?walletAddress=${user.walletAddress}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
        console.log(response)
        setJoinedCommunities(response)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const customOptions = () =>{
    return(
      <div className="flex flex-col bg-s-bg absolute w-52 rounded mt-1 p-2 mx-3">  

      {
        joinedCommunities.map(community => {
          return(
            <div key={community._id} onClick={handleDropDown } className="flex flex-row items-center hover:bg-violet-600" value={community._id}>
              <img src={community.logoImageUrl}className="border border-p-bg rounded-full w-12 h-12" ></img>
              <h3 className="text-p-text mx-1 text-base">{community.name}</h3>
            </div>
          )
        })
      }
      </div>
    )
     
  }

  const PopUpModal = () =>{
    return(
      //simple modal
      <div className=" flex justify-center items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
    <div className="relative p-4 w-full max-w-xl h-full md:h-auto">
       
        <div className="relative bg-p-bg rounded-lg shadow dark:bg-gray-700">
            <div className="flex flex-row justify-between p-4 items-start rounded-t">
                <button type="button" className="text-gray-400 bg-transparent hover:text-s-text rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={(e) => setShowModal(false)}>
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>   
                </button>
                <button className="text-p-text bg-blue-500 hover:bg-blue-700 font-bold uppercase rounded-full shadow hover:shadow-lg outline-none focus:outline-none text-base px-3.5 py-1.5" type="button" onClick={handleSubmit} disabled={loading} >
                 {loading ? 'Loading ...' : 'Post'}
                </button>
            </div>
            <div className="border rounded-full text-p-text w-fit mx-3 p-0.5">
              {user && joinedCommunities
                ? (
                    <button className="text-blue-500 p-1" onClick={(e) => setIsDropDown(!isDropDown)} >Choose Communinity</button>
                  )
        : (<p>Connect Wallet</p>)}</div>
              {
                      isDropDown && customOptions()
                    }
            {/* <!-- Modal body --> */}
            <div className="p-6 space-y-6">
            <input type="text" className="w-full py-2 px-1 text-p-text mb-2 bg-p-bg border-none" placeholder="What's up!?" onChange={(e) => setTitle(e.target.value)} />
                <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                <div className="p-5 justify-center items-center border rounded-t" onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={fileDrop} >
                <input type="file" id="upload-file" accept="image/*,video/*" hidden onChange={(e) => { setFiles(e.target.files) }} />
                  Drag and Drop image/videos or 
                <button className="bg-blue-500 hover:bg-blue-700 text-p-text font-bold py-1.5 px-3.5 rounded-full ml-1"><label htmlFor="upload-file">Upload Image</label></button>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>
    )
    
  }
  
  useEffect(() =>{
    if(user){
      getJoinedCommunities();
    }
  }, [user])

  return (
    <>
      <div className="pr-4">
        <button className="border border-black bg-purple-800 rounded-full p-3 text-white shadow-md shadow-purple-200"onClick={() => setShowModal(true)} type="button">
        Share Creativity
        </button>
        </div>
      {showModal
        ? (
          PopUpModal()
          )
        : null}
    </>
  )
}

export default CreatePostPopup
