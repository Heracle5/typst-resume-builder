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
            jsonData.skills = jsonData.skills || '';
            
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
     * @returns {Promise<string>} A comma-separated string of skills.
     */
    async generateSkills(education = [], work = [], projects = [], research = []) {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        const prompt = this._getGenerateSkillsPrompt(currentLang, education, work, projects, research);

        try {
            const result = await this._makeRequest(prompt, {
                jsonOutput: true,
                temperature: 0.5,
                maxOutputTokens: 512,
            });
            return (result && result.skills) ? result.skills.trim() : '';
        } catch (error) {
            console.error(`生成技能列表失败: ${error.message}.`);
            return '';
        }
    }


    // --- Prompt Generation Helpers ---

    _getSampleDataPrompt(lang) {
        const jsonStructure = `{
  "personal": {"name": "string", "location": "string", "email": "string", "phone": "string", "github": "string", "linkedin": "string", "website": "string", "pronouns": "string", "orcid": "string"},
  "education": [{"institution": "string", "degree": "string", "location": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "gpa": "string", "description": "string"}],
  "work": [{"company": "string", "position": "string", "location": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "string (use '\\n' for bullet points)"}],
  "projects": [{"name": "string", "role": "string", "url": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "string (use '\\n' for bullet points)"}],
  "research": [{"title": "string", "journal": "string", "authors": "string", "date": "YYYY-MM", "doi": "string", "description": "string (use '\\n' for bullet points)"}],
  "skills": "string, string, ..."
}`;
        if (lang === 'zh-CN') {
            return `生成一份专业、完整、高质量的中文机器学习工程师简历示例。能力足够强大, 描述足够细致, 偏向工程师口吻, 不要过于口语化和营销化。
你必须只返回一个符合以下描述的JSON对象，不要包含任何其他文本或markdown标记。
JSON结构:
${jsonStructure}

要求:
- 描述性字段（description）请使用生动、量化的语言，并用'\\n'作为换行符来分隔要点。
- 数据内容要真实、专业且相互关联。
- 直接输出JSON对象。`;
        }
        return `Generate a professional, complete, and high-quality sample resume for a machine learning engineer in English. The ability is strong enough, the description is detailed enough, and the tone is more like an engineer rather than a marketer.
You must return only a JSON object matching the following description. Do not include any other text or markdown specifiers.
JSON Structure:
${jsonStructure}

Requirements:
- For description fields, use vivid, quantified language and use '\\n' as a newline character to separate bullet points.
- The data should be realistic, professional, and interconnected.
- Output the raw JSON object directly.`;
    }

    _getEnhanceTextPrompt(lang, text, context) {
        if (lang === 'zh-CN') {
            return `请为简历润色以下内容，使其更专业、有影响力。
上下文: ${context}
原始内容: "${text}"

要求:
1. 使用强有力的动词和量化成果。
2. 保持简洁，突出核心贡献。
3. 优化表达，但保留核心事实，突出数据和核心技术栈，口吻偏向工程师。
4. 返回一个JSON对象，格式为 { "enhanced_text": "润色后的内容" }`;
        }
        return `Please enhance the following resume content to be more professional and impactful.
Context: ${context}
Original Content: "${text}"

Requirements:
1. Use strong action verbs and quantifiable results.
2. Be concise and highlight core contributions.
3. Improve wording but preserve key facts, highlight data and core technical stack, and the tone is more like an engineer rather than a marketer.
4. Return a JSON object in the format: { "enhanced_text": "The enhanced content" }`;
    }

    _getEnhanceDescriptionPrompt(lang, context, description) {
        if (lang === 'zh-CN') {
            return `请为简历润色以下描述，使其更专业、有影响力，每个要点以'\\n'分隔。
上下文: ${context}
原始描述: "${description}"

要求:
1. 使用强有力的动词和量化成果。
2. 保持简洁，突出核心贡献，口吻偏向工程师。
3. 返回一个JSON对象，格式为 { "enhanced_description": "润色后的描述，要点以'\\n'分隔" }`;
        }
        return `Please enhance the following resume description to be more professional and impactful, with bullet points separated by '\\n'.
Context: ${context}
Original Description: "${description}"

Requirements:
1. Use strong action verbs and quantifiable results.
2. Be concise and highlight core contributions, and the tone is more like an engineer rather than a marketer.
3. Return a JSON object in the format: { "enhanced_description": "The enhanced description, with points separated by '\\n'" }`;
    }

    _getGenerateSkillsPrompt(lang, education, work, projects, research) {
        const contextData = {
            education: education.map(e => `${e.degree} at ${e.institution}: ${e.description}`).join('; '),
            work: work.map(w => `${w.position} at ${w.company}: ${w.description}`).join('; '),
            projects: projects.map(p => `${p.name}: ${p.description}`).join('; '),
            research: research.map(r => `${r.title}: ${r.description}`).join('; '),
        };

        if (lang === 'zh-CN') {
            return `根据以下简历摘要，生成一个相关的技能列表。
教育: ${contextData.education}
工作: ${contextData.work}
项目: ${contextData.projects}
研究: ${contextData.research}

要求:
- 提取并总结出关键的技术技能。
- 包括编程语言、框架、工具和专业领域。
- 返回一个JSON对象，格式为 { "skills": "技能1, 技能2, ..." }`;
        }
        return `Based on the following resume summary, generate a relevant list of skills.
Education: ${contextData.education}
Work: ${contextData.work}
Projects: ${contextData.projects}
Research: ${contextData.research}

Requirements:
- Extract and summarize key technical skills.
- Include programming languages, frameworks, tools, and areas of expertise.
- Return a JSON object in the format: { "skills": "Skill 1, Skill 2, ..." }`;
    }
}

// Create a global instance for the application to use.
window.geminiAPI = new GeminiAPI(); 