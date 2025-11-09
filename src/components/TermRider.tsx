"use client";

import { motion } from 'framer-motion';
import { termRiderTable } from '../data/termRiderTable';

interface TermRiderProps {
  planSelection: {
    age: number;
    term: number;
    sumAssured: number;
  };
  onClose: () => void;
}

const TermRider = ({ planSelection, onClose }: TermRiderProps) => {
  const { age, term, sumAssured } = planSelection;

  // Find the rate from the term rider table
  const rateEntry = termRiderTable.find(
    (entry) => entry.age === age && entry.term === term
  );
  const riderPremium = rateEntry ? (rateEntry.rate / 1000) * sumAssured : 0;

  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-gray-800 p-8 rounded-lg text-white max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4">Term Rider Comparison</h2>
        <p className="mb-4">
          For a Sum Assured of <span className="font-bold">{sumAssured.toLocaleString()}</span>, the additional premium for a Term Rider would be:
        </p>
        <p className="text-2xl font-bold text-yellow-400 mb-6">
          ₹{riderPremium.toLocaleString()} per year
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default TermRider;
