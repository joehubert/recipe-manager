#!/bin/bash

# Define source directories
SOURCE_DIRS=("api/src" "database" "ui")

# Define target directory
TARGET_DIR="all-source"

# Create the target directory
mkdir -p "$TARGET_DIR"

# Function to copy and rename files
copy_files() {
    local src_path="$1"
    find "$src_path" -type f | while read -r file; do
        # Remove the leading "./" if present
        clean_path="${file#./}"
        # Replace slashes with hyphens for the new filename
        new_filename="${clean_path//\//-}"
        # Copy the file to the target directory
        cp "$file" "$TARGET_DIR/$new_filename"
    done
}

# Loop through the source directories and copy files
for dir in "${SOURCE_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        copy_files "$dir"
    fi
done

# Add txt extension to docker files:
for file in $TARGET_DIR/docker-*; do
  if [[ -f "$file" ]]; then
    mv "$file" "$file.txt"
  fi
done

#rename ejs files to txt
#rename 's/$/.txt/' "$TARGET_DIR"/*.ejs

echo "Files copied and renamed successfully to $TARGET_DIR"

