import { Disclosure } from '@headlessui/react'
import React from 'react'
import { HiChevronDown } from 'react-icons/hi'

const Faq = ({ setShowMenu }) => {
    const faqs = [
        {
            title: 'What will the buy price be?',
            content: 'We want to provide our community with the best quality art from real artist at affordable prices that holds value in real world. We have 4 collections and prices ranges from 0.32 BNB to 1.49 BNB.'
        },
        {
            title: 'How does the NFT work with Uni level?',
            content: '10% reward from your direct referrals is always free. But if you want to receive reward from deeper levels (eg. receiving rewards from referrals of your referrals and so on), you need to hold an NFT from specific collection which will unlock specific levels in Loyalty reward level. You can receive rewards from up to 5 levels.'
        },
        {
            title: 'What is Royalty Reward?',
            content: 'When an NFT is bought, 10% is attributed to the creator as royalty. If you are the first buyer of a NFT from any of these collections, the creator will keep 50% of the royalty and you will keep the other 50%. In simple terms, the first buyer of NFT from Rewarding Renditions collection will receive 5% of the value of the NFT on every resale as Royalty reward.'
        },
        {
            title: 'What is Platform Reward?',
            content: 'When an NFT is bought or sold, you will be paying certain amount to the platform as service fee. We are sharing certain % of the fees generated from all transaction amongst your network. The NFT you hold will determine % of share you get.'
        },
        {
            title: 'When does Free BNB Airdrop take place?',
            content: 'The airdrop takes place in 4 different stages. Once 625 NFTs are sold, all the holders will receive certain % of the total sales as airdrop equally distributed to all. Similarly, airdrop is sent after the sale of 1250 NFTs, 2500 NFTs and 5000 NFTs. Once whole lot is completed, all the holders will also receive FREE Nuva Tokens via Airdrop.'
        }
    ]
  return (
    <section 
        onClick={() => setShowMenu(false)} 
        id="faq" className="faq alfaslab py-[70px] md:py-[100px] bg-[#23162c]">
        <div className="container mx-auto p-8">
            <div className="faq__wrapper">
                <div className="grid grid-cols-1">
                    <div className="text-center mx-auto">
                        <div className="section-header">
                            <div className="section-header__content text-start">
                                <h2 className="mx-0 text-center"> <span className="color--gradient-y d-block"> F.A.Q</span></h2>
                            </div>
                        </div>
                        <div className="max-w-xl mx-auto">
                            {faqs.map((faq, index) => (
                                <Disclosure key={index}>
                                    {({ open }) => (
                                        <div className="mt-3">
                                            <Disclosure.Button 
                                                style={{ background: 'linear-gradient(0deg,#f6fff2,#c3ffa9)' }} 
                                                className="flex w-full justify-between rounded-lg px-4 py-5 text-left text-sm font-medium text-[#0d142f]">
                                                <span className="text-[1.5rem]">{faq.title}</span>
                                                <HiChevronDown
                                                className={`${
                                                    open ? 'rotate-180 transform' : ''
                                                } h-5 w-5 transition text-[#0d142f]]`}
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-md text-neutral-100">
                                                {faq.content}
                                            </Disclosure.Panel>
                                        </div>
                                    )}
                                </Disclosure>
                            ))}
                        </div>
                    </div>
                    {/* <div className="col-lg-6">
                        <div className="faq__thumb text-center aos-init aos-animate" data-aos-duration="2000" data-aos="zoom-in-right"><img src="http://bored.labartisan.net/assets/images/faq/01.png" alt="FAQ Image" /></div>
                    </div> */}
                </div>
            </div>
        </div>
    </section>
  )
}

export default Faq