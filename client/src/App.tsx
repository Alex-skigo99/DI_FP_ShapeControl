import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";

import "./App.css";
import Home from "./components/Home";
import ProgramCreateForm  from "./components/Program_create_form";
import NavTabs from "./components/NavTabs";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import LogOut from "./components/LogOut";
// import Navbar from "./components/NavbarOld";
// import Auth from "./auth/Auth";

function App() {
  return (
    <Provider store={store}>
      <NavTabs />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/logout' element={<LogOut />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/dash' element={<ProgramCreateForm />} />
      </Routes>
    </Provider>
  );
}

export default App;
