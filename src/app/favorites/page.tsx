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
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

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
              className="relative w-full max-w-xl h-[450px] sm:h-64 perspective"
            >
              <div
                className={`transition-transform duration-700 transform-style-preserve-3d relative w-full h-full ${
                  flippedCard === trip._id ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Side */}
                <div className="absolute w-full h-full bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-start gap-4 backface-hidden">
                  <img
                    src={trip.flag}
                    alt={`${trip.name} flag`}
                    onClick={() =>
                      setFlippedCard(flippedCard === trip._id ? null : trip._id)
                    }
                    className="w-28 sm:w-32 rounded object-cover cursor-pointer"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">{trip.name}</h2>
                    <p>
                      <strong>Capital:</strong> {trip.capital}
                    </p>
                    <p className="mb-2">
                      <strong>Region:</strong> {trip.region}
                    </p>

                    <textarea
                      value={
                        editedNotes[trip._id] !== undefined
                          ? editedNotes[trip._id]
                          : trip.notes || ''
                      }
                      onChange={(e) =>
                        setEditedNotes((prev) => ({
                          ...prev,
                          [trip._id]: e.target.value,
                        }))
                      }
                      placeholder="Write your itinerary here..."
                      className="w-full p-2 border border-gray-300 rounded resize-y min-h-[80px]"
                    />

                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => updateNotes(trip._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        💾 Save Notes
                      </button>
                      <button
                        onClick={() => deleteTrip(trip._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        🗑 Remove
                      </button>
                    </div>
                    {saveStatus[trip._id] && (
                      <p className="text-green-600 mt-1">
                        {saveStatus[trip._id]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute w-full h-full bg-gray-100 rounded-lg shadow-md p-6 text-left transform rotate-y-180 backface-hidden overflow-y-auto">
                  <h3 className="text-xl font-bold mb-2">{trip.name} Notes</h3>
                  <p className="whitespace-pre-line">
                    {trip.notes || 'No notes yet.'}
                  </p>
                  <button
                    className="mt-4 text-blue-600 underline"
                    onClick={() => setFlippedCard(null)}
                  >
                    🔙 Back
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
