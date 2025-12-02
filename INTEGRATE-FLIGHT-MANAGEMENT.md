# Integration Guide: Add Flight Management to Main Dashboard

## Step 1: Add to index.html HEAD section

```html
<!-- Add this line after existing CSS links -->
<link rel="stylesheet" href="css/flights.css">
```

## Step 2: Add to index.html BODY - Replace Flights Section

Find the `<section id="flights" class="section">` and replace it with:

```html
<!-- Flights Section with Gate Management -->
<section id="flights" class="section">
    <h2>Flight Schedule & Gates</h2>
    
    <div class="flights-table">
        <table id="flightsTable">
            <thead>
                <tr>
                    <th>Flight No</th>
                    <th>Destination</th>
                    <th>Gate</th>
                    <th>Departure</th>
                    <th>Status</th>
                    <th>Passengers</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="flightsTableBody"></tbody>
        </table>
    </div>
</section>
```

## Step 3: Add Modal Before Closing </body> tag

```html
<!-- Gate Change Modal -->
<div id="gateChangeModal" class="modal">
    <div class="modal-content">
        <h3>Update Flight</h3>
        <form id="gateChangeForm">
            <input type="hidden" id="flightId">
            
            <div class="form-group">
                <label>Flight Number</label>
                <input type="text" id="flightNumber" readonly>
            </div>
            
            <div class="form-group">
                <label>Gate Number</label>
                <input type="text" id="newGate" required placeholder="e.g., G5">
            </div>
            
            <div class="form-group">
                <label>Flight Status</label>
                <select id="flightStatus" required>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Departed">Departed</option>
                </select>
            </div>
            
            <div class="form-group" id="delayGroup" style="display:none;">
                <label>Delay Minutes</label>
                <input type="number" id="delayMinutes" min="0">
            </div>
            
            <div class="form-group" id="reasonGroup" style="display:none;">
                <label>Reason</label>
                <textarea id="changeReason" rows="3" placeholder="e.g., Aircraft maintenance required"></textarea>
            </div>
            
            <div class="modal-actions">
                <button type="submit" class="btn-primary">Update Flight</button>
                <button type="button" class="btn-secondary" onclick="closeGateModal()">Cancel</button>
            </div>
        </form>
    </div>
</div>
```

## Step 4: Add Script Before Closing </body> tag

```html
<!-- Add this line after existing script tags -->
<script src="js/flights.js"></script>
```

## Step 5: Update dashboard.js

Add this to your dashboard.js to load flights when Flights tab is clicked:

```javascript
// Add to navigation button click handler
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        
        // Existing code...
        
        // Add this for flights section
        if (section === 'flights' && window.flightManager) {
            flightManager.loadFlights();
        }
    });
});
```

## Complete! 

Now when you click the "Flights" tab in your dashboard:
- You'll see the flight table with gate numbers
- Click "Update" to change gates
- All passengers get notified automatically
- Bracelets sync within 30 seconds

## Files Already Created:
- ✅ `frontend/src/js/flights.js`
- ✅ `frontend/src/css/flights.css`
- ✅ `database/patch-0017-gate-management-ui.sql`

Just integrate the HTML snippets above into your existing `index.html`!
