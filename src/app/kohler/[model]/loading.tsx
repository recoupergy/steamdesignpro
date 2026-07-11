export default function ModelLoading() {
  return (
    <main className="loading-page" aria-busy="true" aria-live="polite">
      <div className="loading-page__inner">
        <span className="loading-page__indicator" aria-hidden="true" />
        <p className="loading-page__label">Preparing the model planning record…</p>
        <p className="visually-hidden">
          SteamDesignPro is loading the requested model record.
        </p>
      </div>
    </main>
  );
}
