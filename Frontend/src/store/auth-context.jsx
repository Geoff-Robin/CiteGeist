import { useState, createContext, useEffect } from "react";

export const AuthContext = createContext({
  interests: null,
  setInterests: () => {},
  accessToken: null,
  setAccessToken: () => {},
  refreshToken: null,
  setRefreshToken: () => {},
});

export function AuthContextProvider(props) {
  const [interests, setInterests] = useState(() => {
    const savedInterests = sessionStorage.getItem("interests");
    return savedInterests ? JSON.parse(savedInterests) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    const savedAccessToken = sessionStorage.getItem("accessToken");
    return savedAccessToken ? savedAccessToken : null;
  });

  const [refreshToken, setRefreshToken] = useState(() => {

    const savedRefreshToken = sessionStorage.getItem("refreshToken");
    return savedRefreshToken ? savedRefreshToken : null;
  });

  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
    } else {
      sessionStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  
  useEffect(() => {
    if (refreshToken) {
      sessionStorage.setItem("refreshToken", refreshToken);
    } else {
      sessionStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
