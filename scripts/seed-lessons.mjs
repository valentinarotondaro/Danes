// scripts/seed-lessons.mjs
//
// Fills every course with 2 modules × 3 lessons: a YouTube video and the
// words of the lesson ("Danish | English"). Courses are found by title.
//   npm run seed:lessons
// Safe to run twice: a lesson whose title already exists in that course is skipped.
// Uses the server API key (APPWRITE_API_KEY), never a VITE_ variable.

import 'dotenv/config'
import { Client, Databases, ID, Query } from 'node-appwrite'

const ENDPOINT = process.env.APPWRITE_ENDPOINT
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID
const API_KEY = process.env.APPWRITE_API_KEY
const DB_ID = process.env.APPWRITE_DATABASE_ID

for (const [name, val] of Object.entries({ ENDPOINT, PROJECT_ID, API_KEY, DB_ID })) {
  if (!val) {
    console.error(`Missing ${name} in your .env — add it before running this script.`)
    process.exit(1)
  }
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY)
const databases = new Databases(client)

const yt = (id) => `https://www.youtube.com/watch?v=${id}`

// course title → modules → lessons
const COURSES = {
  'Danish for beginners': [
    {
      title: 'First words',
      lessons: [
        { title: 'Hej! The basics every beginner needs', video: 'xLhUXmiN7EQ', words: ['Hej | Hi', 'Jeg hedder … | My name is …', 'Hvordan har du det? | How are you?', 'Tak | Thank you'] },
        { title: 'Numbers from 0 and up', video: 'lfkiMv8UptE', words: ['en, to, tre | one, two, three', 'halvtreds | fifty', 'Hvor meget koster det? | How much is it?'] },
        { title: 'Days of the week', video: 'v6dNVmWx0g8', words: ['mandag | Monday', 'fredag | Friday', 'i weekenden | at the weekend'] },
      ],
    },
    {
      title: 'The sounds of Danish',
      lessons: [
        { title: 'All the Danish vowels, A to Å', video: '5uiLzegUtnY', words: ['æble | apple', 'øl | beer', 'å | small river'] },
        { title: 'The soft D', video: 'bqGgcPKsbPQ', words: ['mad | food', 'god | good', 'rødgrød med fløde | red berry pudding with cream'] },
        { title: 'Your first conversation', video: 'b5iuG2ExOcU', words: ['Hvor kommer du fra? | Where are you from?', 'Jeg bor i … | I live in …', 'Undskyld? | Sorry? / Excuse me?'] },
      ],
    },
  ],

  'Danish for work': [
    {
      title: 'Getting the job',
      lessons: [
        { title: 'Phrases for work and everyday life', video: 'J44vpSYsQm8', words: ['et job | a job', 'en kollega | a colleague', 'Hvad laver du? | What do you do for a living?'] },
        { title: 'Your first job interview in Danish', video: 'iXAVCINlauI', words: ['en jobsamtale | a job interview', 'erfaring | experience', 'Jeg er god til … | I am good at …'] },
        { title: 'What happens at a Danish job interview', video: 'NOj6eXHt3Vo', words: ['en ansøgning | an application', 'et CV | a CV', 'Hvorfor søger du jobbet? | Why are you applying for the job?'] },
      ],
    },
    {
      title: 'At the office',
      lessons: [
        { title: 'Danish business language', video: 'w_2-BLYUa38', words: ['et møde | a meeting', 'en dagsorden | an agenda', 'Kan du gentage det? | Can you say that again?'] },
        { title: 'Working in Denmark: 7 must-knows', video: 'V6pmEFGf8dM', words: ['flad struktur | flat hierarchy', 'frokost | lunch', 'Jeg er enig | I agree'] },
        { title: 'The Danish working culture', video: 'svan6e_J-to', words: ['tillid | trust', 'fleksibel arbejdstid | flexible working hours', 'fyraften | end of the working day'] },
      ],
    },
  ],

  'Danish for the exam': [
    {
      title: 'The exam',
      lessons: [
        // "How the exam works" already exists as lesson 1, so these start at 2
        { title: 'How the oral part of PD3 works', video: 'Ec8B9wiuGXw', words: ['den mundtlige prøve | the oral exam', 'en censor | an external examiner', 'at forberede sig | to prepare'] },
        { title: 'How the written part of PD3 works', video: 'B8xUSRDWTr8', words: ['den skriftlige prøve | the written exam', 'en opgave | a task', 'læseforståelse | reading comprehension'] },
      ],
    },
    {
      title: 'Practise the oral exam',
      lessons: [
        { title: 'An example topic for the oral exam', video: 'PdJBlCuKiA4', words: ['et emne | a topic', 'Efter min mening … | In my opinion …', 'på den ene side … på den anden side | on the one hand … on the other hand'] },
        { title: 'An oral exam at Studieskolen', video: 'PfZ2E248uWE', words: ['at argumentere | to argue', 'et eksempel | an example', 'Jeg vil gerne tilføje … | I would like to add …'] },
        { title: 'Oral communication: an exam task', video: 'upMjSskz-qI', words: ['en samtale | a conversation', 'at stille spørgsmål | to ask questions', 'Hvad mener du? | What do you think?'] },
      ],
    },
  ],
}

const courses = (await databases.listDocuments(DB_ID, 'courses', [Query.limit(100)])).documents

for (const [courseTitle, modules] of Object.entries(COURSES)) {
  const course = courses.find((c) => c.title.trim().toLowerCase() === courseTitle.toLowerCase())
  if (!course) {
    console.warn(`⚠  No course called "${courseTitle}" — skipped.`)
    continue
  }

  const existing = (await databases.listDocuments(DB_ID, 'lessons', [Query.equal('courseId', course.$id), Query.limit(100)])).documents
  const has = (title) => existing.some((l) => l.title.trim().toLowerCase() === title.toLowerCase())

  let created = 0
  for (const [m, mod] of modules.entries()) {
    // Number the lessons after the ones already in this module
    let order = existing.filter((l) => (l.module ?? 1) === m + 1).length
    for (const lesson of mod.lessons) {
      if (has(lesson.title)) continue
      order += 1
      await databases.createDocument(DB_ID, 'lessons', ID.unique(), {
        courseId: course.$id,
        title: lesson.title,
        order,
        module: m + 1,
        moduleTitle: mod.title,
        videoUrl: yt(lesson.video),
        words: lesson.words,
      })
      created += 1
    }
  }
  console.log(`✓ ${courseTitle}: ${created} lessons added`)
}

console.log('Done.')
