import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  const apiUrl = process.env.GEMINI_API_URL;
  const prompt = `You are ${assistantName}, a voice assistant made by ${userName}.
Reply ONLY with a raw JSON object (no markdown):
{"type":"general"|"google_search"|"youtube_search"|"youtube_play"|"get_time"|"get_date"|"get_day"|"get_month"|"calculator_open"|"instagram_open"|"facebook_open"|"whatsapp_open"|"weather_show","userInput":"<user input>","response":"<short spoken reply>"
if you know the answer of something keep it in general category and give short answer
}
User said: ${command}`;

  try
  {
    const result = await axios.post(apiUrl, {
    contents: [{ parts: [{ text: prompt }] }],
  });

  const rawText = result.data.candidates[0].content.parts[0].text;
  console.log("Gemini raw response:", rawText);
  return rawText;
}
  catch(error){
    // 👇 This will show you the REAL error from Gemini
        if (error.response) {
            console.error("Gemini API error status:", error.response.status)
            console.error("Gemini API error data:", JSON.stringify(error.response.data, null, 2))
        } else {
            console.error("Gemini network error:", error.message)
        }
        throw error // re-throw so controller catches it
    }
};

export default geminiResponse;
