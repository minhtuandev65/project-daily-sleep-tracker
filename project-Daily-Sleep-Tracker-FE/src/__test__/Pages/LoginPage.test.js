// src/Pages/Login/LoginPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../Pages/LoginPage/LoginPage';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import * as AuthAction from '../../Redux/Actions/AuthAction/AuthAction';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('LoginPage', () => {
  let store;
  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({});
  });

  it('renders form inputs, button, and links', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Email/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/Resgister/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot password/i)).toBeInTheDocument();
  });

  it('shows validation errors for invalid email and password', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Email/);
    const passwordInput = screen.getByPlaceholderText(/Password/);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Input invalid values
    fireEvent.change(emailInput, { target: { value: 'a@b' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    // Click login
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Email must be between 5 and 70 characters!/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('dispatches loginAction on valid submit', async () => {
    const credentials = { email: 'test@example.com', password: 'Abc!1234' };
    const mockLogin = jest.fn((creds, navigate) => () => Promise.resolve());
    jest.spyOn(AuthAction, 'loginAction').mockImplementation(mockLogin);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/), {
      target: { value: credentials.email }
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/), {
      target: { value: credentials.password }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(credentials, mockNavigate);
    });
  });
});
