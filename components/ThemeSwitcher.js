import { useEffect } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { IconSun, IconMoon } from './icons/CustomIcons'

const style = {
  background: `icon hover:bg-neutral-100 p-2 rounded-xl cursor-pointer`,
}

const ThemeSwitcher = () => {
  const { dark, setDark } = useThemeContext()
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(dark))
  }, [])
  return (
      <div
        className={
          dark
            ? style.background + ' hover:bg-slate-800'
            : style.background + ' hover:bg-neutral-100'
        }
        onClick={() => setDark(!dark)}
      >
        {dark ? <IconMoon /> : <IconSun />}
      </div>
  )
}

export default ThemeSwitcher
