(function() {
  const sharedFirebase = {
    apiKey: 'AIzaSyC0BYFCxwgu3tHp_3oeLsxoMBpyDRnj8IA',
    authDomain: 'panthervenue.firebaseapp.com',
    projectId: 'panthervenue',
    storageBucket: 'panthervenue.appspot.com',
    messagingSenderId: '15387964560',
    appId: '1:15387964560:web:b9dbc68e3a97dd466b5415'
  };

  const config = {
    version: '2024.11.10',
    defaultSchoolId: 'williamstown',
    schools: {
      williamstown: {
        id: 'williamstown',
        brand: {
          name: 'Williamstown High School',
          shortName: 'Williamstown High',
          tagline: {
            lead: 'Where Pride Fuels',
            accent: 'Possibility'
          },
          mission: 'Williamstown High School unites academics, athletics, and the arts with a single destination for students, families, and community partners.',
          locationLabel: 'Williamstown High School • New Jersey',
          logo: 'assets/img/branding/navImage.png',
          logoAlt: 'Williamstown High School Crest',
          colors: {
            accent: '#1c3fa8',
            primary: '#102a56',
            dark: '#071533',
            surface: '#ffffff',
            background: '#f3f6fb'
          }
        },
        theme: {
          variables: {
            '--accent-color': '#1c3fa8',
            '--accent-color-rgb': '28, 63, 168',
            '--accent-soft': 'rgba(28, 63, 168, 0.12)',
            '--accent-contrast': '#ffffff',
            '--primary-color': '#102a56',
            '--primary-contrast': '#ffffff',
            '--background-color': '#f3f6fb',
            '--surface-color': '#ffffff',
            '--default-color': '#1b1f36',
            '--heading-color': '#071533',
            '--contrast-color': '#ffffff',
            '--nav-background': 'rgba(7, 21, 51, 0.92)',
            '--nav-hover-color': '#26b2e4',
            '--nav-cta-background': 'linear-gradient(90deg, #1c3fa8 0%, #26b2e4 100%)',
            '--nav-cta-border': '#1c3fa8',
            '--button-gradient': 'linear-gradient(90deg, #1c3fa8 0%, #26b2e4 100%)',
            '--badge-background': 'rgba(28, 63, 168, 0.12)',
            '--chip-background': 'rgba(38, 178, 228, 0.14)',
            '--chip-border': 'rgba(28, 63, 168, 0.28)'
          }
        },
        navigation: {
          logoHref: '/home.html',
          items: [
            { label: 'Home', href: '/home.html', match: ['/', '/index.html', '/home.html'] },
            { label: 'Campus Life', href: '/home.html#about', match: ['#about'] },
            { label: 'Events', href: '/event.html', match: ['/event.html'] },
            { label: 'Facility Rentals', href: '/rent.html', match: ['/rent.html'] },
            { label: 'Log In', href: '/login.html', id: 'loginButton', className: 'buy-tickets', match: ['/login.html'] }
          ]
        },
        collections: {
          events: 'events_williamstown',
          newsletter: 'newsletter_williamstown',
          rentals: 'rental_requests_williamstown',
          users: 'users_williamstown',
          tickets: 'tickets_williamstown',
          waitlist: 'waitlist_williamstown',
          feedback: 'feedback_williamstown'
        },
        meta: {
          home: {
            title: 'Williamstown High School | Campus Events Hub',
            description: 'Discover Williamstown High School news, performances, and athletics with our unified events hub.'
          },
          events: {
            title: 'Williamstown Events Calendar',
            description: 'Explore the latest Williamstown High School games, showcases, and academic spotlights.'
          },
          rent: {
            title: 'Williamstown Facility Rentals',
            description: 'Reserve Williamstown gyms, auditoriums, and classrooms for your next community program.'
          },
          login: {
            title: 'Williamstown Portal Login',
            description: 'Access your Williamstown High School dashboard to manage tickets, rentals, and volunteer shifts.'
          },
          '404': {
            title: 'Williamstown High School | Page Not Found',
            description: 'Return to the Williamstown High School home page to keep exploring upcoming opportunities.'
          }
        },
        home: {
          hero: {
            lead: 'Where Pride Fuels',
            accent: 'Possibility',
            body: 'Williamstown High School keeps students and neighbors connected with athletics, arts, and academic programming that reflect our Braves spirit.',
            locationLabel: 'Williamstown High School • New Jersey',
            primaryCta: { label: 'See What’s Coming Up', href: '/event.html' },
            secondaryCta: { label: 'Request a Space', href: '/rent.html' },
            videoModal: 'viewer.html'
          },
          sections: {
            about: true,
            team: false,
            amenities: true,
            seating: true,
            hotels: false,
            faq: true,
            contact: true
          },
          about: {
            heading: 'Life at Williamstown High School',
            subheading: 'Learn how the Braves use our campus to uplift every student voice.',
            body: 'Our events hub highlights signature athletics, academic exhibitions, and artistic productions across campus. Families, alumni, and community organizations rely on Williamstown High School to stay informed, reserve facilities, and celebrate student accomplishments together.'
          },
          highlights: [
            { icon: 'bi-stars', title: 'Student Leadership', copy: 'Service councils and class officers drive every Williamstown signature event.' },
            { icon: 'bi-megaphone', title: 'Community Welcome', copy: 'Facilities are open to civic partners with flexible scheduling and support services.' },
            { icon: 'bi-lightning-charge', title: 'Tech Enhanced', copy: 'Livestream-ready venues keep Braves fans connected wherever they watch.' }
          ],
          stats: [
            { value: '3,200', label: 'Seats Across Campus' },
            { value: '68', label: 'Events Each Semester' },
            { value: '45', label: 'Student Clubs Supported' }
          ],
          faq: [
            { question: 'Where is Williamstown High School located?', answer: 'We are located at 700 N Tuckahoe Rd, Williamstown, New Jersey. Plan your visit with the interactive map in our contact section.' },
            { question: 'How do I reserve a space?', answer: 'Head to the facility rentals page and submit the quick intake form. A Williamstown coordinator will follow up within two business days.' },
            { question: 'Are events open to the public?', answer: 'Most athletics, arts, and community programs welcome public guests. Ticketed events will note pricing and availability on their detail pages.' },
            { question: 'Can I get alerts for new events?', answer: 'Yes! Join the Williamstown Highlights newsletter for weekly updates tailored to your interests.' }
          ],
          contact: {
            address: '700 N Tuckahoe Rd, Williamstown, NJ 08094',
            phone: '+1 856-262-8200',
            email: 'info@williamstownhs.org',
            officeHours: 'Mon–Fri, 7:30 AM – 4:00 PM'
          },
          newsletter: {
            heading: 'Williamstown Highlights',
            subheading: 'Weekly updates on student spotlights, game days, and volunteer opportunities.',
            placeholder: 'you@williamstownhs.org',
            cta: 'Subscribe'
          }
        },
        events: {
          collection: 'events_williamstown',
          newsletter: {
            heading: 'Stay in the Loop',
            subheading: 'Be the first to know about Williamstown High School happenings.',
            placeholder: 'your@email.com',
            cta: 'Send Updates'
          },
          filters: {
            categories: ['Athletics', 'Arts', 'Academics'],
            priceRanges: [
              { id: 'all', label: 'All Prices', min: 0, max: 100 },
              { id: 'free', label: 'Free', min: 0, max: 0 },
              { id: 'under15', label: 'Under $15', min: 0, max: 15 }
            ]
          },
          defaults: [
            { id: 'whs-101', title: 'New Student Orientation', date: '2025-08-21', location: 'WHS Commons', price: 0, category: 'Academics', image: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/8c594fd968b7ba5a603c1f858e66c751c43b56a8_screenshot_2025-10-30_at_8.27.01___pm.png', desc: 'Welcome incoming Braves with campus tours, schedule pick-up, and a family Q&A session in the Commons.' },
            { id: 'whs-102', title: 'John E. Boucher Track', date: '2025-04-12', location: 'John E. Boucher Track', price: 5, category: 'Athletics', image: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/cc2cd07374d1ea1f9018ef7c28213b41d6c96f7b_screenshot_2025-10-30_at_8.27.17___pm.png', desc: 'Area teams compete under the lights with relays, field events, and concession stand fundraisers supporting Williamstown track & field.' },
            { id: 'whs-103', title: 'Friday Night Football', date: '2025-09-19', location: 'Braves Stadium', price: 8, category: 'Athletics', image: 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/d0b692739b23980437c955dc0601d6da594380a5_screenshot_2025-10-30_at_8.28.27___pm.png', desc: 'Cheer on the Williamstown Braves with marching band halftime performances, senior recognitions, and a packed student section.' },
          ],
          schedules: {
            Athletics: [
              { event: 'Gates Open', time: '5:30 PM' },
              { event: 'Kickoff Tipoff', time: '6:30 PM' },
              { event: 'Senior Tribute', time: '8:00 PM' }
            ],
            Arts: [
              { event: 'Gallery Walk', time: '5:00 PM' },
              { event: 'Curtain Up', time: '6:00 PM' },
              { event: 'Meet the Artists', time: '7:45 PM' }
            ],
            Academics: [
              { event: 'Student Pitches', time: '9:00 AM' },
              { event: 'Hands-On Labs', time: '10:30 AM' },
              { event: 'Awards', time: '1:15 PM' }
            ]
          }
        },
        rent: {
          hero: {
            title: 'Host Your Next Program at Williamstown',
            subtitle: 'From gymnasiums to innovation labs, our campus adapts to your event.',
            body: 'Choose from flexible spaces, technology packages, and support services curated by the Williamstown facilities team.',
            badge: { text: 'Community-Ready Facilities' },
            primaryCta: { label: 'Start Rental Request', href: '#rental-form' },
            secondaryCta: { label: 'View Spaces', href: '#spaces' },
            stats: [
              { value: '12', label: 'Bookable Spaces' },
              { value: '220+', label: 'Annual Rentals' },
              { value: '4.9/5', label: 'Partner Rating' }
            ],
            callout: 'Prime dates fill quickly—submit your desired timeframe to confirm availability.'
          },
          contact: {
            planner: 'Taylor Morgan',
            phone: '+1 856-262-8200',
            email: 'rentals@williamstownhs.org',
            officeHours: 'Mon–Fri, 7:30 AM – 4:00 PM'
          },
          form: {
            intro: 'Complete the rental intake and a Williamstown coordinator will follow up within two business days.',
            requirements: [
              'Certificate of insurance listing Williamstown Public Schools as additionally insured.',
              'Security plan required for events over 250 attendees.',
              'Technical needs must be submitted at least 14 days prior to load-in.'
            ]
          },
          spaces: [
            { id: 'braves-stadium', name: 'Braves Stadium', capacity: 2200, features: ['Retractable seating', 'Scoreboard & livestream booth', 'Dedicated locker rooms'] },
            { id: 'performing-arts', name: 'Performing Arts Center', capacity: 950, features: ['Digital soundboard', 'Full fly system', 'Green rooms & dressing suites'] },
            { id: 'innovation-lab', name: 'Innovation Lab', capacity: 180, features: ['Maker benches', 'Robotics bays', 'Flexible projection'] }
          ]
        },
        login: {
          heroHeadline: 'Williamstown Portal Access',
          heroSubheading: 'Manage tickets, rentals, and volunteer shifts from one secure dashboard.',
          rentNote: 'Interested in hosting an event? Submit your rental request through the dashboard.',
          highlights: [
            'Track ticket sales and download QR codes for entry.',
            'Monitor facility requests and update service needs easily.',
            'Set personal alerts for the teams, clubs, and courses you follow.'
          ],
          onboarding: {
            welcome: 'Create an account to personalize the Williamstown High School experience and stay connected to every event.',
            flyerTitle: 'Williamstown Portal Guide',
            flyerFilename: 'Williamstown_Portal_Guide.pdf'
          }
        },
        chatbot: {
          name: 'WilliamstownBot',
          introMessage: 'Hi! I’m WilliamstownBot. Ask me about schedules, rentals, or visiting campus.',
          availabilityText: 'WilliamstownBot is online 24/7 to answer questions about our events, tickets, and facilities.'
        },
        firebase: sharedFirebase
      }
    }
  };

  window.SchedraSiteConfig = config;
})();
