import { verify } from "@/utils/jwt";
import { cookies } from "next/headers";
import Supabase from "@/utils/supabase";

export async function GET(request: Request) {
	try {
		const cookieStore = cookies();
		const cookie: any = cookieStore.get("admin");

		if(cookie) {
			const { value: jwt }: { value: string } = cookie;
			const userDataJSON = verify(jwt);

			if(userDataJSON) {
				const { id } = JSON.parse(userDataJSON);
				
				const { data: rows }: any = await Supabase.from("admins")
				.select("id, firstName, lastName, username")
				.eq("id", id);

				if(rows) {
					const [ user ] = rows;

					return Response.json({
						data: {
							user: {
								...user,
								role: "administrator"
							},
							message: "Returned user id, firstName, lastName and username"
						}
					})
				}

				return Response.json({
					error: {
						message: "User not found."
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
		console.log({error})
		return Response.json({
			error: {
				message: "An error occurred, please retry."
			}
		});
	}
} 