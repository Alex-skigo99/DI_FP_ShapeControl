import { AppBar, Box } from "@mui/material";
import LinkButton from "./LinkButton";


const Navbar = () => {
  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position='static'>
        <LinkButton to='/'>
          Home
        </LinkButton>
        <LinkButton to='/dash'>
          Dashboard
        </LinkButton>
        <LinkButton to='/login'>
          Login
        </LinkButton>
        <LinkButton to='/register'>
          Register
        </LinkButton>
      </AppBar>
    </Box>
  );
};

export default Navbar;
