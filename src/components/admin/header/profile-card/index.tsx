"use client";

import { Fragment, useMemo, useEffect, useState } from "react"

export default function ProfileCircle() {
	type UserDataType = undefined | {
		id: string,
		role: string,
		lastName: string,
		username: string,
		firstName: string,
	}

	const [ userData, setUserData ] = useState <UserDataType> ();

	useEffect(() => {
		fetch("/api/admin/get-profile", { cache: "no-cache" })
		.then((response) => response.json())
		.then(({ data, error }) => {
			if(data) {
				setUserData(data.user);
			}
		})
	}, [])

	return (
		<details className="relative space-y-5">
			<summary className="cursor-pointer" style={{ listStyleType: "none" }}>
				<div className="border-4 rounded-full border-gray-white	 bg-gray-500">
					<div className="w-[40px] h-[40px] flex items-center justify-center">
						<div className="uppercase user-select-none text-center text-xl text-white font-bold">
							{userData?.firstName[0]}{userData?.lastName[0]}
						</div>
					</div>
				</div>
			</summary>
			<div className="absolute w-[100vw] max-w-[200px] right-0 top-full">
				<div className="border-2 shadow-lg bg-gray-700 rounded-md p-3 text-white font-semibold">
					{useMemo(() => {
						if(userData) {
							return (
								<div className="divide-y space-y-2">
									<div>
										<div className="text-base capitalize one-line">
											{userData?.firstName} {userData?.lastName}
										</div>
										<div className="text-sm text-gray-300 one-line">{userData?.username}</div>
									</div>
									<div className="pt-2">
										<div className="text-sm text-gray-300 capitalize one-line">{userData?.role}</div>
									</div>
								</div>
							);
						}
						else {
							return (
								<div className="text-sm text-gray-300 capitalize text-center py-3">loading...</div>
							);
						}
					}, [userData])}
				</div>
			</div>
		</details>
	);
}