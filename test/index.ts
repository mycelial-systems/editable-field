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

test('save-button renders with correct structure', async t => {
    document.body.innerHTML = '<save-button></save-button>'
    const el = await waitFor('save-button')
    t.ok(el, 'should render save-button standalone')

    const btn = el.querySelector('button')
    t.ok(btn, 'should have a button element')
    t.equal(btn?.getAttribute('type'), 'button', 'button type should be button')

    const label = el.querySelector('.visually-hidden')
    t.ok(label, 'should have a visually-hidden label')
    t.equal(
        label?.textContent?.trim(),
        'Save',
        'label text should be "Save"'
    )
})

test('x-button renders with correct structure', async t => {
    document.body.innerHTML = '<x-button></x-button>'
    const el = await waitFor('x-button')
    t.ok(el, 'should render x-button standalone')

    const btn = el.querySelector('button')
    t.ok(btn, 'should have a button element')
    t.equal(btn?.getAttribute('type'), 'button', 'button type should be button')

    const label = el.querySelector('.visually-hidden')
    t.ok(label, 'should have a visually-hidden label')
    t.equal(
        label?.textContent?.trim(),
        'Cancel',
        'label text should be "Cancel"'
    )
})

test('save-button click dispatches save event and exits editing', async t => {
    document.body.innerHTML = `
        <editable-field name="test3" value="hello">
        </editable-field>
    `
    const el = await waitFor('editable-field')

    // enter editing state
    const pencil = el.querySelector('pencil-button button') as HTMLElement
    pencil.click()
    t.ok(el.classList.contains('editing'), 'should be in editing state')

    let saveEventFired = false
    el.addEventListener('save', () => { saveEventFired = true })

    const saveBtn = el.querySelector('save-button button') as HTMLElement
    t.ok(saveBtn, 'should have a save button')
    saveBtn.click()

    t.ok(saveEventFired, 'should dispatch save event')
    t.equal(
        el!.classList.contains('editing'),
        false,
        'should exit editing state after save'
    )
    const input = el.querySelector('input')
    t.equal(
        input?.getAttribute('disabled'),
        '',
        'input should be disabled after save'
    )
})

test('x-button click restores value and exits editing', async t => {
    document.body.innerHTML = `
        <editable-field name="test4" value="original">
        </editable-field>
    `
    const el = await waitFor('editable-field')

    // enter editing state
    const pencil = el.querySelector('pencil-button button') as HTMLElement
    pencil.click()

    // change the input value
    const input = el.querySelector('input') as HTMLInputElement
    input.value = 'changed'

    const xBtn = el.querySelector('x-button button') as HTMLElement
    t.ok(xBtn, 'should have an x button')
    xBtn.click()

    t.equal(
        el!.classList.contains('editing'),
        false,
        'should exit editing state after cancel'
    )
    t.equal(input.value, 'original', 'input value should be restored')
    t.equal(
        input.getAttribute('disabled'),
        '',
        'input should be disabled after cancel'
    )
})
