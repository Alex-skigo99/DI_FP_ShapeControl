import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
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

import FormControlLabel from '@mui/material/FormControlLabel';
import { Typography } from '@mui/material';
import { red } from '@mui/material/colors';

// ---------- local import --------------
import { RootState } from '../app/store';
import { AppDispatch } from '../app/store';
import { setCurrentProg, patchProg, getStravaActivities } from '../features/progs/progSlice';
// import { resetStatus, fetchProgs } from '../features/progs/progSlice';
import { resetStatus, progSliceStatus, Program, Day } from '../features/progs/progSlice';
// import { useCurrentUser } from '../features/users/hooks';
import { useCurrentProgram } from '../features/progs/hooks';
import Menu from './Menu';
import { api } from '../utils/http_requests';
import FormDialog, {FormDialogData} from './FormDialog';
import { MyDialog } from './MyDialog';
import { API } from '../utils/consts';
import dayjs from 'dayjs';
// import { lightGreen } from '@mui/material/colors';

interface Props {
    isStrava?: boolean;
};


export const CurrentProgram = ({isStrava}: Props) => {
    const defaultTheme = createTheme();
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const program = useCurrentProgram() as Program;
    const status: progSliceStatus = useSelector((state: RootState) => state.progReducer.status);
    const [needSave, setNeedSave] = React.useState(false);
    // const currentUser = useCurrentUser();
    // forms state
    const [close, setClose] = React.useState(program?.is_close);
    const [comment, setComment] = React.useState(program?.progcomment);
    const [weight, setWeight] = React.useState(program?.out_weight);
    const [name, setName] = React.useState(program?.progname);
    const [menu, setMenu] = React.useState(program?.menu);
    const [rows, setRows] = React.useState<Array<Day & { row?: number }>>(
        program?.days.map((day,row) => {
            return {
                ...day,
                row: row+1,
            }
        })
    );
    // dialog state
    const [openFormDialog, setOpenFormDialog] = React.useState(false);

    useEffect(() => {
        if (program) {
            // setClose(program.is_close);
            // setComment(program.progcomment);
            // setWeight(program.out_weight);
            // setName(program.progname);
            // setMenu(program.menu);
            setRows(program.days.map((day,row) => {
                return {
                    ...day,
                    row: row+1,
                }
            }));
        }
    }, [program]);

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
            menu: menu,
            is_close: close,
            days: rows as Day[]
        };
        console.log('progData- ', progData); //---------------
        dispatch(patchProg(progData));
        setNeedSave(false);
    };

    const handleAI = async () => {
        setOpenFormDialog(true);
    };

    // Close FormDialog
    const handleCloseFormDialog = async (data?: FormDialogData) => {

        setOpenFormDialog(false);
        if (data) {
            let url = API.ai + '?prompt=' + `give me a menu for breakfast, lunch and dinner using  total ${data.kcalAmount} kcal using (but not only) next foods: ${data.foodsPrefer}?`
            let response: any = await api.get_credentials(url);
            if (response) {
                setMenu(response.content);
                setNeedSave(true);
            }
        }
    };
    const handleDialogSuccessUpdate = (isCancel: boolean) => {
        if (!isCancel) {
            dispatch(setCurrentProg(undefined));
        };
        dispatch(resetStatus());
        navigate('/progs')
    };

    const handleStrava = async () => {
        if (program.days[0].date) {
            let startDay = dayjs(program.days[0].date).subtract(1, 'day').unix(); // get activities from the day before the program start
            let endDay = dayjs(program.days[program.days.length-1].date).unix();
            console.log('startDay- ', startDay); //----------------
            console.log('endDay- ', endDay); //----------------
            let url = API.strava + '?userid=' + program.user_id
                + '&after=' + startDay
                + '&before=' + endDay;
            console.log('url- ', url); //----------------
            dispatch(getStravaActivities(url));
            setNeedSave(true);
        } else {
            console.log('startDay is undefined'); //----------------
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
        field: 'date',
        headerName: 'Date',
        width: 100,
        align: 'left',
        editable: false,
    },
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
        width: 350,
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
                {/* <Grid item xs={12}>
                <TextField
                    fullWidth
                    disabled
                    size="small"
                    id="tips"
                    label="Tips"
                    name="tips"
                    value={program?.tips}
                />
                </Grid> */}
                <Grid item xs={12}>
                <DataGrid 
                    rows={rows} 
                    columns={columns}
                    rowHeight={40}
                    density='compact'
                    hideFooter
                    processRowUpdate={(updatedRow) =>
                    rowUpdate(updatedRow)
                    }
                />
                </Grid>
            </Grid>
            {needSave && 
                <Typography variant='body2' sx={{ mt: 1, mb: 0, ml: 3, color: red[400] }}>
                    You have unsaved changes
                </Typography>}
            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, ml: 3 }}
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
                sx={{ mt: 3, mb: 2, ml: 30 }}
            >
                Menu suggestion
            </Button>
            {isStrava &&
                <Button
                    type="button"
                    color='warning'
                    variant='outlined'
                    onClick={handleStrava}
                    sx={{ mt: 3, mb: 2, ml: 3 }}
                >
                    From Strava 
                </Button>
            }
            </Box>
        </Box>
        {menu && <Menu text={menu}/>}
        </Container>
        <FormDialog open={openFormDialog} kcalAmount={program.days[0].plan} onClose={handleCloseFormDialog} />
        <MyDialog
            open={status === 'succeeded'}
            cancelBtn={true}
            title = 'Success!'
            text = 'Current program has been updated'
            btnText='Select another'
            handleClose={handleDialogSuccessUpdate} />
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={status === 'loading'}
            >
            <CircularProgress color="inherit" />
        </Backdrop>  
    </ThemeProvider>
    );
};
