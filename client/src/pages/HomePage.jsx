import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-600/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />

            {/* Main Content */}
            <div className="relative z-10 text-center max-w-2xl">
                {/* Logo / Title */}
                <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-primary-300 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
                        Jeu de société multijoueur
                    </span>
                </div>

                <h1 className="font-display text-5xl sm:text-7xl font-extrabold mb-4 leading-tight">
                    <span className="bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
                        Découvre
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                        ta Voie
                    </span>
                </h1>

                <p className="text-lg text-white/60 mb-12 max-w-lg mx-auto leading-relaxed">
                    Choisis ton diplôme, affronte les aléas de la vie professionnelle
                    et construis ta stabilité. 2 à 8 joueurs.
                </p>

                {/* Mode Selection Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/local"
                        className="group relative px-10 py-5 rounded-2xl font-display font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-700 group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: 'inset 0 0 30px rgba(129,140,248,0.3)' }} />
                        <div className="relative flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Mode Local</span>
                        </div>
                        <span className="relative block text-sm font-normal text-white/70 mt-1">
                            Sur le même appareil
                        </span>
                    </Link>

                    <Link
                        to="/online"
                        className="group relative px-10 py-5 rounded-2xl font-display font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-600 to-accent-700 group-hover:from-accent-500 group-hover:to-accent-600 transition-all duration-300" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: 'inset 0 0 30px rgba(232,121,249,0.3)' }} />
                        <div className="relative flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span>Mode En Ligne</span>
                        </div>
                        <span className="relative block text-sm font-normal text-white/70 mt-1">
                            Avec un code de salon
                        </span>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 text-center text-white/30 text-sm">
                Découvre ta Voie © 2026
            </div>
        </div>
    );
}
