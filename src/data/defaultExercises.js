// Curated Database of Gym Exercises with Posture Guides, Photos & Videos
export const MUSCLE_GROUPS = [
  { id: 'chest', name: 'Chest', icon: 'Shield', color: '#ef4444' },
  { id: 'wings', name: 'Wings (Lats/Back)', icon: 'Compass', color: '#dc2626' },
  { id: 'shoulders', name: 'Shoulders', icon: 'Target', color: '#f87171' },
  { id: 'biceps', name: 'Biceps', icon: 'Flame', color: '#f59e0b' },
  { id: 'triceps', name: 'Triceps', icon: 'Zap', color: '#fb923c' },
  { id: 'legs', name: 'Legs & Calves', icon: 'Activity', color: '#f43f5e' },
  { id: 'core', name: 'Abs & Core', icon: 'Crosshair', color: '#a855f7' },
  { id: 'cardio', name: 'Cardio / Full', icon: 'Heart', color: '#ef4444' }
];

export const DEFAULT_EXERCISES = [
  // ==================== CHEST ====================
  {
    id: 'flat-dumbbell-press',
    name: 'Flat Dumbbell Press',
    muscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    youtubeUrl: 'https://www.youtube.com/watch?v=VmB1G1K7v94',
    photoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Retract shoulder blades and plant feet firmly on the floor',
      'Lower dumbbells with control until level with mid-chest',
      'Keep wrists straight and elbows angled ~45 degrees',
      'Press up smoothly squeezing pecs at the top without banging weights'
    ],
    mistakes: ['Flaring elbows out to 90 degrees', 'Arching lower back off the bench']
  },
  {
    id: 'incline-db-press',
    name: 'Incline DB Press',
    muscle: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    youtubeUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    photoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Set bench angle to 30° - 45°',
      'Keep dumbbells aligned directly above wrists and elbows',
      'Lower under control to upper chest level for deep stretch',
      'Drive upwards focusing tension on upper pectoral fibers'
    ],
    mistakes: ['Setting bench angle too steep (>45° becomes shoulder press)']
  },
  {
    id: 'pec-fly-machine',
    name: 'Pec Fly Machine',
    muscle: 'chest',
    secondaryMuscles: ['shoulders'],
    youtubeUrl: 'https://www.youtube.com/watch?v=Z57CtFmRMxA',
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Adjust seat height so handles align with mid-chest level',
      'Keep slight bend in elbows and maintain chest up posture',
      'Squeeze handles together in front, pausing for 1 second at peak contraction',
      'Resist slowly on the return to feel a deep chest stretch'
    ],
    mistakes: ['Over-extending arms backward straining shoulder capsules', 'Rounding shoulders forward']
  },
  {
    id: 'pushups-normal-or-knee',
    name: 'Pushups (Normal or Knee)',
    muscle: 'chest',
    secondaryMuscles: ['triceps', 'core', 'shoulders'],
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Hands slightly wider than shoulder-width, fingers spread',
      'Rigid plank line from shoulders to heels (or knees if modified)',
      'Lower chest until 1 inch off the floor with elbows at 45°',
      'Push through full palms to full lockout'
    ],
    mistakes: ['Sagging lower back / hips', 'Flaring elbows outward']
  },
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    muscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    youtubeUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Squeeze shoulder blades together and pin into bench',
      'Grip barbell just outside shoulder width with wrist locked',
      'Lower bar to lower sternum under control',
      'Explode upward driving through chest and feet'
    ],
    mistakes: ['Bouncing bar off ribcage', 'Lifting glutes off bench']
  },

  // ==================== SHOULDERS ====================
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    muscle: 'shoulders',
    secondaryMuscles: ['triceps', 'core'],
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    photoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Can be performed seated or standing with dumbbells or barbell',
      'Start dumbbells at ear height with palms facing forward or semi-neutral',
      'Press straight up overhead in a smooth vertical line',
      'Lower dumbbells slowly to chin/ear level'
    ],
    mistakes: ['Hyperextending and arching lower back', 'Locking out elbows violently']
  },
  {
    id: 'lateral-rise',
    name: 'Lateral Rise (Raise)',
    muscle: 'shoulders',
    secondaryMuscles: ['traps'],
    youtubeUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    photoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Stand with feet hip-width, slight forward lean in torso (~10°)',
      'Lead with elbows, raising arms in the scapular plane (30° forward)',
      'Lift until dumbbells reach shoulder height',
      'Pause for a split second, then lower with a controlled 2-second eccentric'
    ],
    mistakes: ['Swinging torso with momentum', 'Shrugging traps up to ears']
  },
  {
    id: 'reverse-flys',
    name: 'Reverse Flys (Rear Delts)',
    muscle: 'shoulders',
    secondaryMuscles: ['wings'],
    youtubeUrl: 'https://www.youtube.com/watch?v=yPdeQ2Z8Uyo',
    photoUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Hinge forward at hips with flat back, or use rear delt fly machine',
      'Keep slight bend in elbows throughout movement',
      'Fly dumbbells out to the sides focusing on rear shoulder contraction',
      'Lower slowly without swinging'
    ],
    mistakes: ['Squeezing rhomboids instead of isolating rear delts', 'Using too heavy weight']
  },
  {
    id: 'shrugs',
    name: 'Shrugs',
    muscle: 'shoulders',
    secondaryMuscles: ['wings'],
    youtubeUrl: 'https://www.youtube.com/watch?v=cJRVVxmytaM',
    photoUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Hold dumbbells or barbell with arms fully extended at sides',
      'Elevate shoulders straight up towards ears in a vertical plane',
      'Hold peak contraction at the top for 2 full seconds',
      'Lower under control to full stretch'
    ],
    mistakes: ['Rolling shoulders in circles (injures rotator cuffs)', 'Bending elbows to pull weight']
  },

  // ==================== WINGS / LATS / BACK ====================
  {
    id: 'lat-pull-down',
    name: 'Lat Pull Down',
    muscle: 'wings',
    secondaryMuscles: ['biceps'],
    youtubeUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    photoUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Grip bar slightly wider than shoulder width',
      'Slight lean back (~10°), drive elbows down toward back pockets',
      'Touch bar to upper chest and squeeze lats/wings firmly',
      'Allow arms to fully extend at the top for maximum stretch'
    ],
    mistakes: ['Swinging torso back and forth like a pendulum', 'Pulling bar behind neck']
  },
  {
    id: 'seated-row',
    name: 'Seated Row',
    muscle: 'wings',
    secondaryMuscles: ['biceps', 'shoulders'],
    youtubeUrl: 'https://www.youtube.com/watch?v=GZbfZ033f74',
    photoUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Sit tall with knees slightly bent and chest puffed out',
      'Pull handle towards belly button driving elbows backward',
      'Squeeze wing/lat muscles and shoulder blades together for 1s',
      'Extend arms slowly back to start without rounding lower back'
    ],
    mistakes: ['Leaning excessively forward and backward', 'Shrugging shoulders upward']
  },
  {
    id: 'rdl',
    name: 'RDL (Romanian Deadlift)',
    muscle: 'wings',
    secondaryMuscles: ['legs'],
    youtubeUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Hold barbell or dumbbells in front of thighs, soft bend in knees',
      'Push hips backward towards the wall while keeping spine locked flat',
      'Keep weights skimming close to shins to engage lats and posterior chain',
      'Lower until deep stretch in hamstrings, then drive hips forward to stand'
    ],
    mistakes: ['Rounding the lumbar spine', 'Bending knees into a squat']
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    muscle: 'wings',
    secondaryMuscles: ['biceps'],
    youtubeUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8gkQ',
    photoUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Hinge at hips to ~45° with neutral spine and tight core',
      'Pull barbell towards lower ribcage/navel',
      'Drive elbows upward past torso, squeezing wings and upper back',
      'Lower bar with control without letting shoulders drop forward'
    ],
    mistakes: ['Standing too upright', 'Using jerking body momentum to heave weight']
  },

  // ==================== BICEPS ====================
  {
    id: 'stick-biceps-curl',
    name: 'Stick Biceps Curl (Straight Bar)',
    muscle: 'biceps',
    secondaryMuscles: ['forearms'],
    youtubeUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    photoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Grip straight stick/bar with underhand grip shoulder-width apart',
      'Pin elbows securely against your ribcage',
      'Curl the bar up focusing entirely on bicep contraction',
      'Lower bar slowly through the full range of motion'
    ],
    mistakes: ['Swinging elbows forward or backward', 'Leaning torso backward to cheat']
  },
  {
    id: 'alternate-hammer-curl-db',
    name: 'Alternate Hammer Curl - DB',
    muscle: 'biceps',
    secondaryMuscles: ['forearms'],
    youtubeUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
    photoUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Hold dumbbells with neutral palms-facing-each-other grip',
      'Alternate curling one arm up at a time while keeping other locked',
      'Squeeze the outer bicep (brachialis) and forearm at peak',
      'Lower smoothly with controlled 2-second tempo'
    ],
    mistakes: ['Rotating wrists into supination (keep thumbs pointing up)', 'Rushing reps']
  },
  {
    id: 'wide-grip-z-bar',
    name: 'Wide Grip Z-Bar Curl',
    muscle: 'biceps',
    secondaryMuscles: ['forearms'],
    youtubeUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    photoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Grip EZ/Z-bar on the outer wide angled grooves',
      'Wide grip targets the short (inner) bicep head for fullness',
      'Keep upper arms stationary and curl bar to chest level',
      'Control the eccentric lowering phase'
    ],
    mistakes: ['Allowing elbows to flare outward away from body']
  },

  // ==================== TRICEPS ====================
  {
    id: 'rope-push-down',
    name: 'Rope Push Down',
    muscle: 'triceps',
    secondaryMuscles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    photoUrl: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Hinge torso slightly forward with elbows pinned to sides',
      'Push rope down extending arms fully',
      'Flare rope ends apart at the bottom to lock out triceps',
      'Return slowly until forearms reach just past 90 degrees'
    ],
    mistakes: ['Letting elbows drift forward into shoulder movement', 'Using body weight to push down']
  },
  {
    id: 'overhead-db-extension-single',
    name: 'Over Head DB Extension (Single Hand)',
    muscle: 'triceps',
    secondaryMuscles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8',
    photoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Sit or stand holding dumbbell overhead with one arm',
      'Lower dumbbell behind your head by bending at elbow',
      'Keep upper arm vertical and close to ear',
      'Extend arm back up squeezing tricep long head'
    ],
    mistakes: ['Allowing upper arm to flare out to the side', 'Arching spine']
  },
  {
    id: 'db-kick-back',
    name: 'DB Kick Back',
    muscle: 'triceps',
    secondaryMuscles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=ZO81bExngMI',
    photoUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Bend forward with torso parallel to ground or braced on bench',
      'Pin upper arm parallel to torso; upper arm does not move',
      'Extend forearm straight back until arm is fully locked out',
      'Squeeze tricep peak for 1 second, then lower slowly'
    ],
    mistakes: ['Swinging dumbbell with shoulder momentum', 'Dropping elbow below torso']
  },

  // ==================== LEGS ====================
  {
    id: 'normal-squat-with-dumbbell',
    name: 'Normal Squat with Dumbbell (Goblet Squat)',
    muscle: 'legs',
    secondaryMuscles: ['core'],
    youtubeUrl: 'https://www.youtube.com/watch?v=MeIiIdhvXT4',
    photoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Hold dumbbell vertically against chest with both hands under bell',
      'Feet shoulder-width apart, toes angled out ~20 degrees',
      'Descend by breaking at hips and knees simultaneously',
      'Squat down until hips are parallel with knees, keeping chest tall',
      'Drive through mid-foot and heels to return to top'
    ],
    mistakes: ['Heels lifting off ground', 'Knees caving inward', 'Rounding upper back']
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    muscle: 'legs',
    secondaryMuscles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Adjust backrest so knees align directly with machine pivot axis',
      'Pad should rest comfortably against lower shins just above ankles',
      'Extend legs upward until knees are straight, pausing 1s at top',
      'Lower weight under strict control for 2-3 seconds'
    ],
    mistakes: ['Kicking weight up fast with momentum', 'Lifting hips off seat']
  },
  {
    id: 'lunges',
    name: 'Lunges (Walking or Stationary)',
    muscle: 'legs',
    secondaryMuscles: ['core'],
    youtubeUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    photoUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Hold dumbbells at sides or bodyweight, stand tall',
      'Take long step forward; lower hips until front thigh is parallel to floor',
      'Back knee should hover 1 inch above the floor',
      'Drive through front heel to step forward or return to start'
    ],
    mistakes: ['Front knee shooting way past toes', 'Torso collapsing forward']
  },
  {
    id: 'calves-rise',
    name: 'Calves Rise (Standing or Seated)',
    muscle: 'legs',
    secondaryMuscles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Balls of feet on platform edge with heels hanging off',
      'Lower heels for a deep 2-second stretch at bottom',
      'Explode onto toes and squeeze calf muscles at peak for 1 second',
      'Keep knees stable without bouncing'
    ],
    mistakes: ['Bouncing rapidly without pausing at stretch and contraction']
  },

  // ==================== ABS & CORE ====================
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg / Knee Raise',
    muscle: 'core',
    secondaryMuscles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=Pr1ieGZ5atk',
    photoUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Hang from bar with active shoulders',
      'Curl pelvis upward toward chest rather than just swinging legs',
      'Pause for 1 second at top of movement',
      'Lower legs slowly without creating swinging momentum'
    ],
    mistakes: ['Swinging torso with pendulum momentum']
  },
  {
    id: 'ab-wheel-rollout',
    name: 'Ab Wheel Rollout',
    muscle: 'core',
    secondaryMuscles: ['shoulders'],
    youtubeUrl: 'https://www.youtube.com/watch?v=rqiTPdK1cWg',
    photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Kneel on mat with wheel directly beneath shoulders',
      'Tuck pelvis in posterior pelvic tilt and brace core rigid',
      'Roll wheel forward smoothly as far as you can maintain flat back',
      'Pull back through abdominal contraction'
    ],
    mistakes: ['Sagging lower back towards floor']
  },

  // ==================== CARDIO ====================
  {
    id: 'treadmill-incline-walk',
    name: 'Treadmill Incline Walk',
    muscle: 'cardio',
    secondaryMuscles: ['legs'],
    youtubeUrl: 'https://www.youtube.com/watch?v=F3-9rR3yT78',
    photoUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Set incline to 10% - 15% and speed to 4.5 - 5.5 km/h',
      'Walk upright without holding onto handrails for maximum core & leg activation',
      'Breathe rhythmically and maintain stride cadence'
    ],
    mistakes: ['Holding onto rails and leaning backward']
  }
];
