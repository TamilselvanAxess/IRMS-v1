import React, { useState } from 'react';

const EnrolUserForm = () => {
  const [form, setForm] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Enroll user data submitted!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold mb-2">Enroll User Form</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full px-3 py-2 border rounded-lg" required />
      </div>
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold">Submit</button>
    </form>
  );
};

export default EnrolUserForm; 