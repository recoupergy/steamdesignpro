export function SteamRoomPreview() {
  return (
    <figure className="steam-preview" aria-labelledby="steam-preview-caption">
      <div className="steam-preview__chrome" aria-hidden="true">
        <span />
        <span />
        <span />
        <p>Compact steam shower · live plan</p>
        <strong>3D</strong>
      </div>
      <div className="steam-preview__stage">
        <svg
          className="steam-preview__room"
          viewBox="0 0 760 560"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="preview-floor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f8fbfa" />
              <stop offset="1" stopColor="#dce8e6" />
            </linearGradient>
            <linearGradient id="preview-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#dff8f5" stopOpacity="0.72" />
              <stop offset="1" stopColor="#b5d8d6" stopOpacity="0.28" />
            </linearGradient>
            <filter id="preview-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#092d30" floodOpacity="0.16" />
            </filter>
          </defs>

          <ellipse cx="385" cy="472" rx="260" ry="56" fill="#789998" opacity="0.16" />
          <g filter="url(#preview-shadow)">
            <path d="M145 386 398 244 635 373 382 519Z" fill="url(#preview-floor)" stroke="#87a3a1" strokeWidth="3" />
            <path d="M145 386V126L398 28v216Z" fill="#f7faf8" stroke="#87a3a1" strokeWidth="3" />
            <path d="M398 244V28l237 104v241Z" fill="#edf4f2" stroke="#87a3a1" strokeWidth="3" />

            <g stroke="#cddbd8" strokeWidth="1.5" opacity="0.84">
              <path d="M145 181 398 83M145 236 398 138M145 291 398 193M145 346 398 248" />
              <path d="M208 102v260M271 78v260M334 53v260" />
              <path d="M398 83 635 187M398 138 635 242M398 193 635 297M457 54v222M516 80v222M575 106v222" />
              <path d="m208 350 237 130M271 315l237 130M334 280l237 130M461 279 208 425M524 314 271 460M587 349 334 495" />
            </g>

            <path d="m178 356 140-77 92 50-140 80Z" fill="#d7e3e1" stroke="#7e9997" strokeWidth="3" />
            <path d="m178 356 92 53v45l-92-53Z" fill="#c2d2d0" stroke="#7e9997" strokeWidth="3" />
            <path d="m270 409 140-80v45l-140 80Z" fill="#e8efed" stroke="#7e9997" strokeWidth="3" />

            <path d="M514 307v-88l78 34v96Z" fill="#163a3c" stroke="#79aaa7" strokeWidth="3" />
            <path d="M525 238v-8l56 24v8Z" fill="#74d5cf" opacity="0.82" />
            <circle cx="550" cy="284" r="5" fill="#7ce0d9" />
            <path d="M563 289h16" stroke="#7ce0d9" strokeWidth="4" strokeLinecap="round" />

            <circle cx="211" cy="239" r="16" fill="#ba7b28" stroke="#fff8e9" strokeWidth="5" />
            <path d="M211 214c-15-21 18-28 2-52M223 218c21-19-8-32 15-48" fill="none" stroke="#7bc9c4" strokeWidth="5" strokeLinecap="round" opacity="0.82" />

            <path d="M448 272 635 373v-241L448 51Z" fill="url(#preview-glass)" stroke="#6f9e9c" strokeWidth="3" />
            <path d="M548 318V96" stroke="#6f9e9c" strokeWidth="3" />
            <circle cx="564" cy="225" r="6" fill="#b77b2f" />

            <path d="M385 529 650 377" stroke="#123b3d" strokeWidth="2" />
            <path d="m385 529 14-2-7-12M650 377l-14 2 7 12" fill="none" stroke="#123b3d" strokeWidth="2" />
            <rect x="487" y="435" width="73" height="27" rx="13.5" fill="#fff" stroke="#a9bcba" />
            <text x="523.5" y="453" textAnchor="middle" fill="#29494a" fontSize="14" fontWeight="700">4′ 0″</text>
          </g>
        </svg>

        <div className="steam-preview__readout steam-preview__readout--volume" aria-hidden="true">
          <span>Finished volume</span>
          <strong>160.0 ft³</strong>
          <small>5′ × 4′ × 8′</small>
        </div>
        <div className="steam-preview__readout steam-preview__readout--system" aria-hidden="true">
          <span>Preliminary match</span>
          <strong>K-32326-NA</strong>
          <small>9 kW · 240 V / 60 A</small>
        </div>
        <div className="steam-preview__view-switch" aria-hidden="true">
          <span className="is-active">Perspective</span>
          <span>Plan</span>
          <span>Elevation</span>
        </div>
      </div>
      <figcaption id="steam-preview-caption" className="visually-hidden">
        A representative SteamDesignPro workspace showing a dimensioned enclosure and a preliminary generator recommendation.
      </figcaption>
    </figure>
  );
}
