import { z } from "zod";
import { put } from "@vercel/blob";
import { isJSON } from "@/utils/json";
import Supabase from "@/utils/supabase";

function updateProductData(id: string, { name, price, category_id, description, type_id, quantity }: Record<string, any>) {
	return Supabase.from('products')
	.update([{ name, price, category_id, description, type_id, quantity }])
	.eq("id", id)
	.select();
}

function removeOldProductImages(id: string) {
	return Supabase.from("products_blobs")
	.delete()
	.eq("product_id", id);
}

function uploadProductImages(id: string, images: any[]) {
	const uploads = images.map(async (image: any) => {
		const blob = await put(image.name, image, {
			access: "public"
		});

		return await Supabase.from('products_blobs')
		.insert([{ product_id: id, blob_url: blob }])
		.select();
	});

	return Promise.all(uploads);
}

export async function POST(request: Request) {
	const formData: FormData = await request.formData();
	
	try {
		const id: string = z.coerce.string().parse(formData.get("id"));
		const name: string = z.coerce.string().parse(formData.get("name"));
		const price: string = z.coerce.string().parse(formData.get("price"));
		const type_id: number = z.coerce.number().parse(formData.get("typeID"));
		const quantity: number = z.coerce.number().parse(formData.get("quantity"));
		const category_id: number = z.coerce.number().parse(formData.get("categoryID"));
		const description: string = z.coerce.string().parse(formData.get("description"));

		const images: any[] = formData.getAll("images[]");

		const { data, error } = await updateProductData(id, { name, price, category_id, description, type_id, quantity });

		if(data) {
			await removeOldProductImages(id);

			if(true) {
				const uploaded = await uploadProductImages(id, images);

				if(uploaded) {
					return Response.json({
						data: {
							message: "Product successfully updated."
						}
					});
				}

				return Response.json({
					data: {
						message: "An error occured finishing the update. Contact you administrator."
					}
				});
			}

			return Response.json({
				error: {
					error,
					message: "Couldn't finish updating product, please retry."
				}
			});
		}

		return Response.json({
			error: {
				error,
				message: "Couldn't update product, please retry."
			}
		});
	}
	catch(error: any) {
		const jsonMssg = isJSON(error.message);

		if(jsonMssg) {
			const [ error ] = jsonMssg;

			return Response.json({
				error: error.message
			});
		}

		return Response.json({
			error: error.message || "An error occured, please retry."
		});
	}
}

// export async function POST(request: Request) {
// 	const formData: FormData = await request.formData();

// 	try {
// 		const type_id = z.coerce.number().parse(formData.get("typeID"));
// 		const name = z.string().min(5).max(50).parse(formData.get("name"));
// 		const category_id = z.coerce.number().parse(formData.get("categoryID"));
// 		const description = z.coerce.string().parse(formData.get("description"));
// 		const quantity = z.string().url().parse(formData.get("quantity"));
// 		const price = z.coerce.number().lte(999).parse("1000" || formData.get("price"));
// 		const images = formData.getAll("images[]");

// 		const { data, error } = await Supabase.from('products')
// 		.insert([{ name, price, category_id, description, type_id, quantity }])
// 		.select();

// 		if(data) {
// 			const [ productData ] = data;
// 			const { id } = productData;

// 			images.forEach(async (image: any) => {
// 				const blob = await put(image.name, image, {
// 					access: "public"
// 				});

// 				await Supabase.from('products_blobs')
// 				.insert([{ product_id: id, blob_url: blob }])
// 				.select();
// 			});

// 			return Response.json({
// 				data: {
// 					message: "Product added successfully"
// 				}
// 			});
// 		}

// 		return Response.json({
// 			error
// 		});
// 	}
// 	catch(error) {
// 		return Response.json({
// 			error
// 		});
// 	}
// }