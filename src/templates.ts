// Pre-built site templates for common South African industries.
// Loadable from the Templates browser. Each template is a fully-formed
// SiteData object — ready to drop into store.loadSite().

import type { SiteData } from './types'

const u = (id: string) => `https://images.unsplash.com/${id}?w=1400&q=80&auto=format&fit=crop`
const av = (name: string, c = '2563eb') => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=${c}&color=fff`

export interface SiteTemplate {
  id: string
  name: string
  category: string
  description: string
  emoji: string
  preview?: string
  build: () => SiteData
}

// ── SafeTrak: GPS fleet tracking SaaS ─────────────────────────
const safetrak = (): SiteData => ({
  id: 'tpl-safetrak', name: 'SafeTrak', tagline: 'GPS fleet tracking that pays for itself',
  logo: '', country: 'ZA',
  widget: { enabled: true, channel: 'whatsapp', number: '+27110000000', message: 'Hi, I want to know more about SafeTrak GPS fleet tracking.' },
  theme: {
    primaryColor:'#00c758', secondaryColor:'#3080ff', accentColor:'#fe6e00',
    fontHeading:'Poppins', fontBody:'Inter', borderRadius:'medium', style:'dark',
  },
  pages: [
    { id:'p-home', name:'Home', slug:'/', sections:[
      { id:'s1', type:'hero', data:{ headline:'Know where every vehicle is. Right now.', subtext:'GPS tracking, geofencing, route history, and remote engine cut — built for South African fleets, from one bakkie to one hundred.', ctaText:'Get a Demo', ctaUrl:'#contact', ctaText2:'See Pricing', image:u('photo-1551434678-e076c223a692'), showStats:false } },
      { id:'s2', type:'stats', data:{ stat1val:'24/7', stat1label:'Live tracking', stat2val:'<5s', stat2label:'Update interval', stat3val:'5yr', stat3label:'Trip history', stat4val:'POPIA', stat4label:'Compliant' } },
      { id:'s3', type:'services', data:{ heading:'Everything you need to run your fleet', subheading:'One platform. Phone, web, and SMS alerts.', items:[
        { icon:'map-pin', title:'Live GPS tracking', desc:'See every vehicle on a map with sub-5-second updates. Speed, heading, ignition state.' },
        { icon:'shield', title:'Geofencing & alerts', desc:'Get an alert when a vehicle leaves a yard, exceeds a speed limit, or moves after hours.' },
        { icon:'lock', title:'Remote engine cut', desc:'If a vehicle is stolen, immobilise it from your phone. Optional CIPC-compliant integration.' },
        { icon:'chart', title:'Route history & reports', desc:'Replay any trip, export weekly fuel and overtime reports for your bookkeeper.' },
        { icon:'smartphone', title:'Mobile app for drivers', desc:'Drivers see their assigned routes; you see live status and ETAs from your phone.' },
        { icon:'phone', title:'Local support, real humans', desc:'Cape Town and Joburg support team. WhatsApp us — we reply.' },
      ] } },
      { id:'s4', type:'features', data:{ heading:'Why SA fleets choose SafeTrak', subheading:'Built here. Hosted here. Priced for here.', items:[
        { icon:'globe', title:'Hosted in af-south-1', desc:'Your data stays in South Africa. POPIA compliant by design.' },
        { icon:'dollar', title:'Transparent ZAR pricing', desc:'No dollar surprises, no hidden fees, no per-feature paywalls.' },
        { icon:'cpu', title:'Hardware included', desc:'OBD or hardwired tracker fitted free at your premises within 48 hours.' },
        { icon:'zap', title:'Pay-as-you-grow', desc:'Add a vehicle this morning, see it on the dashboard before lunch.' },
      ] } },
      { id:'s5', type:'testimonials', data:{ heading:'Trusted by SA fleet owners', variant:'marquee', items:[
        { name:'Sipho Dlamini', role:'Operations Manager, Khanyisa Logistics', quote:'We cut fuel costs 18% in the first quarter. The real-time tracking pays for itself.', avatar:av('Sipho Dlamini','00c758') },
        { name:'Sarah Johnson', role:'Owner, Cape Town Plumbers', quote:'The engine-cut feature recovered a stolen bakkie within an hour. SafeTrak literally saved my business.', avatar:av('Sarah Johnson','3080ff') },
        { name:'Thandi Naidoo', role:'Director, Ubuntu Couriers', quote:'Driver behaviour scoring drove our accident rate down by 40%. Insurance dropped our premium.', avatar:av('Thandi Naidoo','fe6e00') },
      ] } },
      { id:'s6', type:'cta', data:{ heading:'Ready to know where your fleet is?', subtext:'Free fitment, free first month. Cancel anytime — we keep the data, you keep the trust.', ctaText:'Book a Demo', ctaUrl:'#contact', ctaText2:'WhatsApp Us' } },
    ]},
    { id:'p-pricing', name:'Pricing', slug:'/pricing', sections:[
      { id:'s7', type:'hero', data:{ headline:'Simple pricing. Pay per vehicle.', subtext:'No setup fees. No long contracts. Cancel anytime.', ctaText:'Start Free Trial', ctaUrl:'#contact', ctaText2:'', image:'', showStats:false } },
      { id:'s8', type:'pricing', data:{ heading:'Choose your plan', subheading:'All plans include hardware, fitment, and 24/7 dashboard access.', variant:'comparison', taxIncluded:true, items:[
        { name:'Starter', price:'R249', period:'/vehicle/month', features:['Live GPS tracking','5-second updates','Trip history (90 days)','Speed & geofence alerts','Mobile app','Email support'], cta:'Start Free Trial', highlighted:false },
        { name:'Pro', price:'R349', period:'/vehicle/month', features:['Everything in Starter','5-year trip history','Driver behaviour scoring','Fuel & overtime reports','WhatsApp & SMS alerts','Priority support'], cta:'Start Free Trial', highlighted:true },
        { name:'Fleet', price:'Custom', period:'', features:['Everything in Pro','Remote engine cut','Custom integrations (Sage/Xero)','Dedicated account manager','SLA guarantee','Volume discount from 25 vehicles'], cta:'Talk to Sales', highlighted:false },
      ] } },
      { id:'s9', type:'faq', data:{ heading:'Frequently asked questions', items:[
        { q:'Do I need to install hardware?', a:'Yes — our team fits an OBD or hardwired tracker at your premises within 48 hours, included in the price.' },
        { q:'What about load shedding?', a:'Trackers have a 24-hour internal battery. If your fleet office is offline, the dashboard keeps logging trips for replay later.' },
        { q:'Is my data safe?', a:'All data is stored in af-south-1 (Cape Town) and we are POPIA compliant. We never sell or share your fleet data.' },
        { q:'Can I cancel anytime?', a:'Yes. Month-to-month, no contracts. We collect the hardware on cancellation — no penalty.' },
      ] } },
      { id:'s10', type:'cta', data:{ heading:'Try SafeTrak free for 30 days', subtext:'One vehicle, full access, no credit card required.', ctaText:'Start Free Trial', ctaUrl:'#contact', ctaText2:'' } },
    ]},
    { id:'p-contact', name:'Contact', slug:'/contact', sections:[
      { id:'s11', type:'contact', data:{ heading:'Get in touch with SafeTrak', subtext:'Phone, WhatsApp or email — pick what works for you. We reply within an hour during business hours.', phone:'+27 11 000 0000', email:'hello@safetrak.co.za', address:'Sandton, Johannesburg, Gauteng', hours:'Monday – Friday, 8:00am – 5:00pm SAST', formKey:'' } },
      { id:'s12', type:'whatsapp', data:{ heading:'Faster on WhatsApp', subtext:'Most clients prefer it. Skip the form — we typically reply within 30 minutes.', number:'+27110000000', message:'Hi SafeTrak, I have a fleet of __ vehicles and would like a demo.', buttonText:'Open WhatsApp' } },
      { id:'s13', type:'maps', data:{ heading:'Visit our offices', subtext:'', address:'Sandton, Johannesburg, South Africa', embedUrl:'' } },
    ]},
    { id:'p-privacy', name:'Privacy', slug:'/privacy', sections:[
      { id:'s14', type:'policy', data:{ heading:'Privacy Policy', autoGenerate:true, customBody:'' } },
    ]},
  ]
})

// ── Plumber template ──────────────────────────────────────────
const plumber = (): SiteData => ({
  id:'tpl-plumber', name:'Apex Plumbing', tagline:'24/7 emergency plumbing — no callout fees',
  logo:'', country:'ZA',
  widget:{ enabled:true, channel:'whatsapp', number:'+27710000000', message:'Hi Apex, I have a plumbing emergency.' },
  theme:{ primaryColor:'#2563eb', secondaryColor:'#0891b2', accentColor:'#06b6d4', fontHeading:'Poppins', fontBody:'Inter', borderRadius:'medium', style:'light' },
  pages:[
    { id:'pp-home', name:'Home', slug:'/', sections:[
      { id:'pp1', type:'hero', data:{ headline:'Burst pipe at 2am? We are already on the way.', subtext:'24/7 emergency plumbing across Joburg and Pretoria. Geyser failures, blocked drains, leak detection. No callout fee — pay only if we fix it.', ctaText:'Call Now', ctaUrl:'#contact', ctaText2:'Get a Quote', image:u('photo-1581578731548-c64695cc6952'), showStats:true, stat1val:'2,400+', stat1label:'Jobs done', stat2val:'24/7', stat2label:'Available', stat3val:'<60min', stat3label:'Response', stat4val:'5★', stat4label:'Rated' } },
      { id:'pp2', type:'services', data:{ heading:'What we fix', subheading:'No job too small. No emergency too late at night.', items:[
        { icon:'wrench', title:'Burst pipes & leak detection', desc:'Acoustic and thermal leak detection — fix it without breaking up the floor.' },
        { icon:'bolt', title:'Geyser repair & replacement', desc:'Same-day geyser swap. SABS-approved units. 5-year warranty.' },
        { icon:'wrench', title:'Blocked drains & toilets', desc:'High-pressure jetting and CCTV inspection. Guaranteed flow or your money back.' },
        { icon:'paint', title:'Bathroom renovations', desc:'Full bathroom refits. Tiling, plumbing, fittings. Fixed quote, fixed timeline.' },
        { icon:'leaf', title:'Water heating & solar', desc:'Heat pumps, solar geysers, gas instant — we install all leading brands.' },
        { icon:'settings', title:'General maintenance', desc:'Annual service plans for residential and complexes. Catch problems before they flood.' },
      ] } },
      { id:'pp3', type:'about', data:{ heading:'Local plumbers, not call-centres', subheading:'15 years of fixing pipes', body:'Apex Plumbing started in Krugersdorp in 2010 with one van and a promise: pick up the phone, show up on time, fix it right. Today we run 12 vans across the Vaal Triangle.', body2:'Every plumber on our team is qualified, vetted, and uniformed. You will never be surprised by who shows up at your gate.', image:u('photo-1581094794329-c8112a89af12'), ctaText:'Meet the team' } },
      { id:'pp4', type:'testimonials', data:{ heading:'What our customers say', items:[
        { name:'Andile Mokoena', role:'Linden, JHB', quote:'Geyser burst on a Sunday night. They were here in 40 minutes and replaced it before breakfast. Fair price.', avatar:av('Andile Mokoena','2563eb') },
        { name:'Sarah Patel', role:'Centurion', quote:'Used three plumbers before Apex. The others charged callout fees and disappeared. Apex actually fixed it.', avatar:av('Sarah Patel','0891b2') },
        { name:'Pieter van der Merwe', role:'Body Corporate, Sandton', quote:'We have a 60-unit complex on their service plan. Zero water disasters in 3 years. Worth every cent.', avatar:av('Pieter van der Merwe','06b6d4') },
      ] } },
      { id:'pp5', type:'pricing', data:{ heading:'Transparent pricing', subheading:'No callout fees. Quote on arrival. Pay on completion.', taxIncluded:true, items:[
        { name:'Quick fix', price:'From R650', period:'', features:['Tap, mixer, valve replacement','Same-day','Parts and labour','30-day guarantee'], cta:'Call Now', highlighted:false },
        { name:'Geyser swap', price:'From R4,500', period:'', features:['SABS geyser supplied','Removal & disposal','Drip-tray check','5-year warranty'], cta:'Get a Quote', highlighted:true },
        { name:'Service plan', price:'R299', period:'/month', features:['Annual inspection','Priority emergency callout','10% off all jobs','For homes & complexes'], cta:'Sign Up', highlighted:false },
      ] } },
      { id:'pp6', type:'cta', data:{ heading:'Got a leak? Stop scrolling.', subtext:'Call us now or WhatsApp a photo. We will quote on the spot.', ctaText:'Call Now', ctaUrl:'#contact', ctaText2:'WhatsApp' } },
    ]},
    { id:'pp-contact', name:'Contact', slug:'/contact', sections:[
      { id:'pp7', type:'contact', data:{ heading:'Get in touch', subtext:'24/7 phone line. Or WhatsApp a photo of the problem.', phone:'+27 71 000 0000', email:'help@apexplumbing.co.za', address:'Krugersdorp, Gauteng', hours:'24/7 — emergencies any time', formKey:'' } },
      { id:'pp8', type:'whatsapp', data:{ heading:'Fastest: WhatsApp us', subtext:'Send a photo — we will give you a price before we leave the depot.', number:'+27710000000', message:'Hi Apex, plumbing problem at: ', buttonText:'Open WhatsApp' } },
    ]},
    { id:'pp-priv', name:'Privacy', slug:'/privacy', sections:[
      { id:'pp9', type:'policy', data:{ heading:'Privacy Policy', autoGenerate:true, customBody:'' } },
    ]},
  ]
})

// ── Beauty salon template ─────────────────────────────────────
const salon = (): SiteData => ({
  id:'tpl-salon', name:'Glow Beauty Studio', tagline:'Where you leave looking like you',
  logo:'', country:'ZA',
  widget:{ enabled:true, channel:'whatsapp', number:'+27820000000', message:'Hi Glow, I would like to book an appointment.' },
  theme:{ primaryColor:'#be185d', secondaryColor:'#9d174d', accentColor:'#f59e0b', fontHeading:'Playfair Display', fontBody:'DM Sans', borderRadius:'large', style:'light' },
  pages:[
    { id:'sp-home', name:'Home', slug:'/', sections:[
      { id:'sp1', type:'hero', data:{ headline:'Your good-hair day starts here', subtext:'Premium hair, nails, and skin care in the heart of Rosebank. Walk-in welcome, online bookings preferred.', ctaText:'Book Now', ctaUrl:'#contact', ctaText2:'See Services', image:u('photo-1560066984-138dadb4c035'), showStats:false } },
      { id:'sp2', type:'services', data:{ heading:'Treatments & services', subheading:'Real talent, real time, no upselling.', items:[
        { icon:'scissors', title:'Hair', desc:'Cut, colour, balayage, treatments. Senior stylists with international training.' },
        { icon:'sparkles', title:'Nails', desc:'Gel, acrylics, BIAB, manicures. Hygienic kits per client, every time.' },
        { icon:'sparkles', title:'Skin & facials', desc:'Hydrafacial, chemical peels, microneedling. Consultations are always free.' },
        { icon:'scissors', title:'Brows & lashes', desc:'Lash extensions, lifts, brow lamination, threading. Subtle, never overdone.' },
        { icon:'heart', title:'Massage & spa', desc:'30 / 60 / 90 min Swedish, deep tissue, hot stone. Private rooms.' },
        { icon:'gift', title:'Bridal packages', desc:'Trial included. We come to you, or you come to us. Group rates available.' },
      ] } },
      { id:'sp3', type:'gallery', data:{ heading:'Recent work', subheading:'A peek at what walks out of our doors.', images:[
        { url:u('photo-1560066984-138dadb4c035'), alt:'Salon interior', caption:'The studio' },
        { url:u('photo-1487412720507-e7ab37603c6f'), alt:'Makeup work', caption:'Bridal makeup' },
        { url:u('photo-1610992015732-2449b76344bc'), alt:'Nail art', caption:'Nail design' },
        { url:u('photo-1522337360788-8b13dee7a37e'), alt:'Stylist at work', caption:'In the chair' },
        { url:u('photo-1512678080530-7760d81faba6'), alt:'Spa towels', caption:'Spa room' },
        { url:u('photo-1542744094-3a31f272c490'), alt:'Salon detail', caption:'Detail' },
      ]}},
      { id:'sp4', type:'team', data:{ heading:'Meet your stylists', members:[
        { name:'Lerato Mokoena', role:'Senior stylist, owner', bio:'12 years. Trained in Paris. Specialist in textured and natural hair.', image:av('Lerato Mokoena','be185d') },
        { name:'Aisha Bhamjee', role:'Lead colourist', bio:'Balayage and corrective colour. Olaplex master.', image:av('Aisha Bhamjee','9d174d') },
        { name:'Sarah Botha', role:'Aesthetician', bio:'Skincare and brow expert. CIDESCO-qualified.', image:av('Sarah Botha','f59e0b') },
      ]}},
      { id:'sp5', type:'testimonials', data:{ heading:'Loved by our clients', items:[
        { name:'Thandi Naidoo', role:'', quote:'Lerato understands hair like no one else in Joburg. I drive an hour for her.', avatar:av('Thandi Naidoo','be185d') },
        { name:'Anika Reddy', role:'', quote:'Got my wedding hair and makeup done here. Held all day in 35°C heat. Magic.', avatar:av('Anika Reddy','9d174d') },
        { name:'Karabo Ndlovu', role:'', quote:'The vibe in the salon is genuine. No upselling, no judging. I bring my mom and my daughter.', avatar:av('Karabo Ndlovu','f59e0b') },
      ]}},
      { id:'sp6', type:'cta', data:{ heading:'Ready for a new look?', subtext:'Book online in under a minute, or WhatsApp us a hair pic and we will recommend the right service.', ctaText:'Book Online', ctaUrl:'#contact', ctaText2:'WhatsApp Us' } },
    ]},
    { id:'sp-contact', name:'Contact', slug:'/contact', sections:[
      { id:'sp7', type:'contact', data:{ heading:'Find us & book', subtext:'Walk-ins welcome. Online bookings get priority.', phone:'+27 82 000 0000', email:'hello@glowstudio.co.za', address:'Rosebank, Johannesburg', hours:'Tue–Fri 9am–7pm · Sat 8am–5pm · Sun by appointment', formKey:'' } },
      { id:'sp8', type:'whatsapp', data:{ heading:'Fastest: WhatsApp', subtext:'Send a hair pic, we will recommend the right service and quote.', number:'+27820000000', message:'Hi Glow, I would like to book...', buttonText:'Open WhatsApp' } },
      { id:'sp9', type:'maps', data:{ heading:'Visit us', subtext:'', address:'Rosebank, Johannesburg', embedUrl:'' } },
    ]},
    { id:'sp-priv', name:'Privacy', slug:'/privacy', sections:[
      { id:'sp10', type:'policy', data:{ heading:'Privacy Policy', autoGenerate:true, customBody:'' } },
    ]},
  ]
})

// ── Attorney template ─────────────────────────────────────────
const attorney = (): SiteData => ({
  id:'tpl-attorney', name:'Mahlangu & Associates', tagline:'Pragmatic legal advice, plainly explained',
  logo:'', country:'ZA',
  widget:{ enabled:true, channel:'whatsapp', number:'+27110000000', message:'Hello, I would like to book a consultation.' },
  theme:{ primaryColor:'#1e293b', secondaryColor:'#0f172a', accentColor:'#a16207', fontHeading:'Playfair Display', fontBody:'Inter', borderRadius:'small', style:'light' },
  pages:[
    { id:'lp-home', name:'Home', slug:'/', sections:[
      { id:'lp1', type:'hero', data:{ headline:'Legal advice you understand. Outcomes you can plan around.', subtext:'A boutique Johannesburg firm helping individuals, families, and small businesses with the legal moments that matter — clearly priced, plainly written.', ctaText:'Book a Consultation', ctaUrl:'#contact', ctaText2:'See Practice Areas', image:u('photo-1486406146926-c627a92ad1ab'), showStats:false } },
      { id:'lp2', type:'services', data:{ heading:'Practice areas', subheading:'Focused on the work where good advice actually changes outcomes.', items:[
        { icon:'home', title:'Property & conveyancing', desc:'Bond registration, transfer, sectional title, lease drafting. Fixed fees on standard transactions.' },
        { icon:'briefcase', title:'Wills & deceased estates', desc:'Will drafting, executor services, estate planning. Get your affairs in order without the law-firm vibes.' },
        { icon:'briefcase', title:'Commercial & contracts', desc:'Shareholder agreements, sale-of-business, supplier contracts. Clear language, real protection.' },
        { icon:'scale', title:'Civil litigation', desc:'Debt recovery, breach of contract, evictions. Strategic, cost-aware approach.' },
        { icon:'users', title:'Family law', desc:'Divorce, antenuptial contracts, parenting plans, maintenance. Sensitive matters handled sensitively.' },
        { icon:'briefcase', title:'Labour & employment', desc:'CCMA representation, contracts of employment, retrenchment processes. Both employer and employee work.' },
      ] } },
      { id:'lp3', type:'features', data:{ heading:'Why clients choose us', subheading:'A practice built on relationships, not billable-hour clocks.', items:[
        { icon:'clock', title:'Fixed fees where possible', desc:'You know what you are paying before we start. No nasty bills at month-end.' },
        { icon:'phone', title:'We pick up the phone', desc:'Direct line to your attorney. Replies within 4 hours, every working day.' },
        { icon:'map-pin', title:'Truly local', desc:'25+ years on the ground in Gauteng. We know the courts, the conveyancers, and the deeds office.' },
        { icon:'message', title:'No-jargon advice', desc:'Plain English. Real options. Honest assessments — even when it costs us the brief.' },
      ] } },
      { id:'lp4', type:'testimonials', data:{ heading:'What clients say', items:[
        { name:'Tebogo Sithole', role:'Property buyer, Pretoria', quote:'They walked me through the bond and transfer in plain English. No anxiety, no surprise costs.', avatar:av('Tebogo Sithole','1e293b') },
        { name:'Sarah Coetzee', role:'SME owner, Sandton', quote:'Drafted our shareholder agreement in a week. When my partner exited, we had a clear path. They saved us a fight.', avatar:av('Sarah Coetzee','0f172a') },
        { name:'Daniel Mokoena', role:'Family law client', quote:'Difficult divorce, handled with empathy. They kept costs down and protected what mattered.', avatar:av('Daniel Mokoena','a16207') },
      ] } },
      { id:'lp5', type:'cta', data:{ heading:'Need legal advice?', subtext:'Book a 30-minute consultation — fixed fee, no obligation. We will tell you straight if you need us, or if you do not.', ctaText:'Book Consultation', ctaUrl:'#contact', ctaText2:'Practice Areas' } },
    ]},
    { id:'lp-contact', name:'Contact', slug:'/contact', sections:[
      { id:'lp6', type:'contact', data:{ heading:'Get in touch', subtext:'Most matters can be assessed in a 30-minute call. Book a slot below.', phone:'+27 11 000 0000', email:'reception@mahlangulaw.co.za', address:'Sandton, Johannesburg', hours:'Monday – Friday, 8:00am – 5:00pm', formKey:'' } },
      { id:'lp7', type:'banking', data:{ heading:'Trust account details', subtext:'For deposits and trust transfers only. Use your matter reference.', accountName:'Mahlangu & Associates Trust', bank:'Standard Bank', accountNumber:'00 000 0000', branchCode:'051001', reference:'Use your matter reference (provided by your attorney).', extra:'' } },
    ]},
    { id:'lp-priv', name:'Privacy', slug:'/privacy', sections:[
      { id:'lp8', type:'policy', data:{ heading:'Privacy Policy', autoGenerate:true, customBody:'' } },
    ]},
  ]
})

// ── Lodge / Guesthouse template ───────────────────────────────
const lodge = (): SiteData => ({
  id:'tpl-lodge', name:'Acacia Lodge', tagline:'Quiet luxury at the edge of the bushveld',
  logo:'', country:'ZA',
  widget:{ enabled:true, channel:'whatsapp', number:'+27130000000', message:'Hi Acacia, I would like to enquire about a stay.' },
  theme:{ primaryColor:'#854d0e', secondaryColor:'#365314', accentColor:'#ea580c', fontHeading:'Merriweather', fontBody:'Inter', borderRadius:'medium', style:'light' },
  pages:[
    { id:'lo-home', name:'Home', slug:'/', sections:[
      { id:'lo1', type:'hero', data:{ headline:'Where the city ends and the wild begins', subtext:'A 10-suite owner-run lodge on the Waterberg escarpment. 90 minutes from Joburg. All meals included. Game drives on request.', ctaText:'Check Availability', ctaUrl:'#contact', ctaText2:'See Suites', image:u('photo-1564013799919-ab600027ffc6'), showStats:true, stat1val:'10', stat1label:'Suites', stat2val:'500ha', stat2label:'Reserve', stat3val:'4★', stat3label:'TripAdvisor', stat4val:'B&B', stat4label:'Rated' } },
      { id:'lo2', type:'gallery', data:{ heading:'Inside Acacia', subheading:'Suites, kitchen, deck, pool — all in one frame.', images:[
        { url:u('photo-1564013799919-ab600027ffc6'), alt:'Lodge exterior', caption:'Main lodge' },
        { url:u('photo-1580587771525-78b9dba3b914'), alt:'Suite interior', caption:'King suite' },
        { url:u('photo-1568605114967-8130f3a36994'), alt:'View', caption:'Sunset deck' },
        { url:u('photo-1502672260266-1c1ef2d93688'), alt:'Pool', caption:'Pool & boma' },
        { url:u('photo-1414235077428-338989a2e8c0'), alt:'Dining', caption:'Dining' },
        { url:u('photo-1517248135467-4c7edcad34c4'), alt:'Coffee', caption:'Sunrise coffee' },
      ] } },
      { id:'lo3', type:'pricing', data:{ heading:'Rates', subheading:'Per suite, per night, including all meals and house drinks.', taxIncluded:true, items:[
        { name:'Garden suite', price:'R3,200', period:'/night', features:['Queen bed','Garden views','En-suite shower','All meals included','House wine, beer, soft drinks'], cta:'Book Now', highlighted:false },
        { name:'King suite', price:'R4,500', period:'/night', features:['King bed','Bushveld views','En-suite bath & shower','Private deck','All meals included','House wine, beer, soft drinks'], cta:'Book Now', highlighted:true },
        { name:'Family suite', price:'R5,800', period:'/night', features:['1 king + 2 single beds','Sleeps 4','Lounge area','Plunge pool','All meals included','House wine, beer, soft drinks'], cta:'Book Now', highlighted:false },
      ] } },
      { id:'lo4', type:'features', data:{ heading:'What is included', subheading:'No surprise add-ons.', items:[
        { icon:'gift', title:'Three meals a day', desc:'Breakfast, lunch, three-course dinner. Local produce, simple, brilliant.' },
        { icon:'sparkles', title:'House drinks', desc:'House wines, beers, soft drinks all day. Premium spirits priced separately.' },
        { icon:'leaf', title:'Game drives', desc:'Optional 3-hour drives in the reserve. R650 per person. Bookable on arrival.' },
        { icon:'car', title:'Airport transfers', desc:'Round-trip from O.R. Tambo. R1,800 per vehicle. Pre-book.' },
      ] } },
      { id:'lo5', type:'testimonials', data:{ heading:'Reviewed by our guests', items:[
        { name:'Sarah Hopkins', role:'TripAdvisor 5★', quote:'Two days here was worth a week anywhere else. The food, the silence, the stars.', avatar:av('Sarah Hopkins','854d0e') },
        { name:'Stefan & Aneta', role:'TripAdvisor 5★', quote:'Drove up from Johannesburg on a whim. Now we are coming back every long weekend.', avatar:av('Stefan Aneta','365314') },
        { name:'Mpho Sibanyoni', role:'TripAdvisor 5★', quote:'The kindness of the team made this. I have never felt more looked after on holiday in SA.', avatar:av('Mpho Sibanyoni','ea580c') },
      ] } },
      { id:'lo6', type:'cta', data:{ heading:'A long weekend you will remember', subtext:'Check our calendar and message us — we hold suites for 24 hours while you decide.', ctaText:'Check Availability', ctaUrl:'#contact', ctaText2:'WhatsApp Us' } },
    ]},
    { id:'lo-contact', name:'Contact', slug:'/contact', sections:[
      { id:'lo7', type:'contact', data:{ heading:'Book your stay', subtext:'Phone, email, or WhatsApp — whichever is easiest.', phone:'+27 13 000 0000', email:'reservations@acacialodge.co.za', address:'Waterberg, Limpopo', hours:'Reception: 7:00 – 22:00 daily', formKey:'' } },
      { id:'lo8', type:'whatsapp', data:{ heading:'Direct booking via WhatsApp', subtext:'Tell us your dates and how many guests — we will hold suites for 24 hours.', number:'+27130000000', message:'Hi Acacia, I would like to book for [date] for [number] guests.', buttonText:'Open WhatsApp' } },
      { id:'lo9', type:'maps', data:{ heading:'How to find us', subtext:'90 minutes north of Joburg, off the N1.', address:'Waterberg, Limpopo, South Africa', embedUrl:'' } },
    ]},
    { id:'lo-priv', name:'Privacy', slug:'/privacy', sections:[
      { id:'lo10', type:'policy', data:{ heading:'Privacy Policy', autoGenerate:true, customBody:'' } },
    ]},
  ]
})

// ── Restaurant template ───────────────────────────────────────
const restaurant = (): SiteData => ({
  id:'tpl-restaurant', name:'Maboneng Grill', tagline:'Authentic SA flame-grilled, in the heart of Joburg',
  logo:'', country:'ZA',
  widget:{ enabled:true, channel:'whatsapp', number:'+27110000000', message:'Hi Maboneng, I would like to make a reservation.' },
  theme:{ primaryColor:'#dc2626', secondaryColor:'#0a0a0a', accentColor:'#f59e0b', fontHeading:'Playfair Display', fontBody:'Inter', borderRadius:'small', style:'dark' },
  pages:[
    { id:'r-home', name:'Home', slug:'/', sections:[
      { id:'r1', type:'hero', data:{ headline:'Real fire. Real food. Real Joburg.', subtext:'A South African tshisanyama meets steakhouse in the heart of Maboneng. Open fires, local cuts, craft beer, and the kind of evening you will tell stories about.', ctaText:'Book a Table', ctaUrl:'#contact', ctaText2:'See the Menu', image:u('photo-1414235077428-338989a2e8c0'), showStats:false } },
      { id:'r2', type:'services', data:{ heading:'On the menu', subheading:'Locally sourced. Hand-cut. Fire-finished.', items:[
        { icon:'gift', title:'Steaks & ribs', desc:'Karan Beef sirloin, T-bone, prime rib. 350g, 500g, or share. Served on cast-iron.' },
        { icon:'leaf', title:'Tshisanyama', desc:'Boerewors, lamb chops, beef short rib, pap and chakalaka. Big plate, small price.' },
        { icon:'sparkles', title:'Sides & salads', desc:'Hand-cut chips, grilled mielie, roast butternut, beetroot salad, garden greens.' },
        { icon:'heart', title:'Vegetarian & vegan', desc:'Halloumi flame-grill, mushroom potjie, vegetable pap-bake. Real food, no afterthought.' },
        { icon:'star', title:'Sundowner cocktails', desc:'Smoked old fashioned, Amarula espresso martini, local craft gins. Happy hour 4–6pm Tue-Fri.' },
        { icon:'home', title:'Sunday lunch', desc:'Slow-roasted beef, chicken, lamb. Three meats, six sides, pudding. R295 per person, kids half price.' },
      ] } },
      { id:'r3', type:'gallery', data:{ heading:'Inside Maboneng', subheading:'The fire. The food. The vibe.', images:[
        { url:u('photo-1414235077428-338989a2e8c0'), alt:'Restaurant interior', caption:'The dining room' },
        { url:u('photo-1504674900247-0877df9cc836'), alt:'Steak dish', caption:'500g sirloin' },
        { url:u('photo-1565299624946-b28f40a0ae38'), alt:'Wood-fired oven', caption:'Wood-fired oven' },
        { url:u('photo-1517248135467-4c7edcad34c4'), alt:'Coffee morning', caption:'Sunday brunch' },
        { url:u('photo-1546069901-ba9599a7e63c'), alt:'Salad bowl', caption:'Garden bowl' },
        { url:u('photo-1551218808-94e220e084d2'), alt:'Plated dish', caption:'Chef special' },
      ]}},
      { id:'r4', type:'testimonials', data:{ heading:'What our guests say', items:[
        { name:'Karabo Mthembu', role:'Eat Out, 4★ review', quote:'Worth driving across town for. The fire-grill ribs are a religious experience.', avatar:av('Karabo Mthembu','dc2626') },
        { name:'Linda Joubert', role:'TripAdvisor', quote:'I have eaten at every steakhouse in Joburg. This is the best, and not even close.', avatar:av('Linda Joubert','0a0a0a') },
        { name:'Sipho Khumalo', role:'Regular for 3 years', quote:'I take every visiting client here. Nobody has ever been disappointed.', avatar:av('Sipho Khumalo','f59e0b') },
      ]}},
      { id:'r5', type:'cta', data:{ heading:'Book your table', subtext:'Friday and Saturday book out a week ahead. Plan now.', ctaText:'Reserve Now', ctaUrl:'#contact', ctaText2:'WhatsApp Us' } },
    ]},
    { id:'r-contact', name:'Contact', slug:'/contact', sections:[
      { id:'r6', type:'contact', data:{ heading:'Visit us', subtext:'Open Tuesday – Sunday. Closed Mondays.', phone:'+27 11 000 0000', email:'reservations@maboneng.co.za', address:'Maboneng Precinct, 286 Fox Street, Johannesburg', hours:'Tue-Thu 17:00–22:30 · Fri-Sat 12:00–23:00 · Sun 11:00–21:00', formKey:'' } },
      { id:'r7', type:'whatsapp', data:{ heading:'Reserve via WhatsApp', subtext:'Send dates, time, party size. We confirm in minutes.', number:'+27110000000', message:'Hi Maboneng, table for [#] on [date] at [time].', buttonText:'Open WhatsApp' } },
      { id:'r8', type:'maps', data:{ heading:'Find us', subtext:'5 min walk from Carlton Centre.', address:'Maboneng Precinct, 286 Fox Street, Johannesburg', embedUrl:'' } },
    ]},
    { id:'r-priv', name:'Privacy', slug:'/privacy', sections:[
      { id:'r9', type:'policy', data:{ heading:'Privacy Policy', autoGenerate:true, customBody:'' } },
    ]},
  ]
})

// ── Dentist template ──────────────────────────────────────────
const dentist = (): SiteData => ({
  id:'tpl-dentist', name:'Bright Smile Dental', tagline:'Honest, painless dentistry in Sandton',
  logo:'', country:'ZA',
  widget:{ enabled:true, channel:'whatsapp', number:'+27110000000', message:'Hi Bright Smile, I would like to book an appointment.' },
  theme:{ primaryColor:'#0891b2', secondaryColor:'#0e7490', accentColor:'#06b6d4', fontHeading:'Inter', fontBody:'Inter', borderRadius:'medium', style:'light' },
  pages:[
    { id:'d-home', name:'Home', slug:'/', sections:[
      { id:'d1', type:'hero', data:{ headline:'Dentistry without the dread', subtext:'A modern Sandton practice run by Dr Naidoo and Dr Mokoena. Pain-free, well-priced, no upselling. Medical-aid friendly.', ctaText:'Book Online', ctaUrl:'#contact', ctaText2:'Our Services', image:u('photo-1606811971618-4486d14f3f99'), showStats:true, stat1val:'8,000+', stat1label:'Patients', stat2val:'4.9★', stat2label:'Google reviews', stat3val:'12yr', stat3label:'In practice', stat4val:'<7d', stat4label:'New patient wait' } },
      { id:'d2', type:'services', data:{ heading:'Treatments we offer', subheading:'General, cosmetic, and emergency dentistry under one roof.', items:[
        { icon:'check-circle', title:'Check-up & cleaning', desc:'Comprehensive 45-min appointment with hygienist scale & polish included.' },
        { icon:'sparkles', title:'Whitening', desc:'In-chair Zoom whitening (90 min). Take-home kits also available.' },
        { icon:'shield', title:'Fillings & restorations', desc:'White composite fillings, crowns, bridges, inlays. Same-day on most.' },
        { icon:'smile', title:'Aligners', desc:'Invisalign Full and Lite — clear, removable, predictable.' },
        { icon:'heart', title:'Gum health & periodontics', desc:'Deep clean, gum disease treatment, pocket reduction.' },
        { icon:'clock', title:'Emergency same-day', desc:'Toothache, broken tooth, lost crown — call us, we keep slots open every day.' },
      ] } },
      { id:'d3', type:'about', data:{ heading:'A practice built on trust', subheading:'No surprise bills. No upselling.', body:'Dr Priya Naidoo and Dr Andile Mokoena founded Bright Smile because they got tired of seeing patients leave dental visits angry. Every quote is itemised. Every option is explained. You always know what you are paying for, and why.', body2:'We work with all major medical aids — Discovery, Bonitas, Momentum, Bestmed — and submit claims directly. No paperwork stress for you.', image:u('photo-1576091160550-2173dba999ef'), ctaText:'Meet the team' } },
      { id:'d4', type:'team', data:{ heading:'Your dental team', members:[
        { name:'Dr Priya Naidoo', role:'Founder, BDS (Wits)', bio:'12 years in private practice. Special interest in cosmetic and Invisalign.', image:av('Priya Naidoo','0891b2') },
        { name:'Dr Andile Mokoena', role:'Founder, BDS (UWC)', bio:'Specialist interest in restorative and emergency dentistry.', image:av('Andile Mokoena','0e7490') },
        { name:'Sister Lerato', role:'Hygienist & oral health therapist', bio:'15 years cleaning teeth and teaching kids to brush properly.', image:av('Lerato S','06b6d4') },
      ]}},
      { id:'d5', type:'pricing', data:{ heading:'Transparent pricing', subheading:'Cash rates. Medical aid claims submitted directly.', taxIncluded:true, items:[
        { name:'Consult & check-up', price:'R650', period:'', features:['45-min appointment','X-rays included','Treatment plan written','Hygienist scale & polish'], cta:'Book Now', highlighted:false },
        { name:'Whitening (Zoom)', price:'R3,200', period:'', features:['In-chair 90-min','Take-home top-up trays','Sensitivity protection','Up to 8 shades whiter'], cta:'Book Now', highlighted:true },
        { name:'Invisalign Full', price:'From R32,500', period:'', features:['Full digital scan','All aligners included','Refinement tray','12-month plan'], cta:'Get a Quote', highlighted:false },
      ] } },
      { id:'d6', type:'faq', data:{ heading:'Common questions', items:[
        { q:'Do you accept my medical aid?', a:'We work with all major SA medical aids and submit claims for you. Cash rates are also available and clearly shown above.' },
        { q:'How long is the wait for a new patient?', a:'Usually under 7 days for routine appointments. Emergencies are seen same-day, every day.' },
        { q:'Are kids welcome?', a:'Yes — we have child-friendly chairs and time slots. First check-up under 12 is free with a parent appointment.' },
        { q:'What does an emergency cost?', a:'Standard emergency consult R750 cash, plus any treatment. We always quote before doing anything.' },
      ]}},
      { id:'d7', type:'cta', data:{ heading:'Book your visit', subtext:'Same-week appointments. Easy parking. No upselling, ever.', ctaText:'Book Online', ctaUrl:'#contact', ctaText2:'Call Us' } },
    ]},
    { id:'d-contact', name:'Contact', slug:'/contact', sections:[
      { id:'d8', type:'contact', data:{ heading:'Make an appointment', subtext:'Online booking is fastest. Or phone us during practice hours.', phone:'+27 11 000 0000', email:'hello@brightsmile.co.za', address:'Sandton Square, Johannesburg', hours:'Mon-Fri 7:30 – 18:00 · Sat 8:00 – 13:00', formKey:'' } },
      { id:'d9', type:'maps', data:{ heading:'Find us', subtext:'Underground parking validated.', address:'Sandton, Johannesburg', embedUrl:'' } },
    ]},
    { id:'d-priv', name:'Privacy', slug:'/privacy', sections:[
      { id:'d10', type:'policy', data:{ heading:'Privacy Policy', autoGenerate:true, customBody:'' } },
    ]},
  ]
})

// ── Gym / Personal Trainer template ───────────────────────────
const gym = (): SiteData => ({
  id:'tpl-gym', name:'Iron + Oak Strength', tagline:'Get strong. Live longer. Joburg.',
  logo:'', country:'ZA',
  widget:{ enabled:true, channel:'whatsapp', number:'+27110000000', message:'Hi Iron + Oak, I want to start training.' },
  theme:{ primaryColor:'#ef4444', secondaryColor:'#0a0a0a', accentColor:'#fbbf24', fontHeading:'Poppins', fontBody:'Inter', borderRadius:'small', style:'dark' },
  pages:[
    { id:'g-home', name:'Home', slug:'/', sections:[
      { id:'g1', type:'hero', data:{ headline:'Train like you mean it.', subtext:'A real strength gym in Rosebank. Not a treadmill farm. Coached barbell programs, small group classes, and serious accountability.', ctaText:'Start a Free Trial', ctaUrl:'#contact', ctaText2:'See Programs', image:u('photo-1534438327276-14e5300c3a48'), showStats:true, stat1val:'180+', stat1label:'Members', stat2val:'92%', stat2label:'12-month retention', stat3val:'6:1', stat3label:'Coach to client', stat4val:'7d', stat4label:'Week-long trial' } },
      { id:'g2', type:'services', data:{ heading:'Programs', subheading:'Three doors in. All of them coached.', variant:'bento', items:[
        { icon:'bolt', title:'Strength foundations', desc:'12-week barbell beginner program. Squat, bench, deadlift, press. Coached every session.' },
        { icon:'rocket', title:'Hybrid performance', desc:'Strength + conditioning for athletes and ex-athletes. Run faster, lift heavier, recover smarter.' },
        { icon:'heart', title:'Strong + healthy 40+', desc:'Joint-friendly strength training designed for adults over 40. Build muscle, build bone, stay sharp.' },
      ] } },
      { id:'g3', type:'features', data:{ heading:'What you get', subheading:'Real coaching, no chains, no contracts.', items:[
        { icon:'users', title:'Real coaches', desc:'Every session has a qualified coach in the room. No "personal trainers" trying to sell you supplements.' },
        { icon:'target', title:'Honest programming', desc:'Written programs you actually follow. We measure progress, not vanity.' },
        { icon:'clock', title:'Open 5am – 8pm', desc:'Train before work, after work, on lunch. Members get 24/7 app access for self-led sessions.' },
        { icon:'thumbs-up', title:'No annual contract', desc:'Month-to-month. Cancel anytime. We earn your subscription every month.' },
      ] } },
      { id:'g4', type:'pricing', data:{ heading:'Membership', subheading:'No joining fee. No contract. Cancel anytime.', variant:'comparison', taxIncluded:true, items:[
        { name:'Foundations', price:'R1,290', period:'/month', features:['3 coached classes/week','App-based programming','Form check via video','Free re-testing every 8 weeks'], cta:'Start Free Trial', highlighted:false },
        { name:'Unlimited', price:'R1,790', period:'/month', features:['Unlimited coached classes','Open gym access 5am-8pm','Custom programming','Nutrition consult quarterly','Body comp scan monthly'], cta:'Start Free Trial', highlighted:true },
        { name:'Personal coaching', price:'R3,490', period:'/month', features:['8 1-on-1 PT sessions','Custom written program','Weekly check-ins','Nutrition + sleep coaching','Includes Unlimited membership'], cta:'Talk to a Coach', highlighted:false },
      ] } },
      { id:'g5', type:'testimonials', data:{ heading:'Member results', variant:'marquee', items:[
        { name:'Tebogo M.', role:'Member 2 years', quote:'Squat went from 60kg to 140kg. I sleep better. I lost 14kg. The coaching changed my life.', avatar:av('Tebogo M','ef4444') },
        { name:'Sarah K.', role:'Member 1 year', quote:'I am 47. I was nervous about a strength gym. After two months I was deadlifting more than my husband.', avatar:av('Sarah K','0a0a0a') },
        { name:'Bongani D.', role:'Member 18 months', quote:'I have been to every gym in Joburg. This is the only one where coaches actually coach. Worth every cent.', avatar:av('Bongani D','fbbf24') },
      ]}},
      { id:'g6', type:'cta', data:{ heading:'Free trial week. Decide after.', subtext:'No card needed. No sales pitch. One week of full access. If it is for you, you will know.', ctaText:'Book Trial', ctaUrl:'#contact', ctaText2:'WhatsApp Us' } },
    ]},
    { id:'g-contact', name:'Contact', slug:'/contact', sections:[
      { id:'g7', type:'contact', data:{ heading:'Visit us', subtext:'Walk in for a tour any open hour. No appointment needed.', phone:'+27 11 000 0000', email:'hello@ironandoak.co.za', address:'Rosebank, Johannesburg', hours:'Mon-Fri 5:00 – 20:00 · Sat 7:00 – 13:00 · Sun by appointment', formKey:'' } },
      { id:'g8', type:'whatsapp', data:{ heading:'Faster on WhatsApp', subtext:'Tell us your goal — we will recommend a program in plain English.', number:'+27110000000', message:'Hi Iron + Oak, my goal is...', buttonText:'Open WhatsApp' } },
      { id:'g9', type:'maps', data:{ heading:'Find us', subtext:'2 min from the Gautrain.', address:'Rosebank, Johannesburg', embedUrl:'' } },
    ]},
    { id:'g-priv', name:'Privacy', slug:'/privacy', sections:[
      { id:'g10', type:'policy', data:{ heading:'Privacy Policy', autoGenerate:true, customBody:'' } },
    ]},
  ]
})

// ── Mechanic template ─────────────────────────────────────────
const mechanic = (): SiteData => ({
  id:'tpl-mechanic', name:'Reliable Auto Workshop', tagline:'Honest mechanics. Fair prices. Same-day on most jobs.',
  logo:'', country:'ZA',
  widget:{ enabled:true, channel:'whatsapp', number:'+27110000000', message:'Hi Reliable Auto, I need a quote for...' },
  theme:{ primaryColor:'#0a0a0a', secondaryColor:'#404040', accentColor:'#facc15', fontHeading:'Montserrat', fontBody:'Inter', borderRadius:'small', style:'light' },
  pages:[
    { id:'m-home', name:'Home', slug:'/', sections:[
      { id:'m1', type:'hero', data:{ headline:'Honest mechanics. Same-day. Joburg North.', subtext:'A family-run workshop in Bryanston that has been keeping cars on the road since 2009. RMI accredited. All major insurance approved. We tell you what is wrong and what is not.', ctaText:'Get a Quote', ctaUrl:'#contact', ctaText2:'Our Services', image:u('photo-1632823469850-2f77dd9c7f93'), showStats:true, stat1val:'14yr', stat1label:'In business', stat2val:'12k+', stat2label:'Cars serviced', stat3val:'4.8★', stat3label:'Google reviews', stat4val:'RMI', stat4label:'Accredited' } },
      { id:'m2', type:'services', data:{ heading:'What we do', subheading:'Petrol, diesel, hybrid. Most makes. RMI standards.', items:[
        { icon:'wrench', title:'Major & minor service', desc:'Oil, filter, brakes, suspension check, electronics scan, road test. From R1,890.' },
        { icon:'shield', title:'Brakes & suspension', desc:'Pads, discs, calipers, shocks, struts. Honest assessment — we will not sell you parts you do not need.' },
        { icon:'bolt', title:'Diagnostics & electrical', desc:'Live scan, fault tracing, immobiliser, battery, alternator. R450 diagnostic, free if you book the repair.' },
        { icon:'truck', title:'Tyres & wheel alignment', desc:'4-wheel computer alignment, balancing, tyre fitment from major brands.' },
        { icon:'cpu', title:'Pre-purchase inspection', desc:'Buying a used car? We do a 60-point inspection and tell you what it is really worth. R890.' },
        { icon:'check-circle', title:'Roadworthy & insurance', desc:'Roadworthy certificate same day. We work with Outsurance, Discovery, Old Mutual, Santam, Hollard.' },
      ] } },
      { id:'m3', type:'features', data:{ heading:'Why choose us', subheading:'Old-school workshop ethics with modern equipment.', items:[
        { icon:'star', title:'RMI accredited', desc:'Retail Motor Industry standards. Independently inspected. You are protected.' },
        { icon:'thumbs-up', title:'No upsell, ever', desc:'We give you a written quote. We only do the work you approve. We show you the old parts.' },
        { icon:'clock', title:'Same-day on most', desc:'Service, brakes, diagnostics — usually back to you before 4pm if dropped before 9am.' },
        { icon:'briefcase', title:'Insurance approved', desc:'Direct claim submission. We handle the paperwork while you handle your life.' },
      ] } },
      { id:'m4', type:'pricing', data:{ heading:'What things cost', subheading:'Indicative cash prices. Quote before any work starts.', taxIncluded:true, items:[
        { name:'Major service', price:'From R3,290', period:'', features:['Oil + filter','All filters (air, fuel, cabin)','Spark plugs (petrol)','60-point inspection','Brake check','Free diagnostic scan'], cta:'Get a Quote', highlighted:false },
        { name:'Minor service', price:'From R1,890', period:'', features:['Oil + oil filter','Top-up all fluids','Tyre & brake check','Diagnostic scan','Free road test'], cta:'Get a Quote', highlighted:true },
        { name:'Diagnostic', price:'R450', period:'', features:['Live OBD scan','Fault code reading','Written report','Free if repair booked'], cta:'Book Slot', highlighted:false },
      ] } },
      { id:'m5', type:'cta', data:{ heading:'Drop the car. Get on with your day.', subtext:'WhatsApp us your reg & what is wrong. We will quote before lunch.', ctaText:'WhatsApp a Quote', ctaUrl:'#contact', ctaText2:'Call Us' } },
    ]},
    { id:'m-contact', name:'Contact', slug:'/contact', sections:[
      { id:'m6', type:'contact', data:{ heading:'Find us', subtext:'Drive in for a quote any working day. No appointment needed for diagnostics.', phone:'+27 11 000 0000', email:'service@reliableauto.co.za', address:'Bryanston, Johannesburg', hours:'Mon-Fri 7:30 – 17:30 · Sat 8:00 – 12:30', formKey:'' } },
      { id:'m7', type:'whatsapp', data:{ heading:'WhatsApp a quote', subtext:'Send make, model, year, and what is happening. We reply with a price.', number:'+27110000000', message:'Hi Reliable Auto, my car is a [year] [make] [model] and the problem is...', buttonText:'Open WhatsApp' } },
      { id:'m8', type:'banking', data:{ heading:'EFT details', subtext:'For invoice payment. Use your invoice number as reference.', accountName:'Reliable Auto Workshop CC', bank:'FNB', accountNumber:'62000000000', branchCode:'250655', reference:'Use your invoice number', extra:'' } },
    ]},
    { id:'m-priv', name:'Privacy', slug:'/privacy', sections:[
      { id:'m9', type:'policy', data:{ heading:'Privacy Policy', autoGenerate:true, customBody:'' } },
    ]},
  ]
})

export const TEMPLATES: SiteTemplate[] = [
  { id:'safetrak',  name:'SafeTrak',           category:'SaaS',         description:'GPS fleet tracking SaaS — your demo site',                emoji:'📍', preview:u('photo-1551434678-e076c223a692'), build: safetrak },
  { id:'plumber',   name:'Apex Plumbing',      category:'Trades',       description:'24/7 emergency plumber — pricing, services, contact',     emoji:'🚿', preview:u('photo-1581578731548-c64695cc6952'), build: plumber },
  { id:'salon',     name:'Glow Beauty Studio', category:'Beauty',       description:'Hair, nails, skin — gallery, team, testimonials',         emoji:'💄', preview:u('photo-1560066984-138dadb4c035'), build: salon },
  { id:'attorney',  name:'Mahlangu & Associates', category:'Professional', description:'Boutique law firm — practice areas, fixed-fee pricing',  emoji:'⚖', preview:u('photo-1486406146926-c627a92ad1ab'), build: attorney },
  { id:'lodge',     name:'Acacia Lodge',       category:'Hospitality',  description:'Bushveld lodge — gallery, rates, contact',                 emoji:'🏞', preview:u('photo-1564013799919-ab600027ffc6'), build: lodge },
  { id:'restaurant',name:'Maboneng Grill',     category:'Hospitality',  description:'Tshisanyama / steakhouse — menu, reservations, gallery',   emoji:'🍽', preview:u('photo-1414235077428-338989a2e8c0'), build: restaurant },
  { id:'dentist',   name:'Bright Smile Dental',category:'Health',       description:'Modern dental practice — services, team, pricing',         emoji:'🦷', preview:u('photo-1606811971618-4486d14f3f99'), build: dentist },
  { id:'gym',       name:'Iron + Oak Strength',category:'Fitness',      description:'Strength gym + PT studio — programs, membership',          emoji:'💪', preview:u('photo-1534438327276-14e5300c3a48'), build: gym },
  { id:'mechanic',  name:'Reliable Auto Workshop',category:'Trades',     description:'RMI-accredited mechanic — services, pricing, EFT',         emoji:'🔧', preview:u('photo-1632823469850-2f77dd9c7f93'), build: mechanic },
]
