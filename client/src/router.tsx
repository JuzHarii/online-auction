import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './layout';
import Register from './pages/Register.tsx';
import LogIn from './pages/LogIn.tsx';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />}></Route>
      </Route>

      <Route path="/signup" element={<Register />}></Route>
      <Route path="/signin" element={<LogIn />}></Route>
    </Routes>
  );
}

export default Router;
