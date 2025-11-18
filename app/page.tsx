'use client'; 

import React, { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'generating' | 'done' | 'error'>('idle');
  const [results, setResults] = useState<string[]>([]);
  const processedCount = '14,500+'; 

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

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageBase64 }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate images.');
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
    <main className="min-h-screen p-4 flex flex-col items-center justify-center bg-[#0d0d0d]">
      
      <div className="text-center mb-8">
        <div className="text-sm font-semibold text-gray-500 mb-1">
          {processedCount} photos processed in 24 hours! (Ücretsiz slotlar tükeniyor!)
        </div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          KASTO.AI
        </h1>
        <p className="text-xl text-gray-300">
          Unlock your 4 Parallel Identities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-[#1a1a1a] p-8 rounded-xl shadow-2xl border border-purple-500/20">
        
        {status === 'error' && (
             <div className="text-center p-4 bg-red-800/30 text-red-400 rounded-lg mb-4">
               Generation failed. Please try a different photo.
             </div>
        )}
        
        {(status === 'idle' || status === 'error' ) && (
          <>
            <label htmlFor="file-upload" className="block text-center cursor-pointer p-12 border-4 border-dashed border-pink-500/50 rounded-lg transition hover:border-pink-500/80 mb-6">
              <span className="text-lg text-gray-400">
                Tap to Upload Your Selfie (JPG/PNG)
              </span>
              <input 
                id="file-upload" 
                type="file" 
                accept="image/jpeg,image/png" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
            {file && (
              <div className="text-center mb-4 text-green-400">
                Ready to transform: {file.name}
              </div>
            )}
          </>
        )}
        
        {(status === 'uploading' || status === 'generating') && (
          <div className="text-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-lg text-pink-400">
              {status === 'uploading' ? 'Uploading...' : 'Hacking Identities...'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
               — Establishing quantum connection — 
            </p>
          </div>
        )}

        {status !== 'done' && (
          <button 
            type="submit" 
            disabled={!file || status !== 'idle'}
            className="w-full py-3 rounded-lg font-bold text-lg transition duration-300 
            bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-400"
          >
            {status === 'idle' ? 'GENERATE YOUR IDENTITIES' : 'PROCESSING...'}
          </button>
        )}
      </form>
      
      {status === 'done' && (
        <div className="w-full max-w-4xl mt-8 text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-6">
            TRANSFORMATION COMPLETE!
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {results.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-purple-500/50">
                <img src={url} alt={`Identity ${index + 1}`} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <button 
              className="w-full py-3 rounded-lg font-bold text-lg bg-pink-600 text-white hover:bg-pink-700"
            >
              🔒 Enter Email to Unlock 4K Images 🔒
            </button>
            
            <button 
              className="w-full py-3 rounded-lg font-bold text-lg bg-yellow-500 text-black hover:bg-yellow-600"
            >
              ▶️ Play TikTok Video Slideshow (coming soon)
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
