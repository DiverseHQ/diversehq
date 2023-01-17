import React, { useState, useEffect } from 'react'
import { FaArrowCircleUp } from 'react-icons/fa'

const ScrollToTopButton = ({ ...props }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop
    if (scrolled > 300) {
      setVisible(true)
    } else if (scrolled <= 300) {
      setVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible)
  }, [])

  return (
    <div
      {...props}
      className={`cursor-pointer text-[36px] text-p-btn bg-p-btn-text rounded-full sticky z-10 top-[calc(100vh-110px)] md:top-[calc(100vh-60px)] left-[calc(100vw-20px)] mr-[20px] ${
        visible ? 'inline-block' : 'hidden'
      } ${props.className}`}
      onClick={scrollToTop}
    >
      <FaArrowCircleUp />
    </div>
  )
}

export default ScrollToTopButton
