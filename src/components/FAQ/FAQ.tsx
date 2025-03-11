import React from 'react'
import Question from './Question'
import AccentButton from '../ui/AccentButton'
import { faqs } from './data'

const FAQ = () => {
    return (
        <div className=' w-full bg-black py-20 relative -top-10 z-30'>
            <div className='w-full flex flex-col items-center'>
                <AccentButton>Frequently Asked Question</AccentButton>
                <h1 className='md:text-6xl text-main font-bold mt-6 mb-4'>
                    Any <span className='bg-gradient-to-r from-[#e4e4e4] via-[#efbf04] to-[#ff8c32] bg-clip-text text-transparent'>Questions? </span>
                    Look Here
                </h1>
                <p className='font-regular text-secondary mb-16 w-1/2 text-center'>We’re here to help! Below are answers to some common questions about how JobsForce.ai works and how it can assist you in streamlining your job application process.</p>

                <div className='w-2/3'>
                    {
                        faqs.map((faq) => (
                            <Question
                                key={faq.key}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default FAQ