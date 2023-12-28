"use client";

import Link from "next/link";

import { Fragment, useState, useEffect } from "react";

import Title from "@/components/admin/title";
import DataTable from "@/components/admin/data-table";

export default function Page() {
	const [ container, setContainer ] = useState <any> ();
	const [ categories, setCategories ] = useState <any> ();
	const [ searchQuery, setSearchQuery ] = useState <string> ("");

	useEffect(() => {
		fetch("/api/admin/categories")
		.then((response) => response.json())
		.then(({ data, error }) => {
			if(data) {
				setContainer(data.rows);
			}
		})
	}, []);

	useEffect(() => {
		if(Array.isArray(container)) {
			if(searchQuery !== "") {
				setCategories(container.filter(({name}) => {
					return new RegExp(searchQuery).test(name);
				}));
			}
			else {
				setCategories(container); 
			}
		}
	}, [container, searchQuery])

	return (
		<Fragment>
			<Title
				title="categories"
				subtitle="view and modify all categories"
			/>
			<section className="py-5">
				<div className="container">
					<div className="space-y-3">
						<Link href="/admin/dashboard/categories/new" className="inline-block py-3 px-5 shadow-lg bg-gray-900 rounded">
							<span className="text-sm capitalize font-bold text-white">create new category</span>
						</Link>
						<form className="grid md:grid-cols-4">
							<div className="col-span-2">
								<input
									value={searchQuery}
									placeholder="Type here to search..."
									className="block w-full text-sm rounded-md border p-3"
									onChange={({target: {value}}) => setSearchQuery(value)}
								/>
							</div>
						</form>
						<DataTable
							serialize={true}
							data={categories}
							actions={{
								edit: "/admin/dashboard/categories/edit?id=:id",
								delete: "/admin/dashboard/categories/delete/:id",
							}}
							cols={[
								{ key: "name", name: "category name"},
								{ key: "description", name: "description"},
							]}
						/>
					</div>
				</div>
			</section>
		</Fragment>
	);
}