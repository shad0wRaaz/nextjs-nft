import { Bars } from 'svg-loaders-react'
import { useThemeContext } from '../contexts/ThemeContext'

const Loader = () => {
  const { dark } = useThemeContext()

  return (
    <div
      className={`${
        dark ? ' text-neutral-100' : ' text-black'
      } m-4 flex items-center justify-center text-center`}
    >
      <Bars fill={dark ? '#ffffff' : '#000000'} width="20px" height="20px" />
      <span className="pl-2">Loading</span>
    </div>
  )
}

export default Loader
