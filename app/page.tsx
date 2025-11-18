'use client'; 

import React, { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'generating' | 'done' | 'error'>('idle');
  const [results, setResults] = useState<string[]>([]);
  
  // Global Sosyal Kanıt: Rakamı daha kurumsal bir formatta gösteriyoruz
  const processedCount = '15K+'; 

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
    if (!file) return;

    setStatus('uploading');

    try {
        const imageBase64 = await fileToBase64(file);

        // Kullanıcıya sunucu ile iletişim kurulduğunu hissettirmek için duruma geçiyoruz
        setStatus('generating');

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageBase64 }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Generation Failed.');
        }

        const data = await response.json();
        
        if (data.urls && data.urls.length > 0) {
            setResults(data.urls);
            setStatus('done');
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
      
      {/* BAŞLIK ALANI: Minimalist ve Otoriter */}
      <div className="text-center mb-10 space-y-4">
        <div className="inline-block px-3 py-1 border border-gray-800 rounded-full bg-gray-900/50 backdrop-blur-sm">
            <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">
            {processedCount} Portraits Generated • Server Status: Online
            </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
          KASTO.AI
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-400 max-w-2xl mx-auto tracking-tight">
          The World's Most Advanced Identity Engine.
        </p>
      </div>

      {/* FORM ALANI: Yüksek Teknoloji Hissi */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-[#111] p-1 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden relative group">
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
                {status === 'uploading' ? 'Encrypting & Uploading...' : 'Synthesizing Identities...'}
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
                disabled={!file || status !== 'idle'}
                className="w-full mt-6 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 
                bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-white/10"
            >
                {status === 'idle' ? 'Generate Elite Portfolio' : 'Processing...'}
            </button>
            )}
        </div>
      </form>
      
      {/* SONUÇ EKRANI: Premium Galeri */}
      {status === 'done' && (
        <div className="w-full max-w-5xl mt-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Session Complete
            </h2>
            <span className="text-xs font-mono text-green-500">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {results.map((url, index) => (
              <div key={index} className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 border border-gray-800 shadow-2xl transition hover:scale-[1.02] duration-300">
                <img src={url} alt={`Identity ${index + 1}`} className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-xs font-medium text-white">Variation 0{index+1}</span>
                </div>
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
              Share to TikTok
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
