import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";
import Link from "next/link";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm">
        <Link className="hover:text-black" href={"/products"}>
          Products{" "}
        </Link>
        <span>\ </span>
        <span className="text-black">Edit Product</span>
      </div>
      <h1>Edit Product</h1>
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}
