import { render, screen } from '@testing-library/react';
import PrivacyPage from '../../../app/privacy/page'; // Adjust path

// Mock framer-motion to skip animation delays in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className: string }) => <div className={className}>{children}</div>,
  },
}));

describe('PrivacyPage Component', () => {
  it('renders the main Privacy Policy heading', () => {
    render(<PrivacyPage />);
    const mainHeading = screen.getByRole('heading', { level: 1, name: /privacy policy/i });
    expect(mainHeading).toBeInTheDocument();
  });

  it('renders all required policy sections', () => {
    render(<PrivacyPage />);
    expect(screen.getByText(/1\. Information We Collect/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. How We Use Data/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Data Security/i)).toBeInTheDocument();
  });
});