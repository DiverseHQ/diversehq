import React from 'react'
import LensPageProfileCard from './Cards/LensPageProfileCard'

// return words that are starting with @ and ending with .lens or .test
export const getAllMentionsHandlFromContent = (content: string): string[] => {
  const mentions = content
    .match(/@[a-zA-Z0-9_]+(\.lens|\.test)/g)
    ?.map((mention) => {
      let handle = mention.replace('@', '')
      return handle
    })
  // set of unique handles
  const uniqueHandles = new Set(mentions)
  return Array.from(uniqueHandles)
}

const PostPageMentionsColumn = ({
  content,
  isLensCommunityPost
}: {
  content: string
  isLensCommunityPost?: boolean
}) => {
  let handles = getAllMentionsHandlFromContent(content)
  if (isLensCommunityPost) {
    handles = handles.slice(1)
  }
  return (
    <>
      {handles && handles?.length > 0 && (
        <>
          {/* <div className="px-5 mt-6 font-medium">Mentions</div> */}
          {handles.map((handle) => {
            return <LensPageProfileCard profileHandle={handle} key={handle} />
          })}
        </>
      )}
    </>
  )
}

export default PostPageMentionsColumn
