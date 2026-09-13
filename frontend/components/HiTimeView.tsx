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
  Calendar,
  Zap,
  Trash2,
  X,
  Check
} from "lucide-react";
import { TaskItem } from "@/lib/mockData";
import { taskService } from "@/lib/services/taskService";

export default function HiTimeView() {
  const [timerMode, setTimerMode] = useState<"focus" | "extended" | "rest">("focus");
  const [timeLeft, setTimeLeft] = useState(24 * 60 + 18);
  const [isRunning, setIsRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [selectedHorizon, setSelectedHorizon] = useState<"all" | "now" | "next" | "later">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Task & Routine States
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [routines, setRoutines] = useState(taskService.getChecklistRoutines());

  // Form states for new task
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("Math");
  const [newTaskEst, setNewTaskEst] = useState("30 min");
  const [newTaskPeriod, setNewTaskPeriod] = useState<"Now" | "Next" | "Later">("Now");

  useEffect(() => {
    setTasks(taskService.getTasks());
  }, []);

  // Timer countdown & chime sound
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (!muted && typeof window !== "undefined" && window.AudioContext) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, ctx.currentTime);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        } catch (e) {
          console.error("Audio playback error", e);
        }
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, muted]);

  const switchMode = (mode: "focus" | "extended" | "rest") => {
    setTimerMode(mode);
    setIsRunning(false);
    if (mode === "focus") setTimeLeft(25 * 60);
    if (mode === "extended") setTimeLeft(50 * 60);
    if (mode === "rest") setTimeLeft(5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleTask = (id: string) => {
    const updated = taskService.toggleTask(id);
    setTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = taskService.deleteTask(id);
    setTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    taskService.addTask({
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      dueTime: "Today",
      timeEstimate: newTaskEst,
      duePeriod: newTaskPeriod,
      completed: false,
    });
    setTasks(taskService.getTasks());
    setNewTaskTitle("");
    setShowAddModal(false);
  };

  const toggleRoutine = (id: string) => {
    const updated = taskService.toggleRoutine(id);
    setRoutines(updated);
  };

  const filteredTasks = tasks.filter((t) => {
    if (selectedHorizon === "now") return t.duePeriod === "Now";
    if (selectedHorizon === "next") return t.duePeriod === "Next";
    if (selectedHorizon === "later") return t.duePeriod === "Later";
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Academic Header */}
      <div className="rounded-2xl border border-[#E5DFD5] bg-white p-6 shadow-paper space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-amber-800 font-mono text-xs">
              ⚡ DEEP WORK SANCTUARY
            </span>
            <span className="rounded-full bg-[#F1ECE4] px-2.5 py-0.5 text-[11px] font-mono text-stone-700">
              Wednesday • Block 3
            </span>
          </div>
          <span className="font-mono text-xs font-semibold text-stone-500">
            60m remaining in current focus block
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 pt-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
            HiTime Focus & Cadence
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-950 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Responsive Grid: Left Column Timer & Routines, Right Column Task Horizons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3 width on desktop) */}
        <div className="space-y-6">
          {/* Timer Card Surface */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-white p-6 text-center space-y-6 shadow-paper">
            {/* Mode Pills */}
            <div className="inline-flex items-center rounded-xl bg-[#F1ECE4] p-1 text-xs font-semibold text-stone-700 border border-[#E5DFD5]">
              <button
                onClick={() => switchMode("focus")}
                className={`rounded-lg px-3 py-1.5 transition ${timerMode === "focus" ? "bg-[#0D4A47] text-white shadow-xs" : "hover:text-stone-900"}`}
              >
                Deep Focus (25m)
              </button>
              <button
                onClick={() => switchMode("extended")}
                className={`rounded-lg px-3 py-1.5 transition ${timerMode === "extended" ? "bg-[#0D4A47] text-white shadow-xs" : "hover:text-stone-900"}`}
              >
                Extended (50m)
              </button>
              <button
                onClick={() => switchMode("rest")}
                className={`rounded-lg px-3 py-1.5 transition ${timerMode === "rest" ? "bg-[#0D4A47] text-white shadow-xs" : "hover:text-stone-900"}`}
              >
                Rest (5m)
              </button>
            </div>

            {/* Timer Display */}
            <div className="space-y-2 py-2">
              <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full border-4 border-[#0D4A47] bg-[#F9F6F0] shadow-inner">
                <div className="text-center">
                  <span className="font-mono text-4xl font-bold tracking-tighter text-stone-900">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="block font-mono text-[10px] uppercase font-bold tracking-widest text-stone-500 pt-1">
                    {isRunning ? "FOCUS IN PROGRESS" : "PAUSED"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-500 font-mono">
                Target: AP Chemistry Stoichiometry
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => switchMode(timerMode)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5DFD5] bg-stone-50 text-stone-600 hover:bg-stone-100"
                title="Reset timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-xs transition cursor-pointer max-w-[180px] ${
                  isRunning ? "bg-amber-800 hover:bg-amber-900" : "bg-[#0D4A47] hover:bg-teal-950"
                }`}
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                <span>{isRunning ? "Pause Session" : "Commence"}</span>
              </button>

              <button
                onClick={() => setMuted(!muted)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5DFD5] bg-stone-50 text-stone-600 hover:bg-stone-100"
                title={muted ? "Unmute chime" : "Mute chime"}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Daily Routines Checklist */}
          <div className="rounded-2xl border border-[#E5DFD5] bg-[#F1ECE4] p-5 space-y-3 shadow-paper">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-2">
              <span className="font-mono text-xs font-bold uppercase text-stone-900">
                DAILY CADENCE ROUTINES
              </span>
              <span className="font-mono text-[10px] text-stone-500">
                {routines.filter(r => r.done).length}/{routines.length} Done
              </span>
            </div>
            <div className="space-y-2">
              {routines.map((r) => (
                <div
                  key={r.id}
                  onClick={() => toggleRoutine(r.id)}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E5DFD5] cursor-pointer hover:border-[#0D4A47] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-4 w-4 items-center justify-center rounded border ${r.done ? "bg-[#0D4A47] border-[#0D4A47] text-white" : "border-stone-300"}`}>
                      {r.done && <Check className="h-3 w-3" />}
                    </div>
                    <span className={`text-xs ${r.done ? "line-through text-stone-400" : "text-stone-800 font-medium"}`}>
                      {r.label}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-stone-400">{r.time || "Daily"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (2/3 width on desktop): Task Horizons */}
        <div className="lg:col-span-2 space-y-6">
          {/* Horizon Selection Chips */}
          <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {(["all", "now", "next", "later"] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHorizon(h)}
                  className={`rounded-xl px-3 py-1.5 font-bold capitalize transition cursor-pointer ${
                    selectedHorizon === h
                      ? "bg-[#0D4A47] text-white shadow-xs"
                      : "bg-white text-stone-600 border border-[#E5DFD5] hover:bg-stone-50"
                  }`}
                >
                  {h} ({h === "all" ? tasks.length : tasks.filter((t) => t.duePeriod.toLowerCase() === h).length})
                </button>
              ))}
            </div>
          </div>

          {/* Task Horizon List */}
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-2xl border p-4 shadow-paper transition space-y-2 ${
                  task.completed ? "border-[#E5DFD5] bg-[#F1ECE4]/60 opacity-80" : "border-[#E5DFD5] bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button onClick={() => toggleTask(task.id)} className="mt-0.5 cursor-pointer">
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-[#0D4A47]" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-stone-300 hover:border-[#0D4A47]" />
                      )}
                    </button>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded bg-[#F1ECE4] px-2 py-0.5 font-mono text-[10px] font-bold text-stone-800">
                          {task.subject}
                        </span>
                        <span className="font-mono text-[10px] uppercase font-bold text-amber-800">
                          Horizon: {task.duePeriod}
                        </span>
                      </div>
                      <h4 className={`text-sm font-semibold ${task.completed ? "line-through text-stone-400" : "text-stone-900"}`}>
                        {task.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-stone-500">
                      {task.timeEstimate}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-stone-300 hover:text-rose-700 p-1 transition"
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#E5DFD5] p-8 text-center space-y-2">
                <p className="font-serif text-lg text-stone-600">No tasks in this horizon block.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-xs font-bold text-[#0D4A47] hover:underline"
                >
                  + Add a deliberate task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAddTask}
            className="w-full max-w-md rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md"
          >
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">Add Deliberate Task</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Complete AP Calculus Integration set"
                  className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Subject</label>
                  <select
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                  >
                    <option>Calculus BC</option>
                    <option>AP Chemistry</option>
                    <option>European History</option>
                    <option>English Literature</option>
                    <option>Physics C</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Estimate</label>
                  <select
                    value={newTaskEst}
                    onChange={(e) => setNewTaskEst(e.target.value)}
                    className="w-full rounded-xl border border-[#E5DFD5] bg-stone-50 p-2.5 text-stone-900 focus:border-[#0D4A47] focus:outline-none"
                  >
                    <option>15 min</option>
                    <option>25 min</option>
                    <option>45 min</option>
                    <option>60 min</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Horizon Block</label>
                <div className="flex gap-2">
                  {(["Now", "Next", "Later"] as const).map((period) => (
                    <button
                      type="button"
                      key={period}
                      onClick={() => setNewTaskPeriod(period)}
                      className={`flex-1 rounded-xl py-2 font-bold transition text-xs ${
                        newTaskPeriod === period
                          ? "bg-[#0D4A47] text-white shadow-xs"
                          : "border border-[#E5DFD5] bg-stone-50 text-stone-700"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-[#E5DFD5] px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#0D4A47] px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
