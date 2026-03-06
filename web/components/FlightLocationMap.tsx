'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons broken by webpack bundling
const DEFAULT_ICON = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER: [number, number] = [39.7392, -104.9903]; // Denver
const DEFAULT_ZOOM = 10;

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapCenterUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

type Props = {
  lat: number | null;
  lng: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
};

export default function FlightLocationMap({ lat, lng, onLocationSelect }: Props) {
  const hasPosition = lat !== null && lng !== null;
  const center: [number, number] = hasPosition ? [lat as number, lng as number] : DEFAULT_CENTER;
  const position: [number, number] | null = hasPosition ? [lat as number, lng as number] : null;

  return (
    <div className="rounded-lg overflow-hidden border border-slate-200 mb-4">
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        style={{ height: '288px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {position && <Marker position={position} icon={DEFAULT_ICON} />}
        {position && <MapCenterUpdater lat={position[0]} lng={position[1]} />}
      </MapContainer>
      <p className="text-xs text-slate-500 px-3 py-2 bg-white border-t border-slate-200">
        Click anywhere on the map to set your flight location.
      </p>
    </div>
  );
}
