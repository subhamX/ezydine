import create from "zustand";
import { combine } from "zustand/middleware";
import axios from "axios";
import { logOutEndpoint } from "../apis";


export const useUserStore = create(
  combine(
    {
      user: null,
      isAuthStatusLoading: true,
    },
    (set) => ({
      logoutUser: async () => {
        try {
          let res = await axios.post(logOutEndpoint, {}, {
            withCredentials: true
          })
          if (res.data.error === false) {
            // user is successfully logged out
            set((state) => ({ user: null }));
          } else {
            throw Error(res.data.message);
          }
        } catch (err) {
          console.log("Something went wrong!", err)
        }
      },
      setUser: async (payload) => {
        set((state) => {
          return {
            user: payload,
            isAuthStatusLoading: false,
          };
        });
      },
    })
  )
);
