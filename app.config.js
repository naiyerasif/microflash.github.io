module.exports = {
  name: 'Microflash',
  description: 'Reflections on design and development by Naiyer Asif',
  url: 'https://mflash.dev',
  favicon: 'https://raw.githubusercontent.com/Microflash/microflash.github.io/release/src/favicon.png',
  maintainer: 'Naiyer Asif',
  copyright: `Copyright ${new Date().getFullYear()} ${this.name}`,
  prefs: {
    draftDir: 'archive/backlog',
    editContext: 'https://github.com/Microflash/microflash.github.io/edit/release',
    spritePath: '/assets/images/icons.svg',
    excerptSize: 251,
    maxTocDepth: 3,
    outdationPeriod: 365 // in days
  },
  searchConfig: {
    file: {
      dir: 'static',
      name: 'search.json'
    },
    options: {
      shouldSort: true,
      includeMatches: true,
      tokenize: true,
      matchAllTokens: true,
      threshold: 0.3,
      location: 0,
      distance: 600,
      maxPatternLength: 32,
      minMatchCharLength: 3,
      keys: [
        'title',
        'excerpt'
      ]
    }
  }
}
