//       {date ? <p>{new Date(date).toLocaleDateString()}</p> : <p>Loading...</p>}

// import {useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
// import axios from "axios";
// -------------- import @mui ---------------
// import CssBaseline from '@mui/material/CssBaseline';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// ---------- local import --------------
import { AppDispatch, RootState } from '../app/store';
import { progSliceStatus, setCurrentProg } from '../features/progs/progSlice';
// import { Day, Program } from '../features/progs/progSlice';
// import { useCurrentUser } from '../features/users/hooks';
import { usePrograms } from '../features/progs/hooks';
import { MyDialog } from './MyDialog';
import { CurrentProgram } from './CurrentProgram';
import { useCurrentProgram } from '../features/progs/hooks';


export default function MyPrograms() {
  const defaultTheme = createTheme();
  const navigate = useNavigate()
//   const currentUser = useCurrentUser();
  const programs = usePrograms();
  const currentProgram = useCurrentProgram();
  const status: progSliceStatus = useSelector((state: RootState) => state.progReducer.status);
  const dispatch = useDispatch<AppDispatch>();
  //   const [weight, setWeight] = React.useState(undefined as number | undefined);
  // const [open, setOpen] = React.useState(false);
    
  const handleChange = (event: SelectChangeEvent) => {
      let idx = Number(event.target.value);
      dispatch(setCurrentProg(idx))
  };
  
//   useEffect(() => {
//     if (currentUser) {
//         dispatch(fetchProgs(currentUser.id as number));
//     }
//     }, []);
    
    
    if (!programs) {
        return (
        <MyDialog 
            title = 'Hello'
            text = 'You do not have any program. Seems like you are a new client. Wellcome! You have to creata a first meal program.'
            btnText='Ok'
            handleClose={() => navigate('/create')}
        />
        )
    };
    console.log('MyPrograms: ', currentProgram);//-------------------
    
  return (
    <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="sm" >
        <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={12} >
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Choose program</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="My-programs"
                onChange={handleChange}
            >
                {(Array.isArray(programs) ? programs : []).map((prog, idx) => (
                    <MenuItem key={idx} value={idx}>{prog.progname}</MenuItem>))}
            </Select>
            </FormControl>
            </Grid>
        </Grid>
        </Container>
        {currentProgram ? <CurrentProgram/> : <></>}
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={status === 'loading'}
            >
            <CircularProgress color="inherit" />
        </Backdrop>  

    </ThemeProvider>
  );
}
