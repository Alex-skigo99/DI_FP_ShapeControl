import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/users/userSlice';
import { setCurrentProg } from '../features/progs/progSlice';

const LogOut: React.FC = () => {
    const dispatch = useDispatch();
    dispatch(logout());
    dispatch(setCurrentProg(undefined));
    return <h3>You are logged out.</h3>;
};

export default LogOut;