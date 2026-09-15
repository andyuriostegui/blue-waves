'use client'

import Script from 'next/script'
import styles from './InstagramReels.module.css'

const reels = [
  'https://www.instagram.com/reel/DdO8mh9CZD0/',
  'https://www.instagram.com/reel/DdCErEOCbub/',
  'https://www.instagram.com/reel/DcteWEsAZ-K/',
]

function processEmbeds() {
  const instagram = (window as Window & {
    instgrm?: { Embeds: { process: () => void } }
  }).instgrm
  instagram?.Embeds.process()
}

export default function InstagramReels() {
  return (
    <section className={styles.section} aria-labelledby="links-experience">
      <div className={styles.heading}>
        <h2 id="links-experience">La experiencia</h2>
        <span>Instantes a bordo</span>
      </div>
      <div className={styles.grid}>
        {reels.map((url, index) => (
          <article className={styles.card} key={url} aria-label={`Publicación de Instagram ${index + 1}`}>
            <div className={styles.embed}>
              <blockquote className="instagram-media" data-instgrm-permalink={url} data-instgrm-version="14">
                <a className={styles.fallback} href={url} target="_blank" rel="noopener noreferrer">
                  <span className={styles.play} aria-hidden="true">▷</span>
                  <span>Ver esta publicación en Instagram</span>
                  <span>Blue Waves Cancún</span>
                </a>
              </blockquote>
            </div>
            <a className={styles.externalLink} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir publicación ${index + 1} en Instagram`}>
              <span>Ver en Instagram</span><span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
      <Script id="blue-waves-instagram-embeds" src="https://www.instagram.com/embed.js" strategy="lazyOnload" onReady={processEmbeds} />
    </section>
  )
}
