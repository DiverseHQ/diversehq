import React, { useState } from 'react';
const Home = () => {
  const [posts,setPosts] = useState([]);
  
  return (
    <div className='text-p-text'>
      <div className='flex flex-row'>
        <button>New</button> <button>Top</button>
        
      </div>

    </div>
  )
}

export default Home