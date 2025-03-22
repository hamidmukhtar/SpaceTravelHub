import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { 
  insertUserSchema, 
  insertBookingSchema,
  insertDestinationSchema,
  insertPackageSchema,
  insertAccommodationSchema,
  insertTestimonialSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from public directory
  app.use('/images', express.static(path.join(__dirname, '../public/images')));

  // API Routes - all prefixed with /api
  
  // Destinations routes
  app.get("/api/destinations", async (req, res) => {
    const destinations = await storage.getAllDestinations();
    res.json(destinations);
  });

  app.get("/api/destinations/featured", async (req, res) => {
    const featuredDestinations = await storage.getFeaturedDestinations();
    res.json(featuredDestinations);
  });

  app.get("/api/destinations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid destination ID" });
    }
    
    const destination = await storage.getDestination(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    
    res.json(destination);
  });

  app.post("/api/destinations", async (req, res) => {
    try {
      const validatedData = insertDestinationSchema.parse(req.body);
      const destination = await storage.createDestination(validatedData);
      res.status(201).json(destination);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid destination data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create destination" });
    }
  });

  // Packages routes
  app.get("/api/packages", async (req, res) => {
    const packages = await storage.getAllPackages();
    res.json(packages);
  });

  app.get("/api/packages/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid package ID" });
    }
    
    const pkg = await storage.getPackage(id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }
    
    res.json(pkg);
  });

  app.post("/api/packages", async (req, res) => {
    try {
      const validatedData = insertPackageSchema.parse(req.body);
      const pkg = await storage.createPackage(validatedData);
      res.status(201).json(pkg);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid package data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create package" });
    }
  });

  // Accommodations routes
  app.get("/api/accommodations", async (req, res) => {
    const accommodations = await storage.getAllAccommodations();
    res.json(accommodations);
  });

  app.get("/api/accommodations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid accommodation ID" });
    }
    
    const accommodation = await storage.getAccommodation(id);
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }
    
    res.json(accommodation);
  });

  app.post("/api/accommodations", async (req, res) => {
    try {
      const validatedData = insertAccommodationSchema.parse(req.body);
      const accommodation = await storage.createAccommodation(validatedData);
      res.status(201).json(accommodation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid accommodation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create accommodation" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    const testimonials = await storage.getAllTestimonials();
    res.json(testimonials);
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  // User routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // In a real app, we would use JWT or sessions
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if destination exists
      const destination = await storage.getDestination(validatedData.destinationId);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      
      // Check if package exists
      const pkg = await storage.getPackage(validatedData.packageId);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      // Check if accommodation exists (if provided)
      if (validatedData.accommodationId) {
        const accommodation = await storage.getAccommodation(validatedData.accommodationId);
        if (!accommodation) {
          return res.status(404).json({ message: "Accommodation not found" });
        }
      }
      
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/users/:userId/bookings", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Check if user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const bookings = await storage.getBookingsByUserId(userId);
    res.json(bookings);
  });

  app.get("/api/bookings/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    
    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json(booking);
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    
    const { status } = req.body;
    if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const booking = await storage.updateBookingStatus(id, status);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json(booking);
  });

  const httpServer = createServer(app);
  return httpServer;
}
