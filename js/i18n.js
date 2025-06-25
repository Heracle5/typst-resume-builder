// Internationalization Module
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'zh-CN';
        this.translations = {
            'zh-CN': {
                // App title and navigation
                'app.title': '简历生成器',
                'nav.language': '切换语言',
                'nav.theme': '切换主题',
                'nav.help': '帮助',
                
                // Language dialog
                'dialog.language.title': '选择语言',
                'dialog.language.chinese': '简体中文',
                'dialog.language.english': 'English',
                
                // AI Assistant
                'ai.title': 'AI 助手',
                'ai.apikey': 'Gemini API Key',
                'ai.apikey.placeholder': '输入您的 Gemini API Key',
                'ai.generate.sample': '生成示例数据',
                'ai.enhance.all': '润色所有内容',
                'ai.enhance.item': '润色此项',
                
                // Personal Information
                'personal.title': '个人信息',
                'personal.name': '姓名',
                'personal.name.required': '姓名 *',
                'personal.pronouns': '代词',
                'personal.pronouns.placeholder': '他/她/他们',
                'personal.location': '位置',
                'personal.location.placeholder': '城市, 国家',
                'personal.email': '邮箱',
                'personal.phone': '电话',
                'personal.github': 'GitHub',
                'personal.github.placeholder': 'github.com/username',
                'personal.linkedin': 'LinkedIn',
                'personal.linkedin.placeholder': 'linkedin.com/in/username',
                'personal.website': '个人网站',
                'personal.orcid': 'ORCID',
                'personal.orcid.placeholder': '0000-0000-0000-0000',
                
                // Education
                'education.title': '教育背景',
                'education.institution': '学校/机构',
                'education.institution.placeholder': '大学名称',
                'education.degree': '学位/专业',
                'education.degree.placeholder': '学士/硕士/博士 专业名称',
                'education.location': '位置',
                'education.location.placeholder': '城市, 国家',
                'education.start.date': '开始日期',
                'education.end.date': '结束日期',
                'education.gpa': 'GPA',
                'education.gpa.placeholder': '3.8/4.0',
                'education.description': '描述',
                'education.description.placeholder': '相关课程、荣誉、活动等',
                
                // Work Experience
                'work.title': '工作经历',
                'work.company': '公司',
                'work.company.placeholder': '公司名称',
                'work.position': '职位',
                'work.position.placeholder': '职位名称',
                'work.location': '位置',
                'work.location.placeholder': '城市, 国家',
                'work.start.date': '开始日期',
                'work.end.date': '结束日期',
                'work.description': '工作描述',
                'work.description.placeholder': '详细描述您的工作职责和成就',
                
                // Projects
                'projects.title': '项目经历',
                'projects.name': '项目名称',
                'projects.name.placeholder': '项目名称',
                'projects.role': '角色',
                'projects.role.placeholder': '您在项目中的角色',
                'projects.url': '项目链接',
                'projects.url.placeholder': 'github.com/username/project',
                'projects.start.date': '开始日期',
                'projects.end.date': '结束日期',
                'projects.description': '项目描述',
                'projects.description.placeholder': '项目详情、使用的技术、您的贡献等',
                
                // Research/Publications
                'research.title': '科研经历',
                'research.title.alt': '发表论文',
                'research.paper.title': '论文标题',
                'research.paper.title.placeholder': '论文或研究项目标题',
                'research.journal': '期刊/会议',
                'research.journal.placeholder': '发表期刊或会议名称',
                'research.authors': '作者',
                'research.authors.placeholder': '作者列表，用逗号分隔',
                'research.date': '发表日期',
                'research.doi': 'DOI/链接',
                'research.doi.placeholder': 'DOI或论文链接',
                'research.description': '研究描述',
                'research.description.placeholder': '研究内容、方法、贡献等',
                
                // Skills
                'skills.title': '技能特长',
                'skills.list': '技能列表',
                'skills.placeholder': '请用逗号分隔各项技能，或每行一个技能',
                
                // Actions
                'action.add': '添加',
                'action.remove': '删除',
                'action.edit': '编辑',
                'action.enhance': '润色',
                'action.generate': '生成简历',
                'action.download': '下载 PDF',
                'action.close': '关闭',
                
                // Preview
                'preview.title': '预览',
                'preview.placeholder': '点击"生成简历"查看预览',
                
                // Status messages
                'status.generating': '正在生成简历...',
                'status.enhancing': '正在润色内容...',
                'status.loading': '加载中...',
                'status.success.generated': '简历生成成功！',
                'status.success.enhanced': '内容润色完成！',
                'status.success.downloaded': 'PDF 下载成功！',
                'status.error.api': 'API 调用失败，请检查您的 API Key',
                'status.error.generation': '简历生成失败',
                'status.error.network': '网络连接错误',
                'status.error.required': '请填写必填字段',
                'status.error.validation': '请填写姓名并至少完成一个教育、工作或项目经历部分',
                'status.error.typst.init': 'Typst 编译器初始化失败',
                'status.error.display': '预览显示失败',
                'status.error.no.pdf': '没有 PDF 可供下载',
                'status.error.download': 'PDF 下载失败',
                'status.error.sample': '示例数据生成失败',
                'status.generating.sample': '正在生成示例数据...',
                'status.enhancing.all': '正在润色所有内容...',
                'status.success.sample': '示例数据生成成功！',
                'status.success.enhanced.all': '所有内容润色完成！',
                'status.error.enhance.all': '内容润色失败',
                
                // Dates
                'date.present': '至今',
                'date.format': 'YYYY年MM月',
                
                // Common
                'common.required': '必填',
                'common.optional': '可选',
                'common.cancel': '取消',
                'common.confirm': '确认',
                'common.save': '保存',
                'common.loading': '加载中...',
                'common.error': '错误',
                'common.success': '成功',
                'common.warning': '警告',
                'common.info': '信息'
            },
            'en-US': {
                // App title and navigation
                'app.title': 'Resume Generator',
                'nav.language': 'Switch Language',
                'nav.theme': 'Switch Theme',
                'nav.help': 'Help',
                
                // Language dialog
                'dialog.language.title': 'Select Language',
                'dialog.language.chinese': '简体中文',
                'dialog.language.english': 'English',
                
                // AI Assistant
                'ai.title': 'AI Assistant',
                'ai.apikey': 'Gemini API Key',
                'ai.apikey.placeholder': 'Enter your Gemini API Key',
                'ai.generate.sample': 'Generate Sample Data',
                'ai.enhance.all': 'Enhance All Content',
                'ai.enhance.item': 'Enhance This Item',
                
                // Personal Information
                'personal.title': 'Personal Information',
                'personal.name': 'Name',
                'personal.name.required': 'Name *',
                'personal.pronouns': 'Pronouns',
                'personal.pronouns.placeholder': 'he/she/they',
                'personal.location': 'Location',
                'personal.location.placeholder': 'City, Country',
                'personal.email': 'Email',
                'personal.phone': 'Phone',
                'personal.github': 'GitHub',
                'personal.github.placeholder': 'github.com/username',
                'personal.linkedin': 'LinkedIn',
                'personal.linkedin.placeholder': 'linkedin.com/in/username',
                'personal.website': 'Website',
                'personal.orcid': 'ORCID',
                'personal.orcid.placeholder': '0000-0000-0000-0000',
                
                // Education
                'education.title': 'Education',
                'education.institution': 'Institution',
                'education.institution.placeholder': 'University Name',
                'education.degree': 'Degree/Major',
                'education.degree.placeholder': 'Bachelor\'s/Master\'s/PhD in Major',
                'education.location': 'Location',
                'education.location.placeholder': 'City, Country',
                'education.start.date': 'Start Date',
                'education.end.date': 'End Date',
                'education.gpa': 'GPA',
                'education.gpa.placeholder': '3.8/4.0',
                'education.description': 'Description',
                'education.description.placeholder': 'Relevant coursework, honors, activities, etc.',
                
                // Work Experience
                'work.title': 'Work Experience',
                'work.company': 'Company',
                'work.company.placeholder': 'Company Name',
                'work.position': 'Position',
                'work.position.placeholder': 'Job Title',
                'work.location': 'Location',
                'work.location.placeholder': 'City, Country',
                'work.start.date': 'Start Date',
                'work.end.date': 'End Date',
                'work.description': 'Job Description',
                'work.description.placeholder': 'Describe your responsibilities and achievements',
                
                // Projects
                'projects.title': 'Projects',
                'projects.name': 'Project Name',
                'projects.name.placeholder': 'Project Name',
                'projects.role': 'Role',
                'projects.role.placeholder': 'Your role in the project',
                'projects.url': 'Project URL',
                'projects.url.placeholder': 'github.com/username/project',
                'projects.start.date': 'Start Date',
                'projects.end.date': 'End Date',
                'projects.description': 'Project Description',
                'projects.description.placeholder': 'Project details, technologies used, your contributions, etc.',
                
                // Research/Publications
                'research.title': 'Research & Publications',
                'research.title.alt': 'Publications',
                'research.paper.title': 'Paper Title',
                'research.paper.title.placeholder': 'Paper or research project title',
                'research.journal': 'Journal/Conference',
                'research.journal.placeholder': 'Published journal or conference name',
                'research.authors': 'Authors',
                'research.authors.placeholder': 'Author list, separated by commas',
                'research.date': 'Publication Date',
                'research.doi': 'DOI/Link',
                'research.doi.placeholder': 'DOI or paper link',
                'research.description': 'Research Description',
                'research.description.placeholder': 'Research content, methods, contributions, etc.',
                
                // Skills
                'skills.title': 'Skills',
                'skills.list': 'Skills List',
                'skills.placeholder': 'Separate skills with commas, or one skill per line',
                
                // Actions
                'action.add': 'Add',
                'action.remove': 'Remove',
                'action.edit': 'Edit',
                'action.enhance': 'Enhance',
                'action.generate': 'Generate Resume',
                'action.download': 'Download PDF',
                'action.close': 'Close',
                
                // Preview
                'preview.title': 'Preview',
                'preview.placeholder': 'Click "Generate Resume" to see preview',
                
                // Status messages
                'status.generating': 'Generating resume...',
                'status.enhancing': 'Enhancing content...',
                'status.loading': 'Loading...',
                'status.success.generated': 'Resume generated successfully!',
                'status.success.enhanced': 'Content enhanced successfully!',
                'status.success.downloaded': 'PDF downloaded successfully!',
                'status.error.api': 'API call failed, please check your API Key',
                'status.error.generation': 'Resume generation failed',
                'status.error.network': 'Network connection error',
                'status.error.required': 'Please fill in required fields',
                'status.error.validation': 'Please fill in your name and complete at least one education, work, or project section',
                'status.error.typst.init': 'Typst compiler initialization failed',
                'status.error.display': 'Preview display failed',
                'status.error.no.pdf': 'No PDF available for download',
                'status.error.download': 'PDF download failed',
                'status.error.sample': 'Sample data generation failed',
                'status.generating.sample': 'Generating sample data...',
                'status.enhancing.all': 'Enhancing all content...',
                'status.success.sample': 'Sample data generated successfully!',
                'status.success.enhanced.all': 'All content enhanced successfully!',
                'status.error.enhance.all': 'Content enhancement failed',
                
                // Dates
                'date.present': 'Present',
                'date.format': 'MM/YYYY',
                
                // Common
                'common.required': 'Required',
                'common.optional': 'Optional',
                'common.cancel': 'Cancel',
                'common.confirm': 'Confirm',
                'common.save': 'Save',
                'common.loading': 'Loading...',
                'common.error': 'Error',
                'common.success': 'Success',
                'common.warning': 'Warning',
                'common.info': 'Info'
            }
        };
        
        this.init();
    }
    
    init() {
        this.updatePageLanguage();
        document.addEventListener('DOMContentLoaded', () => {
            this.translatePage();
        });
    }
    
    t(key, params = {}) {
        let translation = this.translations[this.currentLang][key] || key;
        
        // Replace parameters in translation
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });
        
        return translation;
    }
    
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.updatePageLanguage();
            this.translatePage();
            
            // Trigger custom event
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: lang }
            }));
        }
    }
    
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    updatePageLanguage() {
        document.documentElement.lang = this.currentLang;
    }
    
    translatePage() {
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type === 'submit' || element.type === 'button') {
                    element.value = translation;
                } else {
                    element.placeholder = translation;
                }
            } else {
                element.textContent = translation;
            }
        });
        
        // Translate elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // Translate elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
        
        // Translate elements with data-i18n-aria-label attribute
        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            element.setAttribute('aria-label', this.t(key));
        });
    }
    
    formatDate(date, format = 'date.format') {
        if (!date) return '';
        
        const dateObj = new Date(date);
        const formatStr = this.t(format);
        
        if (this.currentLang === 'zh-CN') {
            return `${dateObj.getFullYear()}年${(dateObj.getMonth() + 1).toString().padStart(2, '0')}月`;
        } else {
            return `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        }
    }
    
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }
}

// Create global instance
window.i18n = new I18n(); 