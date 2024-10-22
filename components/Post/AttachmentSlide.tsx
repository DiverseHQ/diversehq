import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import SwipeableViews from 'react-swipeable-views'

const calculateMargin = (selfIndex, slideIndex, speed = 50) => {
  const diff = selfIndex - slideIndex
  if (Math.abs(diff) > 1) return 0
  return `${diff * speed}%`
}

const AttachmentSlide = ({ transition, children, renderElements }) => {
  const [index, setIndex] = useState(0)
  const [fineIndex, setFineIndex] = useState(index)
  const onChangeIndex = (i) => {
    setIndex(i)
    setFineIndex(i)
  }

  const views = children({
    fineIndex,
    injectStyle: (slideIndex, speed) => ({
      marginLeft: calculateMargin(slideIndex, fineIndex, speed),
      transition: fineIndex === index ? transition : 'none'
    })
  })

  const isSingleView = views.length < 2

  return (
    <>
      {/* <SwipeableViews
        disabled={isSingleView}
        resistance
        springConfig={{
          duration: '0.6s',
          easeFunction: '',
          delay: '0s'
        }}
        enableMouseEvents
        {...props}
        index={index}
        onChangeIndex={onChangeIndex}
        onSwitching={(i) => {
          setFineIndex(i)
        }}
        // className="items-center justify-center"
        containerStyle={{ alignItems: 'center' }}
      >
        {views}
      </SwipeableViews> */}
      {!isSingleView && renderElements({ index, onChangeIndex })}
    </>
  )
}

AttachmentSlide.propTypes = {
  transition: PropTypes.string,
  children: PropTypes.func.isRequired,
  renderElements: PropTypes.func
}
AttachmentSlide.defaultProps = {
  transition: '0.8s',
  renderElements: () => {}
}

export default AttachmentSlide
