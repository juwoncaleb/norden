import { client } from '../../../lib/sanity'
import Header from '../../component/Header'
import Footer from '../../component/footer'
import SofaDetail from './SofaDetail'

async function getSofa(slug) {
  return await client.fetch(`
    *[_type == "Sofa" && slug.current == $slug][0] {
      _id, title, slug, description, price, discountPrice,
      material, dimensions, inStock, images, tags,
      colors, features, seating, warranty, category
    }
  `, { slug })
}

export default async function page({ params }) {
  const { slug } = await params
  const sofa = await getSofa(slug)

  return (
    <div>
      <Header />
      <SofaDetail sofa={sofa} />
      <Footer />
    </div>
  )
}