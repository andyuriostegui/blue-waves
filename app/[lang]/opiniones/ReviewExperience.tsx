'use client'

import { useRef, useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Anchor, Check, Copy, LockKeyhole, MessageCircle, Star, Waves } from 'lucide-react'
import { useI18n } from '@/components/LocaleProvider'
import { localizePath } from '@/lib/i18n/config'
import { getWhatsAppUrl } from '@/lib/site'
import styles from './reviews.module.css'

// Existing Google Maps profile supplied by Blue Waves. Google handles publication.
const GOOGLE_PROFILE_URL = 'https://maps.app.goo.gl/QxeWm9SD3pYdwsmA8'

const copy = {
  es: {
    back: 'Volver a Blue Waves', place: 'CANCÚN · ISLA MUJERES', eyebrow: 'EL VIAJE SIGUE EN TUS PALABRAS',
    title: <>Hay días que<br />merecen <em>contarse.</em></>,
    intro: 'Gracias por dejarnos ser parte del tuyo. Nos encantará saber cómo viviste tu día a bordo.',
    invitation: 'Un momento para recordar.', invitationText: 'El mar, la compañía, ese pequeño detalle. Tu experiencia nos ayuda a cuidar la próxima.',
    steps: ['Tu experiencia', 'Comparte a tu manera'], cardEyebrow: 'TU BITÁCORA A BORDO',
    cardTitle: '¿Cómo fue tu experiencia?', cardIntro: 'Unas palabras tuyas significan mucho para nuestra tripulación.',
    rating: 'Tu calificación', ratings: ['Podría mejorar mucho', 'Podría mejorar', 'Estuvo bien', 'Muy buena', 'Extraordinaria'],
    selectRating: 'Elige de 1 a 5 estrellas', starUnit: 'de 5 estrellas',
    comment: 'Cuéntanos tu día', placeholder: '¿Qué te gustaría compartir sobre tu experiencia con Blue Waves?',
    prompts: ['La tripulación', 'El recorrido', 'El yate', 'Algo por mejorar'],
    hints: ['¿Cómo fue la atención de la tripulación?', '¿Cómo viviste el recorrido y las paradas?', '¿Cómo encontraste el yate y sus comodidades?', '¿Qué podríamos hacer mejor en tu próxima visita?'],
    initialHint: '¿Necesitas inspiración? Elige un tema para empezar.', name: 'Tu nombre', optional: '(opcional)', namePlaceholder: '¿Cómo te llamas?',
    continue: 'Preparar mi comentario', privacy: 'Tú eliges dónde compartirlo. Nada se envía automáticamente.',
    ready: 'TUS PALABRAS, TU ELECCIÓN', shareTitle: 'Dale un destino a tu recuerdo.', shareIntro: 'Revisa tu comentario y elige cómo compartirlo. Puedes usar ambas opciones.',
    preview: 'TU COMENTARIO', edit: 'Editar', copy: 'Copiar comentario', copied: 'Comentario copiado', copyError: 'No pudimos copiarlo. Selecciona y copia el texto de tu comentario manualmente.',
    google: 'Compártelo en Google', googleText: 'Copia tu comentario, abre nuestro perfil y elige «Escribir una reseña». Allí podrás pegarlo, marcar las estrellas y añadir tus fotos.',
    googleAction: 'Continuar en Google', googleNote: 'Tu reseña será pública cuando la publiques en Google. Puede pedirte iniciar sesión.',
    privateTitle: 'Solo para Blue Waves', privateText: '¿Prefieres contárnoslo en privado? Abriremos WhatsApp con tu comentario listo para que lo revises y lo envíes a nuestro equipo.',
    privateAction: 'Abrir WhatsApp', privateNote: 'El comentario no se publica en la web ni se envía hasta que tú lo confirmes en WhatsApp.',
    thanks: 'Gracias por navegar con nosotros.', footer: 'HASTA NUESTRA PRÓXIMA TRAVESÍA',
    privateGreeting: 'Hola Blue Waves, quiero compartir mi experiencia a bordo en privado.', privateRating: 'Calificación', privateName: 'Nombre',
  },
  en: {
    back: 'Back to Blue Waves', place: 'CANCÚN · ISLA MUJERES', eyebrow: 'THE JOURNEY LIVES ON IN YOUR WORDS',
    title: <>Some days<br />deserve <em>a story.</em></>,
    intro: 'Thank you for letting us be part of yours. We would love to hear about your day on board.',
    invitation: 'A moment to remember.', invitationText: 'The sea, the company, the little details. Your experience helps us care for the next one.',
    steps: ['Your experience', 'Share it your way'], cardEyebrow: 'YOUR DAY ON BOARD',
    cardTitle: 'How was your experience?', cardIntro: 'A few words from you mean so much to our crew.',
    rating: 'Your rating', ratings: ['Needs a lot of improvement', 'Could be better', 'Good', 'Very good', 'Extraordinary'],
    selectRating: 'Choose from 1 to 5 stars', starUnit: 'out of 5 stars',
    comment: 'Tell us about your day', placeholder: 'What would you like to share about your Blue Waves experience?',
    prompts: ['The crew', 'The journey', 'The yacht', 'Room to improve'],
    hints: ['How was the service from the crew?', 'How did you find the route and the stops?', 'How was the yacht and its amenities?', 'What could we do better on your next visit?'],
    initialHint: 'Need inspiration? Choose a topic to get started.', name: 'Your name', optional: '(optional)', namePlaceholder: 'What is your name?',
    continue: 'Prepare my comment', privacy: 'You choose where to share. Nothing is sent automatically.',
    ready: 'YOUR WORDS, YOUR CHOICE', shareTitle: 'Give your memory a destination.', shareIntro: 'Review your comment and choose how to share it. You can use both options.',
    preview: 'YOUR COMMENT', edit: 'Edit', copy: 'Copy comment', copied: 'Comment copied', copyError: 'We could not copy it. Please select and copy your comment manually.',
    google: 'Share it on Google', googleText: 'Copy your comment, open our profile and choose “Write a review”. You can paste it, select your stars and add photos there.',
    googleAction: 'Continue to Google', googleNote: 'Your review becomes public when you publish it on Google. You may need to sign in.',
    privateTitle: 'Just for Blue Waves', privateText: 'Would you rather tell us privately? We will open WhatsApp with your comment ready for you to review and send to our team.',
    privateAction: 'Open WhatsApp', privateNote: 'Your comment is not published on our website or sent until you confirm it in WhatsApp.',
    thanks: 'Thank you for sailing with us.', footer: 'UNTIL OUR NEXT JOURNEY',
    privateGreeting: 'Hello Blue Waves, I would like to share my experience on board privately.', privateRating: 'Rating', privateName: 'Name',
  },
}

