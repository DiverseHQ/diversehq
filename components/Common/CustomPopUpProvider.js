import { useContext, useEffect, useState } from 'react'
import React from 'react'
import { createContext } from 'react'
import useWindowSize from './useWindowSize'
export const CustomPopUpModalContext = createContext([])
export const modalType = {
  normal: 'NORMAL',
  large: 'LARGE',
  medium: 'MEDIUM',
  customposition: 'CUSTOM_POSITION'
}
const Modal = ({ type, show, onBackBtnClick, component, top, left }) => {
  const [visiblity, setVisiblity] = useState(show)
  let TimeOut
  useEffect(() => {
    if (TimeOut) {
      clearTimeout(TimeOut)
    }
    if (!show) {
      setTimeout(() => {
        setVisiblity(false)
      }, 300)
    } else {
      setVisiblity(true)
    }
  }, [show])
  const [windowHeight, windowWidth] = useWindowSize()

  if (visiblity)
    return (
      <div className='flex flex-row justify-center items-center fixed z-50 no-scrollbar w-full h-full'>
        <div className='flex justify-center items-center relative w-full h-full p-6'>
          <div
            className={`w-full h-full absolute ${type != modalType.customposition && 'bg-t-bg'} z-0`}
            onClick={onBackBtnClick}
          ></div>
          {type != modalType.customposition && (
            <div
              key={show ? 'enter-animation' : ' exit-animation '}
              className={`flex h-fit max-h-full  max-w-[90%]  overflow-y-scroll no-scrollbar ${
                type == modalType.large ? 'w-[85vw]' : type == modalType.medium ? 'w-[60vw]' : ''
              } ${show ? 'enter-animation' : 'exit-animation'} relative`}
              style={{ zIndex: 1 }}
            >
              {component}
            </div>
          )}
          {type == modalType.customposition && (
            <div
              className={`flex h-fit ${show ? 'enter-fade-animation' : 'exit-fade-animation '}`}
              style={{ zIndex: 1, position: 'absolute', top, left }}
            >
              {component}
            </div>
          )}
        </div>
      </div>
    )

  return <></>
}
const CustomPopUpModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    visiblity: false,
    type: 'normal',
    component: <></>,
    onAction: () => {},
    extraaInfo: {}
  })

  const providerVal = {
    modal,
    showModal: ({ component, type, onAction = () => {}, extraaInfo = {} }) => {
      setModal({ ...modal, visiblity: true, component, type, onAction, extraaInfo })
    },
    hideModal: () => {
      setModal({ ...modal, visiblity: false, onAction: () => {} })
    }
  }
  return (
    <CustomPopUpModalContext.Provider value={providerVal}>
      <>
        <Modal
          show={modal.visiblity}
          type={modal.type}
          component={modal.component}
          onBackBtnClick={providerVal.hideModal}
          top={modal.extraaInfo.top ? modal.extraaInfo.top : 0}
          left={modal.extraaInfo.left ? modal.extraaInfo.left : 0}
        />
        {children}
      </>
    </CustomPopUpModalContext.Provider>
  )
}
export default CustomPopUpModalProvider
export const usePopUpModal = () => useContext(CustomPopUpModalContext)
