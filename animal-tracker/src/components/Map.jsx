import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import './Map.css';

const Map = () => {

  const position = [0, 0];

  // sample data
  const coordinates = [
    { lat: 500.505, lng: -0.09, imgSrc: 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { lat: 51.515, lng: -0.1, imgSrc: 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { lat: 1.525, lng: -0.08, imgSrc: 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  ];

  const createCustomDivIcon = (imgSrc) => L.divIcon({
      className: 'custom-marker',
      html: `<div style="
      padding: 5px; 
      width: 40px; 
      height: 40px; 
      border-radius: 1rem; 
      background-color:rgb(255, 255, 255); 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      color: black;
      text-align: center;">
        <img src="${imgSrc}" style="width: 50px; height: 30px; border-radius: 0.5rem; margin-top: 2px;">
    </div>`,
      iconSize: [10, 10], // Width and height of the div
      iconAnchor: [15, 15] // Center the icon
    });

  return (
    <MapContainer center={position} zoom={1} scrollWheelZoom={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {coordinates.map(({ lat, lng, imgSrc }, index) => (
        <Marker
          key={index}
          position={[lat, lng]}
          icon={createCustomDivIcon(imgSrc)}
        />
      ))}
  </MapContainer>
  );
  
};

export default Map;
