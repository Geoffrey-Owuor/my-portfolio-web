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
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Show less
            </button>
          ) : (
            <span /> // Keeps justify-between alignment when only Show More is visible
          )}

          {canShowMore ? (
            <button
              onClick={handleShowMore}
              className="rounded-full border border-blue-400 px-5 py-2 text-sm font-semibold text-blue-500 transition hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
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
