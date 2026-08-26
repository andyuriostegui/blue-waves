import type { ResolvedExperienceContent } from '@/lib/experience-media'
import type { Dictionary } from './es'

export function localizeExperienceContent(
  content: ResolvedExperienceContent,
  dict: Dictionary,
): ResolvedExperienceContent {
  const chapters = content.chapters.map((chapter) => {
    const copy =
      dict.experiencias.chapters[
        chapter.id as keyof typeof dict.experiencias.chapters
      ]
    if (!copy) return chapter
    return {
      ...chapter,
      kicker: copy.kicker,
      title: copy.title,
      body: copy.body,
      media: chapter.media.map((item, index) => ({
        ...item,
        alt: copy.alts[index] ?? item.alt,
      })),
    }
  })

  return {
    hero: { ...content.hero, alt: dict.experiencias.heroAlt },
    cta: { ...content.cta, alt: dict.experiencias.ctaAlt },
    lookbook: content.lookbook.map((item, index) => ({
      ...item,
      alt: dict.experiencias.lookbookAlts[index] ?? item.alt,
    })),
    chapters,
  }
}
