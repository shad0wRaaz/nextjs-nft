import Header from '../components/Header'
import Footer from '../components/Footer'
import { useThemeContext } from '../contexts/ThemeContext'

const termsandconditions = () => {
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
        <h2 className={style.pageTitle}>Terms and Conditions</h2>
      </div>
      <div className={style.wrapper}>
        <p>These terms and conditions apply between you, the User of this Website (including any sub-domains, unless expressly excluded by their own terms and conditions), and NUVA NFT, the owner and operator of this Website. Please read these terms and conditions carefully, as they affect your legal rights. Your agreement to comply with and be bound by these terms and conditions is deemed to occur upon your first use of the Website. If you do not agree to be bound by these terms and conditions, you should stop using the Website immediately.</p><br/>
        <p>In these terms and conditions, User or Users means any third party that accesses the Website and is not either (i) employed by NUVA NFT and acting in the course of their employment or (ii) engaged as a consultant or otherwise providing services to NUVA NFT and accessing the Website in connection with the provision of such services.</p>
        <p>You must be at least 18 years of age to use this Website. By using the Website and agreeing to these terms and conditions, you represent and warrant that you are at least 18 years of age.</p>
        <br/>
        <div className={style.section}>
            <p className={style.header}>Intellectual property and acceptable use</p>
            <p>1. All Content included on the Website, unless uploaded by Users, is the property of NUVA NFT, our affiliates or other relevant third parties. In these terms and conditions, Content means any text, graphics, images, audio, video, software, data compilations, page layout, underlying code and software and any other form of information capable of being stored in a computer that appears on or forms part of this Website, including any such content uploaded by Users. By continuing to use the Website you acknowledge that such Content is protected by copyright, trademarks, database rights and other intellectual property rights. Nothing on this site shall be construed as granting, by implication, estoppel, or otherwise, any license or right to use any trademark, logo or service mark displayed on the site without the owner's prior written permission</p>
            <p>2. You may, for your own personal, non-commercial use only, do the following:</p>
            <ul className="pl-8">
                <li>1. retrieve, display and view the Content on a computer screen</li>
                <li>2. download and store the Content in electronic form on a disk (but not on any server or other storage device connected to a network)</li>
                <li>3. print one copy of the Content</li>
            </ul>
            <p>3. You must not otherwise reproduce, modify, copy, distribute or use for commercial purposes any Content without the written permission of NUVA NFT.</p>
          <br/><br/>
        </div>

        <div className={style.section}>
          <p className={style.header}>Prohibited use</p>
          4. You may not use the Website for any of the following purposes:
          <ul className="pl-8">
            <li>1. in any way which causes, or may cause, damage to the Website or interferes with any other person's use or enjoyment of the Website;</li>
            <li>2. in any way which is harmful, unlawful, illegal, abusive, harassing, threatening or otherwise objectionable or in breach of any applicable law, regulation, governmental order;</li>
            <li>3. making, transmitting or storing electronic copies of Content protected by copyright without the permission of the owner.</li>
          </ul>

        </div>

        <div className={style.section}>
          <p className={style.header}>Registration</p>
            5. You must ensure that the details provided by you on registration or at any time are correct and complete.
            <br/>
            6. You must inform us immediately of any changes to the information that you provide when registering by updating your personal details to ensure we can communicate with you effectively.
            <br/>
            7. We may suspend or cancel your registration with immediate effect for any reasonable purposes or if you breach these terms and conditions.
            <br/>
            8. You may cancel your registration at any time by informing us in writing to the address at the end of these terms and conditions. If you do so, you must immediately stop using the Website. Cancellation or suspension of your registration does not affect any statutory rights.
        </div>

        <div className={style.section}>
          <p className={style.header}>Links to other websites</p>
          9. This Website may contain links to other sites. Unless expressly stated, these sites are not under the control of NUVA NFT or that of our affiliates.
          <br/>
          10. We assume no responsibility for the content of such Websites and disclaim liability for any and all forms of loss or damage arising out of the use of them.
          <br/>
          11. The inclusion of a link to another site on this Website does not imply any endorsement of the sites themselves or of those in control of them.
        </div>

        <div className={style.section}>
            <p className={style.header}>Availability of the Website and disclaimer</p>
            12. Any online facilities, tools, services or information that NUVA NFT makes available through the Website (the Service) is provided "as is" and on an "as available" basis. We give no warranty that the Service will be free of defects and/or faults. To the maximum extent permitted by the law, we provide no warranties (express or implied) of fitness for a particular purpose, accuracy of information, compatibility and satisfactory quality. NUVA NFT is under no obligation to update information on the Website.
            <br/>
            13. Whilst NUVA NFT uses reasonable endeavours to ensure that the Website is secure and free of errors, viruses and other malware, we give no warranty or guaranty in that regard and all Users take responsibility for their own security, that of their personal details and their computers.
            <br/>
            14. NUVA NFT accepts no liability for any disruption or non-availability of the Website.
            <br/>
            15. NUVA NFT reserves the right to alter, suspend or discontinue any part (or the whole of) the Website including, but not limited to, any products and/or services available. These terms and conditions shall continue to apply to any modified version of the Website unless it is expressly stated otherwise.
        </div>

        <div className={style.section}>
          <p className={style.header}>Limitation of liability</p>
          16. Nothing in these terms and conditions will: (a) limit or exclude our or your liability for death or personal injury resulting from our or your negligence, as applicable; (b) limit or exclude our or your liability for fraud or fraudulent misrepresentation; or (c) limit or exclude any of our or your liabilities in any way that is not permitted under applicable law.
          <br/>
          17. We will not be liable to you in respect of any losses arising out of events beyond our reasonable control. 18. To the maximum extent permitted by law, NUVA NFT accepts no liability for any of the following:
          <ul className="pl-8">
              <li>1. any business losses, such as loss of profits, income, revenue, anticipated savings, business, contracts, goodwill or commercial opportunities;</li>
              <li>2. loss or corruption of any data, database or software;</li>
              <li>3. any special, indirect or consequential loss or damage.</li>
          </ul>
        </div>

        <div className={style.section}>
          <p className={style.header}>General</p>
          18. You may not transfer any of your rights under these terms and conditions to any other person. We may transfer our rights under these terms and conditions where we reasonably believe your rights will not be affected.
          <br/>
          19. These terms and conditions may be varied by us from time to time. Such revised terms will apply to the Website from the date of publication. Users should check the terms and conditions regularly to ensure familiarity with the then current version.
          <br/>

          20. These terms and conditions contain the whole agreement between the parties relating to its subject matter and supersede all prior discussions, arrangements or agreements that might have taken place in relation to the terms and conditions.
          <br/>

          21. The Contracts (Rights of Third Parties) Act 1999 shall not apply to these terms and conditions and no third party will have any right to enforce or rely on any provision of these terms and conditions.
          <br/>

          22. If any court or competent authority finds that any provision of these terms and conditions (or part of any provision) is invalid, illegal or unenforceable, that provision or part-provision will, to the extent required, be deemed to be deleted, and the validity and enforceability of the other provisions of these terms and conditions will not be affected.
          <br/>

          23. Unless otherwise agreed, no delay, act or omission by a party in exercising any right or remedy will be deemed a waiver of that, or any other, right or remedy.
          <br/>

          24. This Agreement shall be governed by and interpreted according to the law of England and Wales and all disputes arising under the Agreement (including non-contractual disputes or claims) shall be subject to the exclusive jurisdiction of the English and Welsh courts
        </div>

        <div className={style.section}>
          <p className={style.header}>NUVA NFT details</p>
          25. NUVA NFT is a company incorporated in England and Wales with registered number 13800011 whose registered address is 75 Whitechapel Road, London, E1 1DU and it operates the Website www.nuvanft.io You can contact NUVA NFT by email on <a href="support@nuvatoken.com">support@nuvatoken.com</a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default termsandconditions