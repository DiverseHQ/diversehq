import React, { createContext, useContext } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/* eslint-disable */

interface ContextType {
  notifyInfo: (message: string) => void
  notifyError: (message: string) => void
  notifySuccess: (message: string) => void
}

export const NotfiyContext = createContext<ContextType>(null)

export const NotifyProvider = ({ children }) => {
  const notifyInfo = (message: string) => {
    toast.info(message, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      progress: undefined
    })
  }

  const notifyError = (message: string) => {
    toast.error(message)
  }

  const notifySuccess = (message: string) => {
    toast.success(message)
  }
  return (
    <NotfiyContext.Provider value={{ notifyInfo, notifyError, notifySuccess }}>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
      />
      {children}
    </NotfiyContext.Provider>
  )
}

export const useNotify = () => useContext(NotfiyContext)
