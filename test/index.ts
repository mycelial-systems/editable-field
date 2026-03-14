import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import '../src/index.js'

test('example test', async t => {
    document.body.innerHTML += `
        <editable-field class="test">
        </editable-field>
    `

    const el = await waitFor('editable-field')

    t.ok(el, 'should find an element')
})
