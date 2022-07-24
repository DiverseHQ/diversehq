
export const getLocalToken = () => {
  return localStorage.getItem('token')
}

export const setLocalToken = (token) => {
  return localStorage.setItem('token', token)
}
