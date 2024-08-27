import { useEffect, useState, ReactNode, FC } from "react";
import axios from "axios";
import { API } from "../utils/consts";
import ProgramCreateForm from "../components/Program_create_form";
import SignIn from "../components/SignIn";

type AuthProps = {
  children: ReactNode
};

const Auth: FC<AuthProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    try {
      const response = await axios.get(API.auth, {
        headers: {
          "x-access-token": "token",
        },
        withCredentials: true,
      });
      if ((response.status === 200)) setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };
  if (isAuthenticated === null) return <div>Loading...</div>;

  // return isAuthenticated ? children : <Login />;
  return isAuthenticated ? <ProgramCreateForm /> : <SignIn />;
};
export default Auth;
