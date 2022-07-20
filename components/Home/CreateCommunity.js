import {useState, useContext} from "react";
import {Web3Storage} from "web3.storage"
import {useProfile} from "../../utils/WalletContext";
import apiEndpoint from "../../api/ApiEndpoint";


const CreateCommunity = () => {
  const [showModal, setShowModal] = useState(false);
  const [communityName, setCommunityName] = useState('')
  const [communityPfp,setCommunityPfp] = useState();
  const [communityBanner,setCommunityBanner] = useState();
  const [communityDescription,setCommunityDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const {wallet, token} = useProfile();

  function hasWhiteSpace(s) {
    return /\s/g.test(s);
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    setLoading(true);
    console.log(communityName,communityPfp,communityBanner,communityDescription);
    //change space to _ for all file in files
    if(communityPfp.length != 1 && communityBanner != 1 ){
      alert("Select only one file");
      return;
    }
    // files[0].name = files[0].name.replace(/\s/g, "_");
    const newFiles = [
      new File([communityPfp[0]],communityPfp[0].name.replace(/\s/g, "_"),{type: communityPfp[0].type}),
      new File([communityBanner[0]],communityBanner[0].name.replace(/\s/g, "_"),{type: communityBanner[0].type}),  
    ]
    // const newfiles = files.map(file => file.name.replace(/\s/g, "_"));
    // console.log(communityPfp, communityBanner);
      const token = process.env.NEXT_PUBLIC_WEB_STORAGE
      const storage = new Web3Storage({ token })
      const cid = await storage.put(newFiles)
      console.log(cid);
      let PFP =`https://dweb.link/ipfs/${cid}/${newFiles[0].name}`
      console.log(PFP)
      let Banner =`https://dweb.link/ipfs/${cid}/${newFiles[1].name}`
      console.log(Banner)
      await handleCreateCommunity(PFP,Banner)
      setLoading(false);
      setShowModal(false);
    }


    const handleCreateCommunity = async (pfpURL,bannerURL) => {
        const postData = {
          name: communityName,
          description: communityDescription,
          bannerImageUrl: bannerURL,
          logoImageUrl: pfpURL,
          creator: wallet
        }
        try{
          await fetch(`${apiEndpoint}/community`,{
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

  return (
    <>
      <div className="pr-4">
        <button className="border border-black bg-purple-800 rounded-full p-3 text-white shadow-md shadow-purple-200"onClick={() => setShowModal(true)} type="button">
        Create Community
        </button>
        </div>

      {showModal ? (
            <>
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
            
            {/* <!-- Modal body --> */}
            <div className="p-6 space-y-6">
            <input type="text" className="w-full py-2 px-1 text-p-text mb-2 bg-p-bg border-none" placeholder="Commmunity Name" onChange={(e) => setCommunityName(e.target.value)} required />
            <textarea type="text" className="w-full py-2 px-1 text-p-text mb-2 bg-p-bg border-none" placeholder="Commmunity Description" onChange={(e) => setCommunityDescription(e.target.value)}  />
            <input type="file" id="communi"  placeholder="Commmunity Name" onChange={(e) =>{setCommunityPfp(e.target.files)}} hidden required />
            <input type="file"  placeholder="Commmunity Name" onChange={(e) =>{setCommunityBanner(e.target.files)}} hidden />


                <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                <input type="file" id="upload-file" accept="image/*,video/*" hidden onChange={(e) => { setFiles(e.target.files) }} />
                <div className="p-5 justify-center items-center border rounded-t">
                  Drag and Drop image/videos or 
                <button className="bg-blue-500 hover:bg-blue-700 text-p-text font-bold py-1.5 px-3.5 rounded-full ml-1"><label htmlFor="upload-file">Upload Image</label></button>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>
            </>
      ) : null}
    </>
  );
}

export default CreateCommunity