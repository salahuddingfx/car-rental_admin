import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HeroSlide {
  id: string;
  img: string;
  alt: string;
  tagline: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
}

export interface HeroStats {
  label: string;
  value: string;
}

export interface Brand {
  id: string;
  name: string;
  count: number;
  logo: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  img: string;
  active: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AboutStat {
  id: string;
  value: string;
  label: string;
}

export interface AboutValue {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'office';
  value: string;
  label: string;
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
}

export interface SocialReview {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  source: 'google' | 'facebook' | 'tripadvisor' | 'apexride';
  date: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  type: 'journey' | 'process';
}

export interface ProcessStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface NavbarLink {
  id: string;
  label: string;
  href: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface PageContent {
  tagline: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ContactCTA {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

interface CMSState {
  hero: {
    slides: HeroSlide[];
    stats: HeroStats[];
  };
  brands: Brand[];
  features: Feature[];
  stats: Stat[];
  offers: Offer[];
  faq: FaqItem[];
  about: {
    hero: PageContent;
    stats: AboutStat[];
    values: AboutValue[];
    cta: PageContent;
  };
  contact: {
    hero: PageContent;
    infos: ContactInfo[];
    formLabels: { name: string; email: string; message: string; submit: string; success: string };
  };
  footer: {
    brandDesc: string;
    contact: ContactInfo[];
    socialLinks: SocialLink[];
    columns: FooterColumn[];
    copyright: string;
    developerCredit: string;
  };
  navbar: {
    links: NavbarLink[];
  };
  home: {
    featuredSection: PageContent;
    popularSection: PageContent;
    recentlyViewedSection: PageContent;
    whyChooseUs: { title: string; description: string };
    contactCTA: ContactCTA;
  };
  blog: {
    posts: BlogPost[];
    categories: string[];
  };
  reviews: {
    hero: PageContent;
    items: SocialReview[];
  };
  timeline: {
    events: TimelineEvent[];
    processSteps: ProcessStep[];
  };

  updateHeroSlides: (slides: HeroSlide[]) => void;
  updateHeroStats: (stats: HeroStats[]) => void;
  updateBrands: (brands: Brand[]) => void;
  updateFeatures: (features: Feature[]) => void;
  updateStats: (stats: Stat[]) => void;
  updateOffers: (offers: Offer[]) => void;
  updateFaq: (faq: FaqItem[]) => void;
  updateAboutHero: (hero: PageContent) => void;
  updateAboutStats: (stats: AboutStat[]) => void;
  updateAboutValues: (values: AboutValue[]) => void;
  updateAboutCta: (cta: PageContent) => void;
  updateContactHero: (hero: PageContent) => void;
  updateContactInfos: (infos: ContactInfo[]) => void;
  updateContactFormLabels: (labels: { name: string; email: string; message: string; submit: string; success: string }) => void;
  updateFooter: (footer: Partial<CMSState['footer']>) => void;
  updateNavbar: (navbar: { links: NavbarLink[] }) => void;
  updateHome: (home: Partial<CMSState['home']>) => void;
  updateBlog: (blog: Partial<CMSState['blog']>) => void;
  updateReviews: (reviews: Partial<CMSState['reviews']>) => void;
  updateTimeline: (timeline: Partial<CMSState['timeline']>) => void;
  resetToDefaults: () => void;
  syncAllToAPI: () => Promise<void>;
  loadFromAPI: () => Promise<void>;
}

const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920',
    alt: 'Luxury black SUV on highway',
    tagline: 'PREMIUM LUXURY',
    title: 'Drive Your Dreams Today',
    subtitle: 'Experience the pinnacle of automotive excellence with our curated collection of premium vehicles.',
    cta: 'Explore Fleet',
    ctaLink: '/cars',
  },
  {
    id: 'slide-2',
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920',
    alt: 'Sports car in mountains',
    tagline: 'UNMATCHED PERFORMANCE',
    title: 'Adventure Awaits',
    subtitle: 'From coastal highways to mountain trails, conquer every road with confidence.',
    cta: 'View Packages',
    ctaLink: '/cars',
  },
  {
    id: 'slide-3',
    img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1920',
    alt: 'Elegant sedan at sunset',
    tagline: 'EFFORTLESS ELEGANCE',
    title: 'Travel in Style',
    subtitle: 'Make every journey unforgettable with our handpicked luxury sedans and SUVs.',
    cta: 'Book Now',
    ctaLink: '/cars',
  },
  {
    id: 'slide-4',
    img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1920',
    alt: 'Premium car collection',
    tagline: 'EXCLUSIVE COLLECTION',
    title: 'The Finest Fleet',
    subtitle: 'Access Bangladesh\'s most exclusive collection of premium automobiles.',
    cta: 'Discover More',
    ctaLink: '/cars',
  },
];

const defaultHeroStats: HeroStats[] = [
  { label: 'Cars Available', value: '120+' },
  { label: 'Cities Covered', value: '6' },
  { label: 'Happy Clients', value: '2,400+' },
  { label: 'Avg. Rating', value: '4.9' },
];

const defaultBrands: Brand[] = [
  { id: 'b1', name: 'Toyota', count: 24, logo: 'T' },
  { id: 'b2', name: 'BMW', count: 14, logo: 'B' },
  { id: 'b3', name: 'Mercedes', count: 12, logo: 'M' },
  { id: 'b4', name: 'Audi', count: 9, logo: 'A' },
  { id: 'b5', name: 'Nissan', count: 18, logo: 'N' },
  { id: 'b6', name: 'Mitsubishi', count: 15, logo: 'M' },
  { id: 'b7', name: 'Honda', count: 20, logo: 'H' },
  { id: 'b8', name: 'Lamborghini', count: 3, logo: 'L' },
  { id: 'b9', name: 'Porsche', count: 5, logo: 'P' },
];

const defaultFeatures: Feature[] = [
  { id: 'f1', icon: 'Shield', title: 'Premium Fleet Guaranteed', desc: 'Every vehicle in our collection is meticulously maintained and verified for your safety and comfort.' },
  { id: 'f2', icon: 'MapPin', title: 'All Over Bangladesh', desc: 'From Dhaka to Cox\'s Bazar, Sylhet to Chittagong - we\'ve got you covered across 6 major cities.' },
  { id: 'f3', icon: 'CheckCircle', title: 'Insured & Verified', desc: 'Drive with complete peace of mind. All our vehicles come with comprehensive insurance coverage.' },
  { id: 'f4', icon: 'Clock', title: 'Flexible Hourly Rentals', desc: 'Only need a car for a few hours? Our flexible rental options let you pay only for what you use.' },
];

const defaultStats: Stat[] = [
  { id: 's1', value: '6', label: 'Cities Covered' },
  { id: 's2', value: '2,400+', label: 'Happy Clients' },
  { id: 's3', value: '120+', label: 'Cars Available' },
  { id: 's4', value: '4.9', label: 'Avg. Rating' },
];

const defaultOffers: Offer[] = [
  {
    id: 'o1',
    title: "Cox's Bazar Road Trip Package",
    description: "Experience the world's longest natural beach with our exclusive road trip package. Includes a premium SUV, fuel allowance, and 24/7 roadside assistance.",
    ctaText: 'Book Package',
    ctaLink: '/cars/car-4',
    img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1920',
    active: true,
  },
];

const defaultFaq: FaqItem[] = [
  { id: 'q1', question: 'What documents do I need to rent a car?', answer: 'You\'ll need a valid driving license, a government-issued ID (NID/Passport), and a credit/debit card for the security deposit. International tourists need an International Driving Permit (IDP) along with their home country license.' },
  { id: 'q2', question: 'Can I hire a chauffeur-driven car?', answer: 'Absolutely! All our vehicles are available with professional chauffeurs. Our drivers are trained, verified, and know every route across Bangladesh. Simply select the chauffeur option during booking.' },
  { id: 'q3', question: 'Which cities does Apex Ride cover?', answer: 'We currently operate in 6 major cities: Dhaka, Chittagong, Cox\'s Bazar, Sylhet, Rajshahi, and Khulna. We\'re expanding rapidly and plan to cover all divisions by 2027.' },
  { id: 'q4', question: 'What payment methods do you accept?', answer: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), bKash, Nagad, Rocket, and bank transfers. Cash payment is available for bookings under 5,000 BDT.' },
  { id: 'q5', question: 'Do you offer hourly rentals?', answer: 'Yes! We offer flexible hourly rental packages starting from just 3 hours. Perfect for business meetings, airport transfers, or short city trips. Hourly rates are 8% of the daily rate per hour.' },
  { id: 'q6', question: 'What is your fuel policy?', answer: 'Cars are provided with a full tank. You can return the car with the same fuel level or opt for our fuel service at market rates. Long-distance trips include a fuel allowance in the package price.' },
];

const defaultAbout = {
  hero: { tagline: 'About Apex Ride', title: 'Redefining the Car Rental Experience', description: 'Founded in 2018, Apex Ride has grown from a small fleet of 5 cars to Bangladesh\'s most trusted premium car rental service. Our mission is simple: provide exceptional vehicles with unmatched service, making every journey extraordinary.' },
  stats: [
    { id: 'as1', value: '50+', label: 'Premium Vehicles' },
    { id: 'as2', value: '2,000+', label: 'Happy Clients' },
    { id: 'as3', value: '8+', label: 'Years Experience' },
    { id: 'as4', value: '100%', label: 'Verified Hosts' },
  ] as AboutStat[],
  values: [
    { id: 'av1', title: 'Quality Assurance', desc: 'Every vehicle undergoes a rigorous 150-point inspection before each rental. We never compromise on quality or safety.', icon: 'Shield' },
    { id: 'av2', title: 'Transparent Pricing', desc: 'No hidden fees, no surprises. Our pricing is straightforward with detailed breakdowns before you book.', icon: 'DollarSign' },
    { id: 'av3', title: '24/7 Client Support', desc: 'Our dedicated support team is available round the clock via phone, chat, or WhatsApp for any assistance.', icon: 'Headphones' },
    { id: 'av4', title: 'Seamless Experience', desc: 'From booking to return, we\'ve streamlined every step. Smart technology meets personal service.', icon: 'Zap' },
  ] as AboutValue[],
  cta: { tagline: '', title: '', description: '', ctaText: 'Explore Fleet', ctaLink: '/cars' },
};

const defaultContact = {
  hero: { tagline: 'Get in Touch', title: "We'd love to hear from you", description: 'Whether you have a question about bookings, pricing, or anything else, our team is ready to answer all your questions.' },
  infos: [
    { id: 'c1', type: 'email' as const, value: 'hello@apexride.com', label: 'Email Us' },
    { id: 'c2', type: 'phone' as const, value: '+880 1700-000000', label: 'Call Us' },
    { id: 'c3', type: 'office' as const, value: 'Dhaka 1212, Bangladesh', label: 'Visit Us' },
  ],
  formLabels: { name: 'Full Name', email: 'Email Address', message: 'Your Message', submit: 'Send Message', success: 'Message Sent!' },
};

const defaultFooter = {
  brandDesc: "Bangladesh's premier luxury car rental service. Experience the freedom of the open road with our premium fleet of vehicles.",
  contact: [
    { id: 'fc1', type: 'phone' as const, value: '+880 1700-000000', label: 'Phone' },
    { id: 'fc2', type: 'email' as const, value: 'hello@apexride.com', label: 'Email' },
    { id: 'fc3', type: 'office' as const, value: 'Dhaka 1212, Bangladesh', label: 'Address' },
  ] as ContactInfo[],
  socialLinks: [
    { id: 'sl1', platform: 'Facebook', url: 'https://facebook.com/apexride', icon: 'facebook' },
    { id: 'sl2', platform: 'Instagram', url: 'https://instagram.com/apexride', icon: 'instagram' },
    { id: 'sl3', platform: 'Twitter', url: 'https://twitter.com/apexride', icon: 'twitter' },
  ],
  columns: [
    {
      id: 'col1', title: 'Explore',
      links: [
        { id: 'fl1', label: 'Browse Cars', href: '/cars' },
        { id: 'fl2', label: 'Compare Cars', href: '/compare' },
        { id: 'fl3', label: 'Track Booking', href: '/track-booking' },
        { id: 'fl4', label: 'Reviews', href: '/reviews' },
      ],
    },
    {
      id: 'col2', title: 'Company',
      links: [
        { id: 'fl5', label: 'About Us', href: '/about' },
        { id: 'fl6', label: 'Blog', href: '/blog' },
        { id: 'fl7', label: 'Careers', href: '/about' },
        { id: 'fl8', label: 'Contact', href: '/contact' },
      ],
    },
    {
      id: 'col3', title: 'Support',
      links: [
        { id: 'fl9', label: 'Help Center', href: '/contact' },
        { id: 'fl10', label: 'Safety', href: '/security' },
        { id: 'fl11', label: 'Terms of Service', href: '/terms' },
        { id: 'fl12', label: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ],
  copyright: `\u00a9 ${new Date().getFullYear()} Apex Ride. All rights reserved.`,
  developerCredit: 'Designed & Developed by Salah Uddin Kader',
};

const defaultNavbar = {
  links: [
    { id: 'nl1', label: 'Home', href: '/' },
    { id: 'nl2', label: 'Cars', href: '/cars' },
    { id: 'nl3', label: 'About', href: '/about' },
    { id: 'nl4', label: 'Reviews', href: '/reviews' },
    { id: 'nl5', label: 'Blog', href: '/blog' },
    { id: 'nl6', label: 'Contact', href: '/contact' },
  ],
};

const defaultHome = {
  featuredSection: { tagline: 'The Chosen Collection', title: 'Featured Vehicles', description: 'Handpicked vehicles that define luxury and performance, curated for the most discerning travelers.' },
  popularSection: { tagline: 'Trending Now', title: 'Popular Cars', description: '', ctaText: 'View All', ctaLink: '/cars' },
  recentlyViewedSection: { tagline: 'Continue Browsing', title: 'Recently Viewed', description: '', ctaText: 'View All', ctaLink: '/cars' },
  whyChooseUs: { title: 'Why Apex Ride?', description: "Bangladesh's premier car rental service, committed to delivering luxury, reliability, and unmatched convenience on every journey." },
  contactCTA: {
    title: 'Ready to Get Started?',
    subtitle: "Whether you have questions or ready to book, we're here to help you find the perfect ride.",
    ctaText: 'Contact Us',
    ctaLink: '/contact',
  },
};

const defaultBlog = {
  posts: [
    { id: 'bp1', slug: 'best-road-trips-bangladesh', title: 'Top 10 Road Trips in Bangladesh', excerpt: 'Discover the most scenic routes across Bangladesh, from the winding hills of Sylhet to the coastal beauty of Cox\'s Bazar.', category: 'Travel', date: '2026-06-15', readTime: '5 min', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800', content: 'Bangladesh is home to some of the most breathtaking landscapes in South Asia...' },
    { id: 'bp2', slug: 'ev-revolution-bangladesh', title: 'The EV Revolution in Bangladesh', excerpt: 'How electric vehicles are reshaping the future of transportation in Bangladesh and what it means for car rentals.', category: 'EV Guide', date: '2026-06-10', readTime: '7 min', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800', content: 'Electric vehicles are no longer a distant dream for Bangladesh...' },
    { id: 'bp3', slug: 'luxury-car-maintenance-tips', title: 'Luxury Car Maintenance Tips', excerpt: 'Keep your premium ride in top condition with these expert maintenance tips from our certified mechanics.', category: 'Lifestyle', date: '2026-06-05', readTime: '4 min', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800', content: 'Owning or driving a luxury car comes with certain responsibilities...' },
    { id: 'bp4', slug: 'safe-driving-rainy-season', title: 'Safe Driving in the Rainy Season', excerpt: 'Essential tips for navigating Bangladesh\'s monsoon roads safely, from tire checks to wet driving techniques.', category: 'Safety', date: '2026-05-28', readTime: '6 min', image: 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?auto=format&fit=crop&q=80&w=800', content: 'The monsoon season in Bangladesh brings both beauty and challenge...' },
    { id: 'bp5', slug: 'apex-ride-expansion-2026', title: 'Apex Ride Expansion 2026', excerpt: 'Exciting news! We\'re expanding to 3 new cities and adding 30+ premium vehicles to our fleet this year.', category: 'Company', date: '2026-05-20', readTime: '3 min', image: 'https://images.unsplash.com/photo-1449965408869-ebd3fee8d7e0?auto=format&fit=crop&q=80&w=800', content: 'We are thrilled to announce major expansion plans for 2026...' },
    { id: 'bp6', slug: 'chauffeur-vs-self-drive', title: 'Chauffeur vs Self-Drive', excerpt: 'Not sure whether to go with a chauffeur or self-drive? Here\'s a complete comparison to help you decide.', category: 'Travel', date: '2026-05-15', readTime: '5 min', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800', content: 'When booking a rental car, one of the biggest decisions is whether...' },
  ],
  categories: ['All', 'Travel', 'EV Guide', 'Lifestyle', 'Safety', 'Company'],
};

const defaultReviews: { hero: PageContent; items: SocialReview[] } = {
  hero: { tagline: 'Testimonials', title: 'What Our Clients Say', description: 'Real experiences from real customers who trust Apex Ride for their premium car rental needs.' },
  items: [
    { id: 'r1', name: 'Rafiq Ahmed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', rating: 5, text: "Absolutely phenomenal service! The BMW X5 I rented was immaculate. The booking process was seamless, and the car was delivered right to my hotel. Will definitely use Apex Ride again!", source: 'google' as const, date: '2026-05-20' },
    { id: 'r2', name: 'Nadia Khan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', rating: 5, text: "Best car rental experience in Dhaka! The staff was incredibly helpful, and the Mercedes C-Class was in perfect condition. The transparent pricing was a refreshing change.", source: 'facebook' as const, date: '2026-05-18' },
    { id: 'r3', name: 'Tanvir Hassan', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', rating: 5, text: "Used Apex Ride for our Cox's Bazar road trip. The Toyota Prado was perfect for the journey. Great value for money and excellent roadside support throughout the trip.", source: 'tripadvisor' as const, date: '2026-05-15' },
    { id: 'r4', name: 'Sabrina Islam', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', rating: 5, text: "I've tried many car rental services in Bangladesh, but Apex Ride is by far the best. The attention to detail and quality of vehicles is unmatched. Their customer support is top-notch!", source: 'apexride' as const, date: '2026-05-12' },
    { id: 'r5', name: 'Kamal Uddin', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', rating: 4, text: "Great selection of luxury cars. Rented a BMW for my wedding day and it was absolutely stunning. The only reason for 4 stars is the pickup took a bit longer than expected.", source: 'google' as const, date: '2026-05-10' },
    { id: 'r6', name: 'Farhana Rahman', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', rating: 5, text: "The chauffeur service is worth every taka! Professional, punctual, and incredibly knowledgeable about routes. Made our corporate event transportation effortless.", source: 'facebook' as const, date: '2026-05-08' },
  ],
};

const defaultTimeline: { events: TimelineEvent[]; processSteps: ProcessStep[] } = {
  events: [
    { id: 'te1', year: '2018', title: 'The Beginning', description: 'Apex Ride was founded in Dhaka with a vision to revolutionize car rentals in Bangladesh. Started with just 5 premium vehicles.', icon: 'Rocket', type: 'journey' },
    { id: 'te2', year: '2019', title: 'First Expansion', description: 'Expanded operations to Chittagong and Cox\'s Bazar, growing our fleet to 25 vehicles and serving 500+ happy customers.', icon: 'MapPin', type: 'journey' },
    { id: 'te3', year: '2020', title: 'Digital Transformation', description: 'Launched our online booking platform and mobile app, making car rentals accessible at your fingertips.', icon: 'Smartphone', type: 'journey' },
    { id: 'te4', year: '2022', title: 'Premium Fleet Growth', description: 'Added luxury brands like BMW, Mercedes, and Audi to our fleet. Reached 100+ vehicles and 2,000+ customers.', icon: 'Car', type: 'journey' },
    { id: 'te5', year: '2024', title: 'Nationwide Coverage', description: 'Expanded to 6 major cities across Bangladesh. Introduced chauffeur services and corporate partnerships.', icon: 'Globe', type: 'journey' },
    { id: 'te6', year: '2026', title: 'The Future', description: 'Leading Bangladesh\'s premium car rental market with 120+ vehicles, EV integration plans, and AI-powered booking.', icon: 'Zap', type: 'journey' },
  ],
  processSteps: [
    { id: 'ps1', step: 1, title: 'Browse & Choose', description: 'Explore our curated collection of premium vehicles. Filter by brand, category, price, and features.', icon: 'Search' },
    { id: 'ps2', step: 2, title: 'Book Instantly', description: 'Select your dates, add extras, and complete your booking in under 2 minutes. Instant confirmation.', icon: 'Calendar' },
    { id: 'ps3', step: 3, title: 'Pickup or Delivery', description: 'Choose self-pickup from our locations or get the car delivered to your doorstep across 6 cities.', icon: 'Truck' },
    { id: 'ps4', step: 4, title: 'Enjoy the Ride', description: 'Hit the road with confidence. 24/7 roadside assistance, comprehensive insurance included.', icon: 'Map' },
    { id: 'ps5', step: 5, title: 'Easy Return', description: 'Return at any of our locations or schedule a pickup. Transparent billing, no hidden charges.', icon: 'CheckCircle' },
  ],
};

export const useCMSStore = create<CMSState>()(
  persist(
    (set) => ({
      hero: { slides: defaultHeroSlides, stats: defaultHeroStats },
      brands: defaultBrands,
      features: defaultFeatures,
      stats: defaultStats,
      offers: defaultOffers,
      faq: defaultFaq,
      about: defaultAbout,
      contact: defaultContact,
      footer: defaultFooter,
      navbar: defaultNavbar,
      home: defaultHome,
      blog: defaultBlog,
      reviews: defaultReviews,
      timeline: defaultTimeline,

      updateHeroSlides: (slides) => set((s) => ({ hero: { ...s.hero, slides } })),
      updateHeroStats: (stats) => set((s) => ({ hero: { ...s.hero, stats } })),
      updateBrands: (brands) => set({ brands }),
      updateFeatures: (features) => set({ features }),
      updateStats: (stats) => set({ stats }),
      updateOffers: (offers) => set({ offers }),
      updateFaq: (faq) => set({ faq }),
      updateAboutHero: (hero) => set((s) => ({ about: { ...s.about, hero } })),
      updateAboutStats: (stats) => set((s) => ({ about: { ...s.about, stats } })),
      updateAboutValues: (values) => set((s) => ({ about: { ...s.about, values } })),
      updateAboutCta: (cta) => set((s) => ({ about: { ...s.about, cta } })),
      updateContactHero: (hero) => set((s) => ({ contact: { ...s.contact, hero } })),
      updateContactInfos: (infos) => set((s) => ({ contact: { ...s.contact, infos } })),
      updateContactFormLabels: (formLabels) => set((s) => ({ contact: { ...s.contact, formLabels } })),
      updateFooter: (footer) => set((s) => ({ footer: { ...s.footer, ...footer } })),
      updateNavbar: (navbar) => set({ navbar }),
      updateHome: (home) => set((s) => ({ home: { ...s.home, ...home } })),
      updateBlog: (blog) => set((s) => ({ blog: { ...s.blog, ...blog } })),
      updateReviews: (reviews) => set((s) => ({ reviews: { ...s.reviews, ...reviews } })),
      updateTimeline: (timeline) => set((s) => ({ timeline: { ...s.timeline, ...timeline } })),
      resetToDefaults: () => set({
        hero: { slides: defaultHeroSlides, stats: defaultHeroStats },
        brands: defaultBrands,
        features: defaultFeatures,
        stats: defaultStats,
        offers: defaultOffers,
        faq: defaultFaq,
        about: defaultAbout,
        contact: defaultContact,
        footer: defaultFooter,
        navbar: defaultNavbar,
        home: defaultHome,
        blog: defaultBlog,
        reviews: defaultReviews,
        timeline: defaultTimeline,
      }),

      syncAllToAPI: async () => {
        const state = useCMSStore.getState();
        const { cmsApi, reviewsApi } = await import('../lib/api');

        // Sync CMS key-value pairs
        const cmsEntries: [string, unknown, string][] = [
          ['hero_slides', state.hero.slides, 'hero'],
          ['hero_stats', state.hero.stats, 'hero'],
          ['brands', state.brands, 'brands'],
          ['features', state.features, 'features'],
          ['stats', state.stats, 'stats'],
          ['navbar_links', state.navbar.links, 'navbar'],
          ['home_content', state.home, 'home'],
          ['about_hero', state.about.hero, 'about'],
          ['about_stats', state.about.stats, 'about'],
          ['about_values', state.about.values, 'about'],
          ['about_cta', state.about.cta, 'about'],
          ['contact_hero', state.contact.hero, 'contact'],
          ['contact_infos', state.contact.infos, 'contact'],
          ['contact_form_labels', state.contact.formLabels, 'contact'],
          ['footer_content', state.footer, 'footer'],
        ];

        for (const [key, value, group] of cmsEntries) {
          try { await cmsApi.upsert(key, value, group); } catch (e) { console.error(`Failed to sync ${key}:`, e); }
        }

        // Sync reviews to API
        for (const r of state.reviews.items) {
          try {
            await reviewsApi.create({
              name: r.name,
              avatar: r.avatar,
              rating: r.rating,
              text: r.text,
              source: r.source,
              date: r.date,
            });
          } catch (e) { console.error('Review sync failed:', e); }
        }

        console.log('CMS sync complete');
      },

      loadFromAPI: async () => {
        try {
          const { api: apiClient } = await import('../lib/api');
          const data = await apiClient.get<{
            cms: Record<string, { key: string; value: unknown }>;
            faqs: Array<{ id: string; question: string; answer: string; sort_order: number }>;
            offers: Array<{ id: string; title: string; description: string; active: boolean }>;
            reviews: Array<{ id: string; name: string; rating: number; text: string; source: string; date: string }>;
            timelines: Array<{ id: string; year: string; title: string; description: string; icon: string; type: string; sort_order: number }>;
            process_steps: Array<{ id: string; step: number; title: string; description: string; icon: string }>;
          }>('/cms');

          set((s) => ({
            reviews: {
              ...s.reviews,
              items: data.reviews.map((r) => ({
                id: String(r.id),
                name: r.name,
                avatar: '',
                rating: r.rating,
                text: r.text,
                source: r.source as SocialReview['source'],
                date: r.date,
              })),
            },
            faq: data.faqs.map((f) => ({ id: String(f.id), question: f.question, answer: f.answer })),
            offers: data.offers.map((o) => ({
              id: String(o.id),
              title: o.title,
              description: o.description || '',
              ctaText: 'Learn More',
              ctaLink: '#',
              img: '',
              active: o.active,
            })),
            timeline: {
              events: data.timelines.filter((t) => t.type === 'journey').map((t) => ({
                id: String(t.id), year: t.year, title: t.title, description: t.description || '', icon: t.icon || 'Calendar', type: 'journey' as const,
              })),
              processSteps: data.process_steps.map((ps) => ({
                id: String(ps.id), step: ps.step, title: ps.title, description: ps.description || '', icon: ps.icon || 'Circle',
              })),
            },
          }));
        } catch (e) {
          console.error('Failed to load from API:', e);
        }
      },
    }),
    {
      name: 'apexride-cms',
    }
  )
);
