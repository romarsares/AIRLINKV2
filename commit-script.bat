@echo off
echo Initializing git repository...
git init

echo Adding all files...
git add .

echo Committing changes...
git commit -m "0001 - AirLink System v1.0 - Complete implementation with code quality fixes"

echo Creating airlink1.0 branch...
git checkout -b airlink1.0

echo Commit completed successfully!
echo To push to remote repository, run:
echo git remote add origin [your-repository-url]
echo git push -u origin airlink1.0
pause