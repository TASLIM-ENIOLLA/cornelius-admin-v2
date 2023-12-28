"use client";

import { Fragment, useState, useEffect } from "react";

import Title from "@/components/admin/title";

import { useSearchParams } from 'next/navigation'

export default function Page({ params: { which } }: { params: { which: string } }) {
	type FormDataType = undefined | Record<string, string>;

	const searchParams = useSearchParams()
	const id = searchParams.get("id");

	const [editable, setEditable] = useState <boolean> (false);
	const [formData, setFormData] = useState <FormDataType> ();

	function updateFormData(prop: string, value: any): void {
		setEditable(true);

		setFormData((formData) => ({
			...formData,
			[prop]: value
		}));
	}

	async function onSubmit(event: any): Promise<void> {
		event.preventDefault();

		setEditable(false);

		const form = new FormData();

		for(let prop in formData) {
			form.append(prop, formData[prop]);
		}

		const request = await fetch("/api/admin/categories/" + which, {
			method: "POST",
			cache: "no-cache",
			body: form
		});
		const { data, error } = await request.json();

		if(data) {
			alert(data.message);

			if(which == "new") {
				setFormData(undefined);
			}
		}
		else {
			alert(error.message);
			setEditable(true);
		}
	}

	useEffect(() => {
		(async () => {
			const request = await fetch("/api/admin/categories?id=" + id);
			const { data, error }: { data: { rows: any[] }, error: any } = await request.json();
			
			if(data) {
				const [ categoryData ] = data.rows;
				
				setFormData(categoryData);
			}
		})();
	}, [])
	
	if(which === "edit" && !formData) {
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
				title={`${which} category`}
				subtitle={(
					(which === "new")
					? "add a new category"
					: "modify an existing category"
				)}
			/>
			<section className="py-5">
				<div className="container">
 					<div className="max-w-[500px]">
					 <form onSubmit={onSubmit} className="space-y-7">
      				<div className="space-y-1">
      					<div className="text-sm md:text-base text-gray-600 font-semibold sentence">
      						category name
      					</div>
      					<input
      						type="text"
      						name="name"
									value={formData?.name || ""}
      						className="p-2 border rounded border-gray-300 block w-full"
      						onChange={({target: {value}}) => updateFormData("name", value)}
      					/>
      				</div>
      				<div className="space-y-1">
      					<div className="text-sm md:text-base text-gray-600 font-semibold sentence">
      						description
      					</div>
      					<textarea
      						rows={5}
      						name="description"
									value={formData?.description || ""}
      						className="p-2 border rounded border-gray-300 block w-full resize-none"
      						onChange={({target: {value}}) => updateFormData("description", value)}
      					></textarea>
      				</div>
      				<div className="">
      					<input
      						type="submit"
									disabled={!editable}
      						defaultValue={`save changes`}
      						className="py-3 px-10 cursor-pointer border capitalize rounded text-white font-bold bg-gray-800"
      					/>
      				</div>
      			</form>
					</div>
				</div>
			</section>
		</Fragment>
	);
}



// "use client";

// import { Fragment, useState, useRef, useEffect, useContext } from "react";

// import { useSearchParams } from 'next/navigation'

// import { AlertContext } from "@/ui/alert";

// import Title from "@/components/admin/title";

// export default function Page({ params: { which } }: { params: { which: string } }) {
// 	const form = useRef <any> ();
// 	const { view, hide, show }: any = useContext(AlertContext);
// 	const [ editable, setEditable ] = useState(which === "edit");
// 	const [ formValue, setFormValue ] = useState <{
// 		id?: string,
// 		name: string,
// 		description: string
// 	}> ({
// 		name: "",
// 		description: ""
// 	});
// 	const searchParams = useSearchParams()
 
//   const id: string | null = searchParams.get('id')

// 	function formAction(event: any) {
// 		event.preventDefault();
// 		setEditable(true);

// 		const formData = new FormData(form.current);

// 		if(which === "edit") {
// 			formData.append("id", id || "");
// 		}

// 		const fetchURL: string = "/api/admin/categories/" + which;
// 		const fetchOptions: RequestInit = {
// 			method: "POST",
// 			cache: "no-cache",
// 			body: formData
// 		}

// 		fetch(fetchURL, fetchOptions)
// 		.then((response) => response.json())
// 		.then((props) => {
// 			setEditable(false);
// 			show(props);

// 			if(props?.data) {
// 				form?.current.reset();
				
// 				setTimeout(hide, 3_000);

// 				setFormValue({
// 					id: formData.get("id"),
// 					name: formData.get("name"),
// 					description: formData.get("description"),
// 				});
// 			}
// 		})
// 	}

// 	useEffect(() => {
// 		if(which === "edit") {
// 			const fetchURL: string = "/api/admin/categories?id=" + id;
// 			const fetchOptions: RequestInit = {
// 				method: "GET",
// 				cache: "no-cache",
// 			}

// 			fetch(fetchURL, fetchOptions)
// 			.then((response) => response.json())
// 			.then(({ data, error }) => {
// 				if(data) {
// 					const [ categoryData ] = data.rows;

// 					setEditable(false);
// 					setFormValue(categoryData);
// 				}
// 			})
// 		}
// 	}, [])

// 	return (
// 		<Fragment>
// 			<Title
// 				title={`${which} category`}
// 				subtitle={(
// 					(which === "new")
// 					? "add a new category"
// 					: "modify an existing category"
// 				)}
// 			/>
// 			<section className="py-5">
// 				<div className="container">
// 					<div className="max-w-[500px]">
// 						{ view }
//       			<form ref={form} onSubmit={formAction} className="space-y-7">
//       				<input value={formValue.id} hidden />
//       				<div className="space-y-1">
//       					<div className="text-sm md:text-base text-gray-600 font-semibold sentence">
//       						category name
//       					</div>
//       					<input
//       						type="text"
//       						name="name"
//       						defaultValue={formValue.name}
//       						className="p-2 border rounded border-gray-300 block w-full"
//       						// onChange={({target: {value}}) => setFormData((n) => ({...n, name: value}))}
//       					/>
//       				</div>
//       				<div className="space-y-1">
//       					<div className="text-sm md:text-base text-gray-600 font-semibold sentence">
//       						description
//       					</div>
//       					<textarea
//       						rows={5}
//       						name="description"
//       						defaultValue={formValue.description}
//       						className="p-2 border rounded border-gray-300 block w-full resize-none"
//       						// onChange={({target: {value}}) => setFormData((n) => ({...n, description: value}))}
//       					></textarea>
//       				</div>
//       				<div className="">
//       					<input
//       						type="submit"
//       						disabled={editable}
//       						defaultValue={`save changes`}
//       						className="py-3 px-10 cursor-pointer border capitalize rounded text-white font-bold bg-gray-800"
//       					/>
//       				</div>
//       			</form>
//       		</div>
// 				</div>
// 			</section>
// 		</Fragment>
// 	);
// }