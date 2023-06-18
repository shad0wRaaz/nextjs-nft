import { Disclosure } from '@headlessui/react'
import React from 'react'
import { HiChevronDown } from 'react-icons/hi'

const Faq = ({ setShowMenu }) => {
    const faqs = [
        {
            title: 'When is the official launch?',
            content: 'The Official launch is on June 30th, 2023.'
        },
        {
            title: 'What will the buy price be?',
            content: 'We want to provide our community with the best quality art from real artist at affordable prices that holds value in real world. We have 4 collections and prices ranges from $75 to $350 worth of ETH.'
        },
        {
            title: 'How does the NFT work with Uni level?',
            content: 'Earning from your direct referrals is always free. But if you want to earn from deeper levels, you need to hold an NFT from different collection which will unlock different levels in Uni level.'
        },
        {
            title: 'What is Shared Royalty Fee?',
            content: 'When an NFT is bought, you will be paying certain amount to the creator as royalty. If you are the first buyer of any NFT in these collection, the creator will keep 50% of the royalty and sharing the other 50% with you. '
        },
        {
            title: 'What is Shared Platform Fee?',
            content: 'When an NFT is bought or sold, you will be paying certain amount to the platform as service fee. We are sharing % of the fees generated from any transaction from amongs your network. The NFT you hold will determine levels of % earned.'
        },
    ]
  return (
    <section 
        onClick={() => setShowMenu(false)} 
        id="faq" className="faq alfaslab ad-basecolor py-[70px] md:py-[100px]">
        <div className="container mx-auto p-8">
            <div className="faq__wrapper">
                <div className="grid grid-cols-1">
                    <div className="text-center mx-auto">
                        <div className="section-header">
                            <div className="section-header__content text-start">
                                <h2 className="mx-0 text-center"> <span className="color--gradient-mv d-block"> F.A.Q</span></h2>
                            </div>
                        </div>
                        <div className="max-w-xl mx-auto">
                            {faqs.map((faq, index) => (
                                <Disclosure key={index}>
                                    {({ open }) => (
                                        <div className="mt-3">
                                            <Disclosure.Button 
                                                style={{ background: 'linear-gradient(0deg,#ffffff,#99fffd)' }} 
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