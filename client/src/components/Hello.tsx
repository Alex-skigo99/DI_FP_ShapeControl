import { API } from "../utils/consts";
import { api } from "../utils/http_requests";
import { useEffect, useState, FC } from 'react';

type User = {
    id: number,
    name: string,
    value: number
};

type PropsType = {
    id: number
}


const Hello: FC<PropsType> = ({id}) => {
    const [user, setUser] = useState<User | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    // const id = 5

    useEffect(() => {
      const getData = async () => {
        try {
          const result: User[]|undefined = await api.get(API.hello +'/'+ id );
          console.log(result);
          if (!result) return <div>Nothing found</div>  
          setUser(result[0]);
        } catch (err) {
          setError('Error fetching data');
        } finally {
          setLoading(false);
        }
      };
      getData();
    }, []);
  
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>{error}</div>;
    }
    
    return <div>User: {user?.name}</div>;
    
};

export default Hello;
