import { LockClosedIcon } from "@heroicons/react/solid";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { registerEndpoint } from "../../apis";
import { useRouter } from "next/router";
import { useUserStore } from "../../stores/useUserStore";

export default function SignUp() {
  const router = useRouter();
  const setUser = useUserStore((e) => e.setUser);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      console.log(name, email, password);
      let res = await axios.post(registerEndpoint, {
        name,
        email,
        password,
      }, {
        withCredentials: true
      });
      console.log(res.data);
      console.log(res.data.message);
      if (!res.data.error) {
        setUser(res.data.user)
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
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href={`/`}>
            <img
              className="mx-auto h-12 w-auto"
              src="/images/ezydine-logo.png"
              alt="Workflow"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Manager Sign-up
          </h2>
        </div>

        {errors ? (
          <div className="bg-red-200 text-red-700 font-bold rounded p-2">
            {errors}
          </div>
        ) : null}

        <form method="POST" className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Sarah Dey"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="sarah@columbia.edu"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/auth/signin/">
                <div className="font-medium text-indigo-600 hover:text-indigo-500">
                  Already a user?
                </div>
              </Link>
            </div>
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
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
