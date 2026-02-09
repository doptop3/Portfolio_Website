import {
  type TextmateStyles,
  type ThemesWithColorStyles,
  type ThemeKey,
  themeKeys,
  type ThemeOverrides,
  type Collation,
  type CollationGroup,
} from './types.ts'
import {
  loadShikiTheme,
  type BundledShikiTheme,
  type ExpressiveCodeTheme,
} from 'astro-expressive-code'
import { getCollection, type CollectionEntry } from 'astro:content'
import Color from 'color'
import { slug } from 'github-slugger'

// -----------------------------
// Basic utilities
// -----------------------------
export function dateString(date: Date) {
  return date.toISOString().split('T')[0]
}

export function pick(obj: Record<string, any>, keys: string[]) {
  return Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]]),
  )
}

// -----------------------------
// Theme color utilities
// -----------------------------
export function flattenThemeColors(theme: ExpressiveCodeTheme): Record<string, string> {
  const scopedThemeSettings = theme.settings.reduce(
    (acc, item) => {
      const { scope, settings } = item
      const { foreground } = settings
      if (scope && foreground) {
        for (const s of scope) {
          acc[s] = foreground.toLowerCase().trim()
        }
      }
      return acc
    },
    {} as Record<string, string>,
  )
  return { ...theme.colors, ...scopedThemeSettings }
}

// -----------------------------
// Textmate / syntax color mapping
// -----------------------------
const unresolvedStyles: TextmateStyles = {
  foreground: ['editor.foreground'],
  background: ['editor.background'],
  accent: [
    'heading.1.markdown entity.name',
    'heading.1.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  heading1: ['heading.1.markdown entity.name', 'markup.heading', 'editor.foreground'],
  heading2: ['heading.2.markdown entity.name', 'markup.heading', 'editor.foreground'],
  heading3: ['heading.3.markdown entity.name', 'markup.heading', 'editor.foreground'],
  heading4: ['heading.4.markdown entity.name', 'markup.heading', 'editor.foreground'],
  heading5: ['heading.5.markdown entity.name', 'markup.heading', 'editor.foreground'],
  heading6: ['heading.6.markdown entity.name', 'markup.heading', 'editor.foreground'],
  list: ['markup.list.bullet', 'punctuation.definition.list.begin.markdown', 'editor.foreground'],
  italic: ['markup.italic.markdown', 'markup.italic', 'editor.foreground'],
  link: ['string.other.link.title.markdown', 'markup.link', 'editor.foreground'],
  separator: ['meta.separator.markdown', 'editor.foreground'],
  note: ['terminal.ansiBlue', 'terminal.ansiBrightBlue'],
  tip: ['terminal.ansiGreen', 'terminal.ansiBrightGreen'],
  important: ['terminal.ansiMagenta', 'terminal.ansiBrightMagenta'],
  caution: ['terminal.ansiYellow', 'terminal.ansiBrightYellow'],
  warning: ['terminal.ansiRed', 'terminal.ansiBrightRed'],
  comment: ['comment', 'punctuation.definition.comment', 'foreground'],
  constant: ['constant.language.boolean', 'constant.language', 'foreground'],
  entity: ['entity.name.function', 'support.function', 'function', 'foreground'],
  tag: ['entity.name.tag', 'meta.tag', 'foreground'],
  keyword: ['keyword', 'punctuation.definition.keyword', 'keyword.operator', 'foreground'],
  string: ['string', 'string.quoted', 'string.value', 'foreground'],
  variable: ['variable', 'variable.language', 'support.variable', 'foreground'],
  regexp: ['string.regexp', 'constant.other.character-class.regexp', 'foreground'],
  blue: ['terminal.ansiBlue', 'terminal.ansiBrightBlue'],
  green: ['terminal.ansiGreen', 'terminal.ansiBrightGreen'],
  red: ['terminal.ansiRed', 'terminal.ansiBrightRed'],
  yellow: ['terminal.ansiYellow', 'terminal.ansiBrightYellow'],
  magenta: ['terminal.ansiMagenta', 'terminal.ansiBrightMagenta'],
  cyan: ['terminal.ansiCyan', 'terminal.ansiBrightCyan'],
}

// -----------------------------
// Theme resolver
// -----------------------------
export async function resolveThemeColorStyles(
  themes: BundledShikiTheme[],
  overrides?: ThemeOverrides,
): Promise<ThemesWithColorStyles> {
  const validateColor = (color: string) => {
    const colorRegex = /^(#|rgb|hsl)/i
    if (!colorRegex.test(color)) return undefined
    try {
      return new Color(color).hex()
    } catch {
      return undefined
    }
  }

  const resolvedThemes = themes.map(async (theme) => {
    const loadedTheme = await loadShikiTheme(theme)
    const flattenedTheme = flattenThemeColors(loadedTheme)
    const result = {} as Record<ThemeKey, string>

    for (const themeKey of Object.keys(unresolvedStyles) as ThemeKey[]) {
      if (overrides?.[theme]?.[themeKey]) {
        const override = overrides[theme][themeKey]
        const overrideColor = validateColor(override)
        if (overrideColor) {
          result[themeKey] = override
          continue
        }
        if (themeKeys.includes(override as ThemeKey)) {
          for (const textmateGroup of unresolvedStyles[override as ThemeKey]) {
            if (flattenedTheme[textmateGroup]) {
              result[themeKey] = flattenedTheme[textmateGroup]
              break
            }
          }
        }
        if (!result[themeKey]) {
          console.warn(
            `Theme "${theme}" has an override for "${themeKey}" with value "${override}", but it’s neither a valid color nor a theme key.`,
          )
        }
      } else {
        for (const textmateGroup of unresolvedStyles[themeKey]) {
          if (flattenedTheme[textmateGroup]) {
            result[themeKey] = flattenedTheme[textmateGroup]
            break
          }
        }
      }
    }
    return [theme, result]
  })

  return Object.fromEntries(await Promise.all(resolvedThemes)) as ThemesWithColorStyles
}

// -----------------------------
// Theme apply
// -----------------------------
export async function applyThemeToDocument(
  themeName: string,
  themes: BundledShikiTheme[],
  overrides?: ThemeOverrides
): Promise<void> {
  const resolved = await resolveThemeColorStyles(themes, overrides)
  const selectedTheme = resolved[themeName as BundledShikiTheme]

  if (!selectedTheme) {
    console.warn(`Theme "${themeName}" not found in resolved themes.`)
    return
  }

  const root = document.documentElement

  // Apply all colors to --theme-* CSS vars
  Object.entries(selectedTheme).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value as string)
  })

  // Ensure font var exists too
  root.style.setProperty('--theme-font', "'JetBrains Mono Variable', monospace")

  console.info(`[Theme applied] ${themeName}`)
}

