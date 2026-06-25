import { UserProfile, FocusSession, SyllabusTopic, StudyNote, ExamGoal, StudyRoom } from '../types';

// Client-side Database structure
interface DBStructure {
  users: UserProfile[];
  sessions: FocusSession[];
  syllabus: SyllabusTopic[];
  notes: StudyNote[];
  exams: ExamGoal[];
  rooms: StudyRoom[];
}

// Default rooms
const DEFAULT_ROOMS: StudyRoom[] = [
  {
    id: "global-library",
    name: "📚 Global Library",
    description: "Quiet focus room for deep study. Pomodoro fans welcome!",
    members: [
      { userId: "mock-1", userName: "Anya (Math Wizard)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", xp: 1240, currentActivity: "Focusing (Mathematics)" },
      { userId: "mock-2", userName: "Liam Code", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", xp: 950, currentActivity: "Focusing (Computer Science)" },
      { userId: "mock-3", userName: "Zara", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", xp: 1810, currentActivity: "Chilling" }
    ],
    chat: [
      { id: "msg-1", userName: "Anya (Math Wizard)", text: "Just completed a 50min calculus streak!", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: "msg-2", userName: "Liam Code", text: "Nice work! I'm jumping in for a 25min coding block now.", timestamp: new Date(Date.now() - 1800000).toISOString() }
    ]
  },
  {
    id: "ai-lab",
    name: "🤖 AI & Tech Lab",
    description: "Collaborative query solving and exam prep with peers.",
    members: [
      { userId: "mock-4", userName: "Dr. Dave", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", xp: 2150, currentActivity: "Query Solving" },
      { userId: "mock-5", userName: "Emma Study", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", xp: 820, currentActivity: "Focusing (Other)" }
    ],
    chat: [
      { id: "msg-3", userName: "Emma Study", text: "Has anyone tried the weekly AI-generated test? It's amazing for physics.", timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: "msg-4", userName: "Dr. Dave", text: "Yes! The grading feedback really solidifies weak concepts.", timestamp: new Date(Date.now() - 3600000).toISOString() }
    ]
  },
  {
    id: "softskills-lounge",
    name: "💬 Soft Skills Lounge",
    description: "Develop your presentation, interview, and leadership skills here.",
    members: [
      { userId: "mock-6", userName: "Olivia Voice", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", xp: 1100, currentActivity: "Soft Skill Play" }
    ],
    chat: [
      { id: "msg-5", userName: "Olivia Voice", text: "Doing the AI Public Speaking Coach session. Highly recommend!", timestamp: new Date(Date.now() - 600000).toISOString() }
    ]
  }
];

// Default users
const DEFAULT_USERS: UserProfile[] = [
  {
    id: "mock-1",
    name: "Anya (Math Wizard)",
    email: "anya@scholarbot.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    level: 5,
    xp: 1240,
    studyPoints: 450,
    streak: 6,
    targetHours: 6,
    categoryTargets: { "Mathematics": 120, "Physics": 90, "Computer Science": 90, "Language": 60, "Other": 60 }
  },
  {
    id: "mock-2",
    name: "Liam Code",
    email: "liam@scholarbot.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    level: 4,
    xp: 950,
    studyPoints: 320,
    streak: 3,
    targetHours: 5,
    categoryTargets: { "Mathematics": 60, "Physics": 60, "Computer Science": 180, "Language": 45, "Other": 45 }
  },
  {
    id: "mock-3",
    name: "Zara",
    email: "zara@scholarbot.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    level: 7,
    xp: 1810,
    studyPoints: 620,
    streak: 12,
    targetHours: 8,
    categoryTargets: { "Mathematics": 120, "Physics": 120, "Computer Science": 120, "Language": 120, "Other": 120 }
  }
];

// Initialize Database in localStorage
const DB_KEY = 'scholarbot_client_db';

function getClientDB(): DBStructure {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    const initialDB: DBStructure = {
      users: DEFAULT_USERS,
      sessions: [
        { id: "sess-1", userId: "mock-1", duration: 50, category: "Mathematics", timestamp: new Date(Date.now() - 86400000).toISOString(), notes: "Worked on calculus integrals", completed: true },
        { id: "sess-2", userId: "mock-2", duration: 25, category: "Computer Science", timestamp: new Date(Date.now() - 43200000).toISOString(), notes: "Express backend routing practice", completed: true },
        { id: "sess-3", userId: "mock-3", duration: 45, category: "Physics", timestamp: new Date(Date.now() - 172800000).toISOString(), notes: "Quantum mechanics basic axioms review", completed: true }
      ],
      syllabus: [
        { id: "topic-1", userId: "any", subject: "Mathematics", chapter: "Chapter 3: Calculus", topic: "Integration by Parts", status: "mastered", lastReviewed: new Date().toISOString() },
        { id: "topic-2", userId: "any", subject: "Computer Science", chapter: "Chapter 1: Network Protocols", topic: "TCP/IP vs UDP handshake mechanics", status: "in_progress", lastReviewed: new Date().toISOString() },
        { id: "topic-3", userId: "any", subject: "Physics", chapter: "Chapter 5: Thermodynamics", topic: "Entropy & Second Law", status: "pending" }
      ],
      notes: [
        {
          id: "note-1",
          userId: "any",
          title: "Mechanisms of DNS",
          content: "The Domain Name System (DNS) translates human-readable domain names into IP addresses. It starts at the resolver, queries the Root Server, the TLD (Top-Level Domain) server, and finally the Authoritative Name Server to fetch the correct IP address. DNS typically operates on UDP port 53.",
          summary: "DNS translates domain names to IP addresses starting from the root nameservers down to authoritative nameservers, running on UDP Port 53.",
          flashcards: [
            { front: "What port does DNS primarily use?", back: "UDP Port 53" },
            { front: "What is the start of a DNS query chain?", back: "DNS Resolver" }
          ],
          timestamp: new Date().toISOString(),
          category: "Computer Science"
        }
      ],
      exams: [
        { id: "exam-1", userId: "any", title: "Midterm Calculus Exam", date: new Date(Date.now() + 86400000 * 5).toISOString(), subject: "Mathematics", preparationLevel: 65, tasks: [
          { id: "t-1", text: "Solve 20 mock integration problems", done: true },
          { id: "t-2", text: "Revise Taylor Series expansion proof", done: false },
          { id: "t-3", text: "Take weekly AI calculus quiz", done: false }
        ]}
      ],
      rooms: DEFAULT_ROOMS
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
    return initialDB;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse client database from localStorage, resetting", e);
    return { users: [], sessions: [], syllabus: [], notes: [], exams: [], rooms: DEFAULT_ROOMS };
  }
}

function saveClientDB(db: DBStructure) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Local AI response helper logic directly moved from server fallback
function getLocalAIResponse(type: "chat" | "summarize" | "quiz" | "softskills", payload: any) {
  if (type === "chat") {
    const promptLower = (payload.prompt || "").toLowerCase();
    let reply = `Hello! I am ScholarBot, here in custom high-performance local AI mode to support your learning journey!\n\n`;
    
    if (promptLower.includes("math") || promptLower.includes("calculus") || promptLower.includes("integral") || promptLower.includes("derivative")) {
      reply += `**Mathematics Guidance**:\n- When working on calculus or algebra, break down each problem step-by-step. Write out your assumptions clearly before applying formulas.\n- Remember that the derivative measures instantaneous rate of change, while the integral represents the accumulated area under a curve. Let me know if you want to walk through a specific sample problem!`;
    } else if (promptLower.includes("physics") || promptLower.includes("force") || promptLower.includes("gravity") || promptLower.includes("energy")) {
      reply += `**Physics Guidance**:\n- Ensure you check your units consistently (SI system: kilograms, meters, seconds).\n- Draw a free-body diagram representing all force vectors. It acts as the ultimate blueprint to construct correct motion equations!`;
    } else if (promptLower.includes("code") || promptLower.includes("programming") || promptLower.includes("network") || promptLower.includes("dns") || promptLower.includes("api")) {
      reply += `**Computer Science Guidance**:\n- Write pseudocode first to design your data flows and loop structures before committing to syntax.\n- Remember to test edge cases (empty inputs, out-of-bounds keys, null parameters) to build highly secure and bug-free production-ready systems.`;
    } else {
      reply += `**Interactive Scholar Study Guidance**:\n- **Pomodoro Power**: Set a timer for 25 minutes in the study tab, block all browser tabs, and do single-task deep learning.\n- **Active Testing**: Try generating a weekly practice quiz from your Syllabus tracker to reinforce recall loops.\n- **Notes Synthesis**: Summarize your note-taking regularly in the Notes Hub to build customized study guides.`;
    }

    reply += `\n\n*How can we structure your next study session? Feel free to ask another query or refine your focus targets.*`;
    return { text: reply };
  }

  if (type === "summarize") {
    const title = payload.title || "Study Note";
    const content = payload.content || "";
    
    // Simple rule-based summarization
    const sentences = content.split(/[.!?]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 5);
    const bullets = sentences.slice(0, 3).map((s: string) => `- ${s}.`).join("\n");
    const summaryText = `### Note Summary: ${title}\n\n${bullets || "- Core educational concept of " + title + " focuses on active cognitive learning and mastery."}\n\n*Note: This summary was dynamically constructed in secure local fallback mode due to high AI model demand.*`;
    
    const card1 = {
      front: `What is the primary theme outlined in "${title}"?`,
      back: sentences[0] ? `The key starting concept states that: ${sentences[0]}.` : `To master and recall the core elements of ${title}.`
    };

    const card2 = {
      front: `Explain a significant details discussed under "${title}".`,
      back: sentences[1] ? `An important aspect is: ${sentences[1]}.` : `That active testing and review of ${title} guarantees better long-term memory retention.`
    };

    return {
      summary: summaryText,
      flashcards: [card1, card2]
    };
  }

  if (type === "quiz") {
    const topic = payload.topicName || "General Study Methods";
    const topicLower = topic.toLowerCase();
    
    let questionsList = [];

    if (topicLower.includes("math") || topicLower.includes("calculus") || topicLower.includes("integral") || topicLower.includes("derivative")) {
      questionsList = [
        {
          question: "What is the derivative of x^2 with respect to x?",
          options: ["x", "2x", "x^2", "2"],
          correctIndex: 1,
          explanation: "Using the power rule, the derivative of x^n is n * x^(n-1). For x^2, this is 2 * x^1 = 2x."
        },
        {
          question: "What is the integral of 1/x with respect to x?",
          options: ["ln|x| + C", "x^2 + C", "e^x + C", "1"],
          correctIndex: 0,
          explanation: "The antiderivative of 1/x is the natural logarithm, ln|x| + C."
        },
        {
          question: "In linear algebra, what is a matrix with only zeros on the non-diagonal and ones on the diagonal?",
          options: ["Zero matrix", "Symmetric matrix", "Identity matrix", "Inverse matrix"],
          correctIndex: 2,
          explanation: "The Identity Matrix is a square matrix with ones on the main diagonal and zeros elsewhere."
        }
      ];
    } else if (topicLower.includes("physics") || topicLower.includes("entropy") || topicLower.includes("force") || topicLower.includes("thermo")) {
      questionsList = [
        {
          question: "According to the Second Law of Thermodynamics, what happens to the total entropy of an isolated system over time?",
          options: ["It decreases", "It remains constant", "It always increases or remains constant", "It fluctuates periodically"],
          correctIndex: 2,
          explanation: "The Second Law states that the total entropy of an isolated system can never decrease over time; it always increases or remains constant in a state of thermodynamic equilibrium."
        },
        {
          question: "What is the speed of light in a vacuum (c) approximately?",
          options: ["3 x 10^8 m/s", "1.5 x 10^6 m/s", "9.8 m/s^2", "3 x 10^10 m/s"],
          correctIndex: 0,
          explanation: "The speed of light in a vacuum is approximately 299,792,458 meters per second, which rounds to 3 x 10^8 m/s."
        },
        {
          question: "Which particle is considered the quantum of light?",
          options: ["Electron", "Proton", "Neutron", "Photon"],
          correctIndex: 3,
          explanation: "A photon is an elementary particle, the quantum of all electromagnetic radiation, including light."
        }
      ];
    } else if (topicLower.includes("computer") || topicLower.includes("dns") || topicLower.includes("network") || topicLower.includes("code") || topicLower.includes("tcp")) {
      questionsList = [
        {
          question: "Which transport layer protocol provides reliable, connection-oriented packet delivery?",
          options: ["UDP", "IP", "HTTP", "TCP"],
          correctIndex: 3,
          explanation: "TCP (Transmission Control Protocol) is connection-oriented and guarantees delivery, whereas UDP is connectionless and unreliable."
        },
        {
          question: "What does DNS stand for in networking?",
          options: ["Dynamic Node System", "Domain Name System", "Distributed Network Service", "Direct Network Serial"],
          correctIndex: 1,
          explanation: "DNS stands for Domain Name System. It resolves domain names (like google.com) to numeric IP addresses."
        },
        {
          question: "What is the standard port used for secure HTTPS web traffic?",
          options: ["80", "22", "443", "8080"],
          correctIndex: 2,
          explanation: "Port 443 is the standard port for HTTP Secure (HTTPS). HTTP uses port 80, and SSH uses port 22."
        }
      ];
    } else {
      questionsList = [
        {
          question: "What is the standard length of a focused work block in the classic Pomodoro Technique?",
          options: ["10 minutes", "25 minutes", "50 minutes", "90 minutes"],
          correctIndex: 1,
          explanation: "The standard Pomodoro Technique recommends 25 minutes of highly focused work followed by a 5-minute break."
        },
        {
          question: "Which study technique involves testing yourself on concepts rather than passively re-reading notes?",
          options: ["Passive review", "Highlighting", "Active recall", "Auditory mapping"],
          correctIndex: 2,
          explanation: "Active recall forces your brain to retrieve information from memory, which builds stronger neural connections than passive reading."
        },
        {
          question: "What is 'spaced repetition' in cognitive science?",
          options: ["Studying all night before an exam", "Reviewing information at increasing intervals over time", "Repeating the same word 100 times", "Taking breaks every 10 minutes"],
          correctIndex: 1,
          explanation: "Spaced repetition leverages the spacing effect, where information is reviewed at increasing intervals (e.g. 1 day, 3 days, 1 week) to prevent forgetting."
        }
      ];
    }

    return {
      topic: topic,
      questions: questionsList
    };
  }

  if (type === "softskills") {
    const id = payload.scenarioId || "speaking";
    let advice = "";

    if (id === "speaking") {
      advice = `Excellent statement! I appreciate your attempt. As your Public Speaking Coach, here is my feedback:\n\n- **Structure**: Your opening has a decent outline. Try inserting a dramatic pause after your key statistic to make it land.\n- **Clarity**: Keep your sentences slightly shorter to ensure your key message isn't lost in verbal complexity.\n\n*Let's try refining your introductory paragraph. Type another attempt or write 'next step' to proceed!*`;
    } else if (id === "time") {
      advice = `That is very honest of you, and recognizing the blockage is step number one! As your Time Management Coach, here is my recommendation:\n\n- **Micro-Action**: Do not try to solve the entire syllabus at once. Open your note, and let's set a timer for exactly 5 minutes of low-stress reading.\n- **Action Plan**: 1. Set study space. 2. Start 5min timer. 3. Stop immediately when it rings.\n\n*Would you like to draft a 5-minute task list right now? Let me know!*`;
    } else if (id === "interview") {
      advice = `A solid response! Here is how we can refine it using the **STAR** structure:\n\n- **Situation/Task**: You explained the failed milestone beautifully.\n- **Action/Result**: Make sure to elaborate on exactly what steps you took, and highlight a quantitative result or lessons learned!\n\n*Let's try phrasing your Action step again. Type it out!*`;
    } else {
      advice = `I hear you, and those feelings of overwhelm are completely natural. Take a slow, deep breath with me. Breathe in for four seconds... hold... breathe out.\n\n- **Mindfulness Tips**: Remember that exam grades measure specific retention, not your ultimate capability as a scholar.\n- **Gentle Step**: Put your textbook away for 10 minutes and listen to a calm song, then return with fresh focus.\n\n*I am right here with you. Tell me if there is a specific topic causing the most stress right now.*`;
    }

    return { text: advice };
  }

  throw new Error("Invalid fallback type requested.");
}

// Custom Fetch Interceptor
export function setupMockApi() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlStr = input.toString();

    // Check if it's an API request
    if (urlStr.includes('/api/')) {
      const url = new URL(urlStr, window.location.origin);
      const pathname = url.pathname;
      const method = init?.method?.toUpperCase() || 'GET';
      const body = init?.body ? JSON.parse(init.body as string) : null;

      const db = getClientDB();

      // Delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 250));

      // 1. Auth & Login
      if (pathname === '/api/auth/login' && method === 'POST') {
        const { email, name } = body;
        if (!email) {
          return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
        }

        let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          user = {
            id: "usr-" + Math.random().toString(36).substring(2, 9),
            name: name || email.split("@")[0],
            email: email,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
            level: 1,
            xp: 0,
            studyPoints: 0,
            streak: 1,
            lastStudyDate: new Date().toISOString().split("T")[0],
            targetHours: 4,
            categoryTargets: { "Mathematics": 60, "Physics": 60, "Computer Science": 60, "Language": 30, "Other": 30 }
          };
          db.users.push(user);
          saveClientDB(db);
        } else {
          // Check streak trigger
          const today = new Date().toISOString().split("T")[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

          if (user.lastStudyDate === yesterday) {
            user.streak += 1;
            user.lastStudyDate = today;
          } else if (user.lastStudyDate !== today) {
            user.streak = 1;
            user.lastStudyDate = today;
          }
          saveClientDB(db);
        }

        return new Response(JSON.stringify(user), { status: 200 });
      }

      // 1.2 Profiles
      if (pathname.startsWith('/api/profile/') && method === 'GET') {
        const userId = pathname.split('/').pop();
        const user = db.users.find(u => u.id === userId);
        if (!user) {
          return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(user), { status: 200 });
      }

      if (pathname.startsWith('/api/profile/') && method === 'PUT') {
        const userId = pathname.split('/').pop();
        const index = db.users.findIndex(u => u.id === userId);
        if (index === -1) {
          return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        db.users[index] = { ...db.users[index], ...body };
        saveClientDB(db);
        return new Response(JSON.stringify(db.users[index]), { status: 200 });
      }

      // 2. Focus Sessions
      if (pathname.startsWith('/api/focus/sessions/') && method === 'GET') {
        const userId = pathname.split('/').pop();
        const userSessions = db.sessions.filter(s => s.userId === userId || s.userId === "any");
        return new Response(JSON.stringify(userSessions), { status: 200 });
      }

      if (pathname === '/api/focus/sessions' && method === 'POST') {
        const { userId, duration, category, notes, completed } = body;
        const newSession: FocusSession = {
          id: "sess-" + Math.random().toString(36).substring(2, 9),
          userId,
          duration: Number(duration),
          category: category || "Other",
          timestamp: new Date().toISOString(),
          notes: notes || "",
          completed: !!completed
        };

        db.sessions.push(newSession);

        // Update user XP & study points
        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          const addedXP = Math.floor(Number(duration) * 1.5);
          const addedPoints = Math.floor(Number(duration) * 1.0);

          db.users[userIndex].xp += addedXP;
          db.users[userIndex].studyPoints += addedPoints;
          db.users[userIndex].level = Math.floor(db.users[userIndex].xp / 1000) + 1;
          db.users[userIndex].lastStudyDate = new Date().toISOString().split("T")[0];
        }

        saveClientDB(db);
        return new Response(JSON.stringify({ session: newSession, updatedUser: db.users[userIndex] || null }), { status: 200 });
      }

      // 3. Syllabus Tracker
      if (pathname.startsWith('/api/syllabus/') && method === 'GET') {
        const userId = pathname.split('/').pop();
        const list = db.syllabus.filter(s => s.userId === userId || s.userId === "any");
        return new Response(JSON.stringify(list), { status: 200 });
      }

      if (pathname === '/api/syllabus' && method === 'POST') {
        const { userId, subject, chapter, topic, status } = body;
        const newItem: SyllabusTopic = {
          id: "topic-" + Math.random().toString(36).substring(2, 9),
          userId,
          subject,
          chapter,
          topic,
          status: status || "pending",
          lastReviewed: new Date().toISOString()
        };

        db.syllabus.push(newItem);
        saveClientDB(db);
        return new Response(JSON.stringify(newItem), { status: 201 });
      }

      if (pathname.startsWith('/api/syllabus/') && method === 'PUT') {
        const id = pathname.split('/').pop();
        const index = db.syllabus.findIndex(s => s.id === id);
        if (index === -1) {
          return new Response(JSON.stringify({ error: "Topic not found" }), { status: 404 });
        }

        db.syllabus[index] = {
          ...db.syllabus[index],
          ...body,
          lastReviewed: new Date().toISOString()
        };
        saveClientDB(db);
        return new Response(JSON.stringify(db.syllabus[index]), { status: 200 });
      }

      if (pathname.startsWith('/api/syllabus/') && method === 'DELETE') {
        const id = pathname.split('/').pop();
        db.syllabus = db.syllabus.filter(s => s.id !== id);
        saveClientDB(db);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      // 4. Notes Store
      if (pathname.startsWith('/api/notes/') && method === 'GET') {
        const userId = pathname.split('/').pop();
        const list = db.notes.filter(n => n.userId === userId || n.userId === "any");
        return new Response(JSON.stringify(list), { status: 200 });
      }

      if (pathname === '/api/notes' && method === 'POST') {
        const { userId, title, content, category } = body;
        const newNote: StudyNote = {
          id: "note-" + Math.random().toString(36).substring(2, 9),
          userId,
          title: title || "Untitled Note",
          content: content || "",
          category: category || "Other",
          timestamp: new Date().toISOString()
        };

        db.notes.push(newNote);
        saveClientDB(db);
        return new Response(JSON.stringify(newNote), { status: 201 });
      }

      if (pathname.startsWith('/api/notes/') && method === 'PUT') {
        const id = pathname.split('/').pop();
        const index = db.notes.findIndex(n => n.id === id);
        if (index === -1) {
          return new Response(JSON.stringify({ error: "Note not found" }), { status: 404 });
        }

        db.notes[index] = { ...db.notes[index], ...body };
        saveClientDB(db);
        return new Response(JSON.stringify(db.notes[index]), { status: 200 });
      }

      if (pathname.startsWith('/api/notes/') && pathname.endsWith('/ai-summarize') && method === 'POST') {
        const noteId = pathname.split('/')[3];
        const index = db.notes.findIndex(n => n.id === noteId);
        if (index === -1) {
          return new Response(JSON.stringify({ error: "Note not found" }), { status: 404 });
        }

        const note = db.notes[index];
        const aiData = getLocalAIResponse("summarize", { title: note.title, content: note.content });
        db.notes[index].summary = aiData.summary;
        db.notes[index].flashcards = aiData.flashcards;
        saveClientDB(db);

        return new Response(JSON.stringify(db.notes[index]), { status: 200 });
      }

      if (pathname.startsWith('/api/notes/') && method === 'DELETE') {
        const id = pathname.split('/').pop();
        db.notes = db.notes.filter(n => n.id !== id);
        saveClientDB(db);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      // 5. Exam Goals
      if (pathname.startsWith('/api/exams/') && method === 'GET') {
        const userId = pathname.split('/').pop();
        const list = db.exams.filter(e => e.userId === userId || e.userId === "any");
        return new Response(JSON.stringify(list), { status: 200 });
      }

      if (pathname === '/api/exams' && method === 'POST') {
        const { userId, title, date, subject, preparationLevel } = body;
        const newExam: ExamGoal = {
          id: "exam-" + Math.random().toString(36).substring(2, 9),
          userId,
          title: title || "New Exam",
          date: date || new Date(Date.now() + 86400000 * 7).toISOString(),
          subject: subject || "Other",
          preparationLevel: Number(preparationLevel) || 50,
          tasks: [
            { id: "t-" + Math.random().toString(36).substring(2, 5), text: "Review chapter key milestones", done: false },
            { id: "t-" + Math.random().toString(36).substring(2, 5), text: "Take dynamic practice quiz", done: false }
          ]
        };

        db.exams.push(newExam);
        saveClientDB(db);
        return new Response(JSON.stringify(newExam), { status: 201 });
      }

      if (pathname.startsWith('/api/exams/') && method === 'PUT') {
        const id = pathname.split('/').pop();
        const index = db.exams.findIndex(e => e.id === id);
        if (index === -1) {
          return new Response(JSON.stringify({ error: "Exam not found" }), { status: 404 });
        }

        db.exams[index] = { ...db.exams[index], ...body };
        saveClientDB(db);
        return new Response(JSON.stringify(db.exams[index]), { status: 200 });
      }

      if (pathname.startsWith('/api/exams/') && method === 'DELETE') {
        const id = pathname.split('/').pop();
        db.exams = db.exams.filter(e => e.id !== id);
        saveClientDB(db);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      // 6. Collaborative Rooms
      if (pathname === '/api/rooms' && method === 'GET') {
        return new Response(JSON.stringify(db.rooms), { status: 200 });
      }

      if (pathname.startsWith('/api/rooms/') && pathname.endsWith('/join') && method === 'POST') {
        const roomId = pathname.split('/')[3];
        const { userId, userName, avatar, xp } = body;
        const roomIndex = db.rooms.findIndex(r => r.id === roomId);
        if (roomIndex === -1) {
          return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
        }

        // Clean from other rooms
        db.rooms.forEach(r => {
          r.members = r.members.filter(m => m.userId !== userId);
        });

        const member = {
          userId,
          userName,
          avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`,
          xp: xp || 0,
          currentActivity: "Focusing (In Room)"
        };

        db.rooms[roomIndex].members.push(member);
        saveClientDB(db);
        return new Response(JSON.stringify(db.rooms[roomIndex]), { status: 200 });
      }

      if (pathname.startsWith('/api/rooms/') && pathname.endsWith('/chat') && method === 'POST') {
        const roomId = pathname.split('/')[3];
        const { userName, text } = body;
        const roomIndex = db.rooms.findIndex(r => r.id === roomId);
        if (roomIndex === -1) {
          return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
        }

        const newMsg = {
          id: "msg-" + Math.random().toString(36).substring(2, 9),
          userName: userName || "Anonymous Scholar",
          text,
          timestamp: new Date().toISOString()
        };

        db.rooms[roomIndex].chat.push(newMsg);
        if (db.rooms[roomIndex].chat.length > 30) {
          db.rooms[roomIndex].chat.shift();
        }

        saveClientDB(db);
        return new Response(JSON.stringify(db.rooms[roomIndex]), { status: 200 });
      }

      // 7. Leaderboards
      if (pathname === '/api/leaderboards' && method === 'GET') {
        const list = db.users.map(u => ({
          userId: u.id,
          userName: u.name,
          avatar: u.avatar,
          xp: u.xp || 0,
          streak: u.streak || 1
        }));

        list.sort((a, b) => b.xp - a.xp);
        const ranked = list.map((entry, idx) => ({
          ...entry,
          rank: idx + 1
        }));

        return new Response(JSON.stringify(ranked), { status: 200 });
      }

      // 8. AI Chat
      if (pathname === '/api/ai/chat' && method === 'POST') {
        const { prompt } = body;
        const reply = getLocalAIResponse("chat", { prompt });
        return new Response(JSON.stringify(reply), { status: 200 });
      }

      // 9. AI Quiz
      if (pathname === '/api/ai/quiz' && method === 'POST') {
        const { topicName } = body;
        const quiz = getLocalAIResponse("quiz", { topicName });
        return new Response(JSON.stringify(quiz), { status: 200 });
      }

      // 10. AI Softskills
      if (pathname === '/api/ai/softskills' && method === 'POST') {
        const { scenarioId } = body;
        const reply = getLocalAIResponse("softskills", { scenarioId });
        return new Response(JSON.stringify(reply), { status: 200 });
      }
    }

    // Default to native fetch for standard/static resources
    return originalFetch(input, init);
  };
}
