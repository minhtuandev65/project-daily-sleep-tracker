const fs = require('fs')
const path = require('path')

export const loadHtmlTemplate = (templatePath, replacements = {}) => {
    let template = fs.readFileSync(
        path.resolve(__dirname, templatePath),
        'utf8'
    )
    for (const key in replacements) {
        const regex = new RegExp(`{{${key}}}`, 'g')
        template = template.replace(regex, replacements[key])
    }
    return template
}
