import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should have the application title or logo', () => {
    const { getByAltText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(getByAltText(/Teddy Open Finance/i)).toBeTruthy();
  });
});
