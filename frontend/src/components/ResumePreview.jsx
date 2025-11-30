// // import { Download, Edit2 } from 'lucide-react';
// // import { useState, useRef } from 'react';
// // import html2canvas from 'html2canvas';
// // import jsPDF from 'jspdf';

// // export default function ResumePreview({ resumeData, onBack }) {
// //   const [downloading, setDownloading] = useState(false);
// //   const resumeRef = useRef(null);

// //   const downloadResume = async () => {
// //     if (downloading) return;
    
// //     setDownloading(true);
    
// //     const element = resumeRef.current;
// //     if (!element) {
// //       alert('Resume element not found');
// //       setDownloading(false);
// //       return;
// //     }

// //     try {
// //       // Clone the element
// //       const clonedElement = element.cloneNode(true);

// //       // Deep clean: remove class, style, fill, stroke, and override ALL oklch CSS variables with safe hex colors
// //       const oklchVars = [
// //         '--background', '--foreground', '--card', '--card-foreground', '--popover', '--popover-foreground',
// //         '--primary', '--primary-foreground', '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
// //         '--accent', '--accent-foreground', '--destructive', '--border', '--input', '--ring',
// //         '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5', '--sidebar', '--sidebar-foreground',
// //         '--sidebar-primary', '--sidebar-primary-foreground', '--sidebar-accent', '--sidebar-accent-foreground',
// //         '--sidebar-border', '--sidebar-ring'
// //       ];
// //       const oklchFallbacks = {
// //         '--background': '#fff',
// //         '--foreground': '#000',
// //         '--card': '#fff',
// //         '--card-foreground': '#000',
// //         '--popover': '#fff',
// //         '--popover-foreground': '#000',
// //         '--primary': '#2563eb',
// //         '--primary-foreground': '#fff',
// //         '--secondary': '#f3f4f6',
// //         '--secondary-foreground': '#000',
// //         '--muted': '#f3f4f6',
// //         '--muted-foreground': '#6b7280',
// //         '--accent': '#f3f4f6',
// //         '--accent-foreground': '#000',
// //         '--destructive': '#ef4444',
// //         '--border': '#e5e7eb',
// //         '--input': '#e5e7eb',
// //         '--ring': '#2563eb',
// //         '--chart-1': '#6366f1',
// //         '--chart-2': '#22d3ee',
// //         '--chart-3': '#f59e42',
// //         '--chart-4': '#fbbf24',
// //         '--chart-5': '#10b981',
// //         '--sidebar': '#fff',
// //         '--sidebar-foreground': '#000',
// //         '--sidebar-primary': '#2563eb',
// //         '--sidebar-primary-foreground': '#fff',
// //         '--sidebar-accent': '#f3f4f6',
// //         '--sidebar-accent-foreground': '#000',
// //         '--sidebar-border': '#e5e7eb',
// //         '--sidebar-ring': '#2563eb',
// //       };
// //       const deepClean = (el) => {
// //         el.removeAttribute('class');
// //         el.removeAttribute('style');
// //         if (el.tagName && el.tagName.toLowerCase() === 'svg') {
// //           el.removeAttribute('fill');
// //           el.removeAttribute('stroke');
// //         }
// //         // Override all oklch CSS variables with safe hex colors
// //         if (el.style) {
// //           oklchVars.forEach(v => {
// //             el.style.setProperty(v, oklchFallbacks[v]);
// //           });
// //         }
// //         Array.from(el.children).forEach(child => deepClean(child));
// //       };
// //       deepClean(clonedElement);

// //       // Create a temporary container to measure
// //       const tempContainer = document.createElement('div');
// //       tempContainer.style.position = 'fixed';
// //       tempContainer.style.left = '-10000px';
// //       tempContainer.style.top = '-10000px';
// //       tempContainer.style.width = '900px';
// //       tempContainer.appendChild(clonedElement);
// //       document.body.appendChild(tempContainer);

// //       const filename = `${resumeData.personal.fullName || 'Resume'}.pdf`;

// //       // Capture the element as an image using html2canvas
// //       const canvas = await html2canvas(clonedElement, {
// //         scale: 2,
// //         useCORS: true,
// //         allowTaint: true,
// //         backgroundColor: '#ffffff',
// //         logging: false,
// //         imageTimeout: 0,
// //         width: 900,
// //         height: clonedElement.scrollHeight
// //       });

// //       // Clean up temporary element
// //       document.body.removeChild(tempContainer);

