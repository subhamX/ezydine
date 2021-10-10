import { LockClosedIcon } from "@heroicons/react/solid";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { addMenuItemEndpoint } from "../apis";
import { useRouter } from "next/router";
import withAuth from "../HOC/withAuth";

const form_keys = [
  {
    id: "title",
    type: "text",
  },
  // Random page chosen at server end
  // {
  //   id: "image",
  //   type: "text",
  // },
  {
    id: "description",
    type: "text",
  },
  {
    id: "total_fat",
    type: "number",
  },
  {
    id: "saturated_fat",
    type: "number",
  },
  {
    id: "sodium",
    type: "number",
  },
  {
    id: "total_carbohydrate",
    type: "number",
  },
  {
    id: "total_dietary_fiber",
    type: "number",
  },
  {
    id: "total_protein",
    type: "number",
  },
  {
    id: "total_carbon",
    type: "number",
  },
  {
    id: "total_water_used",
    type: "number",
  },
];

function AddMenuItem() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      let res = await axios.post(addMenuItemEndpoint, data, {
        withCredentials: true,
      });
      console.log(res.data);
      console.log(res.data.message);
      if (!res.data.error) {
        router.push("/");
      } else {
        throw Error(res.data.message);
      }
    } catch (err) {
      setIsLoading(false);
      setErrors(err.message);
    }
  };

  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [data, setData] = useState({
    type: "",
    title: "",
    image: "",
    description: "",
    total_fat: 100.0,
    saturated_fat: 100.0,
    sodium: 100.0,
    total_carbohydrate: 100.0,
    total_dietary_fiber: 100.0,
    total_protein: 100.0,
    total_carbon: 100.0,
    total_water_used: 100.0,
  });
  return (
    <div className="min-h-screen grid grid-cols-2  bg-gray-50  ">
      <img src="/images/food1.jpg" className="max-h-screen" />
      <div className="max-w-md w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div>
          <Link href={`/`}>
            <img
              className="mx-auto h-12 w-auto"
              src="/images/ezydine-logo.png"
              alt="Workflow"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add Menu Item
          </h2>
        </div>

        {errors ? (
          <div className="bg-red-200 text-red-700 font-bold rounded p-2">
            {errors}
          </div>
        ) : null}
        <form method="POST" className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {form_keys.map((e, indx) => {
              return (
                <div key={indx}>
                  <label htmlFor={e} className="sr-only">
                    {e.id}
                  </label>
                  <input
                    id={e.id}
                    name={e.id}
                    type={e.type}
                    onChange={(event) => {
                      let newData = data;
                      newData[e.id] = event.target.value;
                      setData(newData);
                    }}
                    required
                    placeholder={e.id
                      .split("_")
                      .map((e) => e[0].toUpperCase() + e.slice(1))
                      .join(" ")}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
              );
            })}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group disabled:opacity-50 disabled:bg-indigo-50 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Add food item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default withAuth(AddMenuItem)