import { create } from 'zustand'
import { Comment, Publication } from '../graphql/generated'
/* eslint-disable */
interface CommentState {
  currentReplyComment: Comment | Publication | null
  setCurrentReplyComment: (comment: Comment | Publication | null) => void
}

export const useCommentStore = create<CommentState>((set) => ({
  currentReplyComment: null,
  setCurrentReplyComment: (comment) =>
    set(() => ({ currentReplyComment: comment }))
}))
