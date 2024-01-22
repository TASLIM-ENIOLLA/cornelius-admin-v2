"use client";

import { Fragment, useMemo, useState, useEffect } from "react";

import Image from "next/image";

import Title from "@/components/admin/title";

export default function Page({ params: { id } }: { params: { id: string}}) {
	type TypesType = undefined | {
		id: string,
		name: string,
	}[];

	type CategoriesType = undefined | {
		id: string,
		name: string,
		timestamp: string,
		description: string,
	}[]

	const [types, setTypes] = useState <TypesType> ([]);
	const [pending, setPending] = useState <boolean> (false);
	const [modified, setModified] = useState <boolean> (false);
	const [categories, setCategories] = useState <CategoriesType> ([]);
	const [formData, setFormData] = useState <undefined | Record<string, any>> ();

	async function getTypes() {
		const request = await fetch("/api/admin/types", { method: "GET", cache: "no-cache" });
		const response = await request.json();

		return response;
	}

	async function getCategories() {
		const request = await fetch("/api/admin/categories", { method: "GET", cache: "no-cache" });
		const response = await request.json();

		return response;
	}

	async function getProductData(id: string) {
		const request = await fetch("/api/admin/products/" + id, { method: "GET", cache: "no-cache" });
		const response = await request.json();

		return response;
	}

	function updateFormData(prop: string, value: any): void {
		if(modified) {
			setModified(true);
		}

		setFormData(n => ({
			...n,
			[prop]: value
		}))
	}

	useEffect(() => {
		(async function() {
			const { data: types } = await getTypes();
			const { data: categories } = await getCategories();
			const { data: productData } = await getProductData(id);

			setTypes(types.rows);
			setCategories(categories.rows);

			updateFormData("imagesUploaded", false);
			setFormData({
				...productData,
				typeID: productData.types?.id,
				categoryID: productData.categories?.id
			});
		})();
	}, []);

	function onSubmit(event: any): void {
		event.preventDefault();
		setPending(true);

		const form = new FormData();

		for(let prop in formData) {
			const value = formData[prop];

			if(Array.isArray(value)) {
				value.forEach((each) => {
					form.append(prop + "[]", each);
				})
			}
			else {
				form.append(prop, value);
			}
		}

		fetch("/api/admin/products/update/" + id, {
			body: form,
			method: "POST",
			cache: "no-cache"
		})
		.then((response) => response.json())
		.then(({ data, error }) => {
			setPending(false)

			if(data) {
				window.location.reload();
			}
			else {
				alert(error.message)
			}
		})
	}

	if(!formData) {
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
				title="edit product"
				subtitle="edit a product"
			/>
			<section className="py-10">
				<div className="container">
					<div className="max-w-[700px]">
						<form onSubmit={onSubmit} className="grid gap-7 grid-cols-1 md:grid-cols-2">
							<div className="col-span-2 space-y-1">
      					<div className="text-sm md:text-base text-gray-600 font-medium sentence">product name *</div>
      					<input
      						type="text"
      						value={formData.name}
      						className="p-2 border rounded border-gray-300 block w-full"
      						onChange={({target: {value}}) => updateFormData("name", value)}
      					/>
      				</div>
							<div className="col-span-1 space-y-1">
      					<div className="text-sm md:text-base text-gray-600 font-medium sentence">product category *</div>
      					<select
      						value={formData.categoryID}
      						className="p-2 border rounded border-gray-300 block w-full"
      						onChange={({target: {value}}) => updateFormData("categoryID", value)}
      					>
      						<option value="">---</option>
      						{categories && categories.map(({ id, name }) => (
      							<option key={id} value={id}>{name}</option>
      						))}
      					</select>
      				</div>
							<div className="col-span-1 space-y-1">
      					<div className="text-sm md:text-base text-gray-600 font-medium sentence">product type *</div>
      					<select
      						value={formData.typeID}
      						className="p-2 border rounded border-gray-300 block w-full"
									onChange={({target: {value}}) => updateFormData("typeID", value)}
      					>
      						<option value="">---</option>
      						{types && types.map(({ id, name }) => (
      							<option key={id} value={id}>{name}</option>
      						))}
      					</select>
      				</div>
							<div className="col-span-2 space-y-1">
      					<div className="text-sm md:text-base text-gray-600 font-medium sentence">
      						product price (NGN) *
      					</div>
      					<PriceInput
      						value={formData.price}
      						onChange={({ value }) => updateFormData("price", value)}
      					/>
      				</div>
							<div className="col-span-2 space-y-1">
      					<div className="text-sm md:text-base text-gray-600 font-medium sentence">
      						product quantity *
      					</div>
      					<input
      						type="number"
      						value={formData.quantity}
      						className="p-2 border rounded border-gray-300 block w-full"
      						onChange={({target: {value}}) => updateFormData("quantity", value)}
      					/>
      				</div>
							<div className="col-span-2 space-y-1">
      					<div className="text-sm md:text-base text-gray-600 font-medium sentence">
      						description *
      					</div>
      					<textarea
      						rows={3}
      						value={formData.description}
      						className="p-2 resize-none border rounded border-gray-300 block w-full"
      						onChange={({target: {value}}) => updateFormData("description", value)}
      					></textarea>
      				</div>
							<div className="col-span-2 space-y-1">
      					<div className="text-sm md:text-base text-gray-600 font-medium sentence">
      						product images *
      					</div>
      					<ImagePicker
									files={formData.images}
									onModified={({modified}) => {
										updateFormData("imagesUploaded", true);
									}}
      						onFilesPicked={({ files }) => {
      							updateFormData("images", files)
      						}}
      					/>
      				</div>
							<div className="col-span-2 space-y-1">
      					<input
      						type="submit"
      						disabled={pending}
      						defaultValue="update product"
									disabled={pending || modified}
      						className="py-3 px-10 font-bold cursor-pointer bg-gray-800 capitalize rounded text-white"
      					/>
      				</div>
						</form>
					</div>
				</div>
			</section>
		</Fragment>
	);
}

