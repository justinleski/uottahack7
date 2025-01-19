import React from 'react';
import "./Buttons.css";
import { Link } from "react-router-dom";

function Buttons() {
    return (
        <>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
            <div className="buttons-container">
                <div className="icons-row">
                    <Link to="/map">
                        <i className="bi bi-house"></i>
                    </Link>
                    <Link to="/camera">
                        <i className="bi bi-camera"></i>
                    </Link>
                    <Link to="/leaderboard">
                        <i className="bi bi-trophy"></i>
                    </Link>
                    <Link to="/profile">
                        <i className="bi bi-person-circle"></i>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Buttons;