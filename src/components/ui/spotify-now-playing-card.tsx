import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { MagicCard } from '../magicui/magic-card';
import { Button } from './button';
import { CardContent, CardDescription, CardTitle } from './card';

interface SpotifyNowPlaying {
  is_playing: boolean;
  item: {
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
    };
    external_urls: { spotify: string };
  };
}

const SPOTIFY_ACCESS_TOKEN = process.env.SPOTIFY_ACCESS_TOKEN;

export const SpotifyNowPlayingCard: React.FC = () => {
  const [data, setData] = useState<SpotifyNowPlaying | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!SPOTIFY_ACCESS_TOKEN) return;
    setLoading(true);
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Erro ao buscar dados do Spotify');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MagicCard className="row-span-1 col-span-1">
      <CardContent className="p-0 overflow-hidden relative min-h-40">
        {loading && (
          <div className="flex items-center justify-center h-40">Carregando...</div>
        )}
        {error && (
          <div className="flex items-center justify-center h-40 text-red-500">{error}</div>
        )}
        {!loading && !error && data && data.is_playing ? (
          <>
            <Image
              src={data.item.album.images[0]?.url}
              alt="Album Art"
              className="w-full h-full object-cover opacity-80 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 p-4 flex flex-col justify-end">
              <span className="text-xs uppercase text-green-400">Tocando agora</span>
              <CardTitle className="text-white">{data.item.name}</CardTitle>
              <CardDescription className="text-white/80">
                {data.item.artists.map((a) => a.name).join(', ')}
              </CardDescription>
              <Button
                asChild
                variant="default"
                className="mt-2"
              >
                <a href={data.item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  Abrir no Spotify
                </a>
              </Button>
            </div>
          </>
        ) : (
          !loading && !error && (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              Nada tocando no momento
            </div>
          )
        )}
      </CardContent>
    </MagicCard>
  );
};

export default SpotifyNowPlayingCard; 