import Supabase from "@/utils/supabase";

type RouteParams = {
  params: {
    id: string
  }
}

async function getProductData(id: string) {
  return await Supabase.from("products")
  .select(`id, name, price, description, quantity, categories (id, name), types (id, name)`)
  .eq("id", id)
  .single();
}

async function getProductImages(id: string) {
  return await Supabase.from("products_blobs")
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
        images: productImages?.map((each: any) => {
          return JSON.parse(each.blob_url)
        })
      }
    });
  }

  return Response.json({
    error: {
      message: "An error occured, please retry."
    }
  });
}