export const calculateLevel = (score) => {
    if (!score || score < 5) return 0;
    return Math.floor(-2 + Math.sqrt(4 + score));
};

export const getProgress = (score) => {
    const level = calculateLevel(score);
    const sStart = level * level + 4 * level;
    const nextL = level + 1;
    const sEnd = nextL * nextL + 4 * nextL;
    const needed = sEnd - sStart;
    return needed > 0 ? ((score - sStart) / needed) * 100 : 0;
};

export const calculateBalance = (scores) => {
    if (!scores || scores.length === 0) return 100;
    const sum = scores.reduce((a, b) => a + b, 0);
    if (sum === 0) return 100;
    const mean = sum / scores.length;
    const variance = scores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / scores.length;
    return Math.round(Math.max(0, 100 - (Math.sqrt(variance) / mean) * 100));
};
