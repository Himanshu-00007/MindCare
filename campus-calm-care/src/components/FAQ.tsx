// FAQ.tsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is mental health?",
    answer: "Mental health refers to our emotional, psychological, and social well-being. It affects how we think, feel, and act in daily life, as well as how we handle stress, relate to others, and make choices.",
  },
  {
    question: "What are common mental health disorders?",
    answer: "Some common mental health disorders include anxiety disorders, depression, bipolar disorder, schizophrenia, and post-traumatic stress disorder (PTSD).",
  },
  {
    question: "What are the signs I might need help?",
    answer: "Signs include persistent sadness, excessive worry, withdrawal from friends and activities, changes in sleep or appetite, and difficulty concentrating. If these affect daily life, seeking help is important.",
  },
  {
    question: "How can I improve my mental health?",
    answer: "Maintaining mental health can involve regular exercise, healthy eating, adequate sleep, mindfulness, social support, and seeking professional help when needed.",
  },
  {
    question: "How does MindCare help solve mental health issues?",
    answer: "MindCare provides accessible support through self-assessments, educational resources, expert guidance from certified counselors, and a safe community for sharing experiences. It helps users track their mental health progress and adopt effective coping strategies.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-indigo-700">
        Frequently Asked Questions
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Common questions about Mental Health and the MindCare platform
      </p>

      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border rounded-xl mb-4 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <button
            className="w-full flex justify-between items-center px-6 py-4 font-medium text-left text-gray-800 hover:text-indigo-600 focus:outline-none"
            onClick={() => toggleFAQ(index)}
          >
            <span>{faq.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-4 border-t text-gray-700 bg-gray-50 rounded-b-xl"
              >
                {faq.answer}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
