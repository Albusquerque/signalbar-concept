"""Export the real SignalBar light-event renderer for the static simulator.

Run from this directory. The generated JSON is data, not a second animation
implementation. It keeps the concept site faithful to the plugin's sequences.
"""

import json
import math
import sys
from pathlib import Path


HERE = Path(__file__).resolve().parent
SIGNALBAR = HERE.parent / "SignalBar"
sys.path.insert(0, str(SIGNALBAR / "py_modules"))

from signalbar.providers.events import VARIANT_DURATIONS, event_frame  # noqa: E402


def main() -> None:
    fps = 24
    payload = {}
    for variant, duration in VARIANT_DURATIONS.items():
        if variant.startswith("record-"):
            kind = variant
        else:
            kind = variant.split("-", 1)[0]
        count = math.ceil(duration * fps) + 1
        frames = [event_frame(kind, min(duration, index / fps), variant)
                  for index in range(count)]
        payload[variant] = {"duration": duration, "fps": fps, "frames": frames}
    output = HERE / "event-frames.json"
    output.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"{len(payload)} SignalBar variants -> {output} ({output.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
