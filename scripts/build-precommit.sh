diff=$(git diff src/ package.json)
size=${#diff}

if [ $size = 0 ]; then
  npm run lint
  echo 'Building js for production before committing...' | chalk yellow
  echo 'The built file will be added to the commit automatically.' | chalk red bold
  npm run build
  git add dist
else
  echo 'Found uncommitted changes. Skipping automatic JS production build.' | chalk yellow 
  sleep 1
fi
