import { cn } from '../../utils/cn';

export default function Stepper({ steps, currentStep, onStepClick }) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1 last:flex-none">
          <button
            onClick={() => onStepClick?.(index)}
            disabled={!onStepClick}
            className="flex items-center gap-2 group"
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300',
                index < currentStep
                  ? 'bg-gold-500 border-gold-500 text-primary-900'
                  : index === currentStep
                  ? 'border-gold-400 text-gold-400 bg-gold-400/10'
                  : 'border-slate-600 text-slate-500 bg-transparent'
              )}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                'text-sm font-medium hidden sm:block',
                index <= currentStep ? 'text-white' : 'text-slate-500'
              )}
            >
              {step}
            </span>
          </button>
          {index < steps.length - 1 && (
            <div className="flex-1 mx-3">
              <div className="h-0.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500 rounded-full transition-all duration-500"
                  style={{ width: index < currentStep ? '100%' : '0%' }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
