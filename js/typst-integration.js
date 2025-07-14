// Typst Integration Module
class TypstIntegration {
    constructor() {
        this.isInitialized = false;
        this.compiler = null;
        this.renderer = null;
        this.api = null;
    }

    async init() {
        console.log('开始初始化 Typst.ts...');
        try {
            await this._initializeTypst();
            this.isInitialized = true;
            console.log('Typst integration initialized successfully');
            return true;
        } catch (error) {
            console.error('Typst initialization failed:', error);
            return false;
        }
    }

    async _initializeTypst() {
        // 等待 Typst 模块加载
        await this._waitForTypstLoad();
        
        try {
            // 使用更稳定的 WASM 初始化方式
            const $typst = window.$typst || window.typst || window.TypstCompiler;
            if (!$typst) {
                throw new Error('Typst module not found');
            }

            console.log('找到 Typst 模块，开始初始化...');
            
            // 尝试不同的初始化方法
            if (typeof $typst.initOptions === 'function') {
                // 使用 initOptions 初始化
                const options = $typst.initOptions();
                options.beforeBuild = [$typst.preloadRemoteFonts(['CMU Serif']), $typst.preloadSystemFonts()];
                
                if (typeof $typst.init === 'function') {
                    await $typst.init(options);
                } else if (typeof $typst.initialize === 'function') {
                    await $typst.initialize(options);
                }
            } else if (typeof $typst.init === 'function') {
                // 直接初始化
                await $typst.init();
            }

            this.api = $typst;
            console.log('Typst 模块初始化完成');
            
        } catch (error) {
            console.warn('标准初始化失败，尝试备用方法:', error);
            
            // 备用初始化方法 - 直接使用 API
            const $typst = window.$typst || window.typst || window.TypstCompiler;
            if ($typst) {
                this.api = $typst;
                console.log('使用备用初始化方法成功');
            } else {
                throw new Error('无法找到 Typst API');
            }
        }
    }

    async _waitForTypstLoad() {
        return new Promise((resolve, reject) => {
            const timeout = 30000; // 30秒超时
            let timeoutId;

            const checkTypst = () => {
                const $typst = window.$typst || window.typst || window.TypstCompiler;
                
                if ($typst) {
                    console.log('找到 window.typst 对象');
                    console.log('window.typst 的类型:', typeof $typst);
                    console.log('window.typst 的方法:', Object.getOwnPropertyNames($typst));
                    clearTimeout(timeoutId);
                    resolve();
                    return true;
                }
                return false;
            };

            // 立即检查
            if (checkTypst()) {
                return;
            }

            // 监听加载事件
            const onLoad = () => {
                if (checkTypst()) {
                    clearTimeout(timeoutId);
                    window.removeEventListener('typst-loaded', onLoad);
                    resolve();
                }
            };

            const onFailed = () => {
                clearTimeout(timeoutId);
                window.removeEventListener('typst-load-failed', onFailed);
                window.removeEventListener('typst-loaded', onLoad);
                reject(new Error('Typst.ts 加载失败'));
            };

            window.addEventListener('typst-loaded', onLoad);
            window.addEventListener('typst-load-failed', onFailed);

            // 超时处理
            timeoutId = setTimeout(() => {
                window.removeEventListener('typst-loaded', onLoad);
                window.removeEventListener('typst-load-failed', onFailed);
                
                // 最后一次检查
                if (checkTypst()) {
                    resolve();
                } else {
                    console.log('Typst.ts 全局对象已可用');
                    reject(new Error('等待 Typst.ts 加载超时'));
                }
            }, timeout);
        });
    }

    async compileToSVG(typstContent) {
        console.log('开始编译 Typst 到 SVG...');
        console.log('可用的 Typst API 方法:', Object.getOwnPropertyNames(this.api));
        
        // 调试 API 结构
        for (const [key, value] of Object.entries(this.api)) {
            console.log(`API.${key}:`, typeof value, value);
        }

        try {
            // 尝试多种编译方法
            const methods = [
                () => this._tryCompileSVGMethod1(typstContent),
                () => this._tryCompileSVGMethod2(typstContent),
                () => this._tryCompileSVGMethod3(typstContent),
                () => this._tryCompileSVGMethod4(typstContent)
            ];

            for (let i = 0; i < methods.length; i++) {
                try {
                    console.log(`尝试 SVG 编译方法 ${i + 1}...`);
                    const result = await methods[i]();
                    if (result && result.length > 0) {
                        console.log('SVG 编译成功，长度:', result.length);
                        return result;
                    }
                } catch (error) {
                    console.warn(`SVG 编译方法 ${i + 1} 失败:`, error);
                }
            }

            throw new Error('所有 SVG 编译方法都失败了');
            
        } catch (error) {
            console.error('SVG 编译失败:', error);
            throw error;
        }
    }

