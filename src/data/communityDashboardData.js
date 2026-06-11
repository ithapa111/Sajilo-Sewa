import bridalMakeupImage from '../assets/community-dashboard/bridal-makeup.jpg';
import carpoolImage from '../assets/community-dashboard/carpool.jpg';
import coffeeCircleImage from '../assets/community-dashboard/coffee-circle.jpg';
import familyPhotoshootImage from '../assets/community-dashboard/family-photoshoot.png';
import homeCleaningImage from '../assets/community-dashboard/home-cleaning.jpg';
import homeServicesImage from '../assets/community-dashboard/home-services.jpg';
import legalHelpImage from '../assets/community-dashboard/legal-help.jpg';
import matchmakingImage from '../assets/community-dashboard/matchmaking.jpg';
import potluckImage from '../assets/community-dashboard/potluck.jpg';
import sportsMatchImage from '../assets/community-dashboard/sports-match.jpg';
import volunteerImage from '../assets/community-dashboard/volunteer.jpg';

export const sidebarNavItems = [
  { label: 'Home', badge: 'HM', target: 'hero' },
  { label: 'Services', badge: 'SV', target: 'services' },
  { label: 'Support', badge: 'SP', target: 'support' },
  { label: 'Places', badge: 'PL', target: 'places' },
  { label: 'Events', badge: 'EV', target: 'events' },
  { label: 'Connect', badge: 'CN', target: 'connect' },
  { label: 'Activity', badge: 'AC', target: 'recommended' },
  { label: 'Messages', badge: 'MS', target: 'notifications' },
  { label: 'Saved', badge: 'SD', target: 'recommended' },
  { label: 'My Bookings', badge: 'BK', target: 'upcoming-events' },
];

export const sidebarActionCards = [
  {
    title: 'Join as Volunteer',
    description: 'Respond to verified social sewa requests and support nearby families this week.',
    cta: 'See openings',
    kind: 'volunteer',
  },
  {
    title: 'Local Business Listings',
    description: 'Claim your service profile, add trust badges, and start receiving bookings.',
    cta: 'List a business',
    kind: 'business',
  },
  {
    title: 'Get the App',
    description: 'Save Sazilo Sewa to your phone and keep updates, reminders, and bookings close.',
    cta: 'Send app link',
    secondaryCta: 'Open settings',
    kind: 'app',
  },
];

export const heroMetrics = [
  'Local service listings',
  'Help from nearby people',
  'Doctor appointments available',
];

export const quickActions = [
  {
    title: 'Find Services',
    description: 'Find local providers and send a booking request.',
    cta: 'Explore',
    action: 'scroll',
    target: 'services',
    group: 'services',
  },
  {
    title: 'Offer Help',
    description: 'Share your time, skills, or professional help.',
    cta: 'Open panel',
    action: 'panel',
    panelType: 'offerService',
    group: 'support',
  },
  {
    title: 'Create Event',
    description: 'Set up potlucks, sports, classes, and meetups.',
    cta: 'Start event',
    action: 'panel',
    panelType: 'createEvent',
    group: 'events',
  },
  {
    title: 'Ask for Help',
    description: 'Post a request for rides, support, or advice.',
    cta: 'Ask now',
    action: 'panel',
    panelType: 'askForHelp',
    group: 'support',
  },
];

export const howItWorksItems = [
  { step: '01', title: 'Search', description: 'Look for services, events, support, or people nearby.' },
  { step: '02', title: 'Take action', description: 'Book a service, ask for help, or create an event.' },
  { step: '03', title: 'Stay updated', description: 'See replies, reminders, and new activity in one place.' },
];

export const featuredItems = [
  {
    title: 'Golden Hour Family Photoshoot',
    subtitle: 'Weekend portrait sessions for weddings, graduations, and family moments.',
    image: familyPhotoshootImage,
    rating: '4.9',
    meta: '18 bookings this week',
    cta: 'Book now',
    group: 'services',
  },
  {
    title: 'Community Legal Help Clinic',
    subtitle: 'Support for immigration, housing, and business paperwork.',
    image: legalHelpImage,
    rating: '4.8',
    meta: '12 new appointments',
    cta: 'Reserve slot',
    group: 'support',
  },
  {
    title: 'Spring Potluck and Meet-Up',
    subtitle: 'A lively neighborhood gathering with RSVP tracking and shared dish signups.',
    image: potluckImage,
    rating: '4.7',
    meta: '94 members interested',
    cta: 'Join event',
    group: 'events',
  },
  {
    title: 'Neighborhood Home Services',
    subtitle: 'Cleaning, repairs, setup help, and quick home assistance.',
    image: homeServicesImage,
    rating: '4.8',
    meta: '9 instant quotes open',
    cta: 'View services',
    group: 'services',
  },
];

