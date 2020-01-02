import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders next fof time text', () => {
  const { getByText } = render(<App />);
  const text = getByText(/next fof time/i);
  expect(text).toBeInTheDocument();
});
