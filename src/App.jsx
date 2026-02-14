import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Play, Pause, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const fireHearts = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 }, 
      shapes: ['heart'], colors: ['#FFD1DC', '#D47281', '#FFB7C5'], scalar: 3 });
  }, 250);
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [yesPressed, setYesPressed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef(null);

  const photos = ['/foto1.jpg', '/foto2.jpg', '/foto4.jpg', '/foto5.jpg', '/foto6.jpg'];

  useEffect(() => {
    const anniversary = new Date('2023-02-23T00:00:00');
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now - anniversary;
      setTimeTogether({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!yesPressed) {
      const interval = setInterval(() => {
        setCurrentPhoto((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [yesPressed, photos.length]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  const moveNoButton = () => {
    const x = Math.random() * (window.innerWidth - 100) - (window.innerWidth / 2);
    const y = Math.random() * (window.innerHeight - 100) - (window.innerHeight / 2);
    setNoButtonPos({ x, y });
  };

  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#4A4A4A] overflow-x-hidden relative">
      <audio ref={audioRef} src="/musica.mp3" loop />
      
      {loading ? (
        <div className="h-screen bg-[#FFD1DC] flex flex-col justify-center items-center font-serif">
          <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Heart size={80} className="text-[#D47281] fill-[#D47281]" />
          </motion.div>
          <p className="mt-6 text-[#D47281] text-2xl font-cursive italic">Preparando algo especial para Ari...</p>
        </div>
      ) : (
        <>
          {/* REPRODUCTOR */}
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-4 right-4 z-50 bg-white/70 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-pink-100 flex items-center gap-4">
            <img src="/portada.jpg" alt="Junior H" className="w-12 h-12 rounded-lg shadow-md object-cover" />
            <div className="pr-4">
              <p className="text-[10px] uppercase font-bold text-[#D47281]">Escuchando ahora</p>
              <p className="text-sm font-semibold truncate w-32">Yo Voy a Amarte</p>
            </div>
            <button onClick={() => { isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} className="bg-[#D47281] p-3 rounded-full text-white">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </motion.div>

          <main className="max-w-5xl mx-auto px-4 py-10 flex flex-col items-center">
            {/* CONTADOR */}
            {!yesPressed && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex gap-4 md:gap-8 bg-white/50 p-6 rounded-3xl border border-pink-100 shadow-sm backdrop-blur-sm">
                <div className="flex flex-col items-center"><span className="text-3xl font-bold text-[#D47281]">{timeTogether.days}</span><span className="text-[10px] uppercase tracking-widest">Días</span></div>
                <div className="flex flex-col items-center border-l border-pink-100 pl-4 md:pl-8"><span className="text-3xl font-bold text-[#D47281]">{timeTogether.hours}</span><span className="text-[10px] uppercase tracking-widest">Hrs</span></div>
                <div className="flex flex-col items-center border-l border-pink-100 pl-4 md:pl-8"><span className="text-3xl font-bold text-[#D47281]">{timeTogether.minutes}</span><span className="text-[10px] uppercase tracking-widest">Min</span></div>
                <div className="flex flex-col items-center border-l border-pink-100 pl-4 md:pl-8 text-[#D47281]"><span className="text-3xl font-bold">{timeTogether.seconds}</span><span className="text-[10px] uppercase tracking-widest text-[#4A4A4A]">Seg</span></div>
              </motion.div>
            )}

            {/* CARRUSEL */}
            {!yesPressed && (
              <div className="w-full mb-12 text-center">
                <h2 className="font-cursive text-5xl text-[#D47281] mb-8">Nuestros Momentos</h2>
                <div className="relative h-[400px] w-full max-w-lg mx-auto overflow-hidden rounded-3xl shadow-2xl border-8 border-white">
                  <AnimatePresence mode="wait">
                    <motion.img key={currentPhoto} src={photos[currentPhoto]} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 w-full h-full object-cover" />
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* PREGUNTA */}
            {!yesPressed ? (
              <motion.div className="text-center mt-10">
                <h1 className="font-cursive text-6xl md:text-8xl text-[#D47281] mb-4">Para Ariadna Lara...</h1>
                <p className="text-xl italic text-gray-400 mb-12">"Mi terroncito de azúcar, mi amor..."</p>
                <h2 className="font-cursive text-4xl md:text-6xl font-bold mb-20 px-4 text-[#4A4A4A]">¿Quieres ser mi 14 de Febrero?</h2>
                <div className="relative flex justify-center items-center gap-12 h-32">
                  <button onClick={() => { setYesPressed(true); fireHearts(); }} className="bg-[#D47281] text-white px-12 py-5 rounded-full text-2xl font-bold shadow-xl hover:scale-110 transition-all z-10">¡SÍ, ACEPTO! ❤️</button>
                  <motion.button animate={{ x: noButtonPos.x, y: noButtonPos.y }} onMouseEnter={moveNoButton} className="bg-white text-gray-400 px-8 py-4 rounded-full text-lg border border-gray-100 shadow-sm">No</motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                <h1 className="font-cursive text-8xl text-[#D47281] mb-10">¡Eres lo mejor que me ha pasado!</h1>
                <div className="max-w-2xl bg-white/80 p-10 rounded-[40px] shadow-inner border border-pink-50 mx-auto">
                  <p className="text-2xl leading-relaxed text-gray-700 font-light italic">"Un simple te amo no es suficiente para expresar todo lo que siento por ti. Aprecio que estés conmigo a pesar de todo, agradezco que siempre me saques una sonrisa con tus mensajes, fotos o tik toks. 
                    Mi vida es tan linda porque tú formas parte de ella, nunca habrá alguien que me haga sentir exactamente como tú lo haces. Te amo mi terroncito de azúcar ❤️"</p>
                </div>
              </motion.div>
            )}
          </main>
        </>
      )}
    </div>
  );
}