export default function ReviewExperience() {
  const { locale } = useI18n()
  const [language, setLanguage] = useState<'es' | 'en'>(locale)
  const [step, setStep] = useState(1)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [topic, setTopic] = useState<number | null>(null)
  const [clipboard, setClipboard] = useState<'idle' | 'copied' | 'error'>('idle')
  const heading = useRef<HTMLHeadingElement>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const t = copy[language]
  const currentRating = hovered || rating
  const privateMessage = [t.privateGreeting, name.trim() ? `${t.privateName}: ${name.trim()}` : '', `${t.privateRating}: ${rating}/5`, '', comment.trim()].filter((line, i) => line || i === 3).join('\n')

  function moveTo(next: number) {
    setStep(next)
    setClipboard('idle')
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true })
      heading.current?.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (comment.trim().length < 10) {
      textarea.current?.setCustomValidity(language === 'es' ? 'Escribe al menos 10 caracteres para contarnos tu experiencia.' : 'Please write at least 10 characters about your experience.')
      textarea.current?.reportValidity()
      return
    }
    moveTo(2)
  }

  async function copyComment() {
    try {
      await navigator.clipboard.writeText(comment.trim())
      setClipboard('copied')
    } catch {
      setClipboard('error')
    }
  }

  return (
    <main className={styles.page} lang={language}>
      <div className={styles.heroImage} aria-hidden="true"><Image src="/bluebueno.png" alt="" fill priority sizes="100vw" /></div>
      <header className={styles.header}>
        <Link className={styles.brand} href={localizePath(language, '/')}>BLUE WAVES<span>PRIVATE YACHT EXPERIENCES</span></Link>
        <div className={styles.headerActions}>
          <Link className={styles.back} href={localizePath(language, '/')}><ArrowLeft size={14} />{t.back}</Link>
          <div className={styles.language} aria-label={language === 'es' ? 'Idioma' : 'Language'}>
            {(['es', 'en'] as const).map((lang) => <button key={lang} type="button" aria-pressed={language === lang} onClick={() => setLanguage(lang)}>{lang.toUpperCase()}</button>)}
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.intro}>
          <p className={styles.eyebrow}><span />{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className={styles.introText}>{t.intro}</p>
          <div className={styles.invitation}><div className={styles.anchor}><Anchor size={24} strokeWidth={1} /></div><div><h2>{t.invitation}</h2><p>{t.invitationText}</p></div></div>
          <div className={styles.coordinates}><Waves size={19} strokeWidth={1} /><span>{t.place}</span><span className={styles.coordinateLine} /><span>21° N · 86° W</span></div>
        </section>

        <section className={styles.card} aria-labelledby="review-heading">
          <ol className={styles.steps}>{t.steps.map((label, i) => <li key={i} aria-current={step === i + 1 ? 'step' : undefined}><span>{step > i + 1 ? <Check size={13} /> : `0${i + 1}`}</span>{label}</li>)}</ol>
          <div className={styles.cardBody}>
            <p className={styles.cardEyebrow}>{step === 1 ? t.cardEyebrow : t.ready}</p>
            <h2 ref={heading} tabIndex={-1} id="review-heading" className={styles.cardTitle}>{step === 1 ? t.cardTitle : t.shareTitle}</h2>
            <p className={styles.cardIntro}>{step === 1 ? t.cardIntro : t.shareIntro}</p>

            {step === 1 ? <form onSubmit={prepare}>
              <fieldset className={styles.rating}><legend>{t.rating}</legend><div className={styles.stars} onMouseLeave={() => setHovered(0)}>
                {[1, 2, 3, 4, 5].map((value) => <label key={value} onMouseEnter={() => setHovered(value)}>
                  <input type="radio" name="rating" required value={value} checked={rating === value} onChange={() => setRating(value)} aria-label={`${value} ${t.starUnit}`} />
                  <Star size={35} strokeWidth={1.2} className={currentRating >= value ? styles.starActive : ''} aria-hidden="true" />
                </label>)}
              </div><p aria-live="polite">{currentRating ? t.ratings[currentRating - 1] : t.selectRating}</p></fieldset>

              <div className={styles.labelRow}><label htmlFor="review-comment">{t.comment}</label><span>{comment.length} / 2000</span></div>
              <textarea ref={textarea} id="review-comment" rows={5} maxLength={2000} minLength={10} required value={comment} placeholder={t.placeholder} aria-describedby="review-hint" onChange={(event) => { setComment(event.target.value); event.target.setCustomValidity('') }} />
              <div className={styles.prompts}>{t.prompts.map((label, i) => <button key={i} type="button" aria-pressed={topic === i} onClick={() => { setTopic(i); textarea.current?.focus() }}>{label}</button>)}</div>
              <p id="review-hint" className={styles.hint} aria-live="polite">{topic === null ? t.initialHint : t.hints[topic]}</p>
              <label className={styles.nameLabel} htmlFor="review-name">{t.name} <span>{t.optional}</span></label>
              <input className={styles.nameInput} id="review-name" autoComplete="given-name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder={t.namePlaceholder} />
              <button className={styles.primary} type="submit">{t.continue}<ArrowRight size={17} /></button>
              <p className={styles.privacy}><LockKeyhole size={12} />{t.privacy}</p>
            </form> : <div>
              <div className={styles.preview}>
                <div className={styles.previewTop}><span>{t.preview}</span><button type="button" onClick={() => moveTo(1)}>{t.edit}</button></div>
                <div className={styles.previewStars} aria-label={`${rating} ${t.starUnit}`}>{[1, 2, 3, 4, 5].map((value) => <Star key={value} size={15} fill={value <= rating ? 'currentColor' : 'none'} aria-hidden="true" />)}</div>
                <p>{comment.trim()}</p>{name.trim() && <span className={styles.signature}>{name.trim()}</span>}
              </div>
              <div className={styles.destination}>
                <div className={styles.destinationTitle}><span className={styles.googleMark} aria-hidden="true">G</span><h3>{t.google}</h3></div>
                <p>{t.googleText}</p>
                <button className={styles.copyButton} onClick={copyComment} type="button">{clipboard === 'copied' ? <Check size={15} /> : <Copy size={15} />}{clipboard === 'copied' ? t.copied : t.copy}</button>
                <p className={styles.clipboardStatus} role="status">{clipboard === 'error' ? t.copyError : clipboard === 'copied' ? t.copied : ''}</p>
                <a className={styles.primary} href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">{t.googleAction}<ArrowRight size={17} /></a>
                <p className={styles.destinationNote}>{t.googleNote}</p>
              </div>
              <div className={styles.destination}>
                <div className={styles.destinationTitle}><MessageCircle size={21} strokeWidth={1.3} /><h3>{t.privateTitle}</h3></div>
                <p>{t.privateText}</p>
                <a className={styles.secondary} href={getWhatsAppUrl(privateMessage)} target="_blank" rel="noopener noreferrer">{t.privateAction}<ArrowRight size={16} /></a>
                <p className={styles.destinationNote}>{t.privateNote}</p>
              </div>
            </div>}
          </div>
          <div className={styles.cardFooter}><Waves size={17} strokeWidth={1} />{t.thanks}</div>
        </section>
      </div>
      <footer className={styles.footer}><span>BLUE WAVES</span><span>{t.footer}</span></footer>
    </main>
  )
}
