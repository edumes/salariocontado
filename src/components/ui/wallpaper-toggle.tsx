"use client"

import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { useState } from "react"

export const wallpapers = [
  {
    name: "Mountain Lake",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Forest Path",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Ocean Waves",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Desert Sunset",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Aurora Borealis",
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "City Lights",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Cherry Blossoms",
    url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Starry Night",
    url: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Autumn Colors",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Tropical Beach",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Lavender Fields",
    url: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Northern Lights",
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Sunset Over Mountains",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Foggy Forest",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=center"
  },
  {
    name: "Crystal Clear Lake",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center"
  }
]

interface WallpaperToggleProps {
  onWallpaperChange: (wallpaper: string, name: string) => void
}

export function WallpaperToggle({ onWallpaperChange }: WallpaperToggleProps) {
  const [currentWallpaper, setCurrentWallpaper] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('current-wallpaper')
    }
    return null
  })

  const changeWallpaper = () => {
    const randomWallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)]
    setCurrentWallpaper(randomWallpaper.url)
    onWallpaperChange(randomWallpaper.url, randomWallpaper.name)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('current-wallpaper', randomWallpaper.url)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={changeWallpaper}
      className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
    >
      <ImageIcon className="w-4 h-4 mr-2" />
      Trocar Wallpaper
    </Button>
  )
}
