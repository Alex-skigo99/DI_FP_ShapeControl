import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import "./App.css";
// import Home from "./components/Home";
import ProgramCreateForm  from "./components/Program_create_form";
import NavTabs from "./components/NavTabs";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import LogOut from "./components/LogOut";
import MyPrograms from "./components/MyPrograms";
import { UserPage } from "./components/UserPage";
// import Navbar from "./components/NavbarOld";
// import Auth from "./auth/Auth";

const myTheme = createTheme({
  palette: {
    mode: import.meta.env.VITE_APP_THEME,
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={myTheme}>
        <NavTabs />
        <Routes>
          {/* <Route path='/' element={<Home />} /> */}
          <Route path='/login' element={<SignIn />} />
          <Route path='/logout' element={<LogOut />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/create' element={<ProgramCreateForm />} />
          <Route path='/progs' element={<MyPrograms />} />
          <Route path='/user' element={<UserPage />} />
        </Routes>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
