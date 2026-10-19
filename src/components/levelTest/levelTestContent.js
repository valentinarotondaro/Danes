// src/components/levelTest/levelTestContent.js
//
// The level test's questions and texts. Kept as plain data, so adding or
// changing a question never touches the components.
//
// kind: 'self'    → no right answer; each option is worth `points` (0–3)
//       'choice'  → one correct `answer`, worth `weight` points
//       'reading' → like 'choice', but shows the letter `letterId` next to it
// weight: 1 = A1 question, 2 = A2, 3 = B1

export const PARTS = {
  about: 'About you',
  grammar: 'Words and grammar',
  reading: 'Reading',
}

export const LETTERS = {
  doctor: {
    from: 'Lægehuset Nørregade',
    tag: 'Brev',
    greeting: 'Kære Sofia Martínez',
    lines: ['Du har fået en tid hos din læge.'],
    highlight: { title: 'Tirsdag 4. november kl. 9.30', text: 'Nørregade 12, 8000 Aarhus C' },
    after: ['Kan du ikke komme? Ring på 86 12 34 56 senest dagen før.'],
    signOff: ['Med venlig hilsen', 'Lægehuset Nørregade'],
  },
  work: {
    from: 'Lars Holm',
    tag: 'Email',
    greeting: 'Hej alle',
    lines: [
      'Mødet på fredag er flyttet fra kl. 10 til kl. 13, fordi kantinen holder lukket om formiddagen.',
      'Husk at sende jeres slides til mig senest torsdag.',
    ],
    highlight: null,
    after: [],
    signOff: ['Mvh.', 'Lars'],
  },
}

