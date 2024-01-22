"use client";

import Link from "next/link";
import Image from "next/image";

import { Fragment, useState, useMemo, useEffect } from "react";

import Title from "@/components/admin/title";

export default function Page() {
	const [ products , setProducts ] = useState <any> ();
	const [ container, setContainer ] = useState <any> ();
	const [ searchQuery, setSearchQuery ] = useState <string> ("");

	function getProducts() {
		const fetchURL: string = "/api/admin/products";
		const fetchOptions: RequestInit = {
			method: "GET",
			cache: "no-cache"
		}

		fetch(fetchURL, fetchOptions)
		.then((response) => response.json())
		.then(({ data }) => {
			if(data) {
				setProducts(data.rows);
				setContainer(data.rows);
			}
		});
	}

	function onSearch(query: string) {
		if(Array.isArray(products)) {
			let filtrate: any[] = [];
			let pool = container;

			["name"].forEach((prop) => {
				const {a, b} = pool.reduce((accumulator: {a: any[], b: any[]}, current: any) => {
					const value = current[prop];
					const pattern = new RegExp(query, "i");

					if(pattern.test(value)) {
						return ({
							...accumulator,
							a: Array.isArray(accumulator.a) ? [
								...accumulator.a,
								current
							] : [ current ]
						});
					}

					return ({
						...accumulator,
						b: Array.isArray(accumulator.b) ? [
							...accumulator.b,
							current
						] : [ current ]
					});
				}, {a: [], b: []});

				filtrate = Array.isArray(a) ? [ ...filtrate, ...a ] : filtrate;
				pool = b;
			});

			setProducts(filtrate)
		}
	}

	useEffect(() => {
		getProducts();
	}, []);

	useEffect(() => {
		if(searchQuery) {
			onSearch(searchQuery);
		}
		else {
			setProducts(container);
		}
	}, [searchQuery]);

	return (
		<Fragment>
			<Title
				title="products"
				subtitle="view and modify all products"
			/>
			<section className="py-10">
				<div className="container space-y-3">
					<div className="space-y-3">
						<Link href="/admin/dashboard/products/new" className="inline-block py-3 px-5 shadow-lg bg-gray-900 rounded">
							<span className="text-sm capitalize font-bold text-white">create new product</span>
						</Link>
						<form onSubmit={(e) => e.preventDefault()} className="grid md:grid-cols-4">
							<div className="col-span-2">
								<input
									name="query"
									value={searchQuery}
									placeholder="Type here to search..."
									className="block w-full text-sm rounded-md border p-3"
									onChange={({target: {value}}) => setSearchQuery(value)}
								/>
							</div>
						</form>
					</div>
					{useMemo(() => {
						if(products === undefined) return (
							<div className="rounded-md py-10 px-5 bg-gray-50 border">
								<div className="text-center flex flex-col justify-center items-center space-y-2">
									<div className="spin">
										<span className="bi-arrow-clockwise text-gray-600 text-3xl"></span>
									</div>
									<div className="text-sm md:text-base text-gray-600 font-medium sentence">
										Loading products...
									</div>
								</div>
							</div>
						);
						else if(Array.isArray(products)) {
							if(products.length) {
								return (
									<div className="grid gap-3 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2">{
										products.map((props: any, index: number) => (
											<ProductItem key={index} {...props} />
										))
									}</div>
								);
							}

							return (
								<>{products.length} product length less than one</>
							);
						}

						return (
							<div className="rounded-md py-10 px-5 bg-gray-50 border">
								<div className="text-center flex flex-col justify-center items-center space-y-2">
									<div className="text-sm md:text-base text-gray-600 font-medium sentence">
										Failed to load products.
									</div>
									<button type="submit">
										<span className="inline-block rounded-md text-white px-5 py-2 bg-blue-600 font-bold sentence">reload</span>
									</button>
								</div>
							</div>
						);
					}, [products])}
				</div>
			</section>
		</Fragment>
	);
}

type ProductItemType = Record<string, string | any>

function ProductItem({ id, name, images, price, categories }: ProductItemType) {
	console.log({ id, name, images, price, categories });

	return (
		<div className="border overflow-hidden rounded-md">
			<div className="divide-y">
				<div className="relative bg-gray-100 h-[150px]">
					<Image
						fill={true}
						alt="Product image"
						src={images[0]?.url}
						className="d-block w-fill"
						style={{ objectFit: "cover" }}
					/>
				</div>
				<div className="p-3 space-y-1">
					<div className="font-bold capitalize">
						<Link
							title={name as string}
							className="hover:underline"
							href={`/admin/dashboard/products/${id}`}
						>
							{name}
						</Link>
					</div>
					<div>
						<span title={categories?.name} className="px-2 py-1 rounded-sm bg-yellow-200 font-bold text-xs capitalize">
							{categories?.name}
						</span>
					</div>
					<div title={price as string} className="font-bold capitalize text-green-500">
						NGN {new Intl.NumberFormat("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}).format(Number(price))}
					</div>
					<div className="pt-3">
						<Link href={`/admin/dashboard/products/${id}`} className="block sentence font-bold text-white w-full p-2 text-center bg-gray-700 rounded-md">
							see more
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}