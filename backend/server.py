from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union
import uvicorn

import random
import string

# Create the FastAPI app
app = FastAPI()

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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)