import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Plus, 
  Dumbbell, 
  Flame, 
  Sparkles, 
  AlertCircle, 
  Search,
  Filter,
  ArrowUpDown,
  X,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
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
import WorkoutCompletionModal from '../components/workouts/WorkoutCompletionModal';
import WorkoutReflectionModal from '../components/workouts/WorkoutReflectionModal';
import DeleteConfirmModal from '../components/workouts/DeleteConfirmModal';
import AnimeButton from '../components/ui/AnimeButton';
import SystemNotification from '../components/progression/SystemNotification';
import { useToast } from '../context/ToastContext';

const ACTIVITY_OPTIONS = [
  'ALL',
  'Running',
  'Walking',
  'Cycling',
  'Gym',
  'Swimming',
  'Yoga',
  'HIIT',
  'Sports',
  'Other'
];

export const Workouts = () => {
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stage 17 Workout Completion Experience State
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [lastCompletedWorkout, setLastCompletedWorkout] = useState(null);
  const [lastUpdatedProgression, setLastUpdatedProgression] = useState(null);
  const [lastWorkoutEvents, setLastWorkoutEvents] = useState([]);

  // Stage 19 Reflection State
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [workoutForReflection, setWorkoutForReflection] = useState(null);

  // Stage 6 System Notification events fallback
  const [systemEvents, setSystemEvents] = useState([]);

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

  const location = useLocation();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Stage 19: Check for quickPlan passed via navigation (e.g. from TodayFocus or ReturnJourneyCard)
  useEffect(() => {
    if (location.state?.quickPlan) {
      const qp = location.state.quickPlan;
      setEditingWorkout({
        duration: qp.duration || 20,
        activityType: qp.activityType || 'General Training',
        notes: qp.notes || '',
        caloriesBurned: qp.estimatedCalories || 150,
        workoutDate: new Date().toISOString().split('T')[0],
      });
      setModalOpen(true);
    }
  }, [location.state]);

  // Filtered & Sorted Workouts
  const filteredWorkouts = useMemo(() => {
    return workouts
      .filter((w) => {
        // Activity filter
        if (selectedActivity !== 'ALL' && w.activityType !== selectedActivity) {
          return false;
        }

        // Search term filter (activityType or notes)
        if (searchTerm.trim()) {
          const term = searchTerm.trim().toLowerCase();
          const matchesType = (w.activityType || '').toLowerCase().includes(term);
          const matchesNotes = (w.notes || '').toLowerCase().includes(term);
          if (!matchesType && !matchesNotes) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.workoutDate || b.createdAt) - new Date(a.workoutDate || a.createdAt);
        }
        if (sortBy === 'oldest') {
          return new Date(a.workoutDate || a.createdAt) - new Date(b.workoutDate || b.createdAt);
        }
        if (sortBy === 'duration_desc') {
          return (Number(b.duration) || 0) - (Number(a.duration) || 0);
        }
        if (sortBy === 'duration_asc') {
          return (Number(a.duration) || 0) - (Number(b.duration) || 0);
        }
        if (sortBy === 'calories_desc') {
          return (Number(b.caloriesBurned) || 0) - (Number(a.caloriesBurned) || 0);
        }
        if (sortBy === 'calories_asc') {
          return (Number(a.caloriesBurned) || 0) - (Number(b.caloriesBurned) || 0);
        }
        return 0;
      });
  }, [workouts, selectedActivity, searchTerm, sortBy]);

  const isFilterActive = searchTerm.trim() !== '' || selectedActivity !== 'ALL' || sortBy !== 'newest';

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedActivity('ALL');
    setSortBy('newest');
  };

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
        toast.success('QUEST RECALIBRATED', `${formData.activityType} quest parameters successfully updated.`);
      } else {
        const result = await createWorkout(formData);
        
        if (result?.workout) {
          // Trigger Stage 17 Workout Completion Experience
          setLastCompletedWorkout(result.workout);
          setLastUpdatedProgression(result.progression);
          setLastWorkoutEvents(result.events || []);
          setCompletionModalOpen(true);

          // Dispatch gamified toasts for individual milestones
          const evts = result.events || [];
          for (const evt of evts) {
            if (evt.type === 'NEW_RECORD_LONGEST_WORKOUT' || evt.type === 'NEW_RECORD_HIGHEST_CALORIES' || evt.type === 'NEW_RECORD_MOST_ACTIVE_WEEK') {
              toast.personalRecord(evt.title.replace('NEW PERSONAL RECORD: ', '').replace('!', ''), evt.recordValue, evt.recordUnit);
            } else if (evt.type === 'ACHIEVEMENT_UNLOCKED') {
              toast.achievementUnlocked(evt.title.replace('ACHIEVEMENT UNLOCKED: ', '').replace('!', ''), evt.xpGained || 50);
            } else if (evt.type === 'QUEST_COMPLETED') {
              toast.questCompleted(evt.title.replace('QUEST COMPLETED: ', '').replace('!', ''), evt.xpGained || 25);
            } else if (evt.type === 'LEVEL_UP') {
              toast.levelUp(evt.newLevel || result.progression?.level);
            } else if (evt.type === 'RANK_UP') {
              toast.rankUp(evt.newRank || result.progression?.rank);
            } else if (evt.type === 'STREAK_UPDATED') {
              const streak = evt.streak || result.progression?.currentStreak;
              if ([3, 7, 14, 30, 60, 100].includes(streak)) {
                toast.streakMilestone(streak);
              }
            }
          }
        }
      }
      setModalOpen(false);
      setEditingWorkout(null);
      await fetchWorkouts();
    } catch (err) {
      setError(err.message || 'Failed to record workout quest.');
      toast.error('QUEST TRANSMISSION FAILED', err.message || 'Error recording session.');
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
      toast.info('QUEST LOG REMOVED', 'Workout entry was removed from your local training logs.');
      await fetchWorkouts();
    } catch (err) {
      setError(err.message || 'Failed to delete workout quest.');
      toast.error('DELETE FAILED', err.message || 'Could not remove workout entry.');
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-steel/40 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-steel/60 bg-charcoal text-ash text-xs font-orbitron font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-crimson-bright" />
              <span>MODULE 01 • WORKOUT MANAGEMENT & TELEMETRY</span>
            </div>

            <h1 className="font-orbitron text-3xl sm:text-5xl font-black tracking-tight text-bone uppercase">
              WORKOUT{' '}
              <span className="text-crimson-bright">
                LOGS
              </span>
            </h1>

            <p className="text-ash text-xs sm:text-sm font-sans max-w-xl">
              Record your training. Build your physical foundation. Search, filter, and review your running, cycling, gym, 
              and HIIT sessions to monitor your biometric metrics and build your streak.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AnimeButton
              variant="crimson"
              size="md"
              icon={Plus}
              onClick={handleOpenCreate}
            >
              + LOG WORKOUT
            </AnimeButton>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-crimson/15 border border-crimson/50 flex items-center justify-between text-xs font-mono text-crimson-bright">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-ash hover:text-bone text-xs underline font-sans ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Real-Time Stats HUD */}
        <section>
          <WorkoutHUD workouts={workouts} />
        </section>

        {/* Search, Filter & Sort Telemetry Bar */}
        <section className="bg-charcoal/80 border border-steel/60 rounded-xl p-4 sm:p-5 shadow-steel-card space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ash absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search training logs by activity or notes..."
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-void border border-steel/60 text-bone placeholder-ash/70 text-xs sm:text-sm font-mono focus:outline-none focus:border-crimson transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ash hover:text-bone p-1"
                  aria-label="Clear search input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Activity Selector */}
              <div className="flex items-center gap-2 bg-void border border-steel/60 rounded-lg px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-steel-light" />
                <span className="text-[11px] font-orbitron text-ash uppercase">CATEGORY:</span>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="bg-transparent text-xs font-mono text-bone focus:outline-none cursor-pointer pr-2"
                >
                  {ACTIVITY_OPTIONS.map((act) => (
                    <option key={act} value={act} className="bg-obsidian text-bone">
                      {act.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 bg-void border border-steel/60 rounded-lg px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-steel-light" />
                <span className="text-[11px] font-orbitron text-ash uppercase">SORT:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-mono text-bone focus:outline-none cursor-pointer pr-2"
                >
                  <option value="newest" className="bg-obsidian text-bone">NEWEST FIRST</option>
                  <option value="oldest" className="bg-obsidian text-bone">OLDEST FIRST</option>
                  <option value="duration_desc" className="bg-obsidian text-bone">DURATION (HIGH → LOW)</option>
                  <option value="duration_asc" className="bg-obsidian text-bone">DURATION (LOW → HIGH)</option>
                  <option value="calories_desc" className="bg-obsidian text-bone">CALORIES (HIGH → LOW)</option>
                  <option value="calories_asc" className="bg-obsidian text-bone">CALORIES (LOW → HIGH)</option>
                </select>
              </div>

              {/* Reset Filters Button */}
              {isFilterActive && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-charcoal border border-steel/60 text-ash hover:text-bone hover:border-steel text-xs font-orbitron tracking-wider transition-colors shadow-steel-card"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
              )}
            </div>

          </div>

          {/* Activity Category Quick-Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {ACTIVITY_OPTIONS.map((act) => {
              const active = selectedActivity === act;
              return (
                <button
                  key={act}
                  onClick={() => setSelectedActivity(act)}
                  className={`px-3 py-1 rounded-sm text-[11px] font-orbitron uppercase tracking-wider whitespace-nowrap transition-all border ${
                    active
                      ? 'bg-crimson/20 border-crimson/60 text-crimson-bright shadow-steel-card font-bold'
                      : 'bg-void border-steel/40 text-ash hover:text-bone hover:border-steel/80'
                  }`}
                >
                  {act}
                </button>
              );
            })}
          </div>
        </section>

        {/* Workouts History Section */}
        <section className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-orbitron font-bold text-lg text-bone flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-crimson-bright" />
              TRAINING LOGS
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-charcoal text-bone border border-steel/60">
                {filteredWorkouts.length}
              </span>
            </h2>

            <span className="text-xs font-mono text-ash hidden sm:inline-block">
              {isFilterActive
                ? `MATCHES: ${filteredWorkouts.length} / ${workouts.length} SESSIONS`
                : `TOTAL LOGGED: ${workouts.length} SESSIONS`}
            </span>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-charcoal border border-steel/60 flex items-center justify-center text-ash animate-pulse shadow-steel-card">
                <Zap className="w-6 h-6 text-crimson-bright animate-spin" />
              </div>
              <p className="font-orbitron text-xs font-bold tracking-widest text-ash">
                LOADING TRAINING LOGS...
              </p>
            </div>
          ) : workouts.length === 0 ? (
            /* Total Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl p-12 sm:p-16 bg-charcoal/40 border border-dashed border-steel/60 text-center max-w-xl mx-auto space-y-5"
            >
              <div className="w-16 h-16 rounded-xl bg-charcoal border border-steel/60 flex items-center justify-center mx-auto text-ash shadow-steel-card">
                <Dumbbell className="w-8 h-8 text-crimson-bright" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-orbitron font-black text-xl text-bone uppercase tracking-wide">
                  NO WORKOUTS LOGGED YET
                </h3>
                <p className="text-ash text-xs sm:text-sm font-sans max-w-sm mx-auto">
                  Your journey begins with the first workout. Log a running, cycling, or gym session to initiate your training log.
                </p>
              </div>

              <div className="pt-2">
                <AnimeButton
                  variant="crimson"
                  size="md"
                  icon={Plus}
                  onClick={handleOpenCreate}
                >
                  + LOG FIRST WORKOUT
                </AnimeButton>
              </div>
            </motion.div>
          ) : filteredWorkouts.length === 0 ? (
            /* Filter/Search Zero Matches State */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-10 sm:p-14 bg-charcoal border border-dashed border-steel text-center max-w-lg mx-auto space-y-4 shadow-steel-card"
            >
              <div className="w-14 h-14 rounded-lg bg-gunmetal border border-steel flex items-center justify-center mx-auto text-ash">
                <SlidersHorizontal className="w-6 h-6 text-crimson-bright" />
              </div>
              <div className="space-y-1">
                <h3 className="font-orbitron font-black text-lg text-bone uppercase">
                  NO MATCHING LOGS FOUND
                </h3>
                <p className="text-ash text-xs font-sans max-w-md mx-auto">
                  No training sessions match your search query "{searchTerm}" or selected category filter.
                </p>
              </div>
              <div className="pt-2">
                <AnimeButton
                  variant="outline"
                  size="sm"
                  icon={RotateCcw}
                  onClick={handleClearFilters}
                >
                  RESET SEARCH & FILTERS
                </AnimeButton>
              </div>
            </motion.div>
          ) : (
            /* Workout Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredWorkouts.map((workout) => (
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

      {/* Stage 17 Workout Completion Experience Modal */}
      <WorkoutCompletionModal
        isOpen={completionModalOpen}
        onClose={() => {
          setCompletionModalOpen(false);
          setLastCompletedWorkout(null);
          setLastUpdatedProgression(null);
          setLastWorkoutEvents([]);
        }}
        workout={lastCompletedWorkout}
        progression={lastUpdatedProgression}
        events={lastWorkoutEvents}
        onOpenReflection={(workout) => {
          setWorkoutForReflection(workout);
          setReflectionModalOpen(true);
        }}
      />

      {/* Stage 19 Post-Session Reflection Modal */}
      <WorkoutReflectionModal
        isOpen={reflectionModalOpen}
        onClose={() => {
          setReflectionModalOpen(false);
          setWorkoutForReflection(null);
        }}
        workout={workoutForReflection}
        onSaved={() => {
          if (toast?.success) toast.success('Session reflection recorded.');
        }}
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

      {/* Stage 6 System Notification Popup for Ascension Events */}
      <SystemNotification
        events={systemEvents}
        onClose={() => setSystemEvents([])}
      />
    </div>
  );
};

export default Workouts;
