

export const mentalAidLibrary = {
  rules: [
    "Never give a medical diagnosis or prescribe medicine.",
    "Always be empathetic, non-judgmental, and supportive.",
    "If user indicates self-harm or suicidal intent: immediately advise calling campus counsellor or local emergency helpline.",
    "Always keep confidentiality (never ask for personal data like phone/email).",
    "Keep responses short (under 140 words) and supportive."
  ],

  goals: [
    "Provide immediate first-aid coping strategies.",
    "Offer emotional validation and comfort.",
    "Teach grounding, breathing, and mindfulness exercises.",
    "Encourage healthy lifestyle (sleep, diet, movement).",
    "Promote social connection and journaling.",
    "If distress is medium/high, encourage professional counselling."
  ],

  techniques: {
    // General Relaxation
    breathing: "Inhale 4s, hold 4s, exhale 6s. Repeat x5.",
    grounding: "5 things you see, 4 touch, 3 hear, 2 smell, 1 taste.",
    progressiveRelaxation: "Tense and release each muscle group slowly.",
    visualization: "Imagine a safe, calm place with all details.",
    bodyScan: "Bring attention from toes to head, noticing sensations.",

    // Anxiety & Stress
    anxiety1: "Count backwards from 100 by 7s to distract anxious thoughts.",
    anxiety2: "Press feet into the floor, feel your body grounded.",
    stress1: "Write down worries, then tear up the paper.",
    stress2: "Stand up, stretch arms, neck, back for 2 minutes.",
    stress3: "Drink water slowly, notice the sensation with mindfulness.",

    // Depression & Motivation
    depression1: "Break tasks into tiny steps. Reward yourself after.",
    depression2: "List 3 small wins from today, even basic ones.",
    depression3: "Get sunlight for 10 minutes. Light improves mood.",
    motivation: "Set timer for 10 mins. Just start—momentum follows.",

    // Sleep & Relaxation
    sleep1: "No phone/laptop 30 mins before bed.",
    sleep2: "Try writing down tomorrow’s tasks to clear the mind.",
    sleep3: "Do 10 slow breaths before lying down.",

    // Social & Loneliness
    loneliness1: "Send a simple message to a friend: 'thinking of you'.",
    loneliness2: "Join a small campus activity or study group.",
    loneliness3: "Listen to uplifting music that resonates with you.",

    // Exam Stress
    exam1: "Use Pomodoro (25 mins focus, 5 min break).",
    exam2: "Make a simple checklist of 3 study tasks per day.",
    exam3: "Stretch & hydrate between study sessions.",

    // Self-harm Alternative
    selfHarm1: "Hold ice cubes in your hand until urge passes.",
    selfHarm2: "Draw on your arm with a red marker instead of cutting.",
    selfHarm3: "Scream into a pillow or tear paper for release.",
  },

  escalation: {
    high: [
      "I’m really sorry you feel this way. Please call your campus counsellor or emergency helpline immediately.",
      "Your safety matters. If you are thinking of harming yourself, please reach out to a professional right now.",
      "You don’t have to face this alone—call emergency services or a trusted counsellor immediately."
    ],
    medium: [
      "I hear you. Here are some coping tips, but I also suggest connecting with a counsellor. Would you like me to arrange that?",
      "It sounds tough. You might benefit from speaking to a counsellor. Meanwhile, here are some calming exercises.",
      "You’re handling a lot. Along with these strategies, I encourage booking a counselling session."
    ],
    low: [
      "You're not alone. Here are some quick strategies you can try right now.",
      "I understand this feels stressful. Let’s try a simple grounding or breathing exercise together.",
      "Small steps matter—here are some tips to ease what you’re feeling."
    ]
  }
};
