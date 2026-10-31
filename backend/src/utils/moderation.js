
import axios from "axios";

const MODERATION_URL = "https://api.openai.com/v1/moderations";
const MODERATION_MODEL = "omni-moderation-latest";

export const moderateText = async (text) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Valid text is required for moderation");
  }

  const response = await axios.post(
    MODERATION_URL,
    {
      model: MODERATION_MODEL,
      input: text
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 15000
    }
  );

  const result = response.data?.results?.[0];

  if (!result) {
    throw new Error("Invalid moderation API response");
  }

  return {
    flagged: result.flagged,
    categories: result.categories,
    categoryScores: result.category_scores
  };
};


// Check whether the student appears to express
// an intention to harm themselves.
export const hasSelfHarmIntent = (result) => {
  return Boolean(
    result?.categories?.self_harm_intent
  );
};
