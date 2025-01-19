import { useState } from 'react';
import './Modal.css';

function Modal({ imgSrc, isVisible, onClose }) {

    const [loading, setLoading] = useState(true);
    const [perenualData, setPerenualData] = useState(null);

    // do not render if not in visible state
    if (isVisible == false){
        return null; 
    }


    return (<>
        <div className="animal-modal">
            <img src={imgSrc} style={{ width: "100px", height: "200px" }}></img>
            <h1>Animal Name</h1>

            <div className="modal-info">
                <p>Username: @__</p>
                <p>Location: __</p>
                <p>Date: __</p>
            </div>

            <div className="modal-buttons">
                <button>
                    <i class="bi bi-person-fill-add"></i>
                </button>
                
                <button onClick={onClose}>
                    <i class="bi bi-x"></i>
                </button>   
            </div>

        </div>
        
    

        <div className="focus-modal"></div>
    </>);
}

export default Modal;