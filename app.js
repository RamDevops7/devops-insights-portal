const express = require('express');
const path = require('path');
const client = require('prom-client');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const buildCounter = new client.Counter({
  name: 'di_builds_total',
  help: 'Total builds simulated'
});
const deployCounter = new client.Counter({
  name: 'di_deploys_total',
  help: 'Total deploys simulated'
});
const errorGauge = new client.Gauge({
  name: 'di_errors_current',
  help: 'Current error count'
});
const responseHistogram = new client.Histogram({
  name: 'di_response_duration_seconds',
  help: 'Response duration histogram',
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2]
});

// Simulated in-memory data
let builds = [];
let deploys = [];
let errorsCurrent = 0;

function simulateActivity() {
  // randomly add simulated builds/deploys/errors
  const b = Math.random() < 0.6;
  if (b) {
    builds.push({ ts: Date.now(), status: Math.random() < 0.9 ? 'success' : 'fail' });
    buildCounter.inc();
  }
  if (Math.random() < 0.5) {
    deploys.push({ ts: Date.now(), environment: 'staging' });
    deployCounter.inc();
  }
  // simulate errors
  errorsCurrent = Math.max(0, Math.round(Math.random() * 5));
  errorGauge.set(errorsCurrent);
}
setInterval(simulateActivity, 7000);
simulateActivity();

// Routes
app.get('/', (req, res) => {
  res.render('index', { builds: builds.slice(-20), deploys: deploys.slice(-20) });
});

app.get('/api/metrics-data', (req, res) => {
  const lastBuilds = builds.slice(-20).map(b => ({ ts: b.ts, status: b.status }));
  res.json({
    builds: lastBuilds,
    deploys: deploys.slice(-20),
    errorsCurrent
  });
});

app.get('/health', (req, res) => {
  const end = responseHistogram.startTimer();
  res.json({ status: 'ok', timestamp: Date.now() });
  end();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Basic POST to simulate a build trigger (useful for Jenkins test)
app.post('/api/trigger-build', (req, res) => {
  const status = req.body.status || (Math.random() < 0.85 ? 'success' : 'fail');
  builds.push({ ts: Date.now(), status });
  buildCounter.inc();
  res.json({ result: 'ok', status });
});

app.listen(port, () => {
  console.log(`DevOps Insights Portal listening on ${port}`);
});
