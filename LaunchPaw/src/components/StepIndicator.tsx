import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center relative flex-1">
          {index > 0 && (
            <div
              className={`absolute left-0 top-5 h-0.5 w-full -translate-x-1/2 
                ${index <= currentStep ? 'bg-purple-500' : 'bg-gray-700'}`}
            />
          )}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10
              ${
                index < currentStep
                  ? 'bg-purple-500'
                  : index === currentStep
                  ? 'bg-purple-500/20 border-2 border-purple-500'
                  : 'bg-gray-700'
              }`}
          >
            {index < currentStep ? (
              <Check className="h-5 w-5 text-white" />
            ) : (
              <span className="text-white">{index + 1}</span>
            )}
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm font-medium text-white">{step.title}</p>
            <p className="text-xs text-gray-400 mt-1">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;