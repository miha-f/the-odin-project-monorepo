#!/bin/bash

# Absolute path to monorepo (current directory)
MONOREPO_DIR=$(pwd)

# Path to directory containing your projects (adjust if needed)
PROJECTS_DIR="$MONOREPO_DIR/../the_odin_project"

if [[ ! -d "$PROJECTS_DIR" ]]; then
	echo "❌ Projects directory does not exist: $PROJECTS_DIR"
	exit 1
fi

cd "$MONOREPO_DIR" || exit 1
git init

echo "📦 Importing projects into monorepo from $PROJECTS_DIR"

for dir in "$PROJECTS_DIR"/*; do
	if [ ! -d "$dir/.git" ]; then
		echo "⚠️  Skipping $(basename "$dir") — not a git repo"
		continue
	fi

	PROJECT=$(basename "$dir")

	# Check if remote already added
	if git remote | grep -q "^$PROJECT$"; then
		echo "🔁 $PROJECT already has remote — skipping"
		continue
	fi

	# Check if project already imported
	if [ -d "$MONOREPO_DIR/$PROJECT" ]; then
		echo "⚠️  $PROJECT already exists in monorepo — skipping"
		continue
	fi

	echo "🚀 Importing $PROJECT..."

	git remote add "$PROJECT" "$dir"
	git fetch "$PROJECT"

	git merge --allow-unrelated-histories --no-edit -s ours "$PROJECT/main"
	git read-tree --prefix="$PROJECT/" -u "$PROJECT/main"

	git commit -m "🌳 Imported $PROJECT into monorepo"

	echo "✅ Imported $PROJECT"
done

echo "🎉 Done! All projects are now part of your monorepo."
