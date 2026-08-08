export type Testimonial = {
  name: string
  role: string
  company: string
  content: string
  stars: number
  location: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Jordan Kessler',
    role: 'Founder',
    company: 'MarketMojo.ai',
    content: 'FundyLogic took our concept and turned it into a fully functional SaaS platform in record time. The AI-powered prospecting engine, the branded PDF reports, the pipeline tracking. All of it works flawlessly. We went from idea to paying customers in weeks, not months.',
    stars: 5,
    location: 'Toronto, ON',
  },
  {
    name: 'Nate Holloway',
    role: 'Co-Founder',
    company: 'Duelly.ai',
    content: 'We needed a technical partner who could build a complex audit engine with real-time AI analysis, and FundyLogic delivered beyond expectations. The platform handles thousands of scans, integrates multiple data sources, and the UI is clean enough that non-technical users love it.',
    stars: 5,
    location: 'Vancouver, BC',
  },
  {
    name: 'Ron Miller',
    role: 'Principal Consultant',
    company: 'RP Miller Consulting',
    content: 'FundyLogic built a custom AI chatbot that handles client inquiries 24/7. It qualifies leads and answers tax questions while I focus on billable work. The chatbot alone saves me hours every week.',
    stars: 5,
    location: 'Lakeville Corner, NB',
  },
]
