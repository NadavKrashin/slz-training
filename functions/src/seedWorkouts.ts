import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { admin, db } from './firebase';

interface Stage {
  id: string;
  name: string;
  type: 'exercise' | 'rest';
  durationSeconds: number;
  order: number;
}

interface WorkoutTemplate {
  title: string;
  description: string;
  stages: Stage[];
}

function s(id: string, name: string, type: 'exercise' | 'rest', dur: number, order: number): Stage {
  return { id, name, type, durationSeconds: dur, order };
}

const WORKOUTS: WorkoutTemplate[] = [
  {
    title: 'חימום בוקר',
    description: 'אימון קל לפתיחת היום — מתיחות ותנועה בסיסית',
    stages: [
      s('w1s1', 'ריצה במקום', 'exercise', 60, 1),
      s('w1s2', 'מנוחה', 'rest', 30, 2),
      s('w1s3', 'מתיחת גב', 'exercise', 60, 3),
      s('w1s4', 'מנוחה', 'rest', 30, 4),
      s('w1s5', 'סקוואט אוויר', 'exercise', 60, 5),
      s('w1s6', 'מנוחה', 'rest', 30, 6),
      s('w1s7', 'מתיחת ירכיים', 'exercise', 60, 7),
      s('w1s8', 'מנוחה', 'rest', 30, 8),
      s('w1s9', 'קפיצות במקום', 'exercise', 60, 9),
      s('w1s10', 'מתיחה סופית', 'exercise', 120, 10),
      s('w1s11', 'מנוחה', 'rest', 60, 11),
    ],
  },
  {
    title: 'קארדיו שריפה',
    description: 'אימון אירובי אינטנסיבי לשריפת קלוריות',
    stages: [
      s('w2s1', 'ג׳אמפינג ג׳ק', 'exercise', 60, 1),
      s('w2s2', 'מנוחה', 'rest', 20, 2),
      s('w2s3', 'ברפי', 'exercise', 45, 3),
      s('w2s4', 'מנוחה', 'rest', 20, 4),
      s('w2s5', 'ריצה מהירה במקום', 'exercise', 60, 5),
      s('w2s6', 'מנוחה', 'rest', 20, 6),
      s('w2s7', 'סקוואט ג׳אמפ', 'exercise', 45, 7),
      s('w2s8', 'מנוחה', 'rest', 20, 8),
      s('w2s9', 'מטפסי הרים', 'exercise', 60, 9),
      s('w2s10', 'מנוחה', 'rest', 20, 10),
      s('w2s11', 'ברפי', 'exercise', 45, 11),
      s('w2s12', 'מנוחה', 'rest', 20, 12),
      s('w2s13', 'קפיצות צלב', 'exercise', 60, 13),
      s('w2s14', 'מנוחה', 'rest', 20, 14),
      s('w2s15', 'ריצה מהירה במקום', 'exercise', 45, 15),
      s('w2s16', 'מתיחה', 'rest', 40, 16),
    ],
  },
  {
    title: 'ליבה פלדה',
    description: 'חיזוק שרירי הבטן והגב התחתון',
    stages: [
      s('w3s1', 'פלאנק', 'exercise', 45, 1),
      s('w3s2', 'מנוחה', 'rest', 15, 2),
      s('w3s3', 'כפיפות בטן', 'exercise', 60, 3),
      s('w3s4', 'מנוחה', 'rest', 20, 4),
      s('w3s5', 'פלאנק צד ימין', 'exercise', 40, 5),
      s('w3s6', 'מנוחה', 'rest', 15, 6),
      s('w3s7', 'פלאנק צד שמאל', 'exercise', 40, 7),
      s('w3s8', 'מנוחה', 'rest', 15, 8),
      s('w3s9', 'אופניים בשכיבה', 'exercise', 60, 9),
      s('w3s10', 'מנוחה', 'rest', 20, 10),
      s('w3s11', 'סופרמן', 'exercise', 45, 11),
      s('w3s12', 'מנוחה', 'rest', 15, 12),
      s('w3s13', 'הרמת רגליים', 'exercise', 45, 13),
      s('w3s14', 'מנוחה', 'rest', 15, 14),
      s('w3s15', 'פלאנק', 'exercise', 60, 15),
      s('w3s16', 'מתיחה', 'rest', 90, 16),
    ],
  },
  {
    title: 'רגליים חזקות',
    description: 'אימון פלג גוף תחתון — ירכיים, ישבן ושוקיים',
    stages: [
      s('w4s1', 'סקוואט', 'exercise', 60, 1),
      s('w4s2', 'מנוחה', 'rest', 20, 2),
      s('w4s3', 'לאנג׳ קדימה', 'exercise', 50, 3),
      s('w4s4', 'מנוחה', 'rest', 20, 4),
      s('w4s5', 'סקוואט רחב', 'exercise', 50, 5),
      s('w4s6', 'מנוחה', 'rest', 20, 6),
      s('w4s7', 'גשר ישבן', 'exercise', 60, 7),
      s('w4s8', 'מנוחה', 'rest', 20, 8),
      s('w4s9', 'לאנג׳ אחורה', 'exercise', 50, 9),
      s('w4s10', 'מנוחה', 'rest', 20, 10),
      s('w4s11', 'סקוואט ג׳אמפ', 'exercise', 45, 11),
      s('w4s12', 'מנוחה', 'rest', 20, 12),
      s('w4s13', 'עמידה על רגל אחת', 'exercise', 50, 13),
      s('w4s14', 'מנוחה', 'rest', 15, 14),
      s('w4s15', 'הרמת עקבים', 'exercise', 50, 15),
      s('w4s16', 'מתיחת רגליים', 'rest', 50, 16),
    ],
  },
  {
    title: 'פלג גוף עליון',
    description: 'חיזוק כתפיים, חזה וזרועות',
    stages: [
      s('w5s1', 'שכיבות סמיכה', 'exercise', 45, 1),
      s('w5s2', 'מנוחה', 'rest', 20, 2),
      s('w5s3', 'דיפס על כיסא', 'exercise', 45, 3),
      s('w5s4', 'מנוחה', 'rest', 20, 4),
      s('w5s5', 'שכיבות סמיכה צרות', 'exercise', 40, 5),
      s('w5s6', 'מנוחה', 'rest', 20, 6),
      s('w5s7', 'פלאנק עם מגע כתף', 'exercise', 45, 7),
      s('w5s8', 'מנוחה', 'rest', 20, 8),
      s('w5s9', 'שכיבות סמיכה רחבות', 'exercise', 40, 9),
      s('w5s10', 'מנוחה', 'rest', 20, 10),
      s('w5s11', 'דיפס על כיסא', 'exercise', 40, 11),
      s('w5s12', 'מנוחה', 'rest', 20, 12),
      s('w5s13', 'לחיצת כתפיים בעמידה', 'exercise', 50, 13),
      s('w5s14', 'מנוחה', 'rest', 15, 14),
      s('w5s15', 'שכיבות סמיכה', 'exercise', 45, 15),
      s('w5s16', 'מתיחת חזה וכתפיים', 'rest', 115, 16),
    ],
  },
  {
    title: 'גמישות וניידות',
    description: 'מתיחות ותנועה לשיפור טווח התנועה',
    stages: [
      s('w6s1', 'סיבובי צוואר', 'exercise', 45, 1),
      s('w6s2', 'מנוחה', 'rest', 15, 2),
      s('w6s3', 'מתיחת כתפיים', 'exercise', 50, 3),
      s('w6s4', 'מנוחה', 'rest', 15, 4),
      s('w6s5', 'חתול-פרה', 'exercise', 60, 5),
      s('w6s6', 'מנוחה', 'rest', 15, 6),
      s('w6s7', 'מתיחת ירכיים עמוקה', 'exercise', 60, 7),
      s('w6s8', 'מנוחה', 'rest', 15, 8),
      s('w6s9', 'מתיחת גב תחתון', 'exercise', 50, 9),
      s('w6s10', 'מנוחה', 'rest', 15, 10),
      s('w6s11', 'מתיחת שוקיים', 'exercise', 45, 11),
      s('w6s12', 'מנוחה', 'rest', 15, 12),
      s('w6s13', 'סיבובי גוף', 'exercise', 50, 13),
      s('w6s14', 'מנוחה', 'rest', 15, 14),
      s('w6s15', 'כלב למטה', 'exercise', 60, 15),
      s('w6s16', 'נשימות עמוקות', 'rest', 75, 16),
    ],
  },
  {
    title: 'כוח מלא',
    description: 'אימון גוף מלא לחיזוק כללי',
    stages: [
      s('w7s1', 'סקוואט', 'exercise', 50, 1),
      s('w7s2', 'מנוחה', 'rest', 15, 2),
      s('w7s3', 'שכיבות סמיכה', 'exercise', 45, 3),
      s('w7s4', 'מנוחה', 'rest', 15, 4),
      s('w7s5', 'לאנג׳', 'exercise', 50, 5),
      s('w7s6', 'מנוחה', 'rest', 15, 6),
      s('w7s7', 'פלאנק', 'exercise', 45, 7),
      s('w7s8', 'מנוחה', 'rest', 15, 8),
      s('w7s9', 'ברפי', 'exercise', 40, 9),
      s('w7s10', 'מנוחה', 'rest', 20, 10),
      s('w7s11', 'גשר ישבן', 'exercise', 50, 11),
      s('w7s12', 'מנוחה', 'rest', 15, 12),
      s('w7s13', 'מטפסי הרים', 'exercise', 45, 13),
      s('w7s14', 'מנוחה', 'rest', 15, 14),
      s('w7s15', 'כפיפות בטן', 'exercise', 50, 15),
      s('w7s16', 'מתיחה', 'rest', 115, 16),
    ],
  },
  {
    title: 'אימון טאבטה',
    description: 'אימון אינטרוולים קצר ואינטנסיבי',
    stages: [
      s('w8s1', 'ג׳אמפינג ג׳ק', 'exercise', 40, 1),
      s('w8s2', 'מנוחה', 'rest', 20, 2),
      s('w8s3', 'סקוואט ג׳אמפ', 'exercise', 40, 3),
      s('w8s4', 'מנוחה', 'rest', 20, 4),
      s('w8s5', 'שכיבות סמיכה', 'exercise', 40, 5),
      s('w8s6', 'מנוחה', 'rest', 20, 6),
      s('w8s7', 'מטפסי הרים', 'exercise', 40, 7),
      s('w8s8', 'מנוחה', 'rest', 20, 8),
      s('w8s9', 'ברפי', 'exercise', 40, 9),
      s('w8s10', 'מנוחה', 'rest', 20, 10),
      s('w8s11', 'לאנג׳ ג׳אמפ', 'exercise', 40, 11),
      s('w8s12', 'מנוחה', 'rest', 20, 12),
      s('w8s13', 'פלאנק עם מגע כתף', 'exercise', 40, 13),
      s('w8s14', 'מנוחה', 'rest', 20, 14),
      s('w8s15', 'ריצה מהירה במקום', 'exercise', 40, 15),
      s('w8s16', 'מתיחה', 'rest', 140, 16),
    ],
  },
  {
    title: 'בטן וגב',
    description: 'חיזוק מרכז הגוף — יציבות ושיווי משקל',
    stages: [
      s('w9s1', 'פלאנק', 'exercise', 50, 1),
      s('w9s2', 'מנוחה', 'rest', 15, 2),
      s('w9s3', 'סופרמן', 'exercise', 45, 3),
      s('w9s4', 'מנוחה', 'rest', 15, 4),
      s('w9s5', 'כפיפות בטן צולבות', 'exercise', 50, 5),
      s('w9s6', 'מנוחה', 'rest', 15, 6),
      s('w9s7', 'גשר עם הרמת רגל', 'exercise', 50, 7),
      s('w9s8', 'מנוחה', 'rest', 15, 8),
      s('w9s9', 'פלאנק צד ימין', 'exercise', 40, 9),
      s('w9s10', 'מנוחה', 'rest', 10, 10),
      s('w9s11', 'פלאנק צד שמאל', 'exercise', 40, 11),
      s('w9s12', 'מנוחה', 'rest', 15, 12),
      s('w9s13', 'הרמת רגליים', 'exercise', 50, 13),
      s('w9s14', 'מנוחה', 'rest', 15, 14),
      s('w9s15', 'ציפור-כלב', 'exercise', 50, 15),
      s('w9s16', 'מתיחת גב ובטן', 'rest', 125, 16),
    ],
  },
  {
    title: 'אימון צבאי',
    description: 'אימון מסורתי בסגנון של״ז — פשוט ויעיל',
    stages: [
      s('w10s1', 'ריצה במקום', 'exercise', 60, 1),
      s('w10s2', 'מנוחה', 'rest', 15, 2),
      s('w10s3', 'שכיבות סמיכה', 'exercise', 50, 3),
      s('w10s4', 'מנוחה', 'rest', 15, 4),
      s('w10s5', 'כפיפות בטן', 'exercise', 50, 5),
      s('w10s6', 'מנוחה', 'rest', 15, 6),
      s('w10s7', 'סקוואט', 'exercise', 50, 7),
      s('w10s8', 'מנוחה', 'rest', 15, 8),
      s('w10s9', 'שכיבות סמיכה', 'exercise', 45, 9),
      s('w10s10', 'מנוחה', 'rest', 15, 10),
      s('w10s11', 'ברפי', 'exercise', 40, 11),
      s('w10s12', 'מנוחה', 'rest', 15, 12),
      s('w10s13', 'פלאנק', 'exercise', 50, 13),
      s('w10s14', 'מנוחה', 'rest', 15, 14),
      s('w10s15', 'ריצה מהירה במקום', 'exercise', 50, 15),
      s('w10s16', 'מתיחה', 'rest', 100, 16),
    ],
  },
  {
    title: 'יוגה דינמית',
    description: 'שילוב כוח וגמישות בהשראת יוגה',
    stages: [
      s('w11s1', 'ברכת השמש', 'exercise', 60, 1),
      s('w11s2', 'מנוחה', 'rest', 15, 2),
      s('w11s3', 'לוחם א׳', 'exercise', 50, 3),
      s('w11s4', 'מנוחה', 'rest', 15, 4),
      s('w11s5', 'לוחם ב׳', 'exercise', 50, 5),
      s('w11s6', 'מנוחה', 'rest', 15, 6),
      s('w11s7', 'כלב למטה', 'exercise', 50, 7),
      s('w11s8', 'מנוחה', 'rest', 15, 8),
      s('w11s9', 'פלאנק ליוגה', 'exercise', 45, 9),
      s('w11s10', 'מנוחה', 'rest', 15, 10),
      s('w11s11', 'עץ', 'exercise', 50, 11),
      s('w11s12', 'מנוחה', 'rest', 15, 12),
      s('w11s13', 'חתול-פרה', 'exercise', 50, 13),
      s('w11s14', 'מנוחה', 'rest', 15, 14),
      s('w11s15', 'ילד', 'exercise', 40, 15),
      s('w11s16', 'שווסנה', 'rest', 100, 16),
    ],
  },
  {
    title: 'סיבולת כוח',
    description: 'אימון ארוך-מאמץ בקצב קבוע',
    stages: [
      s('w12s1', 'סקוואט איטי', 'exercise', 60, 1),
      s('w12s2', 'מנוחה', 'rest', 15, 2),
      s('w12s3', 'שכיבות סמיכה איטיות', 'exercise', 50, 3),
      s('w12s4', 'מנוחה', 'rest', 15, 4),
      s('w12s5', 'לאנג׳ עם עצירה', 'exercise', 50, 5),
      s('w12s6', 'מנוחה', 'rest', 15, 6),
      s('w12s7', 'פלאנק', 'exercise', 60, 7),
      s('w12s8', 'מנוחה', 'rest', 15, 8),
      s('w12s9', 'גשר ישבן עם עצירה', 'exercise', 50, 9),
      s('w12s10', 'מנוחה', 'rest', 15, 10),
      s('w12s11', 'סקוואט קיר', 'exercise', 50, 11),
      s('w12s12', 'מנוחה', 'rest', 15, 12),
      s('w12s13', 'דיפס איטיים', 'exercise', 45, 13),
      s('w12s14', 'מנוחה', 'rest', 15, 14),
      s('w12s15', 'פלאנק צד', 'exercise', 40, 15),
      s('w12s16', 'מתיחה', 'rest', 90, 16),
    ],
  },
  {
    title: 'אימון מהיר ועוצמתי',
    description: 'אינטרוולים קצרים עם מנוחות מינימליות',
    stages: [
      s('w13s1', 'ברפי', 'exercise', 30, 1),
      s('w13s2', 'מנוחה', 'rest', 10, 2),
      s('w13s3', 'סקוואט ג׳אמפ', 'exercise', 30, 3),
      s('w13s4', 'מנוחה', 'rest', 10, 4),
      s('w13s5', 'שכיבות סמיכה', 'exercise', 30, 5),
      s('w13s6', 'מנוחה', 'rest', 10, 6),
      s('w13s7', 'מטפסי הרים', 'exercise', 30, 7),
      s('w13s8', 'מנוחה', 'rest', 10, 8),
      s('w13s9', 'ג׳אמפינג ג׳ק', 'exercise', 30, 9),
      s('w13s10', 'מנוחה', 'rest', 10, 10),
      s('w13s11', 'ברפי', 'exercise', 30, 11),
      s('w13s12', 'מנוחה', 'rest', 10, 12),
      s('w13s13', 'לאנג׳ ג׳אמפ', 'exercise', 30, 13),
      s('w13s14', 'מנוחה', 'rest', 10, 14),
      s('w13s15', 'קפיצות צלב', 'exercise', 30, 15),
      s('w13s16', 'מנוחה', 'rest', 10, 16),
      s('w13s17', 'שכיבות סמיכה', 'exercise', 30, 17),
      s('w13s18', 'מנוחה', 'rest', 10, 18),
      s('w13s19', 'סקוואט', 'exercise', 30, 19),
      s('w13s20', 'מנוחה', 'rest', 10, 20),
      s('w13s21', 'פלאנק', 'exercise', 30, 21),
      s('w13s22', 'מנוחה', 'rest', 10, 22),
      s('w13s23', 'ריצה מהירה במקום', 'exercise', 30, 23),
      s('w13s24', 'מתיחה', 'rest', 130, 24),
    ],
  },
  {
    title: 'אימון מאוזן',
    description: 'שילוב כוח, קארדיו וגמישות',
    stages: [
      s('w14s1', 'ריצה במקום', 'exercise', 60, 1),
      s('w14s2', 'מנוחה', 'rest', 15, 2),
      s('w14s3', 'שכיבות סמיכה', 'exercise', 45, 3),
      s('w14s4', 'מנוחה', 'rest', 15, 4),
      s('w14s5', 'סקוואט', 'exercise', 50, 5),
      s('w14s6', 'מנוחה', 'rest', 15, 6),
      s('w14s7', 'מתיחת גב', 'exercise', 45, 7),
      s('w14s8', 'מנוחה', 'rest', 15, 8),
      s('w14s9', 'פלאנק', 'exercise', 50, 9),
      s('w14s10', 'מנוחה', 'rest', 15, 10),
      s('w14s11', 'לאנג׳', 'exercise', 45, 11),
      s('w14s12', 'מנוחה', 'rest', 15, 12),
      s('w14s13', 'כפיפות בטן', 'exercise', 45, 13),
      s('w14s14', 'מנוחה', 'rest', 15, 14),
      s('w14s15', 'ג׳אמפינג ג׳ק', 'exercise', 50, 15),
      s('w14s16', 'מתיחה סופית', 'rest', 105, 16),
    ],
  },
];

