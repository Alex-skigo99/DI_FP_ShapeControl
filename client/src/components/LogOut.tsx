import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/users/userSlice';

const LogOut: React.FC = () => {
    useDispatch()(logout());
    return <h3>You are logged out.</h3>;
};

export default LogOut;