import { useState, useEffect } from "react"

export const useDeviceInput = () => {
  const [hasKeyboard, setHasKeyboard] = useState(false)

  useEffect(() => {
    // 1. Media Query Check for a 'fine' pointer (mouse)
    const mql = window.matchMedia("(pointer: fine)")
    setHasKeyboard(mql.matches)

    // Dymamic updates:
    // const handler = (e: MediaQueryListEvent) => setHasKeyboard(e.matches)
    // mql.addEventListener("change", handler)

    // // 2. Fallback/Hybrid Check: Listen for the first 'keydown'
    // // Some tablets have detachable keyboards.
    // const keyHandler = () => {
    //   setHasKeyboard(true)
    //   window.removeEventListener("keydown", keyHandler)
    // };
    // window.addEventListener("keydown", keyHandler)

    // return () => {
    //   mql.removeEventListener("change", handler)
    //   window.removeEventListener("keydown", keyHandler)
    // }
  }, [])

  return {hasKeyboard}
}