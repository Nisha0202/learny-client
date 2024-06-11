import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer";

export default function Root() {
    return (
        <>
            <div id="detail" className="plus">
                <div className="">
                     <Navbar></Navbar>
                <Outlet />
                </div>
               
                <Footer></Footer>

            </div>
        </>
    );
}