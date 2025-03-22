import {
  users, type User, type InsertUser,
  destinations, type Destination, type InsertDestination,
  packages, type Package, type InsertPackage,
  accommodations, type Accommodation, type InsertAccommodation,
  testimonials, type Testimonial, type InsertTestimonial,
  bookings, type Booking, type InsertBooking
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Destination operations
  getAllDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  getFeaturedDestinations(): Promise<Destination[]>;

  // Package operations
  getAllPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;

  // Accommodation operations
  getAllAccommodations(): Promise<Accommodation[]>;
  getAccommodation(id: number): Promise<Accommodation | undefined>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
  getAccommodationsByDestination(destinationId: number): Promise<Accommodation[]>;

  // Testimonial operations
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private destinations: Map<number, Destination>;
  private packages: Map<number, Package>;
  private accommodations: Map<number, Accommodation>;
  private testimonials: Map<number, Testimonial>;
  private bookings: Map<number, Booking>;
  
  private userIdCounter: number;
  private destinationIdCounter: number;
  private packageIdCounter: number;
  private accommodationIdCounter: number;
  private testimonialIdCounter: number;
  private bookingIdCounter: number;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.packages = new Map();
    this.accommodations = new Map();
    this.testimonials = new Map();
    this.bookings = new Map();
    
    this.userIdCounter = 1;
    this.destinationIdCounter = 1;
    this.packageIdCounter = 1;
    this.accommodationIdCounter = 1;
    this.testimonialIdCounter = 1;
    this.bookingIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Destination operations
  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = this.destinationIdCounter++;
    const destination: Destination = { ...insertDestination, id };
    this.destinations.set(id, destination);
    return destination;
  }

  async getFeaturedDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(dest => dest.featured);
  }

  // Package operations
  async getAllPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = this.packageIdCounter++;
    const pkg: Package = { ...insertPackage, id };
    this.packages.set(id, pkg);
    return pkg;
  }

  // Accommodation operations
  async getAllAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values());
  }

  async getAccommodation(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const id = this.accommodationIdCounter++;
    const accommodation: Accommodation = { ...insertAccommodation, id };
    this.accommodations.set(id, accommodation);
    return accommodation;
  }

  async getAccommodationsByDestination(destinationId: number): Promise<Accommodation[]> {
    // In a real app, accommodations would be linked to destinations
    // For demo purposes, just return all accommodations
    return this.getAllAccommodations();
  }

  // Testimonial operations
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Booking operations
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const createdAt = new Date();
    const booking: Booking = { ...insertBooking, id, createdAt };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      const updatedBooking = { ...booking, status };
      this.bookings.set(id, updatedBooking);
      return updatedBooking;
    }
    return undefined;
  }

  // Initialize with sample data
  private initializeData() {
    // Destinations
    this.createDestination({
      name: "Orbital Space Station",
      description: "Experience zero gravity in our state-of-the-art space station with Earth views from every suite.",
      imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      location: "LEO",
      distance: "350 km altitude",
      travelTime: "2-day journey",
      price: 25000,
      rating: 4.9,
      reviewCount: 128,
      featured: true,
      isNew: false
    });

    this.createDestination({
      name: "Lunar Colony Alpha",
      description: "Visit humanity's first permanent lunar settlement with luxury accommodations and moonwalks.",
      imageUrl: "https://images.unsplash.com/photo-1581822261290-991b38693d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      location: "MOON",
      distance: "384,400 km",
      travelTime: "3-day journey",
      price: 58000,
      rating: 4.7,
      reviewCount: 96,
      featured: true,
      isNew: false
    });

    this.createDestination({
      name: "Mars Transit Hotel",
      description: "Experience the revolutionary transit hotel on the Mars-Earth route with cosmic observation decks.",
      imageUrl: "https://images.unsplash.com/photo-1545156521-77bd85671d30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      location: "ORBIT",
      distance: "Mars-Earth route",
      travelTime: "7-day stay",
      price: 112000,
      rating: 4.8,
      reviewCount: 77,
      featured: true,
      isNew: true
    });

    // Packages
    this.createPackage({
      name: "Economy Shuttle",
      description: "The basic space travel experience",
      price: 25000,
      features: [
        "Standard pod accommodation",
        "3 zero-gravity experiences",
        "Basic space meals",
        "Shared observation deck access"
      ],
      isPopular: false,
      type: "economy"
    });

    this.createPackage({
      name: "Luxury Cabin",
      description: "Premium space experience with perks",
      price: 75000,
      features: [
        "Private luxury pod with window",
        "Unlimited zero-gravity sessions",
        "Gourmet space cuisine",
        "Premium observation deck access",
        "One scheduled space walk"
      ],
      isPopular: true,
      type: "luxury"
    });

    this.createPackage({
      name: "VIP Experience",
      description: "Ultimate exclusive space journey",
      price: 150000,
      features: [
        "Luxury suite with panoramic views",
        "Customized zero-gravity experiences",
        "Personal chef and premium dining",
        "Private observation deck hours",
        "Multiple private space walks",
        "Professional photography package"
      ],
      isPopular: false,
      type: "vip"
    });

    // Accommodations
    this.createAccommodation({
      name: "Lunar Habitat Suite",
      description: "Luxury lunar accommodations with Earth views and private lunar terrain access.",
      imageUrl: "https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      location: "Lunar Colony Alpha",
      capacity: "2-4 guests",
      pricePerNight: 12500,
      amenities: ["Panoramic View", "Gravity Control", "Private Airlock"],
      rating: 4.8
    });

    this.createAccommodation({
      name: "Orbital Luxury Pod",
      description: "Premium orbital accommodations with 360° Earth views and zero-gravity sleeping chambers.",
      imageUrl: "https://images.unsplash.com/photo-1518365050014-70fe7232897f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      location: "Orbital Space Station",
      capacity: "1-2 guests",
      pricePerNight: 8900,
      amenities: ["Earth View", "Zero-G Suite", "Premium Life Support"],
      rating: 4.9
    });

    // Testimonials
    this.createTestimonial({
      name: "Sarah J.",
      avatarUrl: "https://randomuser.me/api/portraits/women/54.jpg",
      testimonial: "The lunar colony experience was beyond words. Watching Earth rise over the lunar landscape from my suite was a life-changing moment. The staff was incredibly attentive to safety while making the experience magical.",
      rating: 5,
      packageType: "Economy Package",
      destination: "Lunar Colony Alpha"
    });

    this.createTestimonial({
      name: "Marcus T.",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      testimonial: "I splurged on the VIP package for my 50th birthday and it was worth every penny. The private space walks with expert guides gave me perspectives on our planet that I'll never forget. The zero-G cuisine was surprisingly delicious!",
      rating: 4,
      packageType: "VIP Experience",
      destination: "Orbital Space Station"
    });

    this.createTestimonial({
      name: "Elena K.",
      avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
      testimonial: "My partner and I booked the Luxury Cabin for our honeymoon. The staff created such a romantic atmosphere despite being in space! The panoramic views from our cabin were incredible, and the photography package captured memories we'll cherish forever.",
      rating: 5,
      packageType: "Luxury Package",
      destination: "Mars Transit Hotel"
    });
  }
}

export const storage = new MemStorage();
