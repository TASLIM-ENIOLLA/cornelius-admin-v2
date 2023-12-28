"use client";

import Link from "next/link";

import { Fragment } from "react";

import Title from "@/components/admin/title";

import { type RouteType, routes } from "@/props/admin/header/routes";

export default function Page() {
	const filteredRoutes = routes.filter(({ href }: { href: string }) => href !== "/admin/dashboard");

	return (
		<Fragment>
			<Title
				title="home"
				subtitle="find what you need"
			/>
			<section className="py-10">
				<div className="container">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
						{filteredRoutes.map((props: RouteType, index: number) => (
							<DashboardCard key={index} {...props} />
						))}
					</div>
				</div>
			</section>
		</Fragment>
	);
}

function DashboardCard(props: RouteType) {
	"use client";

	const { name, icon, title, href, color }: RouteType = props;

	return (
		<article className="cursor-pointer shadow bg-gray-300 bg-opacity-25 rounded-lg p-5">
			<div className="space-y-3">
				<div className={`flex bg-gray-700 bg-opacity-75 items-center justify-center w-[50px] h-[50px] rounded-full`}>
					<span className={`text-xl text-white ${icon}`}></span>
				</div>
				<div className="">
					<Link href={href} className="capitalize font-bold md:text-xl text-gray-800">{name}</Link>
					<div className="text-sm md:text-base text-gray-600 font-medium sentence">{title}</div>
				</div>
			</div>			
		</article>
	);
}