import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import '../src/index.js'

test('editable-field renders disabled input', async t => {
    document.body.innerHTML = `
        <editable-field name="test" value="hello">
        </editable-field>
    `
    const el = await waitFor('editable-field')
    t.ok(el, 'should find the element')

    const input = el.querySelector('input')
    t.ok(input, 'should have an internal input')
    t.equal(
        input?.getAttribute('disabled'),
        '',
        'input should be disabled by default'
    )
    t.equal(
        input?.getAttribute('aria-disabled'),
        'true',
        'input should have aria-disabled="true" by default'
    )
    t.equal(
        input?.getAttribute('id'),
        'test',
        'input id should match name attribute'
    )
    t.equal(
        input?.getAttribute('name'),
        'test',
        'input name should match name attribute'
    )
    t.equal(
        input?.getAttribute('value'),
        'hello',
        'input value should match value attribute'
    )
})

test('pencil-button click enables input', async t => {
    document.body.innerHTML = `
        <editable-field name="test2" value="world">
        </editable-field>
    `
    const el = await waitFor('editable-field')
    const btn = el.querySelector('pencil-button button') as HTMLElement
    t.ok(btn, 'should have a pencil button')

    btn.click()

    const input = el.querySelector('input')
    t.equal(
        input?.getAttribute('disabled'),
        null,
        'input should not be disabled after click'
    )
    t.equal(
        input?.getAttribute('aria-disabled'),
        null,
        'aria-disabled should be removed from input after click'
    )
    t.equal(
        el.getAttribute('aria-disabled'),
        null,
        'aria-disabled should be removed from host after click'
    )
})

test('pencil-button standalone', async t => {
    document.body.innerHTML = '<pencil-button></pencil-button>'
    const el = await waitFor('pencil-button')
    t.ok(el, 'should render pencil-button standalone')

    const btn = el.querySelector('button')
    t.ok(btn, 'should have a button element')

    const label = el.querySelector('.visually-hidden')
    t.ok(label, 'should have a visually-hidden label')
    t.equal(
        label?.textContent?.trim(),
        'Edit',  // eslint-disable-line quotes
        'label text should be "Edit"'
    )
})
