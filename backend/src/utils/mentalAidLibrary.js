// utils/mentalAidLibrary.js

export const mentalAidLibrary = {
  rules: [
    "Never give a medical diagnosis or prescribe medicine.",
    "Always respond with empathy, support, and understanding.",
    "If the user indicates self-harm or suicidal intent: immediately suggest contacting a campus counsellor or local emergency helpline.",
    "Respect privacy—never ask for personal data like phone numbers or emails.",
    "Keep responses brief, supportive, and under 140 words."
  ],

  goals: [
    "Provide immediate coping strategies for emotional distress.",
    "Offer emotional validation and reassurance.",
    "Guide through grounding, breathing, and mindfulness exercises.",
    "Encourage healthy routines: sleep, nutrition, movement.",
    "Promote social connection and journaling.",
    "Suggest professional counselling if distress is medium or high."
  ],

  techniques: {
    breathing: "Inhale for 4s, hold 4s, exhale for 6s. Repeat 5 times.",
    grounding: "Notice 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
    progressiveRelaxation: "Tense and relax each muscle group slowly.",
    visualization: "Imagine a safe, calm place with all details.",
    bodyScan: "Bring attention from toes to head, noticing sensations.",

    anxiety1: "Count backwards from 100 by 7s to distract anxious thoughts.",
    anxiety2: "Press your feet firmly into the floor and feel grounded.",
    stress1: "Write down your worries, then tear up the paper.",
    stress2: "Stand and stretch arms, neck, and back for 2 minutes.",
    stress3: "Drink water slowly, focusing on the sensation.",

    depression1: "Break tasks into tiny steps and reward yourself after each.",
    depression2: "List 3 small wins from today, even basic ones.",
    depression3: "Get sunlight for 10 minutes to boost mood.",
    motivation: "Set a 10-minute timer. Just start—momentum follows.",

    sleep1: "Avoid screens 30 minutes before bed.",
    sleep2: "Write tomorrow’s tasks to clear your mind.",
    sleep3: "Take 10 slow, deep breaths before lying down.",

    loneliness1: "Send a simple message to a friend: 'thinking of you'.",
    loneliness2: "Join a small campus activity or study group.",
    loneliness3: "Listen to uplifting music.",

    exam1: "Use Pomodoro: 25 min focus, 5 min break.",
    exam2: "Make a checklist of 3 study tasks per day.",
    exam3: "Stretch and hydrate between study sessions.",

    selfHarm1: "Hold ice cubes until the urge passes.",
    selfHarm2: "Draw on your arm with a red marker instead of cutting.",
    selfHarm3: "Scream into a pillow or tear paper for release."
  },

  escalation: {
    high: [
      "I’m really concerned for your safety. Please call your campus counsellor or emergency helpline immediately.",
      "You’re not alone—reach out to a trusted professional right now.",
      "If you’re thinking of harming yourself, please contact emergency services or a counsellor immediately."
    ],
    medium: [
      "I hear you. Here are some coping tips, but I also suggest connecting with a counsellor. Would you like me to arrange that?",
      "It sounds challenging. Speaking with a counsellor could help. Meanwhile, try these calming exercises.",
      "You’re handling a lot. Along with these strategies, consider booking a counselling session."
    ],
    low: [
      "You're not alone. Here are some strategies you can try right now.",
      "I understand this feels stressful. Let’s do a grounding or breathing exercise together.",
      "Small steps matter—here are tips to ease what you’re feeling."
    ]
  },

  topics: [
    {
      topic: "depression",
      aliases: ["major depressive disorder", "mood disorder", "clinical depression"],
      definition: "Depression affects how you feel, think, and manage daily activities.",
      signs: ["Persistent sadness", "Loss of interest", "Sleep/appetite changes", "Difficulty concentrating", "Feelings of worthlessness"],
      coping: ["Talk to a friend/family", "Practice daily routines", "Engage in light exercise", "Listen to calming music", "Write down thoughts"],
      self_help_exercises: ["List 3 small wins", "10 minutes sunlight", "Deep breathing exercises"],
      escalate: true,
      urgency_level: "high",
      recommended_professional_help: "Campus counsellor, psychologist, or psychiatrist"
    },
    {
      topic: "anxiety",
      aliases: ["generalized anxiety disorder", "panic disorder", "GAD"],
      definition: "Excessive worry or fear interfering with daily life.",
      signs: ["Restlessness", "Racing thoughts", "Rapid heartbeat", "Difficulty sleeping", "Excessive worry"],
      coping: ["Grounding exercises", "Deep breathing", "Limit caffeine", "Mindfulness meditation", "Progressive relaxation"],
      self_help_exercises: ["4-7-8 breathing", "Body scan meditation", "Stretching routine"],
      escalate: false,
      urgency_level: "medium",
      recommended_professional_help: "Counsellor or therapist"
    },
    {
      topic: "panic_attack",
      aliases: ["panic episode"],
      definition: "Sudden intense fear causing physical reactions without real danger.",
      signs: ["Shortness of breath", "Chest pain", "Rapid heartbeat", "Sweating", "Feeling out of control"],
      coping: ["Focus on slow breathing", "Remind yourself it will pass", "5-4-3-2-1 grounding", "Splash cold water on face", "Sit in a safe space"],
      self_help_exercises: ["Guided breathing", "Progressive relaxation", "Positive affirmations"],
      escalate: true,
      urgency_level: "high",
      recommended_professional_help: "Immediate counsellor support or helpline"
    }
  ]
};

// Helper: pick a random coping technique
export function getRandomTechnique() {
  const techniques = Object.values(mentalAidLibrary.techniques);
  return techniques[Math.floor(Math.random() * techniques.length)];
}