// -----------------------------
// Posts utilities
// -----------------------------
export async function getSortedPosts() {
  const allPosts = await getCollection('posts', (entry: CollectionEntry<'posts'>) =>
    import.meta.env.PROD ? entry.data.draft !== true : true,
  )
  return allPosts.sort((a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) => (a.data.published < b.data.published ? -1 : 1))
}

// -----------------------------
// Collation / grouping utilities
// -----------------------------
abstract class PostsCollationGroup implements CollationGroup<'posts'> {
  title: string
  url: string
  collations: Collation<'posts'>[]

  constructor(title: string, url: string, collations: Collation<'posts'>[]) {
    this.title = title
    this.url = url
    this.collations = collations
  }

  sortCollationsAlpha(): Collation<'posts'>[] {
    return this.collations.sort((a, b) => a.title.localeCompare(b.title))
  }

  sortCollationsLargest(): Collation<'posts'>[] {
    return this.collations.sort((a, b) => b.entries.length - a.entries.length)
  }

  sortCollationsMostRecent(): Collation<'posts'>[] {
    return this.collations.sort((a, b) => {
      const aDate = a.entries[a.entries.length - 1].data.published
      const bDate = b.entries[b.entries.length - 1].data.published
      return aDate < bDate ? 1 : -1
    })
  }

  add(item: CollectionEntry<'posts'>, collationTitle: string): void {
    const collationSlug = slug(collationTitle.trim())
    const existing = this.collations.find((i) => i.titleSlug === collationSlug)
    if (existing) {
      if (!existing.entries.find((e) => e.id === item.id)) existing.entries.push(item)
    } else {
      this.collations.push({
        title: collationTitle,
        titleSlug: collationSlug,
        url: `${this.url}/${encodeURIComponent(collationSlug)}`,
        entries: [item],
      })
    }
  }

  match(rawKey: string): Collation<'posts'> | undefined {
    return this.collations.find((entry) => entry.title === rawKey)
  }

  matchMany(rawKeys: string[]): Collation<'posts'>[] {
    return this.collations.filter((entry) => rawKeys.includes(entry.title))
  }
}

export class TagsGroup extends PostsCollationGroup {
  private constructor(title: string, url: string, items: Collation<'posts'>[]) {
    super(title, url, items)
  }

  static async build(posts?: CollectionEntry<'posts'>[]): Promise<TagsGroup> {
    const sortedPosts = posts || (await getSortedPosts())
    const tagsGroup = new TagsGroup('Tags', '/tags', [])
    sortedPosts.forEach((post: CollectionEntry<'posts'>) => {
      const frontmatterTags = post.data.tags || []
      frontmatterTags.forEach((tag: string) => tagsGroup.add(post, tag))
    })
    return tagsGroup
  }
}

export function getPostSequenceContext(
  post: CollectionEntry<'posts'>,
  posts: CollectionEntry<'posts'>[],
) {
  const index = posts.findIndex((p) => p.id === post.id)
  const prev = index > 0 ? posts[index - 1] : undefined
  const next = index < posts.length - 1 ? posts[index + 1] : undefined
  return { index, prev, next }
}

// -----------------------------
// Apply theme on load
// -----------------------------
if (typeof window !== 'undefined') {
  import('./site.config.ts').then(async ({ default: siteConfig }) => {
    const saved = localStorage.getItem('theme') || siteConfig.themes.default
    await applyThemeToDocument(saved, siteConfig.themes.include, siteConfig.themes.overrides)
  })
}