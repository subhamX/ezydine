import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Loading } from "../components/Loading";
import { useUserStore } from "../stores/useUserStore";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const currentUser = useUserStore(e => e.user);
    const isLoading = useUserStore(e => e.isAuthStatusLoading);
    const Router = useRouter();

    if (isLoading) {
      return <Loading />
    }
    if (currentUser === null) {
      Router.replace("/login/");
    } else {
      return <WrappedComponent {...props} />;
    }
    return null;
  };
};

export default withAuth;
