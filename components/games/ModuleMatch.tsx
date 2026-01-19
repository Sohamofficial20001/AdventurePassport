// import React, { useEffect, useState } from 'react';
// import QuizData from './data/ModuleMatch.json';
// import { ModuleMatchConfig, Topic } from './types/ModuleMatch';

// const config = QuizData as ModuleMatchConfig;

// export const ModuleMatch: React.FC<{
//   onFinish: (status: { played: boolean; approved: boolean }) => void;
// }> = ({ onFinish }) => {
//   const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

//   const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
//   const [checkedTopics, setCheckedTopics] = useState<Set<string>>(new Set());
//   const [showAnswerTopics, setShowAnswerTopics] = useState<Set<string>>(new Set());
//   const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

//   const activeTopic = config.topics.find(t => t.id === activeTopicId);
//   const isAllCompleted = completedTopics.size === config.topics.length;

//   const toggleOption = (topicId: string, optionId: string) => {
//     setSelectedOptions(prev => {
//       const current = prev[topicId] || [];
//       return {
//         ...prev,
//         [topicId]: current.includes(optionId)
//           ? current.filter(o => o !== optionId)
//           : [...current, optionId]
//       };
//     });
//   };

//   const checkAnswer = (topic: Topic) => {
//     const selected = selectedOptions[topic.id] || [];
//     if (selected.length === 0) return;

//     const correctIds = topic.options.filter(o => o.isCorrect).map(o => o.id);
//     const wrongIds = topic.options.filter(o => !o.isCorrect).map(o => o.id);

//     const hasCorrect = selected.some(id => correctIds.includes(id));
//     const hasWrong = selected.some(id => wrongIds.includes(id));

//     setCheckedTopics(prev => new Set(prev).add(topic.id));

//     // ❌ wrong or mixed → retry allowed
//     if (!hasCorrect || hasWrong) return;

//     // ✅ topic completed
//     setCompletedTopics(prev => new Set(prev).add(topic.id));
//     setActiveTopicId(null);
//   };

//   const showAnswers = (topicId: string) => {
//     setShowAnswerTopics(prev => new Set(prev).add(topicId));
//   };

//   /**
//    * 🔥 ONLY place where onFinish is called
//    * Game finishes automatically ONLY when all topics are done
//    */
//   useEffect(() => {
//     if (isAllCompleted) {
//       onFinish({ played: true, approved: true });
//     }
//   }, [isAllCompleted, onFinish]);

//   /**
//    * 🔥 Participation badge logic
//    * If user exits early but completed at least one topic
//    */
//   useEffect(() => {
//     return () => {
//       if (completedTopics.size > 0 && !isAllCompleted) {
//         onFinish({ played: true, approved: false });
//       }
//     };
//   }, [completedTopics, isAllCompleted, onFinish]);

//   return (
//     <div className="space-y-6">

//       {/* Header */}
//       <h2
//         className={`text-xl font-bold text-center ${
//           isAllCompleted ? 'text-green-600' : 'text-gray-700'
//         }`}
//       >
//         Topic Quiz
//       </h2>

//       {/* Topics */}
//       <div className="grid grid-cols-4 gap-2">
//         {config.topics.map(topic => (
//           <button
//             key={topic.id}
//             onClick={() => setActiveTopicId(topic.id)}
//             className={`p-3 rounded font-bold border-2 transition-all
//               ${
//                 completedTopics.has(topic.id)
//                   ? 'bg-green-100 border-green-500 text-green-700'
//                   : activeTopicId === topic.id
//                   ? 'bg-blue-600 text-white border-blue-600'
//                   : 'bg-white border-gray-200 text-gray-600'
//               }`}
//           >
//             {topic.title}
//           </button>
//         ))}
//       </div>

//       {/* Question */}
//       {activeTopic && (
//         <div className="p-4 border rounded-lg space-y-4">
//           <p className="font-semibold">{activeTopic.question}</p>

