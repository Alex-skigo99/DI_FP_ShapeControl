import { useState, useEffect } from "react";
import axios from "axios";
import { API, User } from "../utils/consts";
import { useCurrentUser } from '../features/users/hooks';

const Home = () => {
  const [users, setUsers] = useState([]);
  const currentUser = useCurrentUser();
  console.log('Home-current-user:', currentUser); //--------------------

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    console.log('Home-getUser-current-user:', currentUser); //--------------------
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
      {currentUser?
          <h3>Current user: {currentUser.id} {currentUser.username}</h3>
          : <h3>Current user undefined</h3>
        }

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
