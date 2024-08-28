import {useSelector} from 'react-redux';
import { getCurrentUser} from "./userSlice";

export const useCurrentUser = () => useSelector(getCurrentUser);
