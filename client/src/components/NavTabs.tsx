// import * as React from 'react';
import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
import Tab, { TabProps } from '@mui/material/Tab';
import { Link, LinkProps } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useCurrentUser } from '../features/users/hooks';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// function samePageLinkNavigation(
//   event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
// ) {
//   if (
//     event.defaultPrevented ||
//     event.button !== 0 || // ignore everything but left-click
//     event.metaKey ||
//     event.ctrlKey ||
//     event.altKey ||
//     event.shiftKey
//   ) {
//     return false;
//   }
//   return true;
// }

type LinkTabProps = TabProps & LinkProps

// interface LinkTabProps {
//   label?: string;
//   href?: string;
//   selected?: boolean;
// }

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      // component="a"
      LinkComponent={Link}
      sx={{color: 'white'}}
      // onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      //   if (samePageLinkNavigation(event)) {
      //     event.preventDefault();
      //   }
      // }}
      // aria-current={props.selected && 'home'}
      {...props}
    />
  );
}

export default function NavTabs() {
  const currentUser = useCurrentUser();
  console.log('NavTabs-current-user:', currentUser); //---------------
  // const [value, setValue] = React.useState(0);

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   if (
  //     event.type !== 'click' ||
  //     (event.type === 'click' &&
  //       samePageLinkNavigation(
  //         event as React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  //       ))
  //   ) {
  //     setValue(newValue);
  //   }
  // };

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
