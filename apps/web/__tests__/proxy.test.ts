describe('Proxy Middleware Logic', () => {
  const origin = 'http://localhost:3000';

  it('should allow access to landing page for guests', () => {
    const url = new URL('/', origin);
    const isDashboard = url.pathname.startsWith('/dashboard');
    expect(isDashboard).toBe(false);
  });

  it('should identify protected routes', () => {
    const url = new URL('/dashboard/settings', origin);
    const isDashboard = url.pathname.startsWith('/dashboard');
    expect(isDashboard).toBe(true);
  });
});