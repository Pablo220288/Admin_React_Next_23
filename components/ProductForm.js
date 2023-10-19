import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProduct, setGoToProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategories, setIsCategories] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsCategories(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
    setIsCategories(false);
  }, []);

  const saveProduct = async (ev) => {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      // Update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // Create
      await axios.post("/api/products", data);
    }
    setGoToProduct(true);
  };

  if (goToProduct) {
    router.push("/products");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;

    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages([...images, ...res.data.links]);
      setIsUploading(false);
    }
  }

  const updateImagesOrder = (images) => {
    setImages(images);
  };

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  const setProductProp = (propName, value) => {
    setProductProperties((prev) => {
      const newProductProp = { ...prev };
      newProductProp[propName] = value;
      return newProductProp;
    });
  };

  return (
    <form onSubmit={saveProduct} className="flex-col">
      <div className="itemForm">
        <label>Product name</label>
        <input
          type="text"
          placeholder="Product Name"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        ></input>
      </div>
      <div className={"itemForm" + " relative"}>
        <label>Category</label>
        <select
          value={category}
          onChange={(ev) => setCategory(ev.target.value)}
        >
          <option value="">Uncategorized</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option value={c._id} key={c._id}>
                {c.name[0].toUpperCase() + c.name.substring(1)}
              </option>
            ))}
        </select>
        {isCategories && (
          <div className="h-24 w-24 flex items-center absolute top-1 right-0">
            <Spinner color={"#1e3a8a"} />
          </div>
        )}
      </div>
      {propertiesToFill.length > 0 && (
        <div className="itemForm">
          <label>Properties</label>
          <div className="mt-2">
            {propertiesToFill.map((p) => (
              <div key={p._id} className="flex gap-2 items-center">
                <div className="whitespace-nowrap">
                  {p.name[0].toUpperCase() + p.name.substring(1)}
                </div>
                <select
                  className="my-1"
                  value={productProperties[p.name]}
                  onChange={(ev) => {
                    setProductProp(p.name, ev.target.value);
                  }}
                >
                  {p.values.map((v) => (
                    <option value={v} key={v}>
                      {v[0].toUpperCase() + v.substring(1)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="itemForm">
        <label>Photos</label>
        <div className="my-2 flex flex-wrap gap-2 items-end">
          <ReactSortable
            list={images}
            className="flex flex-wrap gap-2"
            setList={updateImagesOrder}
          >
            {!!images?.length &&
              images.map((link, index) => {
                /* eslint-disable */
                return (
                  <div
                    key={index}
                    className="h-24 w-24 flex items-center justify-center 
                  border border-gray-200 rounded-md shadow-md"
                  >
                    <img className="rounded-lg" src={link} alt={link} />
                  </div>
                );
                /* eslint-disable */
              })}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 w-24 flex items-center">
              <Spinner color={"#dbeafe"} />
            </div>
          )}
          <label
            className="w-24 h-24 text-center flex flex-col 
          justify-center items-center text-gray-500 rounded-lg 
          bg-gray-200 cursor-pointer shadow-md transition ease-in-out dutarion-150 hover:text-blue-900 hover:scale-[0.99]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <div>Upload</div>
            <input type="file" onChange={uploadImages} className="hidden" />
          </label>

          {!images?.length && (
            <div className="text-gray-600 italic">
              No photos in this product
            </div>
          )}
        </div>
      </div>
      <div className="itemForm">
        <label>Description</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>
      </div>
      <div className="itemForm">
        <label>Price (in USD)</label>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        ></input>
      </div>
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
