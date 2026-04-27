const RSS_URL = 'https://ioscholarships.com/feed'

export async function fetchRSSScholarships() {
    const res = await fetch(RSS_URL)
    const xml = await res.text()

    const { XMLParser } = await import('fast-xml-parser')
    const parser = new XMLParser()
    const result = parser.parse(xml)

    const items = result?.rss?.channel?.item || []

    return items.map((item: any) => ({
        name: item.title || 'ไม่มีชื่อ',
        level: 'ทุกระดับ' as const,
        field: 'ทุกสาขา',
        country: 'US',
        deadline: null,
        amount: null,
        currency: null,
        url: item.link || '',
        source: 'ioscholarships.com',
        description: item.description?.replace(/<[^>]*>/g, '').slice(0, 500) || null,
    }))
}