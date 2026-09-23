"""Export the current SignalBar weather renderer for the offline concept site."""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SIGNALBAR = ROOT.parent / "SignalBar"
sys.path.insert(0, str(SIGNALBAR / "py_modules"))

from signalbar.providers.weather_sequences import weather_sequence  # noqa: E402

CONDITIONS = (
    "clear_day", "clear_night", "rain", "cloud", "breaks", "breaks_night", "snow", "storm"
)
FRAMES_PER_LOOP = 64


def main():
    frames = {
        condition: [
            [weather_sequence(condition, variant, tick * 8 / FRAMES_PER_LOOP)
             for tick in range(FRAMES_PER_LOOP)]
            for variant in range(2)
        ]
        for condition in CONDITIONS
    }
    target = ROOT / "weather-frames.json"
    target.write_text(json.dumps({"fps": 8, "frames": frames}, separators=(",", ":")), encoding="utf-8")
    print(target)


if __name__ == "__main__":
    main()
