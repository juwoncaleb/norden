'use client'

import { useState } from 'react'
import { urlFor } from '../../../lib/sanity'
import { useCartStore } from '@/lib/store'

export default function SofaDetail({ sofa }) {
  const [activeImage, setActiveImage] = useState(0)
  const [activeColor, setActiveColor] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const { addItem, openCart } = useCartStore()

  if (!sofa) return <p>Product not found</p>

  const images = sofa.images || []

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  // ✅ FIXED ADD TO CART
  const handleAddToCart = () => {
    addItem({
      _id: sofa._id,
      title: sofa.title,
      price: sofa.discountPrice || sofa.price,

      // 🔥 IMPORTANT FIX (this is why image now shows in cart)
      image: sofa.images?.[0]
        ? urlFor(sofa.images[0]).width(300).url()
        : '',
    })

    openCart()
  }

  return (
    <div className="sd-wrapper">

      {/* GALLERY */}
      <div className="sd-gallery">

        <div className="sd-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`sd-thumb ${i === activeImage ? 'active' : ''}`}
              onClick={() => setActiveImage(i)}
            >
              <img
                src={urlFor(img).width(120).url()}
                alt={`view ${i + 1}`}
              />
            </button>
          ))}
        </div>

        <div
          className={`sd-main-image ${zoom ? 'zoomed' : ''}`}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMouseMove}
        >
          {images[activeImage] && (
            <img
              src={urlFor(images[activeImage]).width(1200).url()}
              alt={sofa.title}
              style={
                zoom
                  ? {
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      transform: 'scale(2)',
                    }
                  : {}
              }
            />
          )}
        </div>
      </div>

      {/* INFO */}
      <div className="sd-info">

        {sofa.tags?.[0] && (
          <span className="sd-badge">{sofa.tags[0]}</span>
        )}

        <h1 className="sd-title">{sofa.title}</h1>

        <div className="sd-price">
          {sofa.discountPrice ? (
            <>
              <span className="sd-price-current">
                ${sofa.discountPrice.toLocaleString()}
              </span>
              <span className="sd-price-original">
                ${sofa.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="sd-price-current">
              ${sofa.price?.toLocaleString()}
            </span>
          )}
        </div>

        {sofa.description && (
          <p className="sd-desc">{sofa.description}</p>
        )}

        {/* COLORS */}
        {sofa.colors?.length > 0 && (
          <div className="sd-section">
            <p className="sd-label">
              Color — <span>{sofa.colors[activeColor]?.name}</span>
            </p>

            <div className="sd-colors">
              {sofa.colors.map((c, i) => (
                <button
                  key={i}
                  className={`sd-color-dot ${
                    i === activeColor ? 'active' : ''
                  }`}
                  style={{ background: c.hex }}
                  onClick={() => setActiveColor(i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* FEATURES */}
        {sofa.features?.length > 0 && (
          <div className="sd-section">
            <p className="sd-label">Features</p>
            <ul className="sd-features">
              {sofa.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* META */}
        <div className="sd-meta">
          {sofa.material && (
            <div className="sd-meta-row">
              <span>Material</span>
              <span>{sofa.material}</span>
            </div>
          )}

          {sofa.dimensions && (
            <div className="sd-meta-row">
              <span>Dimensions</span>
              <span>{sofa.dimensions}</span>
            </div>
          )}

          <div className="sd-meta-row">
            <span>Availability</span>
            <span className={sofa.inStock ? 'in' : 'out'}>
              {sofa.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* BUTTON */}
        <button className="sd-cta" onClick={handleAddToCart}>
          Add to Cart
        </button>

      </div>
    </div>
  )
}