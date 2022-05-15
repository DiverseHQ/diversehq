import React, { useState, useContext } from "react";
import {Web3Storage} from "web3.storage"
import {WalletContext} from "../../utils/WalletContext";
import apiEndpoint from "./ApiEndpoint";

const CreatePostPopup = () => {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState();
  const [title, setTitle] = useState('')
  const [communityId, setCommunityId] = useState([]);
  const{user, token, loading, setLoading } = useContext(WalletContext);
  const handleSubmit = async(event) => {
    event.preventDefault();
    setLoading(true);
    console.log(files);
    //change space to _ for all file in files
    if(files.length != 1){
      alert("Select only one file");
      return;
    }
    // files[0].name = files[0].name.replace(/\s/g, "_");
    const newFiles = [
      new File([files[0]],files[0].name.replace(/\s/g, "_"),{type: files[0].type})
    ]
    
    // const newfiles = files.map(file => file.name.replace(/\s/g, "_"));
    console.log(newFiles);
    console.log(files[0]['type'].split('/')[0] === 'image');
    console.log(files[0]['type'].split('/')[0] === 'video');
      const token = process.env.NEXT_PUBLIC_WEB_STORAGE
      const storage = new Web3Storage({ token })
     if(files[0]['type'].split('/')[0] === 'image') {
      const cid = await storage.put(newFiles)
      console.log(cid);
      const Post = `https://dweb.link/ipfs/${cid}/${newFiles[0].name}`
      handleCreatePost(Post)
     }
     if(files[0]['type'].split('/')[0] === 'video'){
      const cid = await storage.put(newFiles)
      console.log(cid);
      const Post = `https://dweb.link/ipfs/${cid}/${newFiles[0].name}`
      handleVideoPost(Post)
     }
    setLoading(false);
      setShowModal(false);
    }
    const handleCreatePost = async (Post) => {
      console.log("Hey , I'm here in Image ")
      const postData = {
        communityId: communityId,
        author: user.walletAddress,
        title: title,
        postImageUrl: Post,
      }
      if(communityId && user.walletAddress && title && Post ) {
        try{
          await fetch(`${apiEndpoint}/post`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization":  token,
            },
            body: JSON.stringify(postData)
          }).then(res => res.json()).then(res => {
            console.log(res);
          })
        }catch(error){
          console.log(error);
        }
      }
      
  }

  const handleVideoPost = async (Post) => {
    console.log("Hey I'm in Video ")
    const postData = {
      communityId: communityId,
      author: user.walletAddress,
      title: title,
      postVideoUrl: Post,
    }
    if(communityId && user.walletAddress && title && Post ) {
      try{
        await fetch(`${apiEndpoint}/post`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization":  token,
          },
          body: JSON.stringify(postData)
        }).then(res => res.json()).then(res => {
          console.log(res);
        })
      }catch(error){
        console.log(error);
      }
    }
    
}

  const selectCommunity = (event) =>{  
   setCommunityId(event.target.value);
    console.log(event.target.value);
  }

    
  return (
    <>
      <div className="pr-4">
        <button className="border border-black bg-purple-800 rounded-full p-3 text-white shadow-md shadow-purple-200"onClick={() => setShowModal(true)} type="button">
        Share Creativity
        </button>
        </div>

      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">What's up Creative human?</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <form className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full">
                <div className="flex flex-col text-black">
                {communityId}
                 {user ? (
                   <label htmlFor="chooseCommunity">
                     Choose Community
                   <select name="community" id="chooseCommunity" onChange={(e) =>selectCommunity(e)}>  
                   <option>----Select community----</option> 
                   {user.communities.map((community,i) => ( 
                    <option value={community} key={i}>{community}</option>
                   ))}
                    </select>
                    {communityId}
                   </label>
                 ):(<p>Connect Wallet</p>)}                              
                  </div>
                    <label className="block text-black text-sm font-bold mb-1">
                      Share Creative Post
                    </label>
                    <input type="file" accept="image/*,video/*" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) =>{setFiles(e.target.files)}} />
                    <label className="block text-black text-sm font-bold mb-1">
                      Title
                    </label>
                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) => setTitle(e.target.value)} />
      
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Teri Mummy ..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CreatePostPopup;