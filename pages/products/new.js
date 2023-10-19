import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import Link from "next/link";

export default function NewProduct() {
  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm">
        <Link className="hover:text-black" href={"/products"}>
          Products{" "}
        </Link>
        <span>\ </span>
        <span className="text-black">New Product</span>
      </div>
      <h1>New Product</h1>
      <ProductForm />
    </Layout>
  );
}
