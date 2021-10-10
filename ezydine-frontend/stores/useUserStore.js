import create from "zustand";
import { combine } from "zustand/middleware";

export const useUserStore = create(
  combine(
    {
      user: null,
      isAuthStatusLoading: true,
    },
    (set) => ({
      logoutUser: async () => {
        try {
          let res = await logoutUser();
          if (res.data.error === false) {
            // user is successfully logged out
            set((state) => ({ user: null }));
            message.success("Logout Successful", 2);
          } else {
            throw Error(res.data.message);
          }
        } catch (err) {
          message.error("Something went wrong!", 2);
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
