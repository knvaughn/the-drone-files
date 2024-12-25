# the-drone-files
A semantic search app for fictional drone sightings, designed for entertainment purposes. Users can describe their desired drone sightings (e.g., "a glowing drone flying over a forest at night") and explore creative, story-like results.

## Setup
- [Install Docker](https://www.docker.com/get-started/)
- Ensure you have the following:
  - Docker installed and running
  - If you want to generate sightings data (optional) you will need a valid OpenAI API key
  - Create a .env file in the project root
  - Add the following to the .env file:
    ```
    OPENAI_API_KEY=your_openai_api_key
    REDIS_HOST=redis
    REDIS_PORT=6379
    ```

### Build and start the app
`docker compose up`

## Technologies Used
- Remix: Full-stack web framework.
- Docker: For containerization.
- Redis: Vector database for semantic search.
- OpenAI API: For generating embeddings and fictional data.