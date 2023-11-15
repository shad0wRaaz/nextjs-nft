 import { useEffect } from 'react'
import { useThemeContext } from '../contexts/ThemeContext'
import { IconSun, IconMoon } from './icons/CustomIcons'

const style = {
  background: `icon hover:bg-neutral-100 p-2 -mr-2 rounded-xl cursor-pointer`,
}

const ThemeSwitcher = () => {
  const { dark, setDark } = useThemeContext()

  useEffect(() => {
    const themeStyle = localStorage.getItem('theme');
    
    if(dark != themeStyle){
      const themeStyle = localStorage.setItem('theme', !themeStyle);
      setDark(!themeStyle)
    }
    // if(themeStyle){
    //   localStorage.setItem('theme', themeStyle)
    // }{
    //   localStorage.setItem('theme', themeStyle)
    // }
    return() => {}
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', dark);
  }, [dark])
  return (
      <div
        className=""
        onClick={() => setDark(!dark)}
      >
        {!dark ? 
        <div className="flex gap-2">
          <IconMoon className="inline" /> Dark Mode
        </div> 
        :
        <div className="flex gap-2">
          <IconSun className="inline" /> Light Mode
      </div>}
      </div>
  )
}

export default ThemeSwitcher
