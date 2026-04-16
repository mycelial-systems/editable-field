import Debug from '@substrate-system/debug'
import '../src/index.css'
import { EditableField } from '../src/index'
import '@substrate-system/a11y'
const debug = Debug('editable-field:examle')
const debug2 = Debug('editable-field:edit')
const debugStar = Debug('editable-field:star')

const qs = document.querySelector.bind(document)

if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
    // import '@substrate-system/a11y'
    localStorage.setItem('DEBUG', 'editable-field,editable-field:*')
} else {
    localStorage.removeItem('DEBUG')
}

const container = qs('#example-container')
if (container) {
    container.innerHTML = `
        <label for="abc">Enter text:</label>
        <${EditableField.TAG} id="abc" name="abc" value="hello inputs">
        </${EditableField.TAG}>
    `
}

const field = qs('editable-field')
field?.addEventListener('save', ev => {
    debug('save event', ev)
    debug('value', ev.target.value)
})

field?.on('save', ev => {
    // get the namespaced event also
    debug('namespaced "save" event:', ev)
    debug('the full, namespaced event name:', ev.type)
    const input = ev.target as EditableField
    debug('value in namespaced event...', input.querySelector('input')?.value)
})

// listen for all events
field?.addEventListener('*', ev => {
    debugStar('star event...', ev)
    debugStar('value in star listener', ev.target.querySelector('input').value)
})

field?.on('edit', ev => {
    debug2('got the edit event', ev)
})
