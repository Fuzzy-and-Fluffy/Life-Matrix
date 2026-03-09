import { useState, useEffect } from 'react';
import { auth, db } from './utils/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import RadarChart from './components/RadarChart';
import Icon from './components/Icon';
import { INITIAL_DIMS } from './constants/initialDims';
import { calculateLevel, calculateBalance } from './utils/algorithms';

const STORAGE_KEY = 'life_matrix_v4_data';

function App() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [dimensions, setDimensions] = useState(INITIAL_DIMS);
  const [scores, setScores] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  
  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.name) setName(data.name);
        if (data.avatar) setAvatar(data.avatar);
        if (data.dimensions) setDimensions(data.dimensions);
        if (data.scores) setScores(data.scores);
        if (data.history) setHistory(data.history);
        if (data.dimensions && data.dimensions.length > 0) {
          setStep(4); // Go to dashboard
        }
      }
    } catch (e) {
      console.error("LocalStorage load error", e);
    }
  }, []);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Save data function
  const saveData = (newScores, newHistory, newDims, newName, newAvatar) => {
    const data = {
      name: newName !== undefined ? newName : name,
      avatar: newAvatar !== undefined ? newAvatar : avatar,
      dimensions: newDims || dimensions,
      scores: newScores || scores,
      history: newHistory || history,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("LocalStorage save error", e);
    }

    // TODO: Sync to Firestore if logged in
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Google sign-in error", e);
    }
  };

  // Enter matrix
  const enterMatrix = () => {
    const initScores = new Array(dimensions.length).fill(0);
    setScores(initScores);
    setStep(4);
    saveData(initScores, [], null);
  };

  // Add record
  const handleRecordAdd = (dimIdx, text) => {
    const dim = dimensions[dimIdx];
    const newScores = [...scores];
    while (newScores.length <= dimIdx) newScores.push(0);
    newScores[dimIdx] = (newScores[dimIdx] || 0) + 1;

    const entry = {
      id: `rec_${Date.now()}`,
      dimName: dim?.name || "未知",
      dimColor: dim?.color || "bg-slate-400",
      text: text,
      tags: [],
      pts: 1,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    const newHistory = [entry, ...history].slice(0, 100);
    setScores(newScores);
    setHistory(newHistory);
    saveData(newScores, newHistory);
  };

  const totalExp = (scores || []).reduce((a, b) => a + b, 0);
  const totalLevel = calculateLevel(totalExp);
  const balanceValue = calculateBalance(scores);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  // Step 1: Login/Register
  if (step === 1 && !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-xl text-center">
          <div className="mb-8 space-y-4">
            <div className="inline-flex p-4 bg-sky-50 rounded-2xl text-sky-500">
              <Icon name="sparkle" size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-800">你好，旅行者。</h1>
            <p className="text-slate-400 text-sm">欢迎进入人生这场无限游戏。</p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all mb-4"
          >
            <Icon name="google" size={20} />
            <span className="font-bold text-sm text-slate-700">使用 Google 继续</span>
          </button>

          <button 
            onClick={() => setStep(2)} 
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
          >
            游客进入
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Setup profile
  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-xl text-center">
          <h1 className="text-2xl font-black text-slate-800 mb-6">开始设置</h1>
          <div className="space-y-6">
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="输入你的昵称" 
              className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-center font-bold outline-none focus:ring-2 focus:ring-sky-500" 
            />
            <button 
              onClick={() => name && setStep(3)} 
              disabled={!name}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${
                name ? 'bg-slate-900 text-white hover:scale-[1.02]' : 'bg-slate-100 text-slate-300'
              } transition-all`}
            >
              开始设置
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Confirm dimensions
  if (step === 3) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-xl">
          <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">选择你的维度</h3>
          <RadarChart dimensions={dimensions} scores={new Array(dimensions.length).fill(0)} onLabelClick={() => {}} size={300} />
          <div className="mt-6 flex gap-4">
            <button onClick={() => setStep(2)} className="flex-1 py-4 text-slate-400 font-bold text-xs uppercase border border-slate-100 rounded-2xl">修改</button>
            <button onClick={enterMatrix} className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase">进入矩阵</button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Dashboard
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-xl font-black text-slate-800 mb-2">{name || '旅行者'}</h2>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 px-3 py-1 rounded-lg">
              <span className="text-[10px] font-black text-white uppercase">Lv.{totalLevel}</span>
            </div>
            <div className="bg-white border border-slate-200 px-3 py-1 rounded-lg">
              <span className="text-[10px] font-bold text-slate-600">平衡度 {balanceValue}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-4xl bg-white rounded-[4rem] p-8 shadow-xl mb-10">
        <RadarChart 
          dimensions={dimensions} 
          scores={scores} 
          onLabelClick={(idx) => {
            const text = prompt(`记录 ${dimensions[idx].name} 的进展：`);
            if (text) handleRecordAdd(idx, text);
          }} 
          size={480} 
        />
      </div>

      <div className="w-full max-w-4xl">
        <h3 className="text-lg font-black text-slate-800 mb-4">最近进展</h3>
        <div className="space-y-2">
          {history.slice(0, 10).map(record => (
            <div key={record.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full ${record.dimColor} mt-1`} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700">{record.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{record.dimName} · {record.dateStr}</p>
                </div>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-center text-slate-400 py-8">还没有记录，点击雷达图开始记录吧！</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
