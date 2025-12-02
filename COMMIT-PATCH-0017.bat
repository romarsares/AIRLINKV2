@echo off
echo Committing Patch 0017: Flight & Gate Management UI...
git add -A
git commit -m "Patch 0017: Flight & Gate Management UI with Gate Change Functionality - Added flight management UI integrated into main dashboard - Implemented gate change modal with dropdown selection from database - Added PUT /api/flights/:id/status endpoint for flight updates - Automatic passenger notifications on gate/status changes - Fixed passenger count display (total_passengers vs passenger_count) - Fixed bracelet deactivation to clear passenger assignments - Removed all inline onclick handlers for CSP compliance - Added event delegation for dynamic buttons (sync, deactivate, update) - Gates loaded from database via /api/gates endpoint - Current gate shown first in dropdown with (Current) label - Flight status management (Scheduled, Boarding, Delayed, Cancelled, Departed) - All 200 passengers notified automatically when gate changes - Bracelets auto-sync new gate within 30 seconds - Fixed notifications to use bracelet_id instead of booking_id - Deactivate bracelet now clears assigned_bracelet from bookings table"
git status
echo.
echo Commit completed!
pause
