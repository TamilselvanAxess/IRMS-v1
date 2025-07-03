import React from 'react';

const timelineData = [
  { time: '09:00', title: 'Started Project', description: 'Project kickoff and team meeting.' },
  { time: '11:00', title: 'Design Review', description: 'Reviewed initial wireframes.' },
  { time: '14:00', title: 'Development', description: 'Began coding main features.' },
  { time: '16:00', title: 'Testing', description: 'Initial QA and bug fixes.' },
];

const Timeline = () => (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4">Timeline</h2>
    <div className="relative border-l-2 border-blue-200 ml-4">
      {timelineData.map((item, idx) => (
        <div key={idx} className="mb-8 ml-4 relative">
          <div className="absolute -left-6 top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
          <div className="text-sm text-gray-500">{item.time}</div>
          <div className="font-semibold text-gray-900 dark:text-white">{item.title}</div>
          <div className="text-gray-600 dark:text-gray-300">{item.description}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Timeline; 