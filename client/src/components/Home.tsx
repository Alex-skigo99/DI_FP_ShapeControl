import { useState, useEffect } from "react";
import axios from "axios";
import { API, User } from "../utils/consts";

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(API.allUsers, {
        // headers: {
        //   "x-access-token": "token"
        // },
        withCredentials: true,
      });
      console.log('Home-response-data: ', response.data); //---------------
      setUsers(response.data);
    } catch (error: any) {
      console.log(error.response.data);   //---------------
    }
  };
  return (
    <>
      <h2>home</h2>
      {users.map((item: User) => {
        return (
          <div key={item.id}>
            {item.id} {item.username}
          </div>
        );
      })}
    </>
  );
};
export default Home;
