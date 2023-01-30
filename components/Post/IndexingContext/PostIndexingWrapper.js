import { useRouter } from 'next/router'
import React from 'react'
import {
  ReactionTypes,
  useAddReactionMutation
} from '../../../graphql/generated'
import { pollUntilIndexed } from '../../../lib/indexer/has-transaction-been-indexed'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { postIdFromIndexedResult } from '../../../utils/utils'
export const PostIndexingContext = React.createContext({})
const PostIndexingWrapper = ({ children }) => {
  const [posts, setPosts] = React.useState([])
  const { mutateAsync: addReaction } = useAddReactionMutation()
  const { data: lensProfile } = useLensUserContext()
  const router = useRouter()

  const onSuccessIndex = async (result) => {
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

      // remove from ui
      setPosts(posts.filter((p) => p.id !== postId))
    } catch (e) {
      console.log(e)
    }
  }

  const addPost = async (tx, post) => {
    router.push('/')
    console.log('addPost', tx, post)
    // show for ui
    setPosts([post, ...posts])

    // indexing
    console.log('index start...')
    const indexResult = await pollUntilIndexed(tx)
    console.log('index end...', indexResult)
    onSuccessIndex(indexResult)

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
