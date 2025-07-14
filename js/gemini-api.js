// Gemini API Integration Module - Rebuilt for Stability and Clarity

class GeminiAPI {
    constructor() {
        this.apiKey = localStorage.getItem('gemini-api-key') || '';
        this.models = [
            'gemini-2.5-flash',
        ];
        this.currentModelIndex = 0;
    }

    // --- Configuration ---
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('gemini-api-key', apiKey);
    }

    getApiKey() {
        return this.apiKey;
    }

    hasApiKey() {
        return !!this.apiKey;
    }

    _getJobDescription() {
        return localStorage.getItem('job-description') || '';
    }

    // --- Core API Request Logic ---

    /**
     * The core private method for making requests to the Gemini API.
     * It handles model switching for retries and robust error handling.
     * @param {string} prompt The prompt to send to the model.
     * @param {object} options Additional options for the request.
     * @param {boolean} [options.jsonOutput=false] Whether to request a JSON response.
     * @param {number} [options.temperature=0.5] The temperature for generation.
     * @param {number} [options.maxOutputTokens=2048] The max output tokens.
     * @returns {Promise<string|object>} The response text or parsed JSON object.
     * @private
     */
    async _makeRequest(prompt, options = {}) {
        if (!this.hasApiKey()) {
            throw new Error('API Key is required.');
        }

        const generationConfig = {
            temperature: options.temperature || 0.5,
            topK: options.topK || 40,
            topP: options.topP || 0.95,
            maxOutputTokens: options.maxOutputTokens || 2048,
        };
        
        if (options.jsonOutput) {
            generationConfig.responseMimeType = 'application/json';
        }

        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig,
        };

        let lastError = null;

        for (let i = 0; i < this.models.length; i++) {
            const model = this.models[this.currentModelIndex];
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
            
            console.log(`尝试模型: ${model} (${i + 1}/${this.models.length})`);

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
                }

                const data = await response.json();
                
                // --- Robust Response Parsing ---
                if (!data.candidates || data.candidates.length === 0) {
                    // This can happen if the prompt is blocked entirely.
                    const finishReason = data.promptFeedback?.blockReason || 'UNKNOWN_REASON';
                    throw new Error(`API returned no candidates. Reason: ${finishReason}`);
                }

                const candidate = data.candidates[0];

                if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
                    const finishReason = candidate.finishReason || 'UNKNOWN';
                    
                    // Specifically handle the "MAX_TOKENS" bug where content is empty.
                    if (finishReason === 'MAX_TOKENS') {
                        throw new Error(`模型错误: 请求因达到最大令牌数而停止，但未返回任何内容。这可能是个已知问题，请尝试简化您的请求或稍后重试。`);
                    }

                    const safetyRatings = JSON.stringify(candidate.safetyRatings || {});
                    throw new Error(`Candidate content is empty. Finish Reason: ${finishReason}. Safety Ratings: ${safetyRatings}`);
                }

                const responseText = candidate.content.parts[0].text;
                
                if (options.jsonOutput) {
                    try {
                        // The API should return a valid JSON object in the text part.
                        return JSON.parse(responseText);
                    } catch (e) {
                        console.error("无法解析来自API的JSON:", responseText, e);
                        // Throw an error to allow for retry with the next model.
                        throw new Error(`Invalid JSON response from model ${model}.`);
                    }
                }
                
                return responseText; // Success, return the result.

            } catch (error) {
                console.error(`模型 ${model} 调用失败:`, error);
                lastError = error;
                // Switch to the next model for the next attempt
                this.currentModelIndex = (this.currentModelIndex + 1) % this.models.length;
            }
        }

        // If all models failed, throw the last encountered error.
        throw new Error(`所有模型都调用失败. Last error: ${lastError.message}`);
    }

    // --- Public Methods ---

    /**
     * Generates complete sample resume data.
     * @returns {Promise<object>} A complete resume data object.
     */
    async generateSampleData() {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const prompt = this._getSampleDataPrompt(currentLang);

        try {
            const jsonData = await this._makeRequest(prompt, {
                jsonOutput: true,
                temperature: 0.4,
                maxOutputTokens: 8192
            });

            // Basic validation
            if (!jsonData || !jsonData.personal || !jsonData.personal.name) {
                throw new Error('返回的示例数据无效: 缺少个人信息');
            }
            
            // Ensure all sections are arrays, even if empty, for consistency.
            jsonData.education = jsonData.education || [];
            jsonData.work = jsonData.work || [];
            jsonData.projects = jsonData.projects || [];
            jsonData.research = jsonData.research || [];
            jsonData.skills = jsonData.skills || [];
            
            return jsonData;
        } catch (error) {
            console.error('生成示例数据失败:', error);
            throw new Error(`无法生成示例数据. ${error.message}`);
        }
    }

    /**
     * Enhances a specific piece of text given some context.
     * @param {string} text The text to enhance.
     * @param {string} context The context for the enhancement.
     * @returns {Promise<string>} The enhanced text.
     */
    async enhanceText(text, context = '') {
        if (!text || !text.trim()) {
            return text;
        }
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const prompt = this._getEnhanceTextPrompt(currentLang, text, context);

        try {
            const result = await this._makeRequest(prompt, {
                jsonOutput: true,
                temperature: 0.6,
                maxOutputTokens: 2048
            });
            return (result && result.enhanced_text) ? result.enhanced_text.trim() : text;
        } catch (error) {
            console.error(`润色文本失败: ${error.message}. 返回原始文本.`);
            // Fallback to original text on failure to avoid data loss.
            return text; 
        }
    }

    /**
     * Enhances a work experience description.
     * @param {string} position The job position.
     * @param {string} company The company name.
     * @param {string} description The original description.
     * @returns {Promise<string>} The enhanced description.
     */
    async enhanceWorkDescription(position, company, description) {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const context = currentLang === 'zh-CN' ? `在 ${company} 担任 ${position} 的工作经历` : `Work experience as ${position} at ${company}`;
        const prompt = this._getEnhanceDescriptionPrompt(currentLang, context, description);

        try {
            const result = await this._makeRequest(prompt, {
                jsonOutput: true,
                temperature: 0.6,
                maxOutputTokens: 2048
            });
            return (result && result.enhanced_description) ? result.enhanced_description.trim() : description;
        } catch (error) {
            console.error(`润色工作描述失败: ${error.message}. 返回原始描述.`);
            return description;
        }
    }
    
    /**
     * Enhances a project description.
     * @param {string} name The project name.
     * @param {string} role The user's role in the project.
     * @param {string} description The original description.
     * @returns {Promise<string>} The enhanced description.
     */
    async enhanceProjectDescription(name, role, description) {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const context = currentLang === 'zh-CN' ? `项目: ${name} (角色: ${role})` : `Project: ${name} (Role: ${role})`;
        const prompt = this._getEnhanceDescriptionPrompt(currentLang, context, description);
        
        try {
            const result = await this._makeRequest(prompt, {
                jsonOutput: true,
                temperature: 0.6,
                maxOutputTokens: 2048
            });
            return (result && result.enhanced_description) ? result.enhanced_description.trim() : description;
        } catch (error) {
            console.error(`润色项目描述失败: ${error.message}. 返回原始描述.`);
            return description;
        }
    }

    /**
     * Generates a list of skills based on resume content.
     * @param {Array} education 
     * @param {Array} work 
     * @param {Array} projects 
     * @param {Array} research 
     * @returns {Promise<Array>} An array of skill category objects.
     */
    async generateSkills(education = [], work = [], projects = [], research = []) {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const prompt = this._getGenerateSkillsPrompt(currentLang, education, work, projects, research);

        try {
            const result = await this._makeRequest(prompt, {
                jsonOutput: true,
                temperature: 0.5,
                maxOutputTokens: 1024,
            });
            return (result && result.skills && Array.isArray(result.skills)) ? result.skills : [];
        } catch (error) {
            console.error(`生成技能列表失败: ${error.message}.`);
            return [];
        }
    }


    // --- Prompt Generation Helpers ---

    _getSampleDataPrompt(lang) {
        const jobDescription = this._getJobDescription();
        const jobContext = jobDescription ? `请参考以下职位描述信息，以便生成更相关的内容：\n\n---\n${jobDescription}\n---\n\n` : '';
        
        const jsonStructure = `{
  "personal": {"name": "string", "location": "string", "email": "string", "phone": "string", "github": "string", "linkedin": "string", "website": "string", "pronouns": "string", "orcid": "string"},
  "education": [{"institution": "string", "degree": "string", "location": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "gpa": "string", "description": "string"}],
  "work": [{"company": "string", "position": "string", "location": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "string (use '\\n' for bullet points)"}],
  "projects": [{"name": "string", "role": "string", "url": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "string (use '\\n' for bullet points)"}],
  "research": [{"title": "string", "journal": "string", "authors": "string", "date": "YYYY-MM", "doi": "string", "description": "string (use '\\n' for bullet points)"}],
  "skills": [{"category": "string", "items": ["string", "string", "..."]}]
}`;
        if (lang === 'zh-CN') {
            return `${jobContext}生成一份专业、完整、高质量的符合工作描述(如果没有工作描述, 则生成一份符合机器学习工程师的简历示例)的***中文简历***示例。能力足够强大, 描述足够细致, 偏向工程师口吻, 不要过于口语化和营销化。
你必须只返回一个符合以下描述的JSON对象，不要包含任何其他文本或markdown标记。
JSON结构:
${jsonStructure}

要求:
- 描述性字段（description）请使用生动、量化的语言，并用'\\n'作为换行符来分隔要点。
- 数据内容要真实、专业且相互关联。
- 技能部分应按类别（如编程语言、框架与库、工具与平台）进行组织。
- 直接输出JSON对象。`;
        } else if (lang === 'ja-JP') {
            return `${jobContext}あなたはキャリアコンサルタントです。提供された職務経歴書（もしあれば）に合致する、日本のプロフェッショナルな***日本语履歴書***のサンプルデータを生成してください。職務経歴書がない場合は、典型的なソフトウェアエンジニアの履歴書を作成してください。データは以下のJSON形式に従う必要があります。すべてのフィールドに現実的で詳細な内容を記入してください。特に、職務経歴とプロジェクト経験のdescriptionは、具体的な成果を箇条書きで3〜5点挙げてください。スキルは、カテゴリ分けして具体的に記述してください。

            JSON出力のみを提供し、他のテキストは含めないでください。
JSON構造:
${jsonStructure}

要求:
- 描述性字段（description）请使用生动、量化的语言，并用'\\n'作为换行符来分隔要点。
- データ内容要真实、专业且相互关联。
- スキル部分应按类别（如编程语言、框架与库、工具与平台）进行组织。
- 直接输出JSON对象。`;
        }
        // Default to English
        return `${jobContext}Generate a professional, complete, and high-quality sample resume in English that is highly relevant to the provided job description. If no job description is provided, generate a sample for a typical software engineer.
You must return only a JSON object matching the following description. Do not include any other text or markdown specifiers.
JSON Structure:
${jsonStructure}

Requirements:
- For description fields, use vivid, quantified language and use '\\n' as a newline character to separate bullet points.
- The data should be realistic, professional, and interconnected.
- Skills should be organized into categories (e.g., Programming Languages, Frameworks & Libraries, Tools & Platforms).
- Output the raw JSON object directly.`;
    }

    _getEnhanceTextPrompt(lang, text, context) {
        const jobDescription = this._getJobDescription();
        const jobContext = jobDescription ? `请参考以下职位描述信息：\n---\n${jobDescription}\n---\n\n` : '';

        if (lang === 'zh-CN') {
            return `${jobContext}请为简历润色以下内容，使其更专业、有影响力，并与以下职位描述高度相关。如果未提供职位描述，请以专业工程师的口吻进行优化。
上下文: ${context}
原始内容: "${text}"

要求:
1. 使用强有力的动词和量化成果。
2. 保持简洁，突出核心贡献。
3. 优化表达，但保留核心事实，突出与职位描述相关的技能和经验。
4. 返回一个JSON对象，格式为 { "enhanced_text": "润色后的内容" }`;
        } else if (lang === 'ja-JP') {
             return `${jobContext}あなたはプロのキャリアコンサルタントです。以下の日本の履歴書用のテキストを、提供された職務経歴書（もしあれば）に沿って、より専門的でインパクトのあるものに校正・改善してください。職務経歴書がない場合は、プロのエンジニアの視点で改善してください。
コンテキスト: ${context}
元のテキスト: "${text}"

要求:
1. 専門用語と具体的な成果を用いて、内容を強化してください。
2. 簡潔かつ明確な表現を心がけてください。
3. 日本のビジネス文化に適した、丁寧でプロフェッショナルなトーンにし、職務経歴書で求められている資質を強調してください。
4. 返却形式は { "enhanced_text": "改善後のテキスト" } というJSONオブジェクトにしてください。`;
        }
        // Default to English
        return `${jobContext}Please enhance the following resume content to be more professional, impactful, and highly aligned with the provided job description. If no job description is provided, please optimize it with a professional engineer's tone.
Context: ${context}
Original Content: "${text}"

Requirements:
1. Use strong action verbs and quantifiable results.
2. Be concise and highlight core contributions.
3. Improve wording but preserve key facts, highlighting skills and experiences relevant to the job description.
4. Return a JSON object in the format: { "enhanced_text": "The enhanced content" }`;
    }

    _getEnhanceDescriptionPrompt(lang, context, description) {
        const jobDescription = this._getJobDescription();
        const jobContext = jobDescription ? `请参考以下职位描述信息：\n---\n${jobDescription}\n---\n\n` : '';

        if (lang === 'zh-CN') {
            return `${jobContext}请为简历润色以下描述，使其更专业、有影响力，并与职位描述高度相关。如果未提供职位描述，请以专业工程师的视角进行优化。每个要点以'\\n'分隔。
上下文: ${context}
原始描述: "${description}"

要求:
1. 使用强有力的动词和量化成果。
2. 保持简洁，突出与职位描述相关的核心贡献和技术。
3. 返回一个JSON对象，格式为 { "enhanced_description": "润色后的描述，要点以'\\n'分隔" }`;
        } else if (lang === 'ja-JP') {
            return `${jobContext}あなたはプロのキャリアコンサルタントです。日本の履歴書に記載する職務経歴またはプロジェクト経験の「説明」を、提供された職務経歴書（もしあれば）に沿って改善してください。具体的で測定可能な成果を強調した、箇条書きの力強い文章を3～5点作成してください。各箇条書きは'\\n'で区切ってください。職務経歴書がない場合は、プロのエンジニアの視点で改善してください。
コンテキスト: ${context}
元の説明: "${description}"

要求:
1. 「～担当」「～実施」のような受動的な表現ではなく、「～を実現」「～に貢献」のような能動的な動詞で始めてください。
2. 数値を用いて成果を具体的に示してください（例：「40%削減」「売上15%向上」）。
3. 専門用語を適切に使用し、職務経歴書で求められている技術的な深さを示してください。
4. 返却形式は { "enhanced_description": "改善後の説明（'\\n'区切り）" } というJSONオブジェクトにしてください。`;
        }
        // Default to English
        return `${jobContext}Please enhance the following resume description to be more professional, impactful, and highly aligned with the provided job description. If no job description is provided, please optimize it from a professional engineer's perspective, with bullet points separated by '\\n'.
Context: ${context}
Original Description: "${description}"

Requirements:
1. Use strong action verbs and quantifiable results.
2. Be concise and highlight core contributions and technologies relevant to the job description.
3. Return a JSON object in the format: { "enhanced_description": "The enhanced description, with points separated by '\\n'" }`;
    }

    _getGenerateSkillsPrompt(lang, education, work, projects, research) {
        const jobDescription = this._getJobDescription();
        const jobContext = jobDescription ? `请参考以下职位描述信息：\n---\n${jobDescription}\n---\n\n` : '';

        const contextData = {
            education: education.map(e => `${e.degree || ''} at ${e.institution || ''}: ${e.description || ''}`).join('; '),
            work: work.map(w => `${w.position || ''} at ${w.company || ''}: ${w.description || ''}`).join('; '),
            projects: projects.map(p => `${p.name || ''}: ${p.description || ''}`).join('; '),
            research: research.map(r => `${r.title || ''}: ${r.description || ''}`).join('; '),
        };
        const jsonStructure = `[
    {
        "category": "string (e.g., 'Programming Languages')",
        "items": ["string", "string", ...]
    },
    {
        "category": "string (e.g., 'Frameworks & Libraries')",
        "items": ["string", "string", ...]
    }
]`;

        if (lang === 'zh-CN') {
            return `${jobContext}根据以下简历摘要和职位描述（如果提供），生成一个高度相关的技能列表。优先考虑职位描述中提到的技能。如果未提供职位描述，则根据摘要生成通用但全面的技术技能列表。
上下文:
- 教育: ${contextData.education}
- 工作: ${contextData.work}
- 项目: ${contextData.projects}
- 研究: ${contextData.research}

要求:
- 提取并总结出关键的技术技能。
- 将技能逻辑地分组到不同的类别中，例如“编程语言”、“框架与库”、“工具与平台”等。
- 返回一个JSON对象，其唯一的键是 "skills"，值是一个符合以下描述的数组。不要返回任何其他文本或markdown标记。
- JSON结构: { "skills": ${jsonStructure} }
- 直接输出JSON对象。`;
        } else if (lang === 'ja-JP') {
            return `${jobContext}あなたはIT業界に精通したキャリアコンサルタントです。以下の履歴書要約と、提供された職務経歴書（もしあれば）に基づき、記載すべき重要なスキルを分析・抽出してください。職務経歴書で要求されているスキルを最優先してください。職務経歴書がない場合は、要約内容から一般的なソフトウェアエンジニア向けのスキルを抽出してください。

入力情報:
- 学歴: ${contextData.education}
- 職務経歴: ${contextData.work}
- プロジェクト経験: ${contextData.projects}
- 研究経験: ${contextData.research}

要求:
- 上記の情報から、関連性の高い技術スキルを抽出・要約してください。
- スキルを「プログラミング言語」「クラウド・DevOps」「データベース」のような適切な日本語のカテゴリに分類してください。
- 返却形式は { "skills": ${jsonStructure} } というJSONオブジェクトにしてください。他のテキストや説明は含めないでください。`;
        }
        // Default to English
        return `${jobContext}Based on the following resume summary and the provided job description (if any), generate a highly relevant list of skills. Prioritize skills mentioned in the job description. If no job description is available, generate a general but comprehensive list of technical skills based on the summary.
Context:
- Education: ${contextData.education}
- Work: ${contextData.work}
- Projects: ${contextData.projects}
- Research: ${contextData.research}

Requirements:
- Extract and summarize key technical skills.
- Group the skills logically into categories, such as "Programming Languages", "Frameworks & Libraries", "Tools & Platforms", etc.
- Return a JSON object with a single key "skills", where the value is an array matching the description below. Do not return any other text or markdown specifiers.
- JSON Structure: { "skills": ${jsonStructure} }
- Output the raw JSON object directly.`;
    }
}

// Create a global instance for the application to use.
window.geminiAPI = new GeminiAPI(); 