// //       // Create PDF from the canvas
// //       const imgData = canvas.toDataURL('image/png');
// //       const pdf = new jsPDF({
// //         orientation: 'portrait',
// //         unit: 'mm',
// //         format: 'a4'
// //       });

// //       const imgWidth = 210; // A4 width in mm
// //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
// //       let heightLeft = imgHeight;
// //       let position = 0;

// //       // Add image to PDF, creating new pages if needed
// //       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
// //       heightLeft -= 297; // A4 height in mm

// //       while (heightLeft > 0) {
// //         position = heightLeft - imgHeight;
// //         pdf.addPage();
// //         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
// //         heightLeft -= 297;
// //       }

// //       pdf.save(filename);
// //       setDownloading(false);
// //     } catch (error) {
// //       console.error('PDF generation failed:', error);
// //       alert('Failed to generate PDF. Error: ' + error.message);
// //       setDownloading(false);
// //     }
// //   };

// //   return (
// //     <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
// //       <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //         <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a' }}>Resume Preview</h2>
// //         <div style={{ display: 'flex', gap: '8px' }}>
// //           <button
// //             onClick={downloadResume}
// //             disabled={downloading}
// //             style={{ 
// //               display: 'flex', 
// //               alignItems: 'center', 
// //               gap: '8px', 
// //               padding: '8px 16px', 
// //               backgroundColor: downloading ? '#22c55e' : '#16a34a',
// //               color: 'white', 
// //               border: 'none',
// //               borderRadius: '8px',
// //               cursor: downloading ? 'not-allowed' : 'pointer',
// //               opacity: downloading ? 0.6 : 1,
// //               fontSize: '14px',
// //               fontWeight: '500',
// //               transition: 'background-color 0.2s'
// //             }}
// //           >
// //             <Download style={{ width: '16px', height: '16px' }} />
// //             {downloading ? 'Downloading...' : 'Download PDF'}
// //           </button>
// //           <button
// //             onClick={onBack}
// //             style={{ 
// //               display: 'flex', 
// //               alignItems: 'center', 
// //               gap: '8px', 
// //               padding: '8px 16px', 
// //               backgroundColor: '#475569',
// //               color: 'white', 
// //               border: 'none',
// //               borderRadius: '8px',
// //               cursor: 'pointer',
// //               fontSize: '14px',
// //               fontWeight: '500',
// //               transition: 'background-color 0.2s'
// //             }}
// //             onMouseOver={(e) => e.target.style.backgroundColor = '#334155'}
// //             onMouseOut={(e) => e.target.style.backgroundColor = '#475569'}
// //           >
// //             <Edit2 style={{ width: '16px', height: '16px' }} />
// //             Edit
// //           </button>
// //         </div>
// //       </div>
      
// //       <div style={{ padding: '32px', backgroundColor: '#f3f4f6' }}>
// //         <div ref={resumeRef} id="resume-preview" style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white' }}>
// //           {/* Header */}
// //           <div style={{ backgroundColor: '#1f2937', color: 'white', padding: '30px 40px' }}>
// //             <div style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '12px' }}>
// //               {resumeData.personal.fullName || 'Your Name'}
// //             </div>
// //             <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: '1.8' }}>
// //               {resumeData.personal.email && <div>✉ {resumeData.personal.email}</div>}
// //               {resumeData.personal.phone && <div>📱 {resumeData.personal.phone}</div>}
// //               {resumeData.personal.location && <div>📍 {resumeData.personal.location}</div>}
// //               {resumeData.personal.linkedin && <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#93c5fd', textDecoration: 'none' }}>LinkedIn</a>}
// //               {resumeData.personal.portfolio && <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#93c5fd', textDecoration: 'none', marginLeft: '16px' }}>Portfolio</a>}
// //             </div>
// //           </div>

// //           {/* Main Content */}
// //           <div style={{ display: 'table', width: '100%' }}>
// //             {/* Sidebar */}
// //             <div style={{ display: 'table-cell', width: '28%', backgroundColor: '#f9fafb', padding: '32px 24px', borderRight: '1px solid #e5e7eb', verticalAlign: 'top' }}>
// //               {resumeData.personal.summary && (
// //                 <div style={{ marginBottom: '20px' }}>
// //                   <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: '#111827', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #2563eb' }}>
// //                     Profile
// //                   </div>
// //                   <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#4b5563' }}>
// //                     {resumeData.personal.summary}
// //                   </div>
// //                 </div>
// //               )}

