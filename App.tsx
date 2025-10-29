import React, { useState, useEffect } from 'react';
import { InstagramIcon } from './components/InstagramIcon';
import { MatrixRain } from './components/MatrixRain';
import { InteractiveText } from './components/InteractiveText';
import { CursorParticles } from './components/CursorParticles';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Konami code easter egg state
  const [konamiCode, setKonamiCode] = useState<string[]>([]);
  const [konamiActive, setKonamiActive] = useState(false);
  const KONAMI_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  // RJ click easter egg state
  const [rjClickCount, setRjClickCount] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newKeys = [...konamiCode, e.key];
      const relevantKeys = newKeys.slice(-KONAMI_SEQUENCE.length);

      if (JSON.stringify(relevantKeys) === JSON.stringify(KONAMI_SEQUENCE)) {
        setKonamiActive(true);
        setTimeout(() => setKonamiActive(false), 7000); // Effect lasts 7 seconds
        setKonamiCode([]);
      } else {
        setKonamiCode(relevantKeys);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [konamiCode]);

  const handleRjClick = () => {
    const newCount = rjClickCount + 1;
    if (newCount >= 7) {
      setIsFlashing(true);
      setTimeout(() => {
        setIsFlashing(false);
        setRjClickCount(0);
      }, 300); // Flash for 300ms
    } else {
      setRjClickCount(newCount);
    }
  };

  return (
    <div
      className={`relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-black text-neutral-200 antialiased transition-filter duration-300 ${isFlashing ? 'filter invert' : ''}`}
    >
      <CursorParticles />
      {konamiActive && <MatrixRain />}
      
      <header className="absolute top-0 left-0 p-8 md:p-12 z-20">
        <h2 
          className={`text-2xl font-light tracking-widest text-neutral-400 transition-all duration-700 ease-out hover:scale-110 hover:rotate-[-15deg] cursor-pointer delay-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onClick={handleRjClick}
          title="What happens if you click me 7 times?"
          aria-label="RJ Logo"
        >
          RJ
        </h2>
      </header>

      <main className="z-10 flex flex-col items-center text-center p-4">
        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-thin text-neutral-100 transition-all duration-700 ease-out delay-500 ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          Rustam Jabioghlu
        </h1>
        <div className={`my-6 h-px w-32 bg-neutral-700 transition-transform duration-700 ease-out origin-center delay-700 ${isLoading ? 'scale-x-0' : 'scale-x-100'}`}></div>
        <p className={`text-lg md:text-xl font-light uppercase tracking-widest text-neutral-400 transition-all duration-700 ease-out delay-[900ms] cursor-pointer ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <InteractiveText>Coming Soon</InteractiveText>
        </p>
      </main>

      <footer className="absolute bottom-0 w-full p-6 text-center md:p-8 z-10">
        <div className={`mb-6 flex flex-col items-center space-y-4 transition-opacity duration-700 ease-out delay-[1100ms] ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <a
            href="mailto:rjabioglu@gmail.com"
            className="rounded-full border border-neutral-500 px-6 py-2 text-sm font-light text-neutral-300 uppercase tracking-widest transition-all duration-300 hover:border-neutral-300 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Contact Me
          </a>
          <a
            href="https://www.instagram.com/rxstem"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-neutral-400 transition-colors duration-300 hover:text-white"
          >
            <InstagramIcon className="h-6 w-6" />
          </a>
        </div>
        <div className={`font-light text-xs text-neutral-600 transition-opacity duration-700 ease-out delay-[1200ms] ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <p>Made with <span role="img" aria-label="heart">♥</span> by R-Jay</p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()}. All Rights Reserved.
          </p>
        </div>
      </footer>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"></div>
    </div>
  );
};

export default App;
