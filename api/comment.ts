import apiEndpoint from "./ApiEndpoint"
import { CommentType } from "../utils/types"

export const postComment = async (token: string, content: string, postId: string, appreciateAmount: number): Promise<CommentType> => {
    return await fetch(`${apiEndpoint}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify({
            content,
            postId,
            appreciateAmount: (appreciateAmount > 0 ? appreciateAmount : 0)
        })
    }).then(r => r.json())
}

export const putEditComment = async (token: string, commentData: CommentType) => {
    return await fetch(`${apiEndpoint}/comment/edit/${commentData._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(commentData)
    }).then((res) => res)
}

export const deleteComment = async (token: string, commentId: string) => {
    return await fetch(`${apiEndpoint}/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
    }).then(r => r.json())
}