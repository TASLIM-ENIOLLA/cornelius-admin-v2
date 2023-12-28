"use client";

import { useRouter } from 'next/navigation';

import { useRef, useState } from "react";

import Image from "next/image";

export default function Page() {
	const form = useRef <any> (null);
	const router = useRouter();
	const [formPending, setFormPending] = useState <boolean> (false);

	async function onSubmit(event: any): Promise<void> {
		event.preventDefault();
		setFormPending(true);

		const fetchOptions: any = { cache: "no-cache", method: "POST", body: new FormData(form.current) }

		const request: any = await fetch("/api/admin/sign-in", fetchOptions);
		const { data, error }: { data: any, error: any } = await request.json();

		if(data) {
			form.current.reset();

			alert(data.message);
			
			router.push("/admin/dashboard");
		}
		else {
			alert(error.message);
		}

		setFormPending(false);
	}

	return (
		<section className="min-h-screen">
			<div className="py-20">
				<div className="max-w-[350px] mx-auto">
					<div className="space-y-10">
						<div className="text-center space-y-3">
							<Image
								width="80"
								height="80"
								alt="Cornelius Store Logo"
								src="/images/cornelius-store.png"
								className="inline-block"
							/>
							<p className="text-2xl font-bold capitalize">sign in</p>
						</div>
						<div className="border border-gray-300 rounded-md">
							<div className="p-5">
								<form ref={form} onSubmit={onSubmit} className="space-y-3">
									<div className="space-y-2">
										<div className="font-[700] text-black text-base sentence text-black">username</div>
										<input
											required
											type="text"
											name="username"
											defaultValue="taslim.eniolla@gmail.com"
											className="p-2 border border-gray-300 bg-white font-medium block w-full rounded-md"
										/>
									</div>
									<div className="space-y-2">
										<div className="font-[700] text-black text-base sentence text-black">password</div>
										<input
											required
											type="password"
											name="password"
											defaultValue="12345678"
											className="p-2 border border-gray-300 bg-white font-medium block w-full rounded-md"
										/>
									</div>
									<div className="pt-5">
										<input
											type="submit"
											value={formPending ? "please wait..." : "sign in"}
											disabled={formPending}
											className="p-2 text-base font-bold cursor-pointer bg-green-600 text-white capitalize border block w-full rounded-md"
										/>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}