export const recommendationTabs = [
  { id: 'services', label: 'Services' },
  { id: 'support', label: 'Support' },
  { id: 'health', label: 'Health' },
  { id: 'events', label: 'Events' },
  { id: 'connect', label: 'Connect' },
];

export const recommendedItems = [
  {
    title: 'Bridal Makeup and Styling',
    subtitle: 'Popular with members searching for ceremony-ready beauty support this month.',
    image: bridalMakeupImage,
    rating: '4.9',
    cta: 'Request quote',
    group: 'services',
  },
  {
    title: 'Home Deep Clean Crew',
    subtitle: 'Nearby teams for move-in cleaning and festival prep.',
    image: homeCleaningImage,
    rating: '4.8',
    cta: 'Book support',
    group: 'services',
  },
  {
    title: 'Airport Carpool Circle',
    subtitle: 'Airport pickups, temple rides, and event carpools.',
    image: carpoolImage,
    rating: '4.7',
    cta: 'Ask for ride',
    group: 'support',
  },
  {
    title: 'Weekend Volunteer Drive',
    subtitle: 'Volunteer opportunities for temple events, newcomer support, and community care.',
    image: volunteerImage,
    rating: '5.0',
    cta: 'Join drive',
    group: 'support',
  },
  {
    title: 'Dentist Appointment',
    subtitle: 'Book cleanings, checkups, and dental care with trusted local clinics.',
    image: coffeeCircleImage,
    rating: '4.9',
    cta: 'Book dentist',
    group: 'health',
  },
  {
    title: 'Doctor Consultation',
    subtitle: 'Find general doctors for checkups, follow-ups, and common health concerns.',
    image: legalHelpImage,
    rating: '4.8',
    cta: 'Book doctor',
    group: 'health',
  },
  {
    title: 'Sunday Sports Match',
    subtitle: 'Cricket, futsal, and weekend games with local groups.',
    image: sportsMatchImage,
    rating: '4.8',
    cta: 'RSVP',
    group: 'events',
  },
  {
    title: 'City Potluck Network',
    subtitle: 'Gatherings for families, students, and new members.',
    image: potluckImage,
    rating: '4.9',
    cta: 'See details',
    group: 'events',
  },
  {
    title: 'Matchmaking Introductions',
    subtitle: 'Private introductions guided by community preferences.',
    image: matchmakingImage,
    rating: '4.6',
    cta: 'Browse',
    group: 'connect',
  },
  {
    title: 'Newcomer Coffee Circle',
    subtitle: 'Small group conversations for newcomers and neighbors.',
    image: coffeeCircleImage,
    rating: '4.8',
    cta: 'Join circle',
    group: 'connect',
  },
];

export const serviceCategories = [
  {
    title: 'Photoshoots',
    subtitle: 'Portrait, family, and event sessions from local creators.',
    count: '22 providers',
    cta: 'See photographers',
    group: 'services',
  },
  {
    title: 'Makeup & Styling',
    subtitle: 'Bridal looks, ceremony styling, and festive beauty services.',
    count: '16 specialists',
    cta: 'Get quote',
    group: 'services',
  },
  {
    title: 'Legal Help',
    subtitle: 'Friendly referrals for immigration, documents, and local paperwork.',
    count: '9 legal contacts',
    cta: 'Browse help',
    group: 'support',
  },
  {
    title: 'Home Services',
    subtitle: 'Cleaning, setup, repair, and day-to-day support for busy households.',
    count: '31 listings',
    cta: 'View options',
    group: 'services',
  },
];

export const moreServiceCategories = [
  {
    title: 'Tutors & Education',
    subtitle: 'Private tutors, homework support, and language coaching close by.',
    count: '12 active tutors',
    cta: 'Open category',
    group: 'services',
  },
  {
    title: 'Tech Support',
    subtitle: 'Laptop setup, printer fixes, and app guidance from patient local helpers.',
    count: '8 trusted experts',
    cta: 'Find support',
    group: 'services',
  },
  {
    title: 'Homemade Food',
    subtitle: 'Fresh meals, family trays, and home-cooked specialties from the community.',
    count: '19 cooks nearby',
    cta: 'Browse menu',
    group: 'services',
  },
  {
    title: 'Childcare',
    subtitle: 'Babysitting, after-school care, and family support nearby.',
    count: '10 care options',
    cta: 'Find care',
    group: 'services',
  },
];

