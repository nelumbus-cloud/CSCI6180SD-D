// import { useState, useEffect } from 'react';
// import { Download, Plus, Trash2, Edit2, Save, X, Eye } from 'lucide-react';

// export default function ResumeBuilder() {
//   const [activeSection, setActiveSection] = useState('personal');
//   const [previewMode, setPreviewMode] = useState(false);
  
//   const [resumeData, setResumeData] = useState({
//     personal: {
//       fullName: '',
//       email: '',
//       phone: '',
//       location: '',
//       linkedin: '',
//       portfolio: '',
//       summary: ''
//     },
//     experience: [],
//     education: [],
//     skills: [],
//     projects: []
//   });

//   // Load data from storage on mount
//   useEffect(() => {
//     loadResumeData();
//   }, []);

//   const loadResumeData = async () => {
//     try {
//       const result = await window.storage.get('resume-data');
//       if (result && result.value) {
//         setResumeData(JSON.parse(result.value));
//       }
//     } catch (error) {
//       console.log('No saved resume data found');
//     }
//   };

//   const saveResumeData = async (data) => {
//     try {
//       await window.storage.set('resume-data', JSON.stringify(data));
//     } catch (error) {
//       console.error('Error saving resume:', error);
//     }
//   };

//   const updatePersonal = (field, value) => {
//     const updated = {
//       ...resumeData,
//       personal: { ...resumeData.personal, [field]: value }
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const addExperience = () => {
//     const updated = {
//       ...resumeData,
//       experience: [
//         ...resumeData.experience,
//         { id: Date.now(), company: '', position: '', startDate: '', endDate: '', current: false, description: '' }
//       ]
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const updateExperience = (id, field, value) => {
//     const updated = {
//       ...resumeData,
//       experience: resumeData.experience.map(exp =>
//         exp.id === id ? { ...exp, [field]: value } : exp
//       )
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const deleteExperience = (id) => {
//     const updated = {
//       ...resumeData,
//       experience: resumeData.experience.filter(exp => exp.id !== id)
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const addEducation = () => {
//     const updated = {
//       ...resumeData,
//       education: [
//         ...resumeData.education,
//         { id: Date.now(), school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }
//       ]
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const updateEducation = (id, field, value) => {
//     const updated = {
//       ...resumeData,
//       education: resumeData.education.map(edu =>
//         edu.id === id ? { ...edu, [field]: value } : edu
//       )
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const deleteEducation = (id) => {
//     const updated = {
//       ...resumeData,
//       education: resumeData.education.filter(edu => edu.id !== id)
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const addSkill = () => {
//     const updated = {
//       ...resumeData,
//       skills: [...resumeData.skills, { id: Date.now(), name: '', level: 'intermediate' }]
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const updateSkill = (id, field, value) => {
//     const updated = {
//       ...resumeData,
//       skills: resumeData.skills.map(skill =>
//         skill.id === id ? { ...skill, [field]: value } : skill
//       )
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const deleteSkill = (id) => {
//     const updated = {
//       ...resumeData,
//       skills: resumeData.skills.filter(skill => skill.id !== id)
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const addProject = () => {
//     const updated = {
//       ...resumeData,
//       projects: [
//         ...resumeData.projects,
//         { id: Date.now(), name: '', description: '', technologies: '', link: '' }
//       ]
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const updateProject = (id, field, value) => {
//     const updated = {
//       ...resumeData,
//       projects: resumeData.projects.map(proj =>
//         proj.id === id ? { ...proj, [field]: value } : proj
//       )
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const deleteProject = (id) => {
//     const updated = {
//       ...resumeData,
//       projects: resumeData.projects.filter(proj => proj.id !== id)
//     };
//     setResumeData(updated);
//     saveResumeData(updated);
//   };

//   const downloadResume = () => {
//     const element = document.getElementById('resume-preview');
//     const content = `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <title>${resumeData.personal.fullName} - Resume</title>
//   <style>
//     * { margin: 0; padding: 0; box-sizing: border-box; }
//     body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 850px; margin: 0 auto; padding: 40px; }
//     .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4f46e5; padding-bottom: 20px; }
//     .name { font-size: 32px; font-weight: bold; color: #1e293b; margin-bottom: 10px; }
//     .contact { font-size: 14px; color: #64748b; }
//     .contact a { color: #4f46e5; text-decoration: none; }
//     .section { margin-bottom: 25px; }
//     .section-title { font-size: 20px; font-weight: bold; color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; }
//     .summary { color: #475569; margin-bottom: 20px; }
//     .item { margin-bottom: 18px; }
//     .item-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
//     .item-title { font-weight: bold; color: #1e293b; font-size: 16px; }
//     .item-subtitle { color: #64748b; font-size: 14px; }
//     .item-date { color: #94a3b8; font-size: 14px; }
//     .item-description { color: #475569; margin-top: 8px; }
//     .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
//     .skill-item { background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-size: 14px; }
//   </style>
// </head>
// <body>
//   ${element.innerHTML}
// </body>
// </html>`;
    
//     const blob = new Blob([content], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   if (previewMode) {
//     return (
//       <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
//         <div className="p-6 border-b border-slate-200 flex justify-between items-center">
//           <h2 className="text-2xl font-semibold text-slate-900">Resume Preview</h2>
//           <div className="flex gap-2">
//             <button
//               onClick={downloadResume}
//               className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <Download className="w-4 h-4" />
//               Download
//             </button>
//             <button
//               onClick={() => setPreviewMode(false)}
//               className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
//             >
//               <Edit2 className="w-4 h-4" />
//               Edit
//             </button>
//           </div>
//         </div>
        
//         <div className="p-8 bg-slate-50">
//           <div id="resume-preview" className="bg-white p-12 rounded-lg shadow-lg max-w-4xl mx-auto">
//             <div className="header">
//               <div className="name">{resumeData.personal.fullName || 'Your Name'}</div>
//               <div className="contact">
//                 {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
//                 {resumeData.personal.phone && <span> • {resumeData.personal.phone}</span>}
//                 {resumeData.personal.location && <span> • {resumeData.personal.location}</span>}
//                 {resumeData.personal.linkedin && <div><a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>}
//                 {resumeData.personal.portfolio && <div><a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></div>}
//               </div>
//             </div>

//             {resumeData.personal.summary && (
//               <div className="section">
//                 <div className="section-title">Professional Summary</div>
//                 <div className="summary">{resumeData.personal.summary}</div>
//               </div>
//             )}

//             {resumeData.experience.length > 0 && (
//               <div className="section">
//                 <div className="section-title">Experience</div>
//                 {resumeData.experience.map(exp => (
//                   <div key={exp.id} className="item">
//                     <div className="item-header">
//                       <div>
//                         <div className="item-title">{exp.position}</div>
//                         <div className="item-subtitle">{exp.company}</div>
//                       </div>
//                       <div className="item-date">
//                         {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
//                       </div>
//                     </div>
//                     {exp.description && <div className="item-description">{exp.description}</div>}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {resumeData.education.length > 0 && (
//               <div className="section">
//                 <div className="section-title">Education</div>
//                 {resumeData.education.map(edu => (
//                   <div key={edu.id} className="item">
//                     <div className="item-header">
//                       <div>
//                         <div className="item-title">{edu.degree} {edu.field && `in ${edu.field}`}</div>
//                         <div className="item-subtitle">{edu.school}</div>
//                       </div>
//                       <div className="item-date">
//                         {edu.startDate} - {edu.endDate}
//                       </div>
//                     </div>
//                     {edu.gpa && <div className="item-description">GPA: {edu.gpa}</div>}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {resumeData.skills.length > 0 && (
//               <div className="section">
//                 <div className="section-title">Skills</div>
//                 <div className="skills-grid">
//                   {resumeData.skills.map(skill => (
//                     <div key={skill.id} className="skill-item">
//                       {skill.name}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {resumeData.projects.length > 0 && (
//               <div className="section">
//                 <div className="section-title">Projects</div>
//                 {resumeData.projects.map(proj => (
//                   <div key={proj.id} className="item">
//                     <div className="item-title">{proj.name}</div>
//                     {proj.description && <div className="item-description">{proj.description}</div>}
//                     {proj.technologies && <div className="item-subtitle">Technologies: {proj.technologies}</div>}
//                     {proj.link && <div className="item-subtitle"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></div>}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
//       <div className="p-6 border-b border-slate-200 flex justify-between items-center">
//         <h2 className="text-2xl font-semibold text-slate-900">Resume Builder</h2>
//         <button
//           onClick={() => setPreviewMode(true)}
//           className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//         >
//           <Eye className="w-4 h-4" />
//           Preview
//         </button>
//       </div>

//       <div className="flex border-b border-slate-200">
//         {['personal', 'experience', 'education', 'skills', 'projects'].map((section) => (
//           <button
//             key={section}
//             onClick={() => setActiveSection(section)}
//             className={`px-6 py-3 font-medium capitalize transition-colors ${
//               activeSection === section
//                 ? 'text-indigo-600 border-b-2 border-indigo-600'
//                 : 'text-slate-600 hover:text-slate-900'
//             }`}
//           >
//             {section}
//           </button>
//         ))}
//       </div>

//       <div className="p-6">
//         {activeSection === 'personal' && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 value={resumeData.personal.fullName}
//                 onChange={(e) => updatePersonal('fullName', e.target.value)}
//                 className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={resumeData.personal.email}
//                 onChange={(e) => updatePersonal('email', e.target.value)}
//                 className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <input
//                 type="tel"
//                 placeholder="Phone"
//                 value={resumeData.personal.phone}
//                 onChange={(e) => updatePersonal('phone', e.target.value)}
//                 className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Location"
//                 value={resumeData.personal.location}
//                 onChange={(e) => updatePersonal('location', e.target.value)}
//                 className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <input
//                 type="url"
//                 placeholder="LinkedIn URL"
//                 value={resumeData.personal.linkedin}
//                 onChange={(e) => updatePersonal('linkedin', e.target.value)}
//                 className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <input
//                 type="url"
//                 placeholder="Portfolio URL"
//                 value={resumeData.personal.portfolio}
//                 onChange={(e) => updatePersonal('portfolio', e.target.value)}
//                 className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//             <textarea
//               placeholder="Professional Summary"
//               value={resumeData.personal.summary}
//               onChange={(e) => updatePersonal('summary', e.target.value)}
//               rows={4}
//               className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         )}

//         {activeSection === 'experience' && (
//           <div className="space-y-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-slate-900">Work Experience</h3>
//               <button
//                 onClick={addExperience}
//                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Experience
//               </button>
//             </div>
//             {resumeData.experience.map((exp) => (
//               <div key={exp.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
//                 <div className="flex justify-between items-start">
//                   <input
//                     type="text"
//                     placeholder="Position"
//                     value={exp.position}
//                     onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
//                     className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <button
//                     onClick={() => deleteExperience(exp.id)}
//                     className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Company"
//                   value={exp.company}
//                   onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
//                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <div className="grid grid-cols-2 gap-3">
//                   <input
//                     type="text"
//                     placeholder="Start Date (e.g., Jan 2020)"
//                     value={exp.startDate}
//                     onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
//                     className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="End Date"
//                     value={exp.endDate}
//                     onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
//                     disabled={exp.current}
//                     className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
//                   />
//                 </div>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={exp.current}
//                     onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
//                     className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
//                   />
//                   <span className="text-sm text-slate-600">Currently working here</span>
//                 </label>
//                 <textarea
//                   placeholder="Description"
//                   value={exp.description}
//                   onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
//                   rows={3}
//                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//             ))}
//           </div>
//         )}

//         {activeSection === 'education' && (
//           <div className="space-y-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-slate-900">Education</h3>
//               <button
//                 onClick={addEducation}
//                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Education
//               </button>
//             </div>
//             {resumeData.education.map((edu) => (
//               <div key={edu.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
//                 <div className="flex justify-between items-start">
//                   <input
//                     type="text"
//                     placeholder="School/University"
//                     value={edu.school}
//                     onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
//                     className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <button
//                     onClick={() => deleteEducation(edu.id)}
//                     className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <input
//                     type="text"
//                     placeholder="Degree"
//                     value={edu.degree}
//                     onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
//                     className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Field of Study"
//                     value={edu.field}
//                     onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
//                     className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>
//                 <div className="grid grid-cols-3 gap-3">
//                   <input
//                     type="text"
//                     placeholder="Start Date"
//                     value={edu.startDate}
//                     onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
//                     className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="End Date"
//                     value={edu.endDate}
//                     onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
//                     className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="GPA (optional)"
//                     value={edu.gpa}
//                     onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
//                     className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {activeSection === 'skills' && (
//           <div className="space-y-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
//               <button
//                 onClick={addSkill}
//                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Skill
//               </button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {resumeData.skills.map((skill) => (
//                 <div key={skill.id} className="flex items-center gap-2">
//                   <input
//                     type="text"
//                     placeholder="Skill name"
//                     value={skill.name}
//                     onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
//                     className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <button
//                     onClick={() => deleteSkill(skill.id)}
//                     className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {activeSection === 'projects' && (
//           <div className="space-y-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
//               <button
//                 onClick={addProject}
//                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Project
//               </button>
//             </div>
//             {resumeData.projects.map((proj) => (
//               <div key={proj.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
//                 <div className="flex justify-between items-start">
//                   <input
//                     type="text"
//                     placeholder="Project Name"
//                     value={proj.name}
//                     onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
//                     className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <button
//                     onClick={() => deleteProject(proj.id)}
//                     className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <textarea
//                   placeholder="Description"
//                   value={proj.description}
//                   onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
//                   rows={2}
//                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Technologies (e.g., React, Node.js, PostgreSQL)"
//                   value={proj.technologies}
//                   onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
//                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <input
//                   type="url"
//                   placeholder="Project Link"
//                   value={proj.link}
//                   onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
//                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ProjectsForm from './ProjectsForm';
import ResumePreview from './ResumePreview';
import { resumeService } from '@/services/resumeService';

export default function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState('personal');
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  useEffect(() => {
    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resumeService.getResume();
      setResumeData(data);
    } catch (error) {
      console.error('Error loading resume:', error);
      setError(error.message || 'Failed to load resume');
      // Keep default empty state on error
    } finally {
      setLoading(false);
    }
  };

  const updateResumeData = async (section, data) => {
    const updated = { ...resumeData, [section]: data };
    setResumeData(updated);
    
    // Save to backend
    try {
      setSaving(true);
      setError(null);
      
      // Use specific update methods for each section
      switch (section) {
        case 'personal':
          await resumeService.updatePersonalInfo(data);
          break;
        case 'experience':
          await resumeService.updateExperience(data);
          break;
        case 'education':
          await resumeService.updateEducation(data);
          break;
        case 'skills':
          await resumeService.updateSkills(data);
          break;
        case 'projects':
          await resumeService.updateProjects(data);
          break;
        default:
          // Fallback to full save
          await resumeService.saveResume(updated);
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      setError(error.message || 'Failed to save resume');
      // Revert the update on error
      setResumeData(resumeData);
    } finally {
      setSaving(false);
    }
  };

  if (previewMode) {
    return (
      <ResumePreview 
        resumeData={resumeData} 
        onBack={() => setPreviewMode(false)} 
      />
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Resume Builder</h2>
          {saving && (
            <p className="text-sm text-slate-500 mt-1">Saving...</p>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
        </div>
        <button
          onClick={() => setPreviewMode(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          disabled={saving}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      <div className="flex border-b border-slate-200">
        {['personal', 'experience', 'education', 'skills', 'projects'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-6 py-3 font-medium capitalize transition-colors ${
              activeSection === section
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeSection === 'personal' && (
          <PersonalInfoForm
            data={resumeData.personal}
            onUpdate={(data) => updateResumeData('personal', data)}
          />
        )}

        {activeSection === 'experience' && (
          <ExperienceForm
            data={resumeData.experience}
            onUpdate={(data) => updateResumeData('experience', data)}
          />
        )}

        {activeSection === 'education' && (
          <EducationForm
            data={resumeData.education}
            onUpdate={(data) => updateResumeData('education', data)}
          />
        )}

        {activeSection === 'skills' && (
          <SkillsForm
            data={resumeData.skills}
            onUpdate={(data) => updateResumeData('skills', data)}
          />
        )}

        {activeSection === 'projects' && (
          <ProjectsForm
            data={resumeData.projects}
            onUpdate={(data) => updateResumeData('projects', data)}
          />
        )}
      </div>
    </div>
  );
}