import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, RotateCcw, Dumbbell, Flame, Trophy, TrendingUp, Clock, 
  Play, Pause, SkipForward, Edit2, Save, X 
} from 'lucide-react';

const WorkoutProgram = () => {
  const workouts = {
    day1: {
      name: 'Day 1',
      subtitle: 'Chest, Shoulders, Biceps',
      color: 'from-blue-600 to-cyan-600',
      accent: 'blue',
      exercises: [
        { name: 'Bench Press', sets: 3, reps: '6-10', rest: '2-3 min', muscle: 'Main chest mass builder', image: '/images/bench-press.gif' },
        { name: 'Incline Dumbbell Bench Press', sets: 3, reps: '8-12', rest: '2-3 min', muscle: 'Upper chest', image: '/images/incline-dumbbell-press.gif' },
        { name: 'Dumbbell Shoulder Press', sets: 3, reps: '8-12', rest: '2 min', muscle: 'Overall shoulder mass', image: '/images/dumbbell-shoulder-press.gif' },
        { name: 'Cable Lateral Raise', sets: 3, reps: '12-15', rest: '90 sec', muscle: 'Side delts', image: '/images/cable-lateral-raise.gif' },
        { name: 'Cable Rear Delt Fly', sets: 3, reps: '15-20', rest: '90 sec', muscle: 'Rear delts', image: '/images/cable-rear-delt-fly.gif' },
        { name: 'Cable Bicep Curl', sets: 3, reps: '8-12', rest: '90 sec', muscle: 'Bicep mass', image: '/images/cable-bicep-curl.gif' },
        { name: 'Dumbbell Hammer Curl', sets: 3, reps: '10-15', rest: '90 sec', muscle: 'Brachialis and long head', image: '/images/dumbbell-hammer-curl.gif' },
      ]
    },
    day2: {
      name: 'Day 2',
      subtitle: 'Back & Triceps',
      color: 'from-purple-600 to-pink-600',
      accent: 'purple',
      exercises: [
        { name: 'Cable Lat Pulldown (Wide Grip)', sets: 3, reps: '8-12', rest: '2-3 min', muscle: 'Lat width', image: '/images/cable-lat-pulldown.gif' },
        { name: 'Cable Seated Row', sets: 3, reps: '8-12', rest: '2-3 min', muscle: 'Mid-back thickness', image: '/images/cable-seated-row.gif' },
        { name: 'Cable Lat Pullover', sets: 3, reps: '10-12', rest: '2 min', muscle: 'Lower lats', image: '/images/cable-lat-pullover.gif' },
        { name: 'Smith Machine Shrugs', sets: 2, reps: '12-15', rest: '90 sec', muscle: 'Upper traps', image: '/images/smith-machine-shrugs.gif' },
        { name: 'Cable Tricep Pushdown', sets: 3, reps: '10-15', rest: '90 sec', muscle: 'Lateral head', image: '/images/cable-tricep-pushdown.gif' },
        { name: 'Overhead Cable Tricep Extension', sets: 3, reps: '12-15', rest: '90 sec', muscle: 'Long head', image: '/images/cable-rope-overhead-extension.gif' },
      ]
    },
    day3: {
      name: 'Day 3',
      subtitle: 'Legs & Abs',
      color: 'from-orange-600 to-red-600',
      accent: 'orange',
      exercises: [
        { name: 'Smith Machine Squat', sets: 3, reps: '6-10', rest: '2-3 min', muscle: 'Quads and glutes', image: '/images/smith-machine-squat.gif' },
        { name: 'Smith Machine RDL', sets: 3, reps: '8-12', rest: '2-3 min', muscle: 'Hamstrings and glutes', image: '/images/smith-machine-rdl.gif' },
        { name: 'Dumbbell Bulgarian Split Squat', sets: 2, reps: '10-12/side', rest: '2 min', muscle: 'Unilateral leg work', image: '/images/bulgarian-split-squat.gif' },
        { name: 'Dumbbell Stiff-Leg Deadlift', sets: 2, reps: '10-12', rest: '2 min', muscle: 'Hamstring stretch', image: '/images/dumbbell-stiff-leg-deadlift.gif' },
        { name: 'Smith Machine Calf Raise', sets: 3, reps: '12-15', rest: '90 sec', muscle: 'Calves', image: '/images/smith-calf-raise.gif' },
        { name: 'Cable Ab Crunch', sets: 3, reps: '15-20', rest: '90 sec', muscle: 'Upper abs', image: '/images/cable-crunch.gif' },
        { name: 'Hanging Leg Raises', sets: 2, reps: '12-15', rest: '90 sec', muscle: 'Lower abs', image: '/images/hanging-leg-raise.gif' }
      ]
    }
  };

  // State
  const [selectedWorkout, setSelectedWorkout] = useState('day1');
  const [completedSets, setCompletedSets] = useState({});
  const [weights, setWeights] = useState({});
  
  const [showWarmup, setShowWarmup] = useState(true);
  const [warmupTime, setWarmupTime] = useState(300); // 5 minutes in seconds
  const [warmupEndTime, setWarmupEndTime] = useState(null);
  const [isWarmupRunning, setIsWarmupRunning] = useState(false);

  const [restTime, setRestTime] = useState(0);
  const [restEndTime, setRestEndTime] = useState(null);
  const [isRestRunning, setIsRestRunning] = useState(false);
  const [currentRestDuration, setCurrentRestDuration] = useState(0);
  
  const [editingWeight, setEditingWeight] = useState(null);
  const [showingImage, setShowingImage] = useState(null);

  const warmupIntervalRef = useRef(null);
  const restIntervalRef = useRef(null);

  // === Data Persistence (localStorage) ===
  useEffect(() => {
    // Load from localStorage on mount
    const savedWeights = localStorage.getItem('workoutWeights');
    const savedSets = localStorage.getItem('workoutCompletedSets');
    const savedWorkout = localStorage.getItem('workoutSelected');

    if (savedWeights) setWeights(JSON.parse(savedWeights));
    if (savedSets) setCompletedSets(JSON.parse(savedSets));
    if (savedWorkout) setSelectedWorkout(savedWorkout);
  }, []);

  useEffect(() => {
    // Save to localStorage on change
    localStorage.setItem('workoutWeights', JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    // Save to localStorage on change
    localStorage.setItem('workoutCompletedSets', JSON.stringify(completedSets));
  }, [completedSets]);

  useEffect(() => {
    // Save to localStorage on change
    localStorage.setItem('workoutSelected', selectedWorkout);
  }, [selectedWorkout]);

  // === Timer Logic (Background-Resistant) ===

  // Warmup Timer Effect
  useEffect(() => {
    if (isWarmupRunning && warmupEndTime) {
      warmupIntervalRef.current = setInterval(() => {
        const remaining = warmupEndTime - Date.now();
        if (remaining <= 0) {
          clearInterval(warmupIntervalRef.current);
          setIsWarmupRunning(false);
          setWarmupTime(0);
          setWarmupEndTime(null);
        } else {
          setWarmupTime(Math.ceil(remaining / 1000));
        }
      }, 500); // Check every 500ms
    } else {
      if (warmupIntervalRef.current) {
        clearInterval(warmupIntervalRef.current);
      }
    }
    return () => {
      if (warmupIntervalRef.current) {
        clearInterval(warmupIntervalRef.current);
      }
    };
  }, [isWarmupRunning, warmupEndTime]);

  // Rest Timer Effect
  useEffect(() => {
    if (isRestRunning && restEndTime) {
      restIntervalRef.current = setInterval(() => {
        const remaining = restEndTime - Date.now();
        if (remaining <= 0) {
          clearInterval(restIntervalRef.current);
          setIsRestRunning(false);
          setRestTime(0);
          setRestEndTime(null);
        } else {
          setRestTime(Math.ceil(remaining / 1000));
        }
      }, 500); // Check every 500ms
    } else {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
      }
    }
    return () => {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
      }
    };
  }, [isRestRunning, restEndTime]);

  const toggleWarmup = () => {
    if (isWarmupRunning) {
      // Pausing
      setIsWarmupRunning(false);
      if (warmupIntervalRef.current) clearInterval(warmupIntervalRef.current);
      if (warmupEndTime) {
        setWarmupTime(Math.ceil((warmupEndTime - Date.now()) / 1000));
      }
      setWarmupEndTime(null);
    } else {
      // Starting / Resuming
      setIsWarmupRunning(true);
      setWarmupEndTime(Date.now() + warmupTime * 1000);
    }
  };

  const resetWarmup = () => {
    setIsWarmupRunning(false);
    setWarmupTime(300);
    setWarmupEndTime(null);
    if (warmupIntervalRef.current) {
      clearInterval(warmupIntervalRef.current);
    }
  };

  const startWarmup = () => {
    setShowWarmup(true);
    resetWarmup();
  };

  const finishWarmup = () => {
    setShowWarmup(false);
  };

  const startRestTimer = (restMinutes) => {
    // Parse rest time
    let seconds = 0;
    if (restMinutes.includes('sec')) {
      seconds = parseInt(restMinutes);
    } else if (restMinutes.includes('-')) {
      const [min1, min2] = restMinutes.match(/\d+/g).map(Number);
      seconds = ((min1 + min2) / 2) * 60;
    } else {
      seconds = parseInt(restMinutes) * 60;
    }
    setCurrentRestDuration(seconds);
    setRestTime(seconds);
    setRestEndTime(Date.now() + seconds * 1000);
    setIsRestRunning(true);
  };

  const toggleRest = () => {
    if (isRestRunning) {
      // Pausing
      setIsRestRunning(false);
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
      if (restEndTime) {
        setRestTime(Math.ceil((restEndTime - Date.now()) / 1000));
      }
      setRestEndTime(null);
    } else {
      // Resuming
      if (restTime > 0) {
        setIsRestRunning(true);
        setRestEndTime(Date.now() + restTime * 1000);
      }
    }
  };

  const skipRest = () => {
    setIsRestRunning(false);
    setRestTime(0);
    setRestEndTime(null);
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // === Weight Tracking ===
  const getWeightKey = (exerciseName) => {
    return `${selectedWorkout}-${exerciseName}`;
  };

  const getWeight = (exerciseName) => {
    const key = getWeightKey(exerciseName);
    return weights[key] || '';
  };

  const saveWeight = (exerciseName, weight) => {
    const key = getWeightKey(exerciseName);
    setWeights(prev => ({
      ...prev,
      [key]: weight
    }));
    setEditingWeight(null);
  };

  const startEditingWeight = (exerciseName) => {
    setEditingWeight(exerciseName);
  };

  // === Set Tracking ===
  const toggleSet = (exerciseIndex, setNumber, restMinutes) => {
    const key = `${selectedWorkout}-${exerciseIndex}-${setNumber}`;
    const wasCompleted = completedSets[key];
    
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    if (!wasCompleted) {
      startRestTimer(restMinutes);
    } else {
      skipRest(); // Optionally skip rest if unchecking a set
    }
  };

  const isSetCompleted = (exerciseIndex, setNumber) => {
    const key = `${selectedWorkout}-${exerciseIndex}-${setNumber}`;
    return completedSets[key] || false;
  };

  // === Workout Progress & Reset ===
  const resetWorkout = () => {
    // Clear only sets for the current workout
    const newCompletedSets = { ...completedSets };
    Object.keys(newCompletedSets).forEach(key => {
      if (key.startsWith(selectedWorkout)) {
        delete newCompletedSets[key];
      }
    });
    setCompletedSets(newCompletedSets);
    
    // Clear weights for the current workout
    const newWeights = { ...weights };
    Object.keys(newWeights).forEach(key => {
      if (key.startsWith(selectedWorkout)) {
        delete newWeights[key];
      }
    });
    setWeights(newWeights);

    skipRest();
  };

  const getWorkoutProgress = () => {
    const workout = workouts[selectedWorkout];
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completed = Object.keys(completedSets).filter(
      key => key.startsWith(selectedWorkout) && completedSets[key]
    ).length;
    return { completed, total: totalSets };
  };

  const progress = getWorkoutProgress();
  const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
  const currentWorkout = workouts[selectedWorkout];

  // === Render ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      
      <div className="fixed inset-0 animated-stars z-0" />

      {/* Image Modal */}
      {showingImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 touch-manipulation"
          onClick={() => setShowingImage(null)}
        >
          <div 
            className="relative bg-slate-800 p-4 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowingImage(null)}
              className="absolute -top-3 -right-3 z-10 bg-red-600 text-white p-2 rounded-full shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={showingImage} 
              alt="Exercise illustration" 
              className="rounded-lg max-w-full max-h-[80vh] object-contain"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x300.png?text=Image+Not+Found";
              }}
            />
          </div>
        </div>
      )}

      <div className="relative max-w-2xl mx-auto p-4 pb-32 z-10">
        {/* Warmup Screen */}
        {showWarmup && (
          <div className="mb-5 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl flex-shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold truncate">Pre-Workout Warmup</h2>
                <p className="text-white/80 text-xs">Get your body ready</p>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-5 mb-3">
              <div className="text-center mb-4">
                <div className="text-5xl sm:text-6xl font-bold mb-2">{formatTime(warmupTime)}</div>
                <div className="text-white/80 text-sm font-medium">
                  {warmupTime === 0 ? 'Warmup Complete!' : 'Time Remaining'}
                </div>
              </div>

              <div className="w-full bg-black/30 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-white h-2 transition-all duration-1000"
                  style={{ width: `${((300 - warmupTime) / 300) * 100}%` }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={toggleWarmup}
                  className="flex-1 bg-white/20 hover:bg-white/30 active:bg-white/40 active:scale-95 backdrop-blur-sm py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 touch-manipulation"
                >
                  {isWarmupRunning ? (
                    <>
                      <Pause className="w-5 h-5 flex-shrink-0" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 flex-shrink-0" />
                      <span>{warmupTime === 300 ? 'Start' : 'Resume'}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={resetWarmup}
                  className="bg-white/20 hover:bg-white/30 active:bg-white/40 active:scale-95 backdrop-blur-sm px-4 py-3.5 rounded-xl font-bold transition-all touch-manipulation flex-shrink-0"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              onClick={finishWarmup}
              className="w-full bg-white/20 hover:bg-white/30 active:bg-white/40 active:scale-95 backdrop-blur-sm py-3.5 rounded-xl font-bold transition-all touch-manipulation"
            >
              Skip Warmup & Start Workout
            </button>
          </div>
        )}

        {/* Rest Timer - Fixed at bottom */}
        {restTime > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-600 to-blue-600 shadow-2xl z-40 safe-area-bottom">
            <div className="max-w-2xl mx-auto p-4">
              <div className="flex items-center justify-between mb-3 gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-base truncate">Rest Period</div>
                    <div className="text-white/80 text-xs truncate">Take your time to recover</div>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold flex-shrink-0">{formatTime(restTime)}</div>
              </div>

              <div className="w-full bg-black/30 rounded-full h-2 mb-3 overflow-hidden">
                <div
                  className="bg-white h-2 transition-all duration-1000"
                  style={{ width: `${currentRestDuration > 0 ? ((currentRestDuration - restTime) / currentRestDuration) * 100 : 0}%` }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={toggleRest}
                  className="flex-1 bg-white/20 hover:bg-white/30 active:bg-white/40 active:scale-95 backdrop-blur-sm py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 touch-manipulation"
                >
                  {isRestRunning ? (
                    <>
                      <Pause className="w-5 h-5 flex-shrink-0" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 flex-shrink-0" />
                      <span>Resume</span>
                    </>
                  )}
                </button>
                <button
                  onClick={skipRest}
                  className="bg-white/20 hover:bg-white/30 active:bg-white/40 active:scale-95 backdrop-blur-sm px-5 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 touch-manipulation flex-shrink-0"
                >
                  <SkipForward className="w-5 h-5" />
                  <span className="hidden sm:inline">Skip</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header with Gradient */}
        <div className={`bg-gradient-to-r ${currentWorkout.color} rounded-2xl p-5 mb-5 shadow-2xl`}>
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl flex-shrink-0">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">3-Day Push/Pull/Legs Split</h1>
                <p className="text-white/80 text-xs font-medium truncate">Balanced muscle development</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl flex-shrink-0">
              <div className="text-xs text-white/80 font-medium whitespace-nowrap">Frequency</div>
              <div className="text-base font-bold whitespace-nowrap">3x/week</div>
            </div>
          </div>
          {/* Progress Section */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold">Today's Progress</span>
              </div>
              <button
                onClick={startWarmup}
                className="bg-white/20 hover:bg-white/30 active:bg-white/40 active:scale-95 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1 touch-manipulation"
              >
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>Warmup</span>
              </button>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold">
                {progress.completed}/{progress.total}
              </span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-white to-white/80 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Workout Selector - Updated for 3 workouts */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {Object.entries(workouts).map(([key, workout]) => {
            const isActive = selectedWorkout === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedWorkout(key)}
                className={`relative overflow-hidden rounded-xl p-3.5 transition-all duration-300 touch-manipulation ${
                  isActive
                    ? 'shadow-2xl scale-105'
                    : 'bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800 active:bg-slate-700 active:scale-95 shadow-lg'
                }`}
                style={isActive ? {
                  background: `linear-gradient(135deg, ${
                    key === 'day1' ? 'rgb(37, 99, 235), rgb(8, 145, 178)' :
                    key === 'day2' ? 'rgb(147, 51, 234), rgb(219, 39, 119)' :
                    'rgb(234, 88, 12), rgb(220, 38, 38)'
                  })`
                } : {}}
              >
                <div className="text-lg font-bold mb-1 truncate">{workout.name}</div>
                <div className={`text-xs font-medium truncate ${
                  isActive ? 'text-white/90' : 'text-slate-400'
                }`}>
                  {workout.subtitle}
                </div>
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Exercises */}
        <div className="space-y-4 mb-5">
          {currentWorkout.exercises.map((exercise, exerciseIndex) => {
            const completedCount = [...Array(exercise.sets)].filter(
              (_, i) => isSetCompleted(exerciseIndex, i + 1)
            ).length;
            const allCompleted = completedCount === exercise.sets;

            return (
              <div
                key={exerciseIndex}
                className={`bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm rounded-2xl p-4 shadow-xl border transition-all duration-300 ${
                  allCompleted
                    ? 'border-green-500/50 shadow-green-500/20'
                    : 'border-slate-700/50'
                }`}
              >
                {/* Exercise Header */}
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <button 
                        onClick={() => setShowingImage(exercise.image)}
                        className="font-bold text-base sm:text-lg truncate text-left hover:text-cyan-400 transition-colors"
                      >
                        {exercise.name}
                      </button>
                      {allCompleted && (
                        <div className="bg-green-500/20 backdrop-blur-sm px-2 py-1 rounded-full flex-shrink-0">
                          <Trophy className="w-4 h-4 text-green-400" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400 font-medium mb-1 truncate">
                      {exercise.muscle}
                    </div>
                    
                    {/* Weight Tracker */}
                    <div className="mt-2">
                      {editingWeight === exercise.name ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder="Weight"
                            defaultValue={getWeight(exercise.name)}
                            className="bg-slate-900/50 text-white rounded-lg px-3 py-2.5 w-24 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 touch-manipulation"
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                saveWeight(exercise.name, e.target.value);
                                e.target.blur();
                              }
                            }}
                            id={`weight-${exerciseIndex}`}
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(`weight-${exerciseIndex}`);
                              saveWeight(exercise.name, input.value);
                            }}
                            className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 active:scale-95 p-2.5 rounded-lg transition-all touch-manipulation flex-shrink-0"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingWeight(exercise.name)}
                          className="bg-slate-900/50 hover:bg-slate-900/70 active:bg-slate-900 active:scale-95 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all flex items-center gap-2 touch-manipulation"
                        >
                          <Dumbbell className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <span className="truncate">
                            {getWeight(exercise.name) ? (
                              `${getWeight(exercise.name)} kg`
                            ) : (
                              <span className="text-slate-500">Add weight</span>
                            )}
                          </span>
                          <Edit2 className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                      {completedCount}/{exercise.sets}
                    </div>
                    <div className="text-xs text-slate-500 font-medium whitespace-nowrap">sets done</div>
                  </div>
                </div>

                {/* Exercise Details */}
                <div className="flex gap-2 mb-4 text-sm">
                  <div className="bg-slate-900/50 rounded-lg px-3 py-2 flex-1 min-w-0">
                    <div className="text-slate-400 text-xs mb-1">Reps</div>
                    <div className="font-bold text-white truncate">{exercise.reps}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg px-3 py-2 flex-1 min-w-0">
                    <div className="text-slate-400 text-xs mb-1">Rest</div>
                    <div className="font-bold text-white truncate">{exercise.rest}</div>
                  </div>
                </div>

                {/* Set Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(exercise.sets)].map((_, setIndex) => {
                    const setNumber = setIndex + 1;
                    const completed = isSetCompleted(exerciseIndex, setNumber);
                    return (
                      <button
                        key={setIndex}
                        onClick={() => toggleSet(exerciseIndex, setNumber, exercise.rest)}
                        className={`relative overflow-hidden py-3.5 rounded-xl font-bold transition-all duration-300 touch-manipulation ${
                          completed
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50 scale-105'
                            : 'bg-slate-700/50 hover:bg-slate-700 active:bg-slate-600 active:scale-95 shadow-md'
                        }`}
                      >
                        {completed ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <Check className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">Done</span>
                          </div>
                        ) : (
                          <span className="text-sm">Set {setNumber}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset Button */}
        <button
          onClick={resetWorkout}
          className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 active:from-slate-500 active:to-slate-400 active:scale-95 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg touch-manipulation mb-5"
        >
          <RotateCcw className="w-5 h-5 flex-shrink-0" />
          <span>Reset Current Workout</span>
        </button>

        {/* Program Info Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-cyan-400 flex-shrink-0" />
            <h3 className="font-bold text-base sm:text-lg">Program Guidelines</h3>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-3 bg-slate-900/30 rounded-lg p-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-white">Training Schedule:</span> 3 sessions per week (Mon/Wed/Fri or similar with rest days between)
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-900/30 rounded-lg p-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-white">Workout Rotation:</span> Chest/Shoulders/Biceps → Back/Triceps → Legs/Abs
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-900/30 rounded-lg p-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-white">Weekly Volume:</span> Chest: 6 sets | Shoulders: 9 sets | Biceps: 6 sets | Back: 11 sets | Triceps: 6 sets | Legs: 24 sets | Abs: 5 sets
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-900/30 rounded-lg p-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-white">Progressive Overload:</span> Increase weight or reps when you can complete all sets with good form
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-900/30 rounded-lg p-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-white">Best For:</span> Balanced muscle development with dedicated focus days for each major muscle group
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animated-stars {
          background: 
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 90%, white, transparent);
          background-size: 200% 200%;
          animation: stars 20s ease-in-out infinite;
          opacity: 0.4;
        }
        
        @keyframes stars {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }
        
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};

export default WorkoutProgram;