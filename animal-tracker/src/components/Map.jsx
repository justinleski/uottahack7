import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import './Map.css';
import Modal from './Modal'; // Import the Modal component

const fetchNearbyLocations = async (lat, lon, radius) => {
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
    const lastCenterRef = useRef(null);

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

    const hasSignificantChange = (currentZoom, lastZoom, currentCenter, lastCenter) => {
        const zoomChanged = lastZoom === null || Math.abs((currentZoom - lastZoom) / lastZoom) > 0.1;

        const latChange = Math.abs(currentCenter.lat - lastCenter.lat);
        const lonChange = Math.abs(currentCenter.lng - lastCenter.lng);
        const significantMove = lastCenter === null || latChange > 0.1 || lonChange > 0.1;

        return zoomChanged || significantMove;
    };

    const MapEventsHandler = () => {
        const map = useMapEvents({
            moveend: () => {
                const currentZoom = map.getZoom();
                const currentCenter = map.getCenter();
                const lastZoom = lastZoomLevelRef.current;
                const lastCenter = lastCenterRef.current;

                if (hasSignificantChange(currentZoom, lastZoom, currentCenter, lastCenter)) {
                    lastZoomLevelRef.current = currentZoom;
                    lastCenterRef.current = currentCenter;

                    const bounds = map.getBounds();
                    const radius = map.distance(bounds.getSouthWest(), bounds.getNorthEast()) / 2;

                    // Fetch new data from the backend
                    fetchNearbyLocations(currentCenter.lat, currentCenter.lng, radius).then((data) => {
                        const newCoordinates = data.map(item => ({
                            lat: item.location.lat,
                            lng: item.location.lon,
                            imgSrc: item.url,
                            slug: item.slug, // Include slug in the data
                            name: item.slug, // Fallback for marker name
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
                            click: () => handleMarkerClick(location), // Pass the entire location object to Modal
                        }}
                    />
                ))}
                <MapEventsHandler />
            </MapContainer>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} content={modalData} />
        </div>
    );
};

export default Map;