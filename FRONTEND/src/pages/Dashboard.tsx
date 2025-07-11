import React from 'react';

const RICK_MORTY_PLAYLIST = "PLQl8zBB7bPvKcdJ-nODp2Yzw1sEVu6qvJ";
const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/videoseries?list=${RICK_MORTY_PLAYLIST}`;

const Dashboard: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
    <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard!</h2>
    <div className="w-full max-w-2xl aspect-video mb-6">
      <iframe
        width="100%"
        height="400"
        src={YOUTUBE_EMBED_URL}
        title="Rick & Morty Playlist"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
    <div className="text-gray-600">Enjoy some Rick & Morty while you manage your account!</div>
  </div>
);

export default Dashboard;
