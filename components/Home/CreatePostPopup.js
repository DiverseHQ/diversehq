import React, { useState } from "react";
import {Web3Storage} from "web3.storage"



const CreatePostPopup = () => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState([]);
  const [description, setDescription] = useState('')

  const handleSubmit = async(event) => {
    event.preventDefault();
    console.log(file);
      const token = process.env.NEXT_PUBLIC_WEB_STORAGE
      const storage = new Web3Storage({ token })
      const cid = await storage.put(file)

      console.log(cid);
      console.log(`https://dweb.link/ipfs/${cid}/${file[0].name}`)
      setShowModal(false);
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
                    <label className="block text-black text-sm font-bold mb-1">
                      Share Creative Post
                    </label>
                    <input type="file" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) =>{setFile(e.target.files)}} />
                    <label className="block text-black text-sm font-bold mb-1">
                      Description
                    </label>
                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) => setDescription(e.target.value)} />
      
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
                  >
                    Submit
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