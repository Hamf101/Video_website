#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <video.mp4>"
    exit 1
fi

INPUT_VIDEO=$1
BASENAME="${INPUT_VIDEO%.*}"
POSTER="${BASENAME}_poster.jpg"
WEBM="${BASENAME}.webm"

echo "Processing $INPUT_VIDEO..."

# Activate the venv
source venv/bin/activate

# 1. Extract the poster (first frame)
echo "Extracting poster to $POSTER..."
static_ffmpeg -y -i "$INPUT_VIDEO" -vframes 1 -q:v 2 "$POSTER"

# 2. Compress to WebM (VP9, constrained quality)
echo "Compressing video to $WEBM (this will take a while)..."
static_ffmpeg -y -i "$INPUT_VIDEO" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "$WEBM"

# 3. Delete the original MP4
echo "Deleting original file $INPUT_VIDEO..."
rm "$INPUT_VIDEO"

echo "Done! Generated $WEBM and $POSTER."
