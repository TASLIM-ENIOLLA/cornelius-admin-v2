import Supabase from "@/utils/supabase";

import { put } from "@vercel/blob";

import { z } from "zod";

export async function POST(request: Request) {
	const formData: FormData = await request.formData();

	try {
		const type_id = z.coerce.number().parse(formData.get("typeID"));
		const name = z.string().min(5).max(50).parse(formData.get("name"));
		const category_id = z.coerce.number().parse(formData.get("categoryID"));
		const description = z.coerce.string().parse(formData.get("description"));
		const payment_link = z.string().url().parse(formData.get("paymentLink"));
		const price = z.coerce.number().lte(999999999).parse(formData.get("price"));
		
		const images = formData.getAll("images[]");

		const { data, error } = await Supabase.from('products')
		.insert([{ name, price, category_id, description, type_id, payment_link }])
		.select();

		if(data) {
			const [ productData ] = data;
			const { id } = productData;

			images.forEach(async (image: any) => {
				const blob = await put(image.name, image, {
					access: "public"
				});

				const { data, error } = await Supabase.from('products_blobs')
				.insert([{ product_id: id, blob_url: blob }])
				.select();
			});

			return Response.json({
				data: {
					message: "Product added successfully"
				}
			});
		}

		return Response.json({
			error
		});
	}
	catch(error) {
		return Response.json({
			error
		});
	}
}