require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');

const COURSES = [
  { title: 'Machine Learning for Everybody', description: 'Beginner-friendly intro to ML with Python & TensorFlow — Kylie Ying.', link: 'https://www.youtube.com/watch?v=i_LwzRVP7bg' },
  { title: 'Machine Learning + Generative AI', description: 'ML fundamentals plus how tools like ChatGPT work — Rola Dali.', link: 'https://www.youtube.com/watch?v=tmB5JIX3Lxk' },
  { title: 'Machine Learning with Scikit-Learn', description: 'Core ML algorithms implemented with scikit-learn.', link: 'https://www.youtube.com/watch?v=pqNCD_5r0IU' },
  { title: 'Essential ML Concepts, Animated', description: 'Visual explainer of 100+ core ML/AI terms and concepts.', link: 'https://www.youtube.com/watch?v=PcbuKRNtCUc' },
  { title: 'Foundations of Machine Learning & AI', description: '11-hour deep dive from ML basics to recommender systems.', link: 'https://www.youtube.com/watch?v=0oyDqO8PjIg' },
  { title: '10-Hour Machine Learning Course', description: 'Regression, SVMs, trees, clustering, and ML projects.', link: 'https://www.youtube.com/watch?v=NWONeJKn6kc' },
  { title: 'Machine Learning – Full Course (2024)', description: 'Comprehensive roadmap-style ML course with an end-to-end project.', link: 'https://www.youtube.com/watch?v=bmmQA8A-yUA' },
  { title: 'Generative AI Bootcamp (65 Hours)', description: 'Prompt engineering, LLMs, and building real GenAI apps.', link: 'https://www.youtube.com/watch?v=DOXJ7s1D6iE' },
  { title: 'Generative AI in the Cloud (23 Hours)', description: 'LLMs, RAG, and AI agents deployed with cloud tools.', link: 'https://www.youtube.com/watch?v=nJ25yl34Uqw' },
  { title: 'Deep Learning for Computer Vision', description: '37-hour TensorFlow course: CNNs, ViTs, GANs, and deployment.', link: 'https://www.youtube.com/watch?v=IA3WxTTPXqQ' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB!');

  await Task.deleteMany({});
  console.log('Cleared existing courses.');

  for (const c of COURSES) {
    await Task.create({
      title: c.title,
      description: c.description,
      lectures: [{ title: c.title, link: c.link, completedBy: [] }],
      enrolledBy: [],
    });
  }

  console.log(`Seeded ${COURSES.length} courses.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});