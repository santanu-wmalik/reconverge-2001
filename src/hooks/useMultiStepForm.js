import { useState, useCallback } from 'react';

export function useMultiStepForm(steps, initialData = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const back = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const updateFormData = useCallback((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const updateErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  return {
    currentStep,
    formData,
    errors,
    isFirstStep,
    isLastStep,
    steps,
    next,
    back,
    goTo,
    updateFormData,
    updateErrors,
    reset,
  };
}
