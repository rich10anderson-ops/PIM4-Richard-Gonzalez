import React from 'react';
interface PageLayoutProps {
  children: React.ReactNode;
}
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <header className="header">
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      
      <main className="main-content">
        {children}
      </main>
      
      <footer className="footer">
        <p>&copy; 2026 My App</p>
      </footer>
    </div>
  );
}
export function HomePage() {
  return (
    <PageLayout>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main content.</p>
    </PageLayout>
  );
}

export function AboutPage() {
  return (
    <PageLayout>
      <h1>About Us</h1>
      <p>We are a company that does things.</p>
    </PageLayout>
  );
}