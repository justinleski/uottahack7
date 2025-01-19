import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import './Map.css';

const Map = () => {
    const position = [0, 0];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const coordinates = [
        { lat: 50.505, lng: -0.09, imgSrc: 'https://placehold.co/600x400/png', name: "Location 1" },
        { lat: 51.515, lng: -0.1, imgSrc: 'https://placehold.co/600x400/png', name: "Location 2" },
        { lat: 1.525, lng: -0.08, imgSrc: 'https://placehold.co/600x400/png', name: "Location 3" },
    ];

    const createCustomDivIcon = (imgSrc) => L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 40px;
            height: 60px;
            border-radius: 5px;
            background-color: var(--primary-white);
            display: flex;
            align-items: center;
            justify-content: center;">
            <img src="${imgSrc}" style="width: 100%; height: 100%; border-radius: 5px; object-fit: cover;">
        </div>`
    });

    const handleMarkerClick = (data) => {
        setModalData(data);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

    const bounds = [
        [-60, -180], // Southwest corner (latitude, longitude)
        [90, 180],  // Northeast corner (latitude, longitude)
    ];

    return (
        <div className="map-wrapper">
            {/* Map Display */}
            <MapContainer center={position} zoom={2} scrollWheelZoom={true} className="leaflet-map" minZoom={2}
            maxBounds={bounds} // Restrict user from panning out of bounds
            maxBoundsViscosity={1.0} // Adjust the "stickiness" when hitting the bounds
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {coordinates.map((location, index) => (
                    <Marker
                        key={index}
                        position={[location.lat, location.lng]}
                        icon={createCustomDivIcon(location.imgSrc)}
                        eventHandlers={{
                            click: () => handleMarkerClick(location),
                        }}
                    />
                ))}
            </MapContainer>

            {/* Modal */}
            {isModalOpen && modalData && (
                <div className="focus-modal" onClick={closeModal}>
                    <div className="animal-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{modalData.name}</h3>
                        <img
                            src={modalData.imgSrc}
                            alt="Location"
                            style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem' }}
                        />
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Map;