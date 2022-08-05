import Header from '../components/Header'
import Footer from '../components/Footer'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
  wrapper: 'container mx-auto',
  pageBanner: 'py-[4rem] mb-[2rem]',
  pageTitle: 'text-4xl font-bold text-center textGradBlue',
  categoryImage: 'rounded-full ring-2 ring-white h-[40px] w-[40px]',
  categoryTitle: 'text-md hover:bg-neutral-100 p-2.5 px-4 rounded-full',
}

const termsandconditions = () => {
  const { dark } = useThemeContext()

  return (
    <div className={`overflow-hidden ${dark && 'darkBackground'}`}>
      <Header />
      <div
        className={
          dark
            ? style.pageBanner + ' bg-slate-800'
            : style.pageBanner + ' bg-sky-100'
        }
      >
        <h2 className={style.pageTitle}>Terms and Conditions</h2>
      </div>
      <div className={style.wrapper}>
        <p>Coming Soon</p>
      </div>
      <Footer />
    </div>
  )
}

export default termsandconditions
