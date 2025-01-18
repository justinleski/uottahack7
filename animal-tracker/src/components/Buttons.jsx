import React from 'react';
import "./Buttons.css"
import {Link} from "react-router-dom";


// Make a sticky navbar, route to different pages.





function Buttons(props) {
    return (
        <>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"/>

            <div className="buttons-container">

                <div className="icons-row">

                    <Link to="/Map">
                        <i className="bi bi-house"></i>

                    </Link>
                    <Link to="/camera">
                        <i className="bi bi-camera"></i>
                    </Link>

                    <Link to="/Profile">
                        <i className="bi bi-person-circle"></i>
                    </Link>

                </div>


            </div>
        </>
    )
        ;
}

export default Buttons;