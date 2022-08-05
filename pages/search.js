import Header from '../components/Header'
import Footer from '../components/Footer'
import { config } from '../lib/sanityClient'
import { useThemeContext } from '../contexts/ThemeContext'

const search = () => {
  const { dark } = useThemeContext()

  return (
    <div className={`overflow-hidden ${dark && 'darkBackground'}`}>
      <Header />
      Search Content
      <Footer />
    </div>
  )
}

export default search
