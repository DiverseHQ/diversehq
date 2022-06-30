
import React, { createContext } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export const NotfiyContext = createContext([])

export const NotifyProvider = ({ children }) => {
  const notifyInfo = (message) => {
    console.log('notifyInfo', message)
    toast.info(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      progress: undefined
    })
  }

  const notifyError = (message) => {
    toast.error(message)
  }

  const notifySuccess = (message) => {
    toast.success(message)
  }
  return (
        <NotfiyContext.Provider value={{ notifyInfo, notifyError, notifySuccess }}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
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
