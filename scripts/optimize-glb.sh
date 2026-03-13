#!/usr/bin/env bash
set -e

MODELS_DIR="$(dirname "$0")/../frontend/public/models"
GLTFPACK_BIN="$(dirname "$0")/gltfpack"
SIMPLIFY=0.92  # retain 92% of triangles; lower = smaller files
DRY_RUN=0

# Parse args
for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=1 ;;
    --simplify=*) SIMPLIFY="${arg#*=}" ;;
  esac
done

# Download gltfpack binary if not present
if [ ! -f "$GLTFPACK_BIN" ]; then
  echo "Downloading gltfpack..."
  RELEASE_URL="https://github.com/zeux/meshoptimizer/releases/latest/download/gltfpack-macos.zip"
  TMPZIP="$(dirname "$0")/gltfpack.zip"
  curl -fsSL -o "$TMPZIP" "$RELEASE_URL"
  unzip -o -j "$TMPZIP" "gltfpack" -d "$(dirname "$0")"
  rm "$TMPZIP"
  chmod +x "$GLTFPACK_BIN"
  echo "Downloaded to $GLTFPACK_BIN"
fi

# Count files
TOTAL=$(find "$MODELS_DIR" -name "*.glb" | wc -l | tr -d ' ')
echo "Found $TOTAL GLB files in $MODELS_DIR"
echo "Simplify ratio: $SIMPLIFY  |  Meshopt compression: yes"
[ "$DRY_RUN" -eq 1 ] && echo "(dry run — no files will be modified)"
echo ""

BEFORE_SIZE=$(du -sk "$MODELS_DIR" | cut -f1)
COUNT=0
FAILED=0

while IFS= read -r -d '' INPUT; do
  FILENAME=$(basename "$INPUT")
  COUNT=$((COUNT + 1))

  BEFORE=$(stat -f%z "$INPUT" 2>/dev/null || stat -c%s "$INPUT")

  if [[ "$FILENAME" == *"(for website)"* ]]; then
    echo "[$COUNT/$TOTAL] (skipped) $FILENAME"
    continue
  fi

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "[$COUNT/$TOTAL] (dry run) $FILENAME"
    continue
  fi

  TMPFILE="${INPUT%.glb}.tmp.glb"

  if "$GLTFPACK_BIN" -i "$INPUT" -o "$TMPFILE" -si "$SIMPLIFY" -cc 2>/dev/null; then
    AFTER=$(stat -f%z "$TMPFILE" 2>/dev/null || stat -c%s "$TMPFILE")
    SAVED=$(( (BEFORE - AFTER) * 100 / BEFORE ))
    mv "$TMPFILE" "$INPUT"
    printf "[$COUNT/$TOTAL] %-70s %6dK → %4dK  (-%d%%)\n" \
      "$FILENAME" "$((BEFORE/1024))" "$((AFTER/1024))" "$SAVED"
  else
    rm -f "$TMPFILE"
    echo "[$COUNT/$TOTAL] FAILED: $FILENAME"
    FAILED=$((FAILED + 1))
  fi
done < <(find "$MODELS_DIR" -name "*.glb" -print0 | python3 -c "
import sys, os
items = sys.stdin.buffer.read().split(b'\x00')
items = [i for i in items if i]
for i in sorted(items):
    sys.stdout.buffer.write(i + b'\x00')
")

if [ "$DRY_RUN" -eq 0 ]; then
  AFTER_SIZE=$(du -sk "$MODELS_DIR" | cut -f1)
  TOTAL_SAVED=$(( (BEFORE_SIZE - AFTER_SIZE) * 100 / BEFORE_SIZE ))
  echo ""
  echo "Done. ${BEFORE_SIZE}K → ${AFTER_SIZE}K  (-${TOTAL_SAVED}%)"
  [ "$FAILED" -gt 0 ] && echo "  $FAILED file(s) failed to optimize"

  # Update manifest with new file sizes
  MANIFEST="$MODELS_DIR/export_manifest.json"
  if [ -f "$MANIFEST" ]; then
    python3 -c "
import json, os
with open('$MANIFEST') as f:
    manifest = json.load(f)
updated = 0
for layer in manifest['exported_layers']:
    filepath = os.path.join('$MODELS_DIR', layer['filename'])
    if os.path.exists(filepath):
        new_size = os.path.getsize(filepath)
        if new_size != layer['file_size']:
            layer['original_file_size'] = layer.get('original_file_size', layer['file_size'])
            layer['file_size'] = new_size
            updated += 1
manifest['export_info']['total_file_size'] = sum(l['file_size'] for l in manifest['exported_layers'])
with open('$MANIFEST', 'w') as f:
    json.dump(manifest, f, indent=2)
print(f'  Updated manifest: {updated} entries')
"
  fi
fi
