
import React, { createContext, useContext } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export const NotfiyContext = createContext([])

export const NotifyProvider = ({ children }) => {
  const notifyInfo = (message) => {
    console.log('notifyInfo', message)
    toast.info(message, {
      position: 'top-right',
      autoClose: 2000,
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
                autoClose={2000}
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

export const useNotify = () => useContext(NotfiyContext);