// //               {resumeData.skills.length > 0 && (
// //                 <div style={{ marginBottom: '20px' }}>
// //                   <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: '#111827', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #2563eb' }}>
// //                     Skills
// //                   </div>
// //                   <div style={{ display: 'table', width: '100%' }}>
// //                     {resumeData.skills.map(skill => (
// //                       <span key={skill.id} style={{ backgroundColor: '#2563eb', color: 'white', padding: '5px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', marginRight: '6px', display: 'inline-block' }}>
// //                         {skill.name}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {resumeData.projects.length > 0 && (
// //                 <div>
// //                   <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: '#111827', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #2563eb' }}>
// //                     Projects
// //                   </div>
// //                   {resumeData.projects.map(proj => (
// //                     <div key={proj.id} style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '10px', marginBottom: '8px', fontSize: '12px' }}>
// //                       <div style={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
// //                         {proj.name}
// //                       </div>
// //                       {proj.technologies && <div style={{ color: '#6b7280', fontSize: '11px' }}>{proj.technologies}</div>}
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Main Content */}
// //             <div style={{ display: 'table-cell', width: '72%', padding: '32px 40px', verticalAlign: 'top' }}>
// //               {resumeData.experience.length > 0 && (
// //                 <div style={{ marginBottom: '24px' }}>
// //                   <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: '#111827', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #2563eb' }}>
// //                     Experience
// //                   </div>
// //                   {resumeData.experience.map(exp => (
// //                     <div key={exp.id} style={{ marginBottom: '18px', paddingLeft: '20px', position: 'relative' }}>
// //                       <div style={{ position: 'absolute', left: '0', top: '0', width: '16px', height: '16px', backgroundColor: '#2563eb', borderRadius: '50%', color: 'white', fontWeight: 'bold', fontSize: '10px', textAlign: 'center', lineHeight: '16px' }}>
// //                         •
// //                       </div>
// //                       <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#111827', marginBottom: '2px' }}>
// //                         {exp.position}
// //                       </div>
// //                       <div style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
// //                         {exp.company}
// //                       </div>
// //                       <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
// //                         {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
// //                       </div>
// //                       {exp.description && <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>{exp.description}</div>}
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}

// //               {resumeData.education.length > 0 && (
// //                 <div>
// //                   <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: '#111827', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #2563eb' }}>
// //                     Education
// //                   </div>
// //                   {resumeData.education.map(edu => (
// //                     <div key={edu.id} style={{ marginBottom: '18px', paddingLeft: '20px', position: 'relative' }}>
// //                       <div style={{ position: 'absolute', left: '0', top: '0', width: '16px', height: '16px', backgroundColor: '#2563eb', borderRadius: '50%', color: 'white', fontWeight: 'bold', fontSize: '10px', textAlign: 'center', lineHeight: '16px' }}>
// //                         A
// //                       </div>
// //                       <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#111827', marginBottom: '2px' }}>
// //                         {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
// //                       </div>
// //                       <div style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
// //                         {edu.school}
// //                       </div>
// //                       <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
// //                         {edu.startDate} — {edu.endDate}
// //                       </div>
// //                       {edu.gpa && <div style={{ fontSize: '13px', color: '#4b5563', fontWeight: 'bold', marginTop: '4px' }}>GPA: {edu.gpa}</div>}
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import { Download, Edit2 } from 'lucide-react';
// import { useState } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// export default function ResumePreview({ resumeData, onBack }) {
//   const [downloading, setDownloading] = useState(false);

//   const downloadResume = async () => {
//     if (downloading) return;
    
//     setDownloading(true);

//     try {
//       // Create an isolated iframe to avoid all global styles
//       const iframe = document.createElement('iframe');
//       iframe.style.cssText = 'position: fixed; left: -10000px; top: -10000px; width: 900px; height: 2000px;';
//       document.body.appendChild(iframe);

//       const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
//       // Write complete HTML with NO external stylesheets
//       iframeDoc.open();
//       iframeDoc.write(`
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <style>
//             * { margin: 0; padding: 0; box-sizing: border-box; }
//             body { font-family: Arial, sans-serif; background: #ffffff; }
//           </style>
//         </head>
//         <body>
//           <div id="resume" style="width: 900px; background: #ffffff;">
//             <div style="background-color: #1f2937; color: #ffffff; padding: 30px 40px;">
//               <div style="font-size: 32px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 12px;">
//                 ${resumeData.personal.fullName || 'Your Name'}
//               </div>
//               <div style="font-size: 13px; color: #d1d5db; line-height: 1.8;">
//                 ${resumeData.personal.email ? `<div>✉ ${resumeData.personal.email}</div>` : ''}
//                 ${resumeData.personal.phone ? `<div>📱 ${resumeData.personal.phone}</div>` : ''}
//                 ${resumeData.personal.location ? `<div>📍 ${resumeData.personal.location}</div>` : ''}
//                 ${resumeData.personal.linkedin ? `<div><a href="${resumeData.personal.linkedin}" style="color: #93c5fd; text-decoration: none;">LinkedIn</a></div>` : ''}
//                 ${resumeData.personal.portfolio ? `<div><a href="${resumeData.personal.portfolio}" style="color: #93c5fd; text-decoration: none;">Portfolio</a></div>` : ''}
//               </div>
//             </div>

