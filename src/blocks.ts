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
  { id:'hero-creative', name:'Creative Studio', category:'Hero', description:'Bold artistic for design agencies', emoji:'🎨', type:'hero',
    data: { headline:'We Make Brands Unforgettable', subtext:'Strategic design that captures attention, builds loyalty, and drives growth for ambitious businesses.', ctaText:'Start a Project', ctaUrl:'#contact', ctaText2:'See Our Portfolio', image:'https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1400&q=80', showStats:false } },
  { id:'hero-corporate', name:'Corporate Trust', category:'Hero', description:'Professional, conservative, trustworthy', emoji:'💼', type:'hero',
    data: { headline:'Strategic Partners. Real Results.', subtext:'Trusted by industry leaders to deliver expert advice, exceptional service, and outcomes that matter.', ctaText:'Schedule a Consultation', ctaUrl:'#contact', ctaText2:'Our Services', image:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80', showStats:true } },
  { id:'hero-ecommerce', name:'Product Showcase', category:'Hero', description:'For e-commerce or product brands', emoji:'🛍️', type:'hero',
    data: { headline:'Quality Products. Honest Prices.', subtext:'Curated essentials for everyday life — made with care, delivered to your door.', ctaText:'Shop Collection', ctaUrl:'#products', ctaText2:'Our Story', image:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80', showStats:false } },
  { id:'hero-health', name:'Health & Wellness', category:'Hero', description:'Calm, professional for healthcare', emoji:'🌿', type:'hero',
    data: { headline:'Caring for You, Every Step of the Way', subtext:'Personalised health and wellness services delivered by a team that puts your wellbeing first.', ctaText:'Book an Appointment', ctaUrl:'#contact', ctaText2:'Our Services', image:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=80', showStats:true } },
  { id:'hero-restaurant', name:'Restaurant Hero', category:'Hero', description:'Warm, appetizing food brand hero', emoji:'🍽️', type:'hero',
    data: { headline:'Crafted with Passion, Served with Pride', subtext:'Authentic flavours, local ingredients, and an experience worth remembering. Reserve your table tonight.', ctaText:'Make a Reservation', ctaUrl:'#contact', ctaText2:'View Menu', image:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80', showStats:false } },

  // ABOUT BLOCKS
  { id:'about-story', name:'Our Story', category:'About', description:'Brand story with image', emoji:'📖', type:'about',
    data: { heading:'Built on Passion, Driven by Results', subheading:'Our story', body:'We started with one simple belief: businesses deserve better. Better service, better results, better partners. That belief still drives every decision we make today.', body2:'Over the years, we have grown into a trusted partner for hundreds of businesses across South Africa, helping them grow, innovate, and succeed.', image:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', ctaText:'Read Our Full Story' } },
  { id:'about-mission', name:'Mission Statement', category:'About', description:'Bold mission with photo', emoji:'🎯', type:'about',
    data: { heading:'Our Mission', subheading:'Why we do what we do', body:'To empower every business we work with to reach their full potential through expert guidance, world-class service, and partnerships built on trust.', body2:'We measure our success by the success of our clients. When you grow, we grow.', image:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80', ctaText:'Learn More About Us' } },
  { id:'about-experience', name:'Years of Experience', category:'About', description:'Established business with heritage', emoji:'🏛️', type:'about',
    data: { heading:'Trusted Since 2008', subheading:'Sixteen years of excellence', body:'For over a decade and a half, we have been the partner of choice for businesses across South Africa. From small startups to established enterprises, we have helped our clients navigate every challenge and opportunity.', body2:'Our longevity is built on one simple promise: we treat every client relationship like it is our most important. Because to us, it is.', image:'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', ctaText:'See Our History' } },
  { id:'about-values', name:'Our Values', category:'About', description:'Values-driven about section', emoji:'💎', type:'about',
    data: { heading:'Built on Integrity', subheading:'The values that guide us', body:'Honesty, excellence, and genuine care — these are not buzzwords for us. They are the principles we live by every day, in every interaction, with every client.', body2:'When you work with us, you work with a team that does what we say, says what we mean, and stands by our work long after the invoice is paid.', image:'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80', ctaText:'Read Our Promise' } },

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
  { id:'services-trades', name:'Trade Services', category:'Services', description:'Plumbing, electrical, contracting', emoji:'🔧', type:'services',
    data: { heading:'Our Services', subheading:'Reliable trade services backed by 20+ years of hands-on experience.', items:[
      { icon:'🔧', title:'Installations', desc:'New installations done right the first time, fully compliant and safe.' },
      { icon:'⚒️', title:'Repairs & Maintenance', desc:'Fast, affordable repairs to keep everything running smoothly.' },
      { icon:'🚨', title:'24/7 Emergency', desc:'When something goes wrong, we are just one phone call away.' },
    ]} },
  { id:'services-professional', name:'Professional Services', category:'Services', description:'Legal, accounting, consulting', emoji:'⚖️', type:'services',
    data: { heading:'Professional Services', subheading:'Expert advice and support for your business and personal needs.', items:[
      { icon:'📋', title:'Consultation', desc:'Initial consultation to understand your unique needs and goals.' },
      { icon:'⚖️', title:'Compliance', desc:'Stay on top of regulations and requirements with our expert guidance.' },
      { icon:'🤝', title:'Ongoing Support', desc:'Long-term partnership with dedicated account management.' },
    ]} },

  // FEATURES BLOCKS
  { id:'features-why-us', name:'Why Choose Us — 4 Features', category:'Features', description:'Two-column with feature grid', emoji:'✦', type:'features',
    data: { heading:'Why Choose Us', subheading:'Four reasons why businesses across South Africa choose us as their trusted partner.', items:[
      { icon:'✓', title:'Proven Track Record', desc:'200+ successful projects across multiple industries.' },
      { icon:'✓', title:'Expert Team', desc:'Industry veterans with 10+ years of experience.' },
      { icon:'✓', title:'Fast Turnaround', desc:'We deliver on time, every time, without compromise.' },
      { icon:'✓', title:'Full Support', desc:'Dedicated account manager and 24/7 support.' },
    ]} },
  { id:'features-benefits', name:'Customer Benefits', category:'Features', description:'Benefit-focused feature highlights', emoji:'⭐', type:'features',
    data: { heading:'What You Get', subheading:'Every client gets the same exceptional standards — no matter the size of your project.', items:[
      { icon:'★', title:'Quality Guaranteed', desc:'100% satisfaction guarantee on all our work.' },
      { icon:'★', title:'Transparent Pricing', desc:'No hidden fees. Clear, upfront pricing every time.' },
      { icon:'★', title:'Local Expertise', desc:'Deep understanding of the South African market.' },
      { icon:'★', title:'Real People', desc:'Talk to a real human, not a chatbot or call centre.' },
    ]} },
  { id:'features-process', name:'Our Process', category:'Features', description:'How we work — step by step', emoji:'🔄', type:'features',
    data: { heading:'How It Works', subheading:'Our proven 4-step process makes working with us simple and stress-free.', items:[
      { icon:'1', title:'Discover', desc:'We learn about your business, goals, and challenges.' },
      { icon:'2', title:'Plan', desc:'We design a tailored strategy that fits your needs.' },
      { icon:'3', title:'Execute', desc:'We deliver the work to the highest standard, on time.' },
      { icon:'4', title:'Support', desc:'We provide ongoing support and optimisation.' },
    ]} },

  // STATS BLOCKS
  { id:'stats-trust', name:'Trust Signals', category:'Stats', description:'Bold trust-building numbers', emoji:'📊', type:'stats',
    data: { stat1val:'500+', stat1label:'Happy Clients', stat2val:'12yr', stat2label:'Industry Experience', stat3val:'99%', stat3label:'On-Time Delivery', stat4val:'24/7', stat4label:'Customer Support' } },
  { id:'stats-growth', name:'Growth Metrics', category:'Stats', description:'Performance numbers', emoji:'📈', type:'stats',
    data: { stat1val:'2.5x', stat1label:'Avg Revenue Growth', stat2val:'87%', stat2label:'Client Retention', stat3val:'45+', stat3label:'Expert Team Members', stat4val:'15M+', stat4label:'Lives Impacted' } },
  { id:'stats-impact', name:'Social Impact', category:'Stats', description:'Mission-driven stats', emoji:'🌍', type:'stats',
    data: { stat1val:'1,200+', stat1label:'Lives Improved', stat2val:'50+', stat2label:'Communities Served', stat3val:'R15M', stat3label:'Invested in Local', stat4val:'12yr', stat4label:'Of Service' } },
  { id:'stats-ecommerce', name:'E-commerce Stats', category:'Stats', description:'Sales-focused metrics', emoji:'🛒', type:'stats',
    data: { stat1val:'50K+', stat1label:'Happy Customers', stat2val:'4.9★', stat2label:'Average Rating', stat3val:'48hr', stat3label:'Fast Delivery', stat4val:'30 days', stat4label:'Returns Window' } },

  // TESTIMONIALS
  { id:'testimonials-3col', name:'Client Testimonials', category:'Testimonials', description:'Three customer reviews with photos', emoji:'💬', type:'testimonials',
    data: { heading:'Loved by Businesses Like Yours', items:[
      { name:'Thabo Mokoena', role:'CEO, Velocity Group', quote:'They transformed our business. We saw a 3x increase in qualified leads within 60 days. Worth every cent.', avatar:'https://ui-avatars.com/api/?name=Thabo+Mokoena&background=2563eb&color=fff' },
      { name:'Amara Nkosi', role:'Founder, Bright Studio', quote:'The team is exceptional. Professional, responsive, and they actually understand our industry.', avatar:'https://ui-avatars.com/api/?name=Amara+Nkosi&background=16a34a&color=fff' },
      { name:'James van der Merwe', role:'MD, Apex Holdings', quote:'I have worked with many providers over 20 years. This team stands out for results and integrity.', avatar:'https://ui-avatars.com/api/?name=James+vdM&background=ea580c&color=fff' },
    ]} },
  { id:'testimonials-customer', name:'Customer Reviews', category:'Testimonials', description:'Reviews from individual customers', emoji:'⭐', type:'testimonials',
    data: { heading:'What Our Customers Say', items:[
      { name:'Linda Mthembu', role:'Verified Customer', quote:'Best decision I ever made. Quality service, friendly staff, and prices that are honest. Will definitely come back.', avatar:'https://ui-avatars.com/api/?name=Linda+Mthembu&background=ec4899&color=fff' },
      { name:'Pieter Botha', role:'Verified Customer', quote:'Quick response, professional service, and the work was done perfectly. Highly recommended to anyone.', avatar:'https://ui-avatars.com/api/?name=Pieter+Botha&background=8b5cf6&color=fff' },
      { name:'Nomvula Khumalo', role:'Verified Customer', quote:'I have used many similar services before but this is by far the best. The attention to detail is amazing.', avatar:'https://ui-avatars.com/api/?name=Nomvula+Khumalo&background=06b6d4&color=fff' },
    ]} },
  { id:'testimonials-corporate', name:'Corporate Endorsements', category:'Testimonials', description:'B2B endorsements from executives', emoji:'🏢', type:'testimonials',
    data: { heading:'Trusted by Industry Leaders', items:[
      { name:'Dr. Naledi Pillay', role:'Director, Sapphire Holdings', quote:'A strategic partner that consistently delivers above expectations. Their insights have shaped our last three major initiatives.', avatar:'https://ui-avatars.com/api/?name=Naledi+Pillay&background=1d4ed8&color=fff' },
      { name:'Andrew Williams', role:'CFO, Global Solutions', quote:'Reliable, professional, and results-driven. They have become an integral part of our operations.', avatar:'https://ui-avatars.com/api/?name=Andrew+Williams&background=059669&color=fff' },
      { name:'Bongani Sithole', role:'COO, Pioneer Industries', quote:'They understand business at a deep level. Every recommendation has been actionable and impactful.', avatar:'https://ui-avatars.com/api/?name=Bongani+Sithole&background=dc2626&color=fff' },
    ]} },

  // PRICING BLOCKS
  { id:'pricing-3tier', name:'3-Tier Pricing', category:'Pricing', description:'Standard pricing with featured tier', emoji:'💰', type:'pricing',
    data: { heading:'Pricing That Fits Your Business', subheading:'Transparent pricing. No surprises. No hidden fees.', items:[
      { name:'Starter', price:'R2,500', period:'/month', features:['1 user account','5GB storage','Email support','Basic analytics','Mobile app access'], cta:'Start Free Trial', highlighted:false },
      { name:'Professional', price:'R6,500', period:'/month', features:['5 user accounts','50GB storage','Priority support','Advanced analytics','Custom integrations','API access'], cta:'Get Started', highlighted:true },
      { name:'Enterprise', price:'Custom', period:'', features:['Unlimited users','Unlimited storage','24/7 phone support','Custom development','Dedicated manager','SLA guarantee'], cta:'Contact Sales', highlighted:false },
    ]} },
  { id:'pricing-services', name:'Service Packages', category:'Pricing', description:'For service-based businesses', emoji:'📦', type:'pricing',
    data: { heading:'Service Packages', subheading:'Choose the package that suits your needs. All packages include a free initial consultation.', items:[
      { name:'Basic', price:'R1,500', period:'one-off', features:['Initial consultation','Standard service delivery','Email follow-up','30-day guarantee'], cta:'Book Now', highlighted:false },
      { name:'Premium', price:'R3,800', period:'one-off', features:['Detailed consultation','Premium service delivery','Phone & email support','Priority scheduling','60-day guarantee','Free follow-up visit'], cta:'Most Popular', highlighted:true },
      { name:'VIP', price:'R7,500', period:'one-off', features:['Full assessment','VIP service delivery','24/7 dedicated support','Same-day scheduling','12-month warranty','Annual maintenance'], cta:'Reserve Slot', highlighted:false },
    ]} },
  { id:'pricing-monthly', name:'Monthly Subscription', category:'Pricing', description:'SaaS or recurring services', emoji:'🔄', type:'pricing',
    data: { heading:'Choose Your Plan', subheading:'Cancel anytime. No setup fees. 14-day free trial on all plans.', items:[
      { name:'Free', price:'R0', period:'forever', features:['Up to 5 projects','Basic features','Community support','7-day history'], cta:'Start Free', highlighted:false },
      { name:'Pro', price:'R299', period:'/month', features:['Unlimited projects','All Pro features','Email support','Unlimited history','Custom branding','Team collaboration'], cta:'Start 14-Day Trial', highlighted:true },
      { name:'Business', price:'R999', period:'/month', features:['Everything in Pro','Advanced security','SSO integration','Priority support','Custom contracts','Dedicated account manager'], cta:'Contact Sales', highlighted:false },
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
  { id:'team-founder', name:'Founder Profile', category:'Team', description:'Single founder spotlight', emoji:'👑', type:'team',
    data: { heading:'Meet the Founder', members:[
      { name:'Nokuthula Mahlangu', role:'Founder & CEO', bio:'After 15 years in corporate, Nokuthula founded the company in 2018 with a vision to bring world-class service to South African businesses. Today, that vision continues to drive everything we do.', image:'https://ui-avatars.com/api/?name=Nokuthula+Mahlangu&size=300&background=9333ea&color=fff' },
    ]} },
  { id:'team-full', name:'Full Team — 6 People', category:'Team', description:'Larger team showcase', emoji:'👥', type:'team',
    data: { heading:'The People Behind the Work', members:[
      { name:'Sarah P.', role:'Managing Director', bio:'Strategic leader with deep industry expertise.', image:'https://ui-avatars.com/api/?name=Sarah+P&size=200&background=2563eb&color=fff' },
      { name:'David C.', role:'Head of Strategy', bio:'Strategic thinker and problem solver.', image:'https://ui-avatars.com/api/?name=David+C&size=200&background=16a34a&color=fff' },
      { name:'Lerato D.', role:'Operations Lead', bio:'Expert at scaling operations and teams.', image:'https://ui-avatars.com/api/?name=Lerato+D&size=200&background=ea580c&color=fff' },
      { name:'Mark T.', role:'Head of Sales', bio:'Building lasting client relationships.', image:'https://ui-avatars.com/api/?name=Mark+T&size=200&background=dc2626&color=fff' },
      { name:'Priya R.', role:'Creative Director', bio:'Bringing brands to life through design.', image:'https://ui-avatars.com/api/?name=Priya+R&size=200&background=ec4899&color=fff' },
      { name:'James W.', role:'Tech Lead', bio:'Engineering robust, scalable solutions.', image:'https://ui-avatars.com/api/?name=James+W&size=200&background=06b6d4&color=fff' },
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
  { id:'faq-pricing', name:'Pricing FAQs', category:'FAQ', description:'Common pricing & billing questions', emoji:'💳', type:'faq',
    data: { heading:'Pricing & Billing Questions', items:[
      { q:'How does pricing work?', a:'Our pricing is simple and transparent. You only pay for what you need, with no hidden fees or surprise charges.' },
      { q:'Can I change plans later?', a:'Yes, you can upgrade or downgrade at any time. Changes take effect at your next billing cycle.' },
      { q:'Do you offer discounts?', a:'We offer discounts for annual billing (save 20%), non-profits, and early-stage startups. Contact us for details.' },
      { q:'What payment methods do you accept?', a:'We accept all major credit cards, EFT, and Stripe. Invoicing is available for Enterprise plans.' },
      { q:'Is there a setup fee?', a:'No. There are no setup fees on any of our plans. You can get started immediately.' },
    ]} },
  { id:'faq-trades', name:'Trade Service FAQs', category:'FAQ', description:'For plumbers, electricians, contractors', emoji:'🛠️', type:'faq',
    data: { heading:'Common Questions Answered', items:[
      { q:'Are you licensed and insured?', a:'Yes. We are fully licensed, insured, and our team is qualified and certified. We can provide proof of all certifications on request.' },
      { q:'Do you offer emergency services?', a:'Yes, we offer 24/7 emergency response for urgent issues. After-hours and weekend rates apply.' },
      { q:'How do I get a quote?', a:'Quotes are free. Just call us, fill in our form, or send us a WhatsApp. We will arrange a site visit if needed.' },
      { q:'Do you guarantee your work?', a:'Absolutely. All our work comes with a written guarantee. If something is not right, we fix it at no extra cost.' },
      { q:'What areas do you service?', a:'We service Johannesburg, Pretoria, and surrounding areas. Travel fees may apply for outlying areas.' },
    ]} },

  // CTA BLOCKS
  { id:'cta-bold-gradient', name:'Bold Gradient CTA', category:'Conversion', description:'Eye-catching call to action', emoji:'🚀', type:'cta',
    data: { heading:'Ready to Take the Next Step?', subtext:'Join hundreds of satisfied clients who have transformed their business with our help. Let us show you what is possible.', ctaText:'Book Your Free Consultation', ctaUrl:'#contact', ctaText2:'View Case Studies' } },
  { id:'cta-simple', name:'Simple Direct CTA', category:'Conversion', description:'Straight-to-the-point CTA', emoji:'➡️', type:'cta',
    data: { heading:'Let\'s Talk About Your Project', subtext:'Tell us about your business goals and we will show you how we can help.', ctaText:'Get in Touch', ctaUrl:'#contact', ctaText2:'' } },
  { id:'cta-urgent', name:'Limited Offer CTA', category:'Conversion', description:'Urgency-driven conversion section', emoji:'⏰', type:'cta',
    data: { heading:'Limited Time Offer — Save 30%', subtext:'Book before the end of the month and lock in our best rates of the year. Limited spots available.', ctaText:'Claim Your Discount', ctaUrl:'#contact', ctaText2:'See Terms' } },
  { id:'cta-newsletter', name:'Newsletter Signup', category:'Conversion', description:'Email capture call to action', emoji:'📧', type:'cta',
    data: { heading:'Stay in the Loop', subtext:'Get exclusive tips, updates, and offers delivered to your inbox. No spam, ever. Unsubscribe anytime.', ctaText:'Subscribe Now', ctaUrl:'#newsletter', ctaText2:'' } },

  // CONTACT BLOCKS
  { id:'contact-full', name:'Full Contact Section', category:'Contact', description:'Form + details side by side', emoji:'📬', type:'contact',
    data: { heading:'Get in Touch', subtext:'Whether you have a question, want to start a project, or just want to chat, we would love to hear from you.', phone:'+27 11 234 5678', email:'hello@yourbusiness.co.za', address:'123 Main Street, Sandton, Johannesburg', hours:'Monday – Friday, 8:00am – 5:00pm SAST' } },
  { id:'contact-quote', name:'Get a Quote Section', category:'Contact', description:'Quote-focused contact section', emoji:'📋', type:'contact',
    data: { heading:'Get a Free Quote', subtext:'Tell us about your project and we will get back to you with a detailed, no-obligation quote within 24 hours.', phone:'+27 82 123 4567', email:'quotes@yourbusiness.co.za', address:'Servicing Johannesburg, Pretoria & surrounding areas', hours:'Available 24/7 for emergencies' } },
  { id:'contact-booking', name:'Book Appointment', category:'Contact', description:'Appointment-focused for service businesses', emoji:'📅', type:'contact',
    data: { heading:'Book Your Appointment', subtext:'Ready to get started? Book a consultation at a time that suits you. We will confirm your appointment within an hour.', phone:'+27 11 567 8900', email:'bookings@yourbusiness.co.za', address:'Visit us in Sandton or book a virtual consultation', hours:'Mon-Fri 8am-7pm | Sat 9am-2pm' } },

  // GALLERY - additional
  { id:'gallery-team', name:'Behind the Scenes', category:'Gallery', description:'Show your team & workspace', emoji:'📸', type:'gallery',
    data: { heading:'Behind the Scenes', subheading:'A glimpse into our world — the team, the workspace, the work in progress.', images:[
      { url:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80', alt:'Team', caption:'Our team in action' },
      { url:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', alt:'Office', caption:'The workspace' },
      { url:'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=600&q=80', alt:'Meeting', caption:'Strategy session' },
      { url:'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80', alt:'Collaboration', caption:'Working together' },
      { url:'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=80', alt:'Workshop', caption:'Workshop day' },
      { url:'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=600&q=80', alt:'Coffee', caption:'Morning brew' },
    ]} },
]

export const BLOCK_CATEGORIES = ['All', 'Hero', 'About', 'Services', 'Features', 'Stats', 'Testimonials', 'Pricing', 'Gallery', 'Team', 'FAQ', 'Conversion', 'Contact']
