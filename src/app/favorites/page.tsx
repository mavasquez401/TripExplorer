'use client';
import { useEffect, useState } from 'react';

type Trip = {
  _id: string;
  name: string;
  capital: string;
  region: string;
  flag: string;
  notes?: string;
};

export default function FavoritesPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedNotes, setEditedNotes] = useState<{ [id: string]: string }>({});
  const [saveStatus, setSaveStatus] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const fetchTrips = async () => {
      const res = await fetch('/api/trips');
      const data = await res.json();
      setTrips(data);
      setLoading(false);
    };

    fetchTrips();
  }, []);

  const deleteTrip = async (id: string) => {
    await fetch('/api/trips', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    setTrips((prev) => prev.filter((trip) => trip._id !== id));
  };

  const updateNotes = async (id: string) => {
    await fetch('/api/trips/notes', {
      method: 'PUT',
      body: JSON.stringify({ id, notes: editedNotes[id] || '' }),
      headers: { 'Content-Type': 'application/json' },
    });

    setSaveStatus((prev) => ({ ...prev, [id]: '✅ Notes saved!' }));
    setTimeout(() => {
      setSaveStatus((prev) => ({ ...prev, [id]: '' }));
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">⭐ Favorite Trips</h1>
      {loading ? (
        <p className="text-center">Loading saved trips...</p>
      ) : trips.length === 0 ? (
        <p className="text-center">No trips saved yet!</p>
      ) : (
        <div className="grid gap-6 max-w-3xl mx-auto">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-white shadow rounded-lg p-4 text-center"
            >
              <h2 className="text-xl font-semibold">{trip.name}</h2>
              <p>
                <strong>Capital:</strong> {trip.capital}
              </p>
              <p>
                <strong>Region:</strong> {trip.region}
              </p>
              <img
                src={trip.flag}
                alt={`${trip.name} flag`}
                className="w-32 mx-auto mt-2 rounded"
              />

              <textarea
                value={editedNotes[trip._id] ?? trip.notes ?? ''}
                onChange={(e) =>
                  setEditedNotes((prev) => ({
                    ...prev,
                    [trip._id]: e.target.value,
                  }))
                }
                placeholder="Write your itinerary here..."
                className="w-full mt-4 p-2 border border-gray-300 rounded resize-y min-h-[80px]"
              />

              <button
                onClick={() => updateNotes(trip._id)}
                className="mt-2 mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                💾 Save Notes
              </button>

              <button
                onClick={() => deleteTrip(trip._id)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                🗑 Remove
              </button>

              {saveStatus[trip._id] && (
                <p className="text-green-600 mt-2">{saveStatus[trip._id]}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
