import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from "axios";
// -------------- import @mui ---------------
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// ---------- local import --------------
import { RootState } from '../app/store';
import { AppDispatch } from '../app/store';
import { setCurrentProg, patchProg } from '../features/progs/progSlice';
// import { resetStatus, fetchProgs } from '../features/progs/progSlice';
import { progSliceStatus, Program, Day } from '../features/progs/progSlice';
// import { useCurrentUser } from '../features/users/hooks';
import { useCurrentProgram } from '../features/progs/hooks';
import FormControlLabel from '@mui/material/FormControlLabel';
import { API } from '../utils/consts';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
// import { MyDialog } from './MyDialog';



export const CurrentProgram = () => {
    const defaultTheme = createTheme();
    const navigate = useNavigate()
    // const currentUser = useCurrentUser();
    const program = useCurrentProgram() as Program;
    const status: progSliceStatus = useSelector((state: RootState) => state.progReducer.status);
    const [close, setClose] = React.useState(program?.is_close);
    const [comment, setComment] = React.useState(program?.progcomment);
    const [weight, setWeight] = React.useState(program?.out_weight);
    const [name, setName] = React.useState(program?.progname);
    const [menu, setMenu] = React.useState('');
    const dispatch = useDispatch<AppDispatch>();
    
    const [rows, setRows] = React.useState<Array<Day & { row?: number }>>(
        program?.days.map((day,row) => {
            return {
                ...day,
                row: row+1,
            }
        })
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // delete row because we dont need to post it to database
        if (rows) {
            rows.forEach(item => {
            delete item.row
            });
        };
        const progData: Program = {
            ...program,
            out_weight: weight,
            progcomment: comment,
            progname: name,
            is_close: close,
            days: rows as Day[]
        };
        console.log('progData- ', progData); //---------------
        dispatch(patchProg(progData));
    };

    const handleAI = async () => {
        let submit = `give me a menu for breakfast, lunch and dinner total ${program.days[0].plan} kcal?`
        try {
            const response = await axios.get(
              API.ai + '?' + submit,
              { withCredentials: true }
            );
            if (response.status === 200) {
              console.log('menu', response.data); //----------------
              setMenu(response.data);
            //   navigate('/progs')
            }
          } catch (error: any) {
            console.log(error);  //-----------------
          }
    };
  
    const rowUpdate = (updatedRow: any) => {
        if (!rows) return updatedRow;
        let new_days = rows.map(item => item);
        new_days[updatedRow.row-1] = updatedRow;
        setRows(new_days);
        return updatedRow;
    };

    const columns: GridColDef[] = [
    { field: 'day', headerName: 'Day', width: 100, editable: false },
    {
        field: 'plan',
        headerName: 'Plan',
        type: 'number',
        editable: false,
        align: 'left',
        headerAlign: 'left',
    },
    {
        field: 'fact',
        headerName: 'Fact',
        type: 'number',
        editable: !close,
        align: 'left',
        headerAlign: 'left',
    },
    {
        field: 'strava',
        headerName: 'Strava kcal',
        type: 'number',
        editable: false,
        align: 'left',
        headerAlign: 'left',
    },
    {
        field: 'is_training',
        headerName: 'Workout',
        type: 'boolean',
        // width: 150,
        editable: false,
    },
    {
        field: 'workout',
        headerName: 'Workout type',
        // width: 150,
        editable: !close,
    },
    {
        field: 'comment',
        headerName: 'Comment',
        width: 250,
        editable: !close,
    },
    ];

    return (
    <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
            sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={8} >
                    <TextField
                        disabled={close}
                        fullWidth
                        size="small"
                        id="progname"
                        label="Program name"
                        name="progname"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={4} >
                    <FormControlLabel control={
                        <Switch
                            checked={close}
                            color="secondary"
                            onChange={() => setClose(!close)}
                            inputProps={{ 'aria-label': 'controlled' }}
                            />
                        } label="Program close" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        disabled
                        fullWidth
                        size="small"
                        id="level"
                        label="Level"
                        name="level"
                        value={program?.level}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        disabled
                        fullWidth
                        size="small"
                        id="grade"
                        label="Grade"
                        name="grade"
                        value={program?.grade}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                <TextField
                    fullWidth
                    disabled
                    size="small"
                    type="number"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    id="in_weight"
                    label="Begining weight"
                    value={program?.in_weight}
                    name="in_weight"
                />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                <TextField
                    fullWidth
                    size="small"
                    disabled={close}
                    type="number"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    id="out_weight"
                    label="Final weight"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    name="out_weight"
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    disabled={close}
                    size="small"
                    id="progcomment"
                    label="Comment"
                    name="progcomment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    disabled
                    size="small"
                    id="tips"
                    label="Tips"
                    name="tips"
                    value={program?.tips}
                />
                </Grid>
                <Grid item xs={12}>
                <DataGrid 
                    rows={rows} 
                    columns={columns}
                    rowHeight={42}
                    hideFooter
                    processRowUpdate={(updatedRow) =>
                    rowUpdate(updatedRow)
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
                sx={{ mt: 3, mb: 2, ml: 3 }}
            >
                Cancel
            </Button>
            <Button
                type="button"
                variant='outlined'
                onClick={handleAI}
                sx={{ mt: 3, mb: 2, ml: 50 }}
            >
                request menu from AI
            </Button>
            </Box>
        </Box>
        <Card sx={{ minWidth: 800 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    Menu
                </Typography>
                <Typography variant="body2">
                {menu}
                </Typography>
            </CardContent>
        </Card>
        </Container>
        <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={status == 'loading'}
        >
        <CircularProgress color="inherit" />
    </Backdrop>  
    </ThemeProvider>
    );
};
