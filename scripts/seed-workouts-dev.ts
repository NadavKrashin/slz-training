/**
 * Seed workouts into the deployed dev Firebase project (slz-training-dev).
 *
 * Prerequisites:
 *   gcloud auth application-default login
 *   (or set GOOGLE_APPLICATION_CREDENTIALS to a service account key file)
 *
 * Run with:
 *   npm run seed:workouts
 *
 * Seeds one workout per day for the past 14 days (including today).
 * Idempotent: skips dates that already have a workout.
 */

import * as admin from 'firebase-admin';

admin.initializeApp({ projectId: 'slz-training-dev' });
const db = admin.firestore();

interface Stage {
  id: string;
  name: string;
  type: 'exercise' | 'rest';
  durationSeconds: number;
  order: number;
  description?: string;
  gifUrl?: string;
}

interface WorkoutTemplate {
  title: string;
  description: string;
  stages: Omit<Stage, 'id'>[];
}

const WORKOUTS: WorkoutTemplate[] = [
  {
    title: 'אימון כוח עליון',
    description: 'שכמות, חזה וידיים — פתיחת שבוע חזקה',
    stages: [
      { name: 'חימום — ניידות כתפיים', type: 'exercise', durationSeconds: 60, order: 1 },
      { name: 'שכיבות שמיכה', type: 'exercise', durationSeconds: 45, order: 2, description: 'שכב על הבטן וקפוץ למצב עמידה. חזור בעבודה מבוקרת.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 3 },
      { name: 'עליות מתח', type: 'exercise', durationSeconds: 45, order: 4, description: 'תנופה של משקל בידיים לגובה כתפיים.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 5 },
      { name: 'כפיפות מרפק', type: 'exercise', durationSeconds: 45, order: 6, description: 'כפוף מרפק ולחץ משקל לעלייה, אחזור בשלוט.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 7 },
      { name: 'שכיבות שמיכה רחבות', type: 'exercise', durationSeconds: 45, order: 8, description: 'שכיבות עם ידיים רחוקות לעוד יותר עומק בחזה.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 9 },
      { name: 'שכיבות שמיכה צרות', type: 'exercise', durationSeconds: 45, order: 10, description: 'שכיבות עם ידיים קרובות לחזקת טריצפס.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 11 },
      { name: 'כפיפות מרפק הפוכות', type: 'exercise', durationSeconds: 45, order: 12, description: 'כפוף מרפק עם ברים, אחזור לעלייה לפי כוחך.' },
      { name: 'קירור', type: 'rest', durationSeconds: 60, order: 13 },
    ],
  },
  {
    title: 'אימון רגליים',
    description: 'ירכיים, שוקיים וגלוטאוס — יום מאתגר',
    stages: [
      { name: 'חימום — הליכה במקום', type: 'exercise', durationSeconds: 60, order: 1 },
      { name: 'סקוואטים', type: 'exercise', durationSeconds: 45, order: 2, description: 'כרע עמוק ברגליים, שמור ברך מעל קרסול.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 3 },
      { name: 'לאנג\'ים לסירוגין', type: 'exercise', durationSeconds: 45, order: 4, description: 'צעד קדימה וכרע עמוק, לסירוגין בכל רגל.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 5 },
      { name: 'קפיצות סקוואט', type: 'exercise', durationSeconds: 45, order: 6, description: 'סקוואט עם קפיצה למעלה בסוף, חזור לסקוואט.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 7 },
      { name: 'גלשן קיר', type: 'exercise', durationSeconds: 45, order: 8, description: 'גב נוגע בקיר, כרע לכמה דקות בעמידה.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 9 },
      { name: 'עמידה על אצבעות', type: 'exercise', durationSeconds: 45, order: 10, description: 'עמדות על קדקוד הרגל, אחזור ולחזור.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 11 },
      { name: 'גשרים לגלוטאוס', type: 'exercise', durationSeconds: 45, order: 12, description: 'שכב על הגב, הרם ירכיים למעלה.' },
      { name: 'קירור — מתיחות', type: 'rest', durationSeconds: 60, order: 13 },
    ],
  },
  {
    title: 'אימון HIIT',
    description: 'אינטרוולים בעצימות גבוהה — שורפים קלוריות',
    stages: [
      { name: 'חימום', type: 'exercise', durationSeconds: 60, order: 1 },
      { name: 'ברפי', type: 'exercise', durationSeconds: 30, order: 2, description: 'כפוף, קפוץ לשכיבה, שכיבה, קפוץ עלייה.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 3 },
      { name: 'ריצה במקום מהירה', type: 'exercise', durationSeconds: 30, order: 4, description: 'ריצה מהירה במקום, הרם ברכיים גבוה.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 5 },
      { name: 'קפיצות כוכב', type: 'exercise', durationSeconds: 30, order: 6, description: 'קפוץ עם פתיחת רגליים וידיים למעלה.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 7 },
      { name: 'ברפי', type: 'exercise', durationSeconds: 30, order: 8, description: 'כפוף, קפוץ לשכיבה, שכיבה, קפוץ עלייה.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 9 },
      { name: 'ריצה במקום מהירה', type: 'exercise', durationSeconds: 30, order: 10, description: 'ריצה מהירה במקום, הרם ברכיים גבוה.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 11 },
      { name: 'קפיצות כוכב', type: 'exercise', durationSeconds: 30, order: 12, description: 'קפוץ עם פתיחת רגליים וידיים למעלה.' },
      { name: 'קירור', type: 'rest', durationSeconds: 60, order: 13 },
    ],
  },
  {
    title: 'אימון ליבה',
    description: 'בטן ועמוד שדרה — יציבות ואיזון',
    stages: [
      { name: 'חימום — מעגלי ירך', type: 'exercise', durationSeconds: 60, order: 1 },
      { name: 'פלאנק', type: 'exercise', durationSeconds: 45, order: 2, description: 'עמדת פלאנק חזקה על אלכסון, גוף ישר.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 3 },
      { name: 'כפיפות בטן', type: 'exercise', durationSeconds: 45, order: 4, description: 'כפוף בטן לעלייה, אחזור בשלוט.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 5 },
      { name: 'פלאנק צדדי ימין', type: 'exercise', durationSeconds: 30, order: 6, description: 'פלאנק על הצד הימני, הר ירך למעלה.' },
      { name: 'פלאנק צדדי שמאל', type: 'exercise', durationSeconds: 30, order: 7, description: 'פלאנק על הצד השמאלי, הר ירך למעלה.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 8 },
      { name: 'רגליים מורמות', type: 'exercise', durationSeconds: 45, order: 9, description: 'שכב על הגב, הר רגליים, אחזור לתחתון.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 10 },
      { name: 'ציפור-כלב', type: 'exercise', durationSeconds: 45, order: 11, description: 'ציפור-כלב: הר יד וקצה רגל מנוגדים.' },
      { name: 'קירור', type: 'rest', durationSeconds: 60, order: 12 },
    ],
  },
  {
    title: 'אימון גב תחתון ומתיחות',
    description: 'שחרור מתח ושיפור גמישות',
    stages: [
      { name: 'חימום — הליכה עדינה', type: 'exercise', durationSeconds: 60, order: 1 },
      { name: 'סופרמן', type: 'exercise', durationSeconds: 45, order: 2, description: 'שכב על הבטן, הר ידיים ורגליים, אחזור.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 3 },
      { name: 'גשרים', type: 'exercise', durationSeconds: 45, order: 4, description: 'שכב על הגב, הר ירכיים, אחזור לתחתון.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 5 },
      { name: 'ציפור-כלב לסירוגין', type: 'exercise', durationSeconds: 45, order: 6, description: 'לסירוגין בצדדים, הר יד וקצה רגל.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 7 },
      { name: 'מתיחת פיריפורמיס', type: 'exercise', durationSeconds: 45, order: 8, description: 'מתיחה עמוקה לגלוטאוס, קשת בגב.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 9 },
      { name: 'קאט-קאו', type: 'exercise', durationSeconds: 45, order: 10, description: 'קשת בגב ותכופף, לסירוגין.' },
      { name: 'קירור', type: 'rest', durationSeconds: 60, order: 11 },
    ],
  },
  {
    title: 'אימון כתפיים וגב עליון',
    description: 'יציבה נכונה ועצמת כתפיים',
    stages: [
      { name: 'חימום — מעגלי כתפיים', type: 'exercise', durationSeconds: 60, order: 1 },
      { name: 'שכיבות שמיכה פייק', type: 'exercise', durationSeconds: 45, order: 2, description: 'שכיבה עם לחץ מהקיר, לא מקרקע.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 3 },
      { name: 'עליות מתח צרות', type: 'exercise', durationSeconds: 45, order: 4, description: 'תנופה צרה של משקל, בקרת מלאה.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 5 },
      { name: 'שכיבות שמיכה על האצבעות', type: 'exercise', durationSeconds: 45, order: 6, description: 'שכיבה על קדקוד אצבעות לעומק יותר.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 7 },
      { name: 'עמידת ידיים על קיר (נסיון)', type: 'exercise', durationSeconds: 30, order: 8, description: 'ניסיון לעמוד על ידיים עם קיר.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 15, order: 9 },
      { name: 'פלאנק עם הרמת יד', type: 'exercise', durationSeconds: 45, order: 10, description: 'פלאנק, הר יד לסירוגין.' },
      { name: 'קירור', type: 'rest', durationSeconds: 60, order: 11 },
    ],
  },
  {
    title: 'אימון מלא — גוף שלם',
    description: 'אימון מקיף מהראש לרגל',
    stages: [
      { name: 'חימום', type: 'exercise', durationSeconds: 60, order: 1 },
      { name: 'שכיבות שמיכה', type: 'exercise', durationSeconds: 40, order: 2, description: 'שכיבה קלסית, לחץ לעלייה מלאה.' },
      { name: 'סקוואטים', type: 'exercise', durationSeconds: 40, order: 3, description: 'כרע עמוק, שמור עמדה נכונה.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 20, order: 4 },
      { name: 'עליות מתח', type: 'exercise', durationSeconds: 40, order: 5, description: 'תנופת משקל לגובה כתפיים.' },
      { name: 'לאנג\'ים', type: 'exercise', durationSeconds: 40, order: 6, description: 'צעד קדימה וכרע לסירוגין.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 20, order: 7 },
      { name: 'ברפי', type: 'exercise', durationSeconds: 40, order: 8, description: 'תנועה מלאה: כפיפה, קפיצה, שכיבה, עלייה.' },
      { name: 'פלאנק', type: 'exercise', durationSeconds: 40, order: 9, description: 'עמדת פלאנק חזקה.' },
      { name: 'מנוחה', type: 'rest', durationSeconds: 20, order: 10 },
      { name: 'קפיצות כוכב', type: 'exercise', durationSeconds: 40, order: 11, description: 'קפוץ עם פתיחה מלאה.' },
      { name: 'כפיפות בטן', type: 'exercise', durationSeconds: 40, order: 12, description: 'כפוף בטן, אחזור בקרה.' },
      { name: 'קירור', type: 'rest', durationSeconds: 60, order: 13 },
    ],
  },
];

function getDateKey(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function seedWorkouts() {
  const DAYS = 14;
  console.log(`Seeding ${DAYS} days of workouts into slz-training-dev...\n`);

  for (let i = 0; i < DAYS; i++) {
    const dateKey = getDateKey(i);
    const ref = db.collection('workoutsByDate').doc(dateKey);
    const snap = await ref.get();

    if (snap.exists) {
      console.log(`  [skip] ${dateKey} already has a workout`);
      continue;
    }

    const template = WORKOUTS[i % WORKOUTS.length];
    const stages: Stage[] = template.stages.map((s, idx) => ({
      ...s,
      id: `stage-${idx + 1}`,
    }));
    const totalDurationSeconds = stages.reduce((sum, s) => sum + s.durationSeconds, 0);

    await ref.set({
      dateKey,
      title: template.title,
      description: template.description,
      stages,
      totalDurationSeconds,
      createdBy: 'seed-script',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`  [created] ${dateKey} — ${template.title} (${totalDurationSeconds}s)`);
  }

  console.log('\nDone!\n');
  process.exit(0);
}

seedWorkouts().catch((err) => {
  console.error('Seed failed:', err.message ?? err);
  process.exit(1);
});
