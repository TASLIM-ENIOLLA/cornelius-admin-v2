import Supabase from "@/utils/supabase";

export async function GET(request: Request) {
	const { data, error } = await Supabase.from("types")
	.select("id, name");

	if(data) {
		return Response.json({
			data: {
				rows: data
			}
		});
	}

	return Response.json({
		error: {
			message: "Product types not found."
		}
	});
}