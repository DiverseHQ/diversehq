import { Tooltip } from '@mui/material'
// import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import useDevice from '../Common/useDevice'
// import OptionsWrapper from '../Common/OptionsWrapper'
import GifSelector from './GifSelector'

const Giphy = ({ setGifAttachment }) => {
  const [showGiphyModal, setShowGiphyModal] = useState(false)
  const gifButtonRef = useRef(null)
  const { isMobile } = useDevice()
  const [showGiphyDrawer, setShowGiphyDrawer] = useState(false)
  return (
    <>
      {showGiphyModal && (
        <GifSelector
          setGifAttachment={setGifAttachment}
          setShowModal={setShowGiphyModal}
          bottom={
            window.innerHeight -
            gifButtonRef?.current?.getBoundingClientRect().top +
            10 +
            'px'
          }
          left={gifButtonRef?.current?.getBoundingClientRect().left + 'px'}
        />
      )}
      <BottomDrawerWrapper
        isDrawerOpen={showGiphyDrawer}
        setIsDrawerOpen={setShowGiphyDrawer}
        showClose
        position="bottom"
      >
        <GifSelector
          setGifAttachment={setGifAttachment}
          setShowModal={setShowGiphyModal}
          bottom={
            window.innerHeight -
            gifButtonRef?.current?.getBoundingClientRect().top +
            10 +
            'px'
          }
          setShowGiphyDrawer={(value) => setShowGiphyDrawer(value)}
          left={gifButtonRef?.current?.getBoundingClientRect().left + 'px'}
        />
      </BottomDrawerWrapper>
      <Tooltip placement="bottom" arrow title="Add GIF">
        <button
          type="button"
          onClick={() => {
            if (isMobile) {
              setShowGiphyDrawer(!showGiphyDrawer)
            } else {
              setShowGiphyModal(!showGiphyModal)
            }
          }}
          aria-label="Choose GIFs"
          id="giphy-button"
          ref={gifButtonRef}
        >
          <div className="fill-p-text w-full">
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <g>
                <path d="M19 10.5V8.8h-4.4v6.4h1.7v-2h2v-1.7h-2v-1H19zm-7.3-1.7h1.7v6.4h-1.7V8.8zm-3.6 1.6c.4 0 .9.2 1.2.5l1.2-1C9.9 9.2 9 8.8 8.1 8.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1 0 1.8-.4 2.4-1.1v-2.5H7.7v1.2h1.2v.6c-.2.1-.5.2-.8.2-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.6 1.6-1.6z" />
                <path d="M20.5 2.02h-17c-1.24 0-2.25 1.007-2.25 2.247v15.507c0 1.238 1.01 2.246 2.25 2.246h17c1.24 0 2.25-1.008 2.25-2.246V4.267c0-1.24-1.01-2.247-2.25-2.247zm.75 17.754c0 .41-.336.746-.75.746h-17c-.414 0-.75-.336-.75-.746V4.267c0-.412.336-.747.75-.747h17c.414 0 .75.335.75.747v15.507z" />
              </g>
            </svg>
          </div>
        </button>
      </Tooltip>
    </>
  )
}

export default Giphy
