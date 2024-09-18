import Box from '@mui/material/Box';
import Tab, { TabProps } from '@mui/material/Tab';
import { Link, LinkProps } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useCurrentUser } from '../features/users/hooks';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import { useEffect } from 'react';
// import { useState } from 'react';
// import { setCurrentUser } from '../features/users/userSlice';
// import { useDispatch } from 'react-redux';


type LinkTabProps = TabProps & LinkProps

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      LinkComponent={Link}
      color='primary'
      {...props}
    />
  );
}

export default function NavTabs() {
  // const disputch = useDispatch();
  const currentUser = useCurrentUser();
  // console.log('NavTabs-current-user:', currentUser); //---------------
  
  // const storedUser = localStorage.getItem('user');
  // console.log('NavTabs-stored-user:', storedUser); //---------------
  // if (storedUser) {
  //   const user = JSON.parse(storedUser);
  //   disputch(setCurrentUser(user));
  //   username = user.username;
  // }
  // const [name] = useState(username);

  return (
  <Box sx={{flexGrow: 1}}>
    <AppBar position='fixed' sx={{color: 'white'}}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          SHAPE CONTROL
        </Typography>
            {currentUser ?
              <>
                <LinkTab label="My programs" to="/progs" />
                <LinkTab label="New program" to="/create" />
                <LinkTab label="Log Out" to="/logout" />
                <LinkTab icon={<AccountCircleIcon/>} label={currentUser.username} to="/user" />
              </>
              : <LinkTab label="Sign In" to="/login" />
        }
      </Toolbar>
    </AppBar>
  </Box>
  );
}
