import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const useRouterLoading = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const handleRouteChangeStart = () => {
    setLoading(true)
  }
  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', () => {
      setLoading(false)
    })
    router.events.on('routeChangeError', () => {
      setLoading(false)
    })
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.asPath])
  return { loading }
}

export default useRouterLoading
