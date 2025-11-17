import { Download, Edit2 } from 'lucide-react';

export default function ResumePreview({ resumeData, onBack }) {
  const downloadResume = () => {
    const element = document.getElementById('resume-preview');
    const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${resumeData.personal.fullName} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 850px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4f46e5; padding-bottom: 20px; }
    .name { font-size: 32px; font-weight: bold; color: #1e293b; margin-bottom: 10px; }
    .contact { font-size: 14px; color: #64748b; }
    .contact a { color: #4f46e5; text-decoration: none; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 20px; font-weight: bold; color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; }
    .summary { color: #475569; margin-bottom: 20px; }
    .item { margin-bottom: 18px; }
    .item-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .item-title { font-weight: bold; color: #1e293b; font-size: 16px; }
    .item-subtitle { color: #64748b; font-size: 14px; }
    .item-date { color: #94a3b8; font-size: 14px; }
    .item-description { color: #475569; margin-top: 8px; }
    .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .skill-item { background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-size: 14px; }
  </style>
</head>
<body>
  ${element.innerHTML}
</body>
</html>`;
    
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-slate-900">Resume Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={downloadResume}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
      
      <div className="p-8 bg-slate-50">
        <div id="resume-preview" className="bg-white p-12 rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="header">
            <div className="name">{resumeData.personal.fullName || 'Your Name'}</div>
            <div className="contact">
              {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
              {resumeData.personal.phone && <span> • {resumeData.personal.phone}</span>}
              {resumeData.personal.location && <span> • {resumeData.personal.location}</span>}
              {resumeData.personal.linkedin && <div><a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>}
              {resumeData.personal.portfolio && <div><a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></div>}
            </div>
          </div>

          {resumeData.personal.summary && (
            <div className="section">
              <div className="section-title">Professional Summary</div>
              <div className="summary">{resumeData.personal.summary}</div>
            </div>
          )}

          {resumeData.experience.length > 0 && (
            <div className="section">
              <div className="section-title">Experience</div>
              {resumeData.experience.map(exp => (
                <div key={exp.id} className="item">
                  <div className="item-header">
                    <div>
                      <div className="item-title">{exp.position}</div>
                      <div className="item-subtitle">{exp.company}</div>
                    </div>
                    <div className="item-date">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && <div className="item-description">{exp.description}</div>}
                </div>
              ))}
            </div>
          )}

          {resumeData.education.length > 0 && (
            <div className="section">
              <div className="section-title">Education</div>
              {resumeData.education.map(edu => (
                <div key={edu.id} className="item">
                  <div className="item-header">
                    <div>
                      <div className="item-title">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                      <div className="item-subtitle">{edu.school}</div>
                    </div>
                    <div className="item-date">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                  {edu.gpa && <div className="item-description">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {resumeData.skills.length > 0 && (
            <div className="section">
              <div className="section-title">Skills</div>
              <div className="skills-grid">
                {resumeData.skills.map(skill => (
                  <div key={skill.id} className="skill-item">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.projects.length > 0 && (
            <div className="section">
              <div className="section-title">Projects</div>
              {resumeData.projects.map(proj => (
                <div key={proj.id} className="item">
                  <div className="item-title">{proj.name}</div>
                  {proj.description && <div className="item-description">{proj.description}</div>}
                  {proj.technologies && <div className="item-subtitle">Technologies: {proj.technologies}</div>}
                  {proj.link && <div className="item-subtitle"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}