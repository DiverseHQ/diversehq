
export const getLocalToken = ():string => {
  return localStorage.getItem('token')
}

export const setLocalToken = (token: string):string => {
  localStorage.setItem('token', token)
  return localStorage.getItem('token')
}
