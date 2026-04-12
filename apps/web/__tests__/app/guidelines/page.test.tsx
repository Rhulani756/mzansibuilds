import { render, screen } from '@testing-library/react';
import GuidelinesPage from '../../../app/guidelines/page'; 

describe('Guidelines Page Component', () => {
  it('renders the main page title', () => {
    render(<GuidelinesPage />);
    const mainHeading = screen.getByRole('heading', { level: 1, name: /community guidelines/i });
    expect(mainHeading).toBeInTheDocument();
  });

  it('renders the core community principles', () => {
    render(<GuidelinesPage />);
    
    // Updated to match the actual text in your component!
    expect(screen.getByText(/Build in Public/i)).toBeInTheDocument();
    expect(screen.getByText(/Collaborative Spirit/i)).toBeInTheDocument();
    expect(screen.getByText(/Mzansi Spirit/i)).toBeInTheDocument();
  });
});