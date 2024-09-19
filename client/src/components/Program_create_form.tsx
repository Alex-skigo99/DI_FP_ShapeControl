import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
// import axios from "axios";
import dayjs from 'dayjs';

// -------------- import @mui ---------------
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// ---------- local import --------------
import { AppDispatch, RootState } from '../app/store';
import { postProg, progSliceStatus, resetStatus, setCurrentProg } from '../features/progs/progSlice';
import { Day, Program } from '../features/progs/progSlice';
import { useCurrentUser } from '../features/users/hooks';
import { LevelType, weekDays, activityIndex } from '../utils/consts';
import calculateDailyCalorie from '../utils/calculateDailyCalorie';
import { MyDialog } from './MyDialog';

export default function ProgramCreateForm() {
  const defaultTheme = createTheme();
  // const [message, setMessage] = React.useState('');
  const navigate = useNavigate()
  const currentUser = useCurrentUser();
  const status: progSliceStatus = useSelector((state: RootState) => state.progReducer.status);
  const dispatch = useDispatch<AppDispatch>();
  const [level, setLevel] = React.useState('stable' as LevelType);
  const [weight, setWeight] = React.useState(undefined as number | undefined);
  // const [open, setOpen] = React.useState(false);

  let initDays: Day[] = weekDays.map((wd, i) => {
    return {
      id: i + 1,
      day: wd,
      plan: 0,
      is_training: false,
      workout: '',
      comment: ''
    }
  })
  const [days, setDays] = React.useState(initDays);

  const handleChange = (event: SelectChangeEvent) => {
    let newLevel = event.target.value as LevelType;
    setLevel(newLevel);
    weight? fillForm(weight, newLevel) : console.log('weight:', weight);
  };
  const handleChangeWeight = (event: any) => {
    let newWeight = Number(event.target.value);
    setWeight(newWeight);
    fillForm(newWeight, level);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log('date - ', data.get('date')); // --------------
    const progData: Program = {
      progname: data.get('progname') as string + ' : ' + data.get('date'),
      progcomment: data.get('progcomment') as string,
      level: level as LevelType,
      is_close: false,
      in_weight: weight as number,
      user_id: currentUser?.id as number,
      days: days.map((day, idx) => {
        // delete day.id because we dont need to post it to database
        delete day.id;
        // add date to day object
        return {...day, date: dayjs(data.get('date') as string).add(idx, 'day').format('YYYY-MM-DD')}
      })
    };
    // progData.days?.forEach(day => {
    //   delete day.id
    // });
    console.log('progData- ', progData); //---------------
    dispatch(postProg(progData));
  };

  const fillForm = (newWeight: number, lev: LevelType) => {
    if (!currentUser) return;
    const {dailyCal, dailyCalActiv} = calculateDailyCalorie(newWeight, lev, currentUser);
    let newDays: Day[] = days.map(day => {
      return {
        id: day.id,
        day: day.day,
        plan: day.is_training? dailyCalActiv : dailyCal,
        is_training: day.is_training,
        workout: day.workout,
        comment: day.comment
      }
    });
    setDays(newDays);
  };

  const rowUpdate = (updatedRow: Day, oldRow: Day) => {
    if (!updatedRow.id) return updatedRow;
    if (updatedRow.is_training && !oldRow.is_training) {
      updatedRow.plan = Math.floor(updatedRow.plan * activityIndex);
    }
    if (!updatedRow.is_training && oldRow.is_training) {
      updatedRow.plan = Math.floor(updatedRow.plan / activityIndex);
    }
    let new_days = days.map(item => item);
    new_days[updatedRow.id-1] = updatedRow;
    setDays(new_days);
    return updatedRow;
  };

  const columns: GridColDef[] = [
    { field: 'day', headerName: 'Day', width: 150, editable: true },
    {
      field: 'plan',
      headerName: 'Plan',
      type: 'number',
      editable: true,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'is_training',
      headerName: 'Workout',
      type: 'boolean',
      // width: 150,
      editable: true,
    },
    {
      field: 'workout',
      headerName: 'Workout type',
      // type: 'dateTime',
      width: 150,
      editable: true,
    },
    {
      field: 'comment',
      headerName: 'Comment',
      // type: 'dateTime',
      width: 350,
      editable: true,
    },
  ];

  if (status == 'succeeded') {
    return (
      <MyDialog
      open={true}
      cancelBtn={false}
      title = 'Succeeded'
      text = 'Your new 7-day meal program successful created and store to database.'
      btnText='Ok'
      handleClose={() => {
            dispatch(resetStatus());
            navigate('/progs')
            }}
      />
    )
  };

  if (!currentUser) {
    return (
      <MyDialog
          open={true}
          cancelBtn={false}
          title = 'Access denied'
          text = 'Please sign up.'
          btnText='Ok'
          handleClose={() => navigate('/login')}
      />
    )
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Create 7-day meal program
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={5}>
                <TextField
                  required
                  fullWidth
                  id="progname"
                  label="Progname"
                  name="progname"
                  autoComplete="progname"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Level</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={level}
                  label="Level"
                  onChange={handleChange}
                >
                  <MenuItem value={'stable'}>Stable</MenuItem>
                  <MenuItem value={'progress'}>Progress</MenuItem>
                  <MenuItem value={'jump'}>Jump</MenuItem>
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of first day"
                      name="date"
                      format='YYYY-MM-DD'
                      defaultValue={dayjs()}
                    />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id="in_weight"
                  label="Begining weight"
                  name="in_weight"
                  onChange={handleChangeWeight}
                  // autoComplete="my-age"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  id="progcomment"
                  label="Comment"
                  name="progcomment"
                  autoComplete="my-progcomment"
                />
              </Grid>
              <Grid item xs={12}>
                <DataGrid 
                  rows={days} 
                  columns={columns}
                  hideFooter
                  rowHeight={42}
                  processRowUpdate={(updatedRow, oldRow) =>
                    rowUpdate(updatedRow, oldRow)
                  }
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
            <Button
                type="button"
                variant='outlined'
                onClick={() => {
                    dispatch(setCurrentProg(undefined));
                    navigate('/progs')
                }}
                sx={{ mt: 3, mb: 2, ml: 3, justifySelf: 'end' }}
            >
                Cancel
            </Button>
          </Box>
        </Box>
      </Container>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={status == 'loading'}
        >
        <CircularProgress color="inherit" />
    </Backdrop>  
    </ThemeProvider>
  );
}
