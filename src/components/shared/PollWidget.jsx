import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PollWidget({ poll }) {
  const [voted, setVoted] = useState(null);

  const handleVote = (optionId) => {
    if (voted) return;
    setVoted(optionId);
  };

  return (
    <div className="glass p-5">
      <h4 className="text-white font-semibold mb-4">{poll.question}</h4>
      <div className="space-y-2">
        {poll.options.map((option) => {
          const percentage = Math.round((option.votes / poll.totalVotes) * 100);
          const isSelected = voted === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              className="w-full text-left relative overflow-hidden rounded-lg border border-white/10 p-3 transition-colors hover:border-gold-400/30"
            >
              {voted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`absolute inset-y-0 left-0 ${
                    isSelected ? 'bg-gold-500/20' : 'bg-white/5'
                  }`}
                />
              )}
              <div className="relative flex justify-between items-center">
                <span className={`text-sm ${isSelected ? 'text-gold-300 font-medium' : 'text-slate-300'}`}>
                  {option.text}
                </span>
                {voted && (
                  <span className="text-xs text-slate-400">{percentage}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 mt-3">{poll.totalVotes} votes</p>
    </div>
  );
}
