import axios, { AxiosResponse } from "axios";
import React, { ReactNode, createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IUser {
  email: string;
  password: string;
  name: string;
}

interface AuthContextUserProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: IUser | null;
  userLogin: {
    email: string;
    password: string;
  };
  setUserLogin: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
    }>
  >;
  HandleLoginUser: (e: React.FormEvent) => Promise<void>;
}

export const AuthContextUser = createContext<AuthContextType | undefined>(undefined);

export const AuthContextUserProvider: React.FC<AuthContextUserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  // login state
  const [userLogin, setUserLogin] = useState({
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
      try {
        const response: AxiosResponse<IUser> = await axios.post(
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
        setUser(response.data);
      } catch (error) {
        // Handle error
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error("Response Error:", error.response.status, error.response.data);
          } else if (error.request) {
            console.error("Request Error:", error.request);
          }
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