    async _tryCompileSVGMethod1(typstContent) {
        console.log('使用 $typst.svg 方法');
        if (this.api.svg) {
            return await this.api.svg({
                mainContent: typstContent,
                fontPaths: [],
                format: 'vector'
            });
        }
        throw new Error('svg 方法不可用');
    }

    async _tryCompileSVGMethod2(typstContent) {
        console.log('使用 createTypstRenderer 方法');
        if (this.api.createTypstRenderer) {
            const renderer = this.api.createTypstRenderer();
            await renderer.init();
            return await renderer.render({
                mainContent: typstContent,
                format: 'svg'
            });
        }
        throw new Error('createTypstRenderer 方法不可用');
    }

    async _tryCompileSVGMethod3(typstContent) {
        console.log('使用 createTypstSvgRenderer 方法');
        if (this.api.createTypstSvgRenderer) {
            const renderer = this.api.createTypstSvgRenderer();
            await renderer.init();
            return await renderer.render(typstContent);
        }
        throw new Error('createTypstSvgRenderer 方法不可用');
    }

    async _tryCompileSVGMethod4(typstContent) {
        console.log('使用 compile 方法（SVG 输出）');
        if (this.api.compile) {
            const result = await this.api.compile(typstContent, {
                format: 'svg',
                vectorize: true
            });
            return result.svg || result;
        }
        throw new Error('compile 方法不可用');
    }

    async compileToPDF(typstContent) {
        console.log('开始编译 Typst 到 PDF...');
        console.log('可用的 Typst API 方法:', Object.getOwnPropertyNames(this.api));
        
        try {
            // 尝试多种 PDF 编译方法
            const methods = [
                () => this._tryCompilePDFMethod1(typstContent),
                () => this._tryCompilePDFMethod2(typstContent),
                () => this._tryCompilePDFMethod3(typstContent),
                () => this._tryCompilePDFMethod4(typstContent)
            ];

            for (let i = 0; i < methods.length; i++) {
                try {
                    console.log(`尝试 PDF 编译方法 ${i + 1}...`);
                    const result = await methods[i]();
                    if (result && result.length > 0) {
                        console.log('PDF 编译成功，字节数:', result.length);
                        return result;
                    }
                } catch (error) {
                    console.warn(`PDF 编译方法 ${i + 1} 失败:`, error);
                }
            }

            throw new Error('所有 PDF 编译方法都失败了');
            
        } catch (error) {
            console.error('PDF 编译失败:', error);
            throw error;
        }
    }

    async _tryCompilePDFMethod1(typstContent) {
        console.log('使用 $typst.pdf 方法');
        if (this.api.pdf) {
            return await this.api.pdf({
                mainContent: typstContent,
                fontPaths: []
            });
        }
        throw new Error('pdf 方法不可用');
    }

    async _tryCompilePDFMethod2(typstContent) {
        console.log('使用 createTypstCompiler 方法');
        if (this.api.createTypstCompiler) {
            const compiler = this.api.createTypstCompiler();
            await compiler.init();
            const result = await compiler.compile({
                mainContent: typstContent,
                format: 'pdf'
            });
            return result.pdf || result;
        }
        throw new Error('createTypstCompiler 方法不可用');
    }

    async _tryCompilePDFMethod3(typstContent) {
        console.log('使用 compile 方法（PDF 输出）');
        if (this.api.compile) {
            const result = await this.api.compile(typstContent, {
                format: 'pdf'
            });
            return result.pdf || result;
        }
        throw new Error('compile 方法不可用');
    }

    async _tryCompilePDFMethod4(typstContent) {
        console.log('使用默认编译器');
        if (this.api.default && this.api.default.compile) {
            return await this.api.default.compile(typstContent);
        }
        throw new Error('默认编译器不可用');
    }

    async compileToVectorFormat(typstContent) {
        try {
            // 首先尝试 SVG
            const svg = await this.compileToSVG(typstContent);
            return {
                format: 'svg',
                content: svg
            };
        } catch (svgError) {
            console.warn('SVG 编译失败，尝试 PDF:', svgError);
            try {
                // 如果 SVG 失败，尝试 PDF
                const pdf = await this.compileToPDF(typstContent);
                return {
                    format: 'pdf',
                    content: pdf
                };
            } catch (pdfError) {
                console.error('PDF 编译也失败:', pdfError);
                throw new Error('所有向量格式编译都失败了');
            }
        }
    }

