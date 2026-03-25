export const categoryColors: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-700',
  Marketing: 'bg-purple-100 text-purple-700',
  Finance: 'bg-green-100 text-green-700',
  Engineering: 'bg-orange-100 text-orange-700',
  Education: 'bg-yellow-100 text-yellow-700',
  Healthcare: 'bg-red-100 text-red-700',
  Operations: 'bg-gray-100 text-gray-700',
  'Human Resources': 'bg-pink-100 text-pink-700',
  Design: 'bg-indigo-100 text-indigo-700',
  'Customer Service': 'bg-teal-100 text-teal-700',
  Sales: 'bg-amber-100 text-amber-700',
  Media: 'bg-cyan-100 text-cyan-700',
};

export const jobTypeColors: Record<string, string> = {
  'Full-Time': 'bg-green-50 text-green-600 border border-green-200',
  'Part-Time': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  'Contract': 'bg-purple-50 text-purple-600 border border-purple-200',
  'Remote': 'bg-blue-50 text-blue-600 border border-blue-200',
  'Internship': 'bg-orange-50 text-orange-600 border border-orange-200',
};

export const getCategoryColor = (category: string) => categoryColors[category] || 'bg-gray-100 text-gray-700';
export const getJobTypeColor = (jobType: string) => jobTypeColors[jobType] || 'bg-gray-50 text-gray-600';
