// Resume Generator Module
class ResumeGenerator {
    constructor() {
        this.isGenerating = false;
        this.currentPdfUrl = null;
        this.currentPdfBytes = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTypst();
    }

    async initializeTypst() {
        try {
            await typstIntegration.init();
            console.log('Typst integration initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Typst:', error);
            // 显示友好的错误提示，不显示技术错误信息
            this.showToast('info', '正在使用离线模式，将显示HTML预览版本。如需PDF功能，请检查网络连接。');
        }
    }

    setupEventListeners() {
        // Generate resume button
        const generateBtn = document.getElementById('generate-resume');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateResume();
            });
        }

        // Download PDF button
        const downloadBtn = document.getElementById('download-pdf');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadPDF();
            });
        }

        // AI Sample data generation
        const generateSampleBtn = document.getElementById('generate-sample');
        if (generateSampleBtn) {
            generateSampleBtn.addEventListener('click', () => {
                this.generateSampleData();
            });
        }

        // AI Enhance all content
        const enhanceAllBtn = document.getElementById('enhance-all');
        if (enhanceAllBtn) {
            enhanceAllBtn.addEventListener('click', () => {
                this.enhanceAllContent();
            });
        }

        // API Key input
        const apiKeyInput = document.getElementById('gemini-api-key');
        if (apiKeyInput) {
            // Load saved API key
            apiKeyInput.value = geminiAPI.getApiKey();
            
            apiKeyInput.addEventListener('input', (e) => {
                geminiAPI.setApiKey(e.target.value);
            });
        }
    }

    async generateResume() {
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.showLoading(true);
        
        try {
            // Collect form data
            const resumeData = formManager.collectFormData();
            console.log('收集到的表单数据:', resumeData);
            
            // Validate required fields
            if (!this.validateResumeData(resumeData)) {
                console.log('表单验证失败');
                this.showToast('error', i18n.t('status.error.validation'));
                return;
            }
            
            console.log('表单验证通过，开始生成简历');

            // Generate Typst code from form data
            const typstCode = window.typstIntegration.generateTypstCode(resumeData);
            console.log('生成的Typst代码:', typstCode);

            // First try to show SVG preview for immediate feedback
            try {
                const svgContent = await window.typstIntegration.compileToSVG(typstCode);
                this.displaySVGPreview(svgContent);
            } catch (svgError) {
                console.warn('SVG 生成失败，显示HTML预览:', svgError);
                const htmlPreview = this.generateHTMLFallback(resumeData);
                this.displayHTMLPreview(htmlPreview);
                this.showToast('info', '正在显示HTML预览版本');
            }
            
            // Then try to generate PDF in the background
            try {
                const pdfBytes = await window.typstIntegration.compileToPDF(typstCode);
                
                if (pdfBytes) {
                    this.currentPdfBytes = pdfBytes;
                    await this.displayPDF(pdfBytes);
                    this.enableDownload();
                    this.showToast('success', i18n.t('status.success.generated'));
                } else {
                    throw new Error('PDF generation returned null');
                }
            } catch (pdfError) {
                console.warn('PDF generation failed, using preview:', pdfError);
                this.showToast('info', '已生成预览，PDF 功能暂时不可用');
            }
        } catch (error) {
            console.error('Error generating resume:', error);
            this.showToast('error', i18n.t('status.error.generation') + ': ' + error.message);
        } finally {
            this.isGenerating = false;
            this.showLoading(false);
        }
    }

    validateResumeData(data) {
        console.log('=== 开始验证简历数据 ===');
        console.log('完整数据:', JSON.stringify(data, null, 2));
        
        // Check if name is provided
        if (!data.personal || !data.personal.name || data.personal.name.trim() === '') {
            console.log('❌ 验证失败: 姓名为空或未提供');
            console.log('个人信息:', data.personal);
            return false;
        }
        
        console.log('✅ 姓名验证通过:', data.personal.name);

        // Check education section
        console.log('检查教育背景:', data.education);
        const hasEducation = data.education && data.education.length > 0 && 
                           data.education.some(edu => {
                               const hasInstitution = edu.institution && edu.institution.trim();
                               const hasDegree = edu.degree && edu.degree.trim();
                               console.log(`教育项目: institution="${edu.institution}", degree="${edu.degree}", valid=${hasInstitution || hasDegree}`);
                               return hasInstitution || hasDegree;
                           });
        
        // Check work section
        console.log('检查工作经历:', data.work);
        const hasWork = data.work && data.work.length > 0 && 
                       data.work.some(work => {
                           const hasCompany = work.company && work.company.trim();
                           const hasPosition = work.position && work.position.trim();
                           console.log(`工作项目: company="${work.company}", position="${work.position}", valid=${hasCompany || hasPosition}`);
                           return hasCompany || hasPosition;
                       });
        
        // Check projects section
        console.log('检查项目经历:', data.projects);
        const hasProjects = data.projects && data.projects.length > 0 && 
                           data.projects.some(proj => {
                               const hasName = proj.name && proj.name.trim();
                               const hasRole = proj.role && proj.role.trim();
                               console.log(`项目项目: name="${proj.name}", role="${proj.role}", valid=${hasName || hasRole}`);
                               return hasName || hasRole;
                           });

        // Check research section
        console.log('检查科研经历:', data.research);
        const hasResearch = data.research && data.research.length > 0 && 
                           data.research.some(paper => {
                               const hasTitle = paper.title && paper.title.trim();
                               const hasJournal = paper.journal && paper.journal.trim();
                               console.log(`科研项目: title="${paper.title}", journal="${paper.journal}", valid=${hasTitle || hasJournal}`);
                               return hasTitle || hasJournal;
                           });

        const hasContent = hasEducation || hasWork || hasProjects || hasResearch;
        
        console.log('=== 验证结果汇总 ===');
        console.log('姓名:', data.personal.name);
        console.log('教育背景有效:', hasEducation);
        console.log('工作经历有效:', hasWork);
        console.log('项目经历有效:', hasProjects);
        console.log('科研经历有效:', hasResearch);
        console.log('总体内容有效:', hasContent);
        console.log('=== 验证结束 ===');

        if (!hasContent) {
            console.log('❌ 验证失败: 缺乏有效内容');
        } else {
            console.log('✅ 验证通过');
        }

        return hasContent;
    }

    displaySVGPreview(svgContent) {
        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return;

        try {
            // Clean up previous URL
            if (this.currentPdfUrl) {
                URL.revokeObjectURL(this.currentPdfUrl);
                this.currentPdfUrl = null;
            }

            // Create SVG preview container
            const svgContainer = document.createElement('div');
            svgContainer.className = 'svg-preview-container';
            svgContainer.style.cssText = `
                width: 100%;
                height: 100%;
                overflow-y: auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding: 20px;
            `;
            svgContainer.innerHTML = svgContent;

            // Replace preview content
            previewContent.innerHTML = '';
            previewContent.appendChild(svgContainer);
        } catch (error) {
            console.error('Error displaying SVG preview:', error);
            this.showToast('error', i18n.t('status.error.display'));
        }
    }

    displayHTMLPreview(htmlContent) {
        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return;

        try {
            // Clean up previous URL
            if (this.currentPdfUrl) {
                URL.revokeObjectURL(this.currentPdfUrl);
                this.currentPdfUrl = null;
            }

            // Create HTML preview container
            const htmlContainer = document.createElement('div');
            htmlContainer.className = 'html-preview-container';
            htmlContainer.style.cssText = `
                width: 100%;
                height: 100%;
                overflow-y: auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
            htmlContainer.innerHTML = htmlContent;

            // Replace preview content
            previewContent.innerHTML = '';
            previewContent.appendChild(htmlContainer);
        } catch (error) {
            console.error('Error displaying HTML preview:', error);
            this.showToast('error', i18n.t('status.error.display'));
        }
    }

    generateHTMLFallback(resumeData) {
        const { personal, education = [], work = [], projects = [], research = [], skills = '' } = resumeData;
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const isEnglish = currentLang === 'en-US';
        
        let html = `
        <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 16px; background: white; color: black; line-height: 1.5; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #26428b;">
                <h1 style="margin: 0 0 10px 0; color: #26428b; font-size: 28px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-user" style="color: #26428b;"></i>
                    ${personal?.name || ''}
                </h1>
                ${personal?.pronouns ? `<div style="font-style: italic; color: #666; margin-bottom: 10px;">(${personal.pronouns})</div>` : ''}
                <div style="color: #666; font-size: 14px;">
                    ${[
                        personal?.location ? `<i class="fas fa-map-marker-alt" style="color: #ea4335;"></i> ${personal.location}` : null,
                        personal?.email ? `<i class="fas fa-envelope" style="color: #ea4335;"></i> <a href="mailto:${personal.email}" style="color: #26428b; text-decoration: none;">${personal.email}</a>` : null,
                        personal?.phone ? `<i class="fas fa-phone" style="color: #34a853;"></i> ${personal.phone}` : null,
                        personal?.github ? `<i class="fab fa-github" style="color: #181717;"></i> <a href="https://${personal.github}" target="_blank" style="color: #26428b; text-decoration: none;">GitHub</a>` : null,
                        personal?.linkedin ? `<i class="fab fa-linkedin" style="color: #0077b5;"></i> <a href="https://${personal.linkedin}" target="_blank" style="color: #26428b; text-decoration: none;">LinkedIn</a>` : null,
                        personal?.website ? `<i class="fas fa-globe" style="color: #4285f4;"></i> <a href="${personal.website}" target="_blank" style="color: #26428b; text-decoration: none;">Website</a>` : null
                    ].filter(x => x).join(' | ')}
                </div>
            </div>
        `;
        
        if (education.length > 0) {
            const title = isEnglish ? 'Education' : '教育背景';
            html += `<h2 style="border-bottom: 2px solid #26428b; color: #26428b; display: flex; align-items: center; gap: 8px;"><i class="fas fa-graduation-cap" style="color: #6a1b9a;"></i> ${title}</h2>`;
            education.forEach(edu => {
                html += `
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong><i class="fas fa-university" style="color: #1565c0;"></i> ${edu.institution || ''}</strong>
                        <span><i class="fas fa-calendar-alt" style="color: #d32f2f;"></i> ${edu.startDate || ''} - ${edu.endDate || ''}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <em><i class="fas fa-graduation-cap" style="color: #6a1b9a;"></i> ${edu.degree || ''}</em>
                        <em><i class="fas fa-map-marker-alt" style="color: #ea4335;"></i> ${edu.location || ''}</em>
                    </div>
                    ${edu.gpa ? `<div style="color: #ff9800;"><i class="fas fa-star" style="color: #ff9800;"></i> GPA: ${edu.gpa}</div>` : ''}
                    ${edu.description ? `<p style="font-size: 14px; font-weight: 300; color: #333; margin-top: 6px; line-height: 1.4;">${edu.description}</p>` : ''}
                </div>
                `;
            });
        }
        
        if (work.length > 0) {
            const title = isEnglish ? 'Work Experience' : '工作经历';
            html += `<h2 style="border-bottom: 2px solid #26428b; color: #26428b; display: flex; align-items: center; gap: 8px;"><i class="fas fa-briefcase" style="color: #795548;"></i> ${title}</h2>`;
            work.forEach(workItem => {
                html += `
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong><i class="fas fa-briefcase" style="color: #795548;"></i> ${workItem.position || ''}</strong>
                        <span><i class="fas fa-calendar-alt" style="color: #d32f2f;"></i> ${workItem.startDate || ''} - ${workItem.endDate || ''}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span><i class="fas fa-building" style="color: #424242;"></i> ${workItem.company || ''}</span>
                        <em><i class="fas fa-map-marker-alt" style="color: #ea4335;"></i> ${workItem.location || ''}</em>
                    </div>
                    ${workItem.description ? `<div style="font-size: 14px; font-weight: 300; color: #333; margin-top: 6px;">${workItem.description.split('\n').map(line => line.trim() ? `<p style="margin: 2px 0; line-height: 1.4;">• ${line.trim()}</p>` : '').join('')}</div>` : ''}
                </div>
                `;
            });
        }
        
        if (projects.length > 0) {
            const title = isEnglish ? 'Projects' : '项目经历';
            html += `<h2 style="border-bottom: 2px solid #26428b; color: #26428b; display: flex; align-items: center; gap: 8px;"><i class="fas fa-project-diagram" style="color: #2e7d32;"></i> ${title}</h2>`;
            projects.forEach(proj => {
                html += `
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong><i class="fas fa-project-diagram" style="color: #2e7d32;"></i> ${proj.name || ''} ${proj.role ? `- <i class="fas fa-user-tag" style="color: #8e24aa;"></i> ${proj.role}` : ''}</strong>
                        <span><i class="fas fa-calendar-alt" style="color: #d32f2f;"></i> ${proj.startDate || ''} - ${proj.endDate || ''}</span>
                    </div>
                    ${proj.url ? `<div><i class="fas fa-link" style="color: #1976d2;"></i> <a href="https://${proj.url}" target="_blank" style="color: #26428b; text-decoration: none;">${proj.url}</a></div>` : ''}
                    ${proj.description ? `<div style="font-size: 14px; font-weight: 300; color: #333; margin-top: 6px;">${proj.description.split('\n').map(line => line.trim() ? `<p style="margin: 2px 0; line-height: 1.4;">• ${line.trim()}</p>` : '').join('')}</div>` : ''}
                </div>
                `;
            });
        }
        
        if (research.length > 0) {
            const title = isEnglish ? 'Research & Publications' : '科研经历';
            html += `<h2 style="border-bottom: 2px solid #26428b; color: #26428b; display: flex; align-items: center; gap: 8px;"><i class="fas fa-atom" style="color: #9c27b0;"></i> ${title}</h2>`;
            research.forEach(paper => {
                html += `
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong><i class="fas fa-file-alt" style="color: #3f51b5;"></i> ${paper.title || ''}</strong>
                        <span><i class="fas fa-calendar-alt" style="color: #d32f2f;"></i> ${paper.date || ''}</span>
                    </div>
                    ${paper.journal ? `<div><i class="fas fa-book-open" style="color: #ff9800;"></i> ${paper.journal}</div>` : ''}
                    ${paper.authors ? `<div><i class="fas fa-users" style="color: #607d8b;"></i> ${paper.authors}</div>` : ''}
                    ${paper.doi ? `<div><i class="fas fa-external-link-alt" style="color: #1976d2;"></i> <a href="${paper.doi}" target="_blank" style="color: #26428b; text-decoration: none;">${paper.doi}</a></div>` : ''}
                    ${paper.description ? `<div style="font-size: 14px; font-weight: 300; color: #333; margin-top: 6px;">${paper.description.split('\n').map(line => line.trim() ? `<p style="margin: 2px 0; line-height: 1.4;">• ${line.trim()}</p>` : '').join('')}</div>` : ''}
                </div>
                `;
            });
        }

        if (skills) {
            const title = isEnglish ? 'Skills' : '技能特长';
            html += `<h2 style="border-bottom: 2px solid #26428b; color: #26428b; display: flex; align-items: center; gap: 8px;"><i class="fas fa-cogs" style="color: #ff5722;"></i> ${title}</h2>`;
            const skillList = skills.split(/[,\n]/).map(skill => skill.trim()).filter(skill => skill);
            html += '<div>' + skillList.map(skill => `<span style="display: inline-block; margin-right: 10px;"><i class="fas fa-check-circle" style="color: #4caf50;"></i> ${skill}</span>`).join('') + '</div>';
        }
        
        html += '</div>';
        return html;
    }

    async displayPDF(pdfBytes) {
        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return;

        try {
            // Clean up previous URL
            if (this.currentPdfUrl) {
                URL.revokeObjectURL(this.currentPdfUrl);
            }

            // Create new PDF blob URL
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            this.currentPdfUrl = URL.createObjectURL(blob);
            
            // Create PDF container
            const pdfContainer = document.createElement('div');
            pdfContainer.className = 'pdf-container';
            pdfContainer.innerHTML = `
                <embed 
                    src="${this.currentPdfUrl}" 
                    type="application/pdf" 
                    width="100%" 
                    height="100%" 
                    class="pdf-preview"
                />
            `;

            // Replace preview content
            previewContent.innerHTML = '';
            previewContent.appendChild(pdfContainer);
        } catch (error) {
            console.error('Error displaying PDF:', error);
            this.showToast('error', i18n.t('status.error.display'));
        }
    }

    enableDownload() {
        const downloadBtn = document.getElementById('download-pdf');
        if (downloadBtn) {
            downloadBtn.disabled = false;
        }
    }

    downloadPDF() {
        if (!this.currentPdfBytes) {
            this.showToast('error', i18n.t('status.error.no.pdf'));
            return;
        }

        try {
            const formData = formManager.collectFormData();
            const filename = this.generateFilename(formData.personal.name);
            window.typstIntegration.downloadPDF(this.currentPdfBytes, filename);
            this.showToast('success', i18n.t('status.success.downloaded'));
        } catch (error) {
            console.error('Error downloading PDF:', error);
            this.showToast('error', i18n.t('status.error.download'));
        }
    }

    generateFilename(name) {
        const cleanName = name.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_');
        const currentLang = i18n.getCurrentLanguage();
        const resumeWord = currentLang === 'zh-CN' ? '简历' : 'Resume';
        return `${cleanName}_${resumeWord}.pdf`;
    }

    async generateSampleData() {
        if (!geminiAPI.hasApiKey()) {
            this.showToast('error', i18n.t('status.error.api'));
            return;
        }

        this.showLoading(true, i18n.t('status.generating.sample'));

        try {
            const sampleData = await geminiAPI.generateSampleData();
            formManager.populateForm(sampleData);
            this.showToast('success', i18n.t('status.success.sample'));
        } catch (error) {
            console.error('Error generating sample data:', error);
            this.showToast('error', i18n.t('status.error.sample'));
        } finally {
            this.showLoading(false);
        }
    }

    async enhanceAllContent() {
        if (!geminiAPI.hasApiKey()) {
            this.showToast('error', i18n.t('status.error.api'));
            return;
        }

        this.showLoading(true, i18n.t('status.enhancing.all'));

        try {
            const formData = formManager.collectFormData();
            
            // Enhance work descriptions
            for (let i = 0; i < formData.work.length; i++) {
                const work = formData.work[i];
                if (work.company && work.position) {
                    try {
                        const enhanced = await geminiAPI.enhanceWorkDescription(
                            work.position, 
                            work.company, 
                            work.description
                        );
                        
                        // Update the form
                        const workItem = document.querySelector(`[name="work_${i}_description"]`);
                        if (workItem) {
                            workItem.value = enhanced;
                        }
                    } catch (error) {
                        console.warn(`Failed to enhance work item ${i}:`, error);
                    }
                }
            }

            // Enhance project descriptions
            for (let i = 0; i < formData.projects.length; i++) {
                const project = formData.projects[i];
                if (project.name) {
                    try {
                        const enhanced = await geminiAPI.enhanceProjectDescription(
                            project.name,
                            project.role,
                            project.description
                        );
                        
                        // Update the form
                        const projectItem = document.querySelector(`[name="projects_${i}_description"]`);
                        if (projectItem) {
                            projectItem.value = enhanced;
                        }
                    } catch (error) {
                        console.warn(`Failed to enhance project item ${i}:`, error);
                    }
                }
            }

            // Enhance research descriptions
            for (let i = 0; i < formData.research.length; i++) {
                const research = formData.research[i];
                if (research.title) {
                    try {
                        const enhanced = await geminiAPI.enhanceText(
                            research.description,
                            `Research paper: ${research.title} in ${research.journal}`
                        );
                        
                        // Update the form
                        const researchItem = document.querySelector(`[name="research_${i}_description"]`);
                        if (researchItem) {
                            researchItem.value = enhanced;
                        }
                    } catch (error) {
                        console.warn(`Failed to enhance research item ${i}:`, error);
                    }
                }
            }

            // Generate skills if empty
            const skillsInput = document.getElementById('skills');
            if (skillsInput && (!formData.skills || formData.skills.trim() === '')) {
                try {
                    const skills = await geminiAPI.generateSkills(
                        formData.education,
                        formData.work,
                        formData.projects,
                        formData.research
                    );
                    skillsInput.value = skills;
                } catch (error) {
                    console.warn('Failed to generate skills:', error);
                }
            }

            formManager.saveToStorage();
            this.showToast('success', i18n.t('status.success.enhanced.all'));
        } catch (error) {
            console.error('Error enhancing content:', error);
            this.showToast('error', i18n.t('status.error.enhance.all'));
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show, message = null) {
        const overlay = document.getElementById('loading-overlay');
        const messageElement = overlay?.querySelector('p');
        
        if (overlay) {
            if (show) {
                if (message && messageElement) {
                    messageElement.textContent = message;
                }
                overlay.classList.add('show');
            } else {
                overlay.classList.remove('show');
                // Reset message
                if (messageElement) {
                    messageElement.textContent = i18n.t('status.generating');
                }
            }
        }
    }

    showToast(type, message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check_circle' : 
                    type === 'error' ? 'error' : 'info';
        
        toast.innerHTML = `
            <span class="material-symbols-outlined">${icon}</span>
            <span>${message}</span>
        `;

        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Cleanup method
    cleanup() {
        if (this.currentPdfUrl) {
            URL.revokeObjectURL(this.currentPdfUrl);
        }
    }
}

// Create global instance
window.resumeGenerator = new ResumeGenerator(); 