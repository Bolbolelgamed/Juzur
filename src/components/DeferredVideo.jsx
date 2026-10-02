import { useRef, useState } from 'react';

export default function DeferredVideo({ src, poster, posterSrcSet, label, playLabel, unsupported, width = 720, height = 1280, id, className = '', muted = false, loop = false, eagerPoster = false }) {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);

  function startVideo() {
    const video = videoRef.current;
    if (!video) return;
    // Attach the media URL only after a deliberate click, including on mobile.
    video.src = src;
    video.controls = true;
    setActive(true);
    video.load();
    video.play().catch(() => { /* Native controls allow retry if playback is blocked. */ });
  }

  function pauseOtherVideos() {
    document.querySelectorAll('video').forEach((video) => {
      if (video !== videoRef.current) video.pause();
    });
  }

  return <div className="deferred-video" data-active={active} style={{ '--video-ratio': `${width} / ${height}` }}>
    {!active && <>
      <img className="deferred-video-poster" src={poster} srcSet={posterSrcSet} sizes="(max-width: 680px) calc(100vw - 48px), 360px" alt="" width={width} height={height} loading={eagerPoster ? 'eager' : 'lazy'} decoding="async" />
      <button className="deferred-video-play" type="button" onClick={startVideo} aria-label={`${playLabel}: ${label}`}>
        <span className="deferred-video-play-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
        <span>{playLabel}</span>
      </button>
    </>}
    <video ref={videoRef} id={id} className={className} controls={active} muted={muted} loop={loop} playsInline preload="none" width={width} height={height} aria-label={label} onPlay={pauseOtherVideos}>
      {unsupported}
    </video>
  </div>;
}
