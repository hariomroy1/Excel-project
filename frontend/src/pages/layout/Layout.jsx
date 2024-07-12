import react from 'react';
import Navbar from '../navbar/Navbar.jsx';
import { Outlet } from 'react-router-dom';

function Layout()
{
    return (
        <>
        <Navbar/>
        <Outlet/>
        </>
    );
}

export default Layout;