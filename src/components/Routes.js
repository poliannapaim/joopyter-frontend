import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Welcome from "../views/Authentication/Welcome";
import Register from "../views/Authentication/Register";

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component = {Welcome} path="/" exact></Route>
            <Route component = {Register} path="/register"></Route>
        </BrowserRouter>
    );
}

export default Routes;
