import Supabase from "@/utils/supabase";

async function getProducts() {
	return await Supabase.from("products")
	.select(`id, name, price, description, payment_link, categories (id, name), types (id, name)`);
}

async function getProductImages(productsID: string) {
	return Supabase.from("products_blobs")
	.select("blob_url")
	.eq("product_id", productsID);
}

export async function GET() {
	const { data: productsData } = await getProducts();

	if(productsData) {
		const result = await Promise.all(productsData.map(async (props) => {
			const { data } = await getProductImages(props.id);
			
			return {
				...props,
				images: data?.map(each => {
					return JSON.parse(each.blob_url)
				})
			};
		}));

		return Response.json({
			data: {
				rows: result
			}
		});
	}

	return Response.json({
		error: {
			message: "An error occured, please retry!"
		}
	});
}