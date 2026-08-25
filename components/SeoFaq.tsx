import { Plus } from 'lucide-react'
import { SITE_FAQS } from '@/lib/faq'

export default function SeoFaq() {
  return (
    <section id="faq" className="w-full bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A192F]">
            Preguntas frecuentes
          </p>
          <h2 className="font-serif text-3xl italic tracking-tight text-[#0A192F] md:text-5xl">
            Renta de yates en Cancún
          </h2>
          <div className="mx-auto mt-6 h-px w-12 bg-[#0A192F]/30" />
        </div>

        <div className="border-t border-zinc-200">
          {SITE_FAQS.map((item) => (
            <details
              key={item.question}
              name="faq"
              className="group border-b border-zinc-200"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left outline-none transition-colors marker:content-none hover:text-[#0A192F]/80 focus-visible:ring-2 focus-visible:ring-[#0A192F]/20 [&::-webkit-details-marker]:hidden">
                <span className="font-serif text-lg italic text-[#0A192F] md:text-xl">
                  {item.question}
                </span>
                <Plus
                  className="size-4 shrink-0 text-[#0A192F]/40 transition-transform duration-300 group-open:rotate-45"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </summary>
              <p className="pb-5 pr-8 text-sm font-light leading-relaxed text-zinc-600 md:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
