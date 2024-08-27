// import * as React from 'react';
import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
import Tab, { TabProps } from '@mui/material/Tab';
import { Link, LinkProps } from 'react-router-dom';
import { AppBar, Toolbar } from '@mui/material';

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
        {/* <Box sx={{ width: '100%' }}> */}
          {/* <Tabs
            value={value}
            onChange={handleChange}
            aria-label="nav tabs example"
            role="navigation"
          > */}
            <LinkTab label="Home" to="/" />
            <LinkTab label="New program" to="/dash" />
            <LinkTab label="Sign In" to="/login" />
            <LinkTab label="Register" to="/register" />
          {/* </Tabs> */}
        {/* </Box> */}
      </Toolbar>
    </AppBar>
  </Box>
  );
}
