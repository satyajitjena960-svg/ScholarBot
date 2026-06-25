import React, { useState } from 'react';
import { ExamGoal, ExamTask, UserProfile } from '../types';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Award, 
  FileText,
  Percent,
  ListTodo
} from 'lucide-react';

interface ExamPlannerProps {
  user: UserProfile;
  exams: ExamGoal[];
  onAddExam: (exam: ExamGoal) => void;
  onUpdateExam: (exam: ExamGoal) => void;
  onDeleteExam: (id: string) => void;
}

export default function ExamPlanner({ user, exams, onAddExam, onUpdateExam, onDeleteExam }: ExamPlannerProps) {
  // Creator state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [prepLevel, setPrepLevel] = useState(50);

  // New task inline state
  const [newTaskText, setNewTaskText] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title,
          date,
          subject,
          preparationLevel: Number(prepLevel)
        })
      });

      if (!response.ok) throw new Error("Could not schedule exam plan.");
      const data = await response.json();
      onAddExam(data);

      setTitle('');
      setDate('');
      setPrepLevel(50);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (exam: ExamGoal, taskId: string) => {
    const updatedTasks = exam.tasks.map(t => {
      if (t.id === taskId) return { ...t, done: !t.done };
      return t;
    });

    // Auto-calculate preparationLevel based on tasks completed
    const doneCount = updatedTasks.filter(t => t.done).length;
    const computedPrep = Math.floor((doneCount / updatedTasks.length) * 100);

    try {
      const response = await fetch(`/api/exams/${exam.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tasks: updatedTasks,
          preparationLevel: computedPrep
        })
      });

      if (response.ok) {
        const data = await response.json();
        onUpdateExam(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (exam: ExamGoal) => {
    const taskText = newTaskText[exam.id];
    if (!taskText || !taskText.trim()) return;

    const newTask: ExamTask = {
      id: "t-" + Math.random().toString(36).substring(2, 5),
      text: taskText,
      done: false
    };

    const updatedTasks = [...exam.tasks, newTask];
    const doneCount = updatedTasks.filter(t => t.done).length;
    const computedPrep = Math.floor((doneCount / updatedTasks.length) * 100);

    try {
      const response = await fetch(`/api/exams/${exam.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: updatedTasks,
          preparationLevel: computedPrep
        })
      });

      if (response.ok) {
        const data = await response.json();
        onUpdateExam(data);
        setNewTaskText(prev => ({ ...prev, [exam.id]: '' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm("Remove this exam schedule?")) return;
    try {
      const response = await fetch(`/api/exams/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onDeleteExam(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const subjectsList = ['Mathematics', 'Physics', 'Computer Science', 'Language', 'Other'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="scholarbot-examplanner">
      
      {/* Column Left: Schedule Planner Form */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <h3 className="font-extrabold text-base text-slate-800">Add Exam Countdown</h3>
          </div>

          <form onSubmit={handleCreateExam} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Exam Title / Subject Chapter</label>
              <input 
                id="exam-title-input"
                type="text" 
                placeholder="e.g., Computer Networks Midterm" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Subject</label>
                <select 
                  id="exam-subject-select"
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Exam Date</label>
                <input 
                  id="exam-date-input"
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                <span>Est. Readiness level</span>
                <span>{prepLevel}%</span>
              </div>
              <input 
                id="exam-prep-slider"
                type="range" 
                min="0" 
                max="100" 
                value={prepLevel}
                onChange={(e) => setPrepLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <button
              id="btn-schedule-exam"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Exam</span>
            </button>
          </form>
          {error && <div className="text-xs font-bold text-red-500">{error}</div>}
        </div>
      </div>

      {/* Column Right: Interactive Exam Timeline & Checklists */}
      <div className="lg:col-span-2 space-y-6">
        
        {exams.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 text-slate-400 space-y-3">
            <Calendar className="w-12 h-12 mx-auto opacity-30 text-indigo-500" />
            <h4 className="font-extrabold text-slate-700">No upcoming exams scheduled</h4>
            <p className="text-xs max-w-sm mx-auto">
              Plan ahead to unlock structured milestone checklists. We will auto-track milestones and calculate readiness scores.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map((exam) => {
              const daysLeft = Math.ceil((new Date(exam.date).getTime() - Date.now()) / 86400000);
              const countdownText = daysLeft > 0 ? `${daysLeft} Days Left` : daysLeft === 0 ? "EXAM TODAY!" : "Archived Exam";

              return (
                <div key={exam.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4" id={`exam-card-${exam.id}`}>
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-extrabold px-2 py-0.5 rounded uppercase">
                        {exam.subject}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{exam.title}</h4>
                    </div>
                    <button 
                      onClick={() => handleDeleteExam(exam.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Countdown Timer Badge */}
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{countdownText} • {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  {/* Preparation Level */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-500 flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5 text-indigo-500" />
                        Readiness Rating
                      </span>
                      <span className="font-bold text-slate-800">{exam.preparationLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          exam.preparationLevel >= 80 ? 'bg-emerald-500' : exam.preparationLevel >= 50 ? 'bg-indigo-600' : 'bg-rose-500'
                        }`}
                        style={{ width: `${exam.preparationLevel}%` }}
                      />
                    </div>
                  </div>

                  {/* Checklist Sub tasks */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                      <ListTodo className="w-3.5 h-3.5" />
                      Preparation Milestones
                    </span>

                    <div className="space-y-1.5">
                      {exam.tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between text-xs font-medium">
                          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                            <input 
                              id={`exam-task-check-${task.id}`}
                              type="checkbox" 
                              checked={task.done}
                              onChange={() => handleToggleTask(exam, task.id)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                            <span className={task.done ? 'line-through text-slate-400 font-normal' : ''}>{task.text}</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Quick inline task creator */}
                    <div className="flex gap-2 pt-2">
                      <input 
                        id={`inline-task-input-${exam.id}`}
                        type="text" 
                        placeholder="Add milestone study task..."
                        value={newTaskText[exam.id] || ''}
                        onChange={(e) => setNewTaskText(prev => ({ ...prev, [exam.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTask(exam);
                          }
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button 
                        id={`inline-task-add-btn-${exam.id}`}
                        onClick={() => handleAddTask(exam)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs transition"
                      >
                        Add
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
