import '@substrate-system/a11y'
import '../src/index.css'
import '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
    localStorage.setItem('DEBUG', 'editable-field')
} else {
    localStorage.removeItem('DEBUG')
}

document.body.innerHTML += `
    <div>
        <editable-field id="abc" name="abc" value="hello inputs"></editable-field>
    </div>
`
