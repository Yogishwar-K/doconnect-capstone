import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login'; 

describe('Login Component Tests', () => {
    
    test('renders login header and form fields', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        
        expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    });

    test('shows validation errors when submitting an empty form', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        
        const submitButton = screen.getByRole('button', { name: /Sign In/i });
        
        fireEvent.click(submitButton);
        
        expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
});