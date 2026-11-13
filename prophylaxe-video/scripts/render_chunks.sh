#!/bin/bash
# Render the video in chunks so an interrupted run can resume, then join them.
# Usage: scripts/render_chunks.sh [chrome-headless-shell path]
set -e
cd "$(dirname "$0")/.."
TOTAL=9734; STEP=1250; mkdir -p out/parts
BROWSER=${1:+--browser-executable=$1}
: > out/parts/list.txt
for ((a = 0; a < TOTAL; a += STEP)); do
  b=$((a + STEP - 1)); [ $b -ge $TOTAL ] && b=$((TOTAL - 1))
  f=out/parts/$(printf %05d $a).mp4
  if [ ! -f "$f" ]; then
    npx remotion render src/index.ts Prophylaxe "$f.tmp.mp4" --frames=$a-$b $BROWSER --crf=20 --log=error
    mv "$f.tmp.mp4" "$f"
  fi
  echo "file '$(basename "$f")'" >> out/parts/list.txt
done
ffmpeg -v error -y -f concat -safe 0 -i out/parts/list.txt -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 out/prophylaxe-fsp.mp4
echo DONE
