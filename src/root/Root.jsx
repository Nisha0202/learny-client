import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer";

export default function Root() {
    return (
        <>
            <div id="detail" className="plus">
                <div className="grid min-h-[100vh] grid-rows-[auto_1fr_auto]">
                     <Navbar/>
                <Outlet />
                 <Footer/>
                </div>
               
               

            </div>
        </>
    );
}