import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'

export interface IAuthContext {
  user: ReactNode;
  token: string,
  setToken: Dispatch<SetStateAction<string | null>>,
  login: (token: string) => void ,
  logout: () => void,
  isLoggedIn: () => void
}

const AuthContext = createContext<IAuthContext>( {} as IAuthContext);

export const AuthProvider  = ({ children }: { children: ReactNode}) => {

  const [user, setUser] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(Cookies.get("jwt_auth") || null)
  // For some reason, when refreshing, we lose this state and it gets reseted
  // we need states here

  useEffect(() => {
    if(token){
      const name = jwtDecode(token)
      setUser(name.name)
    }
  },[])

  const login = (incomingToken: string) => {
    const decoded = jwtDecode(incomingToken)
    const fiveteenMin = new Date(new Date().getTime() + 15 * 60 * 1000);
    Cookies.set("jwt_auth", incomingToken, { expires: fiveteenMin})
    setToken(incomingToken)
    setUser(decoded.name)
  }
	
  const logout = () => {
    Cookies.remove("jwt_auth")
    setToken(null)
  }

  const isLoggedIn = () => {
    console.log("Is token valid")
    const token = Cookies.get("jwt_auth")
    if(token) {
      const decodedToken = jwtDecode(String(token))
      console.log("Token:",token)
      console.log("Decoded:" ,decodedToken)
      if (decodedToken) {
        return true
      }
    }
    return false
  }

  const authContextValue = {
    token,
    user,
    setToken,
    login,
    logout,
    isLoggedIn
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