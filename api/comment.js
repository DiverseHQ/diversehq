import apiEndpoint from "./ApiEndpoint"

export const postComment = async (token,content, postId, appreciateAmount) => {
    return await fetch(`${apiEndpoint}/comment`,{
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