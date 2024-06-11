import React from 'react'
import { Link, useRouteError } from "react-router-dom";
export default function ErrorPage() {

    const error = useRouteError();
    console.error(error);

    return (
        <div>
            <div className="w-56 h-72 my-12 mx-auto">
                <h1 className="text-3xl font-bold text-teal-700">404 Not Found</h1>
                <p className="text-xl py-6">Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.statusText || error.message}</i>
                </p>
                <div className="my-6 text-blue-600">
                    <Link to={'/'}>Return Home</Link>
                </div>
            </div>
        </div>
    )
}
