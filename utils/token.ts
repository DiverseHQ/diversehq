export const getLocalToken = (): string | null => {
  return localStorage.getItem('token')
}

export const setLocalToken = (token: string): string | null => {
  localStorage.setItem('token', token)
  return localStorage.getItem('token')
}

export const removeLocalToken = (): void => {
  localStorage.removeItem('token')
}
