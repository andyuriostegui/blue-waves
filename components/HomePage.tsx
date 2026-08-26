'use client'

import { useState, type ReactNode } from 'react'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import Hero from '@/components/Hero'
import AboutTrust from '@/components/AboutTrust'
import RouteMap from '@/components/RouteMap'
import Fleet from '@/components/Fleet'
import Testimonios from '@/components/Testimonios'
import Toys from '@/components/Toys'
import ContactForm from '@/components/ContactForm'
import WaveDivider from '@/components/WaveDivider'
import SeoFaq from '@/components/SeoFaq'
import LanguageSwitch from '@/components/LanguageSwitch'
import { useI18n } from '@/components/LocaleProvider'
import {
  SITE_FACEBOOK,
  SITE_INSTAGRAM,
  SITE_LOCATION,
} from '@/lib/site'
import type { Yacht } from '@/lib/yachts'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-serif',
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function HomePage({ yachts }: { yachts: Yacht[] }) {
  const { dict } = useI18n()
  const [preselectedYacht, setPreselectedYacht] = useState('')

  const scrollToContact = (yachtName?: string) => {
    if (yachtName) setPreselectedYacht(yachtName)
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className={`${serif.variable} ${sans.variable} bg-[#F4F4F4] min-h-screen font-sans text-[#0A192F] selection:bg-[#0A192F] selection:text-white scroll-smooth`}>
      <main className="flex flex-col">
        <Hero scrollToContact={scrollToContact} />
        <AboutTrust />
        <RouteMap />
        <WaveDivider color="#0A192F" />
        <div className="bg-[#0A192F]">
          <Fleet
            yachts={yachts}
            loading={false}
            scrollToContact={scrollToContact}
          />
        </div>
        <WaveDivider color="#0A192F" flip={true} />
        <Toys />
        <Testimonios />
        <SeoFaq />
        <ContactForm
          yachts={yachts}
          yachtsLoaded={true}
          preselectedYacht={preselectedYacht}
        />
      </main>

      <footer className="py-24 text-center bg-white border-t border-zinc-100">
        <p className="font-serif text-4xl italic mb-3 text-[#0A192F]">Blue Waves</p>
        <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
          {dict.footer.tagline}
        </p>
        <p className="mb-10 text-[11px] font-light text-zinc-500">{SITE_LOCATION}</p>

        <LanguageSwitch tone="dark" className="mb-10 flex justify-center" />

        <nav aria-label={dict.footer.social} className="mb-10">
          <ul className="flex justify-center items-start gap-2 sm:gap-4">
            <li>
              <SocialLink href={SITE_INSTAGRAM} label="Instagram">
                <InstagramIcon />
              </SocialLink>
            </li>
            <li>
              <SocialLink href={SITE_FACEBOOK} label="Facebook">
                <FacebookIcon />
              </SocialLink>
            </li>
          </ul>
        </nav>

        <div className="max-w-xs mx-auto mb-8 h-[1px] bg-zinc-100"></div>

        <p className="text-[9px] tracking-[0.6em] uppercase text-zinc-300">
          {dict.footer.copyright}
        </p>
      </footer>
    </div>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex flex-col items-center gap-2.5 px-4 text-zinc-400 transition-colors duration-300 hover:text-[#0A192F]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-all duration-300 group-hover:border-[#0A192F] group-hover:text-[#0A192F] group-hover:shadow-[0_8px_20px_rgba(10,25,47,0.08)]">
        {children}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-[0.32em]">{label}</span>
    </a>
  )
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}