    generateTypstCode(data) {
        console.log('生成 Typst 代码...');
        
        const { personal, education = [], work = [], projects = [], research = [], skills = '' } = data;
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const isEnglish = currentLang === 'en-US';
        
        let typstCode = `#set document(
    title: "${this.escapeTypst(personal.name || '')}",
    author: "${this.escapeTypst(personal.name || '')}",
)

#set page(
    paper: "a4",
    margin: (x: 72pt, y: 72pt),
)

#set text(
    font: "New Computer Modern",
    size: 11pt,
    lang: "${isEnglish ? 'en' : 'zh'}",
)

// Define icon variables using Typst built-in symbols
#let person-icon = sym.person
#let location-icon = sym.pin
#let email-icon = sym.envelope
#let phone-icon = sym.phone
#let github-icon = "⚬" // Simple bullet as placeholder for GitHub
#let linkedin-icon = "◦" // Simple bullet as placeholder for LinkedIn  
#let web-icon = sym.world
#let education-icon = sym.mortarboard
#let work-icon = sym.briefcase
#let project-icon = sym.diagram
#let skills-icon = sym.gear
#let research-icon = sym.atom
#let paper-icon = sym.quote
#let journal-icon = sym.book
#let author-icon = sym.person.multiple
#let date-icon = sym.calendar
#let university-icon = sym.building
#let star-icon = sym.star
#let building-icon = sym.building
#let tag-icon = sym.tag
#let link-icon = sym.link

#let name = "${this.escapeTypst(personal.name || '')}"
#let pronouns = "${this.escapeTypst(personal.pronouns || '')}"
#let location = "${this.escapeTypst(personal.location || '')}"
#let email = "${this.escapeTypst(personal.email || '')}"
#let phone = "${this.escapeTypst(personal.phone || '')}"
#let github = "${this.escapeTypst(personal.github || '')}"
#let linkedin = "${this.escapeTypst(personal.linkedin || '')}"
#let website = "${this.escapeTypst(personal.website || '')}"

// Header
#align(center)[
  #text(24pt, weight: "bold")[#person-icon #name]
  #if pronouns != "" [ (#pronouns) ]
]

#align(center)[
  #if location != "" [#location-icon #location] 
  #if email != "" [• #email-icon #link("mailto:" + email)[#email]]
  #if phone != "" [• #phone-icon #phone]
]

#align(center)[
  #if github != "" [#github-icon #link("https://" + github)[GitHub]] 
  #if linkedin != "" [• #linkedin-icon #link("https://" + linkedin)[LinkedIn]]
  #if website != "" [• #web-icon #link(website)[Website]]
]

#line(length: 100%)

`;

        // 生成各个部分
        if (education.length > 0) {
            typstCode += this.generateEducationSection(education);
        }

        if (work.length > 0) {
            typstCode += this.generateWorkSection(work);
        }

        if (projects.length > 0) {
            typstCode += this.generateProjectsSection(projects);
        }

        // Research
        if (data.research && data.research.length > 0 && data.research.some(p => p.title || p.journal)) {
            typstCode += this.generateResearchSection(data.research);
        }

        // Skills
        if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
            typstCode += this.generateSkillsSection(data.skills);
        }

        // Closing
        typstCode += `
#v(20pt)
`;

