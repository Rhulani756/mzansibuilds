import { render, screen } from '@testing-library/react';
// FIX: Adjusted path from ../../../ to ../../
import RootLayout, { metadata } from '../../app/layout'; 

// 1. Mock the Next.js font optimizer
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mock-inter-font' }),
}));

// 2. Mock the Header and Footer to keep this test isolated
// FIX: Adjusted path from ../../../ to ../../
jest.mock('../../components/Header', () => {
  return function MockHeader() {
    return <header data-testid="mock-header">Header</header>;
  };
});

// FIX: Adjusted path from ../../../ to ../../
jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="mock-footer">Footer</footer>;
  };
});

describe('RootLayout Component', () => {
  
  it('exports the correct static metadata', () => {
    // Asserting that your SEO data is exactly what you expect
    expect(metadata.title).toBe('MzansiBuilds | Derivco Code Skills Challenge');
    expect(metadata.description).toBe('Track your milestones, collaborate with peers, and earn your spot on the Celebration Wall.');
  });

  it('renders the Header, children inside a main tag, and Footer', () => {
    // Act: Render the layout with a dummy child component
    render(
      <RootLayout>
        <div data-testid="mock-page-content">Hello Mzansi</div>
      </RootLayout>
    );

    // Assert: The Header should be present
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();

    // Assert: The children should be present and wrapped in the <main> tag
    const mainElement = screen.getByRole('main');
    const pageContent = screen.getByTestId('mock-page-content');
    
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('flex-1'); 
    expect(mainElement).toContainElement(pageContent);
    expect(pageContent).toHaveTextContent('Hello Mzansi');

    // Assert: The Footer should be present
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });
});