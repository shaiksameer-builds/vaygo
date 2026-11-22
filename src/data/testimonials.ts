export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  vehicleRented: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Arjun Mehta',
    location: 'Bangalore',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5,
    text: 'Rented a Royal Enfield for a weekend trip to Coorg. The booking was seamless and the bike was in perfect condition. Vaygo made the whole experience stress-free!',
    vehicleRented: 'Royal Enfield Classic 350',
  },
  {
    id: 't2',
    name: 'Priya Sharma',
    location: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5,
    text: 'Got an Innova with driver for our family trip. Affordable pricing, professional driver and no hidden charges. Will definitely use Vaygo again!',
    vehicleRented: 'Toyota Innova Crysta',
  },
  {
    id: 't3',
    name: 'Rahul Nair',
    location: 'Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    rating: 5,
    text: 'As a vehicle owner, Vaygo has been a game changer. I earn passively while my car sits in the parking lot. The platform is incredibly easy to use.',
    vehicleRented: 'Vehicle Owner',
  },
];
