import { useEffect } from 'react'

export const useDebounce = (effect, delay, deps) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay)

    return () => clearTimeout(handler)
    // using || operator because
    // if its optional then it can be undefined.
  }, [...(deps || []), delay])
}
