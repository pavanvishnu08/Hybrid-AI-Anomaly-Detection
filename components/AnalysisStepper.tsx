import React from 'react';
import { CheckCircleIcon, LoaderIcon } from './icons/Icons';

type Status = 'idle' | 'preprocessing' | 'supervised' | 'unsupervised' | 'fusion' | 'explainability' | 'complete' | 'error';

interface AnalysisStepperProps {
  currentStatus: Status;
}

const steps = [
  { id: 'preprocessing', name: 'Preprocessing Data' },
  { id: 'supervised', name: 'Training Supervised Model' },
  { id: 'unsupervised', name: 'Training Unsupervised Model' },
  { id: 'fusion', name: 'Fusing Models' },
  { id: 'explainability', name: 'Generating SHAP Plot' },
];

export const AnalysisStepper: React.FC<AnalysisStepperProps> = ({ currentStatus }) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStatus);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = currentStepIndex > index;
          const isCurrent = currentStepIndex === index;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                    isCompleted ? 'bg-teal-500' : isCurrent ? 'bg-teal-500 animate-pulse-fast' : 'bg-gray-700 border-2 border-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  ) : isCurrent ? (
                    <LoaderIcon className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <span className="text-gray-400 font-bold">{index + 1}</span>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm font-medium w-32 ${
                    isCompleted || isCurrent ? 'text-teal-400' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-auto border-t-2 transition-colors duration-500 h-0.5 ${
                    isCompleted ? 'border-teal-500' : 'border-gray-600'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
