import { Fragment } from "react";

import Link from "next/link";
import Image from "next/image";

import { type RouteType, routes } from "@/props/admin/header/routes";

import ProfileCircle from "@/components/admin/header/profile-card";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<section>
			<header className="sticky top-0 left-0 w-full z-10 shadow-lg bg-gray-700">
				<div className="py-3">
					<div className="container">
						<div className="flex items-center justify-between">
							<Image
								width="45"
								height="45"
								alt="Cornelius Store Logo"
								src="/images/cornelius-store.png"
								className="rounded-full bg-white"
							/>
							<div className="hidden md:flex items-center gap-10">
								<div className="flex gap-10">
									{routes.map(({ name, title, icon, href }: RouteType) => (
										<Link href={href} className="block" key={href}>
											<span title={title} className="text-white font-bold capitalize">{name}</span>
										</Link>
									))}
								</div>
								<ProfileCircle />
							</div>
						</div>
					</div>
				</div>
			</header>
			<Fragment>
				{children}
			</Fragment>
		</section>
	);
}