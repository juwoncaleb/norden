export default {
  name: "Sofa",
  type: "document",
  title: "Sofa",
  fields: [
    { name: "title", type: "string", title: "Sofa Name" },
    {
      name: "slug", type: "slug", title: "Slug",
      options: { source: "title", maxLength: 96 },
    },
    { name: "description", type: "text", title: "Description" },
    { name: "price", type: "number", title: "Price" },
    { name: "discountPrice", type: "number", title: "Discount Price" },
    {
      name: "category", type: "string", title: "Furniture Category",
      options: {
        list: [
          { title: "Chair", value: "chair" },
          { title: "Sofa", value: "sofa" },
          { title: "Table", value: "table" },
          { title: "Bed", value: "bed" },
          { title: "Cabinet", value: "cabinet" },
          { title: "Shelf", value: "shelf" },
        ],
      },
    },
    { name: "material", type: "string", title: "Material" },
    {
      name: "dimensions", type: "string", title: "Dimensions",
      description: "e.g. 120cm x 80cm x 75cm",
    },
    { name: "inStock", type: "boolean", title: "In Stock", initialValue: true },
    {
      name: "images", type: "array", title: "Sofa Images",
      of: [{ type: "image", options: { hotspot: true } }],
    },
    { name: "tags", type: "array", title: "Tags", of: [{ type: "string" }] },

    // --- new fields ---
    {
      name: "colors",
      type: "array",
      title: "Available Colors",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Color Name" },
            { name: "hex", type: "string", title: "Hex Code (e.g. #d4c5b0)" },
          ],
        },
      ],
    },
    {
      name: "features",
      type: "array",
      title: "Key Features",
      of: [{ type: "string" }],
      description: "e.g. Machine Washable, Feather-filled, Hidden Storage",
    },
    { name: "seating", type: "string", title: "Seating Capacity", description: "e.g. 3 Seater" },
    { name: "warranty", type: "string", title: "Warranty", description: "e.g. 2 Year Manufacturer Warranty" },
  ],
};