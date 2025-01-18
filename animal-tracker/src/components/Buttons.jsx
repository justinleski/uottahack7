import React from 'react';
import "./Buttons.css"



// Make a sticky navbar, route to different pages.


function Buttons(props) {
    return (
        <>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"/>

            <div className="buttons-container">

                <div className="icons-row">
                    <i className="bi bi-house"></i>
                    <i className="bi bi-camera"></i>
                    <i className="bi bi-person-circle"></i>
                </div>


            </div>
        </>
    )
        ;
}

export default Buttons;