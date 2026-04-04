type MessageCategory =
  | 'greeting'
  | 'celebration'
  | 'preWorkout'
  | 'pause'
  | 'comeback'
  | 'restDay'
  | 'milestone'
  | 'empty'
  | 'loading';

const MESSAGE_POOLS: Record<Exclude<MessageCategory, 'milestone'>, string[]> = {
  greeting: [
    'בוקר טוב, מוכן לאימון?',
    'יום חדש, הזדמנות חדשה',
    'מה קורה, באת להתאמן?',
    'אני כבר מחכה לך',
    'היום אנחנו הולכים על הכל',
    'עוד יום, עוד סיבה להתאמן',
    'בוא נראה מה יש לך היום',
    'מוכן? תמיד מוכן',
    'הגעת? מעולה, בוא נתחיל',
    'יאללה, מספיק לנוח',
    'הגוף שלך מחכה לאתגר',
    'בוא נעשה את זה ביחד',
    'עשר דקות. זה הכל. בוא',
    'אתה פה? טוב. בוא נזיז',
    'היום נהיה יותר חזקים',
  ],

  celebration: [
    'ככה זה נראה כשלא מוותרים',
    'עוד יום של התמדה',
    'מכונה. פשוט מכונה',
    'אתה לא עוצר, אני מתרשם',
    'זה היה אימון רציני',
    'כל הכבוד, עשית את זה',
    'ככה נראה מישהו שלא מוותר',
    'עוד אימון בכיס, יאללה קדימה',
    'סגרת אימון. גאה בך',
    'זה היה משהו, תודה שלא ויתרת',
  ],

  preWorkout: [
    'עשר דקות, זה כל מה שצריך',
    'האימון לא יעשה את עצמו',
    'בוא נראה מה יש לך',
    'פחות דיבורים, יותר אימונים',
    'מוכן? אני לא שומע אותך. מוכן?!',
    'הגוף שלך יודה לך אחר כך',
    'בוא נתחיל, אחר כך תגיד תודה',
    'רגע של מאמץ, יום שלם של סיפוק',
  ],

  pause: [
    'קח אוויר, אני מחכה',
    'הפסקה קצרה, לא ויתור',
    'שתה מים, תחזור חזק',
    'רגע של נשימה ומחזירים גז',
    'אני פה, קח את הזמן',
  ],

  comeback: [
    'חזרת? טוב, בוא נתחיל מחדש',
    'שכחתי כבר איך אתה נראה',
    'נו, סוף סוף. בוא נחזור לעניינים',
    'העיקר שחזרת. יאללה קדימה',
    'הפסקה ארוכה, אבל אתה פה עכשיו',
  ],

  restDay: [
    'אין אימון היום, תנוח',
    'יום מנוחה מגיע גם לאלופים',
    'היום נחים, מחר חוזרים',
    'תנוח, המשך מחר',
    'גם מנוחה זה חלק מאימון',
  ],

  empty: [
    'אין פה כלום עדיין',
    'ריק כאן, אבל לא לאורך זמן',
    'עוד לא התחלנו? בוא נתחיל',
  ],

  loading: [
    'רגע, מסדר את הדברים',
    'עוד שנייה...',
    'מכין הכל בשבילך',
  ],
};

const MILESTONE_MESSAGES: Record<number, string> = {
  3: 'שלושה ימים! מתחיל להרגיש את זה',
  7: 'שבוע שלם! מכונה',
  14: 'שבועיים רצוף! אין עליך',
  30: 'חודש שלם! מדהים',
  60: 'חודשיים! אתה בחיים אחרים',
  100: 'מאה ימים! אגדה חיה',
};

function pickRandom(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getFirstMessage(category: Exclude<MessageCategory, 'milestone'>): string {
  return MESSAGE_POOLS[category][0];
}

export function getSealzMessage(category: MessageCategory, streak?: number): string {
  if (category === 'milestone' && streak != null && MILESTONE_MESSAGES[streak]) {
    return MILESTONE_MESSAGES[streak];
  }
  if (category === 'milestone') {
    return pickRandom(MESSAGE_POOLS.celebration);
  }
  return pickRandom(MESSAGE_POOLS[category]);
}

export function getHomeMessage(
  isCompleted: boolean,
  hasWorkoutToday: boolean,
  daysSinceLastWorkout: number | undefined,
  motivationalMessage: string,
): string {
  if (isCompleted) return pickRandom(MESSAGE_POOLS.celebration);
  if (daysSinceLastWorkout && daysSinceLastWorkout >= 3) return pickRandom(MESSAGE_POOLS.comeback);
  if (!hasWorkoutToday) return pickRandom(MESSAGE_POOLS.restDay);
  return motivationalMessage;
}
