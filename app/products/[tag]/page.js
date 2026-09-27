import Footer from '@/app/component/footer'
import Header from '@/app/component/Header'
import client from '@/lib/contentful'

export default async function page({ params }) {
  const { tag } = await params

  console.log('=== TAG FROM URL ===', tag)

  const query = {
    content_type: 'product',
    'fields.tags': tag,
  }

  console.log('=== QUERY SENT TO CONTENTFUL ===', query)

  const entries = await client.getEntries(query)

  console.log('=== RAW RESPONSE FROM CONTENTFUL ===')
  console.log('Total items found:', entries.total)
  console.log('Items:', JSON.stringify(entries.items, null, 2))

  const products = entries.items

  return (
    <div>
      <Header />

      <div className="grid grid-cols-3 gap-6 p-8">
        {products.length === 0 && <p>No products found for "{tag}".</p>}

        {products.map((item) => (
          <div key={item.sys.id}>
            <h3>{item.fields.title}</h3>
            <p>{item.fields.description}</p>
            <p>
              {item.fields.discountedPrice ? (
                <>
                  <span style={{ textDecoration: 'line-through' }}>
                    ₦{item.fields.price}
                  </span>{' '}
                  ₦{item.fields.discountedPrice}
                </>
              ) : (
                <>₦{item.fields.price}</>
              )}
            </p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}