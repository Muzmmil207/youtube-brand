#!/usr/bin/env bash
# Generates the interface foley in assets/sfx/ from filtered noise.
# Deterministic, license-free, no melodic tones. Re-run after changing a recipe:
#   bash scripts/make-sfx.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/sfx

# gen <name> <duration> <filter chain>
gen() {
  local name=$1 dur=$2 chain=$3
  ffmpeg -v error -y \
    -f lavfi -i "anoisesrc=color=white:r=48000:d=${dur}:seed=7" \
    -af "${chain},alimiter=limit=0.5:level=0" \
    -ar 48000 -ac 1 -c:a pcm_s16le "assets/sfx/${name}.wav"
  printf '%-14s %s\n' "$name" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "assets/sfx/${name}.wav")s"
}

# A real cursor click: a hard broadband transient.
gen click 0.05 "highpass=f=1800,lowpass=f=8000,afade=t=in:st=0:d=0.002,afade=t=out:st=0.006:d=0.044,volume=1.6"

# A softer press, for step changes and buttons.
gen tap 0.07 "bandpass=f=1200:width_type=h:w=900,afade=t=in:st=0:d=0.002,afade=t=out:st=0.01:d=0.06,volume=1.1"

# Switch: two clicks 45 ms apart.
ffmpeg -v error -y \
  -f lavfi -i "anoisesrc=color=white:r=48000:d=0.1:seed=7" \
  -f lavfi -i "anoisesrc=color=white:r=48000:d=0.1:seed=11" \
  -filter_complex "[0]highpass=f=2000,lowpass=f=7000,afade=t=out:st=0.004:d=0.02,volume=1.4[a];[1]highpass=f=2600,lowpass=f=7000,afade=t=out:st=0.004:d=0.02,volume=1.4,adelay=45[b];[a][b]amix=inputs=2:normalize=0,alimiter=limit=0.5:level=0" \
  -ar 48000 -ac 1 -c:a pcm_s16le assets/sfx/toggle.wav

# A chip, badge or number landing: a low, damped pop.
gen pop 0.09 "lowpass=f=1100,highpass=f=120,afade=t=in:st=0:d=0.003,afade=t=out:st=0.012:d=0.078,volume=1.5"

# Text arriving / counters: a dry tick, and a quieter take to rotate with it.
gen tick 0.02 "highpass=f=3200,afade=t=in:st=0:d=0.001,afade=t=out:st=0.003:d=0.017,volume=0.9"
gen tick-soft 0.02 "highpass=f=3600,afade=t=in:st=0:d=0.001,afade=t=out:st=0.003:d=0.017,volume=0.2"

# A slide or swipe, for horizontal motion.
gen swipe 0.24 "bandpass=f=2400:width_type=h:w=1800,afade=t=in:st=0:d=0.06,afade=t=out:st=0.09:d=0.15,volume=1.2"

# Scene cut and large transition.
gen whoosh-short 0.38 "highpass=f=500,afade=t=in:st=0:d=0.09,afade=t=out:st=0.14:d=0.24,volume=0.35"
gen whoosh-long 0.75 "lowpass=f=1600,highpass=f=180,afade=t=in:st=0:d=0.22,afade=t=out:st=0.3:d=0.45,volume=1.5"

# A line, connector or chart drawing: a soft stroke.
gen draw 0.5 "highpass=f=2800,afade=t=in:st=0:d=0.12,afade=t=out:st=0.22:d=0.28,volume=0.3"

# A card or panel landing: weight without a tone.
gen thud 0.16 "lowpass=f=220,afade=t=in:st=0:d=0.004,afade=t=out:st=0.02:d=0.14,volume=1.8"

echo "Wrote $(ls assets/sfx/*.wav | wc -l) files to assets/sfx/"
