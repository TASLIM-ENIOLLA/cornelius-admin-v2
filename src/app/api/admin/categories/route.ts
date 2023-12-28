import { verify } from "@/utils/jwt";
import { cookies } from "next/headers";
import Supabase from "@/utils/supabase";

export async function GET(request: any, params: any) {
	const searchParams = request.nextUrl.searchParams;
  const categoryID: string = searchParams.get("id");
  
	try {
		const cookieStore = cookies();
		const cookie: any = cookieStore.get("admin");

		if(cookie) {
			const { value: jwt }: { value: string } = cookie;
			const userDataJSON = verify(jwt);

			if(userDataJSON) {
				const { data: rows, error }: any = await (
					(categoryID === null)
					? Supabase.from("categories")
					.select("id, name, description")
					: Supabase.from("categories")
					.select("id, name, description")
					.eq("id", categoryID)
				);

				if(rows) {
					return Response.json({
						data: {
							rows: rows.map((row: any) => ({...row, timestamp: new Date(row.timestamp).toDateString()})),
							message: `Returned ${rows.length} categor${rows.length > 1 ? "ies" : "y"}.`
						}
					});
				}

				return Response.json({
					error: {
						message: "Product categories not found."
					}
				});
			}

			return Response.json({
				error: {
					message: "Authentication failed, please sign-in."
				}
			});
		}

		return Response.json({
			error: {
				message: "Authentication failed, please sign-in."
			}
		});
	}
	catch(error) {
		return Response.json({
			error: {
				message: "An error occured, please retry!"
			}
		});
	}
}