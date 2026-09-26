/**
 * ⚡ F-TRACK HEALTH & BODY ANALYSIS CALCULATIONS
 * 
 * Standardized academic formulas for:
 * 1. Body Mass Index (BMI) & standard adult categorization
 * 2. Mifflin-St Jeor Basal Metabolic Rate (BMR)
 * 3. Total Daily Energy Expenditure (TDEE) maintenance calories
 */

export const ACTIVITY_MULTIPLIERS = {
  'Sedentary': 1.2,
  'Lightly Active': 1.375,
  'Moderately Active': 1.55,
  'Very Active': 1.725,
  'Extra Active': 1.9,
};

/**
 * Calculate Body Mass Index (BMI)
 * @param {number} heightCm - Height in centimeters (e.g. 175)
 * @param {number} weightKg - Weight in kilograms (e.g. 70)
 * @returns {object} BMI calculation results
 */
export const calculateBMI = (heightCm, weightKg) => {
  const h = Number(heightCm);
  const w = Number(weightKg);

  if (isNaN(h) || h < 30 || h > 300) {
    throw new Error('Please enter a valid height between 30 cm and 300 cm.');
  }

  if (isNaN(w) || w < 10 || w > 500) {
    throw new Error('Please enter a valid weight between 10 kg and 500 kg.');
  }

  const heightMeters = h / 100;
  const rawBMI = w / (heightMeters * heightMeters);
  const bmi = Math.round(rawBMI * 10) / 10; // Round to 1 decimal place

  let category = 'Normal';
  let categoryColor = 'matrix'; // for anime styling
  let explanation = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = 'cyan';
    explanation = 'Your BMI indicates your body weight is below the standard recommended range. Focusing on nutrient-dense caloric intake and resistance training can help build lean mass and optimal vitality.';
  } else if (bmi <= 24.9) {
    category = 'Normal';
    categoryColor = 'matrix';
    explanation = 'Your BMI falls within the standard healthy weight zone. Continue maintaining your balanced nutritional matrix and regular training quests.';
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    categoryColor = 'gold';
    explanation = 'Your BMI is slightly above the typical threshold. Integrating structured cardiovascular training and progressive resistance exercises supports optimal body composition.';
  } else {
    category = 'Obesity';
    categoryColor = 'crimson';
    explanation = 'Your BMI is in the elevated range. A progressive exercise routine combined with tailored caloric management will help guide your health trajectory toward peak condition.';
  }

  return {
    heightCm: h,
    weightKg: w,
    bmi,
    category,
    categoryColor,
    explanation,
    disclaimer: 'BMI is a statistical screening index calculated from height and weight. It does not measure body fat percentage or muscle mass directly and is not a medical diagnosis.',
  };
};

/**
 * Calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE)
 * Uses the peer-reviewed Mifflin-St Jeor Equation.
 * 
 * @param {object} params - Calculation parameters
 * @param {number} params.age - Age in years (1 - 120)
 * @param {string} params.sex - 'male' | 'female'
 * @param {number} params.heightCm - Height in centimeters
 * @param {number} params.weightKg - Weight in kilograms
 * @param {string} params.activityLevel - Activity tier
 * @returns {object} Calorie calculation results
 */
export const calculateCalories = ({ age, sex, heightCm, weightKg, activityLevel }) => {
  const a = Number(age);
  const h = Number(heightCm);
  const w = Number(weightKg);

  if (isNaN(a) || a < 1 || a > 120) {
    throw new Error('Age must be between 1 and 120 years.');
  }

  const normalizedSex = String(sex).toLowerCase().trim();
  if (normalizedSex !== 'male' && normalizedSex !== 'female') {
    throw new Error('Sex must be designated as either Male or Female.');
  }

  if (isNaN(h) || h < 30 || h > 300) {
    throw new Error('Please enter a valid height between 30 cm and 300 cm.');
  }

  if (isNaN(w) || w < 10 || w > 500) {
    throw new Error('Please enter a valid weight between 10 kg and 500 kg.');
  }

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  if (!multiplier) {
    throw new Error(`Activity level must be one of: ${Object.keys(ACTIVITY_MULTIPLIERS).join(', ')}`);
  }

  // Mifflin-St Jeor Equation
  let bmrRaw;
  if (normalizedSex === 'male') {
    bmrRaw = 10 * w + 6.25 * h - 5 * a + 5;
  } else {
    bmrRaw = 10 * w + 6.25 * h - 5 * a - 161;
  }

  const bmr = Math.round(bmrRaw);
  const tdee = Math.round(bmrRaw * multiplier);

  return {
    bmr,
    tdee,
    activityLevel,
    activityMultiplier: multiplier,
    inputs: {
      age: a,
      sex: normalizedSex,
      heightCm: h,
      weightKg: w,
      activityLevel,
    },
    explanation: 'BMR (Basal Metabolic Rate) represents the baseline energy expended at rest to maintain essential vital functions. TDEE estimates total daily caloric maintenance based on your training activity level.',
    disclaimer: 'Calorie estimates are mathematical approximations. Individual metabolism varies based on body composition, genetics, and training volume. Do not treat as strict medical prescriptions.',
  };
};
