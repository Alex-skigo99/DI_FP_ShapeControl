import React from 'react';
// import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import axios from "axios";
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
// import { AppDispatch } from '../app/store';
// import { postProg } from '../features/progs/progSlice';
import { progSliceStatus, Program, Day } from '../features/progs/progSlice';
import { useCurrentUser } from '../features/users/hooks';
import { useCurrentProgram } from '../features/progs/hooks';


export const CurrentProgram = () => {
    const defaultTheme = createTheme();
    // const navigate = useNavigate()
    const currentUser = useCurrentUser();
    const program = useCurrentProgram() as Program;
    const status: progSliceStatus = useSelector((state: RootState) => state.progReducer.status);
    const [close, setClose] = React.useState(program?.is_close);
    // const dispatch = useDispatch<AppDispatch>();
  
    const [rows, setRows] = React.useState(
        program?.days.map((day,row) => {
            return {
                row: row+1,
                id: day.id,
                day: day.day,
                plan: day.plan,
                fact: day.fact,
                stava: day.strava,
                is_training: day.is_training,
                workout: day.workout,
                comment: day.comment
            }
        })
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // console.log('date - ', data.get('date')); // --------------
        //delete day.id because we dont need to post it to database
        // if (rows) {
        //     rows.forEach(day => {
        //     delete day.row
        //     });
        // };
        const progData: Program = {
            ...program,
            out_weight: data.get('out_weight') as any,
            progcomment: data.get('progcomment') as string,
            tips: data.get('tips') as string,
            grade: data.get('grade') as string,
            is_close: close,
            user_id: currentUser?.id as number,
            days: rows as Day[]
        };
        console.log('progData- ', progData); //---------------
        // dispatch(postProg(progData));
    };

    const rowUpdate = (updatedRow: any) => {
        if (!rows) return updatedRow;
        let new_days = rows.map(item => item);
        new_days[updatedRow.id-1] = updatedRow;
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
        editable: true,
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
        editable: true,
    },
    {
        field: 'comment',
        headerName: 'Comment',
        // width: 200,
        editable: true,
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
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        disabled
                        fullWidth
                        id="level"
                        label="Level"
                        name="level"
                        defaultValue={program?.level}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        disabled
                        fullWidth
                        id="grade"
                        label="Grade"
                        name="grade"
                        defaultValue={program?.grade}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                <TextField
                    fullWidth
                    disabled
                    type="number"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    id="in_weight"
                    label="Begining weight"
                    defaultValue={program?.in_weight}
                    name="in_weight"
                />
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                <TextField
                    fullWidth
                    disabled={close}
                    type="number"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    id="out_weight"
                    label="Final weight"
                    defaultValue={program?.out_weight}
                    name="out_weight"
                />
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                    <Switch
                        checked={close}
                        onChange={() => setClose(!close)}
                        inputProps={{ 'aria-label': 'controlled' }}
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
                    defaultValue={program?.progcomment}
                    autoComplete="my-comments"
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
                    defaultValue={program?.tips}
                />
                </Grid>
                <Grid item xs={12}>
                <DataGrid 
                    rows={rows} 
                    columns={columns}
                    hideFooter
                    processRowUpdate={(updatedRow) =>
                    rowUpdate(updatedRow)
                    }
                />
                </Grid>

                {/* <Grid item xs={12}>
                <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                />
                </Grid> */}
            </Grid>
            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Save
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
};
