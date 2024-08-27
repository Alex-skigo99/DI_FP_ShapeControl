import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { Link, LinkProps } from 'react-router-dom';

type LinkButtonProps = ButtonProps & LinkProps;

const LinkButton: React.FC<LinkButtonProps> = (props) => {
  return <Button LinkComponent={Link} {...props} />;
};

export default LinkButton;