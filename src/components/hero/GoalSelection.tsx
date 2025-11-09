'use client';

import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { useState, useEffect } from 'react';
import { plan733Assets } from '../../config/plan733Assets';

interface GoalSelectionProps {
  onGoalSelected: (goal: string) => void;
  selectedGoal: string | null;
}

const GoalSelection = ({ onGoalSelected, selectedGoal }: GoalSelectionProps) => {
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);

  const goals = [
    { id: 'career', image: plan733Assets.career, label: 'Career Goals' },
    { id: 'marriage', image: plan733Assets.marriage, label: 'Marriage' },
    { id: 'study', image: plan733Assets.study, label: 'Higher Studies' },
    { id: 'goals', image: plan733Assets.goals, label: 'Life Goals' },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-[10] bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-4"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Select Your Life Goal
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {goals.map((goal) => (
            <motion.button
              key={goal.id}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedGoal === goal.id
                  ? 'border-yellow-400 bg-yellow-400/20'
                  : hoveredGoal === goal.id
                  ? 'border-yellow-300 bg-yellow-300/10'
                  : 'border-white/30 bg-white/5'
              }`}
              onMouseEnter={() => setHoveredGoal(goal.id)}
              onMouseLeave={() => setHoveredGoal(null)}
              onClick={() => onGoalSelected(goal.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 relative">
                  <NextImage
                    src={goal.image}
                    alt={goal.label}
                    fill
                    className="object-contain"
                    quality={90}
                  />
                </div>
                <span className="text-white font-medium text-sm">
                  {goal.label}
                </span>
              </div>
              
              {selectedGoal === goal.id && (
                <motion.div
                  className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-black text-sm">✓</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
        
        {selectedGoal && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/80 text-sm mb-4">
              Perfect! Your goal will be shown during maturity scenarios.
            </p>
            <motion.button
              className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {/* Close goal selection */}}
            >
              Continue to Plan
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GoalSelection;