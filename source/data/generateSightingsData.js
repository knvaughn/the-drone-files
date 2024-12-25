import { OpenAI } from "openai";
import { writeFileSync, existsSync, readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const batchesToGenerate = 10;
const outputFilePath = "source/data/dataset.json";

const isValidJson = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

const generateSightings = async () => {
  const prompt = `
    Generate 10 unique, highly detailed fictional drone sighting summaries in JSON format. Each summary should follow this structure:
    {
      "location": "City, State",
      "timeOfDay": "Morning/Afternoon/Evening/Night",
      "size": "Small/Medium/Large",
      "lights": "Description of lights",
      "purpose": "Recreational/Delivery/Mysterious",
      "description": "Detailed narrative written in a style appropriate for the observer"
    }
    Respond with a JSON array of 10 objects. Ensure all objects are valid JSON, with no extra text or examples.

    ### **Instructions for Descriptions**
    1. **Add Realism**: Each description should sound like a real person wrote it. Avoid generic phrasing and repetitive language. Each observer should provide unique details about their sighting.
    2. **Include Emotional Reactions**: Highlight specific emotions such as amazement, curiosity, skepticism, fear, excitement, or indifference, depending on the observer's perspective.
    3. **Use Varied Tones**: Mix formal, conversational, technical, dramatic, and speculative tones. Reflect the observer's background in the writing style.
    4. **Avoid Formulaic Writing**: Do not use repetitive, generic phrasing like "As a..." or "I was... when..." or use similar sentence structures. Vary phrasing and vocabulary to make each description feel distinct and like a real person wrote it.
    5. **Add Personal Context**: Include anecdotes about the observer's activity, environment, or reaction.
    6. **Include Uncertainty and Speculation**: Add phrases like "I think it might have been...", "Not entirely sure, but it looked like...", or "It seemed to be..."
    7. **Describe Environmental Interaction**: Mention how the drone interacted with the surroundings.
    8. **Add Observer-Specific Details**: Reflect the observer's personality, profession, or quirks in their narrative.
    9. **Include Certainty and Professionalism**: Add drone sightings from government, military, scientists, or other professionals. Some people will be able to identify the exact model of the drone.
    10. **Include Creative, Outlandish Accounts**: Add drone sightings that could be attributed to paranormal phenomena or conspiracy theories.
    11. **Use Human Tones**: Ensure variety in tone, and make sure the writing style sounds human. Some more formal for professional personas, and some more casual.

    ### **Personas for Description Inspiration**
    - Military personnel: Detailed, precise, technical.
    - Working professionals: Analytical, skeptical, pragmatic.
    - Average individuals: Casual, conversational, amazed or uncertain.
    - Enthusiasts: Excited, speculative, focused on details.
    - Scientists or researchers: Logical, observational, curious.
    - Conspiracy theorists: Dramatic, speculative, imaginative.
    - Journalists or reporters: Factual, curious, slightly skeptical.
    - Outdoor enthusiasts: Observational, nature-focused, descriptive.
    - Pilots or aviation experts: Technical, comparative, authoritative.
    - Emergency responders: Procedural, cautious, methodical.
    - Paranormal enthusiasts: Speculative, dramatic, imaginative.
    - Tech enthusiasts: Inquisitive, detail-oriented, enthusiastic.
    - Local government officials: Concerned, procedural, inquisitive.
    - Skeptics or cynics: Dismissive, pragmatic, or doubtful.
  `;

  try {
    if (!existsSync(outputFilePath)) {
      writeFileSync(outputFilePath, "[]");
    }

    const existingData = JSON.parse(readFileSync(outputFilePath, "utf8"));

    for (let i = 0; i < batchesToGenerate; i++) {
      console.log(`Generating batch ${i + 1}...`);

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.8,
      });

      const content = response.choices[0]?.message?.content?.trim();

      if (isValidJson(content)) {
        const batch = JSON.parse(content);

        // Add IDs to each sighting
        batch.forEach((sighting, index) => {
          sighting.id = existingData.length + index + 1;
        });

        // Append new data to existing data
        existingData.push(...batch);

        // Save to file
        writeFileSync(outputFilePath, JSON.stringify(existingData, null, 2));
        console.log(`Generated batch:`, batch);
      } else {
        console.error("Invalid JSON response:", summary);
      }
    }

    console.log(`Successfully generated ${batchesToGenerate} batches of sightings.`);
  } catch (error) {
    console.error("Error generating sightings:", error);
  }
};

generateSightings();
