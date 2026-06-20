import React from 'react'
import Navbar from "../components/Navbar.jsx"
import Hero from "../components/Hero.jsx"
import HowItWorks from "../components/HowItWorks.jsx"
import Features from "../components/Features.jsx"
import Faq from "../components/Faq.jsx"
import Footer from "../components/Footer.jsx"


export const Home = () => {
  return (
    <>
   <Navbar/>
   <Hero/>
   <HowItWorks/>
   <Features/>
   <Faq/>
   <Footer/>
    </>

  )
}
