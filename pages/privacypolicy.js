import Header from '../components/Header'
import Footer from '../components/Footer'
import { useThemeContext } from '../contexts/ThemeContext'

const privacypolicy = () => {
  const { dark } = useThemeContext()

  const style = {
    wrapper: 'container mx-auto lg:p-[8rem] p-[2rem] lg:pt-4 lg:pb-0',
    pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
    pageTitle: 'text-4xl font-bold text-center text-white',
    categoryImage: 'rounded-full ring-2 ring-white h-[40px] w-[40px]',
    categoryTitle: 'text-md hover:bg-neutral-100 p-2.5 px-4 rounded-full',
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
        <h2 className={style.pageTitle}>Privacy Policy</h2>
      </div>
      <div className={style.wrapper}>
        <p>This privacy policy applies between you, the User of this Website, and NUVA NFT, the owner and provider of this Website. NUVA NFT takes the privacy of your information very seriously. This privacy policy applies to our use of any and all Data collected by us or provided by you in relation to your use of the Website.
          <br/>This privacy policy should be read alongside, and in addition to, our Terms and Conditions, which can be found at: <a href="/termsandconditions" className="underline text-blue-500">https://nuvanft.io/termsandconditions</a>.
        </p><br/>
        <p>Please read this privacy policy carefully.</p>
        <br/>
        <div className={style.section}>
          <p className={style.header}>Definition and Interpretation</p>
          <p>1. In this privacy policy, the following definitions are used:</p>
          <div className={style.table}>
            <div className={style.tableRow}>
              <div className={style.tableColFirst}>
                Data
              </div>
              <div className={style.tableColSecond}>
                collectively all information that you submit to NUVA NFT via the Website. This definition incorporates, where applicable, the definitions provided in the Data Protection Laws;
              </div>
            </div>
            <div className={style.tableRow}>
              <div className={style.tableColFirst}>
                Cookies
              </div>
              <div className={style.tableColSecond}>
              a small text file placed on your computer by this Website when you visit certain parts of the Website and/or when you use certain features of the Website. Details of the cookies used by this Website are set out in the clause below (Cookies);
              </div>
            </div>
            <div className={style.tableRow}>
              <div className={style.tableColFirst}>
                Data Protection Laws
              </div>
              <div className={style.tableColSecond}>
                any applicable law relating to the processing of personal Data, including but not limited to the GDPR, and any national implementing and supplementary laws, regulations, and secondary legislation;
              </div>
            </div>
            <div className={style.tableRow}>
              <div className={style.tableColFirst}>
                GDPR
              </div>
              <div className={style.tableColSecond}>
                the UK General Data Protection Regulation;
              </div>
            </div>
            <div className={style.tableRow}>
              <div className={style.tableColFirst}>
                Nuva NFT, we or us
              </div>
              <div className={style.tableColSecond}>
                NUVA NFT a company incorporated in England and Wales with registered number NUVA NFT whose registered office is at 75 Whitechapel road, London, E1 1DU;
              </div>
            </div>
            <div className={style.tableRow}>
              <div className={style.tableColFirst}>
                UK and EU Cookie Law
              </div>
              <div className={style.tableColSecond}>
                the Privacy and Electronic Communications (EC Directive) Regulations 2003 as amended by the Privacy and Electronic Communications (EC Directive) (Amendment) Regulations 2011 & the Privacy and Electronic Communications (EC Directive) (Amendment) Regulations 2018;
              </div>
            </div>
            <div className={style.tableRow}>
              <div className={style.tableColFirst}>
                User and you
              </div>
              <div className={style.tableColSecond}>
                any third party that accesses the Website and is not either (i) employed by NUVA NFT and acting in the course of their employment or (ii) engaged as a consultant or otherwise providing services to NUVA NFT and accessing the Website in connection with the provision of such services; and
              </div>
            </div>
            <div className={`${style.tableRow} border-b-0`}>
              <div className={style.tableColFirst}>
                Website
              </div>
              <div className={style.tableColSecond}>
              the website that you are currently using, nuvanft.io, and any sub-domains of this site unless expressly excluded by their own terms and conditions.
              </div>
            </div>
          </div>
          <br/><br/>
          <p>2. In this privacy policy, unless the context requires a different interpretation:</p><br/>
          <ol className="pl-8">
            <li>1. the singular includes the plural and vice versa;</li>
            <li>2. references to sub-clauses, clauses, schedules, or appendices are to sub-clauses, clauses, schedules or appendices of this privacy policy;</li>
            <li>3. a reference to a person includes firms, companies, government entities, trusts and partnerships;</li>
            <li>4. "including" is understood to mean "including without limitation";</li>
            <li>5. reference to any statutory provision includes any modification or amendment of it;</li>
            <li>6. the headings and sub-headings do not form part of this privacy policy.</li>
          </ol>
        </div>

        <div className={style.section}>
          <p className={style.header}>Scope of this Privacy Policy</p>
          3. This privacy policy applies only to the actions of NUVA NFT and Users with respect to this Website. It does not extend to any websites that can be accessed from this Website including, but not limited to, any links we may provide to social media websites.<br/><br/>
          4. For purposes of the applicable Data Protection Laws, NUVA NFT is the "data controller". This means that NUVA NFT determines the purposes for which, and the manner in which, your Data is processed.
        </div>

        <div className={style.section}>
          <p className={style.header}>Data Collected</p>
          5. We may collect the following data, which includes personal data, from you:
          <ol className="pl-8">
            <li>a. name</li>
            <li>b. date of birth</li>
            <li>c. gender</li>
            <li>d. contact information such as email addresses and telephone numbers</li>
            <li>e. demographic information such as postcode, preferences and interests</li>
            <li>f. IP address (automatically collected)</li>
            <li>g. web browser type and version (automatically collected)</li>
            <li>h. operating system (automatically collected)</li>
            <li>i. list of URLs starting with a referring site, your activity on this Website, and the site you exit to (automatically collected);</li>
          </ol>
          in each case, in accordance with this privacy policy.
        </div>

        <div className={style.section}>
          <p className={style.header}>How we collect data</p>
          6. We collect Data in the following ways:
          <ol className='pl-8'>
            <li>a. data is given to us by you;</li>
            <li>b. data is received from other sources; and</li>
            <li>c. data is collected automatically.</li>
          </ol>
        </div>

        <div className={style.section}>
          <p className={style.header}>Data that is given to us by you</p>
          7. NUVA NFT will collect your Data in a number of ways, for example:
          <ol className='pl-8'>
            <li>a. when you contact us through the Website, by telephone, post, e-mail or through any other means;</li>
            <li>b. when you register with us and set up an account to receive our products/services;</li>
            <li>c. when you make payments to us, through this Website or otherwise;</li>
            <li>c. when you elect to receive marketing communications from us;</li>
            <li>c. when you use our services;</li>
          </ol>
          in each case, in accordance with this privacy policy.
        </div>

        <div className={style.section}>
          <p className={style.header}>Data that is received from third parties</p>
          8. NUVA NFT will receive Data about you from the following third parties:
          <ol className="pl-8">
            <li>a. NUVA NFT Ecosystems.</li>
          </ol>
        </div>

        <div className={style.section}>
          <p className={style.header}>Data that is received from publicly available third parties sources </p>
          9. We will receive Data about you from the following publicly available third party sources:
          <ol className="pl-8">
            <li>a. NUVA NFT Ecosystems.</li>
          </ol>
        </div>

        <div className={style.section}>
          <p className={style.header}>Data that is collected automatically</p>
          10. To the extent that you access the Website, we will collect your data automatically, for example:
          <ol className="pl-8">
            <li>a. we automatically collect some information about your visit to the Website. This information helps us to make improvements to Website content and navigation, and includes your IP address, the date, times and frequency with which you access the Website and the way you use and interact with its content.</li>
            <li>b. we will collect your Data automatically via cookies, in line with the cookie settings on your browser. For more information about cookies, and how we use them on the Website, see the section below, headed "Cookies".</li>
          </ol>
        </div>

        <div className={style.section}>
          <p className={style.header}>Our use of data</p>
          11. Any or all of the above Data may be required by us from time to time in order to provide you with the best possible service and experience when using our Website. Specifically, Data may be used by us for the following reasons:
          <ol className="pl-8">
            <li>a. internal record keeping;</li>
            <li>b. improvement of our products / services;</li>
            <li>c. transmission by email of marketing materials that may be of interest to you;</li>
            <li>d. contact for market research purposes which may be done using email, telephone, fax or mail. Such information may be used to customise or update the Website;</li>
          </ol>
          in each case, in accordance with this privacy policy.<br/><br/>
          12. We may use your Data for the above purposes if we deem it necessary to do so for our legitimate interests. If you are not satisfied with this, you have the right to object in certain circumstances (see the section headed "Your rights" below).<br/><br/>
          13. For the delivery of direct marketing to you via e-mail, we'll need your consent, whether via an opt-in or soft-opt-in:
          <ol className="pl-8">
            <li>a. soft opt-in consent is a specific type of consent which applies when you have previously engaged with us (for example, you contact us to ask us for more details about a particular product/service, and we are marketing similar products/services). Under "soft opt-in" consent, we will take your consent as given unless you opt-out.</li>
            <li>b. for other types of e-marketing, we are required to obtain your explicit consent; that is, you need to take positive and affirmative action when consenting by, for example, checking a tick box that we'll provide.</li>
            <li>c. if you are not satisfied with our approach to marketing, you have the right to withdraw consent at any time. To find out how to withdraw your consent, see the section headed "Your rights" below.</li>
          </ol><br/>
          14. When you register with us and set up an account to receive our services, the legal basis for this processing is the performance of a contract between you and us and/or taking steps, at your request, to enter into such a contract.<br/><br/>
          15. We may use your Data to show you NUVA NFT adverts and other content on other websites. If you do not want us to use your data to show you NUVA NFT adverts and other content on other websites, please turn off the relevant cookies (please refer to the section headed "Cookies" below).<br/><br/>
        </div>

        <div className={style.section}>
          <p className={style.header}>Who we share data with</p>
          16. We may share your Data with the following groups of people for the following reasons:
          <ol className='pl-8'>
            <li>any of our group companies or affiliates - NUVA NFT Ecosystems;</li>
            <li>third party service providers who provide services to us which require the processing of personal data - NUVA NFT Ecosystems;</li>
            <li>third party payment providers who process payments made over the Website - NUVA NFT Ecosystems;</li>
            <li>relevant authorities - Relevant governmental authorities;</li>
          </ol>
          in each case, in accordance with this privacy policy.
        </div>
        

        <div className={style.section}>
          <p className={style.header}>Keeping data secure</p>
          17. We will use technical and organisational measures to safeguard your Data, for example:
            <ol className="pl-8">
              <li>a. access to your account is controlled by a password and a username that is unique to you.</li>
              <li>b. we store your Data on secure servers.</li>
            </ol><br/>
          18. Technical and organisational measures include measures to deal with any suspected data breach. If you suspect any misuse or loss or unauthorised access to your Data, please let us know immediately by contacting us via this e-mail address: <a href="mailto:support@metanuva.com" className="underline text-blue-500">support@metanuva.com</a>.<br/><br/>
          19. If you want detailed information from Get Safe Online on how to protect your information and your computers and devices against fraud, identity theft, viruses and many other online problems, please visit www.getsafeonline.org. Get Safe Online is supported by HM Government and leading businesses.<br/><br/>
        </div>

        <div className={style.section}>
          <p className={style.header}>Data retention</p>
          20. Unless a longer retention period is required or permitted by law, we will only hold your Data on our systems for the period necessary to fulfil the purposes outlined in this privacy policy or until you request that the Data be deleted.<br/><br/>
          21. Even if we delete your Data, it may persist on backup or archival media for legal, tax or regulatory purposes.
        </div>

        <div className={style.section}>
          <p className={style.header}>Your rights</p>
          22. You have the following rights in relation to your Data:
          <ol className='pl-8'>
            <li>a. <span className="font-bold">Right to access</span> - the right to request (i) copies of the information we hold about you at any time, or (ii) that we modify, update, or delete such information. If we provide you with access to the information we hold about you, we will not charge you for this, unless your request is "manifestly unfounded or excessive." Where we are legally permitted to do so, we may refuse your request. If we refuse your request, we will tell you the reasons why.</li>
            <li>b. <span className="font-bold">Right to correct</span> - the right to have your Data rectified if it is inaccurate or incomplete.</li>
            <li>c. <span className="font-bold">Right to erase</span> - the right to request that we delete or remove your Data from our systems.</li>
            <li>d. <span className="font-bold">Right to restrict our use of your Data</span> - the right to "block" us from using your Data or limit the way in which we can use it.</li>
            <li>e. <span className="font-bold">Right to data portability</span> - the right to request that we move, copy, or transfer your Data.</li>
            <li>f. <span className="font-bold">Right to object</span> - the right to object to our use of your Data including where we use it for our legitimate interests.</li>
          </ol>
        </div>

        23. To make enquiries, exercise any of your rights set out above, or withdraw your consent to the processing of your Data (where consent is our legal basis for processing your Data), please contact us via this e-mail address: <a href="mailto:support@metanuva.com" className="underline text-blue-500">support@metanuva.com</a><br/><br/>
        24. If you are not satisfied with the way a complaint you make in relation to your Data is handled by us, you may be able to refer your complaint to the relevant data protection authority. For the UK, this is the Information Commissioner's Office (ICO). The ICO's contact details can be found on their website at https://ico.org.uk/.<br/><br/>
        25. It is important that the Data we hold about you is accurate and current. Please keep us informed if your Data changes during the period for which we hold it.
        
        <div className={style.section}>
          <p className={style.header}>Links to other websites</p>
          26. This Website may, from time to time, provide links to other websites. We have no control over such websites and are not responsible for the content of these websites. This privacy policy does not extend to your use of such websites. You are advised to read the privacy policy or statement of other websites prior to using them.

        </div>

        <div className={style.section}>
          <p className={style.header}>Changes of business ownership and control</p>
          27. NUVA NFT may, from time to time, expand or reduce our business and this may involve the sale and/or the transfer of control of all or part of  NUVA NFT . Data provided by Users will, where it is relevant to any part of our business so transferred, be transferred along with that part and the new owner or newly controlling party will, under the terms of this privacy policy, be permitted to use the Data for the purposes for which it was originally supplied to us.<br/><br/>
          28. We may also disclose Data to a prospective purchaser of our business or any part of it.<br/><br/>
          29. In the above instances, we will take steps with the aim of ensuring your privacy is protected.
        </div>

        <div className={style.section}>
          <p className={style.header}>Cookies</p>
          30. This Website may place and access certain Cookies on your computer. NUVA NFT uses Cookies to improve your experience of using the Website and to improve our range of products and services.   NUVA NFT has carefully chosen these Cookies and has taken steps to ensure that your privacy is protected and respected at all times.<br/><br/>
          31. All Cookies used by this Website are used in accordance with current UK and EU Cookie Law.<br/><br/>
          32. Before the Website places Cookies on your computer, you will be presented with a message bar requesting your consent to set those Cookies. By giving your consent to the placing of Cookies, you are enabling NUVA NFT to provide a better experience and service to you. You may, if you wish, deny consent to the placing of Cookies; however certain features of the Website may not function fully or as intended.<br/><br/>
          33. This Website may place the following Cookies:
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
          34. You can find a list of Cookies that we use in the Cookies Schedule.<br/><br/>
          35. We give you control over which Cookies we use. You can adjust your cookies preferences at any time at: nuvatoken.com.<br/><br/>
          36. You can also choose to enable or disable Cookies in your internet browser. By default, most internet browsers accept Cookies but this can be changed. For further details, please see the help menu in your internet browser. You can switch off Cookies at any time, however, you may lose any information that enables you to access the Website more quickly and efficiently.<br/><br/>
          37. You can choose to delete Cookies at any time; however, you may lose any information that enables you to access the Website more quickly and efficiently including, but not limited to, personalisation settings.<br/><br/>
          38. It is recommended that you ensure that your internet browser is up-to-date and that you consult the help and guidance provided by the developer of your internet browser if you are unsure about adjusting your privacy settings.<br/><br/>
          39. For more information generally on cookies, including how to disable them, please refer to aboutcookies.org. You will also find details on how to delete cookies from your computer.

        </div>

        <div className={style.section}>
          <p className={style.header}>General</p>
          40. You may not transfer any of your rights under this privacy policy to any other person. We may transfer our rights under this privacy policy where we reasonably believe your rights will not be affected.<br/><br/>
          41. If any court or competent authority finds that any provision of this privacy policy (or part of any provision) is invalid, illegal or unenforceable, that provision or part-provision will, to the extent required, be deemed to be deleted, and the validity and enforceability of the other provisions of this privacy policy will not be affected.<br/><br/>
          42. Unless otherwise agreed, no delay, act or omission by a party in exercising any right or remedy will be deemed a waiver of that, or any other, right or remedy.<br/><br/>
          43. This Agreement will be governed by and interpreted according to the law of England and Wales. All disputes arising under the Agreement will be subject to the exclusive jurisdiction of the English and Welsh courts.

        </div>

        <div className={style.section}>
          <p className={style.header}>Changes to this privacy policy</p>
          44. NUVA NFT reserves the right to change this privacy policy as we may deem necessary from time to time or as may be required by law. Any changes will be immediately posted on the Website and you are deemed to have accepted the terms of the privacy policy on your first use of the Website following the alterations. You may contact NUVA NFT by email at <a href="mailto:support@metanuva.com" className="underline text-blue-500">support@metanuva.com</a>

        </div>
      </div>
      <Footer />
    </div>
  )
}

export default privacypolicy
