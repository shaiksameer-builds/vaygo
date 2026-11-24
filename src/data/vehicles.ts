import type { Vehicle } from '../types';

export interface FeaturedHeroVehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: 'bike' | 'car';
  price: string;
  priceNote: string;
  headline: string;
  subtitle: string;
  heroImage: string;
  thumbnail: string;
  tag: string;
  features: string[];
}

export const heroVehicles: FeaturedHeroVehicle[] = [
  {
    id: 'hero-1',
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    model: 'Classic 350 Stealth Black',
    category: 'bike',
    price: '₹470:00',
    priceNote: '(901 km included · Zero Deposit)',
    headline: 'Bikes & Scooters on Rent',
    subtitle: 'available on Hourly, Daily, Weekly and Monthly Basis.',
    heroImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1600&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&q=80',
    tag: 'MOST POPULAR',
    features: ['Bluetooth Helmet', 'GPS Tracker', 'Dual ABS', '350cc Engine'],
  },
  {
    id: 'hero-2',
    name: 'Yamaha YZF R15 V4',
    brand: 'Yamaha',
    model: 'YZF R15 Racing Edition',
    category: 'bike',
    price: '₹550:00',
    priceNote: '(Unlimited kms · Track Ready)',
    headline: 'Superbikes & Sport on Rent',
    subtitle: 'Experience pure adrenaline with aerodynamic track-bred power.',
    heroImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1600&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=300&q=80',
    tag: 'SPORTS',
    features: ['Quickshifter', 'Traction Control', 'Assist & Slipper Clutch'],
  },
  {
    id: 'hero-3',
    name: 'Royal Enfield Bullet 350',
    brand: 'Royal Enfield',
    model: 'Bullet 350 Vintage',
    category: 'bike',
    price: '₹420:00',
    priceNote: '(Helmet Included · Fully Serviced)',
    headline: 'Classic Cruisers on Rent',
    subtitle: 'The timeless thumper built for long open highway cruising.',
    heroImage: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=1600&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=300&q=80',
    tag: 'VINTAGE',
    features: ['Classic Thump', 'Touring Seat', 'Pannier Mounts'],
  },
  {
    id: 'hero-4',
    name: 'Continental GT 650 Cafe Racer',
    brand: 'Royal Enfield',
    model: 'Continental GT 650 Twin',
    category: 'bike',
    price: '₹750:00',
    priceNote: '(Twin Cylinder · Premium Ride)',
    headline: 'Cafe Racers on Rent',
    subtitle: 'Retro cafe styling coupled with a potent 648cc parallel twin engine.',
    heroImage: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1600&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=300&q=80',
    tag: 'CAFE RACER',
    features: ['Clip-on Handlebars', 'Twin Exhaust', 'Brembo Brakes'],
  },
  {
    id: 'hero-5',
    name: 'Vespa SXL 150 Urban',
    brand: 'Vespa',
    model: 'SXL 150 Italian Red',
    category: 'bike',
    price: '₹350:00',
    priceNote: '(Automatic · Free Extra Helmet)',
    headline: 'Urban Scooters on Rent',
    subtitle: 'Italian flair meets city convenience. Easy twist-and-go throttle.',
    heroImage: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=1600&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=300&q=80',
    tag: 'URBAN SCOOTER',
    features: ['Automatic CVT', 'Under-seat Storage', 'USB Charging Port'],
  },
  {
    id: 'hero-6',
    name: 'Toyota Innova Crysta',
    brand: 'Toyota',
    model: 'Innova Crysta 2.4 ZX',
    category: 'car',
    price: '₹2,499:00',
    priceNote: '(7 Seater · Self Drive or Driver)',
    headline: 'Premium Cars & SUVs on Rent',
    subtitle: 'Executive comfort for road trips, family vacations and corporate travel.',
    heroImage: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1600&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=300&q=80',
    tag: 'FAMILY SUV',
    features: ['7 Captain Seats', 'Automatic AC', 'Cruise Control', 'Airbags'],
  },
];

import { SEED_VEHICLES } from './seedData';

export const vehicles: Vehicle[] = SEED_VEHICLES;

export const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

export const popularLocations = [
  { city: 'Bangalore', count: 48, image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&q=80' },
  { city: 'Mumbai', count: 35, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80' },
  { city: 'Delhi', count: 29, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80' },
  { city: 'Hyderabad', count: 22, image: 'https://images.unsplash.com/photo-1626501268145-e1a99e6946c0?w=400&q=80' },
];
