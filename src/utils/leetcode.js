import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getLeetCodeSolved(username) {
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

  const totalSolved =
    data?.data?.matchedUser?.submitStats?.acSubmissionNum?.find(
      (d) => d.difficulty === "All"
    )?.count || null;

  return totalSolved;
}


const saveLCQuestions = async() => {
  const completedCount = await getLeetCodeSolved("chetan-nan");
  await AsyncStorage.setItem("LC", completedCount + "");
}

export const performLCLock = async() => {
  await saveLCQuestions();
}


export const checkLCUnlocked = async() => {
  const completedCount =  await getLeetCodeSolved("chetan-nan");

  const previousCompletedCount = await AsyncStorage.getItem("LC");

  return completedCount > Number(previousCompletedCount)
}