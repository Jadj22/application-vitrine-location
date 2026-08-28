import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: 'https://dodomeexample', lastModified: new Date() }, { url: 'https://dodomeexample/b/atelier-lumiere', lastModified: new Date() }, { url: 'https://dodomeexample/b/atelier-lumiere/items/lampe-arc', lastModified: new Date() }] }
