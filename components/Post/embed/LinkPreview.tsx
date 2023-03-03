// import { linkPreview } from 'link-preview-node'
import React, { useEffect } from 'react'
// const access_token = 'aac9ae719d1d0d2848481a2806f1dac35'
import { getLinkPreview } from 'link-preview-js'
import VideoWithAutoPause from '../../Common/UI/VideoWithAutoPause'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import { stringToLength } from '../../../utils/utils'

interface LinkDetailsType {
  contentType?: string
  description?: string
  favicons?: string[]
  images?: string[]
  mediaType?: string
  siteName?: string
  title?: string
  url?: string
  videos?: string[]
  [key: string]: any
}
const LinkPreview = ({ url }: { url: string }) => {
  const [linkDetails, setLinkPreview] = React.useState<LinkDetailsType>(null)

  const fetchAndSetLinkPreview = async (url: string) => {
    try {
      console.log('url', url)
      //   const previewData = await linkPreview(
      //     'https://www.youtube.com/watch?v=5WfTEZJnv_8'
      //   ).then((r) => r)
      // const previewData = await fetch(
      //   `https://graph.facebook.com/v15.0/?fields=og_object&id=${'https://www.youtube.com/watch?v=5WfTEZJnv_8'}&access_token=${access_token}`
      // ).then((r) => r.json())

      const previewData = await getLinkPreview(url, {
        timeout: 10000
      }).then((r) => r)
      console.log('previewData', previewData)
      // @ts-ignore
      setLinkPreview(previewData)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (linkDetails) return
    fetchAndSetLinkPreview(url)
  }, [url])

  if (!linkDetails) return null

  return (
    <a href={linkDetails?.url} target="_blank" rel="noreferrer">
      <div className="mx-3 sm:mx-0 rounded-xl bg-s-bg border border-s-border hover:bg-s-hover cursor-pointer">
        {linkDetails?.videos?.length > 0 ? (
          <VideoWithAutoPause
            src={linkDetails?.videos[0]}
            className="w-full h-[220px] object-cover rounded-t-xl"
          />
        ) : (
          <>
            {' '}
            {linkDetails?.images?.[0] && (
              <ImageWithPulsingLoader
                src={linkDetails?.images?.[0]}
                className="w-full h-[220px] object-cover rounded-t-xl"
              />
            )}
          </>
        )}
        <div className="p-3">
          <div className="text-s-text text-lg font-medium">
            {linkDetails?.title}
          </div>
          <div className="text-s-text text-sm font-medium">
            {stringToLength(linkDetails?.description, 75)}
          </div>
          <div className="flex flex-row items-center py-1 space-x-1 text-s-text text-sm font-medium">
            <ImageWithPulsingLoader
              src={linkDetails?.favicons?.[0]}
              className="w-5 h-5 rounded-full object-cover"
            />
            <div>
              <span>{linkDetails?.siteName}</span>
              <span className="text-xs pl-1">{linkDetails?.url}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

export default LinkPreview
