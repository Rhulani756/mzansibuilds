import { render, screen } from '@testing-library/react';
import ProjectsLayout from '.../../../app/projects/new/layout'; // Adjust path
import { createClient } from '../../../../utils/supabase/server';
import { redirect } from 'next/navigation';

// Mock dependencies
jest.mock('../../../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('ProjectsLayout Component', () => {
  const mockGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: mockGetUser },
    });
  });

  it('redirects to /login if the user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    // Await the layout component
    await ProjectsLayout({ children: <div data-testid="child">Protected Content</div> });

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('renders the children if the user IS authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } } });

    const ResolvedLayout = await ProjectsLayout({ children: <div data-testid="child">Protected Content</div> });
    render(ResolvedLayout);

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });
});