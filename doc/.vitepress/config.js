import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Hypérion Education V2",
  description: "Documentation officielle du projet",
  themeConfig: {
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Installation', link: '/installation' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'API', link: '/architecture/API' },
      { text: 'Base de données', link: '/architecture/BDD' }
    ],
    sidebar: {
      '/architecture/': [
        { text: 'Introduction', link: '/architecture/' },
        { text: 'Base de données', link: '/architecture/BDD' },
        { text: 'API REST', link: '/architecture/API' },
        { text: 'Backend', link: '/architecture/backend' },
        { text: 'Frontend', link: '/architecture/frontend' }
      ]
    }
  }
})
