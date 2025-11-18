'use client'; 

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;


const STYLES = [
  { name: 'Corporate Power', promptId: 0, description: 'CEO, Billionaire, Executive Portraits (12 Variants)' },
  { name: 'High Fashion', promptId: 1, description: 'Runway, Avant-garde, Editorial, Street Style (12 Variants)' },
  { name: 'Fantasy & Mythic', promptId: 2, description: 'Knight, Mage, Viking, Samurai, God/Goddess (12 Variants)' },
  { name: 'Sci-Fi Future', promptId: 3, description: 'Cyberpunk, Astronaut, Dystopian Scavenger, Android (12 Variants)' },
  { name: 'Art & Animation', promptId: 4, description: 'Pixar, Anime, Disney, Ghibli, Pop Art Styles (12 Variants)' },
  { name: 'Vintage & Timeless', promptId: 5, description: '1920s, 1950s, 1990s Supermodel, Victorian Era (12 Variants)' },
];


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'generating' | 'done' | 'error'>('idle');
  const [results, setResults] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [appDb, setAppDb] = useState<any>(null); 
  const [appAuth, setAppAuth] = useState<any>(null); 
  const [appId, setAppId] = useState<string>('default-app-id'); 

  const processedCount = '15K+'; 
  const userId = user?.uid || 'guest-user';
  
  useEffect(() => {
    let currentDb: any = null;
    let currentAuth: any = null;
    let currentAppId: string = 'default-app-id';

    try {
        currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = JSON.parse(__firebase_config);
        const app = initializeApp(firebaseConfig);
        currentDb = getFirestore(app);
        currentAuth = getAuth(app);
        setAppDb(currentDb);
        setAppAuth(currentAuth);
        setAppId(currentAppId);
    } catch (e) {
        console.error("Firebase Initialization Error:", e);
        return; 
    }
    
    const authenticate = async () => {
        try {
            if (typeof __initial_auth_token !== 'undefined') {
                await signInWithCustomToken(currentAuth, __initial_auth_token);
            } else {
                await signInAnonymously(currentAuth);
            }
        } catch (error) {
            console.error("Firebase Sign-In Error:", error);
        }
    };
    
    authenticate();
    
    const unsubscribe = onAuthStateChanged(currentAuth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            console.log("Authenticated User ID:", currentUser.uid);
        }
    });

    return () => unsubscribe(); 
  }, []); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setResults([]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || selectedStyle === null) return;

    setStatus('uploading');

    try {
        const imageBase64 = await fileToBase64(file);

        setStatus('generating');

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64, styleIndex: selectedStyle }), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Generation Failed.');
        }

        const data = await response.json();
        
        if (data.urls && data.urls.length > 0) {
            setResults(data.urls);
            setStatus('done');
            
            if (appDb && user) {
                const docRef = doc(appDb, `artifacts/${appId}/users/${userId}/portfolios`, Date.now().toString());
                await setDoc(docRef, {
                    urls: data.urls,
                    style: STYLES[selectedStyle].name,
                    timestamp: new Date().toISOString(),
                });
                console.log("Portfolio saved to Firestore.");
            }

        } else {
            throw new Error('AI returned no images.');
        }

    } catch (error) {
        console.error(error);
        setStatus('error');
    }
  };

  return (
    <main className="min-h-screen p-4 flex flex-col items-center justify-center bg-[#0d0d0d] text-white font-sans selection:bg-purple-500/30">
      
      {/* HEADER */}
      <div className="text-center mb-10 space-y-4">
        <div className="inline-block px-3 py-1 border border-gray-800 rounded-full bg-gray-900/50 backdrop-blur-sm">
            <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">
            {processedCount} Portraits Generated • User ID: {userId}
            </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
          KASTO.AI
        </h1>
        <p className="text-2xl font-light text-gray-400 max-w-2xl mx-auto tracking-tight">
          The World's Most Advanced Identity Engine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-5xl">
        
        {/* Adım 1: Stil Seçimi */}
        {status === 'idle' && (
          <div className="mb-8 p-6 bg-[#111] rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-gray-300">1. Select Your Signature Concept (12 Exclusive Portraits per Collection)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {STYLES.map((style, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedStyle(index)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    selectedStyle === index ? 'border-purple-500 bg-purple-900/30 shadow-lg' : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <p className="font-bold text-base mb-1">{style.name}</p>
                  <p className="text-xs text-gray-400">{style.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adım 2: Yükleme ve İşlem */}
        <div className="w-full max-w-xl mx-auto bg-[#111] p-1 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden relative group">
            
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="bg-[#0a0a0a] rounded-[20px] p-8 relative z-10">
                
                {/* Hata Mesajı */}
                {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-400 text-sm font-medium">
                    Generation failed. Please upload a clear, front-facing portrait.
                    </div>
                )}
                
                {/* Dosya Yükleme Alanı */}
                {(status === 'idle' || status === 'error' ) && (
                <>
                    <label htmlFor="file-upload" className="block w-full aspect-video border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center group/upload">
                    <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center group-hover/upload:bg-gray-700 transition">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    </div>
                    <span className="text-base text-gray-300 font-medium mb-2">Upload Source Portrait</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">High-Res JPG/PNG Only</span>
                    <input 
                        id="file-upload" 
                        type="file" 
                        accept="image/jpeg,image/png" 
                        onChange={handleFileChange} 
                        className="hidden" 
                    />
                    </label>
                    
                    {file && (
                    <div className="mt-4 flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800">
                        <span className="text-sm text-gray-300 truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-green-500 font-bold tracking-wider">READY</span>
                    </div>
                    )}
                </>
                )}
                
                {/* Yükleme Animasyonu */}
                {(status === 'uploading' || status === 'generating') && (
                <div className="py-12 text-center">
                    <div className="w-full max-w-[200px] h-1 bg-gray-800 rounded-full mx-auto overflow-hidden mb-6">
                        <div className="h-full bg-white animate-[loading_1.5s_ease-in-out_infinite]"></div>
                    </div>
                    <p className="text-lg font-medium text-white mb-2 animate-pulse">
                    {status === 'uploading' ? 'Encrypting & Uploading...' : `Synthesizing 12 ${STYLES[selectedStyle || 0]?.name} Portraits...`}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">
                    {status === 'uploading' ? 'Secure Handshake Protocol' : 'Neural Network Active'}
                    </p>
                </div>
                )}

                {/* Buton */}
                {status !== 'done' && (
                <button 
                    type="submit" 
                    disabled={!file || status !== 'idle' || selectedStyle === null}
                    className="w-full mt-6 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 
                    bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-white/10"
                >
                    {status === 'idle' ? `PROCESS ${STYLES[selectedStyle || 0]?.name.toUpperCase() || 'SELECT CONCEPT'}` : 'Processing Request...'}
                </button>
                )}
            </div>
        </div>
      </form>
      
      {/* SONUÇ EKRANI: Premium Galeri */}
      {status === 'done' && (
        <div className="w-full max-w-5xl mt-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Collection Complete: {STYLES[selectedStyle || 0]?.name}
            </h2>
            <span className="text-xs font-mono text-green-500">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          
          {/* 12 GÖRSEL GRİDİ: 4x3 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {results.map((url, index) => (
              <div key={index} className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 border border-gray-800 shadow-2xl transition hover:scale-[1.02] duration-300">
                <img src={url} alt={`Portrait ${index + 1}`} className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition" />
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase bg-white text-black hover:bg-gray-200 transition shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Unlock 4K Masters
            </button>
            
            <button 
              className="px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase bg-gray-900 text-white border border-gray-700 hover:bg-gray-800 transition"
            >
              Share to Social
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
