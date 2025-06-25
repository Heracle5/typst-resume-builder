// Form Manager Module
class FormManager {
    constructor() {
        this.formData = {
            personal: {},
            education: [],
            work: [],
            projects: [],
            research: [],
            skills: ''
        };
        
        this.itemTemplates = {
            education: this.createEducationTemplate,
            work: this.createWorkTemplate,
            projects: this.createProjectTemplate,
            research: this.createResearchTemplate
        };
        
        this.itemCounters = {
            education: 0,
            work: 0,
            projects: 0,
            research: 0
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromStorage();
    }

    setupEventListeners() {
        // Add item buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-btn')) {
                const btn = e.target.closest('.add-btn');
                const section = btn.getAttribute('data-section');
                this.addItem(section);
            }
        });

        // Auto-save on input changes
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.saveToStorage();
            }
        });

        // Language change event
        document.addEventListener('languageChanged', () => {
            this.updatePlaceholders();
        });
    }

    addItem(section) {
        if (!this.itemTemplates[section]) return;

        const container = document.getElementById(`${section}-items`);
        if (!container) return;

        const itemId = `${section}_${this.itemCounters[section]++}`;
        const itemElement = this.itemTemplates[section].call(this, itemId);
        
        itemElement.classList.add('adding');
        container.appendChild(itemElement);
        
        // Add to data array
        this.formData[section].push(this.getDefaultItemData(section));
        
        // Set up item event listeners
        this.setupItemEventListeners(itemElement, section);
        
        // Translate new elements
        if (window.i18n) {
            i18n.translatePage();
        }

        // Remove animation class after animation
        setTimeout(() => {
            itemElement.classList.remove('adding');
        }, 300);
    }

    removeItem(section, itemId) {
        const itemElement = document.getElementById(itemId);
        if (!itemElement) return;

        // Don't remove if it's the only item
        const container = document.getElementById(`${section}-items`);
        if (container && container.children.length <= 1) {
            return;
        }

        itemElement.classList.add('removing');
        
        setTimeout(() => {
            itemElement.remove();
            this.saveToStorage();
        }, 300);
    }

    async enhanceItem(section, itemId) {
        if (!geminiAPI.hasApiKey()) {
            this.showToast('error', i18n.t('status.error.api'));
            return;
        }

        const itemElement = document.getElementById(itemId);
        if (!itemElement) return;

        const enhanceBtn = itemElement.querySelector('.enhance-btn');
        if (enhanceBtn) {
            enhanceBtn.classList.add('enhancing');
            enhanceBtn.disabled = true;
        }

        try {
            if (section === 'work') {
                const company = itemElement.querySelector('[name$="company"]').value;
                const position = itemElement.querySelector('[name$="position"]').value;
                const description = itemElement.querySelector('[name$="description"]').value;
                
                const enhancedDescription = await geminiAPI.enhanceWorkDescription(position, company, description);
                itemElement.querySelector('[name$="description"]').value = enhancedDescription;
            } else if (section === 'projects') {
                const name = itemElement.querySelector('[name$="name"]').value;
                const role = itemElement.querySelector('[name$="role"]').value;
                const description = itemElement.querySelector('[name$="description"]').value;
                
                const enhancedDescription = await geminiAPI.enhanceProjectDescription(name, role, description);
                itemElement.querySelector('[name$="description"]').value = enhancedDescription;
            } else if (section === 'education') {
                const description = itemElement.querySelector('[name$="description"]').value;
                const institution = itemElement.querySelector('[name$="institution"]').value;
                const degree = itemElement.querySelector('[name$="degree"]').value;
                
                const enhancedDescription = await geminiAPI.enhanceText(description, `Education at ${institution}, ${degree}`);
                itemElement.querySelector('[name$="description"]').value = enhancedDescription;
            } else if (section === 'research') {
                const title = itemElement.querySelector('[name$="title"]').value;
                const journal = itemElement.querySelector('[name$="journal"]').value;
                const description = itemElement.querySelector('[name$="description"]').value;
                
                const enhancedDescription = await geminiAPI.enhanceText(description, `Research paper: ${title} in ${journal}`);
                itemElement.querySelector('[name$="description"]').value = enhancedDescription;
            }

            this.saveToStorage();
            this.showToast('success', i18n.t('status.success.enhanced'));
        } catch (error) {
            console.error('Error enhancing item:', error);
            this.showToast('error', i18n.t('status.error.api'));
        } finally {
            if (enhanceBtn) {
                enhanceBtn.classList.remove('enhancing');
                enhanceBtn.disabled = false;
            }
        }
    }

    setupItemEventListeners(itemElement, section) {
        // Remove button
        const removeBtn = itemElement.querySelector('.remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.removeItem(section, itemElement.id);
            });
        }

        // Enhance button
        const enhanceBtn = itemElement.querySelector('.enhance-btn');
        if (enhanceBtn) {
            enhanceBtn.addEventListener('click', () => {
                this.enhanceItem(section, itemElement.id);
            });
        }
    }

    createEducationTemplate(itemId) {
        const div = document.createElement('div');
        div.className = 'item';
        div.id = itemId;
        
        div.innerHTML = `
            <div class="item-header">
                <span class="item-title" data-i18n="education.title">教育背景</span>
                <div class="item-actions">
                    <button class="icon-button enhance-btn" type="button" data-i18n-title="ai.enhance.item">
                        <span class="material-symbols-outlined">auto_fix_high</span>
                    </button>
                    <button class="icon-button remove-btn" type="button" data-i18n-title="action.remove">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
            <div class="item-content">
                <div class="input-group">
                    <label data-i18n="education.institution">
                        <i class="fas fa-university"></i>
                        学校/机构
                    </label>
                    <input type="text" name="${itemId}_institution" data-i18n-placeholder="education.institution.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="education.degree">
                        <i class="fas fa-graduation-cap"></i>
                        学位/专业
                    </label>
                    <input type="text" name="${itemId}_degree" data-i18n-placeholder="education.degree.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="education.location">
                        <i class="fas fa-map-marker-alt"></i>
                        位置
                    </label>
                    <input type="text" name="${itemId}_location" data-i18n-placeholder="education.location.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="education.start.date">
                        <i class="fas fa-calendar-alt"></i>
                        开始日期
                    </label>
                    <input type="month" name="${itemId}_startDate">
                </div>
                <div class="input-group">
                    <label data-i18n="education.end.date">
                        <i class="fas fa-calendar-check"></i>
                        结束日期
                    </label>
                    <input type="month" name="${itemId}_endDate">
                </div>
                <div class="input-group">
                    <label data-i18n="education.gpa">
                        <i class="fas fa-star"></i>
                        GPA
                    </label>
                    <input type="text" name="${itemId}_gpa" data-i18n-placeholder="education.gpa.placeholder">
                </div>
                <div class="input-group item-description">
                    <label data-i18n="education.description">
                        <i class="fas fa-align-left"></i>
                        描述
                    </label>
                    <textarea name="${itemId}_description" rows="3" data-i18n-placeholder="education.description.placeholder"></textarea>
                </div>
            </div>
        `;
        
        return div;
    }

    createWorkTemplate(itemId) {
        const div = document.createElement('div');
        div.className = 'item';
        div.id = itemId;
        
        div.innerHTML = `
            <div class="item-header">
                <span class="item-title" data-i18n="work.title">工作经历</span>
                <div class="item-actions">
                    <button class="icon-button enhance-btn" type="button" data-i18n-title="ai.enhance.item">
                        <span class="material-symbols-outlined">auto_fix_high</span>
                    </button>
                    <button class="icon-button remove-btn" type="button" data-i18n-title="action.remove">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
            <div class="item-content">
                <div class="input-group">
                    <label data-i18n="work.company">
                        <i class="fas fa-building"></i>
                        公司
                    </label>
                    <input type="text" name="${itemId}_company" data-i18n-placeholder="work.company.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="work.position">
                        <i class="fas fa-briefcase"></i>
                        职位
                    </label>
                    <input type="text" name="${itemId}_position" data-i18n-placeholder="work.position.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="work.location">
                        <i class="fas fa-map-marker-alt"></i>
                        位置
                    </label>
                    <input type="text" name="${itemId}_location" data-i18n-placeholder="work.location.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="work.start.date">
                        <i class="fas fa-calendar-alt"></i>
                        开始日期
                    </label>
                    <input type="month" name="${itemId}_startDate">
                </div>
                <div class="input-group">
                    <label data-i18n="work.end.date">
                        <i class="fas fa-calendar-check"></i>
                        结束日期
                    </label>
                    <input type="month" name="${itemId}_endDate">
                </div>
                <div class="input-group item-description">
                    <label data-i18n="work.description">
                        <i class="fas fa-align-left"></i>
                        工作描述
                    </label>
                    <textarea name="${itemId}_description" rows="4" data-i18n-placeholder="work.description.placeholder"></textarea>
                </div>
            </div>
        `;
        
        return div;
    }

    createProjectTemplate(itemId) {
        const div = document.createElement('div');
        div.className = 'item';
        div.id = itemId;
        
        div.innerHTML = `
            <div class="item-header">
                <span class="item-title" data-i18n="projects.title">项目经历</span>
                <div class="item-actions">
                    <button class="icon-button enhance-btn" type="button" data-i18n-title="ai.enhance.item">
                        <span class="material-symbols-outlined">auto_fix_high</span>
                    </button>
                    <button class="icon-button remove-btn" type="button" data-i18n-title="action.remove">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
            <div class="item-content">
                <div class="input-group">
                    <label data-i18n="projects.name">
                        <i class="fas fa-project-diagram"></i>
                        项目名称
                    </label>
                    <input type="text" name="${itemId}_name" data-i18n-placeholder="projects.name.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="projects.role">
                        <i class="fas fa-user-tag"></i>
                        角色
                    </label>
                    <input type="text" name="${itemId}_role" data-i18n-placeholder="projects.role.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="projects.url">
                        <i class="fas fa-link"></i>
                        项目链接
                    </label>
                    <input type="url" name="${itemId}_url" data-i18n-placeholder="projects.url.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="projects.start.date">
                        <i class="fas fa-calendar-alt"></i>
                        开始日期
                    </label>
                    <input type="month" name="${itemId}_startDate">
                </div>
                <div class="input-group">
                    <label data-i18n="projects.end.date">
                        <i class="fas fa-calendar-check"></i>
                        结束日期
                    </label>
                    <input type="month" name="${itemId}_endDate">
                </div>
                <div class="input-group item-description">
                    <label data-i18n="projects.description">
                        <i class="fas fa-align-left"></i>
                        项目描述
                    </label>
                    <textarea name="${itemId}_description" rows="4" data-i18n-placeholder="projects.description.placeholder"></textarea>
                </div>
            </div>
        `;
        
        return div;
    }

    createResearchTemplate(itemId) {
        const div = document.createElement('div');
        div.className = 'item';
        div.id = itemId;
        
        div.innerHTML = `
            <div class="item-header">
                <span class="item-title" data-i18n="research.title">科研经历</span>
                <div class="item-actions">
                    <button class="icon-button enhance-btn" type="button" data-i18n-title="ai.enhance.item">
                        <span class="material-symbols-outlined">auto_fix_high</span>
                    </button>
                    <button class="icon-button remove-btn" type="button" data-i18n-title="action.remove">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
            <div class="item-content">
                <div class="input-group">
                    <label data-i18n="research.paper.title">
                        <i class="fas fa-file-alt"></i>
                        论文标题
                    </label>
                    <input type="text" name="${itemId}_title" data-i18n-placeholder="research.paper.title.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="research.journal">
                        <i class="fas fa-book-open"></i>
                        期刊/会议
                    </label>
                    <input type="text" name="${itemId}_journal" data-i18n-placeholder="research.journal.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="research.authors">
                        <i class="fas fa-users"></i>
                        作者
                    </label>
                    <input type="text" name="${itemId}_authors" data-i18n-placeholder="research.authors.placeholder">
                </div>
                <div class="input-group">
                    <label data-i18n="research.date">
                        <i class="fas fa-calendar-alt"></i>
                        发表日期
                    </label>
                    <input type="month" name="${itemId}_date">
                </div>
                <div class="input-group">
                    <label data-i18n="research.doi">
                        <i class="fas fa-external-link-alt"></i>
                        DOI/链接
                    </label>
                    <input type="url" name="${itemId}_doi" data-i18n-placeholder="research.doi.placeholder">
                </div>
                <div class="input-group item-description">
                    <label data-i18n="research.description">
                        <i class="fas fa-align-left"></i>
                        研究描述
                    </label>
                    <textarea name="${itemId}_description" rows="4" data-i18n-placeholder="research.description.placeholder"></textarea>
                </div>
            </div>
        `;
        
        return div;
    }

    getDefaultItemData(section) {
        const defaults = {
            education: {
                institution: '',
                degree: '',
                location: '',
                startDate: '',
                endDate: '',
                gpa: '',
                description: ''
            },
            work: {
                company: '',
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                description: ''
            },
            projects: {
                name: '',
                role: '',
                url: '',
                startDate: '',
                endDate: '',
                description: ''
            },
            research: {
                title: '',
                journal: '',
                authors: '',
                date: '',
                doi: '',
                description: ''
            }
        };
        
        return defaults[section] || {};
    }

    collectFormData() {
        console.log('=== 开始收集表单数据 ===');
        
        const data = {
            personal: {},
            education: [],
            work: [],
            projects: [],
            research: [],
            skills: ''
        };

        // Collect personal information
        console.log('收集个人信息...');
        const personalFields = ['name', 'pronouns', 'location', 'email', 'phone', 'github', 'linkedin', 'website', 'orcid'];
        personalFields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                data.personal[field] = input.value.trim();
                console.log(`个人信息 ${field}: "${data.personal[field]}"`);
            } else {
                console.log(`个人信息 ${field}: 元素未找到`);
            }
        });

        // Collect skills
        console.log('收集技能信息...');
        const skillsInput = document.getElementById('skills');
        if (skillsInput) {
            data.skills = skillsInput.value.trim();
            console.log(`技能: "${data.skills}"`);
        } else {
            console.log('技能输入框未找到');
        }

        // Collect dynamic sections
        ['education', 'work', 'projects', 'research'].forEach(section => {
            console.log(`收集${section}数据...`);
            const container = document.getElementById(`${section}-items`);
            if (container) {
                const items = container.querySelectorAll('.item');
                console.log(`找到 ${items.length} 个${section}项目`);
                
                items.forEach((item, index) => {
                    const itemData = {};
                    const inputs = item.querySelectorAll('input, textarea, select');
                    
                    console.log(`处理${section}项目 ${index}，找到 ${inputs.length} 个输入字段`);
                    
                    inputs.forEach(input => {
                        if (input.name) {
                            // 解析name格式：section_index_fieldName -> fieldName
                            // 例如 "education_0_institution" -> "institution"
                            const nameParts = input.name.split('_');
                            if (nameParts.length >= 3) {
                                const fieldName = nameParts.slice(2).join('_'); // 移除前两部分（section_index）
                                itemData[fieldName] = input.value.trim();
                                console.log(`  原始name: "${input.name}" -> 字段名: "${fieldName}" -> 值: "${itemData[fieldName]}"`);
                            } else {
                                console.log(`  名称格式不正确: "${input.name}"`);
                            }
                        } else {
                            console.log('  发现没有name属性的输入字段:', input);
                        }
                    });
                    
                    data[section].push(itemData);
                    console.log(`${section}项目 ${index} 数据:`, itemData);
                });
            } else {
                console.log(`${section}-items 容器未找到`);
            }
        });

        console.log('=== 收集完成，最终数据 ===');
        console.log(JSON.stringify(data, null, 2));
        console.log('=== 数据收集结束 ===');

        this.formData = data;
        return data;
    }

    populateForm(data) {
        // Clear existing items
        ['education', 'work', 'projects', 'research'].forEach(section => {
            const container = document.getElementById(`${section}-items`);
            if (container) {
                container.innerHTML = '';
            }
        });

        // Reset counters
        this.itemCounters = { education: 0, work: 0, projects: 0, research: 0 };

        // Populate personal information
        if (data.personal) {
            Object.keys(data.personal).forEach(field => {
                const input = document.getElementById(field);
                if (input) {
                    input.value = data.personal[field] || '';
                }
            });
        }

        // Populate skills
        if (data.skills) {
            const skillsInput = document.getElementById('skills');
            if (skillsInput) {
                skillsInput.value = data.skills;
            }
        }

        // Populate dynamic sections
        ['education', 'work', 'projects', 'research'].forEach(section => {
            if (data[section] && Array.isArray(data[section]) && data[section].length > 0) {
                data[section].forEach(itemData => {
                    const itemId = `${section}_${this.itemCounters[section]++}`;
                    const itemElement = this.itemTemplates[section].call(this, itemId);
                    
                    // Populate fields
                    Object.keys(itemData).forEach(field => {
                        const input = itemElement.querySelector(`[name="${itemId}_${field}"]`);
                        if (input) {
                            input.value = itemData[field] || '';
                        }
                    });
                    
                    const container = document.getElementById(`${section}-items`);
                    if (container) {
                        container.appendChild(itemElement);
                        this.setupItemEventListeners(itemElement, section);
                    }
                });
            } else {
                // Add default item if no data
                this.addItem(section);
            }
        });

        // Update form data
        this.formData = data;
        
        // Translate new elements
        if (window.i18n) {
            i18n.translatePage();
        }
    }

    saveToStorage() {
        const data = this.collectFormData();
        localStorage.setItem('resume-form-data', JSON.stringify(data));
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('resume-form-data');
            if (saved) {
                const data = JSON.parse(saved);
                this.populateForm(data);
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    clearForm() {
        this.populateForm({
            personal: {},
            education: [],
            work: [],
            projects: [],
            skills: ''
        });
        localStorage.removeItem('resume-form-data');
    }

    updatePlaceholders() {
        // Update all placeholders after language change
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (window.i18n) {
                element.placeholder = i18n.t(key);
            }
        });
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
}

// Create global instance
window.formManager = new FormManager(); 