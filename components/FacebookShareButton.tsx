"use client";

type FacebookShareButtonProps = {
  url: string;
  label?: string;
};

export default function FacebookShareButton({
  url,
  label = "Share on Facebook",
}: FacebookShareButtonProps) {
  function shareOnFacebook() {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;

    window.open(
      facebookShareUrl,
      "_blank",
      "noopener,noreferrer,width=650,height=500"
    );
  }

  return (
    <button
      type="button"
      className="facebook-share-button"
      onClick={shareOnFacebook}
      aria-label={label}
      title={label}
    >
      <img
        src="/icons/facebook.png"
        alt=""
        className="facebook-share-icon"
        aria-hidden="true"
      />
    </button>
  );
}