export const healthItems = [
  { title: 'Dentist', subtitle: 'Cleanings, fillings, braces advice, and routine dental visits.', meta: '12 clinics', cta: 'Book dentist', group: 'health' },
  { title: 'General Doctor', subtitle: 'Routine checkups, common illness visits, and medical advice.', meta: '18 doctors', cta: 'Book doctor', group: 'health' },
  { title: 'Eye Care', subtitle: 'Vision checks, eye exams, and specialist referrals.', meta: '7 clinics', cta: 'View eye care', group: 'health' },
  { title: 'Pediatric Care', subtitle: 'Child checkups, vaccinations, and family doctor visits.', meta: '9 providers', cta: 'Find pediatrician', group: 'health' },
  { title: 'Mental Health', subtitle: 'Private counseling support and trusted referrals.', meta: '6 counselors', cta: 'View support', group: 'health' },
  { title: 'Physiotherapy', subtitle: 'Recovery sessions, mobility support, and guided rehab care.', meta: '5 clinics', cta: 'See therapy', group: 'health' },
];

export const placeItems = [
  { title: 'Community Centers', subtitle: 'Useful spaces for support desks, classes, and local meetups.', meta: '6 active spaces', cta: 'View support', target: 'support' },
  { title: 'Temples', subtitle: 'A place for worship, festivals, volunteering, and family gatherings.', meta: '8 popular places', cta: 'See events', target: 'events' },
  { title: 'Local Halls', subtitle: 'Flexible spaces for birthdays, meetings, and community programs.', meta: '4 venue options', cta: 'Plan event', target: 'events' },
  { title: 'Sports Grounds', subtitle: 'Local grounds for football, cricket, and weekend matches.', meta: '5 active grounds', cta: 'Browse matches', target: 'events' },
];

export const supportItems = [
  { title: 'Social Sewa', subtitle: 'Coordinate check-ins, urgent support, and family help.', cta: 'Post request', group: 'support' },
  { title: 'Volunteering', subtitle: 'Find simple volunteer opportunities across the city.', cta: 'Join today', group: 'support' },
  { title: 'Carpool', subtitle: 'Match airport pickups, temple rides, and event travel nearby.', cta: 'Find rides', group: 'support' },
];

export const eventItems = [
  { title: 'Potlucks & Gatherings', subtitle: 'Create RSVPs, dish signups, and invites in a few taps.', cta: 'Plan gathering', group: 'events' },
  { title: 'Sports Matches', subtitle: 'Organize cricket, futsal, volleyball, and fitness meetups.', cta: 'Browse matches', group: 'events' },
];

export const connectBanner = {
  title: 'Connect through community-led matchmaking',
  subtitle: 'Create a private profile or browse guided introductions.',
  primaryCta: 'Create Profile',
  secondaryCta: 'Browse',
};

export const communityPulseItems = [
  { label: 'Seeking help', value: '28', delta: '+6 today' },
  { label: 'Volunteers online', value: '14', delta: '4 nearby' },
  { label: 'Upcoming events', value: '11', delta: '2 tonight' },
];

export const upcomingEvents = [
  { title: 'Neighborhood Potluck', schedule: 'Sat, 6:30 PM', meta: 'Community Hall | 42 attending', cta: 'RSVP' },
  { title: 'Sunday Sports Match', schedule: 'Sun, 8:00 AM', meta: 'Riverside Field | 18 players', cta: 'Join team' },
  { title: 'Volunteer Orientation', schedule: 'Tue, 7:15 PM', meta: 'Online session | 23 signed up', cta: 'Save seat' },
];

export const notificationItems = [
  { title: 'A volunteer replied to your request', description: 'Your social sewa post received a nearby response just now.' },
  { title: 'Two new event invites available', description: 'Potluck and wellness meetups were added to your area feed.' },
  { title: 'Your saved service updated pricing', description: 'One listing you bookmarked added weekend availability.' },
];

export const offerItems = [
  { title: 'Family photoshoot bundle', subtitle: '15% off weekend bookings from featured creators.' },
  { title: 'Fresh homemade meal drop', subtitle: 'Free delivery for first-time neighborhood orders.' },
];

export const postOptions = [
  { title: 'Post Service', description: 'List your service and let people know how to contact you.', panelType: 'offerService' },
  { title: 'Create Event', description: 'Share a gathering, sports match, class, or workshop.', panelType: 'createEvent' },
  { title: 'Ask for Help', description: 'Tell the community what kind of help you need.', panelType: 'askForHelp' },
  { title: 'Offer Ride', description: 'Post a shared ride or pickup option for others nearby.', panelType: 'offerRide' },
];

export const mobileNavItems = [
  { label: 'Home', key: 'home', target: 'hero' },
  { label: 'Explore', key: 'explore', target: 'featured' },
  { label: 'Post', key: 'post', isPrimary: true },
  { label: 'Activity', key: 'activity', target: 'recommended' },
  { label: 'Profile', key: 'profile', target: 'connect' },
];
