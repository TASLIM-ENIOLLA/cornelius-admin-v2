import { cookies } from "next/headers";

import { z } from "zod";

import { sign } from "@/utils/jwt";
import Supabase from "@/utils/supabase";
import { decrypt } from "@/utils/crypto-js";

export async function POST(request: Request) {
	const cookieStore = cookies();
	const formData: FormData  = await request.formData();

	const username: string = formData.get("username") as string;
	const password: string = formData.get("password") as string;

	try {
		const vUsername = z.string().email().min(5).parse(username);
		const vPassword = z.string().min(8).parse(password);

		const { data: rows }: any = await Supabase.from("admins")
		.select("id, password, firstName, lastName, username")
		.eq("username", vUsername);

		if(rows) {
			const [ row ] = rows;
	
			if(row) {
				const { password: ePassword, ...otherData}: Record<string, string> = row;
				const dPassword = decrypt(ePassword);
				
				if(vPassword === dPassword) {
					const jwt = await sign(JSON.stringify(otherData));
		
					cookieStore.set({
						name: "admin",
						value: jwt,
						path: "/"
					});

					return Response.json({
						data: {
							jwt,
							message: "Sign in successful, redirecting..."
						}
					})
				}
				else {
					return Response.json({
						error: {
							message: "Password seems to be incorrect, kindly check and retry."
						}
					});
				}
			}
			else {
				return Response.json({
					error: {
						message: "Username is not recognized."
					}
				});
			}
		}
		else {
			return Response.json({
				error: {
					message: "An error occured, please retry."
				}
			});
		}
	}
	catch(error) {
		return Response.json({
			error: {
				message: "An error occured, please retry."
			}
		});
	}
}