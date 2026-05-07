export function AdEditorial() {
  return (
    <a
      className="ad-banner"
      href="https://gemini.google.com/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Gemini website"
    >
      <img
        className="ad-img desktop"
        src="/images/Gemini-ad.png"
        alt="Gemini Ad"
      />

      <img
        className="ad-img mobile"
        src="/images/Gemini-ad-mobile.png"
        alt="Gemini Ad Mobile"
      />
    </a>
  );
}