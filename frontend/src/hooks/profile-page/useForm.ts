import { useState } from 'react';
import type { ChangeEvent } from 'react';

export interface FormState<T> {
  values: T;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setAllValues: (newValues: Partial<T>) => void; 
  resetForm: () => void;
}

export const useForm = <T extends Object>(initialValues: T): FormState<T> => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setValue = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setAllValues = (newValues: Partial<T>) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return { values, handleChange, setValue, setAllValues, resetForm };
};