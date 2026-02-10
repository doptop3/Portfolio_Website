import type { SiteConfig } from './types.ts'

const config: SiteConfig = {
  // Absolute URL to the root of your published site, used for generating links and sitemaps.
  site: 'https://dapop.it.com',
  // The name of site in the title and for SEO.
  title: 'Not A Store :P',
  // The description of site for SEO and RSS feed.
  description:
    'something like an astro site ig..',
  // The author of the site, used in the footer, SEO, and RSS feed.
  author: 'dop',
  // Keywords for SEO, used in the meta tags.
  tags: ['Astro', 'Terminal', 'Theme', 'Dapop', 'Coding'],
  // Path to the image used for generating social media previews.
  socialCardAvatarImage: './src/content/avatar.jpg',
  // Font imported from @fontsource or elsewhere, used for the entire site.
  font: '"JetBrains Mono Variable", monospace',
  // For pagination, the number of posts to display per page.
  pageSize: 5,
    // Whether Astro should resolve trailing slashes in URLs or not.
  trailingSlashes: false,
  // The navigation links to display in the header.
  navLinks: [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: 'About',
      url: '/about',
    },
    {
      name: 'Archive',
      url: '/posts',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/doptop3/Portfolio_Website',
      external: true,
    },
  ],
  // The theming configuration for the site.
  themes: {
    // The theming mode: "single" | "select" | "light-dark-auto".
    mode: 'select',
    // The default theme identifier.
    default: 'gruvbox-dark-hard',
    // Shiki themes to bundle with the site.
    // https://expressive-code.com/guides/themes/#using-bundled-themes
    include: [
      'andromeeda',
      'aurora-x',
      'ayu-dark',
      'catppuccin-frappe',
      'catppuccin-latte',
      'catppuccin-macchiato',
      'catppuccin-mocha',
      'dark-plus',
      'dracula',
      'dracula-soft',
      'everforest-dark',
      'everforest-light',
      'github-dark',
      'github-dark-default',
      'github-dark-dimmed',
      'github-dark-high-contrast',
      'github-light',
      'github-light-default',
      'github-light-high-contrast',
      'gruvbox-dark-hard',
      'gruvbox-dark-medium',
      'gruvbox-dark-soft',
      'gruvbox-light-hard',
      'gruvbox-light-medium',
      'gruvbox-light-soft',
      'houston',
      'kanagawa-dragon',
      'kanagawa-lotus',
      'kanagawa-wave',
      'laserwave',
      'light-plus',
      'material-theme',
      'material-theme-darker',
      'material-theme-lighter',
      'material-theme-ocean',
      'material-theme-palenight',
      'min-dark',
      'min-light',
      'monokai',
      'night-owl',
      'nord',
      'one-dark-pro',
      'one-light',
      'plastic',
      'poimandres',
      'red',
      'rose-pine',
      'rose-pine-dawn',
      'rose-pine-moon',
      'slack-dark',
      'slack-ochin',
      'snazzy-light',
      'solarized-dark',
      'solarized-light',
      'synthwave-84',
      'tokyo-night',
      'vesper',
      'vitesse-black',
      'vitesse-dark',
      'vitesse-light',
    ],
  },
  // Social links to display in the footer.
  socialLinks: {
    github: 'https://github.com/doptop3/Portfolio_Website',
    email: 'hpopham2018@gmail.com',
    linkedin: 'https://www.linkedin.com/in/harrison-p-812383287/',
    rss: true,
  },
}

export default config
