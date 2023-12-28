"use client";

import { Fragment, useMemo, useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import Title from "@/components/admin/title";

export default function Page() {
	const router = useRouter()
	const [pending, setPending] = useState <boolean> (false);
	const [types, setTypes] = useState <undefined | {
		id: string,
		name: string,
	}[]> ([]);

	const [categories, setCategories] = useState <undefined | {
		id: string,
		name: string,
		timestamp: string,
		description: string,
	}[]> ([]);

	/* 
		{
		name: string,
		categoryID: string,
		description: string,
		typeID: string,
		price: string,
		paymentLink: string,
		images: File[]
	}
	*/
	const [formData, setFormData] = useState <Record<string, any>> ({
		name: "",
		categoryID: "",
		description: "",
		typeID: "",
		price: "",
		paymentLink: "",
		images: []
	});

	function updateFormData(prop: string, value: any): void {
		setFormData(n => ({
			...n,
			[prop]: value
		}))
	}

	function onSubmit(event: any) {
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

		fetch("/api/admin/products/new", {
			body: form,
			method: "POST",
			cache: "no-cache"
		})
		.then((response) => response.json())
		.then(({ data, error }: { data: any, error: any }) => {
			setPending(false)

			if(data) {
				alert(data.message);
				window && window.location.reload();
			}
			else {
				alert(error.message)
			}
		})
	}

	useEffect(() => {
		fetch("/api/admin/categories", { cache: "no-cache" })
		.then((response) => response.json())
		.then(({ data }: { data?: any }) => {
			if(data) {
				setCategories(data.rows);
			}
		});

		fetch("/api/admin/types", { cache: "no-cache" })
		.then((response) => response.json())
		.then(({ data }: { data?: any }) => {
			if(data) {
				setTypes(data.rows);
			}
		});
	}, []);

	return (
		<Fragment>
			<Title
				title="products"
				subtitle="add a new product"
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
      						payment link *
      					</div>
      					<input
      						type="text"
      						value={formData.paymentLink}
      						className="p-2 border rounded border-gray-300 block w-full"
      						onChange={({target: {value}}) => updateFormData("paymentLink", value)}
      					/>
      				</div>
							<div className="col-span-2 space-y-1">
      					<div className="text-sm md:text-base text-gray-600 font-medium sentence">
      						product images *
      					</div>
      					<ImagePicker
      						onFilesPicked={({ files }) => {
      							updateFormData("images", files)
      						}}
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
      					<input
      						type="submit"
									disabled={pending}
      						defaultValue="add product"
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
	onFilesPicked: ({ files }: { files: File[]}) => void
}

function ImagePicker(props: ImagePickerType) {
	const { onFilesPicked } = props;

	const [files, setFiles] = useState <File[]> ([]);

	function removeFile(index: number) {
		setFiles(n => n.filter((f, i) => i !== index))
	}

	function onChange({target: {files}}: any) {
		if(files) {
			setFiles(Array.from(files));
		}
	}

	useEffect(() => {
		if(typeof onFilesPicked === "function") {
			onFilesPicked({ files });
		}
	}, [files])

	return (
		<div className="border border-gray-300 rounded overflow-hidden">{
			useMemo(() => {
				if(files.length) {
					return (
						<div>
							<div className="p-3 space-y-3">{
								files.map(({ name }: { name: string }, index: number) => (
									<div key={index} className="p-3 bg-gray-100 border rounded-md">
										<div className="flex gap-3">
											<div className="flex-1">
												<div className="one-line">
													{name}
												</div>
											</div>
											<div>
												<button
													type="button"
													onClick={() => removeFile(index)}
													className="cursor-pointer text-red-600 capitalize hover:underline"
												>
													remove
												</button>
											</div>
										</div>
									</div>
								))
							}</div>
							<div className="p-3">
								<button
									type="button"
									onClick={() => setFiles([])}
									className="cursor-pointer text-red-600 capitalize hover:underline"
								>
									remove all
								</button>
							</div>
						</div>
					);
				}

				return (
					<div className="px-5 py-10 bg-gray-100">
						<div className="text-center">Click 
							<label htmlFor="imagesPicker" tabIndex={0}>
								&nbsp;
								<span className="cursor-pointer underline">here</span>
								<input
									type="file"
									hidden={true}
									multiple={true}
									id="imagesPicker"
									onChange={onChange}
									accept=".jpg, .png, .jpeg"
								/>
								&nbsp;
							</label>
						to add image files</div>
					</div>
				);
			}, [files])
		}</div>
	);
}

type PriceInputType = {
	value: string,
	onChange: ({ value }: { value: string }) => void
}

function PriceInput(props: PriceInputType) {
	const { value: _value, onChange } = props;

	const [type, setType] = useState <string> ("text");
	const [value, setValue] = useState <string> (new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(Number(_value)) || "");

	useEffect(() => {
		if(type === "text") {
			if(typeof onChange === "function") {
				onChange({ value: value.replace(/,/g, "") });
			}
		}
	}, [type, value])

	function onFocus() {
		setValue(n => n.replace(/,/g, ""));
		setType("number");
	}

	function onBlur() {
		setValue(n => new Intl.NumberFormat("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(Number(n)));
		setType("text");
	}

	return (
		<input
			type={type}
			value={value}
			onBlur={onBlur}
			onFocus={onFocus}
			onChange={({target: {value}}) => setValue(value)}
			className="p-2 border rounded border-gray-300 block w-full"
		/>
	);
}