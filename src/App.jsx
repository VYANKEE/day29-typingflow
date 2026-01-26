import React, { useState, useEffect, useRef } from 'react';

const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
  "Design is not just what it looks like and feels like. Design is how it works.",
  "Stay hungry, stay foolish. Never let the noise of others' opinions drown out your own inner voice.",
  "Simplicity is the ultimate sophistication."
];

// --- COMPONENT: ANIMATED SCROLL REVEAL ---
const Reveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.17, 0.55, 0.55, 1) transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [state, setState] = useState({
    quote: QUOTES[0],
    input: "",
    startTime: null,
    wpm: 0,
    isFocus: false,
    isCompleted: false,
    shakeError: false
  });

  // --- LOGIC ENGINE ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!state.isFocus || state.isCompleted) return;
      
      const { quote, input, startTime } = state;

      // Disable Backspace (Hard Mode)
      if (e.key === 'Backspace') return; 

      // Prevent Scroll
      if(e.code === 'Space') e.preventDefault();

      // Start Timer
      if (!startTime && input.length === 0) {
        setState(prev => ({ ...prev, startTime: Date.now() }));
      }

      // Typing Handler
      if (e.key.length === 1 && input.length < quote.length) {
        const expectedChar = quote[input.length];
        
        if (e.key === expectedChar) {
          // CORRECT
          setState(prev => {
            const nextInput = prev.input + e.key;
            // Check Win
            if(nextInput.length === quote.length) {
               return { ...prev, input: nextInput, isCompleted: true };
            }
            return { ...prev, input: nextInput };
          });
        } else {
          // WRONG -> Shake Screen
          setState(prev => ({ ...prev, shakeError: true }));
          setTimeout(() => setState(prev => ({ ...prev, shakeError: false })), 300);
        }
      }
    };

    // WPM Timer
    const timer = setInterval(() => {
      if (state.startTime && !state.isCompleted) {
        const timeMin = (Date.now() - state.startTime) / 60000;
        const wpm = Math.round((state.input.length / 5) / timeMin);
        setState(prev => ({ ...prev, wpm: wpm || 0 }));
      }
    }, 500);

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(timer);
    };
  }, [state]);

  // Next Level Reset
  const nextLevel = () => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setState({
      quote: randomQuote,
      input: "",
      startTime: null,
      wpm: 0,
      isFocus: true,
      isCompleted: false,
      shakeError: false
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* --- DYNAMIC BACKGROUND (Aurora Effect) --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/30 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/30 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-pink-600/20 rounded-full blur-[150px] animate-blob animation-delay-4000 mix-blend-screen"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="h-screen flex flex-col items-center justify-center relative z-10 px-4">
        <Reveal>
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] text-center leading-none mb-6">
            TYPE<br/><span className="text-white">STORM</span>
          </h1>
        </Reveal>
        
        <Reveal delay={200}>
          <p className="text-xl md:text-2xl text-cyan-200/60 font-mono tracking-widest uppercase mb-12 text-center">
            Zero Latency • Hard Mode • Visual Bliss
          </p>
        </Reveal>

        <Reveal delay={400}>
          <button 
            onClick={() => {
              document.getElementById('arena').scrollIntoView({ behavior: 'smooth' });
              setState(prev => ({ ...prev, isFocus: true }));
            }}
            className="group relative px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full overflow-hidden hover:border-cyan-400 transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative font-bold text-lg tracking-widest group-hover:text-cyan-100">ENTER THE STORM</span>
          </button>
        </Reveal>
      </section>

      {/* --- TYPING ARENA --- */}
      <section 
        id="arena" 
        className="min-h-screen flex items-center justify-center py-20 relative z-10"
        onClick={() => setState(prev => ({ ...prev, isFocus: true }))}
      >
        <Reveal>
          <div className={`w-full max-w-6xl px-4 transition-all duration-700 ${state.isFocus ? 'opacity-100 scale-100' : 'opacity-50 scale-95 blur-sm'}`}>
            
            {/* Stats Header */}
            <div className="flex justify-between items-end mb-8 px-4">
               <div className="text-sm font-mono text-cyan-500/80 tracking-[0.2em] uppercase">
                 {state.isCompleted ? "SESSION COMPLETE" : "Current Session"}
               </div>
               <div className="text-6xl font-black font-mono text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                 {state.wpm}<span className="text-2xl text-gray-500 ml-2">WPM</span>
               </div>
            </div>

            {/* MAIN CARD (Glassmorphism) */}
            <div className={`
              relative bg-black/40 backdrop-blur-2xl rounded-[3rem] p-12 md:p-20 border border-white/10 shadow-2xl overflow-hidden
              ${state.shakeError ? 'animate-shake border-red-500/50 shadow-red-500/20' : 'hover:border-cyan-500/30'}
              transition-all duration-200
            `}>
              
              {/* Focus Overlay */}
              {!state.isFocus && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer group">
                  <div className="text-2xl font-bold tracking-widest text-white group-hover:scale-110 transition-transform">CLICK TO RESUME</div>
                </div>
              )}

              {/* TEXT ENGINE */}
              <div className="font-mono text-3xl md:text-5xl leading-relaxed tracking-wide text-gray-700 select-none break-words">
                {state.quote.split('').map((char, index) => {
                  const isTyped = index < state.input.length;
                  const isActive = index === state.input.length;
                  
                  // Styles
                  let className = "transition-all duration-150 ";
                  
                  if (isTyped) {
                    // Typed Correctly (Glowing White)
                    className += "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"; 
                  } else if (isActive && state.isFocus) {
                    // Active Cursor Character (Cyberpunk Block)
                    className += "bg-cyan-500 text-black shadow-[0_0_20px_#06b6d4] rounded-md px-1 animate-pulse";
                  } else {
                    // Untyped (Dimmed)
                    className += "text-gray-700";
                  }

                  return (
                    <span key={index} className={className}>
                      {char}
                    </span>
                  );
                })}
              </div>

            </div>

            {/* Controls */}
            <div className="mt-12 text-center">
              <button 
                onClick={nextLevel}
                className="text-gray-500 hover:text-white font-mono text-sm uppercase tracking-widest border-b border-transparent hover:border-white transition-all pb-1"
              >
                {state.isCompleted ? "[ NEXT CHALLENGE ]" : "[ RESTART ]"}
              </button>
            </div>

          </div>
        </Reveal>
      </section>

      {/* --- SCROLL REVEAL FEATURES --- */}
      <section className="py-40 relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
           {[
             { title: "Neuro Flow", desc: "Designed to induce pure focus state through rhythm." },
             { title: "Hardcore", desc: "No Backspace. Accuracy is the only metric that matters." },
             { title: "Zen UI", desc: "Dynamic glassmorphism that breathes with your typing." }
           ].map((item, i) => (
             <Reveal key={i} delay={i * 150}>
               <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-500 group">
                 <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-cyan-400">{item.title}</h3>
                 <p className="text-gray-400 leading-relaxed">{item.desc}</p>
               </div>
             </Reveal>
           ))}
        </div>
      </section>

    </div>
  );
}