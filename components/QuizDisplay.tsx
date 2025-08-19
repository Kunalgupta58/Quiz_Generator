import React from 'react';
import type { QuizData, MCQ } from '../types';

interface QuizDisplayProps {
  quizData: QuizData;
}

const CheckCircleIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L11.25 12.69l-1.78-1.78a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l3.75-3.75z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 00-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
);

const ListBulletIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

const CheckBadgeIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const McqItem: React.FC<{ mcq: MCQ, index: number }> = ({ mcq, index }) => {
    const options = mcq.options || [];
    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="font-semibold text-gray-900 mb-4 text-lg">
                <span className="font-bold text-indigo-600 mr-2">{index + 1}.</span> {mcq.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((option, i) => (
                    <div
                        key={i}
                        className="flex items-center p-3 rounded-lg text-sm border bg-slate-50 border-slate-200 text-gray-700"
                    >
                         <span className="font-mono mr-3 text-indigo-600 font-bold">{String.fromCharCode(65 + i)}</span>
                         <span className="flex-grow">{option}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200 flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                    <span className="font-semibold">Correct Answer:</span> {mcq.answer}
                </p>
            </div>
        </div>
    );
};

export const QuizDisplay: React.FC<QuizDisplayProps> = ({ quizData }) => {
  return (
    <div className="space-y-12">
      {quizData.mcqs && quizData.mcqs.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center bg-slate-100 p-4 rounded-t-lg border-b border-slate-200">
                <ListBulletIcon className="w-6 h-6 mr-3 text-indigo-600"/>
                <h2 className="text-2xl font-bold text-gray-800">Multiple Choice Questions</h2>
            </div>
          <div className="space-y-6 p-4 sm:p-6">
            {quizData.mcqs.map((mcq, index) => (
              <McqItem key={index} mcq={mcq} index={index} />
            ))}
          </div>
        </div>
      )}

      {quizData.trueFalse && quizData.trueFalse.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center bg-slate-100 p-4 rounded-t-lg border-b border-slate-200">
                <CheckBadgeIcon className="w-6 h-6 mr-3 text-indigo-600"/>
                <h2 className="text-2xl font-bold text-gray-800">True or False Questions</h2>
          </div>
          <div className="divide-y divide-slate-200 p-4 sm:p-6">
            {quizData.trueFalse.map((tf, index) => (
              <div key={index} className="py-4 flex items-start justify-between">
                <p className="font-semibold text-gray-800 flex-grow text-md pr-4">
                  <span className="font-bold text-indigo-600 mr-2">{index + 1}.</span> {tf.question}
                </p>
                {tf.answer ? (
                    <span className="flex items-center font-bold text-sm px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                      <CheckCircleIcon className="w-5 h-5 mr-1.5" /> True
                    </span>
                ) : (
                    <span className="flex items-center font-bold text-sm px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
                      <XCircleIcon className="w-5 h-5 mr-1.5" /> False
                    </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};