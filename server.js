// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// --- In-memory "database" of recommended trips ---
let trips = [
  {
    id: 1,
    destination: "New York City, US",
    description: "Two days exploring Manhattan: Times Square, Central Park, and holiday markets.",
    startDate: "2025-12-22",
    endDate: "2025-12-23",
    latitude: 40.7128,
    longitude: -74.0060
  },
  {
    id: 2,
    destination: "Paris, France",
    description: "A long weekend with café hopping, the Louvre, and an evening at the Eiffel Tower.",
    startDate: "2025-03-15",
    endDate: "2025-03-18",
    latitude: 48.8566,
    longitude: 2.3522
  },
  {
    id: 3,
    destination: "Tokyo, Japan",
    description: "City lights, Shibuya Crossing, sushi in Tsukiji, and a day trip to Hakone.",
    startDate: "2025-04-10",
    endDate: "2025-04-16",
    latitude: 35.6762,
    longitude: 139.6503
  },
  {
    id: 4,
    destination: "Reykjavik, Iceland",
    description: "Chasing the Northern Lights, Blue Lagoon, and Golden Circle waterfalls.",
    startDate: "2025-02-01",
    endDate: "2025-02-05",
    latitude: 64.1466,
    longitude: -21.9426
  },
  {
    id: 5,
    destination: "San Francisco, US",
    description: "Golden Gate Bridge, Alcatraz, and day trips to Napa or Silicon Valley.",
    startDate: "2025-08-10",
    endDate: "2025-08-13",
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    id: 6,
    destination: "Rome, Italy",
    description: "Colosseum, Vatican City, gelato, and leisurely evenings in Trastevere.",
    startDate: "2025-05-20",
    endDate: "2025-05-25",
    latitude: 41.9028,
    longitude: 12.4964
  }
];


let nextId = 7;

// --- ROUTES ---

// GET /trips - list all recommended trips
app.get("/trips", (req, res) => {
  res.json(trips);
});

// GET /trips/:id - single trip by id
app.get("/trips/:id", (req, res) => {
  const id = Number(req.params.id);
  const trip = trips.find(t => t.id === id);
  if (!trip) {
    return res.status(404).json({ error: "Trip not found" });
  }
  res.json(trip);
});

// POST /trips - create a new recommended trip
app.post("/trips", (req, res) => {
  const { destination, description, startDate, endDate } = req.body;

  if (!destination || !startDate || !endDate) {
    return res.status(400).json({ error: "destination, startDate, and endDate are required" });
  }

  const newTrip = {
    id: nextId++,
    destination,
    description: description ?? "",
    startDate,
    endDate
  };

  trips.push(newTrip);
  res.status(201).json(newTrip);
});

// PUT /trips/:id - update an existing trip
app.put("/trips/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = trips.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Trip not found" });
  }

  const { destination, description, startDate, endDate } = req.body;
  const existing = trips[index];

  const updatedTrip = {
    ...existing,
    destination: destination ?? existing.destination,
    description: description ?? existing.description,
    startDate: startDate ?? existing.startDate,
    endDate: endDate ?? existing.endDate
  };

  trips[index] = updatedTrip;
  res.json(updatedTrip);
});

// DELETE /trips/:id - delete a trip
app.delete("/trips/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = trips.length;
  trips = trips.filter(t => t.id !== id);
  if (trips.length === before) {
    return res.status(404).json({ error: "Trip not found" });
  }
  res.status(204).send();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`TravelPal API running on http://localhost:${PORT}`);
});
