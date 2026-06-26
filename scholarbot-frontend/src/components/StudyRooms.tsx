import React, { useState, useEffect } from 'react';
import { StudyRoom, UserProfile, RoomMember, RoomMessage } from '../types';
import { 
  Users, 
  MessageSquare, 
  Send, 
  BookOpen, 
  Clock, 
  Flame, 
  Sparkles,
  Award,
  DoorOpen,
  Volume2
} from 'lucide-react';

interface StudyRoomsProps {
  user: UserProfile;
}

export default function StudyRooms({ user }: StudyRoomsProps) {
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);
  
  // Chat input
  const [msgText, setMsgText] = useState('');
  
  // Timer for polling
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
        
        // Keep active room reference synced with fresh database changes
        if (activeRoom) {
          const freshActive = data.find((r: StudyRoom) => r.id === activeRoom.id);
          if (freshActive) {
            setActiveRoom(freshActive);
          }
        }
      }
    } catch (e) {
      console.error("Error fetching rooms:", e);
    }
  };

  // Poll for room updates every 4 seconds to simulate real-time room chats and dynamic members
  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 4000);
    return () => clearInterval(interval);
  }, [activeRoom?.id]);

  const joinRoom = async (roomId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          avatar: user.avatar,
          xp: user.xp
        })
      });

      if (response.ok) {
        const updatedRoom = await response.json();
        setActiveRoom(updatedRoom);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || !activeRoom) return;

    const textToSend = msgText;
    setMsgText('');

    try {
      const response = await fetch(`/api/rooms/${activeRoom.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user.name,
          text: textToSend
        })
      });

      if (response.ok) {
        const updatedRoom = await response.json();
        setActiveRoom(updatedRoom);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6" id="scholarbot-rooms">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-500" />
          ScholarBot Collaborative Study Rooms
        </h2>
        <p className="text-xs text-slate-400">Join immersive focus groups, coordinate Pomodoros with peers, and share live queries.</p>
      </div>

      {!activeRoom ? (
        /* Room Selection Cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div 
              key={room.id} 
              id={`room-card-${room.id}`}
              className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-slate-950">{room.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{room.description}</p>
                
                <div className="flex items-center gap-1.5 pt-2 text-xs font-semibold text-slate-600">
                  <Users className="w-4.5 h-4.5 text-indigo-500" />
                  <span>{room.members.length} active scholar(s) online</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                {/* Micro avatar avatars row */}
                <div className="flex -space-x-2">
                  {room.members.slice(0, 3).map((m, i) => (
                    <img 
                      key={i} 
                      src={m.avatar} 
                      alt={m.userName} 
                      className="w-7 h-7 rounded-full border-2 border-white object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                  {room.members.length > 3 && (
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border-2 border-white flex items-center justify-center">
                      +{room.members.length - 3}
                    </span>
                  )}
                </div>

                <button
                  id={`join-room-btn-${room.id}`}
                  onClick={() => joinRoom(room.id)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Join Room
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Active Joined Room layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-16rem)]">
          
          {/* Members column list (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 space-y-5 flex flex-col h-full overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-800 text-sm">
                <Users className="w-4.5 h-4.5 text-indigo-500" />
                <span>Active Scholars ({activeRoom.members.length})</span>
              </div>
              <button 
                id="leave-room-btn"
                onClick={() => setActiveRoom(null)}
                className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
              >
                <DoorOpen className="w-4 h-4" />
                Leave
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {activeRoom.members.map((m) => (
                <div key={m.userId} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                  <img 
                    src={m.avatar} 
                    alt={m.userName} 
                    className="w-10 h-10 rounded-xl border border-indigo-200/50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-xs truncate flex items-center gap-1">
                      {m.userName}
                      {m.userId === user.id && <span className="text-[8px] bg-indigo-500 text-white px-1 rounded">You</span>}
                    </h4>
                    <p className="text-[10px] text-indigo-600 font-black uppercase flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      {m.currentActivity || 'Online'}
                    </p>
                    <span className="text-[9px] text-slate-400 font-bold block">{m.xp} total XP</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 space-y-2">
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block">Study Room Tip</span>
              <p className="text-[10px] text-indigo-900 leading-relaxed font-medium">
                Keep the focus timer going in the first tab. Your live status and XP updates synchronize automatically across active classrooms.
              </p>
            </div>
          </div>

          {/* Room chat logger (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-extrabold text-base text-slate-950">{activeRoom.name}</h3>
                <p className="text-xs text-slate-500">{activeRoom.description}</p>
              </div>
            </div>

            {/* Chats messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {activeRoom.chat.map((msg) => {
                const isYou = msg.userName === user.name;
                return (
                  <div key={msg.id} className={`flex flex-col ${isYou ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-bold text-slate-400 mb-0.5 px-1">{msg.userName}</span>
                    <div className={`max-w-md rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed shadow-sm ${
                      isYou 
                        ? 'bg-indigo-600 text-white rounded-tr-none font-semibold' 
                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none font-medium'
                    }`}>
                      <p>{msg.text}</p>
                      <span className={`text-[8px] mt-1 block text-right font-bold ${isYou ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {activeRoom.chat.length === 0 && (
                <div className="text-center py-20 text-slate-400 text-xs">
                  Say hello to get the study session rolling!
                </div>
              )}
            </div>

            {/* Send chat */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-slate-100 bg-white flex gap-2">
              <input 
                id="room-msg-input"
                type="text" 
                placeholder={`Post an encouraging study message or ask queries in ${activeRoom.name}...`}
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                id="room-msg-send-btn"
                type="submit"
                disabled={!msgText.trim()}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/10"
              >
                <Send className="w-4 h-4 fill-white" />
                <span className="text-xs hidden md:inline">Send</span>
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
}
//update