        console.log('Typst 代码生成完成');
        return typstCode;
    }

    generateEducationSection(education) {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const title = currentLang === 'en-US' ? 'Education' : '教育背景';
        let section = `\n// Education\n#text(16pt, weight: "bold")[#education-icon ${title}]\n#line(length: 100%)\n`;
        
        for (const edu of education) {
            section += `
#grid(
    columns: (1fr, auto),
    [#university-icon *${this.escapeTypst(edu.institution || '')}*],
    [#date-icon ${this.escapeTypst(edu.startDate || '')} -- ${this.escapeTypst(edu.endDate || '')}]
)
#text(style: "italic")[#education-icon ${this.escapeTypst(edu.degree || '')}]
#if "${this.escapeTypst(edu.location || '')}" != "" [• #location-icon ${this.escapeTypst(edu.location || '')}]
#if "${this.escapeTypst(edu.gpa || '')}" != "" [• #star-icon GPA: ${this.escapeTypst(edu.gpa || '')}]

#text(size: 10pt, weight: "light")[#par[${this.escapeTypst(edu.description || '')}]]
`;
        }
        
        return section;
    }

    generateWorkSection(work) {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const title = currentLang === 'en-US' ? 'Work Experience' : '工作经历';
        let section = `\n// Work Experience\n#text(16pt, weight: "bold")[#work-icon ${title}]\n#line(length: 100%)\n`;
        
        for (const job of work) {
            section += `
#grid(
    columns: (1fr, auto),
    [#work-icon *${this.escapeTypst(job.position || '')}* at #building-icon ${this.escapeTypst(job.company || '')}],
    [#date-icon ${this.escapeTypst(job.startDate || '')} -- ${this.escapeTypst(job.endDate || '')}]
)
#if "${this.escapeTypst(job.location || '')}" != "" [#location-icon ${this.escapeTypst(job.location || '')}]

#text(size: 10pt, weight: "light")[#par[${this.escapeTypst(job.description || '')}]]
`;
        }
        
        return section;
    }

    generateProjectsSection(projects) {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const title = currentLang === 'en-US' ? 'Projects' : '项目经历';
        let section = `\n// Projects\n#text(16pt, weight: "bold")[#project-icon ${title}]\n#line(length: 100%)\n`;
        
        for (const project of projects) {
            section += `
#grid(
    columns: (1fr, auto),
    [#project-icon *${this.escapeTypst(project.name || '')}* - #tag-icon ${this.escapeTypst(project.role || '')}],
    [#date-icon ${this.escapeTypst(project.startDate || '')} -- ${this.escapeTypst(project.endDate || '')}]
)
#if "${this.escapeTypst(project.url || '')}" != "" [#link-icon #link("${this.escapeTypst(project.url || '')}")[${this.escapeTypst(project.url || '')}]]

#text(size: 10pt, weight: "light")[#par[${this.escapeTypst(project.description || '')}]]
`;
        }
        
        return section;
    }

    generateResearchSection(research) {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const title = currentLang === 'en-US' ? 'Research & Publications' : '科研经历';
        let section = `\n// Research\n#text(16pt, weight: "bold")[#research-icon ${title}]\n#line(length: 100%)\n`;
        
        for (const paper of research) {
            section += `
#grid(
    columns: (1fr, auto),
    [#paper-icon *${this.escapeTypst(paper.title || '')}*],
    [#date-icon ${this.escapeTypst(paper.date || '')}]
)
#if "${this.escapeTypst(paper.journal || '')}" != "" [#journal-icon ${this.escapeTypst(paper.journal || '')}]
#if "${this.escapeTypst(paper.authors || '')}" != "" [#author-icon ${this.escapeTypst(paper.authors || '')}]
#if "${this.escapeTypst(paper.doi || '')}" != "" [#link-icon #link("${this.escapeTypst(paper.doi || '')}")[${this.escapeTypst(paper.doi || '')}]]

#text(size: 10pt, weight: "light")[#par[${this.escapeTypst(paper.description || '')}]]
`;
        }
        
        return section;
    }

    generateSkillsSection(skills) {
        if (!skills || skills.length === 0) {
            return '';
        }
    
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const title = currentLang === 'en-US' ? 'Skills' : '技能特长';
        let section = `
// Skills
#text(16pt, weight: "bold")[#skills-icon ${title}]
#line(length: 100%)
`;
        
        const sections = skills.map(category => {
            const hasItems = category.items && Array.isArray(category.items) && category.items.some(i => i && i.trim());
            if (!hasItems) return '';
    
            const filteredItems = category.items
                .map(item => this.escapeTypst(item.trim()))
                .filter(Boolean);
            
            if (filteredItems.length === 0) return '';
    
            if (category.category && category.category.trim()) {
                const categoryText = this.escapeTypst(category.category.trim());
                const itemsText = filteredItems.join(', ');
                return `#text(size: 9pt)[#tag-icon *${categoryText}:* ${itemsText}]`;
            } else {
                const itemsList = filteredItems.join(', ');
                return `#text(size: 9pt)[${itemsList}]`;
            }
        }).filter(Boolean);
    
        if (sections.length > 0) {
            section += sections.join('\\n#v(2pt)\\n');
        }
    
        return section;
    }

    escapeTypst(str) {
        if (!str) return '';
        return str.toString()
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\[/g, '\\[')
            .replace(/\]/g, '\\]')
            .replace(/#/g, '\\#');
    }

    downloadPDF(pdfData, filename = 'resume.pdf') {
        try {
            let blob;
            if (pdfData instanceof Uint8Array) {
                blob = new Blob([pdfData], { type: 'application/pdf' });
            } else if (pdfData instanceof ArrayBuffer) {
                blob = new Blob([new Uint8Array(pdfData)], { type: 'application/pdf' });
            } else {
                throw new Error('不支持的 PDF 数据格式');
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('PDF 下载失败:', error);
            throw error;
        }
    }

    displaySVG(svgContent, containerId) {
        const container = document.getElementById(containerId);
        if (container && svgContent) {
            container.innerHTML = svgContent;
            container.scrollTop = 0;
        }
    }

    displayHTML(htmlContent, containerId) {
        const container = document.getElementById(containerId);
        if (container && htmlContent) {
            container.innerHTML = htmlContent;
            container.scrollTop = 0;
        }
    }
}

// 创建全局实例
window.typstIntegration = new TypstIntegration();

// 导出用于其他模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TypstIntegration;
} 