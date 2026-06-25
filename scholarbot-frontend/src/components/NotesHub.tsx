import React, { useState } from 'react';
import { StudyNote, UserProfile, Flashcard } from '../types';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  BookOpen, 
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NotesHubProps {
  user: UserProfile;
  notes: StudyNote[];
  onAddNote: (note: StudyNote) => void;
  onUpdateNote: (note: StudyNote) => void;
  onDeleteNote: (id: string) => void;
}

export default function NotesHub({ user, notes, onAddNote, onUpdateNote, onDeleteNote }: NotesHubProps) {
  // Input form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Computer Science');
  
  // Selection
  const [activeNote, setActiveNote] = useState<StudyNote | null>(null);
  
  // Flashcard practice mechanics
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title,
          content,
          category
        })
      });

      if (!response.ok) throw new Error("Could not save study note.");
      const data = await response.json();
      onAddNote(data);
      setActiveNote(data);
      
      setTitle('');
      setContent('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onDeleteNote(noteId);
        if (activeNote?.id === noteId) {
          setActiveNote(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAISummarize = async (noteId: string) => {
    setSummarizing(true);
    setError(null);
    try {
      const response = await fetch(`/api/notes/${noteId}/ai-summarize`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error("ScholarBot was unable to summarize the content.");
      const updatedNote = await response.json();
      onUpdateNote(updatedNote);
      setActiveNote(updatedNote);
      setCardIndex(0);
      setIsFlipped(false);
    } catch (err: any) {
      setError(err.message || "Failed during summarization.");
    } finally {
      setSummarizing(false);
    }
  };

  const nextCard = (cardsCount: number) => {
    setIsFlipped(false);
    setTimeout(() => {
      setCardIndex((prev) => (prev + 1) % cardsCount);
    }, 150);
  };

  const prevCard = (cardsCount: number) => {
    setIsFlipped(false);
    setTimeout(() => {
      setCardIndex((prev) => (prev - 1 + cardsCount) % cardsCount);
    }, 150);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="scholarbot-noteshub">
      
      {/* Column Left: Notes list & Editor (5/12 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Create Note Editor */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h3 className="font-extrabold text-base text-slate-800">Write New Study Note</h3>
          </div>

          <form onSubmit={handleCreateNote} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
              <input 
                id="note-title-input"
                type="text" 
                placeholder="e.g., Understanding DNS handshakes" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                <select 
                  id="note-category-select"
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Language">Language</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Study Content</label>
              <textarea 
                id="note-content-input"
                placeholder="Paste your textbooks, personal summaries, or class notes here..." 
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-sans"
              />
            </div>

            <button
              id="btn-save-note"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </form>
        </div>

        {/* Saved notes library */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 flex-1">
          <h3 className="font-extrabold text-base text-slate-800">Your Note Library</h3>
          
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {notes.length === 0 ? (
              <div className="text-xs text-slate-400 py-12 text-center">
                Your library is empty. Save a note above to unlock AI powerups!
              </div>
            ) : (
              notes.map((note) => {
                const isActive = activeNote?.id === note.id;
                return (
                  <div 
                    key={note.id} 
                    id={`note-card-${note.id}`}
                    onClick={() => {
                      setActiveNote(note);
                      setCardIndex(0);
                      setIsFlipped(false);
                    }}
                    className={`p-4 rounded-xl border transition cursor-pointer text-left space-y-2 relative ${
                      isActive 
                        ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded uppercase">
                        {note.category}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-slate-800 text-sm truncate">{note.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{note.content}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-500 font-semibold pt-1">
                      {note.summary ? (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>AI Summarized + {note.flashcards?.length} Flashcards</span>
                        </>
                      ) : (
                        <span>Ready for ScholarBot AI powerup</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Column Right: AI Summarizer & Interactive Flashcards (7/12 cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {!activeNote ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center text-slate-400 space-y-4 h-full flex flex-col justify-center items-center">
            <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" />
            <div className="space-y-1.5 max-w-sm">
              <h4 className="font-extrabold text-slate-700 text-base">Select or Save a Study Note</h4>
              <p className="text-xs">
                Once selected, ScholarBot will generate high-quality bullet point summaries, clear concept structures, and instant revision flashcards automatically.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Active Note summary & content view */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6" id="note-active-view">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-indigo-600">{activeNote.category}</span>
                  <h2 className="font-black text-2xl text-slate-950">{activeNote.title}</h2>
                </div>
                
                <button
                  id="btn-ai-summarize"
                  onClick={() => handleAISummarize(activeNote.id)}
                  disabled={summarizing}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-500 hover:from-amber-600 hover:to-indigo-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
                >
                  {summarizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{activeNote.summary ? 'Re-Generate' : 'AI Summarize & Flashcards'}</span>
                </button>
              </div>

              {/* Note Content */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Raw Note Content</span>
                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed font-sans bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {activeNote.content}
                </p>
              </div>

              {/* AI Summary Block */}
              {activeNote.summary && (
                <div className="space-y-3 bg-indigo-50/20 border border-indigo-100/60 p-5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-indigo-600 font-extrabold text-sm">
                    <Sparkles className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                    <span>ScholarBot AI Summary Analysis</span>
                  </div>
                  <p className="text-xs text-indigo-950 whitespace-pre-wrap leading-relaxed font-medium">
                    {activeNote.summary}
                  </p>
                </div>
              )}
            </div>

            {/* AI Flashcards Practice Center */}
            {activeNote.flashcards && activeNote.flashcards.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6" id="flashcards-practice-center">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-extrabold text-base text-slate-800">Dynamic Revision Flashcards</h3>
                </div>

                <div className="flex flex-col items-center space-y-6">
                  {/* Interactive Flip Card container */}
                  <div 
                    id="flip-card-body"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full max-w-md h-52 cursor-pointer relative transition-transform duration-500 [transform-style:preserve-3d]"
                    style={{
                      transform: isFlipped ? 'rotateY(180deg)' : 'none'
                    }}
                  >
                    {/* Front Side */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg [backface-visibility:hidden]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Front Side (Question)</span>
                      <p className="text-center text-sm md:text-base font-extrabold leading-relaxed px-4">
                        {activeNote.flashcards[cardIndex].front}
                      </p>
                      <span className="text-[9px] text-indigo-200 font-bold self-center">Click to Flip & Reveal Answer</span>
                    </div>

                    {/* Back Side */}
                    <div 
                      className="absolute inset-0 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Back Side (Answer)</span>
                      <p className="text-center text-sm md:text-base font-extrabold leading-relaxed text-slate-100 px-4">
                        {activeNote.flashcards[cardIndex].back}
                      </p>
                      <span className="text-[9px] text-slate-400 font-bold self-center">Click to flip back to question</span>
                    </div>
                  </div>

                  {/* Carousel controls */}
                  <div className="flex items-center gap-4">
                    <button 
                      id="prev-card-btn"
                      onClick={() => prevCard(activeNote.flashcards!.length)}
                      className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      {cardIndex + 1} / {activeNote.flashcards.length}
                    </span>
                    <button 
                      id="next-card-btn"
                      onClick={() => nextCard(activeNote.flashcards!.length)}
                      className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
