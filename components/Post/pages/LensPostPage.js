import React, { useEffect, useState } from 'react'
import { usePublicationQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import CombinedCommentSection from '../LensComments/CombinedCommentSection'
import LensPostCard from '../LensPostCard'

const LensPostPage = ({ id }) => {
  const [postInfo, setPostInfo] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const { data: lensProfile } = useLensUserContext()
  const { data, error } = usePublicationQuery(
    {
      request: {
        publicationId: id
      },
      reactionRequest: {
        profileId: lensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!id
    }
  )

  useEffect(() => {
    if (!data?.publication) return
    console.log(data.publication)
    setPostInfo(data.publication)
  }, [data])

  useEffect(() => {
    if (!error) return
    setNotFound(true)
    console.log(error)
  }, [error])
  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-[650px]">
        {!postInfo && <div>Loading...</div>}

        {/* lens post card */}
        {notFound ? (
          <div className="flex items-center justify-center w-full bg-s-bg p-3 my-6 sm:rounded-3xl shadow-lg text-bold text-2xl">
            <h2>Post was deleted or does not exist</h2>
          </div>
        ) : (
          postInfo && (
            <div>
              <LensPostCard post={postInfo} setNotFound={setNotFound} />
            </div>
          )
        )}
        <CombinedCommentSection postId={id} postInfo={postInfo} />
      </div>
    </div>
  )
}

export default LensPostPage
