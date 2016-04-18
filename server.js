import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const RIDES_FILE = path.join(__dirname, 'rides.json');
app.set('port', (process.env.PORT || 4000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/api/rides', (req, res) =>
    fs.readFile(RIDES_FILE, (err, data) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.json(JSON.parse(data));
    })
);

app.post('/api/rides', (req, res) =>
    fs.readFile(RIDES_FILE, (err, data) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        let rides = JSON.parse(data);
        // NOTE: In a real implementation, we would likely rely on a database or
        // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
        // treat Date.now() as unique-enough for our purposes.
        const newRide = {
            id: Date.now(),
            riderName: req.body.riderName,
            routeName: req.body.routeName,
	    distanceInMiles: req.body.distanceInMiles,
	    timeToCompleteInHours: req.body.timeToCompleteInHours
        };
        rides = rides.concat(newRide);
        fs.writeFile(RIDES_FILE, JSON.stringify(rides, null, 4), err => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            res.setHeader('Cache-Control', 'no-cache');
            res.json(rides);
        });
    })
);


app.listen(app.get('port'), function() {
    console.log(`Server started: http://localhost: ${app.get('port')}/`);
});
