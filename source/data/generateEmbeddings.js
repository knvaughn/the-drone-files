import { OpenAI } from "openai";
import Redis from "ioredis";
import dotenv from "dotenv";
import { readFileSync } from "fs";
const dataset = JSON.parse(readFileSync(new URL("../data/dataset.json", import.meta.url)));

dotenv.config();

const redis = new Redis();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateEmbeddings = async () => {
  for (const sighting of dataset) {
    const { id, location, timeOfDay, size, lights, purpose, description } = sighting;

    try {
      console.log(`Generating embedding for sighting ID: ${id}`);
      
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: description,
      });

      const embedding = response.data[0]?.embedding;

      if (!embedding) {
        console.error(`Failed to generate embedding for sighting ID: ${id}`);
        continue;
      }

      // Store sighting in Redis as a hash
      const redisKey = `sighting:${id}`;
      await redis.hset(redisKey, {
        location,
        timeOfDay,
        size,
        lights,
        purpose,
        description,
        embedding: JSON.stringify(embedding), // Store embedding as a JSON string
      });

      console.log(`Stored embedding for sighting ID: ${id}`);
    } catch (error) {
      console.error(`Error processing sighting ID: ${id}`, error);
    }
  }

  redis.disconnect();
  console.log("Finished storing embeddings in Redis.");
};

generateEmbeddings().catch((err) => console.error("Fatal error:", err));
