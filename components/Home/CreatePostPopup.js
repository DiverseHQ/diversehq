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

  const selectCommunity = (value) => {
    setCommunityId(value)
    console.log(value)
  }
  // an option tag with image and text from an api response
  const customOption = (props) => (
    <div className="custom-option">
      <img src={props.data.image} alt=""/>
      <span className="custom-option-text">{props.data.name}</span>
    </div>
  )

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
      <>
      {
        joinedCommunities.map(community => {
          return(
            <div key={community._id} onClick={(e) => setOption(e.target.value)} className="flex flex-row justify-center space-between" value={community._id}>
              <img src={community.logoImageUrl} ></img>
              <span>{community.name}</span>
            </div>
          )
        })
      }
      </>
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
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-p-bg outline-none focus:outline-none">
              <div className="flex flex-row items-center justify-around mt-3">

              <div className="flex flex-row text-black">
                 {user && joinedCommunities
                   ? (
                    <Select placeholder="Select Community" components={{Option:customOptions}} options={joinedCommunities} onChange={(e) => selectCommunity(e)} className="w-fit h-7 rounded-full bg-black" />
                     )
                   : (<p>Connect Wallet</p>)}
                  </div>

                  <button
                    className="text-p-text bg-blue-500 font-bold uppercase text-sm rounded-full shadow hover:shadow-lg outline-none focus:outline-none p-1.5"
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Teri Mummy ...' : 'Post'}
                  </button>
              </div>
                <div className="relative p-6 flex-auto">
                <input type="text" className="w-full py-2 px-1 text-p-text mb-2 bg-p-bg border-none" placeholder="What's up!?" onChange={(e) => setTitle(e.target.value)} />

                  <div className="bg-s-bg shadow-md rounded px-8 pt-6 pb-8 w-full">
                
                    <label className="block text-black text-sm font-bold mb-1">
                      Share Creative Post
                    </label>
                    <input type="file" accept="image/*,video/*" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) => { setFiles(e.target.files) }} />
                    

                  </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </>
          )
        : null}
    </>
  )
}

export default CreatePostPopup
