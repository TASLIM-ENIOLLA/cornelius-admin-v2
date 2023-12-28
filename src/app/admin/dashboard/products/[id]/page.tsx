"use client";

import { Fragment, useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import Title from "@/components/admin/title";

export default function Page({ params: { id } }: { params: { id: string}}) {
	const [productData, setProductData] = useState <any> ();
	const [bigImgSrc, setBigImgSrc] = useState <string> ("");

	function getProductData(): void {
		fetch("/api/admin/products/" + id, {
			method: "GET",
			cache: "no-cache"
		})
		.then((response) => response.json())
		.then(({ data }) => {
			if(data) {
				setProductData(data);
			}
		});
	}
	
	useEffect(() => getProductData(), []);

	useEffect(() => {
		if(productData) {
			setBigImgSrc(productData.images[0]);
		}
	}, [productData])

	if(!productData) {
		return (
			<section className="py-10">
				<div className="container">
					<div className="rounded-md py-10 px-5 bg-gray-50 border">
						<div className="text-center flex flex-col justify-center items-center space-y-2">
							<div className="spin">
								<span className="bi-arrow-clockwise text-gray-600 text-3xl"></span>
							</div>
							<div className="text-sm md:text-base text-gray-600 font-medium sentence">
								Loading product data...
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<Fragment>
			<Title
				title={`product '${productData.name}'`}
				subtitle={`view and modify '${productData.name}' product`}
			/>
			<section className="py-10">
				<div className="container">
					<div className="space-y-5">
						<div className="space-y-1">
							<div className="font-bold capitalize">
								<Link
									title={productData.name}
									className="hover:underline"
									href={`/admin/dashboard/products/${id}`}
								>
									{productData.name}
								</Link>
							</div>
							<div>
								<span title={productData.categories?.name} className="px-2 py-1 rounded-sm bg-yellow-200 font-bold text-xs capitalize">
									{productData.categories?.name}
								</span>
							</div>
							<div className="font-bold capitalize text-green-500">
								<span title={productData.price}>
									NGN {new Intl.NumberFormat("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}).format(Number(productData.price))}
								</span>
							</div>
						</div>
						<div className="max-w-[600px]">
							<div className="space-y-5">
								<div className="relative">
									<Image
										width={400}
										height={400}
										src={bigImgSrc}
										className="border rounded-md bg-gray-100"
										alt={`Product image: ${productData.name}`}
									/>
								</div>
								<div className="flex gap-5 flex-wrap">{
									productData.images.map((image: any, index: number) => (
										<Image
											width="80"
											key={index}
											height="80"
											src={image.url}
											alt="Product image"
											onClick={() => setBigImgSrc(image.url)}
											className="border rounded-md bg-gray-100 cursor-pointer zoom-[100%] hover:zoom-[120%]"
										/>
									))
								}</div>
							</div>
							<div className="pt-10">
								<div className="">
									<div className="space-y-3">
										<div className="p-3 bg-gray-100 border rounded-lg">
											<Link href={`./edit/${productData.id}`} className="text-yellow-500 hover:underline capitalize font-medium">
												edit product
											</Link>
										</div>
										<div className="p-3 bg-gray-100 border rounded-lg">
											<Link href={`./delete/${productData.id}`} className="text-red-500 hover:underline capitalize font-medium">
												remove product
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</Fragment>
	);
}