// Curated Database of 100+ Gym Exercises with Posture Guides, Photos & Videos
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

export const EQUIPMENT_LIST = [
  { id: 'all', name: 'All Equipment' },
  { id: 'dumbbell', name: 'Dumbbell' },
  { id: 'barbell', name: 'Barbell' },
  { id: 'cable', name: 'Cable Machine' },
  { id: 'machine', name: 'Pin / Plate Machine' },
  { id: 'bodyweight', name: 'Bodyweight' },
  { id: 'smith-machine', name: 'Smith Machine' }
];

export const DEFAULT_EXERCISES = [
  {
    "id": "flat-dumbbell-press",
    "name": "Flat Dumbbell Press",
    "muscle": "chest",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "triceps",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=VmB1G1K7v94",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Retract shoulder blades and plant feet firmly on the floor",
      "Lower dumbbells with control until level with mid-chest",
      "Keep wrists straight and elbows angled ~45 degrees",
      "Press up smoothly squeezing pecs at the top without clashing weights"
    ],
    "mistakes": [
      "Flaring elbows out to 90 degrees",
      "Arching lower back off the bench"
    ]
  },
  {
    "id": "incline-db-press",
    "name": "Incline DB Press",
    "muscle": "chest",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "shoulders",
      "triceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=8iPEnn-ltC8",
    "photoUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Set bench angle to 30\u00b0 - 45\u00b0",
      "Keep dumbbells aligned directly above wrists and elbows",
      "Lower under control to upper chest level for deep stretch",
      "Drive upwards focusing tension on upper pectoral fibers"
    ],
    "mistakes": [
      "Setting bench angle too steep (>45\u00b0 becomes shoulder press)"
    ]
  },
  {
    "id": "pec-fly-machine",
    "name": "Pec Fly Machine",
    "muscle": "chest",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=Z57CtFmRMxA",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Adjust seat height so handles align with mid-chest",
      "Keep slight bend in elbows throughout entire movement",
      "Squeeze chest together imagining hugging a tree",
      "Controlled negative stretch without hyperextending shoulders"
    ],
    "mistakes": [
      "Bending and extending elbows like a press",
      "Shrugging shoulders into ears"
    ]
  },
  {
    "id": "pushups",
    "name": "Pushups (Normal or Knee)",
    "muscle": "chest",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "triceps",
      "core",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=IODxDxX7oi4",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Plank position with hands slightly wider than shoulder width",
      "Brace core and glutes to keep rigid straight line",
      "Lower chest until ~1 inch off the floor",
      "Push earth away through palms and lock out triceps"
    ],
    "mistakes": [
      "Sagging hips down",
      "Flaring elbows straight out"
    ]
  },
  {
    "id": "barbell-bench-press",
    "name": "Barbell Bench Press",
    "muscle": "chest",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "triceps",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=rT7DgCr-3pg",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Eyes directly under bar when racked; squeeze shoulder blades together",
      "Grip bar with thumbs wrapped, wrists stacked over forearms",
      "Lower bar to lower sternum with tuck at 45\u00b0 elbows",
      "Drive heels down into floor and press bar up"
    ],
    "mistakes": [
      "Bouncing bar off ribs",
      "Butt coming off bench"
    ]
  },
  {
    "id": "incline-barbell-bench-press",
    "name": "Incline Barbell Bench Press",
    "muscle": "chest",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "shoulders",
      "triceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=SrqOu55lrYU",
    "photoUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Set bench to 30 degrees",
      "Lower barbell with control towards upper clavicle",
      "Press upwards in a slight arc back over shoulders"
    ],
    "mistakes": [
      "Too steep angle shifting load purely to anterior delts"
    ]
  },
  {
    "id": "decline-barbell-bench-press",
    "name": "Decline Barbell Bench Press",
    "muscle": "chest",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "triceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=LfyQBUKR8SE",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Lock ankles into decline bench rollers securely",
      "Lower bar smoothly to lower pectoral line",
      "Drive upwards extending arms without locking elbows violently"
    ],
    "mistakes": [
      "Lifting head or neck during press"
    ]
  },
  {
    "id": "cable-crossover-high-to-low",
    "name": "Cable Crossover (High to Low)",
    "muscle": "chest",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=taI4XduLpTk",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Set cable pulleys above shoulder height",
      "Step forward into a staggered stance with slight forward torso lean",
      "Bring hands together in a downward arc meeting in front of waist",
      "Squeeze lower chest hard at peak contraction"
    ],
    "mistakes": [
      "Using momentum or bouncing hips"
    ]
  },
  {
    "id": "cable-fly-low-to-high",
    "name": "Cable Fly (Low to High)",
    "muscle": "chest",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=M1N804yCA-8",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Set pulleys at lowest peg with D-handles",
      "Stand tall, bring handles up and inwards towards chin/upper chest",
      "Keep elbows slightly bent and palms facing up"
    ],
    "mistakes": [
      "Shrugging traps instead of squeezing upper pecs"
    ]
  },
  {
    "id": "chest-press-machine",
    "name": "Chest Press Machine",
    "muscle": "chest",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "triceps",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=xUm0BiZCWlQ",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Seat height adjusted so grips line up with mid-nipple level",
      "Back and head planted firmly against back pad",
      "Press handles forward keeping chest proud and shoulders depressed",
      "Control the eccentric return until comfortable chest stretch"
    ],
    "mistakes": [
      "Letting shoulders roll forward at full lockout"
    ]
  },
  {
    "id": "incline-chest-press-machine",
    "name": "Incline Chest Press Machine",
    "muscle": "chest",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "shoulders",
      "triceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=V80f0c05Y2s",
    "photoUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Align handles with upper chest collarbone level",
      "Push upward along machine track focusing on upper pecs",
      "Resist the weight stack smoothly on descent"
    ],
    "mistakes": [
      "Letting weight stack slam between reps"
    ]
  },
  {
    "id": "dips-chest",
    "name": "Chest Dips (Parallel Bars)",
    "muscle": "chest",
    "equipment": "bodyweight",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "triceps",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=2z8JmcrW-As",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Lean torso forward ~30\u00b0 to bias lower chest over triceps",
      "Flare elbows slightly out as you descend until shoulders are below elbows",
      "Drive upwards keeping chest angled forward"
    ],
    "mistakes": [
      "Staying completely upright (targets triceps)"
    ]
  },
  {
    "id": "dumbbell-pullover",
    "name": "Dumbbell Pullover",
    "muscle": "chest",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "wings",
      "triceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=FK4rHfWKEac",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Lie perpendicular across flat bench with upper back supported",
      "Hold single dumbbell with diamond grip over chest",
      "Lower dumbbell back over head keeping arms mostly straight",
      "Pull back over chest feeling stretch in ribcage and pecs"
    ],
    "mistakes": [
      "Bending elbows excessively turning into skull crusher"
    ]
  },
  {
    "id": "smith-machine-bench-press",
    "name": "Smith Machine Bench Press",
    "muscle": "chest",
    "equipment": "smith-machine",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "triceps",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=wKk_i3Y01mQ",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Position flat bench directly under the fixed vertical bar path",
      "Rotate wrists to unrack hooks safely",
      "Lower smoothly with elbows tucked slightly"
    ],
    "mistakes": [
      "Positioning bench too far forward or backward"
    ]
  },
  {
    "id": "diamond-pushups",
    "name": "Diamond Pushups",
    "muscle": "chest",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "triceps",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=J0DnG1_S92I",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Join index fingers and thumbs to form diamond under center chest",
      "Keep elbows close to ribs on the descent",
      "Drive up to lockout focusing on inner pecs and triceps"
    ],
    "mistakes": [
      "Letting wrists bear awkward twisting angle"
    ]
  },
  {
    "id": "lat-pull-down",
    "name": "Lat Pull Down",
    "muscle": "wings",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "biceps",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=CAwf7n6Luuc",
    "photoUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Lock thighs under thigh pads firmly",
      "Grip bar slightly wider than shoulders with overhand grip",
      "Lean back slightly (10-15\u00b0), pull elbows straight down towards ribs",
      "Squeeze lats hard at clavicle level, resist upwards"
    ],
    "mistakes": [
      "Swinging torso backward like a rower",
      "Pulling behind neck"
    ]
  },
  {
    "id": "seated-row",
    "name": "Seated Row (Cable)",
    "muscle": "wings",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "biceps",
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=GZbfZ033f74",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Sit with knees slightly bent, chest up and tall posture",
      "Pull V-handle directly to belly button driving elbows backward",
      "Squeeze rhomboids and middle traps together",
      "Allow smooth forward stretch on return without rounding lower back"
    ],
    "mistakes": [
      "Using momentum and rocking hips back and forth",
      "Shrugging shoulders"
    ]
  },
  {
    "id": "rdl",
    "name": "RDL (Romanian Deadlift)",
    "muscle": "wings",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "legs",
      "glutes",
      "core"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=JCXUYuzwNrM",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Stand hip-width with slight bend in knees (keep angle fixed)",
      "Hinge at the hips, pushing butt straight back towards the wall",
      "Keep bar shaving down thighs and shins with flat neutral spine",
      "Drive hips forward and squeeze glutes and lats to return to standing"
    ],
    "mistakes": [
      "Squatting down instead of hinging",
      "Rounding lower lumbar spine"
    ]
  },
  {
    "id": "barbell-row",
    "name": "Barbell Row (Bent-over)",
    "muscle": "wings",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "biceps",
      "core"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=FWJR5Ve8gkQ",
    "photoUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Hinge forward ~45\u00b0 to 70\u00b0 with flat back and knees soft",
      "Overhand grip just outside knee width",
      "Pull bar into lower abdomen driving elbows back high",
      "Control bar down without letting torso bounce"
    ],
    "mistakes": [
      "Jerking torso upright on every rep",
      "Rounding thoracic spine"
    ]
  },
  {
    "id": "conventional-deadlift",
    "name": "Conventional Deadlift",
    "muscle": "wings",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "legs",
      "core",
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=op9kVnSso6Q",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Bar positioned directly over mid-foot",
      "Grip bar outside shins, pull chest tall to set spine",
      "Push floor away with legs, pulling bar straight up shin path",
      "Lock out hips and knees simultaneously without hyperextending back"
    ],
    "mistakes": [
      "Bar drifting away from body",
      "Hips shooting up before chest"
    ]
  },
  {
    "id": "pull-ups",
    "name": "Pull-ups (Wide Grip)",
    "muscle": "wings",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "biceps",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Overhand grip wider than shoulders",
      "Depress scapulae first before pulling",
      "Drive elbows toward floor and hips until chin clears bar",
      "Lower down with full controlled lat stretch"
    ],
    "mistakes": [
      "Kipping or swinging legs",
      "Half-reps not touching top"
    ]
  },
  {
    "id": "chin-ups",
    "name": "Chin-ups (Underhand Grip)",
    "muscle": "wings",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "biceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=brhRXlOhsAM",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Palms facing your face shoulder-width apart",
      "Pull chest to bar engaging biceps and lower lats",
      "Full extension at the bottom between reps"
    ],
    "mistakes": [
      "Dropping down rapidly without eccentric control"
    ]
  },
  {
    "id": "single-arm-dumbbell-row",
    "name": "Single-Arm Dumbbell Row",
    "muscle": "wings",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "biceps",
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=pYcpY20QaE8",
    "photoUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Support knee and hand on flat bench with flat horizontal back",
      "Pull dumbbell up in an arc towards hip pocket",
      "Keep torso locked without twisting spine open at the top"
    ],
    "mistakes": [
      "Twisting torso aggressively",
      "Yanking with arm instead of back"
    ]
  },
  {
    "id": "t-bar-row",
    "name": "T-Bar Row",
    "muscle": "wings",
    "equipment": "machine",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "biceps",
      "traps",
      "core"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=j3Igk5nyZE4",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Straddle the bar with knees bent and chest up",
      "Pull handles tight towards abdomen squeezing mid-back",
      "Hold peak contraction for 1 second"
    ],
    "mistakes": [
      "Standing up too tall turning into upright row"
    ]
  },
  {
    "id": "close-grip-lat-pulldown",
    "name": "Close Grip Lat Pull Down (V-Bar)",
    "muscle": "wings",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "biceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=ecRF8ERf34k",
    "photoUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Attach V-grip handle to lat pulldown cable",
      "Pull handle directly down to upper sternum",
      "Lead with elbows pulling down close to body sides"
    ],
    "mistakes": [
      "Rocking torso violently back"
    ]
  },
  {
    "id": "chest-supported-machine-row",
    "name": "Chest Supported Machine Row",
    "muscle": "wings",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "biceps",
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=UCXxvVItLoM",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Adjust chest pad so upper chest rests comfortably against it",
      "Pull handles back without letting chest peel off the pad",
      "Isolates back muscles with zero lower back strain"
    ],
    "mistakes": [
      "Using momentum to lift chest off support pad"
    ]
  },
  {
    "id": "straight-arm-cable-pulldown",
    "name": "Straight Arm Cable Lat Pushdown",
    "muscle": "wings",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "triceps",
      "core"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=wc1xHkxM-xI",
    "photoUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Stand back from high pulley with slight forward hip hinge",
      "Keep arms straight with minimal elbow bend",
      "Push bar down towards thighs in sweeping semi-circle arc"
    ],
    "mistakes": [
      "Bending elbows and turning into tricep pushdown"
    ]
  },
  {
    "id": "assisted-pullup-machine",
    "name": "Assisted Pull-up Machine",
    "muscle": "wings",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "biceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=83e6aV7gq9E",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Place knees or feet onto counterweight pad",
      "Heavier stack provides MORE assistance",
      "Pull smoothly to chin over bar height"
    ],
    "mistakes": [
      "Bouncing off bottom pad"
    ]
  },
  {
    "id": "face-pulls",
    "name": "Face Pulls (Cable Rope)",
    "muscle": "wings",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "shoulders",
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=rep-qVOkqgk",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Set rope attachment at eye height",
      "Pull rope towards forehead, separating rope ends apart",
      "Externally rotate shoulders at end range (thumbs pointing backward)"
    ],
    "mistakes": [
      "Pulling down toward neck instead of forehead"
    ]
  },
  {
    "id": "hyperextension-back",
    "name": "Hyperextension (Back Extension Bench)",
    "muscle": "wings",
    "equipment": "bodyweight",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "legs",
      "glutes"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=ph3pddpKzzw",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Hips on pad with room to hinge cleanly",
      "Lower upper body down under control",
      "Raise back up in line with legs, squeezing glutes and lower back"
    ],
    "mistakes": [
      "Hyperextending spine backwards aggressively"
    ]
  },
  {
    "id": "rack-pulls",
    "name": "Rack Pulls (Above Knee)",
    "muscle": "wings",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "traps",
      "glutes"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=u7NeLLz8aX8",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Set power rack safety pins just above or below knee level",
      "Hinge hips back, brace core, and drive through heels",
      "Lock hips forward at the top"
    ],
    "mistakes": [
      "Rounding upper spine under heavy load"
    ]
  },
  {
    "id": "shoulder-press",
    "name": "Shoulder Press (Dumbbell Overhead)",
    "muscle": "shoulders",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "triceps",
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=qEwKCR5JCog",
    "photoUrl": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Sit tall with back supported, dumbbells at ear level",
      "Elbows angled slightly forward (scapular plane ~30\u00b0), not flared 90\u00b0",
      "Press straight up overhead without clashing weights",
      "Lower with control until thumbs touch ear level"
    ],
    "mistakes": [
      "Excessive lower back arching",
      "Locking out with shrug"
    ]
  },
  {
    "id": "lateral-rise",
    "name": "Lateral Rise (Raise)",
    "muscle": "shoulders",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=3VcKaXpzqRo",
    "photoUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Stand with slight forward torso tilt and soft knees",
      "Lead with elbows, raising arms out to sides in wide arc",
      "Stop when arms reach shoulder height (parallel to floor)",
      "Lower slowly for 2-3 seconds resisting gravity"
    ],
    "mistakes": [
      "Swinging dumbbells using momentum",
      "Raising hands higher than elbows"
    ]
  },
  {
    "id": "reverse-flys",
    "name": "Reverse Flys (Rear Delts)",
    "muscle": "shoulders",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "traps",
      "wings"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=yPvv-oBq_a4",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Hinge forward 60-80\u00b0 or lie chest-down on incline bench",
      "Slight bend in elbows, palms facing each other or down",
      "Fly arms out wide focusing purely on posterior delts",
      "Controlled tempo, pause at peak squeeze"
    ],
    "mistakes": [
      "Using traps and squeezing scapulae instead of rear delts"
    ]
  },
  {
    "id": "shrugs",
    "name": "Shrugs (Dumbbell or Barbell)",
    "muscle": "shoulders",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=cJRVVxmytaM",
    "photoUrl": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Stand tall holding weights at sides",
      "Elevate shoulders straight up towards ears in vertical line",
      "Hold squeeze at top for full second",
      "Lower all the way down for deep trap stretch"
    ],
    "mistakes": [
      "Rolling shoulders in circles (can damage rotator cuff)"
    ]
  },
  {
    "id": "barbell-ohp",
    "name": "Barbell Overhead Press (OHP / Military Press)",
    "muscle": "shoulders",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "triceps",
      "core"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=2yjwXTZQDDI",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Rest bar on front delts with hands just outside shoulders",
      "Squeeze glutes and abs tight, move head back as bar clears face",
      "Lock bar out directly over crown of head"
    ],
    "mistakes": [
      "Hyperextending spine like a standing incline bench press"
    ]
  },
  {
    "id": "arnold-press",
    "name": "Arnold Press",
    "muscle": "shoulders",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "triceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=6Z15_WdXmVw",
    "photoUrl": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Start with dumbbells at chin level, palms facing you",
      "Rotate wrists outward as you press overhead",
      "Top position has palms facing forward"
    ],
    "mistakes": [
      "Jerking or rushing the wrist rotation"
    ]
  },
  {
    "id": "cable-lateral-raise",
    "name": "Cable Lateral Raise",
    "muscle": "shoulders",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=PPrzBWZDOhA",
    "photoUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Set low pulley behind or in front of body",
      "Raise arm out smoothly to side maintaining constant cable tension",
      "Lower smoothly with 3 second negative"
    ],
    "mistakes": [
      "Using body lean to lift the weight"
    ]
  },
  {
    "id": "machine-shoulder-press",
    "name": "Machine Shoulder Press",
    "muscle": "shoulders",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "triceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=Wqq43dKW1TU",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Adjust seat so grips sit at ear level",
      "Press upwards along guided trajectory",
      "Lower without banging weight stack"
    ],
    "mistakes": [
      "Slouching upper back"
    ]
  },
  {
    "id": "front-dumbbell-raise",
    "name": "Front Dumbbell Raise",
    "muscle": "shoulders",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "chest"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=-t7fuZ42_zs",
    "photoUrl": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Raise dumbbells straight forward to eye level",
      "Keep torso still with abs braced",
      "Lower with slow eccentric control"
    ],
    "mistakes": [
      "Rocking body back and forth"
    ]
  },
  {
    "id": "smith-behind-neck-press",
    "name": "Behind the Neck Press (Smith Machine)",
    "muscle": "shoulders",
    "equipment": "smith-machine",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "triceps",
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=2e84qG6-p58",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Sit upright, bar path aligned with back of head",
      "Lower bar only to top of ears / base of skull (do not force extreme depth)",
      "Press straight up smoothly"
    ],
    "mistakes": [
      "Going too deep if you have limited shoulder mobility"
    ]
  },
  {
    "id": "upright-row",
    "name": "Upright Row (Barbell or Cable)",
    "muscle": "shoulders",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "traps",
      "biceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=amCU-ziHITM",
    "photoUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Wide grip (wider than shoulder width reduces impingement)",
      "Pull elbows up towards ceiling until bar reaches chest level"
    ],
    "mistakes": [
      "Using narrow grip which pinches shoulders"
    ]
  },
  {
    "id": "rear-delt-pec-deck",
    "name": "Rear Delt Machine Fly (Reverse Pec Deck)",
    "muscle": "shoulders",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=6yMdhi2DVao",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Sit facing pad with handles set back",
      "Grip neutral, drive elbows out wide backwards",
      "Feel rear delts contract without pinching shoulder blades"
    ],
    "mistakes": [
      "Using back traps to pull instead of delts"
    ]
  },
  {
    "id": "plate-front-raise",
    "name": "Plate Front Raise",
    "muscle": "shoulders",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "chest"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=r0w2cZ58VnI",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Hold weight plate at 9 and 3 o clock positions",
      "Raise plate straight forward up to eye level, pause, and lower"
    ],
    "mistakes": [
      "Swinging hips to hoist plate"
    ]
  },
  {
    "id": "lu-raises",
    "name": "Lu Lateral Raises (Full ROM)",
    "muscle": "shoulders",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "traps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=QpS_tS0j8q8",
    "photoUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Light dumbbells; raise all the way overhead until plates touch",
      "Controlled return back down to hips"
    ],
    "mistakes": [
      "Using too heavy weight"
    ]
  },
  {
    "id": "stick-biceps-curl",
    "name": "Stick Biceps Curl (Straight Bar)",
    "muscle": "biceps",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=QZEqB6wUPxQ",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Shoulder-width underhand grip on straight Olympic/standard bar",
      "Lock elbows tight to ribs and do not let them drift forward",
      "Curl bar up towards shoulders in smooth arc",
      "Squeeze biceps hard at top, lower for 3 seconds"
    ],
    "mistakes": [
      "Swinging hips and leaning back",
      "Elbows drifting way forward"
    ]
  },
  {
    "id": "alternate-hammer-curl-db",
    "name": "Alternate Hammer Curl - DB",
    "muscle": "biceps",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=zC3nLlEvin4",
    "photoUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Neutral grip with palms facing each other throughout movement",
      "Curl one dumbbell at a time up towards front of shoulder",
      "Targets brachialis and brachioradialis for arm thickness",
      "Keep upper body stationary without swinging"
    ],
    "mistakes": [
      "Rotating palms up (turns into standard curl)",
      "Using body sway"
    ]
  },
  {
    "id": "wide-grip-zbar",
    "name": "Wide Grip Z-Bar Curl",
    "muscle": "biceps",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=sAq_ocpRh_I",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Use outer angled grips on EZ-curl bar",
      "Wider hand placement emphasizes the short inner head of the biceps",
      "Full extension at the bottom without relaxing triceps",
      "Curl up smoothly with stationary elbows"
    ],
    "mistakes": [
      "Curling wrists inward at the peak",
      "Dropping weight quickly"
    ]
  },
  {
    "id": "preacher-curl",
    "name": "Preacher Curl (EZ-Bar)",
    "muscle": "biceps",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=fIWP-FRFNU0",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Armpits snug over top of preacher bench pad",
      "Lower bar until arms are almost fully extended",
      "Curl upward keeping triceps glued to pad"
    ],
    "mistakes": [
      "Violently hyperextending elbows at the bottom"
    ]
  },
  {
    "id": "incline-dumbbell-curl",
    "name": "Incline Dumbbell Bicep Curl",
    "muscle": "biceps",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=soxrZlIl35U",
    "photoUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Set bench to 45-60 degree incline",
      "Let arms hang straight down behind torso for deep long head stretch",
      "Supinate wrists as you curl up"
    ],
    "mistakes": [
      "Bringing elbows forward off line of gravity"
    ]
  },
  {
    "id": "concentration-curl",
    "name": "Concentration Curl",
    "muscle": "biceps",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=Jvj2wV0vOYU",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Sit on bench, wedge elbow against inside of thigh",
      "Curl dumbbell up toward face focusing on peak contraction"
    ],
    "mistakes": [
      "Using shoulder to hoist weight"
    ]
  },
  {
    "id": "cable-bicep-curl",
    "name": "Cable Bicep Curl (Straight Bar / Rope)",
    "muscle": "biceps",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=4OKflrNqQJk",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Constant tension at the bottom of the movement from the cable",
      "Curl up smoothly with elbows pinned to sides"
    ],
    "mistakes": [
      "Leaning backwards"
    ]
  },
  {
    "id": "machine-bicep-curl",
    "name": "Machine Bicep Curl",
    "muscle": "biceps",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=Ja6ZlIDONac",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Seat adjusted so elbow joint aligns directly with machine pivot axis",
      "Grip handles, curl smoothly to peak bicep pump"
    ],
    "mistakes": [
      "Lifting elbows off pad"
    ]
  },
  {
    "id": "spider-curl",
    "name": "Spider Curl (Prone Incline)",
    "muscle": "biceps",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=ke2shAi_j78",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Lie chest down on 45\u00b0 incline bench",
      "Arms hang vertically; curl bar straight up with zero body English"
    ],
    "mistakes": [
      "Swinging legs"
    ]
  },
  {
    "id": "cable-hercules-curl",
    "name": "Cable High Pulley Curl (Hercules Curl)",
    "muscle": "biceps",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=J3c46e3vI-Y",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Stand between dual cable stacks with handles set high",
      "Curl handles inwards toward ears hitting double-bicep pose"
    ],
    "mistakes": [
      "Dropping elbows down"
    ]
  },
  {
    "id": "reverse-grip-curl",
    "name": "Reverse Grip Bicep Curl (EZ Bar)",
    "muscle": "biceps",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=nBh68UMmxv8",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Overhand grip (palms facing down)",
      "Develops brachioradialis and forearm extensor muscles"
    ],
    "mistakes": [
      "Using too heavy weight and flexing wrists back"
    ]
  },
  {
    "id": "21s-bicep-curl",
    "name": "21s Bicep Curl",
    "muscle": "biceps",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=qf6Bmz_8n0Y",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "7 bottom half reps, 7 top half reps, 7 full ROM reps in one brutal set"
    ],
    "mistakes": [
      "Stopping before 21 reps"
    ]
  },
  {
    "id": "cross-body-hammer-curl",
    "name": "Cross Body Hammer Curl",
    "muscle": "biceps",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=Vl0Y7b9dFzg",
    "photoUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Curl dumbbell across chest towards opposite shoulder",
      "Keep palm neutral"
    ],
    "mistakes": [
      "Turning palm up"
    ]
  },
  {
    "id": "rope-push-down",
    "name": "Rope Push Down",
    "muscle": "triceps",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=vB5OHsJ3EME",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Attach rope to high cable pulley, hinge forward slightly at hips",
      "Pin elbows firmly to ribs - only forearms move",
      "Push rope down and split ends outward at bottom for peak triceps contraction",
      "Return under control until forearms pass 90\u00b0 angle"
    ],
    "mistakes": [
      "Letting elbows drift up and forward on the return",
      "Using body weight to press"
    ]
  },
  {
    "id": "overhead-db-extension",
    "name": "Over Head DB Extension (Single Hand)",
    "muscle": "triceps",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=-Vyt2QdsR7E",
    "photoUrl": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Hold dumbbell vertically overhead, upper arm pointed towards ceiling",
      "Lower dumbbell behind head bending elbow to ~90\u00b0 for deep stretch",
      "Extend arm upwards focusing purely on long head of triceps",
      "Keep elbow pointing straight up, not flaring out to side"
    ],
    "mistakes": [
      "Elbow flaring outward",
      "Arching lower back"
    ]
  },
  {
    "id": "db-kick-back",
    "name": "Db Kick Back",
    "muscle": "triceps",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=6SS6K3lAwZ8",
    "photoUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Hinge forward until torso is nearly parallel to floor",
      "Pin upper arm parallel to torso and lock it in place",
      "Extend forearm backward until arm is completely straight",
      "Pause for 1 second squeezing the lateral/medial triceps head"
    ],
    "mistakes": [
      "Dropping upper arm down",
      "Swinging dumbbell with momentum"
    ]
  },
  {
    "id": "straight-bar-cable-pushdown",
    "name": "Straight Bar Cable Pushdown",
    "muscle": "triceps",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=2-LAMcpzODU",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Overhand grip on straight or angled bar",
      "Drive down to thighs and lock out elbows",
      "Control ascent smoothly"
    ],
    "mistakes": [
      "Leaning chest over bar to use bodyweight"
    ]
  },
  {
    "id": "skull-crushers",
    "name": "Skull Crushers (EZ Bar Lying Triceps Extension)",
    "muscle": "triceps",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "chest"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=d_KZxkY_0cM",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Lie on flat bench, hold EZ bar above chest with arms angled slightly backward",
      "Bend elbows to lower bar towards forehead or crown of head",
      "Extend back up without moving upper arms"
    ],
    "mistakes": [
      "Flaring elbows wide"
    ]
  },
  {
    "id": "overhead-cable-rope-extension",
    "name": "Overhead Cable Rope Extension",
    "muscle": "triceps",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=1u18yJcLDA0",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Facing away from cable machine, hold rope behind neck",
      "Step forward in staggered stance, extend arms forward overhead"
    ],
    "mistakes": [
      "Losing balance and rounding lower back"
    ]
  },
  {
    "id": "close-grip-bench-press",
    "name": "Close Grip Barbell Bench Press",
    "muscle": "triceps",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "chest",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=nEF0bv2FW94",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Grip bar with hands shoulder-width apart (not too narrow to save wrists)",
      "Keep elbows tucked close to ribs as you lower to sternum",
      "Press up driving through triceps"
    ],
    "mistakes": [
      "Gripping with hands touching (wrecks wrists)"
    ]
  },
  {
    "id": "tricep-dip-machine",
    "name": "Triceps Dip Machine",
    "muscle": "triceps",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "chest",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=wX-y0K4bK0U",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Sit upright with back against pad, hands on handles",
      "Push handles down until arms lock out",
      "Control return to 90 degrees"
    ],
    "mistakes": [
      "Leaning too far forward"
    ]
  },
  {
    "id": "bench-dips",
    "name": "Bench Dips (Bodyweight / Weighted)",
    "muscle": "triceps",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=0326dy_-CzM",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Hands on edge of bench, feet extended in front",
      "Lower hips close to bench until elbows reach 90\u00b0",
      "Press back up through palms"
    ],
    "mistakes": [
      "Drifting hips far away from bench (strains front shoulders)"
    ]
  },
  {
    "id": "v-bar-cable-pushdown",
    "name": "V-Bar Cable Pushdown",
    "muscle": "triceps",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=fV7M8a2Qj7c",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Use angled V-bar attachment",
      "Press down smoothly, locking out triceps"
    ],
    "mistakes": [
      "Letting shoulders shrug up"
    ]
  },
  {
    "id": "single-arm-cable-tricep-ext",
    "name": "Single-Arm Cable Triceps Extension",
    "muscle": "triceps",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "forearms"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=o0i1b_2P87k",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Hold bare cable ball without attachment for freedom of motion",
      "Extend down diagonally focusing on triceps contraction"
    ],
    "mistakes": [
      "Swinging shoulder"
    ]
  },
  {
    "id": "tate-press",
    "name": "Tate Press (Dumbbell)",
    "muscle": "triceps",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "chest"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=O37Jv6b2sLg",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Lie on flat bench with dumbbells touching over chest",
      "Bend elbows inward towards chest, press back out to lockout"
    ],
    "mistakes": [
      "Using excessive weight"
    ]
  },
  {
    "id": "overhead-ez-bar-tricep-ext",
    "name": "Overhead EZ Bar Triceps Extension",
    "muscle": "triceps",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=4l4NnB4w5bE",
    "photoUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Seated on low back bench, press EZ bar overhead",
      "Lower behind neck, feeling deep stretch in long triceps head"
    ],
    "mistakes": [
      "Elbows splaying out excessively"
    ]
  },
  {
    "id": "normal-squat-dumbbell",
    "name": "Normal Squat with Dumbbell (Goblet Squat)",
    "muscle": "legs",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "glutes",
      "core"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=MeIiIdhvXT4",
    "photoUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Hold dumbbell vertically against chest with both palms cupping the top",
      "Feet shoulder-width apart, toes turned out 15-30 degrees",
      "Send hips back and down, knees tracking in line with toes",
      "Descend until thighs are at least parallel to floor, drive through mid-foot"
    ],
    "mistakes": [
      "Knees caving inward (valgus collapse)",
      "Heels lifting off floor"
    ]
  },
  {
    "id": "leg-extension",
    "name": "Leg Extension (Machine)",
    "muscle": "legs",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "quads"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=YyvSfVjQeL0",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Adjust back pad so knees line up with the machine's pivot point",
      "Shin pad rests comfortably above ankles",
      "Extend legs smoothly to lockout, squeezing quadriceps at the top",
      "Control the eccentric return - do not allow weights to slam"
    ],
    "mistakes": [
      "Kicking the weight violently with momentum",
      "Butt lifting out of seat"
    ]
  },
  {
    "id": "lunges",
    "name": "Lunges (Walking or Stationary DB)",
    "muscle": "legs",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "glutes",
      "calves"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
    "photoUrl": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Take large step forward, keeping torso upright and core engaged",
      "Lower rear knee until it gently hovers ~1 inch above ground",
      "Front knee directly above ankle (not shooting past toes)",
      "Push through front heel to step forward or return to starting stance"
    ],
    "mistakes": [
      "Torso collapsing forward",
      "Front knee wobbling inwards"
    ]
  },
  {
    "id": "calves-rise",
    "name": "Calves Rise (Standing or Seated)",
    "muscle": "legs",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "calves"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=-M4-G8p8fmc",
    "photoUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Balls of feet on elevated block or machine platform",
      "Lower heels below platform for full Achilles and calf stretch",
      "Drive high onto big toes, squeezing gastrocnemius/soleus at peak",
      "Pause for 2 full seconds at the top and bottom of each rep"
    ],
    "mistakes": [
      "Bouncing rapidly without pausing",
      "Bending knees on standing raises"
    ]
  },
  {
    "id": "barbell-back-squat",
    "name": "Barbell Back Squat",
    "muscle": "legs",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "glutes",
      "core"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=bEv6CCg2BC8",
    "photoUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Bar resting securely on upper traps (high bar) or rear delts (low bar)",
      "Deep breath into belly, brace core 360 degrees",
      "Squat down until hip crease is below top of knees",
      "Drive upwards pushing floor away through midfoot"
    ],
    "mistakes": [
      "Rounding lower back (butt wink)",
      "Knees collapsing inwards"
    ]
  },
  {
    "id": "barbell-front-squat",
    "name": "Barbell Front Squat",
    "muscle": "legs",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "core",
      "quads"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=uYumuL_G_V0",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Fingertip clean grip or cross-arm grip on front delts",
      "Keep elbows high pointing straight ahead at all times",
      "Maintains completely vertical torso, massive quad emphasis"
    ],
    "mistakes": [
      "Elbows dropping down causing bar to slip"
    ]
  },
  {
    "id": "leg-press-45",
    "name": "Leg Press (45\u00b0 Sled)",
    "muscle": "legs",
    "equipment": "machine",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Feet shoulder-width on footplate",
      "Lower sled until knees reach 90 degrees",
      "Press through full foot, do not hyperextend/lock knees at the top"
    ],
    "mistakes": [
      "Allowing lower back to peel off back support pad",
      "Locking knees violently"
    ]
  },
  {
    "id": "lying-leg-curl",
    "name": "Lying Leg Curl (Hamstring Machine)",
    "muscle": "legs",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "calves"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Lie face down, pad resting just below calves",
      "Curl pad all the way to glutes, keeping hips pressed into bench",
      "Slow 3 second lowering"
    ],
    "mistakes": [
      "Hips arching up off the bench"
    ]
  },
  {
    "id": "seated-leg-curl",
    "name": "Seated Leg Curl (Machine)",
    "muscle": "legs",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "calves"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=Orxowest56U",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Thigh clamp tightened down securely",
      "Curl heels underneath seat as far as possible",
      "Excellent hamstring stretch at top of rep"
    ],
    "mistakes": [
      "Letting thigh pad remain loose"
    ]
  },
  {
    "id": "bulgarian-split-squat",
    "name": "Bulgarian Split Squat (Dumbbell)",
    "muscle": "legs",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "glutes"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=2C-uNgKwPLE",
    "photoUrl": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Rear foot elevated on flat bench behind you",
      "Descend until front thigh is parallel to floor",
      "Drive through front heel"
    ],
    "mistakes": [
      "Hopping foot too close or too far from bench"
    ]
  },
  {
    "id": "hack-squat-machine",
    "name": "Hack Squat (Machine)",
    "muscle": "legs",
    "equipment": "machine",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "glutes"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=0tn5K9NlCfo",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Shoulders and back glued against padded sled",
      "Descend deep to 90 degrees or below",
      "Direct quad isolation with zero balance required"
    ],
    "mistakes": [
      "Lifting heels off footplate"
    ]
  },
  {
    "id": "hip-thrust-barbell",
    "name": "Hip Thrust (Barbell or Machine)",
    "muscle": "legs",
    "equipment": "barbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "hamstrings"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=SEdqd1n0cvg",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Upper back against bench, barbell cushioned across hips",
      "Drive hips towards ceiling until thighs and torso form straight horizontal line",
      "Tuck chin slightly, squeeze glutes maximally for 1 second"
    ],
    "mistakes": [
      "Overextending lumbar spine at top"
    ]
  },
  {
    "id": "glute-bridge",
    "name": "Glute Bridge (Mat)",
    "muscle": "legs",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "glutes",
      "core"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=wPM8icPu6H8",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Lie on back with knees bent and feet flat on floor",
      "Lift hips up squeezing glutes, hold for 2 seconds"
    ],
    "mistakes": [
      "Pushing through toes instead of heels"
    ]
  },
  {
    "id": "smith-machine-squat",
    "name": "Smith Machine Squat",
    "muscle": "legs",
    "equipment": "smith-machine",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "glutes"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=uK8oGZ_c7d8",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Place feet slightly out in front of bar for quad focus",
      "Descend smoothly along fixed track"
    ],
    "mistakes": [
      "Placing feet directly under hips causing knee strain"
    ]
  },
  {
    "id": "standing-calf-raise-machine",
    "name": "Standing Calf Raise Machine",
    "muscle": "legs",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "calves"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=N3AwvrmY48A",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Shoulder pads adjusted securely, legs straight with knees unlocked",
      "Full deep stretch at the bottom, explosive drive onto toes"
    ],
    "mistakes": [
      "Bending knees and bouncing"
    ]
  },
  {
    "id": "seated-calf-raise-machine",
    "name": "Seated Calf Raise (Soleus Focus)",
    "muscle": "legs",
    "equipment": "machine",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "calves"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=JbyjNymZOt0",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Knees bent at 90 degrees isolates soleus muscle underneath calf",
      "Full range of motion with slow controlled cadence"
    ],
    "mistakes": [
      "Half reps"
    ]
  },
  {
    "id": "cable-glute-kickback",
    "name": "Cable Glute Kickbacks",
    "muscle": "legs",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "glutes"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=FmWQo7Kvd9E",
    "photoUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Ankle strap attached to low cable",
      "Kick leg straight back squeezing glute at peak extension"
    ],
    "mistakes": [
      "Arching lower back excessively"
    ]
  },
  {
    "id": "adductor-abductor-machine",
    "name": "Inner / Outer Thigh Machine (Adductor/Abductor)",
    "muscle": "legs",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "glutes"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=gA_bTj9Jm-w",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Squeeze knees inward for adductors or push outwards for abductors",
      "Hold squeeze for 1 second"
    ],
    "mistakes": [
      "Using explosive jerks"
    ]
  },
  {
    "id": "hanging-leg-raise",
    "name": "Hanging Leg / Knee Raise",
    "muscle": "core",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "wings"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=hdng3Nm1x_E",
    "photoUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Hang from pull-up bar with overhand grip",
      "Roll pelvis up towards ribs rather than just swinging hip flexors",
      "Raise toes to bar level (or knees to chest for regression)",
      "Lower legs slowly without swinging"
    ],
    "mistakes": [
      "Using momentum to swing body back and forth"
    ]
  },
  {
    "id": "ab-wheel-rollout",
    "name": "Ab Wheel Rollout",
    "muscle": "core",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "wings",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=rqiTPdK1c_I",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Kneel on mat with wheel directly under shoulders",
      "Posterior pelvic tilt (tuck tailbone under, round upper back slightly)",
      "Roll wheel out forward extending body as far as controllable",
      "Contract abs hard to pull wheel back underneath you"
    ],
    "mistakes": [
      "Letting lower back sag into extension"
    ]
  },
  {
    "id": "cable-woodchoppers",
    "name": "Cable Woodchoppers",
    "muscle": "core",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=pAplQXk3dkU",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Set cable at high or shoulder height",
      "Rotate torso across body using obliques",
      "Pivot rear foot as you turn"
    ],
    "mistakes": [
      "Pulling with arms instead of rotating with core"
    ]
  },
  {
    "id": "cable-kneeling-crunch",
    "name": "Cable Crunch (Kneeling Rope)",
    "muscle": "core",
    "equipment": "cable",
    "defaultUnit": "blocks",
    "secondaryMuscles": [],
    "youtubeUrl": "https://www.youtube.com/watch?v=2fbujeH3dBg",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Kneel below high pulley, holding rope ends by temples",
      "Flex spine, curling ribcage down towards pelvis",
      "Keep hips fixed in place; do not sit back onto heels"
    ],
    "mistakes": [
      "Hinging at the hips instead of curling the spine"
    ]
  },
  {
    "id": "plank",
    "name": "Plank (Forearms Standard / Weighted)",
    "muscle": "core",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "shoulders",
      "glutes"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=pSHjTRCQxIw",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Forearms on ground, elbows stacked directly under shoulders",
      "Squeeze glutes and abs to form straight horizontal line from head to heels"
    ],
    "mistakes": [
      "Sagging hips down or hiking hips up in the air"
    ]
  },
  {
    "id": "russian-twists",
    "name": "Russian Twists (Plate / Dumbbell)",
    "muscle": "core",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [],
    "youtubeUrl": "https://www.youtube.com/watch?v=wkD8rjkodUI",
    "photoUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Sit on mat, lean torso back 45 degrees, feet elevated",
      "Rotate shoulders and weight from hip to hip"
    ],
    "mistakes": [
      "Only moving arms without rotating torso"
    ]
  },
  {
    "id": "bicycle-crunches",
    "name": "Bicycle Crunches",
    "muscle": "core",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [],
    "youtubeUrl": "https://www.youtube.com/watch?v=9FGilxCbdz8",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Opposite elbow to opposite knee, extending alternate leg straight out",
      "Focus on slow, twisting abdominal contraction"
    ],
    "mistakes": [
      "Yanking neck with hands"
    ]
  },
  {
    "id": "decline-bench-situps",
    "name": "Decline Bench Sit-ups",
    "muscle": "core",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [],
    "youtubeUrl": "https://www.youtube.com/watch?v=1ea7_h1F0kE",
    "photoUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Lock ankles into decline bench rollers",
      "Curl upper body up curling spine sequentially"
    ],
    "mistakes": [
      "Bouncing off bench at the bottom"
    ]
  },
  {
    "id": "machine-abdominal-crunch",
    "name": "Machine Abdominal Crunch",
    "muscle": "core",
    "equipment": "machine",
    "defaultUnit": "blocks",
    "secondaryMuscles": [],
    "youtubeUrl": "https://www.youtube.com/watch?v=33LzK77yBsw",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Adjust seat height so pivot axis matches belly button level",
      "Crunch elbows down toward knees, exhaling fully"
    ],
    "mistakes": [
      "Using legs to push instead of abs"
    ]
  },
  {
    "id": "captains-chair-leg-raise",
    "name": "Captains Chair Leg / Knee Raise",
    "muscle": "core",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [],
    "youtubeUrl": "https://www.youtube.com/watch?v=rtsWd0q2yio",
    "photoUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Forearms supported on pads, back pressed against backrest",
      "Raise knees smoothly up towards chest"
    ],
    "mistakes": [
      "Swinging legs"
    ]
  },
  {
    "id": "treadmill-incline-walk",
    "name": "Treadmill Incline Walk / Run",
    "muscle": "cardio",
    "equipment": "machine",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "legs",
      "calves"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=8VwufbVwE9I",
    "photoUrl": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Set incline between 6% to 15% and speed to 4.5 - 6.0 km/h",
      "Do NOT hold onto the handrails - swing arms naturally",
      "Drive through heels and engage calves and glutes on each step",
      "Maintain tall posture with chest up"
    ],
    "mistakes": [
      "Holding handrails and leaning back (cancels the incline benefits)"
    ]
  },
  {
    "id": "stationary-bike",
    "name": "Stationary Exercise Bike",
    "muscle": "cardio",
    "equipment": "machine",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "legs"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=0hYyW_z292k",
    "photoUrl": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Adjust seat height so knee has slight 10-15\u00b0 bend at lowest pedal position",
      "Smooth pedal strokes pulling up and pushing down"
    ],
    "mistakes": [
      "Seat set too low causing knee discomfort"
    ]
  },
  {
    "id": "rowing-machine",
    "name": "Rowing Machine (Concept 2 Erg)",
    "muscle": "cardio",
    "equipment": "machine",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "wings",
      "legs",
      "biceps"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=zQ82RYIFLN8",
    "photoUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Drive order: Legs -> Torso -> Arms",
      "Recovery order: Arms -> Torso -> Legs",
      "Explosive push through legs, smooth control on recovery"
    ],
    "mistakes": [
      "Bending knees before arms have cleared"
    ]
  },
  {
    "id": "stair-climber",
    "name": "Stair Climber (StairMaster)",
    "muscle": "cardio",
    "equipment": "machine",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "legs",
      "glutes",
      "calves"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=t1rQ0M5f_e4",
    "photoUrl": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Step with full foot on each step",
      "Keep hands light on rails for balance only"
    ],
    "mistakes": [
      "Leaning on handrails supporting upper body weight"
    ]
  },
  {
    "id": "elliptical-trainer",
    "name": "Elliptical Trainer",
    "muscle": "cardio",
    "equipment": "machine",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "legs"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=uK1H_rZlY2Y",
    "photoUrl": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Low impact full body cardio",
      "Push and pull the moving handles actively"
    ],
    "mistakes": [
      "Slumping over"
    ]
  },
  {
    "id": "jump-rope",
    "name": "Jump Rope",
    "muscle": "cardio",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "calves",
      "shoulders"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=1BZM2Vre5oc",
    "photoUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Stay light on balls of feet",
      "Rotate rope from wrists, keep elbows pinned near ribs"
    ],
    "mistakes": [
      "Jumping too high off the floor"
    ]
  },
  {
    "id": "battle-ropes",
    "name": "Battle Ropes (Alternating Waves)",
    "muscle": "cardio",
    "equipment": "bodyweight",
    "defaultUnit": "reps",
    "secondaryMuscles": [
      "shoulders",
      "core"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=4UaHvxuK58M",
    "photoUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Quarter squat athletic stance",
      "Create continuous fluid alternating waves down to anchor point"
    ],
    "mistakes": [
      "Standing upright with locked knees"
    ]
  },
  {
    "id": "kettlebell-swings",
    "name": "Kettlebell Swings (Russian)",
    "muscle": "cardio",
    "equipment": "dumbbell",
    "defaultUnit": "kg",
    "secondaryMuscles": [
      "legs",
      "glutes",
      "wings"
    ],
    "youtubeUrl": "https://www.youtube.com/watch?v=sSESeQAir2M",
    "photoUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "cues": [
      "Pure hip hinge movement, not a squat",
      "Snap hips forward powerfully to float bell to chest height"
    ],
    "mistakes": [
      "Lifting bell with front shoulders"
    ]
  }
];
