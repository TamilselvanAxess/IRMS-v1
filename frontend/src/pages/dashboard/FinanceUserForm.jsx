import React, { useState } from 'react';

const FinanceUserForm = () => {
  const [form, setForm] = useState({ name: '', amount: '', note: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Finance user data submitted!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold mb-2">Finance User Form</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input name="amount" value={form.amount} onChange={handleChange} type="number" className="w-full px-3 py-2 border rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Note</label>
        <textarea name="note" value={form.note} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
      </div>
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold">Submit</button>
    </form>
  );
};

export default FinanceUserForm; 