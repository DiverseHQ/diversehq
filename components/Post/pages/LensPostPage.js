import React, { useEffect, useState } from 'react'
import { usePublicationQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import CombinedCommentSection from '../LensComments/CombinedCommentSection'
import LensPostCard from '../LensPostCard'

const LensPostPage = ({ id, post }) => {
  const [postInfo, setPostInfo] = useState(post)
  // const [notFound, setNotFound] = useState(false)
  const { data: lensProfile } = useLensUserContext()
  const { data } = usePublicationQuery(
    {
      request: {
        publicationId: id
      },
      reactionRequest: {
        profileId: lensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!id && !!lensProfile?.defaultProfile?.id
    }
  )

  useEffect(() => {
    if (!data?.publication) return
    console.log('data.publication', data.publication)
    setPostInfo(data.publication)
  }, [data])

  // useEffect(() => {
  //   if (!error) return
  //   setNotFound(true)
  //   console.log(error)
  // }, [error])
  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-[650px]">
        {!post && (
          <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 animate-pulse my-3 sm:my-6">
            <div className="w-full flex flex-row items-center space-x-4 p-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 rounded-full animate-pulse" />
              <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
              <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
            </div>
            <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
              <div className="w-6 sm:w-[50px] h-4 " />
              <div className="w-full mr-4 rounded-2xl bg-gray-300 h-[200px] sm:h-[300px]" />
            </div>
          </div>
        )}

        {/* lens post card */}
        {postInfo && (
          <div>
            <LensPostCard post={postInfo} />
          </div>
        )}
        <CombinedCommentSection postId={id} postInfo={postInfo} />
      </div>
    </div>
  )
}

export default LensPostPage
