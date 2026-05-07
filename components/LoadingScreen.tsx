export default function LoadingScreen() {
  return (
    <main className="loading-page">
      <div className="loading-grid" />
      <div className="loading-scan-line" />
      <div className="loading-border-accent" />

      <div className="loading-logo">
        <div className="loading-wordmark">
          SULERTIA<span>MEDIA</span>
        </div>

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