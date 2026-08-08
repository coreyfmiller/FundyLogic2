export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
}

// Blog content is stored separately as HTML for each post
// This file contains metadata for listing/SEO purposes

export const posts: BlogPost[] = [
  { slug: 'what-an-ai-chat-agent-actually-does', title: 'What an AI Chat Agent Actually Does (No Hype)', excerpt: 'AI chat agents are not sci-fi robots or glorified FAQ pages. Here is what actually happens when one runs on your website.', category: 'AI Agents', date: 'July 28, 2026' },
  { slug: 'is-your-website-losing-leads-while-you-sleep', title: 'Is Your Website Losing Leads While You Sleep?', excerpt: 'More than half your website traffic comes outside business hours. Every unanswered visitor is revenue walking out the door.', category: 'Lead Generation', date: 'August 4, 2026' },
  { slug: 'we-built-an-ai-agent-for-an-accounting-firm', title: 'We Built an AI Agent for an Accounting Firm. Here is What Happened.', excerpt: 'How a solo accountant in rural New Brunswick reclaimed 8+ hours a week by letting an AI agent handle client inquiries 24/7.', category: 'Case Studies', date: 'August 11, 2026' },
  { slug: 'a-chatbot-is-not-an-ai-agent', title: 'A Chatbot Is Not an AI Agent. Here is the Difference.', excerpt: 'That chatbot on your website is probably embarrassing your business right now. Here is why AI agents are a completely different thing.', category: 'AI Agents', date: 'August 18, 2026' },
  { slug: 'questions-your-ai-agent-should-answer', title: 'The Questions Your AI Agent Should Answer (And the Ones It Should Not)', excerpt: 'Not every question belongs to a bot. Here is how to draw the line between what to automate and what needs a human touch.', category: 'AI Agents', date: 'August 25, 2026' },
  { slug: 'why-generic-chatbots-fail', title: 'Why Generic Chatbots Fail and Custom Agents Do Not', excerpt: 'Generic chatbots work for everyone, which means they work for nobody. Here is why custom beats template every time.', category: 'AI Agents', date: 'September 1, 2026' },
  { slug: 'your-ai-agents-first-week', title: 'Your AI Agent\'s First Week: What to Expect', excerpt: 'Your AI agent will not be perfect on day one, but by day five you will wonder how you managed without it.', category: 'AI Agents', date: 'September 8, 2026' },
  { slug: 'the-lead-you-never-knew-you-lost', title: 'The Lead You Never Knew You Lost', excerpt: 'The scariest leads to lose are the ones you never knew existed in the first place.', category: 'Lead Generation', date: 'September 15, 2026' },
  { slug: 'why-form-fills-are-dying', title: 'Why Form Fills Are Dying (And What Replaces Them)', excerpt: 'Contact forms convert at 2-3%. Conversational AI converts at 15-25%. The era of filling out five fields and waiting is over.', category: 'Lead Generation', date: 'September 22, 2026' },
  { slug: 'lead-scoring-for-small-business', title: 'Lead Scoring for Small Business: Hot, Warm, Cold', excerpt: 'Enterprise companies spend $50K on lead scoring software. You need three buckets and a system that fills them automatically.', category: 'Lead Generation', date: 'September 29, 2026' },
  { slug: 'follow-up-emails-that-dont-sound-like-spam', title: 'Follow-Up Emails That Do Not Sound Like Spam', excerpt: 'The difference between a deleted email and a booked appointment is one thing: context from the original conversation.', category: 'Lead Generation', date: 'October 6, 2026' },
  { slug: 'how-many-leads-is-your-website-losing', title: 'How Many Leads Is Your Website Actually Losing?', excerpt: 'A 10-minute audit that reveals exactly how many potential customers leave your site every month without making contact.', category: 'Lead Generation', date: 'October 13, 2026' },
  { slug: 'ai-for-small-business-whats-real', title: 'AI for Small Business: What is Real and What is Marketing', excerpt: 'Every week a new headline says AI will revolutionize your business. Here is what actually works today and what is still hype.', category: 'Small Business AI', date: 'October 20, 2026' },
  { slug: 'the-197-month-employee', title: 'The $197/Month Employee That Never Calls in Sick', excerpt: 'A part-time receptionist costs $2,000/month and works 30 hours. An AI agent costs $197/month and works all 720.', category: 'Small Business AI', date: 'November 3, 2026' },
  { slug: 'how-duelly-went-from-idea-to-live-saas', title: 'How Duelly Went From Idea to Live SaaS in 8 Weeks', excerpt: 'We spotted a gap between traditional SEO and AI visibility, built a product to audit it, and had paying users in 8 weeks.', category: 'Case Studies', date: 'December 29, 2026' },
]
