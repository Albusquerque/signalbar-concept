# SignalBar Concept Lab

A standalone, interactive visual preview for [SignalBar](https://github.com/Albusquerque/SignalBar). It simulates the official Steam Machine's 17-pixel light bar without installing Decky Loader, reading a Steam account, or writing to hardware.

Try sample-game Artwork (Hero, Header and Capsule), upload an image for local sampling, switch games and per-game display choices, change CPU/GPU loads and temperatures, run a Steam Families or personal countdown, preview every current Light event variant, and explore controller gauges, charging and short alerts. The Priorities tab shows how the signals take turns.

Light-event frames in `event-frames.json` are sampled from the real SignalBar renderer by `export_frames.py`. Other modes are interactive browser approximations, not live telemetry. Sample artwork is from the public Steam store pages for [Deep Rock Galactic](https://store.steampowered.com/app/548430/), [The Witcher 3](https://store.steampowered.com/app/292030/) and [Balatro](https://store.steampowered.com/app/2379780/); each image belongs to its respective publisher. Uploaded images stay in the browser and are not sent anywhere.

The front-on console silhouette uses the **156 mm width × 152 mm height** ratio in [Valve's Steam Machine specifications](https://store.steampowered.com/hardware/steammachine). Valve lists 162.4 mm depth, which a front view cannot show. The lighting and other visual details remain a browser illustration, not a technical rendering.

The website has no dependencies, analytics or third-party runtime requests. Serve this directory over HTTP to test locally:

```sh
python3 -m http.server 8765
```

To refresh the event frames after changing SignalBar's renderer, check out the SignalBar repository as a sibling directory and run `python3 export_frames.py`. The Playwright smoke test is `node test_site.mjs` when Playwright is available in the parent workspace.

GitHub Pages serves this repository directly from the root of its `main` branch. This preview is not a hardware accuracy claim; the real diffuser, brightness and Valve's runtime priorities can differ from the browser simulation.
