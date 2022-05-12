import React, {useEffect,useState} from 'react'
import { useRouter } from 'next/router'
import apiEndpoint from '../../components/Home/ApiEndpoint';
const communityPage = () => {
    const {id} = useRouter().query;
    const [community,setCommunity] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        if(id) fetchCommunitInformation();
    },[id])
    const fetchCommunitInformation = async () => {
        try{
            const response = await fetch(`${apiEndpoint}/community/communityinfo/${id}`);
            console.log(response);
            if(!response.ok) return;
            const community = await response.json();
            setCommunity(community);
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
  return (
      <>
      {loading && <div>Loading...</div>}
        {!loading && community && <div>{community.name}</div>}
      </>
  )
}

export default communityPage