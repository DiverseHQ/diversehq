import React, { useContext, useEffect, useState, createContext } from 'react'

interface ModalType {
  visiblity?: boolean
  component: any
  type?: string
  onAction?: () => void
  extraaInfo?: any
}
/* eslint-disable */
interface ContextType {
  showModal: ({
    visiblity,
    component,
    type,
    onAction,
    extraaInfo
  }: ModalType) => void
  hideModal: () => void
}

export const CustomPopUpModalContext = createContext<ContextType>(null)
export const modalType = {
  normal: 'NORMAL',
  large: 'LARGE',
  medium: 'MEDIUM',
  customposition: 'CUSTOM_POSITION',
  fullscreen: 'FULLSCREEN'
}
const Modal = ({
  type,
  show,
  onBackBtnClick,
  component,
  top,
  left,
  right,
  bottom
}) => {
  const [visiblity, setVisiblity] = useState<boolean>(show)
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

  if (visiblity)
    return (
      <div className="flex flex-row justify-center items-center fixed z-50 no-scrollbar w-full h-full">
        <div className="flex justify-center items-center relative w-full h-full">
          <div
            className={`w-full h-full absolute ${
              type !== modalType.customposition &&
              'bg-black/40 backdrop-opacity-40  backdrop-blur-sm'
            } z-0`}
            onClick={onBackBtnClick}
          ></div>
          {type !== modalType.customposition && (
            <div
              key={show ? 'enter-animation' : ' exit-animation '}
              className={`flex overflow-y-scroll no-scrollbar ${
                type === modalType.fullscreen && ''
              } ${show ? 'enter-animation' : 'exit-animation'} relative`}
              style={{ zIndex: 1 }}
            >
              {component}
            </div>
          )}

          {type === modalType.customposition && (
            <div
              className={`flex h-fit absolute z-10 ${
                show ? 'enter-fade-animation' : 'exit-fade-animation '
              }`}
              style={{ left, bottom, top, right }}
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
  const [modals, setModals] = useState<ModalType[]>([])

  const providerVal = {
    showModal: (modal: ModalType) => {
      setModals((prev) => [...prev, modal])
    },
    hideModal: () => {
      setModals((prev) => {
        prev.pop()
        return [...prev]
      })
    }
  }
  return (
    <CustomPopUpModalContext.Provider value={providerVal}>
      <>
        {modals.map((modal) => (
          <Modal
            show={modal.visiblity}
            type={modal.type}
            component={modal.component}
            onBackBtnClick={providerVal.hideModal}
            top={modal.extraaInfo.top ? modal.extraaInfo.top : 'auto'}
            left={modal.extraaInfo.left ? modal.extraaInfo.left : 'auto'}
            bottom={modal.extraaInfo.bottom ? modal.extraaInfo.bottom : 'auto'}
            right={modal.extraaInfo.right ? modal.extraaInfo.right : 'auto'}
          />
        ))}
        {children}
      </>
    </CustomPopUpModalContext.Provider>
  )
}
export default CustomPopUpModalProvider
export const usePopUpModal = () => useContext(CustomPopUpModalContext)
