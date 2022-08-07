import React, { useContext, useEffect, useState , createContext } from 'react'


export const CustomPopUpModalContext = createContext([])
export const modalType = {
  normal: 'NORMAL',
  large: 'LARGE',
  medium: 'MEDIUM',
  customposition: 'CUSTOM_POSITION',
  fullscreen: 'FULLSCREEN'
}
const Modal = ({ type, show, onBackBtnClick, component, top, left, right, bottom }) => {
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

  if (visiblity )
    return (
      <div className='flex flex-row justify-center items-center fixed z-40 no-scrollbar w-full h-full'>
        <div className='flex justify-center items-center relative w-full h-full'>
          <div
            className={`w-full h-full absolute ${type !== modalType.customposition && 'bg-t-bg'} z-0`}
            onClick={onBackBtnClick}
          ></div>
          {type !== modalType.customposition && (
            <div
              key={show ? 'enter-animation' : ' exit-animation '}
              className={`flex overflow-y-scroll no-scrollbar ${type === modalType.fullscreen && ''} ${show ? 'enter-animation' : 'exit-animation'} relative`}
              style={{ zIndex: 1 }}
            >
              {component}
            </div>
          )}
          
          {type === modalType.customposition && (
            <div
              className={`flex h-fit absolute z-10 ${show ? 'enter-fade-animation' : 'exit-fade-animation '}`}
              style={{left, bottom,top, right  }}
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
          top={modal.extraaInfo.top ? modal.extraaInfo.top : "auto"}
          left={modal.extraaInfo.left ? modal.extraaInfo.left : "auto"}
          bottom={modal.extraaInfo.bottom ? modal.extraaInfo.bottom : "auto"}
          right={modal.extraaInfo.right ? modal.extraaInfo.right : "auto"}
        />
        {children}
      </>
    </CustomPopUpModalContext.Provider>
  )
}
export default CustomPopUpModalProvider
export const usePopUpModal = () => useContext(CustomPopUpModalContext)
