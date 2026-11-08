export interface BlogPost {
  slug: string;
  category: 'Complete health' | 'Cosmetic care' | 'Prevention' | 'Family care';
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
}

export interface BlogArticleSection {
  id: string;
  number: string;
  eyebrow: string;
  heading: string;
  emphasis: string;
  paragraphs: string[];
  quote?: string;
}

export interface BlogArticleSignal {
  title: string;
  text: string;
}

export interface BlogArticle {
  slug: string;
  pageTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  emphasis: string;
  date: string;
  readTime: string;
  author: string;
  heroIntro: string;
  heroImage: string;
  heroAlt: string;
  contextImage: string;
  contextAlt: string;
  contextCaption: string;
  navImage: string;
  navAlt: string;
  lede: string;
  ledeEmphasis: string;
  sections: [BlogArticleSection, BlogArticleSection, BlogArticleSection];
  signals: [BlogArticleSignal, BlogArticleSignal, BlogArticleSignal];
  checklistTitle: string;
  checklist: string[];
  closing: string;
  footerEyebrow: string;
  footerTitle: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'complete-health-dental-exam',
    category: 'Complete health',
    title: 'What a complete-health dental exam actually connects',
    excerpt: 'A thoughtful exam looks beyond a single tooth. Here is how records, symptoms, airway, inflammation and your priorities become one clearer picture.',
    date: 'November 8, 2026',
    readTime: '7 min read',
    image: '/images/generated/unique/blog/blog-card-complete-health-exam.webp',
    imageAlt: 'A dentist reviewing health context with a patient on a tablet',
    featured: true,
  },
  {
    slug: 'natural-looking-teeth-whitening',
    category: 'Cosmetic care',
    title: 'Whitening that still looks unmistakably like you',
    excerpt: 'Brighter is not one universal shade. A natural result begins with enamel, existing dental work, skin tone and the details you want to keep.',
    date: 'November 5, 2026',
    readTime: '5 min read',
    image: '/images/generated/unique/blog/blog-card-natural-whitening.webp',
    imageAlt: 'A patient and dentist discussing natural tooth shade with a mirror',
  },
  {
    slug: 'why-gum-health-matters',
    category: 'Prevention',
    title: 'Why gum health belongs in the bigger health conversation',
    excerpt: 'Bleeding, inflammation and bone support can say more than the mirror reveals. Learn what the measurements mean and why timing matters.',
    date: 'October 29, 2026',
    readTime: '6 min read',
    image: '/images/generated/unique/blog/blog-card-gum-health.webp',
    imageAlt: 'A dental hygienist explaining gum health with a tooth model',
  },
  {
    slug: 'calmer-first-dental-visit',
    category: 'Family care',
    title: 'A first dental visit small enough to feel safe',
    excerpt: 'For a child, familiarity comes before cooperation. The first visit can build trust without asking for more than the moment allows.',
    date: 'October 21, 2026',
    readTime: '4 min read',
    image: '/images/generated/unique/blog/blog-card-child-first-visit.webp',
    imageAlt: 'A pediatric dentist introducing a dental mirror to a child',
  },
];

