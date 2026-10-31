import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

// The browser does not scroll up by itself when the router changes the page.
// When going Back ('POP') we leave the browser alone: it returns to the old position.
function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}

export default ScrollToTop
