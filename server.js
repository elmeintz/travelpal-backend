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
    description: "Holiday lights, ice skating at Rockefeller Center, and a cozy walk through Central Park.",
    startDate: "2025-12-05",
    endDate: "2025-12-08",
    latitude: 40.7128,
    longitude: -74.0060
  },
  {
    id: 2,
    destination: "Paris, France",
    description: "Christmas markets, museums, and an evening Eiffel Tower sparkle view over hot chocolate.",
    startDate: "2025-12-20",
    endDate: "2025-12-27",
    latitude: 48.8566,
    longitude: 2.3522
  },
  {
    id: 3,
    destination: "Tokyo, Japan",
    description: "Neon nights in Shibuya, temple visits in Asakusa, and a day trip to Mount Fuji.",
    startDate: "2026-01-10",
    endDate: "2026-01-17",
    latitude: 35.6762,
    longitude: 139.6503
  },
  {
    id: 4,
    destination: "Reykjavik, Iceland",
    description: "Northern Lights hunting, Blue Lagoon spa day, and Golden Circle waterfalls.",
    startDate: "2026-02-01",
    endDate: "2026-02-06",
    latitude: 64.1466,
    longitude: -21.9426
  },
  {
    id: 5,
    destination: "Santorini, Greece",
    description: "Dreamy cliffside sunsets in Oia, whitewashed villages, and sailing the caldera.",
    startDate: "2026-03-15",
    endDate: "2026-03-20",
    latitude: 36.3932,
    longitude: 25.4615
  },
  {
    id: 6,
    destination: "Bora Bora, French Polynesia",
    description: "Overwater bungalows, crystal-clear lagoons, and snorkeling with tropical fish.",
    startDate: "2026-04-05",
    endDate: "2026-04-12",
    latitude: -16.5004,
    longitude: -151.7415
  },
  {
    id: 7,
    destination: "Maldives",
    description: "Private villas over the water, reef snorkeling, and slow mornings with ocean views.",
    startDate: "2026-05-10",
    endDate: "2026-05-17",
    latitude: 3.2028,
    longitude: 73.2207
  },
  {
    id: 8,
    destination: "Rome, Italy",
    description: "Ancient ruins, Vatican City, long pasta dinners, and gelato on evening walks.",
    startDate: "2026-06-01",
    endDate: "2026-06-07",
    latitude: 41.9028,
    longitude: 12.4964
  },
  {
    id: 9,
    destination: "San Francisco, US",
    description: "Golden Gate Bridge views, cable cars, and a day trip up to Napa Valley.",
    startDate: "2026-07-10",
    endDate: "2026-07-15",
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    id: 10,
    destination: "Bali, Indonesia",
    description: "Rice terraces, Uluwatu sunsets, beach clubs, and temple visits in Ubud.",
    startDate: "2026-08-01",
    endDate: "2026-08-07",
    latitude: -8.3405,
    longitude: 115.0920
  },
  {
    id: 11,
    destination: "Banff, Canada",
    description: "Turquoise lakes, mountain hikes, and cozy lodges in the Canadian Rockies.",
    startDate: "2026-09-10",
    endDate: "2026-09-16",
    latitude: 51.1784,
    longitude: -115.5708
  },
  {
    id: 12,
    destination: "Queenstown, New Zealand",
    description: "Adventure capital trip: bungee jumping, Milford Sound cruise, and alpine views.",
    startDate: "2026-10-05",
    endDate: "2026-10-12",
    latitude: -45.0312,
    longitude: 168.6626
  }
];

let nextId = 13;


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
