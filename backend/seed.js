require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Article = require("./models/Article");
const Category = require("./models/Category");
const Author = require("./models/Author");

// 1. ALL CATEGORIES FOR HEXA NEWS
const categoriesData = [
  // Primary Sections
  { label: "NEWS", slug: "news", parent: null },
  { label: "SPORTS", slug: "sports", parent: null },
  { label: "HEALTH", slug: "health", parent: null },
  { label: "TECHNOLOGY", slug: "technology", parent: null },
  { label: "BUSINESS", slug: "business", parent: null },
  { label: "LIFESTYLE", slug: "lifestyle", parent: null },
  { label: "REGIONS", slug: "regions", parent: null },

  // Regional Subcategories
  { label: "Asia", slug: "asia", parent: "regions" },
  { label: "Europe", slug: "europe", parent: "regions" },
  { label: "Africa", slug: "africa", parent: "regions" },
  { label: "North America", slug: "north-america", parent: "regions" },
  { label: "South America", slug: "south-america", parent: "regions" },
  { label: "Australia", slug: "australia", parent: "regions" },
  { label: "Antarctica", slug: "antarctica", parent: "regions" },

  // Specialized Subcategories
  { label: "Football", slug: "football", parent: "sports" },
  { label: "Cricket", slug: "cricket", parent: "sports" },
  { label: "Basketball", slug: "basketball", parent: "sports" },
  { label: "Athletics", slug: "athletics", parent: "sports" },
  { label: "Fitness", slug: "fitness", parent: "health" },
  { label: "Wellness", slug: "wellness", parent: "health" },
  { label: "AI & Robotics", slug: "ai-robotics", parent: "technology" },
  { label: "Markets", slug: "markets", parent: "business" },
  { label: "Startups", slug: "startups", parent: "business" },
  { label: "Economy", slug: "economy", parent: "business" },
  { label: "Food", slug: "food", parent: "lifestyle" },
  { label: "Travel", slug: "travel", parent: "lifestyle" },
  { label: "Art", slug: "art", parent: "lifestyle" },
  { label: "Interior", slug: "interior", parent: "lifestyle" },
  { label: "Science", slug: "science", parent: "technology" },
  { label: "Culture", slug: "culture", parent: "lifestyle" },
  { label: "Environment", slug: "environment", parent: "news" },
];

// 2. ALL AUTHORS FROM AUTHORPAGE
const authorsData = [
  {
    name: "John Doe",
    role: "Senior Tech Editor",
    bio: "Specializing in artificial intelligence, cloud architectures, and digital transformation with over 12 years of tech reporting.",
    photo: "https://i.pravatar.cc/120?img=1",
    email: "john.doe@hexanews.in",
    count: 142,
  },
  {
    name: "Sarah Connor",
    role: "Lead Sports Analyst",
    bio: "Covering international football, track and field championships, and tactical game analytics worldwide.",
    photo: "https://i.pravatar.cc/120?img=5",
    email: "sarah.connor@hexanews.in",
    count: 98,
  },
  {
    name: "Michael Chang",
    role: "Global Economics Editor",
    bio: "Former foreign markets correspondent specializing in macroeconomics, currency markets, and corporate governance.",
    photo: "https://i.pravatar.cc/120?img=8",
    email: "michael.chang@hexanews.in",
    count: 115,
  },
  {
    name: "Emma Watson",
    role: "Health & Wellness Lead",
    bio: "Reporting on clinical science, preventative health protocols, and modern wellness research.",
    photo: "https://i.pravatar.cc/120?img=9",
    email: "emma.watson@hexanews.in",
    count: 84,
  },
  {
    name: "Daniel Reed",
    role: "Investigative Correspondent",
    bio: "Award-winning investigative journalist covering global events, transparency, and public interest journalism.",
    photo: "https://i.pravatar.cc/120?img=12",
    email: "daniel.reed@hexanews.in",
    count: 164,
  },
  {
    name: "Dr. Rachel Green",
    role: "Science & Medical Contributor",
    bio: "Biochemist turned science writer focusing on immunology, neuroscience, and medical innovations.",
    photo: "https://i.pravatar.cc/120?img=16",
    email: "rachel.green@hexanews.in",
    count: 72,
  },
  {
    name: "Carlos Mendez",
    role: "International Politics Desk",
    bio: "Foreign bureau journalist tracking geopolitical treaties, trade agreements, and global diplomacy.",
    photo: "https://i.pravatar.cc/120?img=15",
    email: "carlos.mendez@hexanews.in",
    count: 130,
  },
  {
    name: "Lisa Zhang",
    role: "Culture & Ideas Lead",
    bio: "Critique and essayist exploring architecture, contemporary arts, and urban cultural shifts.",
    photo: "https://i.pravatar.cc/120?img=20",
    email: "lisa.zhang@hexanews.in",
    count: 95,
  },
];

