import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer'; // Adjust path depending on your folder structure

describe('Footer Component', () => {
  
  // Fake the system time so the copyright year test never breaks in the future!
  beforeAll(() => {
    jest.useFakeTimers();
    // FIX: Appended .getTime() to convert the Date object into epoch milliseconds
    jest.setSystemTime(new Date('2026-04-12').getTime());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders the MzansiBuilds brand name', () => {
    render(<Footer />);
    // Because the logo is split into spans (Mzansi and Builds), we search for the combined text content
    const brandLink = screen.getByRole('link', { name: /mzansi builds/i });
    expect(brandLink).toBeInTheDocument();
  });

  it('renders the correct dynamic copyright year', () => {
    render(<Footer />);
    // It should grab 2026 from our fake system time
    const copyrightText = screen.getByText(/© 2026 MzansiBuilds\. All rights reserved\./i);
    expect(copyrightText).toBeInTheDocument();
  });

  it('renders the platform and legal links properly', () => {
    render(<Footer />);
    
    // Check Platform links
    expect(screen.getByRole('link', { name: /live feed/i })).toHaveAttribute('href', '/feed');
    expect(screen.getByRole('link', { name: /celebration wall/i })).toHaveAttribute('href', '/wall');
    
    // Check Legal links
    expect(screen.getByRole('link', { name: /privacy/i })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /terms/i })).toHaveAttribute('href', '/terms');
  });

  it('renders the GitHub social link with proper security attributes', () => {
    render(<Footer />);
    
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Rhulani756/mzansibuilds');
    
    // CRITICAL: Ensure external links open in a new tab securely
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});