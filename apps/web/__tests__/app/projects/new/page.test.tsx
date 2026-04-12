import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewProjectPage from '../../../../app/projects/new/page'; // Adjust path
import { useRouter } from 'next/navigation';

// 1. Mock Next.js Router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// 2. Mock framer-motion to bypass animations
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className: string }) => <div className={className}>{children}</div>,
  },
}));

describe('NewProjectPage Component', () => {
  const mockBack = jest.fn();
  
  // Store the original window.location to restore it safely later
  const originalWindowLocation = window.location;

  beforeAll(() => {
    global.fetch = jest.fn();
    
    // Safely replace JSDOM's strict location with a plain object
    (window as Partial<Window>).location = { href: 'http://localhost/' } as unknown as Location;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });
    window.location.href = 'http://localhost/'; // Reset before each test
  });

  afterAll(() => {
    (global.fetch as jest.Mock).mockClear();
    
    // Safely restore the original location using standard assignment
    (window as unknown as { location: Location }).location = originalWindowLocation;
  });

  it('renders the form correctly', () => {
    render(<NewProjectPage />);

    expect(screen.getByRole('heading', { name: /launch a new project/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current stage/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Publish Project' })).toBeInTheDocument();
  });

  it('calls router.back() when the Cancel button is clicked', () => {
    render(<NewProjectPage />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('displays an error message if the API returns a failure', async () => {
    // Arrange: Mock fetch to return a 400 Bad Request
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Title is required' }),
    });

    render(<NewProjectPage />);

    // Act: Fill out the form and submit
    fireEvent.change(screen.getByLabelText(/project name/i), { target: { value: 'Bad Data' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Short text' } });
    
    fireEvent.submit(screen.getByRole('button', { name: 'Publish Project' }));

    // Assert: Wait for the error to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
    
    // Ensure the location didn't change
    expect(window.location.href).toBe('http://localhost/');
  });

  it('handles unexpected network errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<NewProjectPage />);

    fireEvent.submit(screen.getByRole('button', { name: 'Publish Project' }));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('submits successfully, shows loading state, and redirects to dashboard', async () => {
    // Arrange: Mock fetch to return a perfect 200 OK
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<NewProjectPage />);

    const titleInput = screen.getByLabelText(/project name/i);
    const descInput = screen.getByLabelText(/description/i);
    const stageSelect = screen.getByLabelText(/current stage/i);
    const submitBtn = screen.getByRole('button', { name: 'Publish Project' });

    // Act: Fill out the form
    fireEvent.change(titleInput, { target: { value: 'My Test Project' } });
    fireEvent.change(descInput, { target: { value: 'This is a long enough description.' } });
    fireEvent.change(stageSelect, { target: { value: 'DEVELOPMENT' } });

    // Submit it!
    fireEvent.submit(submitBtn);

    // Assert 1: UI immediately switches to loading state
    expect(screen.getByText('Launching...')).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
    expect(titleInput).toBeDisabled();

    // Assert 2: Fetch was called with the correct payload
    expect(global.fetch).toHaveBeenCalledWith('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'My Test Project',
        description: 'This is a long enough description.',
        stage: 'DEVELOPMENT',
        supportRequired: '',
      }),
    });

    // Assert 3: The window.location was updated to the exact string assigned in the component
    await waitFor(() => {
      expect(window.location.href).toBe('http://localhost/');
    });
  });
});