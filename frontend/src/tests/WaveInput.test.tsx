import { render, screen, fireEvent } from '@testing-library/react';
import WaveInput from '../components/ui/inputs/WaveInput';
import { expect, test, vi } from 'vitest';

// Mock del hook ThemeMode
vi.mock('../context/ThemeContextProvider', () => ({
  useThemeMode: () => ({ mode: 'light' })
}));

test('WaveInput maneja la validación required', () => {
  const handleChange = vi.fn();
  
  // Test con required=true
  const { rerender } = render(
    <WaveInput label="Nombre" name="name" value="" onChange={handleChange} required={true} />
  );
  
  const input = screen.getByRole('textbox');
  expect(input).toBeRequired();
  
  // Test con required=false
  rerender(
    <WaveInput label="Nombre" name="name" value="" onChange={handleChange} required={false} />
  );
  
  expect(input).not.toBeRequired();
});

test('WaveInput llama a onChange cuando se escribe', () => {
  const handleChange = vi.fn();
  
  render(
    <WaveInput label="Nombre" name="name" value="" onChange={handleChange} required={true} />
  );
  
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Agustin' } });
  
  expect(handleChange).toHaveBeenCalled();
});
