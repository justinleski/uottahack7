import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import './Map.css';

const fetchNearbyLocations = async (lat, lon, radius) => {
    // Replace with your API call
    const response = await fetch('/user/nearme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon, radius }),
    });
    const data = await response.json();
    return data;
};

const Map = () => {
    const position = [0, 0];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [coordinates, setCoordinates] = useState([]);
    const lastZoomLevelRef = useRef(null);

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
        [-80, -180], // Southwest corner (latitude, longitude)
        [90, 180],  // Northeast corner (latitude, longitude)
    ];

    const MapEventsHandler = () => {
        const map = useMapEvents({
            zoomend: () => {
                const currentZoom = map.getZoom();
                const lastZoom = lastZoomLevelRef.current;

                // Calculate the 25% threshold
                if (lastZoom === null || Math.abs((currentZoom - lastZoom) / lastZoom) > 0.25) {
                    lastZoomLevelRef.current = currentZoom;

                    const center = map.getCenter();
                    const bounds = map.getBounds();
                    const radius = map.distance(bounds.getSouthWest(), bounds.getNorthEast()) / 2;

                    // Fetch new data from the backend
                    fetchNearbyLocations(center.lat, center.lng, radius).then((data) => {
                        const newCoordinates = data.map(item => ({
                            lat: item.location.lat,
                            lng: item.location.lon,
                            imgSrc: item.url,
                            name: item.slug,
                        }));
                        setCoordinates(newCoordinates);
                    });
                }
            },
        });

        return null;
    };

    return (
        <div className="map-wrapper">
            {/* Map Display */}
            <MapContainer
                center={position}
                zoom={2}
                scrollWheelZoom={true}
                className="leaflet-map"
                minZoom={2}
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
                <MapEventsHandler />
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