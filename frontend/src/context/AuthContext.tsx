import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

export interface IAuthContext {
  token: string,
  setToken: Dispatch<SetStateAction<string | null>>,
  login: (token: string) => void ,
  logout: () => void
}

const AuthContext = createContext<IAuthContext>( {} as IAuthContext);

export const AuthProvider  = ({ children }: { children: ReactNode}) => {

  const [token, setToken] = useState<string | null>(null)
  // For some reason, when refreshing, we lose this state and it gets reseted

  const login = (incomingToken: string) => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token")
    }
    localStorage.setItem('token', incomingToken);
    setToken(incomingToken)
      
    }
	
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null)
  }


  const authContextValue = {
    token,
    setToken,
    login,
    logout,
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