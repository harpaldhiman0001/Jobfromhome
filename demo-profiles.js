const DEMO_MODE = true;
const DEMO_FIRST_NAMES = ['Aditi', 'Arjun', 'Ananya', 'Vihaan', 'Ishita', 'Rahul', 'Sneha', 'Dev', 'Kavya', 'Yash', 'Riya', 'Aditya', 'Naina', 'Karan', 'Sana', 'Aryan', 'Ira', 'Manav', 'Pooja', 'Ritvik'];
const DEMO_CITIES = ['Faridabad, Haryana', 'Delhi', 'Noida, Uttar Pradesh', 'Bengaluru, Karnataka', 'Pune, Maharashtra', 'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh', 'Kochi, Kerala', 'Indore, Madhya Pradesh', 'Chandigarh'];
const DEMO_CATEGORIES = ['Web Development', 'Video Editing', 'Digital Marketing', 'Content Writing', 'Data Analysis', 'UI/UX Design', 'HR & Recruitment', 'Product Operations'];
const DEMO_SKILLS = {
  'Web Development': ['HTML', 'CSS', 'JavaScript', 'React'],
  'Video Editing': ['Premiere Pro', 'CapCut', 'After Effects', 'Reels'],
  'Digital Marketing': ['SEO', 'Canva', 'Google Analytics', 'Ads'],
  'Content Writing': ['Research', 'SEO', 'Copywriting', 'WordPress'],
  'Data Analysis': ['Excel', 'SQL', 'Python', 'Dashboards'],
  'UI/UX Design': ['Figma', 'Wireframes', 'Prototyping', 'Design Systems'],
  'HR & Recruitment': ['Screening', 'Communication', 'Excel', 'Sourcing'],
  'Product Operations': ['Research', 'Notion', 'Excel', 'Communication']
};

window.DEMO_PROFILES = DEMO_MODE ? Array.from({ length: 100 }, (_, index) => {
  const category = DEMO_CATEGORIES[index % DEMO_CATEGORIES.length];
  const name = DEMO_FIRST_NAMES[index % DEMO_FIRST_NAMES.length];
  return {
    id: `demo-profile-${index + 1}`,
    is_demo: true,
    display_name: `${name} ${String.fromCharCode(65 + (index % 26))}.`,
    city: DEMO_CITIES[index % DEMO_CITIES.length],
    state: DEMO_CITIES[index % DEMO_CITIES.length].split(', ')[1] || '',
    timezone: 'Asia/Kolkata',
    headline: `${category} intern candidate`,
    category,
    skills: DEMO_SKILLS[category].slice(0, 3),
    education: index % 2 ? 'Undergraduate student' : 'Recent graduate',
    availability: index % 3 === 0 ? 'Immediate' : 'October',
    portfolio_url: `https://example.com/demo-portfolio/${index + 1}`,
    profile_completion: 65 + (index % 36),
    discoverable: true
  };
}) : [];
