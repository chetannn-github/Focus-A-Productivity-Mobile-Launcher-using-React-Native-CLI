export async function getLeetCodeSolved(username) {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "Origin": "https://leetcode.com",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }
        `,
        variables: { username }
      })
    });

    const data = await res.json();
    const submissions = data?.data?.matchedUser?.submitStats?.acSubmissionNum;

    if (!submissions) return null;

    const stats = {
      total: submissions.find((d) => d.difficulty === "All")?.count || 0,
      easy: submissions.find((d) => d.difficulty === "Easy")?.count || 0,
      medium: submissions.find((d) => d.difficulty === "Medium")?.count || 0,
      hard: submissions.find((d) => d.difficulty === "Hard")?.count || 0,
    };

    return stats;
  } catch (error) {
    console.error("LeetCode API Error:", error);
    return null;
  }
}