export const QUESTIONS = [
  {
    id: 'q1', part: 'about', kind: 'self',
    prompt: 'How much Danish do you know today?',
    hint: 'Pick the one closest to you. There is no wrong answer here.',
    options: [
      { id: 'none', text: 'None yet', detail: 'I’m starting from hej.', points: 0 },
      { id: 'words', text: 'A few words', detail: 'I can greet people and order a coffee.', points: 1 },
      { id: 'talk', text: 'Simple conversations', detail: 'I can talk about my day, slowly.', points: 2 },
      { id: 'work', text: 'Work and the news', detail: 'I follow most of a meeting or the TV news.', points: 3 },
    ],
  },
  {
    id: 'q2', part: 'about', kind: 'self',
    prompt: 'Which of these could you do in Danish this week?',
    hint: 'Choose the hardest one you could manage.',
    options: [
      { id: 'nothing', text: 'Not much yet', detail: 'I would switch to English.', points: 0 },
      { id: 'cafe', text: 'Order at a café', detail: 'And understand the price.', points: 1 },
      { id: 'phone', text: 'Book a doctor’s appointment by phone', detail: 'And understand the time.', points: 2 },
      { id: 'email', text: 'Write an email to a colleague', detail: 'About something that changed at work.', points: 3 },
    ],
  },
  {
    id: 'q3', part: 'grammar', kind: 'choice', weight: 1,
    prompt: 'Sofia is telling a new colleague where she lives.',
    sentence: 'Jeg ___ i Aarhus.',
    options: [{ id: 'bor', text: 'bor' }, { id: 'er', text: 'er' }, { id: 'har', text: 'har' }, { id: 'hedder', text: 'hedder' }],
    answer: 'bor',
  },
  {
    id: 'q4', part: 'grammar', kind: 'choice', weight: 1,
    prompt: 'Tomas introduces his daughter.',
    sentence: 'Hun ___ Emma.',
    options: [{ id: 'hedder', text: 'hedder' }, { id: 'er', text: 'er' }, { id: 'har', text: 'har' }, { id: 'bor', text: 'bor' }],
    answer: 'hedder',
  },
  {
    id: 'q5', part: 'grammar', kind: 'choice', weight: 2,
    prompt: 'Galina talks about last night.',
    sentence: 'I går ___ vi i biografen.',
    options: [{ id: 'er', text: 'er' }, { id: 'var', text: 'var' }, { id: 'vaere', text: 'være' }, { id: 'vaeret', text: 'været' }],
    answer: 'var',
  },
  {
    id: 'q6', part: 'grammar', kind: 'choice', weight: 2,
    prompt: 'You ask a neighbour for help.',
    sentence: 'Kan du ___ mig med det?',
    options: [{ id: 'hjaelper', text: 'hjælper' }, { id: 'hjaelpe', text: 'hjælpe' }, { id: 'hjalp', text: 'hjalp' }, { id: 'hjulpet', text: 'hjulpet' }],
    answer: 'hjaelpe',
  },
  {
    id: 'q7', part: 'grammar', kind: 'choice', weight: 2,
    prompt: 'You tell your teacher why you can’t come.',
    sentence: 'Jeg kommer ikke i morgen, ___ jeg er syg.',
    options: [{ id: 'men', text: 'men' }, { id: 'fordi', text: 'fordi' }, { id: 'eller', text: 'eller' }, { id: 'hvis', text: 'hvis' }],
    answer: 'fordi',
  },
  {
    id: 'q8', part: 'grammar', kind: 'choice', weight: 3,
    prompt: 'You talk about learning Danish.',
    sentence: 'Hvis jeg ___ mere tid, ville jeg læse dansk hver dag.',
    options: [{ id: 'har', text: 'har' }, { id: 'havde', text: 'havde' }, { id: 'have', text: 'have' }, { id: 'haft', text: 'haft' }],
    answer: 'havde',
  },
  {
    id: 'q9', part: 'reading', kind: 'reading', weight: 2, letterId: 'doctor',
    prompt: 'When is Sofia’s appointment?',
    options: [
      { id: 'tue930', text: 'Tuesday at 9:30' },
      { id: 'mon930', text: 'Monday at 9:30' },
      { id: 'tue1200', text: 'Tuesday at 12:00' },
      { id: 'before', text: 'The day before, by phone' },
    ],
    answer: 'tue930',
  },
  {
    id: 'q10', part: 'reading', kind: 'reading', weight: 2, letterId: 'doctor',
    prompt: 'What should Sofia do if she can’t come?',
    options: [
      { id: 'call', text: 'Call at least a day before' },
      { id: 'email', text: 'Send an email to the doctor' },
      { id: 'later', text: 'Come on another day' },
      { id: 'nothing', text: 'Nothing, the time just moves' },
    ],
    answer: 'call',
  },
  {
    id: 'q11', part: 'reading', kind: 'reading', weight: 3, letterId: 'work',
    prompt: 'Why has the meeting moved?',
    options: [
      { id: 'canteen', text: 'The canteen is closed in the morning' },
      { id: 'lars', text: 'Lars is busy at 10' },
      { id: 'slides', text: 'The slides are not ready' },
      { id: 'friday', text: 'Friday is a holiday' },
    ],
    answer: 'canteen',
  },
  {
    id: 'q12', part: 'reading', kind: 'reading', weight: 3, letterId: 'work',
    prompt: 'What must everyone do by Thursday?',
    options: [
      { id: 'slides', text: 'Send their slides to Lars' },
      { id: 'lunch', text: 'Book lunch in the canteen' },
      { id: 'reply', text: 'Reply if they can come at 13' },
      { id: 'room', text: 'Find a new meeting room' },
    ],
    answer: 'slides',
  },
]

// What each result says. `course` is matched against the courses' `level` in Appwrite.
export const LEVEL_INFO = {
  A1: {
    name: 'A1 Beginner',
    summary: 'You’re at the start, and that’s the best place to build from. First come the words you need every day.',
    can: ['Say hej and introduce yourself', 'Recognise common words on signs and menus', 'Follow very slow, simple Danish'],
    next: ['Order at the bakery', 'Talk about where you live and work', 'Read the key facts in a short letter'],
  },
  A2: {
    name: 'A2 Elementary',
    summary: 'You get by in everyday situations. The next step is Danish you can use at work and in longer conversations.',
    can: ['Introduce yourself and talk about your week', 'Order, ask for prices and understand the answer', 'Read the key facts in a short brev from the kommune'],
    next: ['Write a short work email', 'Follow a team meeting', 'Hold your own in small talk at lunch'],
  },
  B1: {
    name: 'B1 Intermediate',
    summary: 'You handle most everyday Danish. Now it’s about confidence, nuance and getting ready for Prøve i Dansk.',
    can: ['Follow a work meeting', 'Write emails about plans and changes', 'Read letters and short articles'],
    next: ['Argue for your opinion', 'Write longer, structured texts', 'Pass Prøve i Dansk 3 or Studieprøven'],
  },
}