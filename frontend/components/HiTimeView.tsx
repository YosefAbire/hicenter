"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Zap,
  BookOpen
} from "lucide-react";
import { INITIAL_TASKS, TaskItem } from "@/lib/mockData";

export default function HiTimeView() {
  const [timerMode, setTimerMode] = useState<"focus" | "extended" | "rest">("focus");
  const [timeLeft, setTimeLeft] = useState(24 * 60 + 18); // 24:18
  const [isRunning, setIsRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [selectedHorizon, setSelectedHorizon] = useState<"all" | "now" | "next" | "later">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new task
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("Math");
  const [newTaskEst, setNewTaskEst] = useState("30 min");
  const [newTaskPeriod, setNewTaskPeriod] = useState<"Now" | "Next" | "Later">("Now");

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "ht1",
      title: "Calculus BC Problem Set 9 (Problems 12–24)",
      subject: "Math",
      dueTime: "Now",
      timeEstimate: "40 min",
      duePeriod: "Now",
      completed: false,
      notes: "Active Target"
    },
    {
      id: "ht2",
      title: "Revise Physics lab methodology section",
      subject: "Physics",
      dueTime: "Now",
      timeEstimate: "20 min",
      duePeriod: "Now",
      completed: false
    },
    {
      id: "ht3",
      title: "Review AP Macroeconomics formulas & graphs",
      subject: "Economics",
      dueTime: "Completed at 11:20 AM",
      timeEstimate: "15 min",
      duePeriod: "Now",
      completed: true
    },
    {
      id: "ht4",
      title: "Read Literature Ch. 6–8 (The Great Gatsby)",
      subject: "English",
      dueTime: "Thursday",
      timeEstimate: "45 min",
      duePeriod: "Next",
      completed: false
    },
    {
      id: "ht5",
      title: "Draft History essay thesis & outline",
      subject: "History",
      dueTime: "Friday",
      timeEstimate: "35 min",
      duePeriod: "Next",
      completed: false
    },
    {
      id: "ht6",
      title: "Prepare Chemistry term project proposal",
      subject: "Chemistry",
      dueTime: "Next week",
      timeEstimate: "50 min",
      duePeriod: "Later",
      completed: false
    }
  ]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleModeChange = (mode: "focus" | "extended" | "rest") => {
    setTimerMode(mode);
    setIsRunning(false);
    if (mode === "focus") setTimeLeft(25 * 60);
    if (mode === "extended") setTimeLeft(50 * 60);
    if (mode === "rest") setTimeLeft(5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const item: TaskItem = {
      id: `ht_${Date.now()}`,
      title: newTaskTitle,
      subject: newTaskSubject,
      dueTime: "Today",
      timeEstimate: newTaskEst,
      duePeriod: newTaskPeriod,
      completed: false
    };
    setTasks((prev) => [item, ...prev]);
    setNewTaskTitle("");
    setShowAddModal(false);
  };

  const nowTasks = tasks.filter((t) => t.duePeriod === "Now");
  const nextTasks = tasks.filter((t) => t.duePeriod === "Next");
  const laterTasks = tasks.filter((t) => t.duePeriod === "Later");

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-20 px-4 pt-2 font-sans">
      {/* Top Academic Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-amber-800 font-mono">
            DEEP WORK SANCTUARY
          </span>
          <span className="font-mono text-stone-500 font-medium">
            Wednesday • Block 3
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900">
            Today’s Cadence
          </h1>
          <span className="font-mono text-xs font-semibold text-stone-700">
            60m remaining
          </span>
        </div>
      </div>

      {/* Timer Card Surface */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-[#F4EFE6] p-5 space-y-5 shadow-paper text-center">
        {/* Mode Pills */}
        <div className="inline-flex rounded-xl bg-[#E5DFD5]/70 p-1 text-xs font-medium text-stone-700 w-full">
          <button
            onClick={() => handleModeChange("focus")}
            className={`flex-1 rounded-lg py-2 transition font-semibold ${
              timerMode === "focus"
                ? "bg-[#0D4A47] text-white shadow-xs"
                : "hover:text-stone-900"
            }`}
          >
            Deep Focus (25m)
          </button>
          <button
            onClick={() => handleModeChange("extended")}
            className={`flex-1 rounded-lg py-2 transition ${
              timerMode === "extended"
                ? "bg-[#0D4A47] text-white font-semibold shadow-xs"
                : "hover:text-stone-900"
            }`}
          >
            Extended (50m)
          </button>
          <button
            onClick={() => handleModeChange("rest")}
            className={`flex-1 rounded-lg py-2 transition ${
              timerMode === "rest"
                ? "bg-[#0D4A47] text-white font-semibold shadow-xs"
                : "hover:text-stone-900"
            }`}
          >
            Rest (5m)
          </button>
        </div>

        {/* Circular Display Ring */}
        <div className="flex items-center justify-center gap-6 py-2">
          {/* Progress Ring */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#0D4A47] bg-white shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1ECE4]">
              <Clock className="h-5 w-5 text-[#0D4A47]" />
            </div>
          </div>

          <div className="text-left space-y-0.5">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
                {formatTime(timeLeft)}
              </span>
              <span className="font-mono text-xs text-stone-500 font-medium">rem</span>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Focused: <span className="font-semibold text-stone-900">Calculus BC</span>
            </p>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={() => handleModeChange(timerMode)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5DFD5] bg-white text-stone-700 hover:bg-[#F1ECE4] transition"
            title="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0D4A47] py-3 text-sm font-semibold text-white hover:bg-[#093734] transition shadow-xs"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Commence</span>
              </>
            )}
          </button>

          <button
            onClick={() => setMuted(!muted)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5DFD5] bg-white text-stone-700 hover:bg-[#F1ECE4] transition"
            title="Mute chime"
          >
            {muted ? <VolumeX className="h-4 w-4 text-stone-400" /> : <Volume2 className="h-4 w-4 text-[#0D4A47]" />}
          </button>
        </div>
      </div>

      {/* Horizon Segment Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setSelectedHorizon("all")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            selectedHorizon === "all"
              ? "bg-[#0D4A47] text-white"
              : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
          }`}
        >
          All Horizons (5)
        </button>
        <button
          onClick={() => setSelectedHorizon("now")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            selectedHorizon === "now"
              ? "bg-[#0D4A47] text-white"
              : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
          }`}
        >
          Now • 2
        </button>
        <button
          onClick={() => setSelectedHorizon("next")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            selectedHorizon === "next"
              ? "bg-[#0D4A47] text-white"
              : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
          }`}
        >
          Next • 2
        </button>
        <button
          onClick={() => setSelectedHorizon("later")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            selectedHorizon === "later"
              ? "bg-[#0D4A47] text-white"
              : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
          }`}
        >
          Later • 1
        </button>
      </div>

      {/* SECTION 1: NOW */}
      {(selectedHorizon === "all" || selectedHorizon === "now") && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-stone-900 font-mono">
              <span className="h-2 w-2 rounded-full bg-amber-800" />
              <span>NOW</span>
              <span className="text-stone-500 font-normal">Immediate Priorities</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-amber-800">Est. 60 min</span>
          </div>

          <div className="space-y-2">
            {nowTasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-2xl border p-4 shadow-paper space-y-1.5 transition ${
                  task.completed ? "border-[#E5DFD5] bg-[#F1ECE4]/60" : "border-[#E5DFD5] bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleTask(task.id)} className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-[#0D4A47]" />
                    ) : (
                      <div className="h-5 w-5 rounded bg-stone-200 border border-stone-300" />
                    )}
                  </button>
                  <div className="space-y-1 flex-1">
                    <p className={`text-sm font-semibold leading-snug ${task.completed ? "line-through text-stone-400" : "text-stone-900"}`}>
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="rounded bg-[#F1ECE4] px-2 py-0.5 font-medium text-stone-800">
                        {task.subject}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="h-3 w-3" /> {task.timeEstimate}
                      </span>
                      {task.notes && (
                        <span className="flex items-center gap-1 font-bold text-amber-800 text-[11px]">
                          <Zap className="h-3 w-3 fill-amber-800" /> {task.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: NEXT */}
      {(selectedHorizon === "all" || selectedHorizon === "next") && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-stone-900 font-mono">
              <span className="h-2 w-2 rounded-full bg-stone-800" />
              <span>NEXT</span>
              <span className="text-stone-500 font-normal">Later This Week</span>
            </div>
            <span className="font-mono text-[11px] text-stone-500">2 commitments</span>
          </div>

          <div className="space-y-2">
            {nextTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-1.5"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded bg-stone-200 border border-stone-300" />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-semibold leading-snug text-stone-900">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                      <span className="rounded bg-[#F1ECE4] px-2 py-0.5 font-medium text-stone-800">
                        {task.subject}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3" /> {task.dueTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: LATER */}
      {(selectedHorizon === "all" || selectedHorizon === "later") && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-stone-900 font-mono">
              <span className="h-2 w-2 rounded-full bg-stone-400" />
              <span>LATER</span>
              <span className="text-stone-500 font-normal">Long-Horizon Milestones</span>
            </div>
            <span className="font-mono text-[11px] text-stone-500">Upcoming block</span>
          </div>

          <div className="space-y-2">
            {laterTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-1.5"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded bg-stone-200 border border-stone-300" />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-semibold leading-snug text-stone-900">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                      <span className="rounded bg-[#F1ECE4] px-2 py-0.5 font-medium text-stone-800">
                        {task.subject}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3" /> {task.dueTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#E5DFD5] bg-[#F4EFE6] py-3.5 text-xs font-bold text-stone-800 hover:bg-[#E5DFD5] transition"
      >
        <Plus className="h-4 w-4" />
        <span>Add a deliberate task</span>
      </button>

      {/* SCHOLAR'S PRINCIPLE Footer Card */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-4 flex items-center gap-3 shadow-paper">
        <div className="h-14 w-14 overflow-hidden rounded-xl shrink-0 bg-stone-300">
          <img
            src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=200&q=80"
            alt="Scholar's Principle"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-0.5">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono">
            SCHOLAR'S PRINCIPLE
          </span>
          <p className="font-serif text-sm italic font-semibold text-stone-900">
            "Focus is the art of knowing what to ignore."
          </p>
          <p className="text-[11px] text-stone-500">
            Quiet study room 4B reservation at 3:15 PM
          </p>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md">
            <h3 className="font-serif text-xl font-bold text-stone-900">Add Deliberate Task</h3>
            <form onSubmit={handleAddTaskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Calculus BC Problem Set 10"
                  className="mt-1 w-full rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase">Subject</label>
                  <select
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] p-2 text-stone-900"
                  >
                    <option value="Math">Math</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Economics">Economics</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase">Horizon</label>
                  <select
                    value={newTaskPeriod}
                    onChange={(e) => setNewTaskPeriod(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-[#E5DFD5] bg-[#F9F6F0] p-2 text-stone-900"
                  >
                    <option value="Now">Now</option>
                    <option value="Next">Next</option>
                    <option value="Later">Later</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-[#E5DFD5] bg-white px-3 py-1.5 text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0D4A47] px-4 py-1.5 text-white font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
