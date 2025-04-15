#!/bin/bash

PROJECT=$1
if [ -z "$PROJECT" ]; then
	echo "❌ Usage: $0 <project-name>"
	exit 1
fi

echo "🔄 Updating $PROJECT..."

git fetch "$PROJECT"
git merge --allow-unrelated-histories --no-edit -s recursive -X theirs "$PROJECT/main"
git read-tree --prefix="$PROJECT/" -u "$PROJECT/main"
git commit -m "🔄 Updated $PROJECT from its repo"
