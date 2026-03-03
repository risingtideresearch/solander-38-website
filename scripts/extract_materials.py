"""
Material extraction utilities for GLB files.
Provides functions to extract and index material information from 3D models.
"""

import json
import os
import re
from pathlib import Path
from typing import List, Dict, Set, Tuple, Optional

def clean_material_name(material_name: str) -> Optional[str]:
    """
    Clean material name by removing colors, specific terms, and normalizing case.
    
    Args:
        material_name: Raw material name from GLB file
        
    Returns:
        Cleaned material name, or None if material should be ignored
    """
    if not material_name or material_name.strip() == '':
        return None
    
    # Ignore materials with "paint" in the name (case insensitive)
    if 'paint' in material_name.lower():
        return None
    
    # Color terms to strip (case insensitive)
    colors = [
        'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 
        'purple', 'pink', 'brown', 'gray', 'grey',
        'beige', 'tan', 'navy', 'teal', 'cyan',
        'dark', 'light', 'bright', 'pale', 'deep'
    ]
    
    # Other terms to strip (case insensitive)
    other_terms = [
        'matte',
        'bronze tinted',
        'tinted',
        '(internals)',
        '(hull)',
        'polished',
        '(1)', '(2)', '(3)', '(4)', '(5)',  # numbered variants
    ]
    
    # Combine all terms to strip
    terms_to_strip = colors + other_terms
    
    cleaned = material_name
    for term in terms_to_strip:
        # Use word boundaries and case-insensitive matching
        pattern = re.compile(r'\b' + re.escape(term) + r'\b', re.IGNORECASE)
        cleaned = pattern.sub('', cleaned)
    
    # Strip whitespace and collapse multiple spaces
    cleaned = ' '.join(cleaned.split())
    
    # Return None if nothing remains after cleaning
    if not cleaned:
        return None
    
    # Smart capitalization: preserve acronyms and special formatting
    words = cleaned.split()
    normalized_words = []
    
    for word in words:
        # Check if word is in parentheses - preserve what's inside
        if word.startswith('(') and word.endswith(')'):
            normalized_words.append(word.upper())  # (HDPE) stays uppercase
        # Check if word is likely an acronym/code (all caps or mixed case with numbers)
        elif word.isupper() or (any(c.isupper() for c in word) and any(c.isdigit() for c in word)):
            normalized_words.append(word)  # Preserve as-is: AlMgSi1, HDPE
        else:
            normalized_words.append(word.capitalize())  # Regular words: Plastic, Acrylic
    
    cleaned = ' '.join(normalized_words)
    
    return cleaned


def extract_material_names(file_path: str) -> List[str]:
    """
    Extract material names from a GLB file.
    
    Args:
        file_path: Path to the GLB file
        
    Returns:
        List of cleaned material names. Returns empty list if no valid materials found.
        
    Raises:
        ImportError: If pygltflib is not installed
    """
    try:
        from pygltflib import GLTF2
        
        gltf = GLTF2.load(file_path)
        material_names = []
        seen = set()

        if gltf.materials:
            for material in gltf.materials:
                # Handle named vs unnamed materials
                material_name = getattr(material, 'name', None)

                if material_name:
                    cleaned_name = clean_material_name(material_name)
                    if cleaned_name and cleaned_name not in seen:
                        seen.add(cleaned_name)
                        material_names.append(cleaned_name)

        return material_names
        
    except ImportError:
        raise ImportError("pygltflib is required. Install with: pip install pygltflib")
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        return []


def get_glb_files(folder_path: str) -> List[Tuple[str, str]]:
    """
    Find all GLB files in a folder.
    
    Args:
        folder_path: Path to the folder to search
        
    Returns:
        List of tuples containing (filename, full_path)
    """
    if not os.path.exists(folder_path):
        raise FileNotFoundError(f"Folder not found: {folder_path}")
    
    glb_files = []
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path) and filename.lower().endswith('.glb'):
            glb_files.append((filename, file_path))
    
    return glb_files


def create_material_index(
    folder_path: str, 
    output_json: Optional[str] = None,
    verbose: bool = True
) -> Dict:
    """
    Create a material index from all GLB files in a folder.
    
    Args:
        folder_path: Path to folder containing GLB files
        output_json: Optional path to write JSON output. If None, no file is written.
        verbose: Whether to print progress messages
        
    Returns:
        Dictionary containing 'unique_materials', 'material_index', and 'materials_to_models'
        
    Example:
        >>> from material_extractor import create_material_index
        >>> index = create_material_index('./models', verbose=False)
        >>> print(index['unique_materials'])
        ['Metal', 'Wood']
        >>> print(index['materials_to_models']['Metal'])
        ['model1.glb', 'model3.glb']
    """
    # Find all GLB files
    glb_files = get_glb_files(folder_path)
    
    if not glb_files:
        if verbose:
            print("No GLB files found.")
        return {"unique_materials": [], "material_index": {}, "materials_to_models": {}}
    
    if verbose:
        print(f"Processing {len(glb_files)} GLB files...")
    
    # Build the material index (model -> materials)
    material_index = {}
    all_materials = set()
    
    # Build reverse index (material -> models)
    materials_to_models = {}
    
    for i, (filename, file_path) in enumerate(glb_files, 1):
        if verbose:
            print(f"Processing {i}/{len(glb_files)}: {filename}")
        material_names = extract_material_names(file_path)
        
        # Only index files that have materials
        if material_names:
            material_index[filename] = material_names
            all_materials.update(material_names)
            
            # Add to reverse index
            for material_name in material_names:
                if material_name not in materials_to_models:
                    materials_to_models[material_name] = []
                materials_to_models[material_name].append(filename)
    
    # Sort the model lists for each material
    for material_name in materials_to_models:
        materials_to_models[material_name].sort()
    
    # Create output structure
    output = {
        "unique_materials": sorted(list(all_materials)),
        "material_index": material_index,
        # "materials_to_models": materials_to_models
    }
    
    # Write to JSON if output path provided
    if output_json:
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        if verbose:
            print(f"\nMaterial index written to: {output_json}")
    
    if verbose:
        print(f"Total files indexed: {len(material_index)}")
        print(f"Unique materials: {len(all_materials)}")
        print(f"Total material instances: {sum(len(materials) for materials in material_index.values())}")
        print(f"\nMaterial usage:")
        for material in sorted(all_materials):
            model_count = len(materials_to_models[material])
            print(f"  {material}: {model_count} model{'s' if model_count != 1 else ''}")
    
    return output


def get_materials_for_file(file_path: str) -> List[str]:
    """
    Convenience function to get materials for a single file.
    
    Args:
        file_path: Path to GLB file
        
    Returns:
        List of cleaned material names
    """
    return extract_material_names(file_path)


# Command-line interface
def main():
    """Command-line entry point"""
    folder_path = '../frontend/public/models'
    output_json = '../frontend/public/script-output/material_index_simple.json'
    
    create_material_index(folder_path, output_json)


if __name__ == "__main__":
    main()
