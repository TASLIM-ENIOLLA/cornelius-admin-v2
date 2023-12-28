"use client";

import Link from "next/link";

import { Fragment } from "react";

import Title from "@/components/admin/title";

export default function Page() {

	return (
		<Fragment>
			<Title
				title="products"
				subtitle="view and modify all products"
			/>
			<section className="py-10">
				<div className="container">
					<div className="rounded-md py-10 px-5 bg-gray-50 border-2">
						<div className="text-center space-y-3">
							<div className="text-sm md:text-base text-gray-600 font-medium sentence">
								View all payment on our payment partner&apos;s platform
							</div>
							<div className="relative">
								<Link href="https://dashboard.paystack.com/#/login">
									<span className="inline-block rounded-md text-white px-5 py-3 bg-gray-800 font-bold sentence">go to dashboard</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</Fragment>
	);
}
