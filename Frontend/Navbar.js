import React from "react";
import {Link} from "react-router-dom";

function Navbar(){

return(

<nav className="navbar navbar-expand-lg navbar-dark bg-dark">

<div className="container">

<Link className="navbar-brand" to="/">CarRental</Link>

<div>

<Link className="nav-link text-white" to="/">Home</Link>

<Link className="nav-link text-white" to="/cars">Cars</Link>

<Link className="nav-link text-white" to="/login">Login</Link>

<Link className="nav-link text-white" to="/register">Register</Link>

</div>

</div>

</nav>

)

}

export default Navbar