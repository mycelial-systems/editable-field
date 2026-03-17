import Debug from '@substrate-system/debug'
import '@substrate-system/a11y'
import '../src/index.css'
import '../src/index.js'
import type { EditableField } from '../src/index.js'
const debug = Debug('editable-field:examle')
const debug2 = Debug('editable-field:edit')
const debugStar = Debug('editable-field:star')

const qs = document.querySelector.bind(document)

if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
    localStorage.setItem('DEBUG', 'editable-field,editable-field:*')
} else {
    localStorage.removeItem('DEBUG')
}

document.body.innerHTML += `
    <div>
        <editable-field id="abc" name="abc" value="hello inputs"></editable-field>
    </div>
`

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
