import axios, { AxiosResponse } from "axios";
import { type } from "os";
import React, { ReactNode, createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  email: string;
  password: string;
}

interface AuthContextUserProviderProps {
  children: ReactNode;
}

interface IAuthContextType {
  user: any;
  userLogin: User;
  setUserLogin: React.Dispatch<React.SetStateAction<User>>;
  HandleLoginUser: (e: React.FormEvent) => Promise<void>;
}

export const AuthContextUser = createContext<IAuthContextType>({
    user: null,
    userLogin: {
      email: "",
      password: "",
    },
    setUserLogin: () => {},
    HandleLoginUser: async () => {},
});

export const AuthContextUserProvider: React.FC<AuthContextUserProviderProps> = ({ children } : AuthContextUserProviderProps) => {
  const [user, setUser] = useState<any>(null);
  // login state
  const [userLogin, setUserLogin] = useState<User>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("userAuth");
    setUser(JSON.parse(user || "null"));
  }, []);

  // handle login user
  const HandleLoginUser = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // call api login
      console.log(userLogin);
      
      try {
        const response: AxiosResponse<User> = await axios.post(
          "http://localhost:5000/api/users/login",
          JSON.stringify(userLogin),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
            timeout: 10000,
          }
        );

        // Handle successful response then store user in localStorage, set state response user
        localStorage.setItem("userAuth", JSON.stringify(response.data));
        setUser(response?.data);

      } catch (error: any) {
        // Handle error
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error("Response Error:", error.response.status, error.response.data);
          } else if (error.request) {
            console.error("Request Error:", error.request);
          }
        }else {
            console.error("Error:", error.message);
        }
      }
    },
    [userLogin]
  );

  return (
    <AuthContextUser.Provider
      value={{
        user,
        userLogin,
        setUserLogin,
        HandleLoginUser,
      }}
    >
      {children}
    </AuthContextUser.Provider>
  );
};