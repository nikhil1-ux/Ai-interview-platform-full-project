import React from 'react'
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import HowItWorks from "../components/HowItWorks"
import Features from "../components/Features"
import ForCompanies from "../components/ForCompanies"
import ForStudents from "../components/ForStudents"
import Faq from "../components/Faq"
import CTA from "../components/CTA"
import Footer from "../components/Footer"
import "../App.css"

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
        <CTA />
      </main>
      <Footer />
    </>
  )
}