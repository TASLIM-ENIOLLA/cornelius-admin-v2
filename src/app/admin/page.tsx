import { redirect } from "next/navigation";

export default function Page() {
	redirect("/admin/sign-in");

	return (
		<section className="py-10">
			<div className="container">
				<div className="text-center">
					All rights reserved. &copy; {new Date().getFullYear()} Cornelius Store.
				</div>
			</div>
		</section>
	);
}