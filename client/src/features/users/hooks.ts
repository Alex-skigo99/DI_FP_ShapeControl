import {useSelector} from 'react-redux';
import { getCurrentUser, getUserError, getUserLoading} from "./userSlice";

export const useCurrentUser = () => useSelector(getCurrentUser);
export const useUserError = () => useSelector(getUserError);
export const useUserLoading = () => useSelector(getUserLoading);
