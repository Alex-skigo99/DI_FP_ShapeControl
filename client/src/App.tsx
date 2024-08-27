import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import ProgramCreateForm  from "./components/Program_create_form";
import NavTabs from "./components/NavTabs";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
// import Navbar from "./components/NavbarOld";
// import Auth from "./auth/Auth";

function App() {
  return (
    <>
      <NavTabs />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/dash' element={<ProgramCreateForm />} />
      </Routes>
    </>
  );
}

export default App;
