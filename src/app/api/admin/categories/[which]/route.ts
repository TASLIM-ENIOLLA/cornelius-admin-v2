import Supabase from "@/utils/supabase";

import { z } from "zod";

export async function POST(request: Request, { params: { which } }: { params: { which: string }}) {
	if(!["new", "edit"].includes(which)) {
		return new Response("Resource not found!", {
			status: 404
		});
	}

	const formData = await request.formData();

	try {
		const name: string = z.string().min(5).parse(formData.get("name"));
		const description: string = z.string().min(5).parse(formData.get("description"));
		const id: string | null = formData.get("id") ? z.string().parse(formData.get("id")) : null;

		const { data, error } = await (
			(which === "new")
			? Supabase.from('categories')
		  .insert([{ name, description }])
		  .select()
		  : Supabase.from('categories')
		  .update({ name, description })
		  .eq('id', id)
		  .select()
		);

	  if(data) {
	  	return Response.json({
				data: {
					message: (
						(which === "new")
						? "New category created."
						: "category successfully updated."
					)
				}
			});
		}

		return Response.json({
			error: {
				error,
				message: "An error occured, please retry."
			}
		});
	}
	catch(error) {
		console.log({ error });

		return Response.json({
			error: {
				message: "An error occured, please retry."
			}
		});
	}
}