// Gemini API Integration Module
class GeminiAPI {
    constructor() {
        this.apiKey = localStorage.getItem('gemini-api-key') || '';
        this.models = [
            // 'gemini-1.5-flash',
            // 'gemini-2.0-flash',
            // 'gemini-1.5-pro',
            'gemini-2.5-flash'
        ];
        this.currentModelIndex = 0;
        this.baseURL = `https://generativelanguage.googleapis.com/v1beta/models/${this.models[this.currentModelIndex]}:generateContent`;
    }

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

    switchToNextModel() {
        this.currentModelIndex = (this.currentModelIndex + 1) % this.models.length;
        this.baseURL = `https://generativelanguage.googleapis.com/v1beta/models/${this.models[this.currentModelIndex]}:generateContent`;
        console.log(`Switched to model: ${this.models[this.currentModelIndex]}`);
    }

    getCurrentModel() {
        return this.models[this.currentModelIndex];
    }

    async makeRequest(prompt, options = {}) {
        if (!this.apiKey) {
            throw new Error('API Key is required');
        }

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxOutputTokens || 1024,
            }
        };

        let lastError = null;
        const maxRetries = this.models.length;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                console.log(`尝试模型: ${this.getCurrentModel()} (${attempt + 1}/${maxRetries})`);
                
                const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.status !== 200) {
                    console.log('Response status:', response.status, response.statusText);
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('API error response:', errorData);
                    lastError = new Error(`API request failed: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
                    
                    // Try next model if current one fails
                    if (attempt < maxRetries - 1) {
                        this.switchToNextModel();
                        continue;
                    }
                    throw lastError;
                }

                const data = await response.json();
                console.log(`模型 ${this.getCurrentModel()} 响应成功`);
                
                // Handle different response formats
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    return data.candidates[0].content.parts[0].text;
                } else if (data.content && data.content.parts) {
                    return data.content.parts[0].text;
                } else if (data.text) {
                    return data.text;
                } else {
                    console.error('Unexpected API response format:', data);
                    lastError = new Error('Invalid response format from API');
                    
                    // Try next model if response format is invalid
                    if (attempt < maxRetries - 1) {
                        this.switchToNextModel();
                        continue;
                    }
                    throw lastError;
                }
            } catch (error) {
                console.error(`Gemini API request failed with model ${this.getCurrentModel()}:`, error);
                lastError = error;
                
                // Try next model if request fails
                if (attempt < maxRetries - 1) {
                    this.switchToNextModel();
                    continue;
                }
                break;
            }
        }

        throw lastError || new Error('All models failed to respond');
    }

    async generateSampleData() {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        
        const prompts = {
            'zh-CN': `生成一个完整的中文简历示例数据，只返回JSON格式，包含：个人信息、教育背景、工作经历、项目经历、科研经历、技能特长。

返回格式：
{
  "personal": {"name": "李明", "location": "北京, 中国", "email": "liming@example.com", "phone": "+86 138****5678", "github": "github.com/liming", "linkedin": "linkedin.com/in/liming", "website": "liming.dev", "pronouns": "他/他", "orcid": "0000-0000-0000-0000"},
  "education": [{"institution": "清华大学", "degree": "计算机科学学士", "location": "北京, 中国", "startDate": "2020-09", "endDate": "2024-06", "gpa": "3.8/4.0", "description": "主修算法、数据结构等"}],
  "work": [{"company": "字节跳动", "position": "实习工程师", "location": "北京, 中国", "startDate": "2023-07", "endDate": "2023-09", "description": "参与后端开发，优化系统性能"}],
  "projects": [{"name": "智能推荐系统", "role": "核心开发", "url": "github.com/liming/recommend", "startDate": "2023-01", "endDate": "2023-05", "description": "使用Python和TensorFlow开发推荐算法"}],
  "research": [{"title": "深度学习在推荐系统中的应用", "journal": "计算机学报", "authors": "李明, 张三", "date": "2024-03", "doi": "doi.org/10.1234/example", "description": "提出了新的深度学习模型"}],
  "skills": "Python, Java, C++, TensorFlow, MySQL, Git"
}

请按上述格式返回一个完整的简历数据。`,
            'en-US': `Generate complete English resume sample data, return only JSON format with: personal info, education, work experience, projects, research, skills.

Format:
{
  "personal": {"name": "John Smith", "location": "San Francisco, CA", "email": "john@example.com", "phone": "+1 (555) 123-4567", "github": "github.com/johnsmith", "linkedin": "linkedin.com/in/johnsmith", "website": "johnsmith.dev", "pronouns": "he/him", "orcid": "0000-0000-0000-0000"},
  "education": [{"institution": "Stanford University", "degree": "Computer Science BS", "location": "Stanford, CA", "startDate": "2020-09", "endDate": "2024-06", "gpa": "3.8/4.0", "description": "Studied algorithms, data structures, ML"}],
  "work": [{"company": "Google", "position": "Software Engineer Intern", "location": "Mountain View, CA", "startDate": "2023-07", "endDate": "2023-09", "description": "Developed backend services, improved performance"}],
  "projects": [{"name": "Recommendation Engine", "role": "Lead Developer", "url": "github.com/johnsmith/recommend", "startDate": "2023-01", "endDate": "2023-05", "description": "Built ML recommendation system using Python and TensorFlow"}],
  "research": [{"title": "Deep Learning for Recommendation Systems", "journal": "ACM Computing Surveys", "authors": "John Smith, Jane Doe", "date": "2024-03", "doi": "doi.org/10.1234/example", "description": "Proposed novel deep learning architecture"}],
  "skills": "Python, Java, C++, TensorFlow, PostgreSQL, Git"
}

Return complete resume data in this format.`
        };

        try {
            const response = await this.makeRequest(prompts[currentLang], {
                temperature: 0.3,
                maxOutputTokens: 2048  // Ensure enough tokens for complete JSON
            });
            console.log('Raw AI response:', response);
            
            // Extract JSON from response, handle both plain JSON and markdown code blocks
            let jsonString = '';
            
            // Try to extract from markdown code block first
            const markdownMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
            if (markdownMatch) {
                jsonString = markdownMatch[1];
            } else {
                // Fall back to direct JSON extraction
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    jsonString = jsonMatch[0];
                } else {
                    throw new Error('No JSON found in response');
                }
            }
            
            console.log('Extracted JSON string:', jsonString);
            
            // Clean up common JSON issues
            jsonString = jsonString
                .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
                .replace(/[\u201C\u201D]/g, '"')  // Replace smart quotes
                .replace(/[\u2018\u2019]/g, "'")  // Replace smart apostrophes
                .replace(/,\s*}/g, '}')  // Remove trailing comma before closing brace
                .replace(/,\s*]/g, ']')  // Remove trailing comma before closing bracket
                .replace(/\n/g, ' ')  // Replace newlines with spaces
                .replace(/\s+/g, ' ')  // Normalize whitespace
                .trim();
            
            let jsonData;
            try {
                jsonData = JSON.parse(jsonString);
            } catch (parseError) {
                console.log('Initial JSON parse failed, attempting repair...');
                console.error('JSON parse error:', parseError);
                console.error('Problematic JSON:', jsonString);
                
                // Try to fix common issues and parse again
                jsonString = this.repairJsonString(jsonString);
                
                try {
                    jsonData = JSON.parse(jsonString);
                } catch (secondParseError) {
                    console.error('Failed to parse JSON after cleanup:', secondParseError);
                    console.error('Final JSON string:', jsonString);
                    throw new Error('Unable to parse JSON response');
                }
            }
            
            // Validate required structure
            if (!jsonData.personal || !jsonData.personal.name) {
                throw new Error('Invalid sample data: missing personal information');
            }
            
            // Ensure all required arrays exist
            jsonData.education = jsonData.education || [];
            jsonData.work = jsonData.work || [];
            jsonData.projects = jsonData.projects || [];
            jsonData.research = jsonData.research || [];
            jsonData.skills = jsonData.skills || '';
            
            return jsonData;
        } catch (error) {
            console.error('Error generating sample data:', error);
            throw new Error('Failed to generate sample data');
        }
    }

    repairJsonString(jsonString) {
        // More aggressive JSON repair
        let repaired = jsonString;
        
        // Fix unquoted keys
        repaired = repaired.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
        
        // Fix unquoted string values (be more careful about numbers and booleans)
        repaired = repaired.replace(/:\s*([^",{\[\]}\s][^",{\[\]}\n]*?)\s*([,}])/g, (match, value, ending) => {
            // Don't quote numbers, booleans, or null
            if (/^(null|true|false|\d+(\.\d+)?)$/.test(value.trim())) {
                return `: ${value.trim()}${ending}`;
            }
            return `: "${value.trim()}"${ending}`;
        });
        
        // Fix incomplete objects/arrays by adding closing brackets
        let openBraces = (repaired.match(/\{/g) || []).length;
        let closeBraces = (repaired.match(/\}/g) || []).length;
        let openBrackets = (repaired.match(/\[/g) || []).length;
        let closeBrackets = (repaired.match(/\]/g) || []).length;
        
        // Add missing closing brackets
        while (closeBraces < openBraces) {
            repaired += '}';
            closeBraces++;
        }
        while (closeBrackets < openBrackets) {
            repaired += ']';
            closeBrackets++;
        }
        
        // Remove any trailing commas before closing
        repaired = repaired.replace(/,(\s*[}\]])/g, '$1');
        
        return repaired;
    }

    async enhanceText(text, context = '') {
        if (!text) {
            throw new Error('Text is required for enhancement');
        }

        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        
        const prompts = {
            'zh-CN': `请润色以下简历内容，使其更加专业、简洁和有吸引力。保持原有的事实信息不变，但改进语言表达、结构和格式。${context ? `上下文：${context}` : ''}

原始内容：
${text}

请直接返回润色后的内容，不要包含任何解释或额外信息。`,
            'en-US': `Please enhance the following resume content to make it more professional, concise, and attractive. Keep the original factual information unchanged, but improve language expression, structure, and formatting. ${context ? `Context: ${context}` : ''}

Original content:
${text}

Please return only the enhanced content without any explanations or additional information.`
        };

        try {
            const response = await this.makeRequest(prompts[currentLang], {
                temperature: 0.5,
                maxOutputTokens: 512
            });
            
            return response.trim();
        } catch (error) {
            console.error('Error enhancing text:', error);
            throw new Error('Failed to enhance text');
        }
    }

    async enhanceWorkDescription(position, company, description) {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        
        const prompts = {
            'zh-CN': `请为以下工作经历生成专业的工作描述。如果提供了原始描述，请基于它进行润色；如果没有提供描述，请根据职位和公司信息生成合适的描述。

职位：${position}
公司：${company}
原始描述：${description || '无'}

要求：
1. 使用动作词开头的短句
2. 突出成就和影响
3. 量化结果（如适用）
4. 保持专业和简洁
5. 每行一个要点，用换行符分隔

请直接返回工作描述内容，每个要点一行。`,
            'en-US': `Please generate professional job descriptions for the following work experience. If an original description is provided, enhance it; if not, generate appropriate descriptions based on the position and company.

Position: ${position}
Company: ${company}
Original Description: ${description || 'None'}

Requirements:
1. Start with action verbs
2. Highlight achievements and impact
3. Quantify results when applicable
4. Keep professional and concise
5. One bullet point per line, separated by line breaks

Please return only the job description content, one point per line.`
        };

        try {
            const response = await this.makeRequest(prompts[currentLang], {
                temperature: 0.6,
                maxOutputTokens: 256
            });
            
            return response.trim();
        } catch (error) {
            console.error('Error enhancing work description:', error);
            throw new Error('Failed to enhance work description');
        }
    }

    async enhanceProjectDescription(name, role, description) {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        
        const prompts = {
            'zh-CN': `请为以下项目经历生成专业的项目描述。如果提供了原始描述，请基于它进行润色；如果没有提供描述，请根据项目名称和角色生成合适的描述。

项目名称：${name}
角色：${role}
原始描述：${description || '无'}

要求：
1. 突出技术栈和实现方案
2. 强调个人贡献和成果
3. 展示解决的问题或带来的价值
4. 保持技术性和专业性
5. 每行一个要点，用换行符分隔

请直接返回项目描述内容，每个要点一行。`,
            'en-US': `Please generate professional project descriptions for the following project experience. If an original description is provided, enhance it; if not, generate appropriate descriptions based on the project name and role.

Project Name: ${name}
Role: ${role}
Original Description: ${description || 'None'}

Requirements:
1. Highlight tech stack and implementation approach
2. Emphasize personal contributions and achievements
3. Show problems solved or value delivered
4. Keep technical and professional
5. One bullet point per line, separated by line breaks

Please return only the project description content, one point per line.`
        };

        try {
            const response = await this.makeRequest(prompts[currentLang], {
                temperature: 0.6,
                maxOutputTokens: 256
            });
            
            return response.trim();
        } catch (error) {
            console.error('Error enhancing project description:', error);
            throw new Error('Failed to enhance project description');
        }
    }

    async generateSkills(education = [], work = [], projects = [], research = []) {
        const currentLang = i18n ? i18n.getCurrentLanguage() : 'zh-CN';
        
        const context = {
            education: education.map(edu => `${edu.degree} at ${edu.institution}`).join(', '),
            work: work.map(w => `${w.position} at ${w.company}`).join(', '),
            projects: projects.map(p => `${p.name} (${p.role})`).join(', '),
            research: research.map(r => `${r.title} in ${r.journal}`).join(', ')
        };
        
        const prompts = {
            'zh-CN': `根据以下背景信息，生成一个专业的技能列表：

教育背景：${context.education}
工作经历：${context.work}
项目经历：${context.projects}
科研经历：${context.research}

请生成相关的技术技能，包括：
1. 编程语言
2. 框架和库
3. 工具和平台
4. 其他技术技能

请以逗号分隔的格式返回技能列表，保持简洁专业。`,
            'en-US': `Based on the following background information, generate a professional skills list:

Education: ${context.education}
Work Experience: ${context.work}
Projects: ${context.projects}
Research & Publications: ${context.research}

Please generate relevant technical skills including:
1. Programming languages
2. Frameworks and libraries
3. Tools and platforms
4. Other technical skills

Please return the skills list in comma-separated format, keeping it concise and professional.`
        };

        try {
            const response = await this.makeRequest(prompts[currentLang], {
                temperature: 0.5,
                maxOutputTokens: 128
            });
            
            return response.trim();
        } catch (error) {
            console.error('Error generating skills:', error);
            throw new Error('Failed to generate skills');
        }
    }
}

// Create global instance
window.geminiAPI = new GeminiAPI(); 