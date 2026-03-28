import React, { useState, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, PresentationControls, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Cake, X, ShoppingBag, MousePointer2, ArrowLeft, Sun, Moon, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

import CameraController from './components/CameraController';
import EspressoMachine from './components/EspressoMachine';
import PastryCase from './components/PastryCase';
import FloatingIcons from './components/FloatingIcons';
import CoffeeBeans from './components/CoffeeBeans';
import PictureFrame from './components/PictureFrame';

// --- Types & Constants ---
type ViewType = 'shop' | 'espresso' | 'pastry';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const DRINKS: MenuItem[] = [
  { 
    id: 'd1',
    name: 'Espresso', 
    price: 3.50, 
    description: 'Rich, bold, and intense double shot.',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=400&h=400&auto=format&fit=crop'
  },
  { 
    id: 'd2',
    name: 'Cappuccino', 
    price: 4.75, 
    description: 'Equal parts espresso, steamed milk, and foam.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=400&h=400&auto=format&fit=crop'
  },
  { 
    id: 'd3',
    name: 'Oat Milk Latte', 
    price: 5.25, 
    description: 'Smooth espresso with creamy oat milk.',
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400&h=400&auto=format&fit=crop'
  },
  { 
    id: 'd4',
    name: 'Cold Brew', 
    price: 4.50, 
    description: 'Slow-steeped for 18 hours for a smooth finish.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=400&h=400&auto=format&fit=crop'
  },
  { 
    id: 'd5',
    name: 'Matcha Latte', 
    price: 5.50, 
    description: 'Premium ceremonial grade matcha with milk.',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=400&h=400&auto=format&fit=crop'
  },
];

const PASTRIES: MenuItem[] = [
  { 
    id: 'p1',
    name: 'Butter Croissant', 
    price: 3.95, 
    description: 'Flaky, buttery, and golden brown.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&h=400&auto=format&fit=crop'
  },
  { 
    id: 'p2',
    name: 'Pain au Chocolat', 
    price: 4.50, 
    description: 'Traditional French pastry with dark chocolate.',
    image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=400&h=400&auto=format&fit=crop'
  },
  { 
    id: 'p3',
    name: 'Almond Danish', 
    price: 4.25, 
    description: 'Sweet pastry filled with almond cream.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&h=400&auto=format&fit=crop'
  },
  { 
    id: 'p4',
    name: 'Blueberry Muffin', 
    price: 3.75, 
    description: 'Bursting with fresh berries and a crumble top.',
    image: 'https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?q=80&w=400&h=400&auto=format&fit=crop'
  },
  { 
    id: 'p5',
    name: 'Lemon Tart', 
    price: 5.95, 
    description: 'Zesty lemon curd in a shortcrust pastry.',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=400&h=400&auto=format&fit=crop'
  },
];

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('shop');
  const [isNight, setIsNight] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const resetView = () => setActiveView('shop');

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to order`, {
      description: 'Your item is waiting in the bag.',
      icon: <CheckCircle2 className="text-green-500" size={18} />,
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const bgColor = isNight ? '#0a0807' : '#1a1412';
  const ambientIntensity = isNight ? 0.2 : 0.5;
  const spotIntensity = isNight ? 2 : 1;

  return (
    <div 
      className="relative w-full h-screen overflow-hidden font-sans text-[#fdf8f5] transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      <Toaster position="top-center" theme={isNight ? 'dark' : 'light'} richColors />
      
      {/* Background Design Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-30 blur-[120px] transition-all duration-1000"
          style={{ 
            background: isNight 
              ? 'radial-gradient(circle, rgba(212,163,115,0.1) 0%, rgba(10,8,7,0) 70%)' 
              : 'radial-gradient(circle, rgba(212,163,115,0.2) 0%, rgba(26,20,18,0) 70%)' 
          }}
        />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
        <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 2, 7], fov: 45 }}>
          <Suspense fallback={null}>
            <CameraController targetView={activeView} />
            
            <ambientLight intensity={ambientIntensity} />
            <spotLight 
              position={[10, 10, 10]} 
              angle={0.15} 
              penumbra={1} 
              intensity={spotIntensity} 
              castShadow 
              color={isNight ? '#ffaa44' : '#ffffff'}
            />
            
            <Environment preset={isNight ? "night" : "city"} />

            <PresentationControls
              global
              snap
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 6, Math.PI / 6]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
            >
              <group position={[0, -1, 0]}>
                <FloatingIcons />
                <CoffeeBeans count={50} />
                
                {/* Background Pictures */}
                <PictureFrame 
                  url="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&h=600&auto=format&fit=crop" 
                  title="Artisanal Roasts"
                  position={[-5, 2, -5]} 
                  rotation={[0, 0.5, 0]}
                  scale={[1.5, 1.5, 1]}
                />
                <PictureFrame 
                  url="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&h=600&auto=format&fit=crop" 
                  title="Morning Vibe"
                  position={[5, 2.5, -6]} 
                  rotation={[0, -0.4, 0]}
                  scale={[1.2, 1.2, 1]}
                />

                <EspressoMachine 
                  position={[-2, 0.5, 0]} 
                  onClick={() => setActiveView('espresso')} 
                  isNight={isNight}
                  isBrewing={activeView === 'espresso'}
                />
                <PastryCase 
                  position={[2, 0.5, 0]} 
                  onClick={() => setActiveView('pastry')} 
                  isNight={isNight}
                />
                
                <ContactShadows 
                  position={[0, -0.5, 0]} 
                  opacity={isNight ? 0.6 : 0.4} 
                  scale={10} 
                  blur={2} 
                  far={4.5} 
                />
              </group>
            </PresentationControls>

            <EffectComposer>
              <Bloom luminanceThreshold={1} mipmapBlur intensity={isNight ? 1.5 : 0.5} radius={0.4} />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
              {isNight && <Noise opacity={0.05} />}
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-12">
        {/* Header */}
        <header className="pointer-events-auto flex justify-between items-start">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-[#d4a373]" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-[#d4a373] font-bold">Est. 2026</span>
            </div>
            <h1 className="text-5xl font-serif italic text-[#e6d5c3] leading-tight">Brew & Beam</h1>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.15em] text-[#c4b1a0] font-medium mt-1">
              <span>Tokyo</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Paris</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>New York</span>
            </div>
          </motion.div>

          <div className="flex gap-4 items-center">
            <div className="hidden md:flex flex-col items-end mr-4 opacity-60">
              <span className="text-[10px] uppercase tracking-widest text-white/60">Current Vibe</span>
              <span className="text-xs font-serif italic text-[#e6d5c3]">{isNight ? 'Midnight Jazz' : 'Golden Hour'}</span>
            </div>
            <button 
              onClick={() => setIsNight(!isNight)}
              className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[#e6d5c3] hover:bg-white/10 transition-all flex items-center justify-center"
            >
              {isNight ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-px h-10 bg-white/10 mx-2 hidden md:block" />
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[#e6d5c3] hover:bg-white/10 transition-all relative pointer-events-auto"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4a373] text-[#2c1e1a] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Footer Instructions */}
        <footer className="pointer-events-auto flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-3"
          >
            <MousePointer2 className="text-[#d4a373] animate-bounce" size={18} />
            <p className="text-sm font-medium text-[#e6d5c3]">
              {activeView === 'shop' ? 'Drag to rotate • Click objects to fly in' : 'Explore the menu below'}
            </p>
          </motion.div>
        </footer>
      </div>

      {/* Menu Panels */}
      <AnimatePresence>
        {activeView !== 'shop' && (
          <div className="absolute inset-0 z-50 flex items-center justify-end p-4 md:p-12 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="pointer-events-auto relative w-full max-w-md h-full max-h-[80vh] bg-[#2c1e1a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 flex flex-col"
            >
              {/* Close Button */}
              <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
                <button 
                  onClick={resetView}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-[10px] uppercase tracking-widest text-white/60 hover:text-white border border-white/5"
                >
                  <ArrowLeft size={14} />
                  Back to Shop
                </button>
                <button 
                  onClick={resetView}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white border border-white/5"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 md:p-10 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 bg-[#d4a373]/10 rounded-full flex items-center justify-center text-[#d4a373] border border-[#d4a373]/20">
                    {activeView === 'espresso' ? <Coffee size={24} /> : <Cake size={24} />}
                  </div>
                  <div>
                    <h2 className="text-4xl font-serif italic text-[#e6d5c3]">
                      {activeView === 'espresso' ? 'The Brew List' : 'The Pastry Case'}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#c4b1a0]">Handcrafted Daily</span>
                      <span className="w-1 h-1 rounded-full bg-[#d4a373]/40" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#c4b1a0]">Fresh Ingredients</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {(activeView === 'espresso' ? DRINKS : PASTRIES).map((item, idx) => (
                    <motion.div 
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group flex gap-4 items-center p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-[#fdf8f5]">{item.name}</h3>
                          <span className="text-[#d4a373] font-mono font-bold ml-auto">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-[#a8907e] mt-1 line-clamp-2">{item.description}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4a373] hover:text-[#e6d5c3] transition-colors"
                        >
                          <Plus size={14} />
                          Add to Order
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-black/20 border-t border-white/5">
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="w-full py-4 bg-[#d4a373] hover:bg-[#c39262] text-[#2c1e1a] font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <ShoppingBag size={20} />
                  View Order Bag
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 z-[70] w-full max-w-md h-full bg-[#1a1412] border-l border-white/10 flex flex-col shadow-2xl"
            >
              <div className="p-8 flex justify-between items-center border-bottom border-white/5">
                <h2 className="text-2xl font-serif italic text-[#e6d5c3]">Your Order</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <ShoppingBag size={48} />
                    <p className="text-lg">Your bag is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-[#d4a373] font-bold uppercase tracking-widest text-xs"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 rounded-xl object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-[#fdf8f5]">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-white/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-[#a8907e]">${item.price.toFixed(2)}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 px-2 hover:bg-white/5 text-white/60"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2 text-sm font-mono">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 px-2 hover:bg-white/5 text-white/60"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="ml-auto font-mono text-sm text-[#d4a373]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-black/20 border-t border-white/10 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-[#a8907e]">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#a8907e]">
                      <span>Tax (8%)</span>
                      <span>${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-serif italic text-[#e6d5c3] pt-2 border-t border-white/5">
                      <span>Total</span>
                      <span>${(cartTotal * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      toast.success('Order Placed!', {
                        description: 'Your coffee is being prepared by our 3D baristas.',
                      });
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-4 bg-[#d4a373] hover:bg-[#c39262] text-[#2c1e1a] font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    Checkout Now
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400;1,500;1,600;1,700&family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
          --font-serif: 'Cormorant Garamond', serif;
          --font-sans: 'Inter', sans-serif;
        }

        body {
          font-family: var(--font-sans);
        }

        h1, h2, .font-serif {
          font-family: var(--font-serif);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
