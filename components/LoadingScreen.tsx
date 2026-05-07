export default function LoadingScreen() {
  return (
    <main className="loading-page">
      <div className="loading-grid" />
      <div className="loading-scan-line" />
      <div className="loading-border-accent" />

      <div className="loading-logo">
        <img
          src="/images/sulertia-logo.png"
          alt="Sulertia Media"
          className="loading-logo-img"
        />

        <div className="loading-signal">
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
        </div>

        <div className="loading-status">
          <span className="loading-dot" />
          AI scanning world news
        </div>
      </div>
    </main>
  );
}