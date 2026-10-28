
import { useEffect } from "react";
import { useRouter } from "next/router";
import { saveRecentlyViewed } from "../../lib/recentlyViewed";

export default function RecentlyViewedTracker({
  product,
  category = "Furniture",
}) {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady || !product) return;

    const fields = product.fields || product;

    const imageField =
      fields.image ||
      fields.images?.[0] ||
      fields.productImage ||
      fields.thumbnail;

    let image = "";

    if (typeof imageField === "string") {
      image = imageField;
    } else if (imageField?.fields?.file?.url) {
      image = imageField.fields.file.url;
    } else if (typeof imageField?.url === "string") {
      image = imageField.url;
    }

    if (image.startsWith("//")) {
      image = `https:${image}`;
    }

    const href = router.asPath.split("?")[0];

    saveRecentlyViewed({
      id: product.sys?.id || fields.id || fields.slug || href,
      title:
        fields.title ||
        fields.name ||
        fields.productName ||
        "NÓRDEN Furniture",
      image,
      price:
        fields.discountedPrice ??
        fields.price ??
        fields.productPrice ??
        0,
      category: fields.category || category,
      href,
    });
  }, [product, category, router.isReady, router.asPath]);

  return null;
}
