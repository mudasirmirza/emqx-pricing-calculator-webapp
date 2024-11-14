// api/server.js

const express = require('express');
const path = require('path');
const serverless = require('serverless-http');

const app = express();
const PORT = process.env.PORT || 3000;

// Pricing Constants
const PRICING = {
    sessionMinutesPerMillion: 2.00,
    trafficPerGB: 0.15,
    ruleActionsPerMillion: 0.25,
    freeQuota: {
        sessionMinutes: 1000000,
        trafficGB: 1,
        ruleActions: 1000000
    }
};

// Middleware to parse URL-encoded data from POST requests
app.use(express.urlencoded({ extended: true }));

// Serve static HTML from public folder
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Handle the form submission
app.post('/api/calculate', (req, res) => {
    const devices = parseInt(req.body.devices);
    const messageFrequencies = req.body.messageFrequency;
    const frequencyUnits = req.body.frequencyUnit;
    const messageSizes = req.body.messageSize;
    const sizeUnits = req.body.sizeUnit;

    if (isNaN(devices) || devices <= 0) {
        return res.send('Please provide a valid number of devices.');
    }

    let totalMessagesPerMinute = 0;
    let totalTrafficKB = 0;

    // Aggregate the total messages per minute and total traffic (in KB) for all configurations
    for (let i = 0; i < messageFrequencies.length; i++) {
        const frequency = parseFloat(messageFrequencies[i]);
        const unit = frequencyUnits[i];
        let sizeKB = parseFloat(messageSizes[i]);
        const sizeUnit = sizeUnits[i];

        if (isNaN(frequency) || isNaN(sizeKB) || frequency <= 0 || sizeKB <= 0) {
            return res.send('Please provide valid input values for all configurations.');
        }

        // Convert message size to KB if it's in Bytes
        if (sizeUnit === 'Bytes') {
            sizeKB = sizeKB / 1024; // Convert Bytes to KB
        }

        // Convert to messages per minute
        let messagesPerMinute = 0;
        if (unit === 'seconds') {
            messagesPerMinute = frequency * 60;
        } else if (unit === 'minutes') {
            messagesPerMinute = frequency;
        } else {
            return res.send('Invalid frequency unit.');
        }

        totalMessagesPerMinute += messagesPerMinute;
        totalTrafficKB += messagesPerMinute * sizeKB;
    }

    // Calculate costs
    const minutesInMonth = 30 * 24 * 60; // Assume 30 days

    // Session Minutes Cost
    const totalSessionMinutes = devices * minutesInMonth;
    const chargeableSessionMinutes = Math.max(totalSessionMinutes - PRICING.freeQuota.sessionMinutes, 0);
    const sessionMinutesCost = (chargeableSessionMinutes / 1000000) * PRICING.sessionMinutesPerMillion;

    // Traffic Cost (in GB)
    const totalTrafficGB = (totalTrafficKB * minutesInMonth * devices) / (1024 * 1024); // KB to GB
    const chargeableTrafficGB = Math.max(totalTrafficGB - PRICING.freeQuota.trafficGB, 0);
    const trafficCost = chargeableTrafficGB * PRICING.trafficPerGB;

    // Rule Actions Cost
    const totalMessagesPerMonth = totalMessagesPerMinute * minutesInMonth * devices;
    const chargeableRuleActions = Math.max(totalMessagesPerMonth - PRICING.freeQuota.ruleActions, 0);
    const ruleActionsCost = (chargeableRuleActions / 1000000) * PRICING.ruleActionsPerMillion;

    // Total Cost
    const totalCost = sessionMinutesCost + trafficCost + ruleActionsCost;

    // Send response
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pricing Summary</title>
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background-color: #f8f9fa;
                    padding-top: 50px;
                }
                .container {
                    max-width: 600px;
                    padding: 20px;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .btn-block {
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Pricing Summary</h1>
                <ul class="list-group">
                    <li class="list-group-item">Session Minutes Cost: <strong>$${sessionMinutesCost.toFixed(2)}</strong></li>
                    <li class="list-group-item">Traffic Cost: <strong>$${trafficCost.toFixed(2)}</strong></li>
                    <li class="list-group-item">Rule Actions Cost: <strong>$${ruleActionsCost.toFixed(2)}</strong></li>
                    <li class="list-group-item list-group-item-primary">Total Monthly Cost: <strong>$${totalCost.toFixed(2)}</strong></li>
                </ul>
                <a href="/" class="btn btn-primary btn-block">Go Back</a>
            </div>

            <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `);
});

// This section is for local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
} else {
    // This section is for serverless deployment (e.g., Vercel)
    module.exports = serverless(app);
}

