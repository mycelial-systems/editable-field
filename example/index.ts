import '../src/index.css'
import '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
    localStorage.setItem('DEBUG', 'editable-field')
} else {
    localStorage.removeItem('DEBUG')
}

document.body.innerHTML += `
    <editable-field></editable-field>
`
