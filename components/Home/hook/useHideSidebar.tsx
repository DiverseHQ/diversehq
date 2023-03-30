import { useRouter } from 'next/router'

const Pathnames_To_Hide_Sidebar = [
  '/settings',
  '/p',
  '/c',
  '/explore',
  '/u',
  '/l',
  '/notification'
]

const useHideSidebar = () => {
  const router = useRouter()
  const { pathname } = router
  // hide sidebar if pathname starts with any of the pathnames in the array
  const hide = Pathnames_To_Hide_Sidebar.some((path) =>
    pathname.startsWith(path)
  )
  return hide
}

export default useHideSidebar