type ImagePickerType = {
	files: any[],
	onFilesPicked: ({ files }: { files: File[]}) => void,
	onModified: ({ modified }: { modified: boolean }) => void,
}

function ImagePicker({ files, onModified, onFilesPicked }: ImagePickerType) {
	const [modified, setModified] = useState <boolean> (false);
	const [images, setImages] = useState <File[]> (files || []);

	useEffect(() => {
		if(typeof onFilesPicked === "function") {
			onFilesPicked({ files: images });
		}
	}, [images])

	useEffect(() => {
		if(typeof onModified === "function") {
			onModified({ modified });
		}
	}, [modified])

	function ImagePreviewer({ file, onRemove }: { file: File | any, onRemove: () => void }) {
		const imgSrc = file?.url ?? URL.createObjectURL(file);

		return (
			<div className="relative space-y-1 max-w-[80px]">
				<div className="relative w-[80px] h-[80px]">
					<Image
						fill={true}
						src={imgSrc}
						className="border"
						alt="Selected images"
						style={{objectFit: "cover"}}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
				<span
					title={file.name}
					className="text-sm one-line"
					style={{wordBreak: "break-word"}}
				>
					{file.name}
				</span>
				<button onClick={onRemove} className="p-0 absolute top-[-15px] right-[-5px]">
					<span className="bi-x-circle-fill text-lg text-red-600"></span>
				</button>
			</div>
		);
	}

	return (
		<div className="border p-3 rounded">
			{useMemo(() => {
				if(images.length) {
					return (
						<div className="space-y-3">
							<div className="flex flex-wrap gap-3" style={{
								gridTemplateColumns: "repeat(1fr, minmax(120px, 1fr))"
							}}>
								{images.map((image: File, index: number) => (
									<ImagePreviewer
										key={index}
										file={image}
										onRemove={() => setImages(images.filter((_: File, i: number) => {
											return i !== index;
										}))}	
									/>
								))}
							</div>
							<div>
								<button
									type="button"
									onClick={() => setImages([])}
									className="text-red-600 capitalize underline"
								>
									remove all
								</button>
							</div>
						</div>
					);
				}
			
				return (
					<div className="bg-gray-100 rounded border p-5">
						<div className="text-center">
							<label htmlFor="imagePicker" className="flex flex-col py-5">
								<span className="bi-image-fill text-2xl"></span>
								<span className="hover:underline inline-block sentence">
									click here to upload images
								</span>
								<input
									hidden
									multiple
									type="file"
									id="imagePicker"
									accept=".jpg, .jpeg, .png"
									onChange={({target: {files}}) => {
										if(files) {
											const filesArray = Array.from(files);

											setModified(true);
											setImages(filesArray);
										}
									}}
								/>
							</label>
						</div>
					</div>
				);
			}, [images])}
		</div>
	);
}

type PriceInputType = {
	value: string,
	onChange: ({ value }: { value: number }) => void,
}

function PriceInput({ value, onChange }: PriceInputType) {
	const [type, setType] = useState <string> ("text");
	const [price, setPrice] = useState <string | number> (value || "");

	useEffect(() => {
		if(type === "number") setPrice((price) => {
			console.log({price})
			return String(price).replace(/,/g, "")
		});
		else setPrice((price) => {
			return new Intl.NumberFormat("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}).format(Number(price));
		});
	}, [type])

	useEffect(() => {
		if(typeof onChange === "function") {
			onChange({
				value: Number(String(price).replace(/,/g, ""))
			});
		}
	}, [price]);

	useEffect(() => {
		if(!Number(price) && Number(value)) {
			setPrice(new Intl.NumberFormat("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}).format(Number(value)));
		}
	}, [value]);

	return (
		<input
			type={type}
			value={price}
			onBlur={() => setType("text")}
			onFocus={() => setType("number")}
			onChange={({target: {value}}: any) => setPrice(value)}
			className="p-2 border rounded border-gray-300 block w-full"
		/>
	);
}