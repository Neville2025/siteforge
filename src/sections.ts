import type { SectionDefinition } from './types'

export const SECTION_DEFS: Record<string, SectionDefinition> = {
  hero: {
    type: 'hero', name: 'Hero', icon: '🏠', description: 'Main banner — first thing visitors see',
    fields: [
      { key:'headline', label:'Headline', type:'text', placeholder:'Your powerful headline' },
      { key:'subtext', label:'Subtext', type:'textarea', placeholder:'Supporting description' },
      { key:'ctaText', label:'Button Text', type:'text', placeholder:'Get Started' },
      { key:'ctaUrl', label:'Button URL', type:'url', placeholder:'#contact' },
      { key:'ctaText2', label:'Secondary Button', type:'text', placeholder:'Learn More' },
      { key:'image', label:'Background Image', type:'image' },
      { key:'variant', label:'Layout', type:'select', options:['default','split','centered'], hint:'Default: full-bleed image. Split: image right, text left. Centered: text-only with animated gradient.' },
      { key:'showStats', label:'Show inline stats (use only if no Stats Bar section)', type:'boolean', hint:'Toggle off if you have a separate Stats Bar section to avoid duplicate numbers.' },
      { key:'stat1val', label:'Stat 1 Value', type:'text', placeholder:'200+' },
      { key:'stat1label', label:'Stat 1 Label', type:'text', placeholder:'Clients' },
      { key:'stat2val', label:'Stat 2 Value', type:'text', placeholder:'98%' },
      { key:'stat2label', label:'Stat 2 Label', type:'text', placeholder:'Satisfaction' },
      { key:'stat3val', label:'Stat 3 Value', type:'text', placeholder:'10yr' },
      { key:'stat3label', label:'Stat 3 Label', type:'text', placeholder:'Experience' },
      { key:'stat4val', label:'Stat 4 Value', type:'text', placeholder:'24/7' },
      { key:'stat4label', label:'Stat 4 Label', type:'text', placeholder:'Support' },
    ],
    defaultData: {
      headline: 'We Build Solutions That Drive Results',
      subtext: 'Professional services tailored to help your business grow faster, operate smarter, and stand out in your market.',
      ctaText: 'Get Started', ctaUrl: '#contact',
      ctaText2: 'See Our Work',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
      showStats: false,
      stat1val:'200+', stat1label:'Clients',
      stat2val:'98%',  stat2label:'Satisfaction',
      stat3val:'10yr', stat3label:'Experience',
      stat4val:'24/7', stat4label:'Support',
    }
  },

  stats: {
    type: 'stats', name: 'Stats Bar', icon: '📊', description: 'Numbers that build trust',
    fields: [
      { key:'stat1val', label:'Stat 1 Value', type:'text', placeholder:'200+' },
      { key:'stat1label', label:'Stat 1 Label', type:'text', placeholder:'Clients Served' },
      { key:'stat2val', label:'Stat 2 Value', type:'text', placeholder:'98%' },
      { key:'stat2label', label:'Stat 2 Label', type:'text', placeholder:'Satisfaction Rate' },
      { key:'stat3val', label:'Stat 3 Value', type:'text', placeholder:'10yr' },
      { key:'stat3label', label:'Stat 3 Label', type:'text', placeholder:'In Business' },
      { key:'stat4val', label:'Stat 4 Value', type:'text', placeholder:'24/7' },
      { key:'stat4label', label:'Stat 4 Label', type:'text', placeholder:'Support' },
    ],
    defaultData: { stat1val:'200+', stat1label:'Clients', stat2val:'98%', stat2label:'Satisfaction', stat3val:'10yr', stat3label:'Experience', stat4val:'24/7', stat4label:'Support' }
  },

  services: {
    type: 'services', name: 'Services', icon: '⚡', description: 'What you offer — service cards',
    fields: [
      { key:'heading', label:'Section Heading', type:'text', placeholder:'What We Offer' },
      { key:'subheading', label:'Section Subheading', type:'text', placeholder:'Tailored solutions for your needs' },
      { key:'variant', label:'Layout', type:'select', options:['grid','bento'], hint:'Grid: equal cards. Bento: first card hero-sized, others smaller (more editorial).' },
      { key:'items', label:'Services (JSON)', type:'list' },
    ],
    defaultData: {
      heading: 'What We Offer',
      subheading: 'Professional services tailored to deliver real results for your business.',
      items: [
        { icon:'zap', title:'Service One', desc:'Professional service that helps your clients achieve their goals faster.' },
        { icon:'target', title:'Service Two', desc:'Targeted approach delivering measurable results every time.' },
        { icon:'shield', title:'Service Three', desc:'Reliable, secure solutions you can trust for the long term.' },
      ]
    }
  },

  features: {
    type: 'features', name: 'Features', icon: '✦', description: 'Why choose you — feature highlights',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Why Choose Us' },
      { key:'subheading', label:'Subheading', type:'textarea', placeholder:'What makes us different' },
      { key:'items', label:'Features', type:'list' },
    ],
    defaultData: {
      heading: 'Why Choose Us',
      subheading: 'We combine expertise, technology, and personal service to deliver outcomes that matter.',
      items: [
        { icon:'check', title:'Expert Team', desc:'Years of experience across multiple industries.' },
        { icon:'bolt', title:'Fast Turnaround', desc:'We work efficiently without compromising quality.' },
        { icon:'thumbs-up', title:'Full Support', desc:'Dedicated support before, during, and after.' },
        { icon:'award', title:'Proven Results', desc:'Track record of delivering measurable outcomes.' },
      ]
    }
  },

  about: {
    type: 'about', name: 'About', icon: '👥', description: 'Your story — who you are',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'About Us' },
      { key:'subheading', label:'Subheading', type:'text', placeholder:'Our story' },
      { key:'body', label:'Main Text', type:'textarea', placeholder:'Tell your story...' },
      { key:'body2', label:'Second Paragraph', type:'textarea', placeholder:'More details...' },
      { key:'image', label:'Image', type:'image' },
      { key:'ctaText', label:'Button Text', type:'text', placeholder:'Learn More' },
    ],
    defaultData: {
      heading: 'About Us',
      subheading: 'Built on trust, driven by results',
      body: 'We started with a simple mission: to provide exceptional service that genuinely makes a difference for our clients. Over the years, we have grown into a trusted partner for businesses across the region.',
      body2: 'Our team brings together expertise, passion, and a commitment to excellence that sets us apart from the rest. Every client relationship is built on transparency, integrity, and results.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      ctaText: 'Meet Our Team',
    }
  },

  testimonials: {
    type: 'testimonials', name: 'Testimonials', icon: '💬', description: 'Client reviews and social proof',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'What Our Clients Say' },
      { key:'variant', label:'Layout', type:'select', options:['cards','marquee'], hint:'Cards: 3-column grid. Marquee: infinite horizontal scroll (needs 3+ testimonials).' },
      { key:'items', label:'Testimonials', type:'list' },
    ],
    defaultData: {
      heading: 'What Our Clients Say',
      items: [
        { name:'Sarah Johnson', role:'CEO, Innovate SA', quote:'Outstanding service from start to finish. The team delivered exactly what we needed, on time and on budget.', avatar:'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random' },
        { name:'Michael Dlamini', role:'Director, Growth Co', quote:'I have worked with many providers over the years. This team stands out for their professionalism and genuine commitment to results.', avatar:'https://ui-avatars.com/api/?name=Michael+Dlamini&background=random' },
        { name:'Priya Naidoo', role:'Founder, TechStart', quote:'The quality of work and attention to detail is exceptional. Highly recommended to any business looking to grow.', avatar:'https://ui-avatars.com/api/?name=Priya+Naidoo&background=random' },
      ]
    }
  },

  gallery: {
    type: 'gallery', name: 'Gallery', icon: '🖼️', description: 'Photo gallery or portfolio grid',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Our Work' },
      { key:'subheading', label:'Subheading', type:'text', placeholder:'A selection of our best projects' },
      { key:'images', label:'Images', type:'list' },
    ],
    defaultData: {
      heading: 'Our Work',
      subheading: 'A selection of projects we are proud of.',
      images: [
        { url:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', alt:'Project 1', caption:'Project Alpha' },
        { url:'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80', alt:'Project 2', caption:'Project Beta' },
        { url:'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80', alt:'Project 3', caption:'Project Gamma' },
        { url:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', alt:'Project 4', caption:'Project Delta' },
        { url:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', alt:'Project 5', caption:'Project Epsilon' },
        { url:'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80', alt:'Project 6', caption:'Project Zeta' },
      ]
    }
  },

  pricing: {
    type: 'pricing', name: 'Pricing', icon: '💰', description: 'Pricing plans and packages',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Our Packages' },
      { key:'subheading', label:'Subheading', type:'text', placeholder:'Choose the plan that suits you' },
      { key:'variant', label:'Layout', type:'select', options:['cards','comparison'], hint:'Cards: side-by-side plan cards. Comparison: feature checklist table — better when plans share many features.' },
      { key:'taxIncluded', label:'Prices include tax', type:'boolean', hint:'Adds an "incl. VAT/GST" label below each price.' },
      { key:'items', label:'Plans', type:'list' },
    ],
    defaultData: {
      heading: 'Our Packages',
      subheading: 'Transparent pricing with no hidden fees. Choose the package that works for your business.',
      taxIncluded: true,
      items: [
        { name:'Starter', price:'R2,500', period:'/month', features:['Feature one','Feature two','Feature three','Email support'], cta:'Get Started', highlighted:false },
        { name:'Professional', price:'R5,500', period:'/month', features:['Everything in Starter','Feature four','Feature five','Priority support','Monthly report'], cta:'Get Started', highlighted:true },
        { name:'Enterprise', price:'Custom', period:'', features:['Everything in Pro','Dedicated manager','Custom solutions','24/7 support','SLA guarantee'], cta:'Contact Us', highlighted:false },
      ]
    }
  },

  team: {
    type: 'team', name: 'Team', icon: '🧑‍💼', description: 'Meet the team',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Meet Our Team' },
      { key:'members', label:'Team Members', type:'list' },
    ],
    defaultData: {
      heading: 'Meet Our Team',
      members: [
        { name:'John Smith', role:'Managing Director', bio:'15 years of industry experience driving business growth.', image:'https://ui-avatars.com/api/?name=John+Smith&size=200&background=random' },
        { name:'Lisa Mokoena', role:'Operations Manager', bio:'Expert in optimising processes and delivering client satisfaction.', image:'https://ui-avatars.com/api/?name=Lisa+Mokoena&size=200&background=random' },
        { name:'David Chen', role:'Head of Technology', bio:'Passionate about building solutions that scale with your business.', image:'https://ui-avatars.com/api/?name=David+Chen&size=200&background=random' },
      ]
    }
  },

  faq: {
    type: 'faq', name: 'FAQ', icon: '❓', description: 'Frequently asked questions',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Frequently Asked Questions' },
      { key:'items', label:'Questions', type:'list' },
    ],
    defaultData: {
      heading: 'Frequently Asked Questions',
      items: [
        { q:'How long does it take to get started?', a:'We can typically get you started within 2–3 business days. Our onboarding process is quick and straightforward.' },
        { q:'What areas do you serve?', a:'We serve clients across South Africa with remote capability for national and international clients.' },
        { q:'Do you offer a guarantee?', a:'Yes. We stand behind our work with a satisfaction guarantee. If you are not happy, we will make it right.' },
        { q:'How do I get in touch?', a:'You can reach us by phone, email, or through the contact form on this page. We typically respond within 24 hours.' },
      ]
    }
  },

  cta: {
    type: 'cta', name: 'Call to Action', icon: '🚀', description: 'Bold section to drive conversions',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Ready to Get Started?' },
      { key:'subtext', label:'Subtext', type:'textarea', placeholder:'Take the next step today' },
      { key:'ctaText', label:'Button Text', type:'text', placeholder:'Contact Us Today' },
      { key:'ctaUrl', label:'Button URL', type:'url', placeholder:'#contact' },
      { key:'ctaText2', label:'Secondary Button', type:'text', placeholder:'Learn More' },
    ],
    defaultData: {
      heading: 'Ready to Work With Us?',
      subtext: 'Join hundreds of satisfied clients who have transformed their business with our help. Let\'s start the conversation today.',
      ctaText: 'Get in Touch',
      ctaUrl: '#contact',
      ctaText2: 'View Our Work',
    }
  },

  contact: {
    type: 'contact', name: 'Contact', icon: '📬', description: 'Contact form and details',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Get In Touch' },
      { key:'subtext', label:'Subtext', type:'textarea', placeholder:'We would love to hear from you' },
      { key:'phone', label:'Phone', type:'text', placeholder:'+27 11 000 0000' },
      { key:'email', label:'Email', type:'text', placeholder:'hello@business.co.za' },
      { key:'address', label:'Address', type:'text', placeholder:'Johannesburg, South Africa' },
      { key:'hours', label:'Business Hours', type:'text', placeholder:'Mon–Fri 8am–5pm' },
      { key:'formKey', label:'Web3Forms Access Key (free)', type:'text', placeholder:'Paste from web3forms.com', hint:'Get a free key at web3forms.com — without it the form falls back to opening the visitor\'s email app.' },
    ],
    defaultData: {
      heading: 'Get In Touch',
      subtext: 'Have a question or ready to get started? We would love to hear from you. Fill in the form and we will get back to you within 24 hours.',
      phone: '+27 11 000 0000',
      email: 'hello@yourbusiness.co.za',
      address: 'Johannesburg, South Africa',
      hours: 'Monday – Friday, 8:00am – 5:00pm',
      formKey: '',
    }
  },

  whatsapp: {
    type: 'whatsapp', name: 'WhatsApp Chat', icon: '💬', description: 'Click-to-chat card with WhatsApp',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Chat with us on WhatsApp' },
      { key:'subtext', label:'Subtext', type:'textarea', placeholder:'We typically reply within an hour during business hours.' },
      { key:'number', label:'Phone (with country code or local)', type:'text', placeholder:'+27 11 000 0000' },
      { key:'message', label:'Pre-filled message', type:'textarea', placeholder:'Hi, I would like more information about...' },
      { key:'buttonText', label:'Button text', type:'text', placeholder:'Open WhatsApp' },
    ],
    defaultData: {
      heading:'Chat with us on WhatsApp',
      subtext:'Skip the form — message us directly. We typically reply within an hour during business hours.',
      number:'',
      message:'Hi, I would like more information about your services.',
      buttonText:'Open WhatsApp',
    }
  },

  banking: {
    type: 'banking', name: 'Banking / EFT Details', icon: '🏦', description: 'Payment & banking details for direct transfers',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Banking Details' },
      { key:'subtext', label:'Subtext', type:'textarea', placeholder:'Use these details for direct EFT payments.' },
      { key:'accountName', label:'Account name', type:'text', placeholder:'Your Business (Pty) Ltd' },
      { key:'bank', label:'Bank', type:'text', placeholder:'FNB / ABSA / Standard Bank' },
      { key:'accountNumber', label:'Account number', type:'text', placeholder:'62000000000' },
      { key:'branchCode', label:'Branch / IFSC / Sort code', type:'text', placeholder:'250655' },
      { key:'reference', label:'Reference instructions', type:'text', placeholder:'Use your invoice number as reference' },
      { key:'extra', label:'Extra payment methods (one per line)', type:'textarea', placeholder:'M-Pesa Paybill: 123456\nUPI: mybusiness@bank' },
    ],
    defaultData: {
      heading:'Banking Details',
      subtext:'For EFT payments, use the details below. Please use your invoice number or surname as the reference.',
      accountName:'',
      bank:'',
      accountNumber:'',
      branchCode:'',
      reference:'Use your invoice number or surname as the reference.',
      extra:'',
    }
  },

  policy: {
    type: 'policy', name: 'Privacy Policy', icon: '📜', description: 'Auto-generated privacy policy for your country',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Privacy Policy' },
      { key:'autoGenerate', label:'Auto-generate from your country profile', type:'boolean', hint:'Recommended. Toggle off to write custom text.' },
      { key:'customBody', label:'Custom body (Markdown supported, used if auto-generate is off)', type:'textarea', placeholder:'## Section\nYour custom policy text...' },
    ],
    defaultData: {
      heading:'Privacy Policy',
      autoGenerate: true,
      customBody:'',
    }
  },

  maps: {
    type: 'maps', name: 'Google Maps', icon: '🗺️', description: 'Embedded map of your business location',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Find Us' },
      { key:'subtext', label:'Subtext', type:'textarea', placeholder:'Visit us in person.' },
      { key:'address', label:'Address (used for the map query)', type:'text', placeholder:'Sandton, Johannesburg' },
      { key:'embedUrl', label:'Or paste a Google Maps embed URL (overrides address)', type:'url', placeholder:'https://www.google.com/maps/embed?...' },
    ],
    defaultData: {
      heading:'Find Us',
      subtext:'',
      address:'',
      embedUrl:'',
    }
  },

  newsletter: {
    type: 'newsletter', name: 'Newsletter Signup', icon: '✉️', description: 'Email signup that posts to your provider',
    fields: [
      { key:'heading', label:'Heading', type:'text', placeholder:'Stay in the loop' },
      { key:'subtext', label:'Subtext', type:'textarea', placeholder:'Monthly updates, no spam.' },
      { key:'buttonText', label:'Button text', type:'text', placeholder:'Subscribe' },
      { key:'provider', label:'Provider', type:'select', options:['mailto','formsubmit','web3forms','custom'], hint:'Mailto opens an email; the others post the email to a service.' },
      { key:'endpoint', label:'Provider endpoint or your email', type:'text', placeholder:'you@business.com or https://formsubmit.co/...' },
    ],
    defaultData: {
      heading:'Stay in the loop',
      subtext:'Monthly updates on our services. No spam — just useful news.',
      buttonText:'Subscribe',
      provider:'mailto',
      endpoint:'',
    }
  },
}

export const SECTION_GROUPS = [
  { label: 'Header & Hero', types: ['hero'] },
  { label: 'Content', types: ['about', 'features', 'stats'] },
  { label: 'Services & Products', types: ['services', 'pricing'] },
  { label: 'Social Proof', types: ['testimonials', 'team', 'gallery'] },
  { label: 'Conversion', types: ['cta', 'faq', 'contact', 'whatsapp', 'newsletter'] },
  { label: 'Logistics', types: ['banking', 'maps', 'policy'] },
]
