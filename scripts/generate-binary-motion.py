"""Rebuild deterministic decorative binary sequences; no personal data."""
from pathlib import Path
import json
import random
rng = random.Random(1931)
data = {
    'columns': [''.join(rng.choice('01') for _ in range(52)) for _ in range(24)],
    'logo': [''.join(rng.choice('01') for _ in range(18)) for _ in range(5)],
}
root = Path(__file__).resolve().parents[1]
(root / 'src' / 'binary-sequences.json').write_text(json.dumps(data, indent=2) + '\n')
