import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Destination schema
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(), // e.g., LEO, MOON, ORBIT
  distance: text("distance").notNull(), // e.g., "350 km altitude"
  travelTime: text("travel_time").notNull(), // e.g., "2-day journey"
  price: integer("price").notNull(), // Base price in USD
  rating: doublePrecision("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  featured: boolean("featured").default(false),
  isNew: boolean("is_new").default(false),
});

export const insertDestinationSchema = createInsertSchema(destinations).pick({
  name: true,
  description: true,
  imageUrl: true,
  location: true,
  distance: true,
  travelTime: true,
  price: true,
  rating: true,
  reviewCount: true,
  featured: true,
  isNew: true,
});

// Package schema
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  features: text("features").array().notNull(),
  isPopular: boolean("is_popular").default(false),
  type: text("type").notNull(), // economy, luxury, vip
});

export const insertPackageSchema = createInsertSchema(packages).pick({
  name: true,
  description: true,
  price: true,
  features: true,
  isPopular: true,
  type: true,
});

// Accommodation schema
export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  capacity: text("capacity").notNull(), // e.g., "2-4 guests"
  pricePerNight: integer("price_per_night").notNull(),
  amenities: text("amenities").array().notNull(),
  rating: doublePrecision("rating").notNull(),
});

export const insertAccommodationSchema = createInsertSchema(accommodations).pick({
  name: true,
  description: true,
  imageUrl: true,
  location: true,
  capacity: true,
  pricePerNight: true,
  amenities: true,
  rating: true,
});

// Testimonial schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  testimonial: text("testimonial").notNull(),
  rating: integer("rating").notNull(),
  packageType: text("package_type").notNull(),
  destination: text("destination").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  avatarUrl: true,
  testimonial: true,
  rating: true,
  packageType: true,
  destination: true,
});

// Booking schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  destinationId: integer("destination_id").notNull(),
  packageId: integer("package_id").notNull(),
  accommodationId: integer("accommodation_id"),
  departureDate: timestamp("departure_date").notNull(),
  returnDate: timestamp("return_date").notNull(),
  travelers: integer("travelers").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  destinationId: true,
  packageId: true,
  accommodationId: true,
  departureDate: true,
  returnDate: true,
  travelers: true,
  totalPrice: true,
  status: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;

export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;

export type Accommodation = typeof accommodations.$inferSelect;
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
