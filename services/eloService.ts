const K_FACTOR = 32;

/**
 * Calculates the expected score of a player in a match.
 */
const calculateExpectedScore = (playerRating: number, opponentRating: number): number => {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
};

/**
 * Updates the ratings of two players based on the match outcome.
 */
export const updateRatings = (
  winnerRating: number,
  loserRating: number
): { newWinnerRating: number; newLoserRating: number } => {
  const expectedWinnerScore = calculateExpectedScore(winnerRating, loserRating);
  const expectedLoserScore = calculateExpectedScore(loserRating, winnerRating);

  const newWinnerRating = Math.round(winnerRating + K_FACTOR * (1 - expectedWinnerScore));
  const newLoserRating = Math.round(loserRating + K_FACTOR * (0 - expectedLoserScore));

  return { newWinnerRating, newLoserRating };
};
