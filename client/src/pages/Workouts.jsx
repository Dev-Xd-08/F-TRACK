import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Plus, 
  Dumbbell, 
  Flame, 
  Sparkles, 
  AlertCircle, 
  Compass, 
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  getWorkouts, 
  createWorkout, 
  updateWorkout, 
  deleteWorkout 
} from '../services/workoutService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WorkoutHUD from '../components/workouts/WorkoutHUD';
import WorkoutCard from '../components/workouts/WorkoutCard';
import WorkoutModal from '../components/workouts/WorkoutModal';
import DeleteConfirmModal from '../components/workouts/DeleteConfirmModal';
import AnimeButton from '../components/ui/AnimeButton';

export const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all workouts
  const fetchWorkouts = async () => {
    setError(null);
    try {
      const data = await getWorkouts();
      setWorkouts(data.workouts || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve training quests from ascension logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingWorkout(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (workout) => {
    setEditingWorkout(workout);
    setModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveWorkout = async (formData) => {
    setIsSaving(true);
    setError(null);
    try {
      if (editingWorkout) {
        await updateWorkout(editingWorkout._id, formData);
      } else {
        await createWorkout(formData);
      }
      setModalOpen(false);
      setEditingWorkout(null);
      await fetchWorkouts();
    } catch (err) {
      setError(err.message || 'Failed to record workout quest.');
    } finally {
      setIsSaving(false);
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (workout) => {
    setWorkoutToDelete(workout);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!workoutToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteWorkout(workoutToDelete._id);
      setDeleteModalOpen(false);
      setWorkoutToDelete(null);
      await fetchWorkouts();
    } catch (err) {
      setError(err.message || 'Failed to delete workout quest.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-void text-slate-100 cyber-grid flex flex-col justify-between relative overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Quest Chamber */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full flex-1 space-y-8 relative z-10">
        
        {/* Page Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-neon/40 bg-cyan-neon/10 text-cyan-neon text-xs font-orbitron font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MODULE 01 • WORKOUT MANAGEMENT</span>
            </div>

            <h1 className="font-orbitron text-3xl sm:text-5xl font-black tracking-tight text-slate-100 uppercase">
              WORKOUT{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-white to-violet-glow text-glow-cyan">
                QUESTS
              </span>
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-xl">
              Complete your training. Increase your power. Log your running, cycling, gym, 
              and HIIT sessions to power up your biometric stats and build your streak.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AnimeButton
              variant="cyan"
              size="md"
              icon={Plus}
              onClick={handleOpenCreate}
            >
              + NEW QUEST
            </AnimeButton>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-crimson-aura/10 border border-crimson-aura/40 flex items-center justify-between text-xs font-mono text-crimson-aura">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-400 hover:text-white text-xs underline font-sans ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Real-Time Stats HUD */}
        <section>
          <WorkoutHUD workouts={workouts} />
        </section>

        {/* Workouts History Section */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-orbitron font-bold text-lg text-slate-100 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-cyan-neon" />
              TRAINING QUEST LOGS
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-neon border border-slate-700">
                {workouts.length}
              </span>
            </h2>

            <span className="text-xs font-mono text-slate-500 hidden sm:inline-block">
              SORTED: NEWEST FIRST
            </span>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-neon to-cyan-neon p-0.5 shadow-glow-cyan animate-pulse">
                <div className="w-full h-full bg-void rounded-[10px] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-cyan-neon animate-spin" />
                </div>
              </div>
              <p className="font-orbitron text-xs font-bold tracking-widest text-cyan-neon">
                ACCESSING ASCENSION LOGS...
              </p>
            </div>
          ) : workouts.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl p-12 sm:p-16 bg-obsidian/60 border border-dashed border-slate-800 text-center max-w-xl mx-auto space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-neon/20 to-cyan-neon/20 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                <Dumbbell className="w-8 h-8 text-cyan-neon" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-orbitron font-black text-xl text-slate-100 uppercase tracking-wide">
                  NO QUESTS COMPLETED
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-sm mx-auto">
                  Your ascension begins with the first quest. Log a running, cycling, or gym session to initiate your training log.
                </p>
              </div>

              <div className="pt-2">
                <AnimeButton
                  variant="cyan"
                  size="md"
                  icon={Plus}
                  onClick={handleOpenCreate}
                >
                  START FIRST QUEST
                </AnimeButton>
              </div>
            </motion.div>
          ) : (
            /* Workout Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {workouts.map((workout) => (
                  <WorkoutCard
                    key={workout._id}
                    workout={workout}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Create / Edit Modal */}
      <WorkoutModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingWorkout(null);
        }}
        onSave={handleSaveWorkout}
        initialData={editingWorkout}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setWorkoutToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        workoutTitle={workoutToDelete ? `${workoutToDelete.activityType} (${workoutToDelete.duration}m)` : ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Workouts;
