export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  content: string
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find(p => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return posts.map(p => p.slug)
}

export const posts: BlogPost[] = [
  {
    slug: "what-an-ai-chat-agent-actually-does",
    title: "What an AI Chat Agent Actually Does (No Hype)",
    excerpt: "AI chat agents are not sci-fi robots or glorified FAQ pages. Here is what actually happens when one runs on your website.",
    category: "AI Agents",
    date: "May 13, 2026",
    content: ""
  },
  {
    slug: "is-your-website-losing-leads-while-you-sleep",
    title: "Is Your Website Losing Leads While You Sleep?",
    excerpt: "More than half your website traffic comes outside business hours. Every unanswered visitor is revenue walking out the door.",
    category: "Lead Generation",
    date: "May 20, 2026",
    content: ""
  },
  {
    slug: "we-built-an-ai-agent-for-an-accounting-firm",
    title: "We Built an AI Agent for an Accounting Firm. Here is What Happened.",
    excerpt: "How a solo accountant in rural New Brunswick reclaimed 8+ hours a week by letting an AI agent handle client inquiries 24/7.",
    category: "Case Studies",
    date: "May 27, 2026",
    content: ""
  },
  {
    slug: "a-chatbot-is-not-an-ai-agent",
    title: "A Chatbot Is Not an AI Agent. Here is the Difference.",
    excerpt: "That chatbot on your website is probably embarrassing your business right now. Here is why AI agents are a completely different thing.",
    category: "AI Agents",
    date: "June 3, 2026",
    content: ""
  },
  {
    slug: "questions-your-ai-agent-should-answer",
    title: "The Questions Your AI Agent Should Answer (And the Ones It Should Not)",
    excerpt: "Not every question belongs to a bot. Here is how to draw the line between what to automate and what needs a human touch.",
    category: "AI Agents",
    date: "June 10, 2026",
    content: ""
  },
  {
    slug: "why-generic-chatbots-fail",
    title: "Why Generic Chatbots Fail and Custom Agents Do Not",
    excerpt: "Generic chatbots work for everyone, which means they work for nobody. Here is why custom beats template every time.",
    category: "AI Agents",
    date: "June 17, 2026",
    content: ""
  },
  {
    slug: "your-ai-agents-first-week",
    title: "Your AI Agent's First Week: What to Expect",
    excerpt: "Your AI agent will not be perfect on day one, but by day five you will wonder how you managed without it.",
    category: "AI Agents",
    date: "June 24, 2026",
    content: ""
  },
  {
    slug: "the-lead-you-never-knew-you-lost",
    title: "The Lead You Never Knew You Lost",
    excerpt: "The scariest leads to lose are the ones you never knew existed in the first place.",
    category: "Lead Generation",
    date: "July 1, 2026",
    content: ""
  },
  {
    slug: "why-form-fills-are-dying",
    title: "Why Form Fills Are Dying (And What Replaces Them)",
    excerpt: "Contact forms convert at 2-3%. Conversational AI converts at 15-25%. The era of filling out five fields and waiting is over.",
    category: "Lead Generation",
    date: "July 8, 2026",
    content: ""
  },
  {
    slug: "lead-scoring-for-small-business",
    title: "Lead Scoring for Small Business: Hot, Warm, Cold",
    excerpt: "Enterprise companies spend $50K on lead scoring software. You need three buckets and a system that fills them automatically.",
    category: "Lead Generation",
    date: "July 15, 2026",
    content: ""
  },
  {
    slug: "follow-up-emails-that-dont-sound-like-spam",
    title: "Follow-Up Emails That Do Not Sound Like Spam",
    excerpt: "The difference between a deleted email and a booked appointment is one thing: context from the original conversation.",
    category: "Lead Generation",
    date: "July 22, 2026",
    content: ""
  },
  {
    slug: "how-many-leads-is-your-website-losing",
    title: "How Many Leads Is Your Website Actually Losing?",
    excerpt: "A 10-minute audit that reveals exactly how many potential customers leave your site every month without making contact.",
    category: "Lead Generation",
    date: "July 29, 2026",
    content: ""
  },
  {
    slug: "ai-for-small-business-whats-real",
    title: "AI for Small Business: What is Real and What is Marketing",
    excerpt: "Every week a new headline says AI will revolutionize your business. Here is what actually works today and what is still hype.",
    category: "Small Business AI",
    date: "August 5, 2026",
    content: ""
  },
  {
    slug: "you-dont-need-to-understand-ai",
    title: "You Do Not Need to Understand AI to Use It",
    excerpt: "You do not know how your furnace works either. You just know it keeps you warm. AI should work the same way for your business.",
    category: "Small Business AI",
    date: "August 12, 2026",
    content: ""
  },
  {
    slug: "the-197-month-employee",
    title: "The $197/Month Employee That Never Calls in Sick",
    excerpt: "A part-time receptionist costs $2,000/month and works 30 hours. An AI agent costs $197/month and works all 720.",
    category: "Small Business AI",
    date: "August 19, 2026",
    content: ""
  },
  {
    slug: "internal-knowledge-bots",
    title: "Internal Knowledge Bots: Stop Answering the Same Questions",
    excerpt: "Your team asks you the same questions every week. An internal knowledge bot gives them instant answers from your own docs.",
    category: "Small Business AI",
    date: "August 26, 2026",
    content: ""
  },
  {
    slug: "what-happens-when-ai-gets-a-question-wrong",
    title: "What Happens When AI Gets a Question Wrong?",
    excerpt: "The risk is not AI giving a slightly imperfect answer. The risk is saying nothing at all while leads walk out the door.",
    category: "Small Business AI",
    date: "September 2, 2026",
    content: ""
  },
  {
    slug: "ai-pricing-why-cheap-tools-cost-more",
    title: "AI Pricing: Why Cheap Tools Cost You More",
    excerpt: "A $29/month chatbot that loses two leads costs more than a $197/month agent that captures them. Do the math.",
    category: "Small Business AI",
    date: "September 9, 2026",
    content: ""
  },
  {
    slug: "when-does-your-business-need-custom-software",
    title: "When Does Your Business Actually Need Custom Software?",
    excerpt: "Most businesses do not need custom software. Here are the four signals that mean you actually do.",
    category: "Software & SaaS",
    date: "September 16, 2026",
    content: ""
  },
  {
    slug: "mvp-vs-full-product",
    title: "MVP vs Full Product: How to Decide What to Build First",
    excerpt: "Your full product costs $50K and takes 6 months. Your MVP costs $10K, takes 6 weeks, and tells you if anyone cares.",
    category: "Software & SaaS",
    date: "September 23, 2026",
    content: ""
  },
  {
    slug: "the-real-cost-of-building-saas",
    title: "The Real Cost of Building a SaaS Product in 2026",
    excerpt: "Not $0 with no-code. Not $5M with a VC round. The real answer is $20K-$35K for a working product with paying users.",
    category: "Software & SaaS",
    date: "September 30, 2026",
    content: ""
  },
  {
    slug: "why-we-build-with-nextjs",
    title: "Why We Build With Next.js (And What That Means for You)",
    excerpt: "You do not need to care about frameworks. But the right choice means faster builds, lower costs, and no vendor lock-in.",
    category: "Software & SaaS",
    date: "October 7, 2026",
    content: ""
  },
  {
    slug: "how-duelly-went-from-idea-to-live-saas",
    title: "How Duelly Went From Idea to Live SaaS in 8 Weeks",
    excerpt: "We spotted a gap between traditional SEO and AI visibility, built a product to audit it, and had paying users in 8 weeks.",
    category: "Case Studies",
    date: "October 14, 2026",
    content: ""
  },
  {
    slug: "building-a-prospecting-tool-marketmojo",
    title: "Building a Prospecting Tool: The MarketMojo Story",
    excerpt: "Web agencies waste hours researching prospects manually. We built a tool that does it in 30 seconds with a branded PDF report.",
    category: "Case Studies",
    date: "October 21, 2026",
    content: ""
  },
  {
    slug: "what-we-learned-deploying-ai-agents",
    title: "What We Learned Deploying AI Agents to Real Businesses",
    excerpt: "After deploying AI agents to real businesses in New Brunswick, here are the patterns nobody warned us about.",
    category: "Case Studies",
    date: "October 28, 2026",
    content: ""
  },
  {
    slug: "the-atlantic-canada-ai-opportunity",
    title: "The Atlantic Canada AI Opportunity Nobody is Talking About",
    excerpt: "50,000+ small businesses with zero AI integration. Big tech is not coming for them. That is exactly the opportunity.",
    category: "Small Business AI",
    date: "November 4, 2026",
    content: ""
  },
]
