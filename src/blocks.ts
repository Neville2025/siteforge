import type { SectionType } from './types'

export interface Block {
  id: string
  name: string
  category: string
  description: string
  emoji: string
  type: SectionType
  data: Record<string, any>
}

// ── BLOCK LIBRARY: premium pre-styled section variations ───────
export const BLOCKS: Block[] = [

  // HERO BLOCKS
  { id:'hero-bold-gradient', name:'Bold Gradient Hero', category:'Hero', description:'Full viewport with gradient overlay and stats bar', emoji:'🎯', type:'hero',
    data: { headline:'Transform Your Business Today', subtext:'Premium services that drive real, measurable results for ambitious businesses ready to scale.', ctaText:'Get Started', ctaUrl:'#contact', ctaText2:'See Our Work', image:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=80', showStats:true } },
  { id:'hero-clean-light', name:'Clean Light Hero', category:'Hero', description:'Minimal, light background, focus on copy', emoji:'☀️', type:'hero',
    data: { headline:'Simple. Powerful. Effective.', subtext:'We help businesses grow through clean design and proven strategy.', ctaText:'Start Free Trial', ctaUrl:'#contact', ctaText2:'Watch Demo', image:'', showStats:false } },
  { id:'hero-image-bg', name:'Photography Hero', category:'Hero', description:'Full-screen image with overlay', emoji:'📷', type:'hero',
    data: { headline:'Crafted for Excellence', subtext:'Every detail matters. Every moment counts.', ctaText:'Discover More', ctaUrl:'#about', ctaText2:'', image:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80', showStats:false } },
  { id:'hero-startup', name:'Startup Hero', category:'Hero', description:'Tech startup style with social proof', emoji:'🚀', type:'hero',
    data: { headline:'The future of your industry is here', subtext:'Join 10,000+ businesses using our platform to grow faster.', ctaText:'Try Free for 14 Days', ctaUrl:'#contact', ctaText2:'Book a Demo', image:'', showStats:true } },

  // ABOUT BLOCKS
  { id:'about-story', name:'Our Story', category:'About', description:'Brand story with image', emoji:'📖', type:'about',
    data: { heading:'Built on Passion, Driven by Results', subheading:'Our story', body:'We started with one simple belief: businesses deserve better. Better service, better results, better partners. That belief still drives every decision we make today.', body2:'Over the years, we have grown into a trusted partner for hundreds of businesses across South Africa, helping them grow, innovate, and succeed.', image:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', ctaText:'Read Our Full Story' } },
  { id:'about-mission', name:'Mission Statement', category:'About', description:'Bold mission with photo', emoji:'🎯', type:'about',
    data: { heading:'Our Mission', subheading:'Why we do what we do', body:'To empower every business we work with to reach their full potential through expert guidance, world-class service, and partnerships built on trust.', body2:'We measure our success by the success of our clients. When you grow, we grow.', image:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80', ctaText:'Learn More About Us' } },

  // SERVICES BLOCKS
  { id:'services-3col', name:'3 Service Cards', category:'Services', description:'Classic 3-column service grid', emoji:'⚡', type:'services',
    data: { heading:'What We Offer', subheading:'Comprehensive services tailored to your needs.', items:[
      { icon:'⚡', title:'Strategy & Planning', desc:'Data-driven strategies that align with your business goals.' },
      { icon:'🎨', title:'Design & Branding', desc:'Visual identity that captures your essence and engages customers.' },
      { icon:'📈', title:'Growth & Marketing', desc:'Proven marketing tactics that turn visitors into loyal clients.' },
    ]} },
  { id:'services-6grid', name:'6 Service Grid', category:'Services', description:'Comprehensive service offering', emoji:'⚡', type:'services',
    data: { heading:'Complete Service Suite', subheading:'Everything you need under one roof.', items:[
      { icon:'⚡', title:'Strategy', desc:'Strategic planning and consulting.' },
      { icon:'🎨', title:'Design', desc:'Beautiful, functional design solutions.' },
      { icon:'📈', title:'Marketing', desc:'Targeted campaigns that convert.' },
      { icon:'🔧', title:'Development', desc:'Robust, scalable technology.' },
      { icon:'📊', title:'Analytics', desc:'Data insights that drive decisions.' },
      { icon:'🎯', title:'Support', desc:'Always-on dedicated support.' },
    ]} },

  // FEATURES BLOCKS
  { id:'features-why-us', name:'Why Choose Us — 4 Features', category:'Features', description:'Two-column with feature grid', emoji:'✦', type:'features',
    data: { heading:'Why Choose Us', subheading:'Four reasons why businesses across South Africa choose us as their trusted partner.', items:[
      { icon:'✓', title:'Proven Track Record', desc:'200+ successful projects across multiple industries.' },
      { icon:'✓', title:'Expert Team', desc:'Industry veterans with 10+ years of experience.' },
      { icon:'✓', title:'Fast Turnaround', desc:'We deliver on time, every time, without compromise.' },
      { icon:'✓', title:'Full Support', desc:'Dedicated account manager and 24/7 support.' },
    ]} },

  // STATS BLOCKS
  { id:'stats-trust', name:'Trust Signals', category:'Stats', description:'Bold trust-building numbers', emoji:'📊', type:'stats',
    data: { stat1val:'500+', stat1label:'Happy Clients', stat2val:'12yr', stat2label:'Industry Experience', stat3val:'99%', stat3label:'On-Time Delivery', stat4val:'24/7', stat4label:'Customer Support' } },
  { id:'stats-growth', name:'Growth Metrics', category:'Stats', description:'Performance numbers', emoji:'📈', type:'stats',
    data: { stat1val:'2.5x', stat1label:'Avg Revenue Growth', stat2val:'87%', stat2label:'Client Retention', stat3val:'45+', stat3label:'Expert Team Members', stat4val:'15M+', stat4label:'Lives Impacted' } },

  // TESTIMONIALS
  { id:'testimonials-3col', name:'Client Testimonials', category:'Testimonials', description:'Three customer reviews with photos', emoji:'💬', type:'testimonials',
    data: { heading:'Loved by Businesses Like Yours', items:[
      { name:'Thabo Mokoena', role:'CEO, Velocity Group', quote:'They transformed our business. We saw a 3x increase in qualified leads within 60 days. Worth every cent.', avatar:'https://ui-avatars.com/api/?name=Thabo+Mokoena&background=2563eb&color=fff' },
      { name:'Amara Nkosi', role:'Founder, Bright Studio', quote:'The team is exceptional. Professional, responsive, and they actually understand our industry.', avatar:'https://ui-avatars.com/api/?name=Amara+Nkosi&background=16a34a&color=fff' },
      { name:'James van der Merwe', role:'MD, Apex Holdings', quote:'I have worked with many providers over 20 years. This team stands out for results and integrity.', avatar:'https://ui-avatars.com/api/?name=James+vdM&background=ea580c&color=fff' },
    ]} },

  // PRICING BLOCKS
  { id:'pricing-3tier', name:'3-Tier Pricing', category:'Pricing', description:'Standard pricing with featured tier', emoji:'💰', type:'pricing',
    data: { heading:'Pricing That Fits Your Business', subheading:'Transparent pricing. No surprises. No hidden fees.', items:[
      { name:'Starter', price:'R2,500', period:'/month', features:['1 user account','5GB storage','Email support','Basic analytics','Mobile app access'], cta:'Start Free Trial', highlighted:false },
      { name:'Professional', price:'R6,500', period:'/month', features:['5 user accounts','50GB storage','Priority support','Advanced analytics','Custom integrations','API access'], cta:'Get Started', highlighted:true },
      { name:'Enterprise', price:'Custom', period:'', features:['Unlimited users','Unlimited storage','24/7 phone support','Custom development','Dedicated manager','SLA guarantee'], cta:'Contact Sales', highlighted:false },
    ]} },

  // GALLERY BLOCKS
  { id:'gallery-portfolio', name:'Portfolio Grid', category:'Gallery', description:'6-image work showcase', emoji:'🖼️', type:'gallery',
    data: { heading:'Recent Work', subheading:'A selection of projects we are proud to share.', images:[
      { url:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', alt:'Project', caption:'Marketing Campaign' },
      { url:'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80', alt:'Project', caption:'Brand Refresh' },
      { url:'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80', alt:'Project', caption:'Website Redesign' },
      { url:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', alt:'Project', caption:'Product Launch' },
      { url:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', alt:'Project', caption:'Photography' },
      { url:'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80', alt:'Project', caption:'Strategy Workshop' },
    ]} },

  // TEAM BLOCKS
  { id:'team-leadership', name:'Leadership Team', category:'Team', description:'3 team member cards', emoji:'🧑‍💼', type:'team',
    data: { heading:'Meet the Team', members:[
      { name:'Sarah Phakathi', role:'Managing Director', bio:'15+ years building successful businesses across multiple industries.', image:'https://ui-avatars.com/api/?name=Sarah+Phakathi&size=200&background=2563eb&color=fff' },
      { name:'David Chen', role:'Head of Strategy', bio:'Former consultant turned operator. Passionate about practical results.', image:'https://ui-avatars.com/api/?name=David+Chen&size=200&background=16a34a&color=fff' },
      { name:'Lerato Dube', role:'Operations Lead', bio:'Expert in scaling operations and building world-class teams.', image:'https://ui-avatars.com/api/?name=Lerato+Dube&size=200&background=ea580c&color=fff' },
    ]} },

  // FAQ BLOCKS
  { id:'faq-common', name:'Common Questions', category:'FAQ', description:'Top 5 FAQs for any business', emoji:'❓', type:'faq',
    data: { heading:'Frequently Asked Questions', items:[
      { q:'How long does it take to get started?', a:'We can typically get you onboarded within 2-3 business days. Our process is designed to be fast and frictionless.' },
      { q:'What is included in your packages?', a:'Each package includes everything you need to get up and running, plus ongoing support. See our pricing page for full details.' },
      { q:'Do you offer custom solutions?', a:'Absolutely. We work with you to understand your unique needs and tailor our services accordingly.' },
      { q:'What is your cancellation policy?', a:'No long-term contracts. You can cancel anytime with 30 days notice. We earn your business every month.' },
      { q:'How do I get in touch?', a:'Use the contact form below, email us, or give us a call. We typically respond within 4 business hours.' },
    ]} },

  // CTA BLOCKS
  { id:'cta-bold-gradient', name:'Bold Gradient CTA', category:'Conversion', description:'Eye-catching call to action', emoji:'🚀', type:'cta',
    data: { heading:'Ready to Take the Next Step?', subtext:'Join hundreds of satisfied clients who have transformed their business with our help. Let us show you what is possible.', ctaText:'Book Your Free Consultation', ctaUrl:'#contact', ctaText2:'View Case Studies' } },
  { id:'cta-simple', name:'Simple Direct CTA', category:'Conversion', description:'Straight-to-the-point CTA', emoji:'➡️', type:'cta',
    data: { heading:'Let\'s Talk About Your Project', subtext:'Tell us about your business goals and we will show you how we can help.', ctaText:'Get in Touch', ctaUrl:'#contact', ctaText2:'' } },

  // CONTACT BLOCKS
  { id:'contact-full', name:'Full Contact Section', category:'Contact', description:'Form + details side by side', emoji:'📬', type:'contact',
    data: { heading:'Get in Touch', subtext:'Whether you have a question, want to start a project, or just want to chat, we would love to hear from you.', phone:'+27 11 234 5678', email:'hello@yourbusiness.co.za', address:'123 Main Street, Sandton, Johannesburg', hours:'Monday – Friday, 8:00am – 5:00pm SAST' } },
]

export const BLOCK_CATEGORIES = ['All', 'Hero', 'About', 'Services', 'Features', 'Stats', 'Testimonials', 'Pricing', 'Gallery', 'Team', 'FAQ', 'Conversion', 'Contact']