//           <div className="space-y-2">
//             {activeTopic.options.map(opt => {
//               const selected = selectedOptions[activeTopic.id]?.includes(opt.id);
//               const checked = checkedTopics.has(activeTopic.id);
//               const showAnswer = showAnswerTopics.has(activeTopic.id);

//               let color = 'border-gray-300';

//               if (checked && selected && !opt.isCorrect) {
//                 color = 'border-red-500 bg-red-100';
//               }

//               if (
//                 (checked && selected && opt.isCorrect) ||
//                 (showAnswer && opt.isCorrect)
//               ) {
//                 color = 'border-green-500 bg-green-100';
//               }

//               return (
//                 <label
//                   key={opt.id}
//                   className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${color}`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selected || false}
//                     onChange={() => toggleOption(activeTopic.id, opt.id)}
//                     disabled={completedTopics.has(activeTopic.id)}
//                   />
//                   {opt.text}
//                 </label>
//               );
//             })}
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={() => checkAnswer(activeTopic)}
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               Check
//             </button>

//             <button
//               onClick={() => showAnswers(activeTopic.id)}
//               className="px-4 py-2 bg-gray-200 rounded"
//             >
//               Show Answer
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useEffect, useState, useRef } from 'react';
import QuizData from './data/ModuleMatch.json';
import { ModuleMatchConfig, Topic } from './types/ModuleMatch';
import { GameStatus } from '../../types';

const config = QuizData as ModuleMatchConfig;

