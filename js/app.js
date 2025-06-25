// Main Application Entry Point
class App {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('Initializing Typst Resume Generator...');
        
        // Initialize theme
        this.loadTheme();
        
        // Initialize language
        this.initializeLanguage();
        
        // Setup global event listeners
        this.setupGlobalEventListeners();
        
        // Initialize form items after everything is loaded
        setTimeout(() => {
            this.initializeFormItems();
        }, 100);
        
        console.log('Application initialized successfully');
    }

    initializeLanguage() {
        // Initialize i18n system
        if (window.i18n) {
            i18n.init();
            // Translate the page after initialization
            setTimeout(() => {
                i18n.translatePage();
            }, 50);
        }
    }

    initializeFormItems() {
        // Initialize default form items if none exist
        ['education', 'work', 'projects'].forEach(section => {
            const container = document.getElementById(`${section}-items`);
            if (container && container.children.length === 0) {
                formManager.addItem(section);
            }
        });
    }

    setupGlobalEventListeners() {
        // Theme toggle
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Language toggle
        const languageBtn = document.getElementById('language-btn');
        if (languageBtn) {
            languageBtn.addEventListener('click', () => {
                this.showLanguageDialog();
            });
        }

        // Help button
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelp();
            });
        }

        // Language dialog
        this.setupLanguageDialog();

        // Global keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Window cleanup
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    setupLanguageDialog() {
        const backdrop = document.getElementById('language-dialog-backdrop');
        const closeBtn = backdrop?.querySelector('.close-dialog');
        const languageOptions = backdrop?.querySelectorAll('.language-option');

        // Close dialog
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideLanguageDialog();
            });
        }

        // Click backdrop to close
        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.hideLanguageDialog();
                }
            });
        }

        // Language selection
        if (languageOptions) {
            languageOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const lang = option.getAttribute('data-lang');
                    this.changeLanguage(lang);
                    this.hideLanguageDialog();
                });
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + G: Generate resume
            if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
                e.preventDefault();
                if (window.resumeGenerator) {
                    resumeGenerator.generateResume();
                }
            }

            // Ctrl/Cmd + D: Download PDF
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                if (window.resumeGenerator) {
                    resumeGenerator.downloadPDF();
                }
            }

            // Ctrl/Cmd + L: Toggle language
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                this.showLanguageDialog();
            }

            // Ctrl/Cmd + T: Toggle theme
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }

            // Escape: Close dialogs
            if (e.key === 'Escape') {
                this.closeAllDialogs();
            }
        });
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('app-theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);

        // Update theme button icon
        const themeBtn = document.getElementById('theme-btn');
        const icon = themeBtn?.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
        }

        // Update theme button aria-label
        if (themeBtn) {
            const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
            const label = theme === 'light' ? 
                (currentLang === 'zh-CN' ? '切换到深色模式' : 'Switch to dark mode') :
                (currentLang === 'zh-CN' ? '切换到浅色模式' : 'Switch to light mode');
            themeBtn.setAttribute('aria-label', label);
        }
    }

    showLanguageDialog() {
        const backdrop = document.getElementById('language-dialog-backdrop');
        if (backdrop) {
            backdrop.classList.add('show');
            
            // Focus first language option for accessibility
            const firstOption = backdrop.querySelector('.language-option');
            if (firstOption) {
                firstOption.focus();
            }
        }
    }

    hideLanguageDialog() {
        const backdrop = document.getElementById('language-dialog-backdrop');
        if (backdrop) {
            backdrop.classList.remove('show');
        }
    }

    changeLanguage(lang) {
        if (window.i18n) {
            i18n.setLanguage(lang);
            
            // Update document language
            document.documentElement.lang = lang;
            
            // Update page title
            const title = i18n.t('app.title');
            document.title = title;
            
            // Update app title in header
            const appTitle = document.querySelector('.app-title');
            if (appTitle) {
                const titleText = appTitle.lastChild;
                if (titleText && titleText.nodeType === Node.TEXT_NODE) {
                    titleText.textContent = title;
                }
            }
            
            // Dispatch language change event
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }
    }

    showHelp() {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        
        const helpContent = {
            'zh-CN': `
# Typst 简历生成器 使用帮助

## 快速开始
1. 填写个人信息（姓名为必填项）
2. 添加教育背景、工作经历或项目经历
3. 点击"生成简历"按钮
4. 在右侧预览并下载PDF

## AI 助手功能
- **API Key**: 输入您的 Gemini API Key 启用 AI 功能
- **生成示例数据**: 快速生成完整的简历模板
- **润色内容**: 使用 AI 优化您的简历描述

## 快捷键
- Ctrl/Cmd + G: 生成简历
- Ctrl/Cmd + D: 下载PDF
- Ctrl/Cmd + L: 切换语言
- Ctrl/Cmd + T: 切换主题
- ESC: 关闭对话框

## 技巧
- 数据会自动保存到本地存储
- 支持多页简历
- 可以为每个经历项目单独润色
- 支持响应式设计，适配各种设备
            `,
            'en-US': `
# Typst Resume Generator Help

## Quick Start
1. Fill in personal information (name is required)
2. Add education, work experience, or projects
3. Click "Generate Resume" button
4. Preview and download PDF on the right panel

## AI Assistant Features
- **API Key**: Enter your Gemini API Key to enable AI features
- **Generate Sample Data**: Quickly create a complete resume template
- **Enhance Content**: Use AI to optimize your resume descriptions

## Keyboard Shortcuts
- Ctrl/Cmd + G: Generate resume
- Ctrl/Cmd + D: Download PDF
- Ctrl/Cmd + L: Switch language
- Ctrl/Cmd + T: Toggle theme
- ESC: Close dialogs

## Tips
- Data is automatically saved to local storage
- Supports multi-page resumes
- Individual item enhancement available
- Responsive design for all devices
            `
        };
        
        this.showInfoDialog(
            currentLang === 'zh-CN' ? '使用帮助' : 'Help',
            helpContent[currentLang]
        );
    }

    showInfoDialog(title, content) {
        // Create modal dialog for help/info
        const backdrop = document.createElement('div');
        backdrop.className = 'dialog-backdrop show';
        backdrop.innerHTML = `
            <div class="dialog" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <div class="dialog-header">
                    <h3>${title}</h3>
                    <button class="icon-button close-dialog">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="dialog-content">
                    <div style="white-space: pre-wrap; line-height: 1.6;">${content}</div>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);

        // Setup close handlers
        const closeBtn = backdrop.querySelector('.close-dialog');
        closeBtn.addEventListener('click', () => {
            backdrop.remove();
        });

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.remove();
            }
        });

        // Close on escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                backdrop.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    closeAllDialogs() {
        // Close language dialog
        this.hideLanguageDialog();
        
        // Close any info dialogs
        const infoDialogs = document.querySelectorAll('.dialog-backdrop:not(#language-dialog-backdrop)');
        infoDialogs.forEach(dialog => {
            dialog.remove();
        });
    }

    cleanup() {
        // Cleanup when page is unloaded
        if (window.resumeGenerator) {
            resumeGenerator.cleanup();
        }
    }

    // Error handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const message = currentLang === 'zh-CN' ? 
            `发生错误: ${error.message}` : 
            `Error occurred: ${error.message}`;
            
        if (window.resumeGenerator) {
            resumeGenerator.showToast('error', message);
        }
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Initialize the application
window.app = new App(); 