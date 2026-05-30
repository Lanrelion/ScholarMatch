export const FIELD_CATEGORIES: { label: string; fields: string[] }[] = [
  {
    label: "Technology & Engineering",
    fields: [
      "Computer Science", "Software Engineering", "Data Science",
      "AI & Machine Learning", "Electrical Engineering",
      "Mechanical Engineering", "Civil Engineering", "Robotics",
    ],
  },
  {
    label: "Medicine & Health",
    fields: [
      "Medicine", "Nursing", "Public Health", "Pharmacy",
      "Biomedical Science", "Dentistry", "Physiotherapy",
    ],
  },
  {
    label: "Business & Economics",
    fields: [
      "Business Administration", "Economics", "Finance",
      "Entrepreneurship", "Marketing", "Accounting", "MBA",
    ],
  },
  {
    label: "Sciences",
    fields: [
      "Biology", "Chemistry", "Physics", "Environmental Science",
      "Microbiology", "Biochemistry", "Marine Science",
    ],
  },
  {
    label: "Social Sciences & Arts",
    fields: [
      "Law", "Political Science", "International Relations",
      "Psychology", "Sociology", "Education", "Journalism",
      "Architecture", "Fine Arts", "Communication",
    ],
  },
  {
    label: "Agriculture & Environment",
    fields: [
      "Agriculture", "Food Science", "Forestry",
      "Climate Science", "Urban Planning",
    ],
  },
];

export const ALL_FIELDS = FIELD_CATEGORIES.flatMap((c) => c.fields);
