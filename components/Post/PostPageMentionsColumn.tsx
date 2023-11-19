import React from 'react'
import LensPageProfileCard from './Cards/LensPageProfileCard'
import { postWithCommunityInfoType } from '../../types/post'

// return words that are starting with @ and ending with .lens or .test
export const getAllMentionsHandlFromContent = (content: string): string[] => {
  const mentions = content
    .match(/@[a-zA-Z0-9_-]+(\.lens|\.test)/g)
    ?.map((mention) => {
      let handle = mention.replace('@', '')
      return handle
    })
  // set of unique handles
  const uniqueHandles = new Set(mentions)
  return Array.from(uniqueHandles)
}

const PostPageMentionsColumn = ({
  post
}: {
  post: postWithCommunityInfoType
}) => {
  return (
    <>
      {post?.profilesMentioned?.length > 0 && (
        <>
          {/* <div className="px-5 mt-6 font-medium">Mentions</div> */}
          {post?.profilesMentioned.map((profile) => {
            return (
              <LensPageProfileCard
                _profile={profile?.profile}
                key={profile?.profile?.id}
              />
            )
          })}
        </>
      )}
    </>
  )
}

export default PostPageMentionsColumn
