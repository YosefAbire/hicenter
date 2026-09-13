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
  X
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
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 chime
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        } catch (e) {}
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, muted]);

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
    const updated = taskService.toggleTask(id);
    setTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = taskService.deleteTask(id);
    setTasks(updated);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = taskService.addTask({
      title: newTaskTitle,
      subject: newTaskSubject,
      dueTime: newTaskPeriod === "Now" ? "Now" : newTaskPeriod === "Next" ? "Tomorrow" : "Next week",
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5DFD5] bg-white text-stone-700 hover:bg-[#F1ECE4] transition cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0D4A47] py-3 text-sm font-semibold text-white hover:bg-[#093734] transition shadow-xs cursor-pointer"
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5DFD5] bg-white text-stone-700 hover:bg-[#F1ECE4] transition cursor-pointer"
            title="Toggle sound chime"
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
          All Horizons ({tasks.length})
        </button>
        <button
          onClick={() => setSelectedHorizon("now")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            selectedHorizon === "now"
              ? "bg-[#0D4A47] text-white"
              : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
          }`}
        >
          Now • {nowTasks.length}
        </button>
        <button
          onClick={() => setSelectedHorizon("next")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            selectedHorizon === "next"
              ? "bg-[#0D4A47] text-white"
              : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
          }`}
        >
          Next • {nextTasks.length}
        </button>
        <button
          onClick={() => setSelectedHorizon("later")}
          className={`rounded-full px-3.5 py-1.5 transition ${
            selectedHorizon === "later"
              ? "bg-[#0D4A47] text-white"
              : "bg-[#F1ECE4] text-stone-700 hover:bg-[#E5DFD5]"
          }`}
        >
          Later • {laterTasks.length}
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
                    <div className="flex flex-wrap items-center justify-between text-xs text-stone-500">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#F1ECE4] px-2 py-0.5 font-medium text-stone-800">
                          {task.subject}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="h-3 w-3" /> {task.timeEstimate}
                        </span>
                      </div>
                      <button onClick={() => deleteTask(task.id)} className="text-stone-400 hover:text-red-700">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
            <span className="font-mono text-[11px] text-stone-500">{nextTasks.length} commitments</span>
          </div>

          <div className="space-y-2">
            {nextTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border border-[#E5DFD5] bg-white p-4 shadow-paper space-y-1.5"
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
                    <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#F1ECE4] px-2 py-0.5 font-medium text-stone-800">
                          {task.subject}
                        </span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="h-3 w-3" /> {task.dueTime}
                        </span>
                      </div>
                      <button onClick={() => deleteTask(task.id)} className="text-stone-400 hover:text-red-700">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#E5DFD5] bg-[#F4EFE6] py-3.5 text-xs font-bold text-stone-800 hover:bg-[#E5DFD5] transition cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>Add a deliberate task</span>
      </button>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#E5DFD5] bg-white p-6 space-y-4 shadow-paper-md">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-2">
              <h3 className="font-serif text-xl font-bold text-stone-900">Add Deliberate Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddTaskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. AP Calculus Chapter 6 Exercise 1-5"
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
