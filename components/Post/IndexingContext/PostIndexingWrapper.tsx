import { useRouter } from 'next/router'
import React from 'react'
import {
  ReactionTypes,
  useAddReactionMutation
} from '../../../graphql/generated'
import { pollUntilIndexed } from '../../../lib/indexer/has-transaction-been-indexed'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { postIdFromIndexedResult } from '../../../utils/utils'
import { putAddLensPublication } from '../../../api/lensPublication'
import { usePublicationStore } from '../../../store/publication'

/* eslint-disable */

interface ContextType {
  posts: any[]
  addPost: (tx: { txHash: string } | { txId: string }, post: any) => void
}

export const PostIndexingContext = React.createContext<ContextType>({
  posts: [],
  addPost(tx, post) {
    console.log(tx, post)
  }
})
const PostIndexingWrapper = ({ children }) => {
  const [posts, setPosts] = React.useState([])
  const { mutateAsync: addReaction } = useAddReactionMutation()
  const { data: lensProfile } = useLensUserContext()
  const router = useRouter()
  const resetAttachments = usePublicationStore(
    (state) => state.resetAttachments
  )

  const onSuccessIndex = async (result, post) => {
    try {
      const postId = postIdFromIndexedResult(
        lensProfile?.defaultProfile?.id,
        result
      )
      await addReaction({
        request: {
          profileId: lensProfile?.defaultProfile?.id,
          publicationId: postId,
          reaction: ReactionTypes.Upvote
        }
      })

      // adding lens post to db , for indexing at for you feed
      await putAddLensPublication(post.communityInfo._id, postId)

      // remove from ui
      // setPosts(posts.filter((p) => p.id !== postId))
    } catch (e) {
      console.log(e)
    }
  }

  const addPost = async (tx: { txHash: string } | { txId: string }, post) => {
    resetAttachments()
    router.push('/')
    // show for ui
    setPosts([post, ...posts])

    // indexing
    try {
      const indexResult = await pollUntilIndexed(tx)
      console.log('indexResult', indexResult)
      console.log('index success')
      await onSuccessIndex(indexResult, post)
    } catch (err) {
      console.log(err)
    }

    // remove from ui
    setPosts(posts.filter((p) => p.tempId !== post.tempId))
  }
  return (
    <PostIndexingContext.Provider value={{ posts, addPost }}>
      {children}
    </PostIndexingContext.Provider>
  )
}

export const usePostIndexing = () => React.useContext(PostIndexingContext)

export default PostIndexingWrapper
