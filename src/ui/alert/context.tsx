"use client";

import { Fragment, useMemo, useState, createContext } from "react";

import Alert from "./ui";

export const AlertContext = createContext({ 
	view: <></>,
	hide: () => {},
	show: (params: any) => {}
});

export default function AlertProvider({ children }: { children: React.ReactNode }) {
	type Message = undefined | {
		data?: { message: string },
		error?: { message: string }
	};

	const [ message, setMessage ] = useState <Message> ();

	const view = useMemo(() => {
		if(typeof message === "undefined") {
			return <Fragment></Fragment>
		}

		return (
			<Alert params={message} />
		);
	}, [message]);

	function hide() {
		setMessage(undefined);
	}

	function show(params: any) {
		setMessage(params);
	}

	return (
		<AlertContext.Provider value={{ view, hide, show }}>
			{children}
		</AlertContext.Provider>
	);
}