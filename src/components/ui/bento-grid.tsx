import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import { DrawLineText } from '../gsap/draw-line-text';
import { MagicCard } from './magic-card';
import { AnimatedTooltip } from './animated-tooltip';
import { Button } from './button';
import SpotifyNowPlayingCard from './spotify-now-playing-card';

interface BentoGridProps {

}

export const BentoGrid: React.FC<BentoGridProps> = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {/* Profile Card */}
            <MagicCard className="row-span-1 col-span-1 sm:col-span-2 lg:col-span-3">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        {/* <Image
                            src="/images/profile.jpeg"
                            alt="Eduardo Santarosa"
                            decoding='async'
                            width={500}
                            height={500}
                            className="w-12 h-12 rounded-full"
                        /> */}
                        <AnimatedTooltip item={{
                            id: 1,
                            name: "aaa",
                            designation: "aaa",
                            image: "/images/profile.jpeg"
                        }} />
                        <div>
                            <DrawLineText
                                className="text-lg"
                                oneByOne={false}
                                fontSize={24}
                                strokeWidth={1.5}
                                text="Eduardo Santarosa"
                                color="var(--color-foreground)"
                            />
                            <CardDescription>Software Developer</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-relaxed text-left">
                        Olá! Sou Eduardo Santarosa, desenvolvedor de software apaixonado por tecnologia e inovação. Busco criar soluções criativas e funcionais, sempre aprendendo e evoluindo para entregar experiências digitais únicas e de qualidade.
                    </p>
                </CardContent>
            </MagicCard>

            {/* Map Card */}
            <MagicCard className="row-span-1 col-span-1">
                <CardHeader>
                    <CardTitle>São Paulo</CardTitle>
                </CardHeader>
                <CardContent className="overflow-hidden p-0">
                    {/* <Image
                        src="https://maps.googleapis.com/maps/api/staticmap?center=Sao+Paulo&zoom=12&size=600x300"
                        alt="Mapa de São Paulo"
                        className="w-full h-full object-cover"
                    /> */}
                </CardContent>
            </MagicCard>

            {/* Journey Card */}
            <MagicCard className="row-span-1 col-span-1">
                <CardHeader>
                    <CardTitle>Minha Jornada</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">
                        Minha jornada na programação começou na ETEC, onde descobri o poder de transformar ideias em código. Desde então...
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                        <Button variant="outline" size="sm">Ler mais</Button>
                        <span className="text-xs text-muted-foreground">Jun 2025</span>
                    </div>
                </CardContent>
            </MagicCard>

            {/* GitHub Heatmap */}
            <MagicCard className="row-span-1 col-span-1 sm:col-span-2">
                <CardHeader>
                    <CardTitle>GitHub</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Placeholder: you can integrate react-github-calendar or custom heatmap */}
                    <div className="h-24 bg-gradient-to-r from-green700 to-green-500 rounded"></div>
                    <div className="mt-2 flex justify-between text-xs">
                        <span>menos</span>
                        <span>mais</span>
                    </div>
                </CardContent>
            </MagicCard>

            {/* Spotify Now Playing */}
            <SpotifyNowPlayingCard />

            {/* LinkedIn Card */}
            <MagicCard className="row-span-1 col-span-1">
                <CardContent className="flex items-center justify-center">
                    {/* <Image src="/path/to/linkedin-icon.svg" alt="LinkedIn" className="w-8 h-8" /> */}
                </CardContent>
            </MagicCard>

            {/* Contact CTA */}
            <MagicCard className="row-span-1 col-span-1 sm:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Tem um projeto interessante em mente? 👋</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">
                        Tem um projeto em mente? Precisa tirar uma ideia do papel ou quer trocar uma ideia sobre tecnologia? Vamos conversar!
                    </p>
                    <div className="mt-4">
                        <Button>Contate-me</Button>
                    </div>
                </CardContent>
            </MagicCard>
        </div>
    );
};

export default BentoGrid;