import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import './App.css';
import Index from "./Pages";
import History from "./Pages/history";


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>}></Route>
        <Route path="/history" element={<History/>}></Route>
        <Route path="*" element={<Navigate to="/" replace={true}></Navigate>} exact={true}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