export const blogArticles: Record<string, BlogArticle> = {
  'complete-health-dental-exam': {
    slug: 'complete-health-dental-exam',
    pageTitle: 'What a Complete-Health Dental Exam Connects | Smiles by Noetzel',
    metaDescription: 'Learn how a complete-health dental exam connects oral findings, health context, records and personal priorities into a clearer next step.',
    kicker: 'Complete health · Clinical perspective 01',
    title: 'What a complete-health dental exam',
    emphasis: 'actually connects.',
    date: 'November 8, 2026',
    readTime: '7 min read',
    author: 'Smiles by Noetzel clinical team',
    heroIntro: 'A thoughtful dental exam is not a hunt for isolated problems. It is a way to connect what you notice, what the records show and what may deserve a wider conversation.',
    heroImage: '/images/generated/unique/blog/complete-health-exam-detail-hero.webp',
    heroAlt: 'A dentist and patient reviewing a complete-health care overview',
    contextImage: '/images/generated/unique/blog/complete-health-exam-detail-context.webp',
    contextAlt: 'Health records and dental tools arranged for a complete-health conversation',
    contextCaption: 'Different records become useful when they are read as one context—not as separate checkboxes.',
    navImage: '/images/generated/unique/blog/complete-health-exam-nav-editorial.webp',
    navAlt: 'A dentist and patient reviewing a care plan together',
    lede: 'The phrase complete health can sound broad. In practice, it begins with something very grounded:',
    ledeEmphasis: 'enough context to understand what the mouth is showing, what it is not showing and which questions belong in the room.',
    sections: [
      {
        id: 'more-than-teeth', number: '01', eyebrow: 'The wider view',
        heading: 'An exam can begin with a tooth.', emphasis: 'It should not end there.',
        paragraphs: [
          'A tender tooth may be the immediate reason for the visit. But the responsible plan also considers the supporting bone and gums, the way the teeth meet, the condition of older dental work and the patient’s wider health history.',
          'Sleep quality, dry mouth, medications, inflammation, breathing patterns and changes in daily comfort can all alter what the clinical findings mean. That does not turn a dental visit into a medical diagnosis. It helps the dental team recognize when coordination or a wider question is appropriate.',
        ],
        quote: '“The goal is not to make every finding feel bigger. It is to make the picture complete enough that the next decision feels proportionate.”',
      },
      {
        id: 'records-connect', number: '02', eyebrow: 'What gets connected',
        heading: 'Good records do not replace', emphasis: 'a good conversation.',
        paragraphs: ['Images and measurements create a baseline. They can show changes that are easy to miss in the mirror and help distinguish what is stable from what is active. Their value grows when the team understands how you feel, what has changed and what matters most to you.'],
      },
      {
        id: 'next-step', number: '03', eyebrow: 'Turning context into care',
        heading: 'The clearest plan may be', emphasis: 'smaller than expected.',
        paragraphs: ['A complete view does not automatically mean more treatment. Sometimes it confirms that monitoring is responsible. Sometimes it changes the order of care. Sometimes it reveals that another clinician should be part of the conversation before a dental decision is made.'],
      },
    ],
    signals: [
      { title: 'Structure', text: 'Teeth, bone, gums, bite and existing dental work.' },
      { title: 'Function', text: 'Comfort, chewing, breathing, sleep and patterns of wear.' },
      { title: 'Context', text: 'Health history, medication, priorities and realistic timing.' },
    ],
    checklistTitle: 'A useful exam should leave you knowing:',
    checklist: ['what the team found and what appears stable;', 'which finding matters first—and why;', 'what can be monitored instead of treated today;', 'what the next appointment is meant to accomplish;', 'who to call if something changes.'],
    closing: 'That is the practical promise of complete-health dentistry: not a larger label, but a clearer relationship between the finding, the person and the next right step.',
    footerEyebrow: 'Have a question about your own picture?',
    footerTitle: 'Context becomes useful when it meets a real conversation.',
  },
  'natural-looking-teeth-whitening': {
    slug: 'natural-looking-teeth-whitening',
    pageTitle: 'Natural-Looking Teeth Whitening | Smiles by Noetzel',
    metaDescription: 'Learn how enamel, existing dental work, facial tone and thoughtful shade planning shape a natural-looking whitening result.',
    kicker: 'Cosmetic care · Clinical perspective 02',
    title: 'Whitening that still looks',
    emphasis: 'unmistakably like you.',
    date: 'November 5, 2026',
    readTime: '5 min read',
    author: 'Smiles by Noetzel cosmetic care team',
    heroIntro: 'A brighter smile is not a race toward the whitest shade. The most convincing result begins by noticing what belongs to you—and choosing what should change without erasing it.',
    heroImage: '/images/generated/unique/blog/natural-whitening-detail-hero.webp',
    heroAlt: 'A dentist and patient comparing a natural tooth shade together',
    contextImage: '/images/generated/unique/blog/natural-whitening-detail-context.webp',
    contextAlt: 'A clinician arranging a shade guide and whitening materials',
    contextCaption: 'Shade planning begins before whitening material is placed. Baseline color, sensitivity and existing restorations all shape the plan.',
    navImage: '/images/generated/unique/blog/natural-whitening-nav-editorial.webp',
    navAlt: 'A patient reviewing a natural tooth shade with a dentist',
    lede: '“Whiter” sounds like one destination. In a real smile, brightness is relational:',
    ledeEmphasis: 'enamel, skin tone, translucency and existing dental work all change how a shade is perceived.',
    sections: [
      {
        id: 'read-the-smile', number: '01', eyebrow: 'Read before brightening',
        heading: 'The starting shade is only', emphasis: 'one part of the story.',
        paragraphs: [
          'Coffee, tea, wine and everyday pigments often respond differently from the deeper color that belongs to the tooth itself. Enamel thickness and natural translucency also influence how quickly a smile changes and where warmth remains.',
          'Crowns, veneers and tooth-colored fillings do not whiten in the same way as natural enamel. Recognizing those boundaries early protects the result from becoming uneven or disconnected.',
        ],
        quote: '“A natural result does not announce the treatment. It lets the whole face feel a little more awake.”',
      },
      {
        id: 'plan-the-shade', number: '02', eyebrow: 'Calibrate the result',
        heading: 'The safest target is', emphasis: 'personal, not universal.',
        paragraphs: ['Baseline photographs and a shade guide make progress visible without relying on memory. Sensitivity history, enamel condition and the surrounding dental work help determine the method, pace and realistic stopping point.'],
      },
      {
        id: 'keep-the-result', number: '03', eyebrow: 'After the appointment',
        heading: 'Maintenance should feel', emphasis: 'lighter than the treatment.',
        paragraphs: ['A well-planned result is easier to maintain when daily habits and future touch-ups are proportionate. The aim is not constant whitening; it is knowing which changes are expected and when a small refresh is enough.'],
      },
    ],
    signals: [
      { title: 'Enamel', text: 'Natural shade, translucency, surface stain and sensitivity history.' },
      { title: 'Restorations', text: 'Crowns, veneers and fillings that will keep their original shade.' },
      { title: 'Context', text: 'Skin tone, lip line, expectations and the amount of change that feels right.' },
    ],
    checklistTitle: 'A thoughtful whitening plan should clarify:',
    checklist: ['which discoloration is likely to respond;', 'how existing dental work will relate to the new shade;', 'what sensitivity support may be appropriate;', 'how progress will be measured;', 'what maintenance is realistic after treatment.'],
    closing: 'The strongest cosmetic plan is rarely the loudest. It is the one that makes brightness feel intentional, healthy and still entirely your own.',
    footerEyebrow: 'Wondering what your natural target could be?',
    footerTitle: 'A shade conversation can make the whole plan feel clearer.',
  },
  'why-gum-health-matters': {
    slug: 'why-gum-health-matters',
    pageTitle: 'Why Gum Health Matters | Smiles by Noetzel',
    metaDescription: 'Understand what bleeding, inflammation, pocket measurements and bone support can reveal about gum health and the timing of care.',
    kicker: 'Prevention · Clinical perspective 03',
    title: 'Why gum health belongs in',
    emphasis: 'the bigger conversation.',
    date: 'October 29, 2026',
    readTime: '6 min read',
    author: 'Smiles by Noetzel preventive care team',
    heroIntro: 'Gums can look quiet while inflammation is developing below the surface. A few careful measurements turn an easy-to-ignore signal into something understandable and actionable.',
    heroImage: '/images/generated/unique/blog/gum-health-detail-hero.webp',
    heroAlt: 'A hygienist explaining gum health to a patient with a dental model',
    contextImage: '/images/generated/unique/blog/gum-health-detail-context.webp',
    contextAlt: 'A gum model, periodontal probe, floss and toothbrush prepared for an explanation',
    contextCaption: 'A measurement is not a judgment. It is a repeatable baseline that helps the team see stability, inflammation and change over time.',
    navImage: '/images/generated/unique/blog/gum-health-nav-editorial.webp',
    navAlt: 'A patient and hygienist sharing a relaxed gum-health conversation',
    lede: 'Bleeding gums are common, but common does not mean meaningless. The useful question is not whether to worry—it is',
    ledeEmphasis: 'what the pattern, measurements and supporting tissues are telling us together.',
    sections: [
      {
        id: 'read-the-signals', number: '01', eyebrow: 'Read the signals',
        heading: 'What happens at the gumline', emphasis: 'does not stay at the surface.',
        paragraphs: [
          'Plaque at the gumline can create inflammation that shows up as tenderness, redness or bleeding. When inflammation persists, the space around a tooth may deepen and become harder to clean effectively at home.',
          'The supporting bone matters too. Comparing current images and measurements with earlier records helps distinguish a temporary change from a pattern that deserves more focused care.',
        ],
        quote: '“The purpose of gum measurements is not to turn numbers into fear. It is to notice change early enough that the response can stay proportionate.”',
      },
      {
        id: 'measure-the-pattern', number: '02', eyebrow: 'What the numbers mean',
        heading: 'One reading matters less than', emphasis: 'the pattern around the mouth.',
        paragraphs: ['Pocket depths, bleeding points, recession, mobility and bone levels create a map. The pattern helps the team understand where home care is working, where access is difficult and whether professional cleaning intervals need to change.'],
      },
      {
        id: 'respond-early', number: '03', eyebrow: 'Make the next step useful',
        heading: 'Earlier care can keep', emphasis: 'the response smaller.',
        paragraphs: ['Sometimes the next step is refining a home-care technique. Sometimes it is a focused cleaning, closer monitoring or coordination with a periodontal specialist. The right response follows the evidence—not a one-size-fits-all schedule.'],
      },
    ],
    signals: [
      { title: 'Inflammation', text: 'Bleeding, redness, tenderness and the pattern around individual teeth.' },
      { title: 'Support', text: 'Pocket depth, recession, mobility and the level of supporting bone.' },
      { title: 'Change', text: 'How today’s measurements compare with earlier records and daily comfort.' },
    ],
    checklistTitle: 'A useful gum-health conversation should explain:',
    checklist: ['where inflammation is active;', 'whether supporting bone appears stable;', 'which home-care change has the highest value;', 'why a particular cleaning interval is recommended;', 'when monitoring is enough and when referral may help.'],
    closing: 'Gum health becomes less mysterious when the pattern is visible. Clear measurements make it possible to respond early, explain the reason and keep prevention connected to the person.',
    footerEyebrow: 'Not sure what your gum measurements mean?',
    footerTitle: 'The numbers become useful when someone explains the pattern.',
  },
  'calmer-first-dental-visit': {
    slug: 'calmer-first-dental-visit',
    pageTitle: 'A Calmer First Dental Visit for Children | Smiles by Noetzel',
    metaDescription: 'See how a child’s first dental visit can build familiarity, trust and useful prevention without asking for more than the moment allows.',
    kicker: 'Family care · Clinical perspective 04',
    title: 'A first dental visit',
    emphasis: 'small enough to feel safe.',
    date: 'October 21, 2026',
    readTime: '4 min read',
    author: 'Smiles by Noetzel family care team',
    heroIntro: 'For a child, cooperation grows from familiarity. A good first visit can introduce the room, the people and the tools while letting trust—not a checklist—set the pace.',
    heroImage: '/images/generated/unique/blog/calmer-first-visit-detail-hero.webp',
    heroAlt: 'A child and parent meeting a dentist through play with a stuffed animal',
    contextImage: '/images/generated/unique/blog/calmer-first-visit-detail-context.webp',
    contextAlt: 'Child-friendly sunglasses, mirror, toothbrush and picture cards in a calm dental room',
    contextCaption: 'Familiar objects and predictable steps help the room feel understandable before any examination begins.',
    navImage: '/images/generated/unique/blog/calmer-first-visit-nav-editorial.webp',
    navAlt: 'A child exploring a hand mirror with a parent and dental assistant',
    lede: 'A first visit does not have to accomplish everything to be successful. For many children, the most valuable outcome is simpler:',
    ledeEmphasis: 'the room felt safe, the adults listened and coming back no longer feels unknown.',
    sections: [
      {
        id: 'trust-first', number: '01', eyebrow: 'Trust before treatment',
        heading: 'Familiarity is', emphasis: 'a clinical tool too.',
        paragraphs: [
          'Seeing the chair move, touching the small mirror or practicing with a stuffed animal gives a child a way to understand what will happen next. Predictability reduces the pressure to be instantly brave.',
          'Parents also help set the emotional temperature. Simple, neutral language and a calm handoff let the dental team build a relationship without turning the visit into a test the child can pass or fail.',
        ],
        quote: '“A short visit that protects trust can be more valuable than a longer visit that asks for too much.”',
      },
      {
        id: 'follow-readiness', number: '02', eyebrow: 'Follow the child’s readiness',
        heading: 'The plan can adapt without', emphasis: 'losing its purpose.',
        paragraphs: ['Some children are ready for a full look right away. Others begin by counting a few teeth, meeting the suction straw or simply sitting beside a parent. The clinician can still observe development, comfort and risk while respecting the child’s pace.'],
      },
      {
        id: 'build-the-rhythm', number: '03', eyebrow: 'Make the next visit easier',
        heading: 'A calm ending becomes', emphasis: 'the beginning of continuity.',
        paragraphs: ['The next appointment should build on what already felt manageable. Repeating familiar language, celebrating specific moments of participation and keeping the interval appropriate turns one safe experience into a reliable care rhythm.'],
      },
    ],
    signals: [
      { title: 'Comfort', text: 'How the child responds to the room, sounds, chair and new people.' },
      { title: 'Development', text: 'Tooth eruption, bite growth, habits and age-appropriate oral changes.' },
      { title: 'Prevention', text: 'Home routines, diet patterns, fluoride needs and the next useful visit.' },
    ],
    checklistTitle: 'A successful first visit can leave a family knowing:',
    checklist: ['what the child was comfortable trying today;', 'which development and prevention points were observed;', 'what language to use at home before the next visit;', 'which daily routine deserves attention first;', 'when the next visit should happen and what it may include.'],
    closing: 'The first appointment is not only about today’s exam. It is the opening chapter of how a child learns to understand care, ask questions and return without fear.',
    footerEyebrow: 'Planning a child’s first visit?',
    footerTitle: 'A calm introduction can create years of easier care.',
  },
};

export const publishedBlogSlugs = new Set(Object.keys(blogArticles));

export const blogHref = (post: BlogPost) => `/blog/${post.slug}/`;
