'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

type Country = {
  name: { common: string };
  capital?: string[];
  flags: { png: string };
  region: string;
};

export default function Home() {
  const { data: session } = useSession();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const fetchRandomCountry = async () => {
    setLoading(true);
    const res = await fetch('https://restcountries.com/v3.1/all');
    const data: Country[] = await res.json();
    const random = data[Math.floor(Math.random() * data.length)];
    setCountry(random);
    setLoading(false);
  };

  const saveTrip = async () => {
    if (!country) return;

    const res = await fetch('/api/trips', {
      method: 'POST',
      body: JSON.stringify({
        name: country.name.common,
        capital: country.capital?.[0] || 'N/A',
        region: country.region,
        flag: country.flags.png,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 409) {
      setSaveMessage(`${country.name.common} is already in your favorites.`);
    } else if (res.ok) {
      setSaveMessage(`${country.name.common} added to favorites!`);
    } else {
      setSaveMessage(`Something went wrong.`);
    }

    setTimeout(() => setSaveMessage(null), 3000);
  };

  useEffect(() => {
    fetchRandomCountry();
  }, []);

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Trip Explorer</h1>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Sign in with Google
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="mb-4 flex justify-between w-full max-w-xl">
        <a href="/favorites" className="text-blue-600 hover:underline">
          View Favorites →
        </a>
        <button
          onClick={() => signOut()}
          className="text-red-600 hover:underline"
        >
          Sign out
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4">🌍 Trip Explorer</h1>

      <button
        onClick={fetchRandomCountry}
        disabled={loading}
        className={`mb-6 px-4 py-2 rounded-md transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? '🔄 Loading...' : '🎲 Get Random Trip Idea'}
      </button>

      {country && (
        <>
          <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Visit {country.name.common}
            </h2>
            <p className="mb-1">
              <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
            </p>
            <p className="mb-4">
              <strong>Region:</strong> {country.region}
            </p>
            <img
              src={country.flags.png}
              alt={`${country.name.common} flag`}
              className="mx-auto w-32 rounded"
            />
          </div>

          <button
            onClick={saveTrip}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            ⭐ Save to Favorites
          </button>
          {saveMessage && (
            <p className="mt-2 text-sm text-center text-blue-700">
              {saveMessage}
            </p>
          )}
        </>
      )}
    </main>
  );
}
