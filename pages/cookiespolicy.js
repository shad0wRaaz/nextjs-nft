import Header from '../components/Header'
import Footer from '../components/Footer'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
  wrapper: 'container mx-auto',
  pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
  pageTitle: 'text-4xl font-bold text-center text-white',
  categoryImage: 'rounded-full ring-2 ring-white h-[40px] w-[40px]',
  categoryTitle: 'text-md hover:bg-neutral-100 p-2.5 px-4 rounded-full',
}

const cookiespolicy = () => {
  const { dark } = useThemeContext()

  const style = {
    wrapper: 'container mx-auto lg:p-[8rem] p-[2rem] lg:pt-4 lg:pb-0',
    pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
    pageTitle: 'text-4xl font-bold text-center text-white',
    section: 'py-8',
    header: 'font-bold text-xl mb-2',
    table: `rounded-3xl border ${dark ? 'border-slate-700' : 'border-neutral-100'} w-[56] p-4 mt-4`,
    tableRow: `flex gap-4 flex-col md:flex-row items-center border-b ${dark ? 'border-slate-700' : 'border-neutral-100'} p-8`,
    tableColFirst: 'w-full md:w-[100px] md:min-w-[100px] text-center font-bold',
    anothertableColFirst: 'w-full md:w-[250px] md:min-w-[250px] text-center font-bold',
    tableColSecond: 'grow',
  }

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
        <h2 className={style.pageTitle}>Cookies Policy</h2>
      </div>
      <div className={style.wrapper}>
        <div className={style.section}>
          <p className={style.header}>Scope of this policy</p>
          1. NUVA NFT (we or us or our) uses cookies when you visit our website, nuvatoken.com, (the Website) to help customise the Website and improve your experience using the Website.<br/><br/>
          2. This policy applies between you, the user of this Website, and us, NUVA NFT, the owner and provider of this Website.<br/><br/>
          3. When you visit the Website, and before your Website places cookies on your computer, you will be presented with a message bar requesting your consent to set those cookies. By giving your consent to the placing of cookies, you are enabling us to provide a better experience and service. You may, if you wish, deny consent to the placing of these cookies; however, certain features of the Website may not function fully or as intended.<br/><br/>
          4. This cookie policy should be read alongside, and in addition to, our Privacy Policy, which can be found at: <a href="/privacypolicy" className="underline text-blue-500">https://nuvanft.io/privacypolicy</a>.
        </div>

        <div className={style.section}>
          <p className={style.header}>What are cookies?</p>
          5. A cookie is a small text file placed on your computer by this Website when you visit certain parts of the Website and/or when you use certain features of the Website.<br/><br/>
          6. This Website may place and access certain cookies on your computer. We use these cookies to improve your experience of using the Website and to improve our range of services.<br/><br/>
          7. Cookies do not usually contain any information that personally identifies you, the Website user. However, personal information that we store about you may be linked to the information obtained from and stored in cookies. For more information on how such personal information is handled and stored, refer to our Privacy Policy which is available online at: <a href="/privacypolicy" className="underline">https://nuvanft.io/privacypolicy</a>.
        </div>

        <div className={style.section}>
          <p className={style.header}>Types of Cookie</p>
          8. This website uses following types of cookie
          <div className={style.table}>
            <div className={`${style.tableRow} border-b-0 rounded-xl ${dark ? 'bg-slate-800' : 'bg-neutral-100'}`}>
              <div className={style.anothertableColFirst}>
                Types of Cookie
              </div>
              <div className={style.tableColSecond}>
                Purpose
              </div>
            </div>
            <div className={style.tableRow}>
              <div className={style.anothertableColFirst}>
              Strictly necessary cookies
              </div>
              <div className={style.tableColSecond}>
              These are cookies that are required for the operation of our website. They include, for example, cookies that enable you to log into secure areas of our website, use a shopping cart or make use of e-billing services.
              </div>
            </div>
            <div className={style.tableRow}>
              <div className={style.anothertableColFirst}>
              Analytical/performance cookies
              </div>
              <div className={style.tableColSecond}>
              They allow us to recognise and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.
              </div>
            </div>
            <div className={style.tableRow}>
              <div className={style.anothertableColFirst}>
              Functionality cookies
              </div>
              <div className={style.tableColSecond}>
              These are used to recognise you when you return to our website. This enables us to personalise our content for you, greet you by name and remember your preferences (for example, your choice of language or region). By using the Website, you agree to our placement of functionality cookie.
              </div>
            </div>
            <div className={`${style.tableRow} border-b-0`}>
              <div className={style.anothertableColFirst}>
              Targeting cookies
              </div>
              <div className={style.tableColSecond}>
              These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information to make our website and the advertising displayed on it more relevant to your interests. We may also share this information with third parties for this purpose.
              </div>
            </div>
          </div>
          <br/><br/>
          9.You can find a list of the cookies that we use in the attached Cookie Schedule.<br/><br/>
          10. We have carefully chosen these cookies and have taken steps to ensure that your privacy is protected and respected at all times.
        </div>

        <div className={style.section}>
          <p className={style.header}>How to control your cookie?</p>
          11. We give you control over which cookies we use. You can adjust your cookies preferences at any time at:nuvanft.io.<br/><br/>
          12. You can also choose to enable or disable cookies in your internet browser. By default, most internet browsers accept cookies but this can be changed. For further details, please see the help menu in your internet browser.<br/><br/>
          13. You can switch off cookies at any time, however, you may lose information that enables you to access the Website more quickly and efficiently.<br/><br/>
          14. It is recommended that you ensure that your internet browser is up-to-date and that you consult the help and guidance provided by the developer of your internet browser if you are unsure about adjusting your privacy settings.<br/><br/>
          15. For more information generally on cookies, including how to disable them, please refer to aboutcookies.org. You will also find details on how to delete cookies from your computer.
        </div>

        <div className={style.section}>
          <p className={style.header}>Changes to this policy</p>
          16. NUVA NFT reserves the right to change this cookie policy as we may deem necessary from time to time or as may be required by law. Any changes will be immediately posted on the Website and you are deemed to have accepted the terms of the cookie policy on your first use of the Website following the alterations. 
        </div>

        <div className={style.section}>
          <p className={style.header}>Contact Details</p>
          17. The Website is owned by NUVA NFT incorporated in England and Wales with registered number 13800011 whose registered office is at 75 Whitechapel road, London, E1 1DU, England.<br/><br/>
          You may contact us by email at <a href="mailto:enquiry@metanuva.com" className="underline text-blue-500">enquiry@metanuva.com</a>

        </div>
      </div>
      <Footer />
    </div>
  )
}

export default cookiespolicy
