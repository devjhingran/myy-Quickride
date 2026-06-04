import React from "react";

function CarCard({car}){

return(

<div className="col-md-4">

<div className="card shadow">

<img src={car.image} className="card-img-top"/>

<div className="card-body">

<h5>{car.name}</h5>

<p>₹{car.price} / day</p>

<button className="btn btn-dark">

Book Now

</button>

</div>

</div>

</div>

)

}

export default CarCard