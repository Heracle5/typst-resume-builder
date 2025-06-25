# Typst Resume Builder

A modern resume generator built with Typst, featuring AI-powered content enhancement and multilingual support.

## Features

- **Resume Generation**: Create professional resumes using Typst typesetting system
- **AI Assistant**: Content enhancement and sample data generation via Gemini API
- **Multilingual**: Chinese and English interface support
- **Modern UI**: Material Design 3 interface
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Auto-saves form data to browser storage
- **PDF Export**: Download generated resumes as PDF
- **Dark Mode**: Light/dark theme support

## Quick Start

### Online Demo

Visit [GitHub Pages](https://heracle5.github.io/typst-resume-builder/) to try it online.

### Local Development

1. Clone the repository
```bash
git clone https://github.com/heracle5/typst-resume-builder.git
cd typst-resume-builder
```

2. Start a local server
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

## Usage

### Basic Steps

1. Fill in personal information (name is required)
2. Add education, work experience, projects, or research
3. Click "Generate Resume" to preview
4. Download the PDF when satisfied (TODO: add PDF download)

### AI Features

1. Get a Gemini API Key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Enter your API Key in the AI Assistant section
3. Use "Generate Sample Data" for quick templates
4. Enhance content with "Enhance All Content" or individual items

## Technology Stack

### Core Technologies
- **Typst**: Modern typesetting system for PDF generation
- **JavaScript (ES6+)**: Frontend logic and interactions
- **HTML5 & CSS3**: Page structure and styling
- **Material Design 3**: UI design system

### Dependencies

#### Frontend Libraries
- **[@myriaddreamin/typst.ts](https://github.com/Myriad-Dreamin/typst.ts)** `v0.4.1` - Typst JavaScript implementation
- **[Google Fonts](https://fonts.google.com/)** - Roboto fonts and Material Icons
- **[Font Awesome](https://fontawesome.com/)** `v6.4.0` - Icon library

#### AI Services
- **[Google Gemini API](https://ai.google.dev/)** - AI content generation

#### CDN Services
- **[jsDelivr](https://www.jsdelivr.com/)** - CDN for npm packages
- **[unpkg](https://unpkg.com/)** - npm package CDN
- **[esm.run](https://esm.run/)** - ES module CDN
- **[Cloudflare CDN](https://www.cloudflare.com/)** - Font Awesome CDN

## Project Structure

```
typst-resume-builder/
├── index.html              # Main page
├── js/                     # JavaScript modules
│   ├── app.js             # Main application logic
│   ├── form-manager.js    # Form management
│   ├── gemini-api.js      # Gemini API integration
│   ├── i18n.js           # Internationalization
│   ├── resume-generator.js # Resume generator
│   └── typst-integration.js # Typst integration
├── styles.css             # Main styles
├── material-theme.css     # Material Design theme
├── LICENSE               # MIT license
└── README.md            # Project documentation
```

## Contributing

Issues and Pull Requests are welcome.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

### Inspiration
- **[basic-typst-resume-template](https://github.com/stuxf/basic-typst-resume-template)** - Typst resume template by [@stuxf](https://github.com/stuxf) that inspired this project

### Core Technologies
- **[Typst](https://typst.app/)** - Modern typesetting system by the Typst team
- **[@myriaddreamin/typst.ts](https://github.com/Myriad-Dreamin/typst.ts)** - Typst JavaScript implementation by Myriad-Dreamin team

### Open Source Community
Thanks to all contributors of the excellent open source projects used in this project.

## Links

- Project: [https://github.com/heracle5/typst-resume-builder](https://github.com/heracle5/typst-resume-builder)
- Demo: [https://cv.heracle5s.win/](https://cv.heracle5s.win/) 