import React from 'react';

// Assure-toi que les chemins sont bons
import badjaweLogo from '../assets/badjawe_logo.jpg';
import barryLogo from '../assets/logo_barry.png';

const initialSponsors = [
    { id: 1, name: "Brasserie Barry", img: badjaweLogo },
    { id: 2, name: "Badjawe", img: barryLogo },
];

const longSponsorsList = Array(10).fill(initialSponsors).flat();

const SponsorsBanner = () => {
    return (
        <div className="w-full bg-white overflow-hidden py-4 shrink-0 z-30 shadow-md">
            {/* Le conteneur doit être assez large pour contenir TOUS les éléments.
                w-max permet de ne pas être limité par la largeur de l'écran.
            */}
            <div className="flex w-max">

                {/* CONTENEUR ANIMÉ
                   Il contient 2 FOIS la liste complète.
                   L'animation déplace de 50%, donc exactement la largeur d'une liste.
                */}
                <div className="flex animate-scroll">

                    {/* GROUPE 1 (La liste complète) */}
                    <div className="flex gap-24 pr-24">
                        {longSponsorsList.map((sponsor, index) => (
                            <img
                                // Utiliser index dans la clé car les ID se répètent maintenant
                                key={`list1-${index}`}
                                src={sponsor.img}
                                alt={sponsor.name}
                                className="h-24 w-auto object-contain max-w-[240px] grayscale hover:grayscale-0 transition-all opacity-90"
                            />
                        ))}
                    </div>

                    {/* GROUPE 2 (La copie exacte pour l'illusion d'infini) */}
                    <div className="flex gap-24 pr-24">
                        {longSponsorsList.map((sponsor, index) => (
                            <img
                                key={`list2-${index}`}
                                src={sponsor.img}
                                alt={sponsor.name}
                                className="h-24 w-auto object-contain max-w-[240px] grayscale hover:grayscale-0 transition-all opacity-90"
                            />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SponsorsBanner;