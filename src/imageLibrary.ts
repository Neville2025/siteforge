// Curated bank of stable Unsplash photo URLs by category.
// Each entry uses the canonical images.unsplash.com/photo-<id> form which
// stays online indefinitely (unlike source.unsplash.com which is deprecated).

export interface LibraryImage {
  id: string
  url: string
  thumb: string
  alt: string
  tags: string[]
  category: string
}

const u = (id: string, w = 1400) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`

export const IMAGE_CATEGORIES = [
  'All',
  'Business',
  'Technology',
  'Health & Wellness',
  'Food & Restaurant',
  'Retail & Shop',
  'Trades & Services',
  'Real Estate',
  'Beauty',
  'Fitness',
  'Education',
  'Creative',
  'People',
  'Abstract',
] as const

export const IMAGES: LibraryImage[] = [
  // Business / Professional
  { id:'biz1', url:u('photo-1497366216548-37526070297c'), thumb:u('photo-1497366216548-37526070297c',400), alt:'Modern office', tags:['office','workspace','desk','professional'], category:'Business' },
  { id:'biz2', url:u('photo-1486406146926-c627a92ad1ab'), thumb:u('photo-1486406146926-c627a92ad1ab',400), alt:'Corporate boardroom', tags:['boardroom','meeting','corporate','business'], category:'Business' },
  { id:'biz3', url:u('photo-1556761175-5973dc0f32e7'), thumb:u('photo-1556761175-5973dc0f32e7',400), alt:'Business meeting', tags:['meeting','team','collaboration','business'], category:'Business' },
  { id:'biz4', url:u('photo-1521737604893-d14cc237f11d'), thumb:u('photo-1521737604893-d14cc237f11d',400), alt:'Team working together', tags:['team','collaboration','work'], category:'Business' },
  { id:'biz5', url:u('photo-1554224155-6726b3ff858f'), thumb:u('photo-1554224155-6726b3ff858f',400), alt:'Finance and charts', tags:['finance','charts','growth','accounting'], category:'Business' },
  { id:'biz6', url:u('photo-1573164713988-8665fc963095'), thumb:u('photo-1573164713988-8665fc963095',400), alt:'Consultant at desk', tags:['consultant','advisor','professional'], category:'Business' },
  { id:'biz7', url:u('photo-1556745753-b2904692b3cd'), thumb:u('photo-1556745753-b2904692b3cd',400), alt:'Handshake deal', tags:['handshake','deal','partnership'], category:'Business' },
  { id:'biz8', url:u('photo-1507679799987-c73779587ccf'), thumb:u('photo-1507679799987-c73779587ccf',400), alt:'Businessman portrait', tags:['portrait','executive','suit','professional'], category:'Business' },

  // Technology
  { id:'tech1', url:u('photo-1518770660439-4636190af475'), thumb:u('photo-1518770660439-4636190af475',400), alt:'Circuit board macro', tags:['tech','hardware','electronics'], category:'Technology' },
  { id:'tech2', url:u('photo-1551434678-e076c223a692'), thumb:u('photo-1551434678-e076c223a692',400), alt:'Developer working on laptop', tags:['developer','code','laptop','programming'], category:'Technology' },
  { id:'tech3', url:u('photo-1461749280684-dccba630e2f6'), thumb:u('photo-1461749280684-dccba630e2f6',400), alt:'Code on screen', tags:['code','development','software'], category:'Technology' },
  { id:'tech4', url:u('photo-1531297484001-80022131f5a1'), thumb:u('photo-1531297484001-80022131f5a1',400), alt:'Modern laptop on desk', tags:['laptop','desk','clean','minimal'], category:'Technology' },
  { id:'tech5', url:u('photo-1581090464777-f3220bbe1b8b'), thumb:u('photo-1581090464777-f3220bbe1b8b',400), alt:'Server room', tags:['server','data','infrastructure'], category:'Technology' },
  { id:'tech6', url:u('photo-1519389950473-47ba0277781c'), thumb:u('photo-1519389950473-47ba0277781c',400), alt:'Team coding together', tags:['team','developers','coding'], category:'Technology' },

  // Health & Wellness
  { id:'health1', url:u('photo-1576091160550-2173dba999ef'), thumb:u('photo-1576091160550-2173dba999ef',400), alt:'Doctor with stethoscope', tags:['doctor','medical','healthcare','clinic'], category:'Health & Wellness' },
  { id:'health2', url:u('photo-1559757148-5c350d0d3c56'), thumb:u('photo-1559757148-5c350d0d3c56',400), alt:'Modern clinic interior', tags:['clinic','medical','interior','healthcare'], category:'Health & Wellness' },
  { id:'health3', url:u('photo-1571019613454-1cb2f99b2d8b'), thumb:u('photo-1571019613454-1cb2f99b2d8b',400), alt:'Yoga and wellness', tags:['yoga','wellness','meditation','fitness'], category:'Health & Wellness' },
  { id:'health4', url:u('photo-1505751172876-fa1923c5c528'), thumb:u('photo-1505751172876-fa1923c5c528',400), alt:'Pharmacy shelves', tags:['pharmacy','medicine','healthcare'], category:'Health & Wellness' },
  { id:'health5', url:u('photo-1532938911079-1b06ac7ceec7'), thumb:u('photo-1532938911079-1b06ac7ceec7',400), alt:'Nurse caring for patient', tags:['nurse','care','patient','healthcare'], category:'Health & Wellness' },
  { id:'health6', url:u('photo-1512678080530-7760d81faba6'), thumb:u('photo-1512678080530-7760d81faba6',400), alt:'Spa wellness towels', tags:['spa','wellness','relax','beauty'], category:'Health & Wellness' },

  // Food & Restaurant
  { id:'food1', url:u('photo-1414235077428-338989a2e8c0'), thumb:u('photo-1414235077428-338989a2e8c0',400), alt:'Restaurant interior', tags:['restaurant','dining','interior'], category:'Food & Restaurant' },
  { id:'food2', url:u('photo-1517248135467-4c7edcad34c4'), thumb:u('photo-1517248135467-4c7edcad34c4',400), alt:'Coffee on table', tags:['coffee','cafe','breakfast'], category:'Food & Restaurant' },
  { id:'food3', url:u('photo-1565299624946-b28f40a0ae38'), thumb:u('photo-1565299624946-b28f40a0ae38',400), alt:'Pizza fresh', tags:['pizza','food','italian'], category:'Food & Restaurant' },
  { id:'food4', url:u('photo-1546069901-ba9599a7e63c'), thumb:u('photo-1546069901-ba9599a7e63c',400), alt:'Healthy bowl', tags:['salad','healthy','bowl','food'], category:'Food & Restaurant' },
  { id:'food5', url:u('photo-1504674900247-0877df9cc836'), thumb:u('photo-1504674900247-0877df9cc836',400), alt:'Steak plated dish', tags:['steak','dish','fine dining'], category:'Food & Restaurant' },
  { id:'food6', url:u('photo-1555396273-367ea4eb4db5'), thumb:u('photo-1555396273-367ea4eb4db5',400), alt:'Bakery bread', tags:['bakery','bread','pastry'], category:'Food & Restaurant' },
  { id:'food7', url:u('photo-1551218808-94e220e084d2'), thumb:u('photo-1551218808-94e220e084d2',400), alt:'Sushi platter', tags:['sushi','japanese','asian'], category:'Food & Restaurant' },

  // Retail & Shop
  { id:'retail1', url:u('photo-1441986300917-64674bd600d8'), thumb:u('photo-1441986300917-64674bd600d8',400), alt:'Boutique store', tags:['boutique','clothing','retail','shop'], category:'Retail & Shop' },
  { id:'retail2', url:u('photo-1483985988355-763728e1935b'), thumb:u('photo-1483985988355-763728e1935b',400), alt:'Fashion shopping', tags:['fashion','clothing','retail'], category:'Retail & Shop' },
  { id:'retail3', url:u('photo-1481437156560-3205f6a55735'), thumb:u('photo-1481437156560-3205f6a55735',400), alt:'Bookshop interior', tags:['books','bookshop','retail'], category:'Retail & Shop' },
  { id:'retail4', url:u('photo-1604719312566-8912e9227c6a'), thumb:u('photo-1604719312566-8912e9227c6a',400), alt:'Online shopping', tags:['ecommerce','online','shopping'], category:'Retail & Shop' },

  // Trades & Services (plumbing, electrical, construction, etc.)
  { id:'trade1', url:u('photo-1581578731548-c64695cc6952'), thumb:u('photo-1581578731548-c64695cc6952',400), alt:'Plumber working on pipes', tags:['plumber','pipes','plumbing','tools'], category:'Trades & Services' },
  { id:'trade2', url:u('photo-1621905251918-48416bd8575a'), thumb:u('photo-1621905251918-48416bd8575a',400), alt:'Electrician at work', tags:['electrician','wiring','electrical'], category:'Trades & Services' },
  { id:'trade3', url:u('photo-1504307651254-35680f356dfd'), thumb:u('photo-1504307651254-35680f356dfd',400), alt:'Construction site', tags:['construction','building','site','contractor'], category:'Trades & Services' },
  { id:'trade4', url:u('photo-1581094794329-c8112a89af12'), thumb:u('photo-1581094794329-c8112a89af12',400), alt:'Tools on workbench', tags:['tools','workshop','workbench'], category:'Trades & Services' },
  { id:'trade5', url:u('photo-1558618666-fcd25c85cd64'), thumb:u('photo-1558618666-fcd25c85cd64',400), alt:'Painter painting wall', tags:['painter','painting','renovation'], category:'Trades & Services' },
  { id:'trade6', url:u('photo-1591955506264-3f5a6834570a'), thumb:u('photo-1591955506264-3f5a6834570a',400), alt:'Cleaner cleaning service', tags:['cleaning','cleaner','service'], category:'Trades & Services' },
  { id:'trade7', url:u('photo-1632823469850-2f77dd9c7f93'), thumb:u('photo-1632823469850-2f77dd9c7f93',400), alt:'Mechanic with car', tags:['mechanic','car','garage','automotive'], category:'Trades & Services' },
  { id:'trade8', url:u('photo-1558618666-9b3a85e1e6dc'), thumb:u('photo-1558618666-9b3a85e1e6dc',400), alt:'Tradesperson with toolbox', tags:['tradesperson','toolbox','handyman'], category:'Trades & Services' },

  // Real Estate
  { id:'real1', url:u('photo-1564013799919-ab600027ffc6'), thumb:u('photo-1564013799919-ab600027ffc6',400), alt:'Modern house exterior', tags:['house','exterior','modern','home'], category:'Real Estate' },
  { id:'real2', url:u('photo-1580587771525-78b9dba3b914'), thumb:u('photo-1580587771525-78b9dba3b914',400), alt:'Luxury home interior', tags:['interior','luxury','home','living room'], category:'Real Estate' },
  { id:'real3', url:u('photo-1568605114967-8130f3a36994'), thumb:u('photo-1568605114967-8130f3a36994',400), alt:'Suburban house', tags:['house','suburban','property'], category:'Real Estate' },
  { id:'real4', url:u('photo-1502672260266-1c1ef2d93688'), thumb:u('photo-1502672260266-1c1ef2d93688',400), alt:'Modern interior design', tags:['interior','design','minimalist'], category:'Real Estate' },

  // Beauty
  { id:'beauty1', url:u('photo-1560066984-138dadb4c035'), thumb:u('photo-1560066984-138dadb4c035',400), alt:'Hair salon interior', tags:['salon','hair','beauty','barber'], category:'Beauty' },
  { id:'beauty2', url:u('photo-1487412720507-e7ab37603c6f'), thumb:u('photo-1487412720507-e7ab37603c6f',400), alt:'Makeup brushes flat lay', tags:['makeup','beauty','cosmetics'], category:'Beauty' },
  { id:'beauty3', url:u('photo-1610992015732-2449b76344bc'), thumb:u('photo-1610992015732-2449b76344bc',400), alt:'Nail salon', tags:['nails','manicure','salon'], category:'Beauty' },
  { id:'beauty4', url:u('photo-1522337360788-8b13dee7a37e'), thumb:u('photo-1522337360788-8b13dee7a37e',400), alt:'Barber shop', tags:['barber','shave','men','grooming'], category:'Beauty' },

  // Fitness
  { id:'fit1', url:u('photo-1534438327276-14e5300c3a48'), thumb:u('photo-1534438327276-14e5300c3a48',400), alt:'Modern gym', tags:['gym','equipment','fitness'], category:'Fitness' },
  { id:'fit2', url:u('photo-1517836357463-d25dfeac3438'), thumb:u('photo-1517836357463-d25dfeac3438',400), alt:'Person exercising', tags:['workout','exercise','training'], category:'Fitness' },
  { id:'fit3', url:u('photo-1571019613454-1cb2f99b2d8b'), thumb:u('photo-1571019613454-1cb2f99b2d8b',400), alt:'Yoga class', tags:['yoga','class','stretch'], category:'Fitness' },
  { id:'fit4', url:u('photo-1599058917212-d750089bc07e'), thumb:u('photo-1599058917212-d750089bc07e',400), alt:'Crossfit training', tags:['crossfit','strength','training'], category:'Fitness' },

  // Education
  { id:'edu1', url:u('photo-1503676260728-1c00da094a0b'), thumb:u('photo-1503676260728-1c00da094a0b',400), alt:'Classroom', tags:['classroom','school','education'], category:'Education' },
  { id:'edu2', url:u('photo-1481627834876-b7833e8f5570'), thumb:u('photo-1481627834876-b7833e8f5570',400), alt:'Student studying', tags:['student','study','books'], category:'Education' },
  { id:'edu3', url:u('photo-1577896851231-70ef18881754'), thumb:u('photo-1577896851231-70ef18881754',400), alt:'Online learning laptop', tags:['online','elearning','laptop'], category:'Education' },
  { id:'edu4', url:u('photo-1427504494785-3a9ca7044f45'), thumb:u('photo-1427504494785-3a9ca7044f45',400), alt:'Library books shelves', tags:['library','books','reading'], category:'Education' },

  // Creative
  { id:'creative1', url:u('photo-1561070791-2526d30994b8'), thumb:u('photo-1561070791-2526d30994b8',400), alt:'Splatter paint creative', tags:['paint','art','creative','splatter'], category:'Creative' },
  { id:'creative2', url:u('photo-1558655146-9f40138edfeb'), thumb:u('photo-1558655146-9f40138edfeb',400), alt:'Designer workspace', tags:['design','workspace','agency'], category:'Creative' },
  { id:'creative3', url:u('photo-1452860606245-08befc0ff44b'), thumb:u('photo-1452860606245-08befc0ff44b',400), alt:'Photographer camera', tags:['photographer','camera','photo'], category:'Creative' },
  { id:'creative4', url:u('photo-1493612276216-ee3925520721'), thumb:u('photo-1493612276216-ee3925520721',400), alt:'Architecture blueprint', tags:['architect','blueprint','design'], category:'Creative' },

  // People
  { id:'people1', url:u('photo-1438761681033-6461ffad8d80'), thumb:u('photo-1438761681033-6461ffad8d80',400), alt:'Smiling woman portrait', tags:['portrait','woman','smile'], category:'People' },
  { id:'people2', url:u('photo-1500648767791-00dcc994a43e'), thumb:u('photo-1500648767791-00dcc994a43e',400), alt:'Confident man portrait', tags:['portrait','man','professional'], category:'People' },
  { id:'people3', url:u('photo-1573497019940-1c28c88b4f3e'), thumb:u('photo-1573497019940-1c28c88b4f3e',400), alt:'Diverse team', tags:['team','diverse','group'], category:'People' },
  { id:'people4', url:u('photo-1551836022-d5d88e9218df'), thumb:u('photo-1551836022-d5d88e9218df',400), alt:'Friendly customer', tags:['customer','smile','friendly'], category:'People' },

  // Abstract
  { id:'abs1', url:u('photo-1557682250-33bd709cbe85'), thumb:u('photo-1557682250-33bd709cbe85',400), alt:'Pink purple gradient', tags:['gradient','abstract','colorful'], category:'Abstract' },
  { id:'abs2', url:u('photo-1557682224-5b8590cd9ec5'), thumb:u('photo-1557682224-5b8590cd9ec5',400), alt:'Geometric abstract', tags:['geometric','abstract','design'], category:'Abstract' },
  { id:'abs3', url:u('photo-1531315396756-905d68d21b56'), thumb:u('photo-1531315396756-905d68d21b56',400), alt:'Blue waves abstract', tags:['waves','blue','abstract'], category:'Abstract' },
  { id:'abs4', url:u('photo-1604079628040-94301bb21b91'), thumb:u('photo-1604079628040-94301bb21b91',400), alt:'Texture pattern', tags:['texture','pattern','minimal'], category:'Abstract' },
]

export function searchImages(query: string, category: string): LibraryImage[] {
  const q = query.trim().toLowerCase()
  return IMAGES.filter(img => {
    if (category !== 'All' && img.category !== category) return false
    if (!q) return true
    if (img.alt.toLowerCase().includes(q)) return true
    if (img.tags.some(t => t.includes(q))) return true
    if (img.category.toLowerCase().includes(q)) return true
    return false
  })
}