//             <div style="display: table; width: 100%;">
//               <div style="display: table-cell; width: 28%; background-color: #f9fafb; padding: 32px 24px; border-right: 1px solid #e5e7eb; vertical-align: top;">
//                 ${resumeData.personal.summary ? `
//                   <div style="margin-bottom: 20px;">
//                     <div style="font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #111827; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #2563eb;">
//                       Profile
//                     </div>
//                     <div style="font-size: 13px; line-height: 1.6; color: #4b5563;">
//                       ${resumeData.personal.summary}
//                     </div>
//                   </div>
//                 ` : ''}

//                 ${resumeData.skills.length > 0 ? `
//                   <div style="margin-bottom: 20px;">
//                     <div style="font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #111827; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #2563eb;">
//                       Skills
//                     </div>
//                     <div>
//                       ${resumeData.skills.map(skill => `
//                         <span style="background-color: #2563eb; color: #ffffff; padding: 5px 10px; border-radius: 3px; font-size: 12px; font-weight: bold; margin-bottom: 6px; margin-right: 6px; display: inline-block;">
//                           ${skill.name}
//                         </span>
//                       `).join('')}
//                     </div>
//                   </div>
//                 ` : ''}

//                 ${resumeData.projects.length > 0 ? `
//                   <div>
//                     <div style="font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #111827; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #2563eb;">
//                       Projects
//                     </div>
//                     ${resumeData.projects.map(proj => `
//                       <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; margin-bottom: 8px; font-size: 12px;">
//                         <div style="font-weight: bold; color: #111827; margin-bottom: 4px;">
//                           ${proj.name}
//                         </div>
//                         ${proj.technologies ? `<div style="color: #6b7280; font-size: 11px;">${proj.technologies}</div>` : ''}
//                       </div>
//                     `).join('')}
//                   </div>
//                 ` : ''}
//               </div>

//               <div style="display: table-cell; width: 72%; padding: 32px 40px; vertical-align: top; background-color: #ffffff;">
//                 ${resumeData.experience.length > 0 ? `
//                   <div style="margin-bottom: 24px;">
//                     <div style="font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #111827; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #2563eb;">
//                       Experience
//                     </div>
//                     ${resumeData.experience.map(exp => `
//                       <div style="margin-bottom: 18px; padding-left: 20px; position: relative;">
//                         <div style="position: absolute; left: 0; top: 0; width: 16px; height: 16px; background-color: #2563eb; border-radius: 50%; color: #ffffff; font-weight: bold; font-size: 10px; text-align: center; line-height: 16px;">
//                           •
//                         </div>
//                         <div style="font-weight: bold; font-size: 14px; color: #111827; margin-bottom: 2px;">
//                           ${exp.position}
//                         </div>
//                         <div style="color: #2563eb; font-weight: bold; font-size: 13px; margin-bottom: 4px;">
//                           ${exp.company}
//                         </div>
//                         <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">
//                           ${exp.startDate} — ${exp.current ? 'Present' : exp.endDate}
//                         </div>
//                         ${exp.description ? `<div style="font-size: 13px; color: #4b5563; line-height: 1.5;">${exp.description}</div>` : ''}
//                       </div>
//                     `).join('')}
//                   </div>
//                 ` : ''}

