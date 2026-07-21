import type { AnswerState, QuestionDef } from './types'

function hasSpecificCareerAnswers(answers: AnswerState): boolean {
  return (
    answers.career_stage === 'one_main' || answers.career_stage === 'several'
  )
}

function isBranchBAnswers(answers: AnswerState): boolean {
  return !hasSpecificCareerAnswers(answers)
}

export { hasSpecificCareerAnswers, isBranchBAnswers }

// Branch A: students who already have one or more specific careers in mind.
// Branch B: students with broad interests, students who have not started,
// and students who are not sure yet.
export const QUESTIONS: QuestionDef[] = [
  {
    id: 'welcome',
    type: 'info',
    title: 'Help Us Design Better Career Exploration Experiences',
    helper:
      'FutureBright Youth is gathering student input to design a career exploration initiative for middle and high school students. There are no right or wrong answers. Most students finish in about 5–7 minutes.',
    branch: 'all',
  },
  {
    id: 'grade',
    field: 'grade',
    type: 'single',
    title: 'What grade are you currently in?',
    required: true,
    branch: 'all',
    options: [
      { value: '6', label: 'Grade 6' },
      { value: '7', label: 'Grade 7' },
      { value: '8', label: 'Grade 8' },
      { value: '9', label: 'Grade 9' },
      { value: '10', label: 'Grade 10' },
      { value: '11', label: 'Grade 11' },
      { value: '12', label: 'Grade 12' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'career_stage',
    field: 'career_stage',
    type: 'single',
    title: 'Which statement best describes where you are right now?',
    required: true,
    branch: 'all',
    options: [
      { value: 'one_main', label: 'I have one main career in mind.' },
      { value: 'several', label: 'I am considering several careers.' },
      {
        value: 'general_interests',
        label: 'I have some general interests, but no specific career in mind.',
      },
      {
        value: 'not_started',
        label: 'I have not started thinking about careers yet.',
      },
      { value: 'not_sure', label: 'I am not sure.' },
    ],
  },

  // BRANCH A
  {
    id: 'current_interest',
    field: 'current_career_interests',
    type: 'multi_text',
    title: (answers) =>
      answers.career_stage === 'several'
        ? 'What careers or types of work are you currently considering?'
        : 'What career or type of work do you currently have in mind?',
    helper:
      'List up to three. Broad answers such as “healthcare,” “technology,” or “creative work” are okay.',
    required: true,
    branch: 'A',
  },
  {
    id: 'reasons',
    field: 'reasons_for_interest',
    type: 'multi',
    title: 'What attracts you to this career or type of work?',
    helper: 'Choose up to three.',
    maxSelect: 3,
    required: true,
    branch: 'A',
    options: [
      {
        value: 'tasks',
        label: 'I think I would enjoy the actual tasks or activities.',
      },
      {
        value: 'help_people',
        label: 'It would allow me to help or support people.',
      },
      {
        value: 'solve_problems',
        label: 'It would allow me to solve meaningful problems.',
      },
      {
        value: 'creative',
        label: 'It would allow me to create, design, or express ideas.',
      },
      {
        value: 'subjects_skills',
        label: 'It connects to subjects or skills I enjoy.',
      },
      {
        value: 'strengths_fit',
        label: 'It seems connected to something I am already good at.',
      },
      {
        value: 'income',
        label: 'It has strong earning potential.',
      },
      {
        value: 'stability',
        label: 'It seems to offer job security or financial stability.',
      },
      {
        value: 'hours_flexibility',
        label: 'The work hours or flexibility appeal to me.',
      },
      {
        value: 'impact_leadership',
        label: 'It would allow me to make an impact, lead, or influence others.',
      },
      {
        value: 'role_model',
        label: 'Someone I know or admire has this career.',
      },
      {
        value: 'encouraged',
        label: 'My family or other people encouraged me to consider it.',
      },
      {
        value: 'not_sure_attract',
        label: 'I am still not sure what attracts me to it.',
      },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'exposure',
    field: 'exposure_level',
    type: 'single',
    title:
      'What is the most direct experience you have had with this type of work?',
    required: true,
    branch: 'A',
    options: [
      {
        value: 'tried_tasks',
        label:
          'I have done similar tasks through a class, project, job, club, hobby, or activity.',
      },
      {
        value: 'observed_or_spoke',
        label:
          'I have observed or spoken directly with someone who does this work.',
      },
      {
        value: 'researched',
        label:
          'I have researched the career myself but have not experienced it directly.',
      },
      {
        value: 'indirect',
        label:
          'I mainly know about it through school, media, family, or friends.',
      },
      {
        value: 'very_little',
        label: 'I know very little about what the work is actually like.',
      },
    ],
  },
  {
    id: 'sources',
    field: 'impression_sources',
    type: 'multi',
    title: 'What has most influenced your impression of this career?',
    helper: 'Choose up to three.',
    maxSelect: 3,
    required: true,
    branch: 'A',
    options: [
      {
        value: 'class_project',
        label: 'A class, school project, club, or competition',
      },
      {
        value: 'hobby',
        label: 'A hobby, personal project, or activity outside school',
      },
      {
        value: 'personal_contact',
        label: 'A family member, friend, teacher, or mentor',
      },
      {
        value: 'professional_contact',
        label: 'Talking with or observing someone who works in the field',
      },
      {
        value: 'social_media',
        label: 'Short-form social media, such as TikTok or Instagram',
      },
      {
        value: 'media',
        label:
          'Longer videos, podcasts, books, movies, television, or online articles',
      },
      {
        value: 'self_research',
        label: 'Career research I have done myself',
      },
      {
        value: 'work_experience',
        label:
          'A workplace visit, job shadowing, volunteering, internship, or paid job',
      },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'confidence',
    field: 'understanding_confidence',
    type: 'scale',
    title:
      'How confident are you that you understand what this career is actually like?',
    required: true,
    branch: 'A',
    options: [
      { value: '1', label: 'Not at all confident' },
      { value: '2', label: 'A little confident' },
      { value: '3', label: 'Somewhat confident' },
      { value: '4', label: 'Quite confident' },
      { value: '5', label: 'Very confident' },
    ],
  },
  {
    id: 'career_picture',
    field: 'perceived_daily_work',
    type: 'textarea',
    title:
      'In one or two sentences, what do you imagine someone in this career doing during a normal workday?',
    helper:
      'This question is optional. It is completely okay to write that you are not sure.',
    optional: true,
    branch: 'A',
  },

  // BRANCH B
  {
    id: 'broad_interests',
    field: 'broad_interests',
    type: 'multi',
    title: (answers) =>
      answers.career_stage === 'general_interests'
        ? 'Which subjects, activities, or types of problems interest you most?'
        : 'Which subjects, activities, or types of problems seem most interesting to you right now?',
    helper: 'Choose up to four. “Not sure yet” is a valid answer.',
    maxSelect: 4,
    required: true,
    branch: 'B',
    options: [
      {
        value: 'create_design',
        label: 'Creating, designing, or making new things',
      },
      {
        value: 'math_logic',
        label: 'Solving math, logic, or strategy problems',
      },
      {
        value: 'build_fix',
        label: 'Building, fixing, or working with physical objects',
      },
      {
        value: 'help_teach_care',
        label: 'Helping, teaching, supporting, or caring for people',
      },
      {
        value: 'science_health',
        label: 'Understanding science, health, or how things work',
      },
      {
        value: 'technology',
        label: 'Using computers, data, or technology',
      },
      {
        value: 'lead_organize',
        label: 'Leading, organizing, persuading, or planning',
      },
      {
        value: 'communicate',
        label: 'Writing, speaking, storytelling, or communicating ideas',
      },
      {
        value: 'arts_performance',
        label: 'Art, music, performance, or visual expression',
      },
      {
        value: 'nature_animals',
        label: 'Animals, nature, the environment, or outdoor work',
      },
      {
        value: 'sports_movement',
        label: 'Sports, movement, fitness, or physical performance',
      },
      {
        value: 'not_sure',
        label: 'I am not sure yet.',
      },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'interest_detail',
    field: 'interest_detail',
    type: 'textarea',
    title:
      'Is there a class, hobby, activity, topic, or problem that you would like to explore further?',
    helper: 'This question is optional. A short answer is enough.',
    optional: true,
    branch: 'B',
  },
  {
    id: 'barriers',
    field: 'exploration_barriers',
    type: 'multi',
    title: 'What makes it difficult to think about future careers?',
    helper: 'Choose up to three.',
    maxSelect: 3,
    required: true,
    branch: 'B',
    options: [
      {
        value: 'dont_know_careers',
        label: 'I do not know enough about the careers that are available.',
      },
      {
        value: 'unsure_interests',
        label: 'I am not sure what I am interested in.',
      },
      {
        value: 'unsure_strengths',
        label: 'I am not sure what I am good at.',
      },
      {
        value: 'many_interests',
        label: 'I am interested in many different things.',
      },
      {
        value: 'too_far_away',
        label: 'Careers still feel too far away.',
      },
      {
        value: 'subjects_jobs',
        label: 'I do not know how school subjects connect to real jobs.',
      },
      {
        value: 'reliable_information',
        label: 'I do not know where to find reliable career information.',
      },
      {
        value: 'too_general',
        label: 'Most career information feels too general or unrealistic.',
      },
      {
        value: 'pressure',
        label: 'I feel pressure to choose the “right” career.',
      },
      {
        value: 'few_opportunities',
        label:
          'I have not had enough opportunities to explore different kinds of work.',
      },
      {
        value: 'relatable_examples',
        label:
          'I do not see enough examples of people whose experiences feel relatable to me.',
      },
      { value: 'nothing', label: 'Nothing in particular' },
      { value: 'other', label: 'Other' },
    ],
  },

  // ALL STUDENTS
  {
    id: 'content_needs',
    field: 'career_information_needs',
    type: 'multi',
    title:
      'What would you most like to learn about at a career exploration event?',
    helper: 'Choose up to three.',
    maxSelect: 3,
    required: true,
    branch: 'all',
    options: [
      { value: 'daily_work', label: 'What people actually do each day' },
      { value: 'skills', label: 'What skills the work requires' },
      {
        value: 'education',
        label: 'What education, training, or qualifications are needed',
      },
      {
        value: 'entry_paths',
        label: 'Different ways people enter the career',
      },
      { value: 'enjoy', label: 'What people enjoy about the work' },
      {
        value: 'difficult',
        label: 'What is difficult, stressful, or frustrating about the work',
      },
      {
        value: 'income_stability',
        label: 'Pay, benefits, and job stability',
      },
      {
        value: 'hours_lifestyle',
        label: 'Work hours, flexibility, and lifestyle',
      },
      {
        value: 'growth_change',
        label: 'Opportunities for growth or changing careers later',
      },
      {
        value: 'ai_technology',
        label: 'How AI or technology may change the work',
      },
      {
        value: 'student_steps',
        label: 'What students can do now to explore or prepare',
      },
      {
        value: 'fit',
        label: 'How to tell whether a career fits my interests and strengths',
      },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'guest_types',
    field: 'preferred_guest_types',
    type: 'multi',
    title:
      'Who would you most like to hear from at a career exploration event?',
    helper: 'Choose up to two.',
    maxSelect: 2,
    required: true,
    branch: 'all',
    options: [
      {
        value: 'early_career',
        label: 'Someone who recently started their career',
      },
      {
        value: 'experienced',
        label: 'Someone with many years of experience',
      },
      {
        value: 'career_changer',
        label: 'Someone who changed careers or explored several paths',
      },
      {
        value: 'entrepreneur_freelancer',
        label: 'An entrepreneur, freelancer, or self-employed professional',
      },
      {
        value: 'recent_student',
        label: 'A college student, apprentice, trainee, or recent graduate',
      },
      {
        value: 'unusual_path',
        label: 'Someone who took an unusual path into their career',
      },
      {
        value: 'relatable_background',
        label: 'Someone whose background or experiences feel relatable to me',
      },
      {
        value: 'no_preference',
        label: 'No preference',
      },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'event_formats',
    field: 'preferred_event_formats',
    type: 'multi',
    title: 'Which event formats would help you learn best?',
    helper: 'Choose up to two.',
    maxSelect: 2,
    required: true,
    branch: 'all',
    options: [
      {
        value: 'panel',
        label: 'A panel where several professionals share their experiences',
      },
      {
        value: 'small_group',
        label: 'Small-group conversations with professionals',
      },
      {
        value: 'qa',
        label: 'An open question-and-answer session',
      },
      {
        value: 'hands_on',
        label: 'A hands-on activity or career simulation',
      },
      {
        value: 'watch_task',
        label: 'Watching someone demonstrate a real work task',
      },
      {
        value: 'workplace_visit',
        label: 'A workplace visit or virtual workplace tour',
      },
      {
        value: 'career_comparison',
        label: 'Comparing several careers that use similar skills',
      },
      {
        value: 'mentoring',
        label: 'One-on-one or small-group mentoring',
      },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'openness',
    field: 'openness_to_other_careers',
    type: 'scale',
    title:
      'How interested would you be in exploring careers you have never considered before?',
    required: true,
    branch: 'all',
    options: [
      { value: '1', label: 'Not interested at all' },
      { value: '2', label: 'A little interested' },
      { value: '3', label: 'Somewhat interested' },
      { value: '4', label: 'Quite interested' },
      { value: '5', label: 'Very interested' },
    ],
  },
  {
    id: 'outcomes',
    field: 'desired_event_outcomes',
    type: 'multi',
    title:
      'At the end of a career exploration event, what would you most like to leave with?',
    helper: 'Choose up to two.',
    maxSelect: 2,
    required: true,
    branch: 'all',
    options: [
      {
        value: 'deeper_current',
        label: 'A better understanding of a career I am already considering',
      },
      {
        value: 'new_options',
        label: 'New career options I had not considered before',
      },
      {
        value: 'clearer_self',
        label: 'A clearer understanding of my interests and strengths',
      },
      {
        value: 'realistic_picture',
        label: 'A more realistic picture of what different jobs are like',
      },
      {
        value: 'next_steps',
        label: 'Specific next steps I can take',
      },
      {
        value: 'less_pressure',
        label: 'Less pressure to have my future completely figured out',
      },
      {
        value: 'follow_up_resource',
        label: 'A person, organization, or resource I can learn from afterward',
      },
      { value: 'other', label: 'Other' },
    ],
    hideOptionWhen: (value, answers) =>
      value === 'deeper_current' && isBranchBAnswers(answers),
  },
  {
    id: 'student_question',
    field: 'question_for_professional',
    type: 'textarea',
    title:
      'If you could ask a professional one honest question about their career, what would you ask?',
    helper: 'This question is optional.',
    optional: true,
    branch: 'all',
  },
  {
    id: 'opt_in',
    field: 'marketing_opt_in',
    type: 'opt_in',
    title:
      'Would you like to receive updates when future career exploration events are available?',
    helper:
      'This is optional. You may provide your email address or a parent/guardian’s email address. Contact information should be stored separately from questionnaire responses.',
    optional: true,
    branch: 'all',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 'review',
    type: 'review',
    title: 'Review your answers',
    branch: 'all',
  },
]
