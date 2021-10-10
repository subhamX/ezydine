import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const [loading, setLoading]=useState(true)


    if (!results.data.error) {
      return <WrappedComponent {...props} />;
    }

    Router.replace("/login/");
    return null;
  };
};

export default withAuth;
