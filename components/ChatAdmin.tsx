import React from 'react';

export default function ChatAdminModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-body">

      <div className="relative w-full max-w-2xl bg-[#5b2be6]/95 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[550px]">

        <div className="bg-white/90 px-6 py-4 flex justify-between items-center">
          <h3 className="text-arcade-ink font-display font-bold text-xl drop-shadow-sm">Admin</h3>
          <button className="text-arcade-ink hover:text-red-500 transition-colors">
            <svg className="w-6 h-6 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">

          <div className="self-start bg-arcade-purple/90 border border-white/10 text-white p-3 rounded-[2rem] rounded-tl-md max-w-[75%] shadow-md relative">
            <div className="absolute -left-2 top-0 w-4 h-4 bg-arcade-purple/90 rounded-bl-full" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
            <div className="w-32 h-32 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
               <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
          </div>

          <div className="self-start bg-arcade-purple/90 border border-white/10 text-white px-6 py-4 rounded-[2rem] rounded-tl-md max-w-[75%] shadow-md mt-1 font-semibold">
            apakah benar kamu<br/>ingin pesan yang ini?
          </div>

          <div className="self-end bg-black/20 border border-white/10 text-white px-6 py-4 rounded-[2rem] rounded-tr-md max-w-[75%] shadow-md mt-4 relative">
             <div className="absolute -right-2 top-0 w-4 h-4 bg-black/20 border-r border-white/10 rounded-br-full" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
            iya benar...
          </div>

        </div>

        <div className="p-5 border-t border-white/10 bg-white/5">
          <div className="relative flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Tulis Pesan..." 
              className="flex-1 bg-transparent border border-white/30 rounded-full pl-6 pr-4 py-3 text-white text-sm outline-none focus:border-arcade-yellow focus:ring-1 focus:ring-arcade-yellow transition-all placeholder:text-white/40" 
            />
            <button className="w-12 h-12 bg-gray-300 hover:bg-white rounded-full flex-shrink-0 shadow-md transition-colors"></button>
          </div>
        </div>

      </div>
    </div>
  );
}