// 3. COMPLETE STATIC ARTICLES GATHERED FROM HOMEPAGE, CATEGORY PAGES, AND POST DETAIL
const rawArticles = [
  // --- Hero Slider Articles (Featured) ---
  {
    slug: "future-of-technology-ai-revolution",
    title: "The Future of Technology: AI Revolution",
    excerpt: "Discover how artificial intelligence is transforming industries and reshaping the world we live in today.",
    content: "Artificial intelligence has rapidly evolved from theoretical exploration into an omnipresent engine driving modern industry. Machine learning architectures and generative models are altering software engineering, clinical diagnostics, and financial forecasting with unprecedented speed. Engineering leaders are now focusing on scalable alignment, multi-modal integration, and ethical safety boundaries.",
    category: "technology",
    subcategory: "ai-robotics",
    author: "John Doe",
    readTime: "5 min read",
    views: 12500,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
    featured: true,
    tags: ["Technology", "AI", "Innovation", "Machine Learning"],
  },
  {
    slug: "space-exploration-new-horizons",
    title: "Space Exploration: New Horizons Await",
    excerpt: "Journey through the cosmos and explore the latest discoveries in space science and exploration.",
    content: "Deep space observation has crossed an inflection point. With advanced orbital observatories and commercial lunar landers, humanity is decoding early galactic formation and searching for atmospheric biosignatures on distant exoplanets.",
    category: "technology",
    subcategory: "science",
    author: "Sarah Wilson",
    readTime: "8 min read",
    views: 9800,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
    featured: true,
    tags: ["Space", "Science", "Astronomy", "Exploration"],
  },
  {
    slug: "digital-innovation-transforming-business",
    title: "Digital Innovation: Transforming Business",
    excerpt: "Learn how digital transformation is driving growth and creating new opportunities across sectors.",
    content: "From automated supply chains to decentralized clearinghouses, modern businesses are rewiring their organizational structure around automated, real-time analytics and predictive demand forecasting.",
    category: "business",
    subcategory: "startups",
    author: "Michael Chang",
    readTime: "6 min read",
    views: 15200,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
    featured: true,
    tags: ["Business", "Innovation", "Startups", "Growth"],
  },
  {
    slug: "health-wellness-living-best-life",
    title: "Health & Wellness: Living Your Best Life",
    excerpt: "Expert tips and insights on maintaining a healthy lifestyle in the modern world.",
    content: "Holistic wellness is rooted in biological rhythm, quality sleep, micronutrient density, and deliberate stress moderation. Preventative medicine now emphasizes micro-habits that sustainably lower systemic inflammation over decades.",
    category: "health",
    subcategory: "wellness",
    author: "Emma Watson",
    readTime: "4 min read",
    views: 8300,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80",
    featured: true,
    tags: ["Health", "Wellness", "Fitness", "Lifestyle"],
  },

  // --- Sports Articles ---
  {
    slug: "the-champions-defining-a-new-era-of-sport",
    title: "The Champions Defining a New Era of Sport",
    excerpt: "From record-breaking performances to the next generation of rising stars, the stories shaping competition around the world.",
    content: "Athletic performance is entering an era defined by scientific data, specialized biomechanics, and relentless psychological preparation. Across global competitions, traditional barriers that stood for decades are being dismantled with striking consistency. Coaching staffs now rely on high-frequency wearable telemetry and predictive machine learning models to track muscle fatigue in real time, preventing catastrophic injuries before they can manifest.",
    category: "sports",
    subcategory: "athletics",
    author: "Daniel Reed",
    readTime: "6 min read",
    views: 5200,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
    featured: true,
    tags: ["Sports", "Athletics", "Champions", "World Records"],
  },
  {
    slug: "inside-the-tactics-changing-the-modern-game",
    title: "Inside the Tactics Changing the Modern Game",
    excerpt: "Smarter analysis, better preparation and fearless teamwork are changing how elite teams approach the biggest moments.",
    content: "Tactical positioning in modern professional basketball has evolved beyond isolated positional roles. Spatial tracking and high-tempo ball movement are creating multi-dimensional threats on every offensive possession.",
    category: "sports",
    subcategory: "basketball",
    author: "Sarah Connor",
    readTime: "5 min read",
    views: 3800,
    image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=600&q=80",
    tags: ["Sports", "Basketball", "Tactics"],
  },
  {
    slug: "record-breaking-swimmers-push-boundaries",
    title: "Record-Breaking Swimmers Push Boundaries in World Championships",
    excerpt: "Several world records fall as athletes deliver outstanding performances at the 2026 FINA World Championships.",
    content: "Hydrodynamic research and specialized recovery protocols have propelled swimmers to break three individual world records on opening night in Budapest.",
    category: "sports",
    subcategory: "athletics",
    author: "Michael Chang",
    readTime: "4 min read",
    views: 2400,
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80",
    tags: ["Sports", "Swimming", "Championships"],
  },
  {
    slug: "underdog-teams-shock-fans-in-world-cup-qualifiers",
    title: "Underdog Teams Shock Fans in World Cup Qualifiers",
    excerpt: "Smaller nations prove their worth with stunning upsets against traditional powerhouses in qualifying rounds.",
    content: "Disciplined defensive structures and lethal counter-attacking play have produced breathtaking upsets in international football qualifying stages this week.",
    category: "sports",
    subcategory: "football",
    author: "Carlos Mendez",
    readTime: "5 min read",
    views: 6100,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80",
    tags: ["Sports", "Football", "World Cup"],
  },
  {
    slug: "how-athletes-are-using-science-to-train-smarter",
    title: "How Athletes Are Using Science to Train Smarter",
    excerpt: "Wearable tech, data analytics, and recovery science are revolutionizing how professional athletes prepare.",
    content: "Gone are the days of arbitrary two-a-day training grinds. Today's Olympic and professional programs rely on precision biometrics, sleep telemetry, and customized nutrition timing.",
    category: "sports",
    subcategory: "fitness",
    author: "Emma Watson",
    readTime: "7 min read",
    views: 4300,
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=80",
    tags: ["Sports", "Fitness", "Science", "Training"],
  },
  {
    slug: "how-young-competitors-are-reshaping-pro-tournaments",
    title: "How Young Competitors Are Reshaping Pro Tournaments",
    excerpt: "A new generation brings fearless tactics and fresh rivalries to center stage.",
    content: "Teenage phenoms across tennis, esports, and track are entering major arenas with unshakeable composure and modern technical repertoires that challenge entrenched veterans.",
    category: "sports",
    subcategory: "athletics",
    author: "Daniel Reed",
    readTime: "4 min read",
    views: 2800,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
    tags: ["Sports", "Youth", "Athletics"],
  },
  {
    slug: "olympic-track-and-field-trials-pace-2028",
    title: "Olympic Track & Field Trials Set Blistering Pace for 2028",
    excerpt: "Sprint records and distance breakthroughs mark the opening trials as athletes gear up for international championships.",
    content: "Sprint records and distance breakthroughs marked an electrifying opening weekend at the national athletic trials as contenders secured qualifying marks for upcoming global championships.",
    category: "sports",
    subcategory: "athletics",
    author: "Marcus Vance",
    readTime: "5 min read",
    views: 4100,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
    tags: ["Sports", "Athletics", "Track"],
  },
  {
    slug: "tactical-shift-how-high-press-dominates-football",
    title: "Tactical Shift: How High-Press Defenses Are Dominating Football",
    excerpt: "An in-depth breakdown of how tactical pressing systems and spatial congestion are neutralizing superstar playmakers.",
    content: "Modern tactical football relies on synchronized pressing triggers and compact defensive blocks designed to suffocate transitions in the opponent's defensive third.",
    category: "sports",
    subcategory: "football",
    author: "Carlos Mendez",
    readTime: "6 min read",
    views: 5800,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80",
    tags: ["Sports", "Football", "Tactics"],
  },
  {
    slug: "marathon-running-breakthroughs-fueling-recovery",
    title: "Marathon Running Breakthroughs: Fueling, Recovery, and Carbon Shoes",
    excerpt: "The intersection of sports nutrition science and carbon plate footwear is pushing human endurance past previous barriers.",
    content: "Elite marathoners are redefining pacing strategies with optimized carbohydrate absorption rates, real-time core body temperature tracking, and carbon-infused responsive foam geometry.",
    category: "sports",
    subcategory: "fitness",
    author: "Emma Wilson",
    readTime: "5 min read",
    views: 3900,
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&q=80",
    tags: ["Sports", "Marathon", "Running", "Science"],
  },
  {
    slug: "modern-shot-creation-mid-range-isolation",
    title: "Modern Shot Creation: Why Mid-Range Isolation Is Making a Comeback",
    excerpt: "How playoff basketball has forced elite perimeter scorers to revive the lost art of the mid-range pull-up jumper.",
    content: "Defensive schemes built to eliminate corner threes and rim attempts have opened up pockets of space around the free-throw line, where shot creators are capitalizing on high-efficiency mid-range jumpers.",
    category: "sports",
    subcategory: "basketball",
    author: "Sarah Connor",
    readTime: "4 min read",
    views: 4700,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80",
    tags: ["Sports", "Basketball", "Tactics"],
  },

  // --- Health & Wellness Articles ---
  {
    slug: "revolutionary-health-habits-everyday-wellness",
    title: "Revolutionary Health Habits Transforming Everyday Wellness",
    excerpt: "Clinical research shows small daily routine changes compound into profound cognitive and physical vitality over decades.",
    content: "Scientific literature increasingly confirms that consistent sleep schedules, early morning sunlight exposure, and zone-2 cardiovascular exercise create resilient metabolic health and delay chronic cognitive decline.",
    category: "health",
    subcategory: "wellness",
    author: "Dr. Rachel Green",
    readTime: "5 min read",
    views: 4500,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    featured: true,
    tags: ["Health", "Wellness", "Longevity", "Habits"],
  },
  {
    slug: "the-science-of-sleep-how-deep-rest-repairs-the-brain",
    title: "The Science of Sleep: How Deep Rest Repairs the Brain",
    excerpt: "Glyphatic clearance during deep NREM sleep removes neurotoxic proteins and solidifies long-term memory consolidation.",
    content: "Neuroscientists have uncovered the mechanical flushing action of the glymphatic system, which operates almost exclusively during deep stage-3 slow-wave sleep. Optimizing sleep temperature and minimizing late-night blue light dramatically increases this restorative window.",
    category: "health",
    subcategory: "wellness",
    author: "Dr. Rachel Green",
    readTime: "6 min read",
    views: 5800,
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&q=80",
    tags: ["Health", "Sleep", "Neuroscience"],
  },
  {
    slug: "nutrition-breakthroughs-for-sustained-energy",
    title: "Nutrition Breakthroughs for Sustained All-Day Energy",
    excerpt: "Ditching blood sugar spikes through protein-first breakfasts and complex prebiotic fibers creates steady mental performance.",
    content: "Glucose monitors worn by healthy non-diabetics have demonstrated that high-glycemic morning meals precipitate intense mid-afternoon cognitive crashes. Stabilizing insulin via healthy fats and fiber provides steady mitochondrial fuel.",
    category: "health",
    subcategory: "fitness",
    author: "Emma Watson",
    readTime: "4 min read",
    views: 3900,
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80",
    tags: ["Health", "Nutrition", "Energy"],
  },
  {
    slug: "mental-fitness-meditation-and-cognitive-focus",
    title: "Mental Fitness: Meditation and Cognitive Focus in a Noisy World",
    excerpt: "Ten minutes of focused breathwork measurably reduces amygdala reactivity and builds attentional stamina.",
    content: "In an attention-economy inundated with notifications, mindfulness practice has transitioned from esoteric spiritual retreat into standard executive and athletic cognitive hygiene.",
    category: "health",
    subcategory: "wellness",
    author: "Lisa Zhang",
    readTime: "5 min read",
    views: 4200,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    tags: ["Health", "Mindfulness", "Focus"],
  },

  // --- Technology Articles ---
  {
    slug: "the-rise-of-generative-ai-transforming-creative-industries",
    title: "The Rise of Generative AI: Transforming Creative Industries",
    excerpt: "Musicians, animators, and architects are embracing diffusion and transformer models to supercharge visual workflows.",
    content: "Rather than replacing human artistry, state-of-the-art multimodal AI serves as an infinite ideation partner. Creative directors now storyboard entire film sequences in hours instead of weeks, liberating time for emotional nuance.",
    category: "technology",
    subcategory: "ai-robotics",
    author: "John Doe",
    readTime: "8 min read",
    views: 7400,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    featured: true,
    tags: ["Technology", "AI", "Creativity", "Design"],
  },
  {
    slug: "quantum-computing-milestone-achieved-by-research-consortium",
    title: "Quantum Computing Milestone Achieved by Research Consortium",
    excerpt: "Fault-tolerant logical qubits demonstrated with 99.9% gate fidelity, opening doors to novel molecular simulations.",
    content: "Physicists have successfully demonstrated error-corrected quantum circuits that sustain coherence across complex mathematical calculations, representing a definitive leap toward practical quantum advantage.",
    category: "technology",
    subcategory: "science",
    author: "Dr. Rachel Green",
    readTime: "6 min read",
    views: 6200,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
    tags: ["Technology", "Quantum", "Physics", "Computing"],
  },
  {
    slug: "next-gen-cybersecurity-zero-trust-in-the-cloud-era",
    title: "Next-Gen Cybersecurity: Zero Trust in the Cloud Era",
    excerpt: "Perimeter security is obsolete; modern defense treats every network packet and identity credential as untrusted.",
    content: "With distributed remote workforces and multi-cloud backbones, chief security officers are implementing continuous biometric and cryptographic authorization protocols at every microservice boundary.",
    category: "technology",
    subcategory: "ai-robotics",
    author: "John Doe",
    readTime: "5 min read",
    views: 4800,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
    tags: ["Technology", "Cybersecurity", "Cloud"],
  },
  {
    slug: "the-silicon-breakthrough-powering-smaller-efficient-chips",
    title: "The Silicon Breakthrough Powering Smaller, More Efficient Chips",
    excerpt: "2-nanometer gate-all-around architectures promise 45% lower power consumption for mobile and edge devices.",
    content: "Semiconductor foundries have initiated mass production of gate-all-around nanosheet transistors, providing unprecedented thermal efficiency for on-device machine learning inference.",
    category: "technology",
    subcategory: "science",
    author: "Michael Chang",
    readTime: "5 min read",
    views: 5100,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    tags: ["Technology", "Semiconductors", "Hardware"],
  },

  // --- Business Articles ---
  {
    slug: "global-markets-rally-trade-agreements",
    title: "Global Markets Rally as Trade Agreements Strengthen Investor Confidence",
    excerpt: "Stock markets around the world surged to new highs as major economies finalized trade deals that boost cross-border commerce.",
    content: "Key equity indices in New York, London, Tokyo, and Mumbai recorded substantial gains as multilateral bilateral treaties cleared administrative hurdles, providing clarity for multinational supply chains.",
    category: "business",
    subcategory: "markets",
    author: "Michael Chang",
    readTime: "5 min read",
    views: 8900,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=85",
    featured: true,
    tags: ["Business", "Markets", "Economy", "Trade"],
  },
  {
    slug: "venture-capital-pivots-toward-climate-tech-and-energy",
    title: "Venture Capital Pivots Toward Climate Tech and Grid Infrastructure",
    excerpt: "Over $40 billion deployed into long-duration battery storage, fusion research, and circular industrial systems this quarter.",
    content: "Venture capital funds are redeploying capital out of commodity consumer software into heavy industrial decarbonization technologies backed by government sovereign guarantees.",
    category: "business",
    subcategory: "startups",
    author: "Michael Chang",
    readTime: "6 min read",
    views: 6400,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    tags: ["Business", "Venture Capital", "Climate", "Energy"],
  },
  {
    slug: "a-new-generation-of-founders-builds-for-the-long-term",
    title: "A New Generation of Founders Builds for the Long Term",
    excerpt: "Sustainable profitability and resilient unit economics replace blitzscaling as the defining metric of startup success.",
    content: "Startup founders in 2026 are prioritizing cash flow positive operations from day one, proving that durable enterprise value is built through customer loyalty rather than subsidized hyper-growth.",
    category: "business",
    subcategory: "startups",
    author: "Daniel Reed",
    readTime: "5 min read",
    views: 5200,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80",
    tags: ["Business", "Startups", "Founders"],
  },
  {
    slug: "central-banks-navigate-monetary-policy-and-growth",
    title: "Central Banks Navigate Monetary Policy and Growth Prospects",
    excerpt: "Balanced interest rate reductions stimulate capital expenditure while preserving price stability across major trading blocs.",
    content: "Economic authorities have initiated measured easing cycles designed to spur housing construction and infrastructure upgrades while closely tracking core services inflation.",
    category: "business",
    subcategory: "economy",
    author: "Michael Chang",
    readTime: "5 min read",
    views: 7100,
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80",
    tags: ["Business", "Economy", "Finance"],
  },

  // --- Regional Articles (Asia, Europe, Africa, North America, South America, Australia, Antarctica) ---
  {
    slug: "a-fresh-look-at-the-cities-shaping-tomorrow-asia",
    title: "A Fresh Look at the Cities Shaping Tomorrow: Asian Metropolises",
    excerpt: "High-speed rail links and green urban planning transform Tokyo, Singapore, and Seoul into sustainable smart corridors.",
    content: "Asian mega-regions are investing heavily in automated zero-emission transit, smart water recycling, and vertical urban forestry to redefine modern living standards.",
    category: "asia",
    subcategory: "regions",
    author: "Kenji Sato",
    readTime: "5 min read",
    views: 6300,
    image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=80",
    featured: true,
    tags: ["Asia", "World", "Cities", "Urban"],
  },
  {
    slug: "the-quiet-revival-of-historic-neighbourhoods-europe",
    title: "The Quiet Revival of Historic European Neighbourhoods",
    excerpt: "Pedestrian-only historic quarters and artisan bakeries bring new life to medieval city centres across Europe.",
    content: "European municipal policies prioritizing pedestrian mobility and historic preservation have spurred a renaissance of local businesses and vibrant public plazas from Florence to Prague.",
    category: "europe",
    subcategory: "regions",
    author: "Clara Bennett",
    readTime: "4 min read",
    views: 5700,
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
    featured: true,
    tags: ["Europe", "World", "Culture", "Heritage"],
  },
  {
    slug: "creative-hubs-are-connecting-communities-across-africa",
    title: "Creative Hubs Are Connecting Communities Across Africa",
    excerpt: "Fintech pioneers and creative digital collectives in Lagos and Nairobi accelerate cross-continental commerce.",
    content: "Young innovators across sub-Saharan Africa are deploying mobile banking rails and solar micro-grids to empower local agricultural cooperatives and digital creative agencies.",
    category: "africa",
    subcategory: "regions",
    author: "Amara Okafor",
    readTime: "5 min read",
    views: 5900,
    image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600&q=80",
    featured: true,
    tags: ["Africa", "World", "Innovation", "Community"],
  },
  {
    slug: "innovation-corridors-expanding-across-north-america",
    title: "Innovation Corridors Expanding Across North America",
    excerpt: "Advanced manufacturing hubs connect the American Midwest with Canadian quantum labs and Mexican automotive plants.",
    content: "Integrated trade logistics and clean electricity grids are establishing North America as a premier destination for advanced battery chemistry and aerospace manufacturing.",
    category: "north-america",
    subcategory: "regions",
    author: "Daniel Reed",
    readTime: "5 min read",
    views: 6800,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    featured: true,
    tags: ["North America", "World", "Manufacturing", "Trade"],
  },
  {
    slug: "biodiversity-and-conservation-breakthroughs-south-america",
    title: "Biodiversity and Conservation Breakthroughs in South America",
    excerpt: "Indigenous community stewardship and satellite monitoring protect millions of hectares of tropical rainforest.",
    content: "Collaborative drone monitoring and sustainable agroforestry initiatives across the Amazon basin are demonstrating how ecological conservation and local economic prosperity thrive together.",
    category: "south-america",
    subcategory: "regions",
    author: "Carlos Mendez",
    readTime: "5 min read",
    views: 5400,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
    featured: true,
    tags: ["South America", "World", "Conservation", "Ecology"],
  },
  {
    slug: "renewable-energy-milestones-across-australia",
    title: "Renewable Energy Milestones Set Across Australia",
    excerpt: "Record solar output and utility-scale battery storage supply 80% of national electricity demand during peak hours.",
    content: "Australia's national energy grid achieved historic milestones this month, operating primarily on wind, solar, and hydro generation while exporting clean green hydrogen to international partners.",
    category: "australia",
    subcategory: "regions",
    author: "Sarah Wilson",
    readTime: "4 min read",
    views: 4900,
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80",
    featured: true,
    tags: ["Australia", "World", "Energy", "Renewables"],
  },
  {
    slug: "scientific-discoveries-under-the-antarctic-ice-shelf",
    title: "Scientific Discoveries Under the Antarctic Ice Shelf",
    excerpt: "Autonomous submersibles uncover diverse marine ecosystems flourishing in complete darkness under Ross Ice Shelf.",
    content: "International oceanographic teams operating autonomous underwater vehicles have discovered thriving microbial and invertebrate communities living thousands of feet beneath the Antarctic ice sheet.",
    category: "antarctica",
    subcategory: "regions",
    author: "Dr. Rachel Green",
    readTime: "6 min read",
    views: 7100,
    image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&q=80",
    featured: true,
    tags: ["Antarctica", "World", "Science", "Oceanography"],
  },

  // --- Lifestyle & Culture Articles ---
  {
    slug: "discover-the-art-of-interior-decoration-and-styling",
    title: "Discover the Art of Interior Decoration and Styling",
    excerpt: "Warm minimalism, natural daylight, and organic textures create peaceful residential sanctuaries.",
    content: "Interior designers are turning toward biophilic principles: raw lime wash walls, sustainable timber cabinetry, and intentional negative space that fosters calm focus.",
    category: "lifestyle",
    subcategory: "interior",
    author: "Lisa Zhang",
    readTime: "5 min read",
    views: 3900,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
    tags: ["Lifestyle", "Interior", "Design", "Home"],
  },
  {
    slug: "foodies-paradise-indulge-in-exquisite-cuisine",
    title: "Foodie's Paradise: Indulge in Exquisite Cuisine",
    excerpt: "Farm-to-table chefs champion seasonal heirloom ingredients and hyper-local fermentation techniques.",
    content: "Gastronomic culture in 2026 focuses on transparency, zero-waste kitchens, and celebrating time-honored artisanal fermentation traditions that elevate wholesome meals.",
    category: "lifestyle",
    subcategory: "food",
    author: "Emma Watson",
    readTime: "4 min read",
    views: 4100,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    tags: ["Lifestyle", "Food", "Culinary", "Travel"],
  },
  {
    slug: "hidden-paradises-10-underrated-travel-destinations-for-2026",
    title: "Hidden Paradises: 10 Underrated Travel Destinations for 2026",
    excerpt: "Escape the crowds and discover extraordinary places that offer authentic cultural experiences and pristine landscapes.",
    content: "From the remote fjord valleys of northern Norway to the tranquil mountain villages of northern Portugal, travelers are choosing slow exploration over hurried bucket-list stops.",
    category: "lifestyle",
    subcategory: "travel",
    author: "Carlos Mendez",
    readTime: "7 min read",
    views: 6500,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    tags: ["Lifestyle", "Travel", "Adventure", "Nature"],
  },
  {
    slug: "unleash-your-creativity-explore-the-world-of-creative-works",
    title: "Unleash Your Creativity: Explore the World of Creative Works",
    excerpt: "Ceramics, printmaking, and analog photography experience a vibrant resurgence among digital professionals.",
    content: "Hands-on tactile crafts provide a meditative antidote to screen exhaustion, inspiring a renaissance of neighborhood community workshops and bespoke physical art.",
    category: "lifestyle",
    subcategory: "art",
    author: "Lisa Zhang",
    readTime: "4 min read",
    views: 3200,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
    tags: ["Lifestyle", "Art", "Creativity", "Crafts"],
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await connectDB();

  // 1. Clear existing collections safely
  await User.deleteMany({});
  await Category.deleteMany({});
  await Article.deleteMany({});
  await Author.deleteMany({});
  console.log(" Cleared existing collections (Users, Categories, Articles, Authors)");

  // 2. Create Default Admin User
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  await User.create({
    username: "admin",
    email: "admin@hexanews.in",
    passwordHash,
    role: "admin",
    name: "HEXA NEWS Admin",
  });
  console.log(" Admin created: username 'admin' / password 'Admin@123'");

  // 3. Insert Categories
  await Category.insertMany(categoriesData);
  console.log(` Created ${categoriesData.length} categories`);

  // 4. Insert Authors
  await Author.insertMany(authorsData);
  console.log(` Created ${authorsData.length} authors`);

  // 5. Deduplicate and Insert Articles
  const seenSlugs = new Set();
  const articlesToInsert = [];

  for (let i = 0; i < rawArticles.length; i++) {
    const a = rawArticles[i];
    if (seenSlugs.has(a.slug)) continue;
    seenSlugs.add(a.slug);

    const createdDate = new Date(Date.now() - i * 3600000 * 6); // Stagger by 6 hours
    articlesToInsert.push({
      ...a,
      categories: [a.category, a.subcategory].filter(Boolean),
      date: createdDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      published: true,
      comments: Math.floor(Math.random() * 45) + 5,
      likes: Math.floor(Math.random() * 300) + 20,
      createdAt: createdDate,
      updatedAt: createdDate,
    });
  }

  await Article.insertMany(articlesToInsert);
  console.log(` Created ${articlesToInsert.length} articles across all categories!`);

  // 6. Print summary
  console.log("\n==========================================");
  console.log(" SEED COMPLETED SUCCESSFULLY!");
  console.log(` Total Categories: ${categoriesData.length}`);
  console.log(` Total Authors:    ${authorsData.length}`);
  console.log(` Total Articles:   ${articlesToInsert.length}`);
  console.log("==========================================\n");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(" Seed Error:", err);
  process.exit(1);
});
