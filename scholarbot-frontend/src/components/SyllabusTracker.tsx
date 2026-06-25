import React, { useState, useEffect } from 'react';
import { SyllabusTopic, UserProfile, AIQuiz, QuizQuestion } from '../types';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  BookOpen, 
  HelpCircle, 
  Brain, 
  RefreshCw, 
  Award,
  BookMarked,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  PlayCircle
} from 'lucide-react';

interface SyllabusTrackerProps {
  user: UserProfile;
  topics: SyllabusTopic[];
  onAddTopic: (topic: SyllabusTopic) => void;
  onUpdateTopic: (topic: SyllabusTopic) => void;
  onDeleteTopic: (id: string) => void;
}

export default function SyllabusTracker({ user, topics, onAddTopic, onUpdateTopic, onDeleteTopic }: SyllabusTrackerProps) {
  // Input fields
  const [subject, setSubject] = useState('Mathematics');
  const [chapter, setChapter] = useState('');
  const [topicText, setTopicText] = useState('');
  
  // Quiz states
  const [selectedTopicForQuiz, setSelectedTopicForQuiz] = useState<SyllabusTopic | null>(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [quizData, setQuizData] = useState<AIQuiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter.trim() || !topicText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          subject,
          chapter,
          topic: topicText,
          status: 'pending'
        })
      });

      if (!response.ok) throw new Error("Could not save syllabus topic.");
      const data = await response.json();
      onAddTopic(data);
      
      setChapter('');
      setTopicText('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (topic: SyllabusTopic, newStatus: 'pending' | 'in_progress' | 'mastered') => {
    try {
      const response = await fetch(`/api/syllabus/${topic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Could not update topic status.");
      const updated = await response.json();
      onUpdateTopic(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this syllabus topic?")) return;
    try {
      const response = await fetch(`/api/syllabus/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onDeleteTopic(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generate AI dynamic practice quiz for specific syllabus topic
  const startQuizGeneration = async (topic: SyllabusTopic) => {
    setSelectedTopicForQuiz(topic);
    setGeneratingQuiz(true);
    setQuizData(null);
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setError(null);

    try {
      const response = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicName: `${topic.subject} - ${topic.topic}` })
      });

      if (!response.ok) throw new Error("ScholarBot was unable to generate custom questions.");
      const data = await response.json();
      setQuizData(data);
    } catch (err: any) {
      setError(err.message || "Failed to contact Gemini API.");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quizData) return;
    let computedScore = 0;
    quizData.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctIndex) {
        computedScore += 1;
      }
    });
    setScore(computedScore);
    setQuizSubmitted(true);

    // If perfectly mastered or good score, update status to mastered!
    if (computedScore >= 2 && selectedTopicForQuiz) {
      handleUpdateStatus(selectedTopicForQuiz, 'mastered');
    }
  };

  // Group syllabus topics by Subject
  const subjectsList = ['Mathematics', 'Physics', 'Computer Science', 'Language', 'Other'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="scholarbot-syllabus">
      
      {/* Column 1 & 2: Syllabus Matrix */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Creator block */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-500" />
            <h3 className="font-extrabold text-base text-slate-800">Add New Syllabus Topic</h3>
          </div>

          <form onSubmit={handleCreateTopic} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Subject</label>
              <select 
                id="syll-subject-select"
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Chapter/Unit</label>
              <input 
                id="syll-chapter-input"
                type="text" 
                placeholder="e.g., Chapter 4: Optics" 
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-5 space-y-1 flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Specific Topic</label>
                <input 
                  id="syll-topic-input"
                  type="text" 
                  placeholder="e.g., Snell's Law and Reflection" 
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <button 
                id="btn-add-syllabus"
                type="submit" 
                disabled={loading}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </form>
          {error && <div className="text-xs font-bold text-red-500">{error}</div>}
        </div>

        {/* Syllabus matrix display */}
        <div className="space-y-6">
          {subjectsList.map(subj => {
            const subjTopics = topics.filter(t => t.subject === subj);
            if (subjTopics.length === 0) return null;

            return (
              <div key={subj} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4" id={`subj-section-${subj}`}>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500" />
                    <h3 className="font-extrabold text-base text-slate-900">{subj} Syllabus</h3>
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-bold">
                    {subjTopics.filter(t => t.status === 'mastered').length} / {subjTopics.length} Mastered
                  </span>
                </div>

                <div className="divide-y divide-slate-50">
                  {subjTopics.map(topic => (
                    <div key={topic.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase">
                          {topic.chapter}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm">{topic.topic}</h4>
                        {topic.lastReviewed && (
                          <p className="text-[10px] text-slate-400">
                            Last reviewed: {new Date(topic.lastReviewed).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center flex-wrap gap-2">
                        {/* Status Selector Pills */}
                        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                          <button 
                            id={`status-pending-${topic.id}`}
                            onClick={() => handleUpdateStatus(topic, 'pending')}
                            className={`px-2.5 py-1 text-xs font-bold transition ${topic.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          >
                            Todo
                          </button>
                          <button 
                            id={`status-progress-${topic.id}`}
                            onClick={() => handleUpdateStatus(topic, 'in_progress')}
                            className={`px-2.5 py-1 text-xs font-bold transition ${topic.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          >
                            Learning
                          </button>
                          <button 
                            id={`status-mastered-${topic.id}`}
                            onClick={() => handleUpdateStatus(topic, 'mastered')}
                            className={`px-2.5 py-1 text-xs font-bold transition ${topic.status === 'mastered' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          >
                            Mastered
                          </button>
                        </div>

                        {/* ScholarBot practice quiz trigger */}
                        <button 
                          id={`btn-quiz-${topic.id}`}
                          onClick={() => startQuizGeneration(topic)}
                          className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition shadow-sm"
                          title="Generate study testing quiz using Gemini AI"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          <span>Quiz</span>
                        </button>

                        <button 
                          id={`btn-delete-${topic.id}`}
                          onClick={() => handleDelete(topic.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {topics.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 text-slate-400 space-y-3">
              <BookOpen className="w-12 h-12 mx-auto opacity-30 animate-pulse text-indigo-500" />
              <h4 className="font-extrabold text-slate-700">No topics added yet!</h4>
              <p className="text-xs max-w-sm mx-auto">
                Enter your course outline or syllabus chapters above to start tracking, leveling up, and taking dynamic quizzes.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Column 3: AI Dynamic Testing Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 self-start" id="syllabus-quiz-panel">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Brain className="w-5 h-5 text-indigo-500" />
          <h3 className="font-extrabold text-base text-slate-800">Weekly Testing Center</h3>
        </div>

        {generatingQuiz && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-xs text-slate-500 font-bold animate-pulse">ScholarBot is compiling your test questions...</p>
          </div>
        )}

        {!selectedTopicForQuiz && !generatingQuiz && (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <HelpCircle className="w-10 h-10 mx-auto opacity-30 text-indigo-500" />
            <h4 className="font-bold text-slate-700 text-sm">Interactive Flash Testing</h4>
            <p className="text-xs">
              Click the <span className="font-bold text-indigo-600">"Quiz"</span> button on any topic to generate dynamic 3-question MCQ assessments. Correctly answering raises status automatically!
            </p>
          </div>
        )}

        {selectedTopicForQuiz && !generatingQuiz && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-indigo-500 font-black uppercase tracking-wider">Active Assessment</span>
              <h4 className="font-bold text-slate-800 text-sm">{selectedTopicForQuiz.topic}</h4>
            </div>

            {error && (
              <div className="text-xs font-bold text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            {quizData && (
              <div className="space-y-6">
                {quizData.questions.map((q, qIndex) => (
                  <div key={qIndex} className="space-y-2 text-xs">
                    <p className="font-bold text-slate-800">
                      Q{qIndex + 1}: {q.question}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((option, optIndex) => {
                        const isSelected = userAnswers[qIndex] === optIndex;
                        const showCorrect = quizSubmitted && optIndex === q.correctIndex;
                        const showIncorrect = quizSubmitted && isSelected && optIndex !== q.correctIndex;

                        return (
                          <button
                            id={`quiz-option-${qIndex}-${optIndex}`}
                            key={optIndex}
                            type="button"
                            onClick={() => selectAnswer(qIndex, optIndex)}
                            className={`px-3 py-2.5 rounded-xl border text-left font-medium transition ${
                              showCorrect 
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold' 
                                : showIncorrect
                                ? 'bg-red-100 border-red-300 text-red-800'
                                : isSelected
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-2.5 bg-slate-100 rounded-lg text-[10px] text-slate-600 italic mt-1 leading-relaxed">
                        <span className="font-bold">Explanation:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}

                {!quizSubmitted ? (
                  <button
                    id="submit-quiz-btn"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(userAnswers).length < quizData.questions.length}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition text-xs shadow-md shadow-indigo-500/10"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <div className="space-y-3 pt-2">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Test Score:</span>
                      <span className="font-black text-indigo-600 text-sm">{score} / {quizData.questions.length}</span>
                    </div>

                    {score >= 2 ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                        <Award className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          Great job! Topic updated to Mastered!
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-xs text-amber-800 font-bold">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <div>
                          Review this topic again in your Focus session.
                        </div>
                      </div>
                    )}

                    <button
                      id="retry-quiz-btn"
                      onClick={() => startQuizGeneration(selectedTopicForQuiz)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-xs"
                    >
                      Try Another Quiz
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
