import { MetadataRoute } from 'next'
import { searchClient, srpIndex } from '@/configs/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdealership.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/inventory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  try {
    // Get vehicle pages from Algolia index using the correct v5 API
    const searchResponse = await searchClient.searchSingleIndex({
      indexName: srpIndex!,
      searchParams: {
        query: '',
        hitsPerPage: 1000, // Adjust based on your inventory size
        attributesToRetrieve: ['objectID'],
      },
    })

    const vehiclePages: MetadataRoute.Sitemap = searchResponse.hits.map((vehicle: any) => ({
      url: `${baseUrl}/vehicle/${vehicle.objectID}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...vehiclePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
