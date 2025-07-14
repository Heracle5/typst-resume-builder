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
                'dialog.language.japanese': '日本語',
                
                // Help Dialog
                'dialog.help.title': '帮助',
                'dialog.help.gettingStarted.title': '🚀 快速入门',
                'dialog.help.gettingStarted.p1': '欢迎使用 Typst 简历生成器！只需几分钟，即可获得您的专业简历：',
                'dialog.help.gettingStarted.li1': '<strong>填写信息：</strong> 在左侧表单中填写您的信息。根据需要添加、删除和重新排序各个部分。',
                'dialog.help.gettingStarted.li2': '<strong>使用 AI 助手（可选）：</strong>',
                'dialog.help.gettingStarted.li2_1': '输入您的 Gemini API 密钥。该密钥仅存储在您的浏览器本地，绝不会发送到我们的服务器。',
                'dialog.help.gettingStarted.li2_2': '点击 <strong>生成示例数据</strong> 查看一个完整的示例。',
                'dialog.help.gettingStarted.li2_3': '点击 <strong>润色所有内容</strong>，让 AI 优化您的文字，并根据您的经历自动生成技能列表。您也可以使用 ✨ 图标单独润色每个部分。',
                'dialog.help.gettingStarted.li3': '<strong>生成简历：</strong> 点击 <strong>生成简历</strong> 按钮。右侧将显示预览。',
                'dialog.help.gettingStarted.li4': '<strong>下载 PDF：</strong> 对预览满意后，点击 <strong>下载 PDF</strong>。',
                'dialog.help.offline.title': '🌐 离线模式和 HTML 后备',
                'dialog.help.offline.p1': '本应用使用 <a href="https://github.com/typst/typst" target="_blank">Typst</a>，一个现代的排版系统，来创建精美的 PDF。核心的 Typst 引擎通过 WebAssembly 在您的浏览器中运行。',
                'dialog.help.offline.p2': '如果 Typst 引擎加载失败（例如，由于网络问题），应用将切换到 <strong>HTML 后备模式</strong>。您仍然可以看到简历的预览，并可以通过浏览器的“打印到 PDF”功能进行“下载”。我们添加了专门的样式以确保打印出的 PDF 干净、专业。',
                'dialog.help.privacy.title': '🔒 隐私保护',
                'dialog.help.privacy.p1': '我们非常重视您的隐私。所有的简历数据和您的 API 密钥都 <strong>仅存储在您浏览器的本地存储中</strong>。任何信息都不会被发送或存储在服务器上。',
                'dialog.help.shortcuts.title': '⌨️ 键盘快捷键',
                'dialog.help.shortcuts.li1': '<code class="shortcut">Ctrl/Cmd + S</code>: 手动保存表单数据。',
                'dialog.help.shortcuts.li2': '<code class="shortcut">Ctrl/Cmd + Enter</code>: 生成简历。',
                'dialog.help.shortcuts.li3': '<code class="shortcut">Esc</code>: 关闭所有打开的对话框。',

                // AI Assistant
                'ai.title': 'AI 助手',
                'ai.apikey': 'Gemini API Key',
                'ai.apikey.placeholder': '输入您的 Gemini API Key',
                'ai.job_description': '职位描述 (可选)',
                'ai.job_description.placeholder': '在此处粘贴职位描述或公司简介，以生成更具针对性的内容。',
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
                'research.paper.title.placeholder': '例如: "A Neural Network Approach to..."',
                'research.journal': '期刊/会议',
                'research.journal.placeholder': '例如: "NeurIPS 2024"',
                'research.authors': '作者',
                'research.authors.placeholder': '例如: "张三, 李四"',
                'research.date': '发表日期',
                'research.doi': 'DOI/链接',
                'research.doi.placeholder': '例如: "https://doi.org/..."',
                'research.description': '研究描述',
                'research.description.placeholder': '例如: 负责数据分析和模型验证，发现关键见解。',
                
                // Skills
                'skills.title': '技能特长',
                'skills.category.placeholder': '输入分类名 (例如: 编程语言)',
                'skills.item.placeholder': '输入技能',
                'skills.add.item': '添加技能',
                
                // Actions
                'action.add': '添加',
                'action.remove': '移除',
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
                'status.error.generation': '生成简历失败',
                'status.error.network': '网络连接错误',
                'status.error.required': '请填写必填字段',
                'status.error.validation': '请填写所有必填项 (姓名和至少一个有效条目)。',
                'status.error.typst.init': 'Typst 编译器初始化失败',
                'status.error.display': '显示预览失败',
                'status.error.no.pdf': '没有 PDF 可供下载',
                'status.error.download': 'PDF 下载失败',
                'status.error.sample': '示例数据生成失败',
                'status.generating.sample': '正在生成示例数据...',
                'status.enhancing.all': '正在润色所有内容...',
                'status.enhancing.skills': '正在生成技能推荐...',
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
                'dialog.language.japanese': '日本語',

                // Help Dialog
                'dialog.help.title': 'Help',
                'dialog.help.gettingStarted.title': '🚀 Getting Started',
                'dialog.help.gettingStarted.p1': 'Welcome to the Typst Resume Builder! Here’s how to get your professional resume in minutes:',
                'dialog.help.gettingStarted.li1': '<strong>Enter Your Info:</strong> Fill out the form on the left. Add, remove, and reorder sections as needed.',
                'dialog.help.gettingStarted.li2': '<strong>Use the AI Assistant (Optional):</strong>',
                'dialog.help.gettingStarted.li2_1': 'Enter your Gemini API Key. This is stored locally in your browser and never sent to our servers.',
                'dialog.help.gettingStarted.li2_2': 'Click <strong>Generate Sample Data</strong> to see a complete example.',
                'dialog.help.gettingStarted.li2_3': 'Click <strong>Enhance All Content</strong> to have the AI polish your writing and automatically generate a skills list based on your experience. You can also enhance individual sections using the ✨ icon.',
                'dialog.help.gettingStarted.li3': '<strong>Generate Resume:</strong> Click the <strong>Generate Resume</strong> button. A preview will appear on the right.',
                'dialog.help.gettingStarted.li4': '<strong>Download PDF:</strong> Once you\'re happy with the preview, click <strong>Download PDF</strong>.',
                'dialog.help.offline.title': '🌐 Offline Mode & HTML Fallback',
                'dialog.help.offline.p1': 'This app uses <a href="https://github.com/typst/typst" target="_blank">Typst</a>, a modern typesetting system, to create beautiful PDFs. The core Typst engine runs in your browser via WebAssembly.',
                'dialog.help.offline.p2': 'If the Typst engine fails to load (e.g., due to network issues), the app will switch to an <strong>HTML fallback mode</strong>. You will still see a preview of your resume, and you can "download" it by using your browser\'s "Print to PDF" function. We\'ve added special styles to ensure the printed PDF looks clean and professional.',
                'dialog.help.privacy.title': '🔒 Privacy',
                'dialog.help.privacy.p1': 'Your privacy is important. All resume data and your API key are stored <strong>only in your browser\'s local storage</strong>. Nothing is ever sent to or stored on a server.',
                'dialog.help.shortcuts.title': '⌨️ Keyboard Shortcuts',
                'dialog.help.shortcuts.li1': '<code class="shortcut">Ctrl/Cmd + S</code>: Manually save form data.',
                'dialog.help.shortcuts.li2': '<code class="shortcut">Ctrl/Cmd + Enter</code>: Generate Resume.',
                'dialog.help.shortcuts.li3': '<code class="shortcut">Esc</code>: Close any open dialog.',

                // AI Assistant
                'ai.title': 'AI Assistant',
                'ai.apikey': 'Gemini API Key',
                'ai.apikey.placeholder': 'Enter your Gemini API Key',
                'ai.job_description': 'Job Description (Optional)',
                'ai.job_description.placeholder': 'Paste job description or company profile here to generate more targeted content.',
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
                'research.paper.title.placeholder': 'e.g., "A Neural Network Approach to..."',
                'research.journal': 'Journal/Conference',
                'research.journal.placeholder': 'e.g., "NeurIPS 2024"',
                'research.authors': 'Authors',
                'research.authors.placeholder': 'e.g., "John Doe, Jane Smith"',
                'research.date': 'Publication Date',
                'research.doi': 'DOI/Link',
                'research.doi.placeholder': 'e.g., "https://doi.org/..."',
                'research.description': 'Research Description',
                'research.description.placeholder': 'e.g., Conducted data analysis and model validation, discovering key insights.',
                
                // Skills
                'skills.title': 'Skills',
                'skills.category.placeholder': 'Enter category (e.g., Programming Languages)',
                'skills.item.placeholder': 'Enter skill',
                'skills.add.item': 'Add Skill',
                
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
                'status.error.generation': 'Failed to generate resume',
                'status.error.network': 'Network connection error',
                'status.error.required': 'Please fill in required fields',
                'status.error.validation': 'Please fill in all required fields (Name and at least one valid entry).',
                'status.error.typst.init': 'Typst compiler initialization failed',
                'status.error.display': 'Failed to display preview',
                'status.error.no.pdf': 'No PDF available for download',
                'status.error.download': 'PDF download failed',
                'status.error.sample': 'Sample data generation failed',
                'status.generating.sample': 'Generating sample data...',
                'status.enhancing.all': 'Enhancing all content...',
                'status.enhancing.skills': 'Generating skill recommendations...',
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
            },
            'ja-JP': {
                // App title and navigation
                'app.title': '履歴書ジェネレーター',
                'nav.language': '言語を切り替え',
                'nav.theme': 'テーマを切り替え',
                'nav.help': 'ヘルプ',
                
                // Language dialog
                'dialog.language.title': '言語を選択',
                'dialog.language.chinese': '简体中文',
                'dialog.language.english': 'English',
                'dialog.language.japanese': '日本語',

                // Help Dialog
                'dialog.help.title': 'ヘルプ',
                'dialog.help.gettingStarted.title': '🚀 クイックスタート',
                'dialog.help.gettingStarted.p1': 'Typst 履歴書ビルダーへようこそ！わずか数分でプロフェッショナルな履歴書を作成する方法はこちらです：',
                'dialog.help.gettingStarted.li1': '<strong>情報を入力：</strong> 左側のフォームに情報を入力します。必要に応じてセクションを追加、削除、並べ替えてください。',
                'dialog.help.gettingStarted.li2': '<strong>AIアシスタントを利用する（任意）：</strong>',
                'dialog.help.gettingStarted.li2_1': 'Gemini APIキーを入力してください。このキーはブラウザのローカルにのみ保存され、当社のサーバーに送信されることはありません。',
                'dialog.help.gettingStarted.li2_2': '<strong>サンプルデータを生成</strong>をクリックすると、完全なサンプルが表示されます。',
                'dialog.help.gettingStarted.li2_3': '<strong>すべての内容を改善</strong>をクリックすると、AIが文章を洗練させ、経験に基づいてスキルリストを自動的に生成します。✨アイコンを使って個別のセクションを改善することもできます。',
                'dialog.help.gettingStarted.li3': '<strong>履歴書を作成：</strong> <strong>履歴書を作成</strong>ボタンをクリックします。右側にプレビューが表示されます。',
                'dialog.help.gettingStarted.li4': '<strong>PDFをダウンロード：</strong> プレビューに満足したら、<strong>PDFをダウンロード</strong>をクリックします。',
                'dialog.help.offline.title': '🌐 オフラインモードとHTMLフォールバック',
                'dialog.help.offline.p1': 'このアプリは、美しいPDFを作成するために、最新の組版システムである<a href="https://github.com/typst/typst" target="_blank">Typst</a>を使用しています。TypstのコアエンジンはWebAssemblyを介してブラウザで実行されます。',
                'dialog.help.offline.p2': 'Typstエンジンが（ネットワークの問題などで）読み込みに失敗した場合、アプリは<strong>HTMLフォールバックモード</strong>に切り替わります。履歴書のプレビューは引き続き表示され、ブラウザの「PDFとして印刷」機能を使って「ダウンロード」することができます。印刷されたPDFがクリーンでプロフェッショナルに見えるように、特別なスタイルを追加しています。',
                'dialog.help.privacy.title': '🔒 プライバシー',
                'dialog.help.privacy.p1': 'あなたのプライバシーは重要です。すべての履歴書データとAPIキーは、<strong>ブラウザのローカルストレージにのみ</strong>保存されます。いかなる情報もサーバーに送信または保存されることはありません。',
                'dialog.help.shortcuts.title': '⌨️ キーボードショートカット',
                'dialog.help.shortcuts.li1': '<code class="shortcut">Ctrl/Cmd + S</code>: フォームデータを手動で保存します。',
                'dialog.help.shortcuts.li2': '<code class="shortcut">Ctrl/Cmd + Enter</code>: 履歴書を生成します。',
                'dialog.help.shortcuts.li3': '<code class="shortcut">Esc</code>: 開いているダイアログを閉じます。',

                // AI Assistant
                'ai.title': 'AIアシスタント',
                'ai.apikey': 'Gemini APIキー',
                'ai.apikey.placeholder': 'ここにGemini APIキーを入力してください',
                'ai.job_description': '求人情報 (任意)',
                'ai.job_description.placeholder': 'ここに応募する職務内容や会社概要を貼り付けると、より的確な内容を生成できます。',
                'ai.generate.sample': 'サンプルデータを生成',
                'ai.enhance.all': 'すべての内容を改善',
                'ai.enhance.item': 'この項目を改善',

                // Personal Information
                'personal.title': '個人情報',
                'personal.name': '氏名',
                'personal.name.required': '氏名 *',
                'personal.pronouns': '代名詞',
                'personal.pronouns.placeholder': '例: 彼/彼女',
                'personal.location': '所在地',
                'personal.location.placeholder': '例: 東京, 日本',
                'personal.email': 'メールアドレス',
                'personal.phone': '電話番号',
                'personal.github': 'GitHub',
                'personal.github.placeholder': 'github.com/username',
                'personal.linkedin': 'LinkedIn',
                'personal.linkedin.placeholder': 'linkedin.com/in/username',
                'personal.website': '個人サイト',
                'personal.orcid': 'ORCID',
                'personal.orcid.placeholder': '0000-0000-0000-0000',

                // Education
                'education.title': '学歴',
                'education.institution': '学校/機関名',
                'education.institution.placeholder': '例: 東京大学',
                'education.degree': '学位/専攻',
                'education.degree.placeholder': '例: コンピューターサイエンス学士',
                'education.location': '所在地',
                'education.location.placeholder': '例: 東京, 日本',
                'education.start.date': '開始年月',
                'education.end.date': '終了年月',
                'education.gpa': 'GPA',
                'education.gpa.placeholder': '例: 3.8/4.0',
                'education.description': '詳細',
                'education.description.placeholder': '関連するコース、栄誉、活動など',

                // Work Experience
                'work.title': '職務経歴',
                'work.company': '会社名',
                'work.company.placeholder': '例: 株式会社TechCorp',
                'work.position': '役職',
                'work.position.placeholder': '例: ソフトウェアエンジニア',
                'work.location': '所在地',
                'work.location.placeholder': '例: 大阪, 日本',
                'work.start.date': '開始年月',
                'work.end.date': '終了年月',
                'work.description': '職務内容',
                'work.description.placeholder': 'あなたの職務責任と実績を詳しく説明してください',

                // Projects
                'projects.title': 'プロジェクト経験',
                'projects.name': 'プロジェクト名',
                'projects.name.placeholder': '例: 個人ポートフォリオサイト',
                'projects.role': '役割',
                'projects.role.placeholder': '例: リード開発者',
                'projects.url': 'プロジェクトURL',
                'projects.url.placeholder': 'github.com/username/project',
                'projects.start.date': '開始年月',
                'projects.end.date': '終了年月',
                'projects.description': 'プロジェクト概要',
                'projects.description.placeholder': 'プロジェクト詳細、使用技術、あなたの貢献など',

                // Research/Publications
                'research.title': '研究・出版物',
                'research.title.alt': '出版物',
                'research.paper.title': '論文タイトル',
                'research.paper.title.placeholder': '例: 「ニューラルネットワークによるアプローチ...」',
                'research.journal': 'ジャーナル/会議',
                'research.journal.placeholder': '例: "NeurIPS 2024"',
                'research.authors': '著者',
                'research.authors.placeholder': '例: "山田 太郎, 鈴木 一郎"',
                'research.date': '発表日',
                'research.doi': 'DOI/リンク',
                'research.doi.placeholder': '例: "https://doi.org/..."',
                'research.description': '研究概要',
                'research.description.placeholder': '例: データ分析とモデル検証を担当し、重要な洞察を発見。',
                
                // Skills
                'skills.title': 'スキル',
                'skills.category.placeholder': 'カテゴリを入力 (例: プログラミング言語)',
                'skills.item.placeholder': 'スキルを入力',
                'skills.add.item': 'スキルを追加',

                // Actions
                'action.add': '追加',
                'action.remove': '削除',
                'action.edit': '編集',
                'action.enhance': '改善',
                'action.generate': '履歴書を作成',
                'action.download': 'PDFをダウンロード',
                'action.close': '閉じる',

                // Preview
                'preview.title': 'プレビュー',
                'preview.placeholder': '"履歴書を作成"をクリックしてプレビューを表示',

                // Status messages
                'status.generating': '履歴書を作成中...',
                'status.enhancing': 'コンテンツを改善中...',
                'status.loading': '読み込み中...',
                'status.success.generated': '履歴書が正常に作成されました！',
                'status.success.enhanced': 'コンテンツの改善が完了しました！',
                'status.success.downloaded': 'PDFが正常にダウンロードされました！',
                'status.error.api': 'API呼び出しに失敗しました。APIキーを確認してください',
                'status.error.generation': '履歴書の作成に失敗しました',
                'status.error.network': 'ネットワーク接続エラー',
                'status.error.required': '必須項目を入力してください',
                'status.error.validation': 'すべての必須項目（氏名と少なくとも一つの有効な項目）を入力してください。',
                'status.error.typst.init': 'Typstコンパイラの初期化に失败しました',
                'status.error.display': 'プレビューの表示に失敗しました',
                'status.error.no.pdf': 'ダウンロードするPDFがありません',
                'status.error.download': 'PDFのダウンロードに失敗しました',
                'status.error.sample': 'サンプルデータの生成に失敗しました',
                'status.generating.sample': 'サンプルデータを生成中...',
                'status.enhancing.all': 'すべてのコンテンツを改善中...',
                'status.enhancing.skills': 'スキル推薦を生成中...',
                'status.success.sample': 'サンプルデータが正常に生成されました！',
                'status.success.enhanced.all': 'すべてのコンテンツの改善が完了しました！',
                'status.error.enhance.all': 'コンテンツの改善に失敗しました',

                // Dates
                'date.present': '現在',
                'date.format': 'YYYY年MM月',
                
                // Common
                'common.required': '必須',
                'common.optional': '任意',
                'common.cancel': 'キャンセル',
                'common.confirm': '確認',
                'common.save': '保存',
                'common.loading': '読み込み中...',
                'common.error': 'エラー',
                'common.success': '成功',
                'common.warning': '警告',
                'common.info': '情報'
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

    translateElement(rootEl) {
        // Translate elements with data-i18n attribute
        rootEl.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type === 'submit' || element.type === 'button') {
                    element.value = translation;
                }
            } else {
                if (element.hasAttribute('data-i18n-unsafe-html')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Translate elements with data-i18n-placeholder attribute
        rootEl.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // Translate elements with data-i18n-title attribute
        rootEl.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
        
        // Translate elements with data-i18n-aria-label attribute
        rootEl.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            element.setAttribute('aria-label', this.t(key));
        });
    }
    
    translatePage() {
        this.translateElement(document.body);
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