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
  onBackBtnClick,
  component,
  top,
  left,
  right,
  bottom
}) => {
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
            key={'enter-animation'}
            className={`flex overflow-y-scroll no-scrollbar ${
              type === modalType.fullscreen && ''
            } enter-animation relative`}
            style={{ zIndex: 1 }}
          >
            {component}
          </div>
        )}

        {type === modalType.customposition && (
          <div
            className={`flex h-fit absolute z-10 enter-fade-animation`}
            style={{ left, bottom, top, right }}
          >
            {component}
          </div>
        )}
      </div>
    </div>
  )
}
const CustomPopUpModalProvider = ({ children }) => {
  const [modals, setModals] = useState<ModalType[]>([])
  console.log('modals', modals)
  const providerVal = {
    showModal: (modal: ModalType) => {
      console.log('showModal', modal)
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
