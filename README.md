# Solander 38 website
Codebase for both the website CMS and UI/front end. Using https://github.com/sanity-io/sanity-template-nextjs-clean as template.

<!-- <img src="./architecture-diagram.svg" /> -->

### CMS (Sanity Studio)
[/studio/](/studio/)

https://rising-tide.sanity.studio


### Front end (Next.js/React)
[/frontend/](/frontend/)

### Python scripts
[/scripts/](/scripts/)

#### 1. `scripts/export-layers-glb.py`
- Converts Rhino layers to GLB files in `frontend/public/models/`
- Creates `export-manifest.json`
- This must be run inside of Rhino (type `script` to bring up Script Editor)
- ~8 minutes to complete

#### 1b. `scripts/optimize-glb.sh`
- Run after `export-layers-glb.py` to compress all GLB files for web delivery
- Uses [gltfpack](https://github.com/zeux/meshoptimizer) — binary is downloaded automatically on first run
- Applies meshopt compression + mesh simplification (~81% size reduction, 43MB → 8MB)
- Files are processed in-place; no separate output directory
```bash
cd scripts && ./optimize-glb.sh
# Options:
# --dry-run          preview files without modifying them
# --simplify=0.8     set triangle retention ratio (default 0.9)
```
- The front end (`Model3D.tsx`) uses `useGLTF(..., undefined, true)` to decompress meshopt files automatically via `meshoptimizer`

#### 2. `scripts/pdf-to-png.py`
2a. `pdf-to-png.py`
- Converts all drawing PDFs in `frontend/public/drawings/` to PNGs under `frontend/public/drawings/output_images`
- Original PDF is preserved in the directory
- Creates `export-manifest.json`
- ~90 seconds to complete

2b. `create_material_index.py`
– Extracts material info from glb layers
- Creates `material_index_simple.json`

2c. Copies manifests to sanity directory for Drawing and Material dropdowns
