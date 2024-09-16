import Typography from "@mui/material/Typography";
import { useCurrentUser, useUserError, useUserLoading } from "../features/users/hooks";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel/FormLabel";
import { RadioGroup, FormControlLabel, Radio, Button, Backdrop, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { User, stravaSignupParameters } from "../utils/consts";
import MySnackbar from "./MySnackbar";
import { resetUserSliceStatus, updateUser } from "../features/users/userSlice";
import { useDispatch } from "react-redux";
import { setCurrentProg } from "../features/progs/progSlice";
import { AppDispatch } from "../app/store";

export const UserPage = () => {
    const currentUser = useCurrentUser(); // username, age, height, gender
    const userError = useUserError();
    const userLoading = useUserLoading();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    if (!currentUser) {
        return <Link to="/login">Please login</Link>;
    }
    const newUserData: User = {...currentUser};

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        newUserData.username = data.get('username') as string;
        // newUserData.password = data.get('password') as string;
        newUserData.age = Number(data.get('age'));
        newUserData.gender = data.get('gender') as string;
        newUserData.height = Number(data.get('height'));
        delete newUserData.strava_id; // not to update strava_id
        console.log(newUserData); //-------------------
        dispatch(updateUser(newUserData));
    };

    const handleStravaConnect = () => {
        let url: string = 'https://www.strava.com/oauth/authorize?';
        url += `cleint_id=${stravaSignupParameters.client_id}&`;
        url += `redirect_uri=${stravaSignupParameters.redirect_uri}&`;
        url += `response_type=${stravaSignupParameters.response_type}&`;
        url += `approval_prompt=${stravaSignupParameters.approval_prompt}&`;
        url += `scope=${stravaSignupParameters.scope}&`;
        url += `state=${currentUser.id}`;
        // for (let key in stravaSignupParameters) {
        //     url += `${key}=${stravaSignupParameters[key]}&`;
        // }
        fetch(url);
    };

    return (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5">
                My Profile
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      defaultValue={newUserData.username}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      defaultValue={newUserData.password}
                      autoComplete="new-password"
                    /> */}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                  <FormControl>
                    <FormLabel id="gender">Gender</FormLabel>
                    <RadioGroup
                      aria-labelledby="gender"
                      defaultValue={newUserData.gender}
                      name="gender"
                    >
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                    </RadioGroup>
                  </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="age"
                      label="Age"
                      name="age"
                      defaultValue={newUserData.age}
                      // autoComplete="my-age"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="height"
                      label="Height"
                      name="height"
                      defaultValue={newUserData.height}
                      // autoComplete="my-age"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Update
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

                {newUserData.strava_id ?
                  <Typography variant="body2" color='warning' align="center">
                    Strava connected
                  </Typography>
                 :
                  <Button
                    type="button"
                    fullWidth
                    color='warning'
                    variant="text"
                    onClick={handleStravaConnect}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Connect to 
                    <img src="https://i0.wp.com/www.interhacktives.com/wp-content/uploads/2014/02/strava.png?w=595&ssl=1"
                     alt="strava connection"
                     height={30} />
                  </Button>
                }
              </Box>
            </Box>
            <Backdrop
              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
              open={userLoading}
              >
              <CircularProgress color="inherit" />
          </Backdrop>
          <MySnackbar
              isOpen={userError !== null}
              period={5000}
              message={String(userError) || ''}
              severity="error"
              closeAction={() => {dispatch(resetUserSliceStatus())}}
          />
          </Container>
      );
    
};