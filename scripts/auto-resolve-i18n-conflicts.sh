#!/bin/bash

# Auto-resolve Lingui translation conflicts
# This script automatically resolves conflicts in .po files

set -e

echo "🔍 Detecting i18n conflicts..."

# Check if there are any conflicted .po files
conflicted_files=$(git diff --name-only --diff-filter=U | grep '\.po$' || true)

if [ -z "$conflicted_files" ]; then
    echo "✅ No i18n conflicts detected."
    exit 0
fi

echo "📝 Found conflicted .po files:"
echo "$conflicted_files"

for file in $conflicted_files; do
    echo "🔧 Resolving conflicts in $file..."
    
    # Remove conflict markers and keep both versions intelligently
    # Priority: keep "ours" for existing translations, add "theirs" for new ones
    
    # Create a temporary file
    temp_file="${file}.tmp"
    
    # Process the file to remove conflict markers
    awk '
    BEGIN { in_conflict = 0; keep_section = "" }
    /^<<<<<<< HEAD/ { in_conflict = 1; keep_section = "ours"; next }
    /^=======/ { keep_section = "theirs"; next }
    /^>>>>>>> / { in_conflict = 0; next }
    {
        if (in_conflict == 0) {
            print $0
        } else if (keep_section == "ours" && $0 !~ /^#~/) {
            # Keep our version for active translations
            print $0
        } else if (keep_section == "theirs" && $0 !~ /^#~/) {
            # Keep their version for new translations
            print $0
        }
    }
    ' "$file" > "$temp_file"
    
    # Replace original file
    mv "$temp_file" "$file"
    
    echo "✅ Resolved conflicts in $file"
done

echo "🔄 Re-running lingui:extract to normalize files..."
npm run lingui:extract

echo "🔄 Running lingui:compile to validate..."
npm run lingui:compile

echo "📦 Staging resolved files..."
for file in $conflicted_files; do
    git add "$file"
done

echo "✅ All i18n conflicts resolved and files staged!"
echo "💡 You can now run 'git commit' to complete the merge."