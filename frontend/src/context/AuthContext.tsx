import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'

interface User {
  name: string,
  uuid: string,
}

export interface IAuthContext {
  user: ReactNode;
  token: string,
  setToken: Dispatch<SetStateAction<string | null>>,
  login: (token: string) => void,
  logout: () => void,
  isLoggedIn: () => boolean,
  getUserInformation: () => User | null
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(Cookies.get("jwt_auth") || null)

  const login = (incomingToken: string) => {
    const decoded = jwtDecode(incomingToken)
    const fiveteenMin = new Date(new Date().getTime() + 15 * 60 * 1000);
    Cookies.set("jwt_auth", incomingToken, { expires: fiveteenMin })
    setToken(incomingToken)
    console.log("Decoded user info:", decoded)
    const userInfo = {
      name: decoded.name,
      uuid: decoded.uuid
    }
    console.log("Set the userInfo")
    setUser(userInfo)
    console.log("Login Finished")
  }

  const logout = () => {
    Cookies.remove("jwt_auth")
    setToken(null)
  }

  const isLoggedIn = () => {
    const token = Cookies.get("jwt_auth")
    if (token) {
      const decodedToken = jwtDecode(String(token))
      if (decodedToken) {
        return true
      }
    }
    return false
  }

  const getUserInformation = () => {
    const jwt = Cookies.get("jwt_auth")
    if (jwt) {
      const decoded = jwtDecode(jwt)
      const userInfo = {
        name: decoded.name,
        uuid: decoded.uuid
      }
      return userInfo
    }
    return null
  }

  const authContextValue = {
    token,
    user,
    setToken,
    login,
    logout,
    isLoggedIn,
    getUserInformation
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext;
};