'use client';

import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { plan733Assets } from '../../config/plan733Assets';

interface MaturityPopupProps {
  selectedGoal: string;
  onClose: () => void;
  show: boolean;
}

const MaturityPopup = ({ selectedGoal, onClose, show }: MaturityPopupProps) => {
  if (!show) return null;

  const goalData = {
    career: { 
      image: plan733Assets.career, 
      title: 'Career Achievement Unlocked!',
      description: 'Your professional goals are now within reach with your maturity benefit.'
    },
    marriage: { 
      image: plan733Assets.marriage, 
      title: 'Wedding Dreams Come True!',
      description: 'Celebrate your special day with the financial security you planned for.'
    },
    study: { 
      image: plan733Assets.study, 
      title: 'Higher Education Funded!',
      description: 'Your academic aspirations are fully supported by your plan maturity.'
    },
    goals: { 
      image: plan733Assets.goals, 
      title: 'Life Goals Achieved!',
      description: 'All your dreams are now financially secured through your investment.'
    },
  };

  const currentGoal = goalData[selectedGoal as keyof typeof goalData];

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[20] bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="relative bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-8 max-w-md mx-4 border border-yellow-400/30"
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 100 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut",
          type: "spring",
          damping: 25 
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          ×
        </button>

        {/* Goal image */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="w-24 h-24 relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <NextImage
              src={currentGoal.image}
              alt={currentGoal.title}
              fill
              className="object-contain"
              quality={90}
            />
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-yellow-400 mb-3">
            {currentGoal.title}
          </h3>
          <p className="text-white/90 text-sm leading-relaxed mb-6">
            {currentGoal.description}
          </p>
          
          {/* Maturity benefit amount */}
          <motion.div
            className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <p className="text-yellow-400 font-semibold text-lg">
              ₹10,00,000
            </p>
            <p className="text-white/70 text-xs">
              Maturity Benefit Available
            </p>
          </motion.div>

          {/* Action button */}
          <motion.button
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
          >
            Claim Your Benefit
          </motion.button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-60"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 w-4 h-4 bg-orange-500 rounded-full opacity-40"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default MaturityPopup;