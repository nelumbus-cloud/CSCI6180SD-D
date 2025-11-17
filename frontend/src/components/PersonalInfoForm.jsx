export default function PersonalInfoForm({ data, onUpdate }) {
  const updateField = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={data.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Location"
          value={data.location}
          onChange={(e) => updateField('location', e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="url"
          placeholder="LinkedIn URL"
          value={data.linkedin}
          onChange={(e) => updateField('linkedin', e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="url"
          placeholder="Portfolio URL"
          value={data.portfolio}
          onChange={(e) => updateField('portfolio', e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <textarea
        placeholder="Professional Summary"
        value={data.summary}
        onChange={(e) => updateField('summary', e.target.value)}
        rows={4}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}