import requests

from config import YOUTUBE_API_KEY
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union
import uvicorn

import random
import string

# Create the FastAPI app
app = FastAPI()

YOUTUBE_API_KEY = "AIzaSyBnpP6mh-4duSGELYKUu0CXrIURiDIEIHo"  # Replace with your actual YouTube Data API key

# Configure CORS middleware to act as secure proxy for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create our data model for the queue items using Pydantic
class QueueItem(BaseModel):
    video_id: str
    title: str
    
current_song: Optional[QueueItem] = None
current_index: int = 0

# Create a list to store the queue of songs/videos DUMMY QUEUE

queue: List[QueueItem] = [
    QueueItem(
        video_id="tAGnKpE4NCI",
        title="Let It Go (Karaoke Version)"
    ),
    QueueItem(
        video_id="Zi_XLOBDo_Y",
        title="Billie Jean (Karaoke Version)"
    ),
    QueueItem(
        video_id="fJ9rUzIMcZQ",
        title="Bohemian Rhapsody (Karaoke Version)"
    ),
]

# Create a random room code for the session
def generate_room_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

# Store room code for the session
room_code = generate_room_code()


# Create our endpoints

# Endpoint to see what's in the queue
@app.get("/queue/list")
def get_queue():
    return {
        "queue": queue,
        "current_index": current_index
    }

# Endpoint to move to the next song in the queue
@app.get("/queue/next", response_model=Union[QueueItem, dict])
def next_song():
    global current_index
    if current_index < len(queue) - 1:
        current_index += 1
    return queue[current_index]

# Endpoint to move to the previous song in the queue
@app.get("/queue/previous", response_model=Union[QueueItem, dict])
def previous_song():
    global current_index
    if current_index > 0:
        current_index -= 1
    return queue[current_index]

# Endpoint to get the current song in the queue
@app.get("/queue/current", response_model=Union[QueueItem, dict])
def get_current():
    return queue[current_index] if 0 <= current_index < len(queue) else {}


# Endpoint to retrieve the room code
@app.get("/room/code")
def get_room_code():
    return {"room_code": room_code}

# Endpoints for seraching, adding and removing songs from the queue
@app.get("/search")
def search_songs(q: str):
    url = (
        "https://www.googleapis.com/youtube/v3/search"
        f"?part=snippet&type=video&maxResults=10&q={q}&key={YOUTUBE_API_KEY}"
    )
    
    r = requests.get(url).json()
    results = []
    for item in r.get("items", []):
        video_id = item["id"]["videoId"]
        title = item["snippet"]["title"]
        thumbnail = item["snippet"]["thumbnails"]["default"]["url"]

        results.append({
            "video_id": video_id,
            "title": title,
            "thumbnail": thumbnail
        })

    return {"results": results}


@app.post("/queue/add")
def add_song(item: QueueItem):
    queue.append(item)
    return {"message": "Song added to queue"}

@app.delete("/queue/remove/{video_id}")
def remove_song(video_id: str):
    global queue
    queue = [song for song in queue if song.video_id != video_id]
    return {"message": "Song removed from queue"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)