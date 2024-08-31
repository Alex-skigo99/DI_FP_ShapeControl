import Box from '@mui/material/Box';
import Tab, { TabProps } from '@mui/material/Tab';
import { Link, LinkProps } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useCurrentUser } from '../features/users/hooks';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


type LinkTabProps = TabProps & LinkProps

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      LinkComponent={Link}
      sx={{color: 'white'}}
      {...props}
    />
  );
}

export default function NavTabs() {
  const currentUser = useCurrentUser();
  console.log('NavTabs-current-user:', currentUser); //---------------

  return (
  <Box sx={{flexGrow: 1}}>
    <AppBar position='static' sx={{color: 'white'}}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          SHAPE CONTROL
        </Typography>
            {currentUser?
              <>
                <LinkTab label="My programs" to="/progs" />
                <LinkTab label="New program" to="/create" />
                <LinkTab label="Log Out" to="/logout" />
                <AccountCircleIcon/>
                <Typography variant="overline" display="block" gutterBottom>
                    {currentUser.username}
                </Typography>
              </>
              : <LinkTab label="Sign In" to="/login" />
        }
      </Toolbar>
    </AppBar>
  </Box>
  );
}
