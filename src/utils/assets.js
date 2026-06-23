const modules = import.meta.glob('../../assets/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const entries = Object.entries(modules)
  .filter(([path]) => !path.includes('lily-bg'))
  .map(([path, url]) => ({
    url,
    name: path.split('/').pop().replace('.png', ''),
  }))

export const lilyBg = Object.entries(modules).find(([path]) =>
  path.includes('lily-bg'),
)?.[1]

export const photos = entries.map((e) => e.url)

export const featuredPhotos = photos.slice(0, 3)

export const galleryPhotos = photos.map((url, i) => ({
  url,
  caption: '',
  rotation: ((i % 5) - 2) * 2.5,
}))
