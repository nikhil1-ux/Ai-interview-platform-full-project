import React from 'react'
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import HowItWorks from "../components/HowItWorks"
import Features from "../components/Features"
import ForCompanies from "../components/ForCompanies"
import ForStudents from "../components/ForStudents"
import Faq from "../components/Faq"
import Cta from "../components/Cta"
import Footer from "../components/Footer"
import "../App.css"
import { Toaster } from "react-hot-toast";
export default function Home() {
  return (

     
     <>

      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ForCompanies />
        <ForStudents />
        <Features />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  )
}