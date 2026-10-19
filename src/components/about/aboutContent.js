// All About us copy and images in one place. Components only render it.
import bakeryImg from '../../assets/img/bakery.jpg'
import laptopImg from '../../assets/img/learner-laptop.jpg'
import canalImg from '../../assets/img/canal-walk.jpg'
import valentinaImg from '../../assets/img/team-valentina.jpg'
import jonasImg from '../../assets/img/team-jonas.jpg'
import saraImg from '../../assets/img/team-sara.jpg'
import metteImg from '../../assets/img/team-mette.jpg'
import madsImg from '../../assets/img/team-mads.jpg'
import frejaImg from '../../assets/img/team-freja.jpg'
import lineImg from '../../assets/img/team-line.jpg'

// tone picks the card colour: 'sky' or 'red' (classes live in AboutValues)
export const VALUES = [
  { n: '01', tone: 'sky', title: 'Community', text: 'You learn faster, and stay longer, when you learn with people.' },
  { n: '02', tone: 'red', title: 'Confidence', text: 'Speaking before you feel ready, in a room where that’s normal.' },
  { n: '03', tone: 'sky', title: 'Support', text: 'Hosts and teachers who remember what being new here felt like.' },
  { n: '04', tone: 'red', title: 'Belonging', text: 'Danish as a way in: to your street, your job, your city.' },
  { n: '05', tone: 'sky', title: 'Opportunities', text: 'Better jobs, exams passed, doors that open once you speak.' },
  { n: '06', tone: 'red', title: 'Motivation', text: 'Small wins every week, so you keep coming back.' },
]

export const PILLARS = [
  { verb: 'Learn it', title: 'Courses', text: 'Self-paced video lessons from A1 to B1.', img: bakeryImg, alt: 'A learner ordering pastries in a bakery', to: '/courses' },
  { verb: 'Say it', title: 'Speaking Club', text: 'Small video groups every Friday.', img: laptopImg, alt: 'A learner laughing at her laptop during a class', to: '/live-classes' },
  { verb: 'Live it', title: 'Events', text: 'Walks, food and hygge in your city.', img: canalImg, alt: 'Learners walking along a canal', to: '/events' },
]

export const CITIES = [
  { name: 'Copenhagen', what: 'Events and office', contact: '(45) 5515-8465' },
  { name: 'Aarhus', what: 'Events and office', contact: '(45) 5515-7854' },
  { name: 'Esbjerg', what: 'Events and office', contact: '(45) 5515-2145' },
  { name: 'Odense', what: 'Monthly events', contact: 'contact@danes.dk' },
]

export const TEAM = [
  { name: 'Valentina', role: 'Founder', img: valentinaImg, alt: 'Valentina, laughing by a Copenhagen canal in a red beanie', line: 'Moved to Denmark knowing only “tak”. Started DANES to build the bridge she was missing.' },
  { name: 'Jonas', role: 'Head teacher · Aarhus', img: jonasImg, alt: 'Jonas, laughing at a café table by the window', line: 'Born and raised in Aarhus, one of our native teachers. Danish the way it’s spoken at the bakery, not in the textbook.' },
  { name: 'Sara', role: 'Community lead', img: saraImg, alt: 'Sara, smiling on a colourful Copenhagen street in a sky blue scarf', line: 'Plans the walks, the bakery mornings and the hygge nights. Knows everyone by name.' },
  { name: 'Mette', role: 'Teacher · Aarhus', img: metteImg, alt: 'Mette, laughing with a coffee in a bright Aarhus café', line: 'Native Dane and A1–A2 specialist. Speaks slowly, laughs often.' },
  { name: 'Mads', role: 'Teacher · Copenhagen', img: madsImg, alt: 'Mads, smiling outside a red-brick building with bicycles behind him', line: 'Native Dane who preps learners for Prøve i Dansk and Studieprøven.' },
  { name: 'Freja', role: 'Speaking Club host · Esbjerg', img: frejaImg, alt: 'Freja, laughing by Esbjerg harbour in a cream beanie', line: 'Runs the Friday groups and keeps every voice in the room.' },
  { name: 'Line', role: 'Events host · Odense', img: lineImg, alt: 'Line, smiling on a cobblestone street in Odense in a sky blue scarf', line: 'Turns city walks and hygge nights into real conversations.' },
]