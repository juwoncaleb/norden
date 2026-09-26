import React from 'react'
import Link from 'next/link'
import Header from '../component/Header'
import Footer from '../component/footer'
import { client, urlFor } from '../../lib/sanity'

async function getSofas() {
  return await client.fetch(`
    *[_type == "Sofa"] {
      _id,
      title,
      slug,
      description,
      price,
      discountPrice,
      material,
      tags,
      inStock,
      images
    }
  `)
}

export default async function page() {
  const sofas = await getSofas()

  return (
    <div>
      <Header />

      <section className="sofa-hero">
        <div className="sofa-overlay" />
        <div className="sofa-content">
          <h1 className="sofa-title">Sofa</h1>
        </div>
      </section>

      <section className="sofa-grid-section">
        <div className="sofa-grid">
          {sofas.map((sofa) => (
            <Link key={sofa._id} href={`/sofa/${sofa.slug.current}`} className="sofa-card">

              <div className="sofa-card-image">
                {sofa.tags?.length > 0 && (
                  <span className="sofa-tag">{sofa.tags[0]}</span>
                )}
                {sofa.images?.[0] && (
                  <img
                    src={urlFor(sofa.images[0]).width(600).url()}
                    alt={sofa.title}
                  />
                )}
              </div>

              <div className="sofa-card-info">
                <h2 className="sofa-card-title">{sofa.title}</h2>
                {sofa.description && (
                  <p className="sofa-card-desc">{sofa.description}</p>
                )}
                {sofa.material && (
                  <p className="sofa-card-material">{sofa.material}</p>
                )}
                <div className="sofa-card-price">
                  {sofa.discountPrice ? (
                    <>
                      <span className="price-current">${sofa.discountPrice.toLocaleString()}</span>
                      <span className="price-original">${sofa.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="price-current">${sofa.price?.toLocaleString()}</span>
                  )}
                </div>
              </div>

            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}