// Validate every template sums to 600s at build time
WORKOUTS.forEach((w, i) => {
  const total = w.stages.reduce((sum, s) => sum + s.durationSeconds, 0);
  if (total !== 600) {
    throw new Error(`Workout ${i} "${w.title}" totals ${total}s, expected 600s`);
  }
});

function getTodayDateKeyIST(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function addDays(dateKey: string, days: number): string {
  const d = new Date(dateKey + 'T12:00:00+03:00'); // noon IST to avoid DST edge
  d.setDate(d.getDate() + days);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

export const seedWorkouts = onCall(async (request) => {
  if (!request.auth?.token?.admin) {
    throw new HttpsError('permission-denied', 'Admin only');
  }

  const today = getTodayDateKeyIST();
  const dateKeys: string[] = [];
  for (let i = 0; i < WORKOUTS.length; i++) {
    dateKeys.push(addDays(today, i));
  }

  // Check which dates already have workouts — skip those
  const existingChecks = await Promise.all(
    dateKeys.map((dk) => db.collection('workoutsByDate').doc(dk).get())
  );
  const skipped: string[] = [];

  const batch = db.batch();
  let written = 0;

  dateKeys.forEach((dateKey, i) => {
    if (existingChecks[i].exists) {
      skipped.push(dateKey);
      return;
    }
    const w = WORKOUTS[i];
    const ref = db.collection('workoutsByDate').doc(dateKey);
    batch.set(ref, {
      dateKey,
      title: w.title,
      description: w.description,
      stages: w.stages,
      totalDurationSeconds: 600,
      createdBy: request.auth!.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    written++;
  });

  if (written > 0) {
    await batch.commit();
  }

  return {
    message: `Seeded ${written} workouts (${skipped.length} skipped — already existed)`,
    startDate: dateKeys[0],
    endDate: dateKeys[dateKeys.length - 1],
    skipped,
  };
});
