import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitch from '../components/ui/buttons/ThemeSwitch';
import { expect, test, vi } from 'vitest';

const toggleThemeMock = vi.fn();

vi.mock('../context/ThemeContextProvider', () => ({
  useThemeMode: () => ({
    mode: 'light',
    toggleTheme: toggleThemeMock
  })
}));

test('ThemeSwitch llama a toggleTheme al hacer click', () => {
  render(<ThemeSwitch />);
  
  const switchElement = screen.getByRole('checkbox', { hidden: true });
  fireEvent.click(switchElement);
  
  expect(toggleThemeMock).toHaveBeenCalled();
});
