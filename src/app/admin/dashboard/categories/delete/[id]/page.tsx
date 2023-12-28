import { Fragment } from "react";

import { redirect } from "next/navigation";

import Supabase from "@/utils/supabase";

import Title from "@/components/admin/title";

async function deleteCategory(id: string): Promise<any> {
  "use server";

	return await Supabase.from('categories')
  .delete()
  .eq("id", id);
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const response: any = await deleteCategory(id);

  redirect("../");

  return (
    <Fragment>
      <Title
        title="Delete category"
        subtitle="removing product category..."
      />
    </Fragment>
  );
}