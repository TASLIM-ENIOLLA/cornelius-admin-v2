import { useMemo } from "react";

import Link from "next/link";

export default function Component({ serialize, actions, cols, data }: DataTablePropsType) {
	const colsKeys = cols.map(({ key, name }: { key: string, name: string }) => key);

	return (
		<div className="relative overflow-x-auto border sm:rounded-lg">
	    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
	      <thead className="border-b text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {serialize && (
            	<th scope="col" className="text-center whitespace-nowrap px-6 py-4">
	              S/N
	            </th>
            )}
            {cols.map(({ key, name }: { key: string, name: string }) => (
	            <th key={key} scope="col" className="whitespace-nowrap px-6 py-4">
	              {name}
	            </th>
            ))}
            {actions && (
            	<th scope="col" className="whitespace-nowrap px-6 py-4">
	              <span className="sr-only">actions</span>
	            </th>
            )}
          </tr>
	      </thead>
	      <tbody className="divide-y">
	      	{useMemo(() => {
	      		const colsCount = cols.length + (serialize ? 1 : 0) + (actions ? 1 : 0);
 							
	      		if(data && Array.isArray(data)) {
	      			if(data.length) {
	      				return data.map((props: Record <string, unknown>, index: number) => (
			          	<tr key={`${new Date().getTime()}-${index}`} className="bg-white dark:bg-gray-800 dark:border-gray-700">
				            {serialize && (
				            	<td className="text-center font-bold px-6 py-4">
					              {index + 1}
					            </td>
				            )}
				            {colsKeys.map((key: string, index: number) => (
					            <td key={key} className="px-6 py-4 sentence">
					              {props[key] as string}
					            </td>
				            ))}
				            {actions && (
				            	<td className="px-6 py-4">
					              <div className="flex items-center gap-10">
					              	<Link
					              		href={actions.edit.replace(":id", props.id as string)}
					              		className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
					              	>Edit</Link>
					              	<Link
					              		href={actions.delete.replace(":id", props.id as string)}
					              		className="font-medium text-red-600 dark:text-red-500 hover:underline"
					              	>Delete</Link>
					              </div>
					            </td>
				            )}
				          </tr>
			          ));
	      			}

	      			return (
	      				<tr className="bg-white dark:bg-gray-700 dark:border-gray-700">
	      					<td className="px-6 py-10 bg-gray-900" colSpan={colsCount}>
	      						<div className="text-center text-slate-300 font-medium sentence">
	      							oops, empty rows returned!
	      						</div>
	      					</td>
	      				</tr>
	      			);
	      		}

	      		return (
	      			<tr className="bg-white dark:bg-gray-700 dark:border-gray-700">
      					<td className="px-6 py-10 bg-gray-900" colSpan={colsCount}>
      						<div className="text-center text-slate-300 font-medium sentence">
      							loading...
      						</div>
      					</td>
      				</tr>
	      		);
	      	}, [data])}
	      </tbody>
	   	</table>
		</div>
	);
}

type DataTablePropsType = {
	serialize: boolean,
	actions: Record <string, string>,
	cols: { key: string, name: string } [],
	data: undefined | Record <string, unknown> [],
}