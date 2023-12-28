import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Link from "next/link";

import { Fragment } from "react";

import Title from "@/components/admin/title";

export default function Page() {

	async function logout(formData: FormData) {
		"use server";

		cookies().delete('admin');
    redirect("/admin/sign-in");
	}

	return (
		<Fragment>
			<Title
				title="logout"
				subtitle="logout and clear user data"
			/>
			<section className="py-10">
				<div className="container">
					<div className="rounded-md py-10 px-5 bg-gray-50 border-2">
						<form action={logout} className="text-center space-y-3">
							<div className="text-sm md:text-base text-gray-600 font-medium sentence">
								You&apos;ll have to login when next you come back!
							</div>
							<div className="relative">
								<button type="submit">
									<span className="inline-block rounded-md text-white px-10 py-3 bg-red-600 font-bold sentence">logout</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</Fragment>
	);
}
