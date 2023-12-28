"use client";

import Link from "next/link";

import { Fragment } from "react";

export default function Page() {
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