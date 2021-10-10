import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import axios from "axios";
import { authCheckEndpoint } from "../apis";
import { Loading } from "../components/Loading";

export default function App({ Component, pageProps }) {
  const setUser = useUserStore((e) => e.setUser);
  useEffect(() => {
    axios
      .get(authCheckEndpoint, {
        withCredentials: true,
      })
      .then((e) => {
        console.log(e.data);
        if (!e.data.error) {
          setUser(e.data);
        } else {
          setUser(null);
        }
        setisLoading(false);
      })
      .catch((err) => {
        setErrors(err.message);
        setisLoading(false);
      });
  }, []);

  const [errors, setErrors] = useState("");

  const [isLoading, setisLoading] = useState(true);
  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (errors) {
    return (
      <div className="bg-red-200 text-red-700 font-bold rounded p-2">
        {errors}
      </div>
    );
  }
  return <Component {...pageProps} />;
}
