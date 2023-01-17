// import { linkPreview } from 'link-preview-node'
import React from 'react'
const access_token = 'aac9ae7191d0d2848481a2806f1dac35'
const LinkPreview = ({ url }) => {
  const [linkDetails, setLinkPreview] = React.useState(null)

  const fetchAndSetLinkPreview = async (url) => {
    try {
      console.log('url', url)
      //   const previewData = await linkPreview(
      //     'https://www.youtube.com/watch?v=5WfTEZJnv_8'
      //   ).then((r) => r)
      const previewData = await fetch(
        `https://graph.facebook.com/v15.0/?fields=og_object&id=${'https://www.youtube.com/watch?v=5WfTEZJnv_8'}&access_token=${access_token}`
      ).then((r) => r.json())
      console.log('previewData', previewData)
      setLinkPreview(previewData)
    } catch (e) {
      console.log(e)
    }
  }
  React.useEffect(() => {
    if (!url) return
    fetchAndSetLinkPreview(url)
  }, [url])

  React.useEffect(() => {
    console.log('linkDetails', linkDetails)
  }, [linkDetails])

  return <div>LinkPreview</div>
}

export default LinkPreview
