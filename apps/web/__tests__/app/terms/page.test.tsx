import { render, screen } from '@testing-library/react';
import TermsPage from '../../../app/terms/page'; // Adjust path

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className: string }) => <div className={className}>{children}</div>,
  },
}));

describe('TermsPage Component', () => {
  it('renders the main Terms of Service heading', () => {
    render(<TermsPage />);
    const mainHeading = screen.getByRole('heading', { level: 1, name: /terms of service/i });
    expect(mainHeading).toBeInTheDocument();
  });

  it('renders all required terms sections', () => {
    render(<TermsPage />);
    expect(screen.getByText(/1\. Acceptance of Terms/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Intellectual Property/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Conduct/i)).toBeInTheDocument();
  });
});