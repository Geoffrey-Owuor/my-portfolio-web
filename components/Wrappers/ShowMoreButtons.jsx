const ShowMoreButtons = ({
  canShowMore,
  canShowLess,
  handleShowMore,
  handleShowLess,
}) => {
  return (
    <>
      {(canShowLess || canShowMore) && (
        <div className="mt-10 flex justify-between">
          {canShowLess ? (
            <button
              onClick={handleShowLess}
              className="border-border-subtle text-text-muted hover:bg-surface-raised rounded-full border px-5 py-2 text-sm font-semibold transition-colors"
            >
              Show less
            </button>
          ) : (
            <span /> // Keeps justify-between alignment when only Show More is visible
          )}

          {canShowMore ? (
            <button
              onClick={handleShowMore}
              className="border-accent text-accent hover:bg-accent/10 rounded-full border px-5 py-2 text-sm font-semibold transition-colors"
            >
              Show more...
            </button>
          ) : (
            <span />
          )}
        </div>
      )}
    </>
  );
};

export default ShowMoreButtons;
