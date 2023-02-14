import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { BsFillArrowUpCircleFill } from 'react-icons/bs'

const ScrollToTopButton = ({ ...props }) => {
  const [visible, setVisible] = useState(false)
  const router = useRouter()

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
      // top button is up in the post page decided using router.pathname
      {...props}
      className={`cursor-pointer text-[28px] md:text-[36px] text-p-btn bg-p-btn-text  rounded-full sticky z-40 ${
        router.pathname.startsWith('/p/')
          ? 'top-[calc(100vh-160px)]'
          : 'top-[calc(100vh-110px)]'
      }  md:top-[calc(100vh-60px)] left-[calc(100vw-20px)] mr-[20px] ${
        visible ? 'inline-block' : 'hidden'
      } ${props.className}`}
      onClick={scrollToTop}
    >
      <BsFillArrowUpCircleFill />
    </div>
  )
}

export default ScrollToTopButton