export const ModuleMatch: React.FC<{
  onFinish: (status: { played: boolean; approved: boolean }) => void;
  initialStatus?: GameStatus;
}> = ({ onFinish, initialStatus }) => {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [checkedTopics, setCheckedTopics] = useState<Set<string>>(new Set());
  const [showAnswerTopics, setShowAnswerTopics] = useState<Set<string>>(new Set());
  const [assistedTopics, setAssistedTopics] = useState<Set<string>>(new Set());
  const [failedTopics, setFailedTopics] = useState<Set<string>>(new Set());

  // Initialize completedTopics based on initialStatus
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(() => {
    if (initialStatus === GameStatus.WON) {
      return new Set(config.topics.map(t => t.id));
    }
    return new Set();
  });

  const activeTopic = config.topics.find(t => t.id === activeTopicId);
  const isAllCompleted = completedTopics.size === config.topics.length;

  const toggleOption = (topicId: string, optionId: string) => {
    setSelectedOptions(prev => {
      const current = prev[topicId] || [];
      return {
        ...prev,
        [topicId]: current.includes(optionId)
          ? current.filter(o => o !== optionId)
          : [...current, optionId]
      };
    });
  };

  const checkAnswer = (topic: Topic) => {
    const selected = selectedOptions[topic.id] || [];
    if (selected.length === 0) return;

    const correctIds = topic.options.filter(o => o.isCorrect).map(o => o.id);
    const wrongIds = topic.options.filter(o => !o.isCorrect).map(o => o.id);

    // Strict Validation: Must select ALL correct options
    const allCorrectSelected = correctIds.every(id => selected.includes(id));
    // And NO wrong options
    const hasWrong = selected.some(id => wrongIds.includes(id));

    setCheckedTopics(prev => new Set(prev).add(topic.id));

    // ❌ wrong or mixed or incomplete → retry allowed but flagged
    if (!allCorrectSelected || hasWrong) {
      setFailedTopics(prev => new Set(prev).add(topic.id));
      return;
    }

    // ✅ topic completed
    setCompletedTopics(prev => new Set(prev).add(topic.id));
    setActiveTopicId(null);
  };

  const showAnswers = (topicId: string) => {
    setShowAnswerTopics(prev => new Set(prev).add(topicId));
    setAssistedTopics(prev => new Set(prev).add(topicId));
  };

  // Stats refs for cleanup logic to avoid premature trigger on re-renders
  const statsRef = useRef({
    completedCount: 0,
    isFullComplete: false,
    hasFinished: false
  });

  // Keep refs synced with state
  useEffect(() => {
    statsRef.current.completedCount = completedTopics.size;
    statsRef.current.isFullComplete = completedTopics.size === config.topics.length;
  }, [completedTopics]);

  // Main Win Trigger
  useEffect(() => {
    // Only trigger finish if we just completed it (was not already won on load)
    if (isAllCompleted && initialStatus !== GameStatus.WON) {
      // If ANY topic was assisted OR failed once, we do NOT approve for "Winner" status
      const anyAssisted = assistedTopics.size > 0;
      const anyFailed = failedTopics.size > 0;

      statsRef.current.hasFinished = true; // Mark as explicitly finished
      onFinish({ played: true, approved: !anyAssisted && !anyFailed });
    }
  }, [isAllCompleted, assistedTopics, failedTopics, onFinish, initialStatus]);

  /**
   * 🔥 Participation badge logic - Cleanup Check
   * This runs ONLY when the component unmounts (user closes modal or aborts)
   */
  useEffect(() => {
    return () => {
      const { completedCount, isFullComplete, hasFinished } = statsRef.current;

      // If we haven't finished formally (via Win logic above), but have progress
      if (!hasFinished && completedCount > 0 && !isFullComplete) {
        onFinish({ played: true, approved: false });
      }
    };
  }, []); // Empty dependency array ensures this runs only on unmount

  return (
    <div className="space-y-6">

      {/* Header */}
      <h2
        className={`text-xl font-bold text-center ${isAllCompleted ? 'text-green-600' : 'text-gray-700'
          }`}
      >
        Topic Quiz
      </h2>

      {/* Topics */}
      <div className="grid grid-cols-4 gap-2">
        {config.topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => setActiveTopicId(topic.id)}
            className={`p-3 rounded font-bold border-2 transition-all
              ${completedTopics.has(topic.id)
                ? 'bg-green-100 border-green-500 text-green-700'
                : activeTopicId === topic.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-gray-200 text-gray-600'
              }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Question */}
      {activeTopic && (
        <div className="p-4 border rounded-lg space-y-4">
          <p className="font-semibold">{activeTopic.question}</p>

          <div className="space-y-2">
            {activeTopic.options.map(opt => {
              const selected = selectedOptions[activeTopic.id]?.includes(opt.id);
              const checked = checkedTopics.has(activeTopic.id);
              const showAnswer = showAnswerTopics.has(activeTopic.id);

              let color = 'border-gray-300';

              if (checked && selected && !opt.isCorrect) {
                color = 'border-red-500 bg-red-100';
              }

              if (
                (checked && selected && opt.isCorrect) ||
                (showAnswer && opt.isCorrect)
              ) {
                color = 'border-green-500 bg-green-100';
              }

              // Highlight missing correct answers if checked
              if (checked && !selected && opt.isCorrect && !showAnswer) {
                // Optional: show that this should have been selected? 
                // Currently user logic just says "it got red". 
                // Let's leave visually implicit or add a subtle hint if needed.
                // For now, standard behavior: red for wrong selected, green for correct selected.
              }

              return (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${color}`}
                >
                  <input
                    type="checkbox"
                    checked={selected || false}
                    onChange={() => toggleOption(activeTopic.id, opt.id)}
                    disabled={completedTopics.has(activeTopic.id)}
                  />
                  {opt.text}
                </label>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => checkAnswer(activeTopic)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Check
            </button>

            <button
              onClick={() => showAnswers(activeTopic.id)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Show Answer
            </button>
          </div>

          {/* Feedback msg */}
          {checkedTopics.has(activeTopic.id) && !completedTopics.has(activeTopic.id) && (
            <p className="text-sm text-red-500 font-bold">
              Incorrect or incomplete. Try again!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
