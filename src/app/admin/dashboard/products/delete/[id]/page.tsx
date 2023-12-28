import { Fragment } from "react";

import { redirect } from "next/navigation";

import Supabase from "@/utils/supabase";

import Title from "@/components/admin/title";

async function deleteProduct(id: string): Promise<any> {
  "use server";

	return await Supabase.from('products')
  .delete()
  .eq("id", id);
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const response: any = await deleteProduct(id);

  redirect("../");

  return (
    <Fragment>
      <Title
        title="Delete product"
        subtitle="removing product data..."
      />
    </Fragment>
  );
}