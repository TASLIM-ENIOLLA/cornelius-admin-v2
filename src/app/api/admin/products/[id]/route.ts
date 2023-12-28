import Supabase from "@/utils/supabase";

type RouteParams = {
  params: {
    id: string
  }
}

async function getProductData(id: string) {
  return await Supabase.from("products")
  .select(`id, name, price, description, payment_link, categories (id, name), types (id, name)`)
  .eq("id", id)
  .single();
}

async function getProductImages(id: string) {
	return Supabase.from("products_blobs")
	.select("blob_url")
	.eq("product_id", id);
}

export async function GET(request: Request, { params: { id } }: RouteParams) {
  const { data: productData } = await getProductData(id);

  if(productData) {
    const { data: productImages } = await getProductImages(productData.id);

    return Response.json({
      data: {
        ...productData,
        images: productImages?.map(each => {
					return JSON.parse(each.blob_url)
				})
      }
    });
  }

  return Response.json({
    data: {
      message: "All went well"
    }
  })
}