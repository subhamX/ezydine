import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const currentUser = useUserStore(e => e.user);
    const isLoading = useUserStore(e => e.isAuthStatusLoading);
    const Router = useRouter();

    if (isLoading) {
      return < div className="text-center mx-2 bg-purple-200 text-purple-700 font-bold rounded p-2" >
        Loading
      </div >
    }
    if (currentUser === null) {
      Router.replace("/login/");
    }else{
      return <WrappedComponent {...props} />;
    }
    return null;
  };
};

export default withAuth;