//                 ${resumeData.education.length > 0 ? `
//                   <div>
//                     <div style="font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #111827; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #2563eb;">
//                       Education
//                     </div>
//                     ${resumeData.education.map(edu => `
//                       <div style="margin-bottom: 18px; padding-left: 20px; position: relative;">
//                         <div style="position: absolute; left: 0; top: 0; width: 16px; height: 16px; background-color: #2563eb; border-radius: 50%; color: #ffffff; font-weight: bold; font-size: 10px; text-align: center; line-height: 16px;">
//                           A
//                         </div>
//                         <div style="font-weight: bold; font-size: 14px; color: #111827; margin-bottom: 2px;">
//                           ${edu.degree}${edu.field ? ` in ${edu.field}` : ''}
//                         </div>
//                         <div style="color: #2563eb; font-weight: bold; font-size: 13px; margin-bottom: 4px;">
//                           ${edu.school}
//                         </div>
//                         <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">
//                           ${edu.startDate} — ${edu.endDate}
//                         </div>
//                         ${edu.gpa ? `<div style="font-size: 13px; color: #4b5563; font-weight: bold; margin-top: 4px;">GPA: ${edu.gpa}</div>` : ''}
//                       </div>
//                     `).join('')}
//                   </div>
//                 ` : ''}
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `);
//       iframeDoc.close();

//       // Wait for iframe to fully load
//       await new Promise(resolve => setTimeout(resolve, 100));

//       const resumeElement = iframeDoc.getElementById('resume');
//       const filename = `${resumeData.personal.fullName || 'Resume'}.pdf`;

//       // Capture with html2canvas inside the iframe
//       const canvas = await html2canvas(resumeElement, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: '#ffffff',
//         logging: false,
//         width: 900,
//         height: resumeElement.scrollHeight
//       });

//       // Clean up iframe
//       document.body.removeChild(iframe);

//       // Create PDF
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4'
//       });

//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= 297;

//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= 297;
//       }

//       pdf.save(filename);
//       setDownloading(false);
//     } catch (error) {
//       console.error('PDF generation failed:', error);
//       alert('Failed to generate PDF. Error: ' + error.message);
//       setDownloading(false);
//     }
//   };

//   return (
//     <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
//       <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a' }}>Resume Preview</h2>
//         <div style={{ display: 'flex', gap: '8px' }}>
//           <button
//             onClick={downloadResume}
//             disabled={downloading}
//             style={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               gap: '8px', 
//               padding: '8px 16px', 
//               backgroundColor: downloading ? '#22c55e' : '#16a34a',
//               color: 'white', 
//               border: 'none',
//               borderRadius: '8px',
//               cursor: downloading ? 'not-allowed' : 'pointer',
//               opacity: downloading ? 0.6 : 1,
//               fontSize: '14px',
//               fontWeight: '500',
//               transition: 'background-color 0.2s'
//             }}
//           >
//             <Download style={{ width: '16px', height: '16px' }} />
//             {downloading ? 'Downloading...' : 'Download PDF'}
//           </button>
//           <button
//             onClick={onBack}
//             style={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               gap: '8px', 
//               padding: '8px 16px', 
//               backgroundColor: '#475569',
//               color: 'white', 
//               border: 'none',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontSize: '14px',
//               fontWeight: '500',
//               transition: 'background-color 0.2s'
//             }}
//             onMouseOver={(e) => e.target.style.backgroundColor = '#334155'}
//             onMouseOut={(e) => e.target.style.backgroundColor = '#475569'}
//           >
//             <Edit2 style={{ width: '16px', height: '16px' }} />
//             Edit
//           </button>
//         </div>
//       </div>
      
//       <div style={{ padding: '32px', backgroundColor: '#f3f4f6' }}>
//         <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white' }}>
//           {/* Header */}
//           <div style={{ backgroundColor: '#1f2937', color: 'white', padding: '30px 40px' }}>
//             <div style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '12px' }}>
//               {resumeData.personal.fullName || 'Your Name'}
//             </div>
//             <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: '1.8' }}>
//               {resumeData.personal.email && <div>✉ {resumeData.personal.email}</div>}
//               {resumeData.personal.phone && <div>📱 {resumeData.personal.phone}</div>}
//               {resumeData.personal.location && <div>📍 {resumeData.personal.location}</div>}
//               {resumeData.personal.linkedin && <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#93c5fd', textDecoration: 'none' }}>LinkedIn</a>}
//               {resumeData.personal.portfolio && <a href={resumeData.personal.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#93c5fd', textDecoration: 'none', marginLeft: '16px' }}>Portfolio</a>}
//             </div>
//           </div>

//           {/* Main Content */}
//           <div style={{ display: 'table', width: '100%' }}>
//             {/* Sidebar */}
//             <div style={{ display: 'table-cell', width: '28%', backgroundColor: '#f9fafb', padding: '32px 24px', borderRight: '1px solid #e5e7eb', verticalAlign: 'top' }}>
//               {resumeData.personal.summary && (
//                 <div style={{ marginBottom: '20px' }}>
//                   <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: '#111827', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #2563eb' }}>
//                     Profile
//                   </div>
//                   <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#4b5563' }}>
//                     {resumeData.personal.summary}
//                   </div>
//                 </div>
//               )}

//               {resumeData.skills.length > 0 && (
//                 <div style={{ marginBottom: '20px' }}>
//                   <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: '#111827', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #2563eb' }}>
//                     Skills
//                   </div>
//                   <div style={{ display: 'table', width: '100%' }}>
//                     {resumeData.skills.map(skill => (
//                       <span key={skill.id} style={{ backgroundColor: '#2563eb', color: 'white', padding: '5px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', marginRight: '6px', display: 'inline-block' }}>
//                         {skill.name}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {resumeData.projects.length > 0 && (
//                 <div>
//                   <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: '#111827', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #2563eb' }}>
//                     Projects
//                   </div>
//                   {resumeData.projects.map(proj => (
//                     <div key={proj.id} style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '10px', marginBottom: '8px', fontSize: '12px' }}>
//                       <div style={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
//                         {proj.name}
//                       </div>
//                       {proj.technologies && <div style={{ color: '#6b7280', fontSize: '11px' }}>{proj.technologies}</div>}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Main Content */}
//             <div style={{ display: 'table-cell', width: '72%', padding: '32px 40px', verticalAlign: 'top' }}>
//               {resumeData.experience.length > 0 && (
//                 <div style={{ marginBottom: '24px' }}>
//                   <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: '#111827', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #2563eb' }}>
//                     Experience
//                   </div>
//                   {resumeData.experience.map(exp => (
//                     <div key={exp.id} style={{ marginBottom: '18px', paddingLeft: '20px', position: 'relative' }}>
//                       <div style={{ position: 'absolute', left: '0', top: '0', width: '16px', height: '16px', backgroundColor: '#2563eb', borderRadius: '50%', color: 'white', fontWeight: 'bold', fontSize: '10px', textAlign: 'center', lineHeight: '16px' }}>
//                         •
//                       </div>
//                       <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#111827', marginBottom: '2px' }}>
//                         {exp.position}
//                       </div>
//                       <div style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
//                         {exp.company}
//                       </div>
//                       <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
//                         {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
//                       </div>
//                       {exp.description && <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>{exp.description}</div>}
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {resumeData.education.length > 0 && (
//                 <div>
//                   <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: '#111827', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #2563eb' }}>
//                     Education
//                   </div>
//                   {resumeData.education.map(edu => (
//                     <div key={edu.id} style={{ marginBottom: '18px', paddingLeft: '20px', position: 'relative' }}>
//                       <div style={{ position: 'absolute', left: '0', top: '0', width: '16px', height: '16px', backgroundColor: '#2563eb', borderRadius: '50%', color: 'white', fontWeight: 'bold', fontSize: '10px', textAlign: 'center', lineHeight: '16px' }}>
//                         A
//                       </div>
//                       <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#111827', marginBottom: '2px' }}>
//                         {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
//                       </div>
//                       <div style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
//                         {edu.school}
//                       </div>
//                       <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
//                         {edu.startDate} — {edu.endDate}
//                       </div>
//                       {edu.gpa && <div style={{ fontSize: '13px', color: '#4b5563', fontWeight: 'bold', marginTop: '4px' }}>GPA: {edu.gpa}</div>}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { Download, Edit2 } from 'lucide-react';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ResumePreview({ resumeData, onBack }) {
  const [downloading, setDownloading] = useState(false);

  const downloadResume = async () => {
    if (downloading) return;
    
    setDownloading(true);

    try {
      // Create an isolated iframe to avoid all global styles
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position: fixed; left: -10000px; top: -10000px; width: 900px; height: 2000px;';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Write complete HTML with NO external stylesheets
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Georgia', 'Times New Roman', serif; background: #ffffff; }
          </style>
        </head>
        <body>
          <div id="resume" style="width: 900px; background: #ffffff; padding: 60px 80px;">
            
            <!-- Header -->
            <div style="text-align: center; border-bottom: 3px solid #000000; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="font-size: 36px; font-weight: bold; color: #000000; margin-bottom: 8px; letter-spacing: 1px;">
                ${resumeData.personal.fullName || 'YOUR NAME'}
              </h1>
              <div style="font-size: 12px; color: #333333; line-height: 1.8;">
                ${resumeData.personal.email ? `${resumeData.personal.email}` : ''}
                ${resumeData.personal.phone ? ` • ${resumeData.personal.phone}` : ''}
                ${resumeData.personal.location ? ` • ${resumeData.personal.location}` : ''}
              </div>
              ${resumeData.personal.linkedin || resumeData.personal.portfolio ? `
                <div style="font-size: 11px; color: #555555; margin-top: 4px;">
                  ${resumeData.personal.linkedin ? `${resumeData.personal.linkedin}` : ''}
                  ${resumeData.personal.portfolio ? ` • ${resumeData.personal.portfolio}` : ''}
                </div>
              ` : ''}
            </div>

            <!-- Professional Summary -->
            ${resumeData.personal.summary ? `
              <div style="margin-bottom: 30px;">
                <h2 style="font-size: 14px; font-weight: bold; color: #000000; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; border-bottom: 2px solid #000000; padding-bottom: 6px;">
                  Professional Summary
                </h2>
                <p style="font-size: 12px; line-height: 1.7; color: #333333; text-align: justify;">
                  ${resumeData.personal.summary}
                </p>
              </div>
            ` : ''}

            <!-- Experience -->
            ${resumeData.experience.length > 0 ? `
              <div style="margin-bottom: 30px;">
                <h2 style="font-size: 14px; font-weight: bold; color: #000000; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; border-bottom: 2px solid #000000; padding-bottom: 6px;">
                  Professional Experience
                </h2>
                ${resumeData.experience.map(exp => `
                  <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                      <h3 style="font-size: 13px; font-weight: bold; color: #000000;">
                        ${exp.position}
                      </h3>
                      <span style="font-size: 11px; color: #555555; font-style: italic;">
                        ${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div style="font-size: 12px; color: #333333; font-style: italic; margin-bottom: 8px;">
                      ${exp.company}
                    </div>
                    ${exp.description ? `
                      <p style="font-size: 11px; line-height: 1.6; color: #444444; text-align: justify;">
                        ${exp.description}
                      </p>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Education -->
            ${resumeData.education.length > 0 ? `
              <div style="margin-bottom: 30px;">
                <h2 style="font-size: 14px; font-weight: bold; color: #000000; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; border-bottom: 2px solid #000000; padding-bottom: 6px;">
                  Education
                </h2>
                ${resumeData.education.map(edu => `
                  <div style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                      <h3 style="font-size: 13px; font-weight: bold; color: #000000;">
                        ${edu.degree}${edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      <span style="font-size: 11px; color: #555555; font-style: italic;">
                        ${edu.startDate} – ${edu.endDate}
                      </span>
                    </div>
                    <div style="font-size: 12px; color: #333333; font-style: italic;">
                      ${edu.school}
                    </div>
                    ${edu.gpa ? `
                      <div style="font-size: 11px; color: #444444; margin-top: 4px;">
                        GPA: ${edu.gpa}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Skills -->
            ${resumeData.skills.length > 0 ? `
              <div style="margin-bottom: 30px;">
                <h2 style="font-size: 14px; font-weight: bold; color: #000000; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; border-bottom: 2px solid #000000; padding-bottom: 6px;">
                  Skills
                </h2>
                <div style="font-size: 11px; line-height: 1.8; color: #333333;">
                  ${resumeData.skills.map(skill => skill.name).join(' • ')}
                </div>
              </div>
            ` : ''}

            <!-- Projects -->
            ${resumeData.projects.length > 0 ? `
              <div>
                <h2 style="font-size: 14px; font-weight: bold; color: #000000; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; border-bottom: 2px solid #000000; padding-bottom: 6px;">
                  Projects
                </h2>
                ${resumeData.projects.map(proj => `
                  <div style="margin-bottom: 14px;">
                    <h3 style="font-size: 12px; font-weight: bold; color: #000000; margin-bottom: 4px;">
                      ${proj.name}
                    </h3>
                    ${proj.technologies ? `
                      <div style="font-size: 11px; color: #555555; font-style: italic;">
                        ${proj.technologies}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

          </div>
        </body>
        </html>
      `);
      iframeDoc.close();

      // Wait for iframe to fully load
      await new Promise(resolve => setTimeout(resolve, 100));

      const resumeElement = iframeDoc.getElementById('resume');
      const filename = `${resumeData.personal.fullName || 'Resume'}.pdf`;

      // Capture with html2canvas inside the iframe
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 900,
        height: resumeElement.scrollHeight
      });

      // Clean up iframe
      document.body.removeChild(iframe);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(filename);
      setDownloading(false);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Error: ' + error.message);
      setDownloading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a' }}>Resume Preview</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={downloadResume}
            disabled={downloading}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '8px 16px', 
              backgroundColor: downloading ? '#22c55e' : '#16a34a',
              color: 'white', 
              border: 'none',
              borderRadius: '8px',
              cursor: downloading ? 'not-allowed' : 'pointer',
              opacity: downloading ? 0.6 : 1,
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            <Download style={{ width: '16px', height: '16px' }} />
            {downloading ? 'Downloading...' : 'Download PDF'}
          </button>
          <button
            onClick={onBack}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '8px 16px', 
              backgroundColor: '#475569',
              color: 'white', 
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#334155'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#475569'}
          >
            <Edit2 style={{ width: '16px', height: '16px' }} />
            Edit
          </button>
        </div>
      </div>
      
      <div style={{ padding: '32px', backgroundColor: '#f8f9fa' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '60px 80px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '3px solid #000000', paddingBottom: '20px', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#000000', marginBottom: '8px', letterSpacing: '1px', fontFamily: 'Georgia, Times New Roman, serif' }}>
              {resumeData.personal.fullName || 'YOUR NAME'}
            </h1>
            <div style={{ fontSize: '12px', color: '#333333', lineHeight: '1.8' }}>
              {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
              {resumeData.personal.phone && <span> • {resumeData.personal.phone}</span>}
              {resumeData.personal.location && <span> • {resumeData.personal.location}</span>}
            </div>
            {(resumeData.personal.linkedin || resumeData.personal.portfolio) && (
              <div style={{ fontSize: '11px', color: '#555555', marginTop: '4px' }}>
                {resumeData.personal.linkedin && <span>{resumeData.personal.linkedin}</span>}
                {resumeData.personal.portfolio && <span> • {resumeData.personal.portfolio}</span>}
              </div>
            )}
          </div>

          {/* Professional Summary */}
          {resumeData.personal.summary && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', borderBottom: '2px solid #000000', paddingBottom: '6px', fontFamily: 'Georgia, Times New Roman, serif' }}>
                Professional Summary
              </h2>
              <p style={{ fontSize: '12px', lineHeight: '1.7', color: '#333333', textAlign: 'justify', fontFamily: 'Georgia, Times New Roman, serif' }}>
                {resumeData.personal.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', borderBottom: '2px solid #000000', paddingBottom: '6px', fontFamily: 'Georgia, Times New Roman, serif' }}>
                Professional Experience
              </h2>
              {resumeData.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#000000', fontFamily: 'Georgia, Times New Roman, serif' }}>
                      {exp.position}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#555555', fontStyle: 'italic', fontFamily: 'Georgia, Times New Roman, serif' }}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#333333', fontStyle: 'italic', marginBottom: '8px', fontFamily: 'Georgia, Times New Roman, serif' }}>
                    {exp.company}
                  </div>
                  {exp.description && (
                    <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#444444', textAlign: 'justify', fontFamily: 'Georgia, Times New Roman, serif' }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resumeData.education.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', borderBottom: '2px solid #000000', paddingBottom: '6px', fontFamily: 'Georgia, Times New Roman, serif' }}>
                Education
              </h2>
              {resumeData.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#000000', fontFamily: 'Georgia, Times New Roman, serif' }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#555555', fontStyle: 'italic', fontFamily: 'Georgia, Times New Roman, serif' }}>
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#333333', fontStyle: 'italic', fontFamily: 'Georgia, Times New Roman, serif' }}>
                    {edu.school}
                  </div>
                  {edu.gpa && (
                    <div style={{ fontSize: '11px', color: '#444444', marginTop: '4px', fontFamily: 'Georgia, Times New Roman, serif' }}>
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resumeData.skills.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', borderBottom: '2px solid #000000', paddingBottom: '6px', fontFamily: 'Georgia, Times New Roman, serif' }}>
                Skills
              </h2>
              <div style={{ fontSize: '11px', lineHeight: '1.8', color: '#333333', fontFamily: 'Georgia, Times New Roman, serif' }}>
                {resumeData.skills.map(skill => skill.name).join(' • ')}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData.projects.length > 0 && (
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', borderBottom: '2px solid #000000', paddingBottom: '6px', fontFamily: 'Georgia, Times New Roman, serif' }}>
                Projects
              </h2>
              {resumeData.projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#000000', marginBottom: '4px', fontFamily: 'Georgia, Times New Roman, serif' }}>
                    {proj.name}
                  </h3>
                  {proj.technologies && (
                    <div style={{ fontSize: '11px', color: '#555555', fontStyle: 'italic', fontFamily: 'Georgia, Times New Roman, serif' }}>
                      {proj.technologies}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}