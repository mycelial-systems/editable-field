import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import { type EditableField } from '../src/index.js'
import '../src/index.js'

test('editable-field renders disabled input', async t => {
    document.body.innerHTML = `
        <editable-field name="test" value="hello">
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for disabled input test'
    )
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
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for pencil button test'
    )
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
    const el = ensureElement(
        await waitFor('pencil-button'),
        'pencil-button should render standalone'
    )
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
    const el = ensureElement(
        await waitFor('save-button'),
        'save-button should render standalone'
    )
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
    const el = ensureElement(
        await waitFor('x-button'),
        'x-button should render standalone'
    )
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
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for save-button click test'
    )

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
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for x-button click test'
    )

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

test('escape key restores value and exits editing', async t => {
    document.body.innerHTML = `
        <editable-field name="test5" value="original">
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for escape key test'
    )

    const pencil = el.querySelector('pencil-button button') as HTMLElement
    pencil.click()

    const input = el.querySelector('input') as HTMLInputElement
    input.value = 'changed'

    let cancelEventFired = false
    el.addEventListener('cancel', () => { cancelEventFired = true })

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    t.ok(cancelEventFired, 'should dispatch cancel event')
    t.equal(
        el.classList.contains('editing'),
        false,
        'should exit editing state after escape'
    )
    t.equal(input.value, 'original', 'input value should be restored')
    t.equal(
        input.getAttribute('disabled'),
        '',
        'input should be disabled after escape'
    )
})

test('can-edit makes pencil click emit without opening', async t => {
    document.body.innerHTML = `
        <editable-field name="c1" value="hello" can-edit>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for can-edit pencil test'
    )

    let editCount = 0
    el.addEventListener('edit', () => { editCount++ })

    const pencil = el.querySelector('pencil-button button') as HTMLElement
    pencil.click()

    t.equal(editCount, 1, 'should dispatch edit once')
    t.equal(
        el.classList.contains('editing'),
        false,
        'should not enter editing state on its own'
    )
    t.equal(
        el.querySelector('input')?.getAttribute('disabled'),
        '',
        'input should stay disabled'
    )
})

test('setting editing opens the editor', async t => {
    document.body.innerHTML = `
        <editable-field name="c2" value="hello" can-edit>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for editing open test'
    )

    el.setAttribute('editing', '')

    t.ok(el.classList.contains('editing'), 'should be in editing state')
    t.equal(
        el.querySelector('input')?.getAttribute('disabled'),
        null,
        'input should be enabled'
    )
    t.equal(
        el.getAttribute('aria-disabled'),
        null,
        'aria-disabled should be removed from host'
    )
})

test('setting editing does not emit edit', async t => {
    document.body.innerHTML = `
        <editable-field name="c3" value="hello" can-edit>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for silent open test'
    )

    let editCount = 0
    el.addEventListener('edit', () => { editCount++ })

    el.setAttribute('editing', '')

    t.equal(editCount, 0, 'should not dispatch edit when app opens the editor')
})

test('clearing editing closes the editor', async t => {
    document.body.innerHTML = `
        <editable-field name="c4" value="hello" can-edit editing>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for editing close test'
    )

    el.removeAttribute('editing')

    t.equal(
        el.classList.contains('editing'),
        false,
        'should leave editing state'
    )
    t.equal(
        el.querySelector('input')?.getAttribute('disabled'),
        '',
        'input should be disabled again'
    )
})

test('controlled save emits without closing the editor', async t => {
    document.body.innerHTML = `
        <editable-field name="c5" value="hello" can-edit editing>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for controlled save test'
    )

    let saveFired = false
    el.addEventListener('save', () => { saveFired = true })

    const saveBtn = el.querySelector('save-button button') as HTMLElement
    saveBtn.click()

    t.ok(saveFired, 'should dispatch save event')
    t.ok(
        el.classList.contains('editing'),
        'should stay in editing state after save'
    )
    t.equal(
        el.querySelector('input')?.getAttribute('disabled'),
        null,
        'input should stay enabled after save'
    )
})

test('controlled cancel restores value without closing', async t => {
    document.body.innerHTML = `
        <editable-field name="c6" value="original" can-edit editing>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for controlled cancel test'
    )

    const input = el.querySelector('input') as HTMLInputElement
    input.value = 'changed'

    let cancelFired = false
    el.addEventListener('cancel', () => { cancelFired = true })

    const xBtn = el.querySelector('x-button button') as HTMLElement
    xBtn.click()

    t.ok(cancelFired, 'should dispatch cancel event')
    t.equal(input.value, 'original', 'input value should be restored')
    t.ok(
        el.classList.contains('editing'),
        'should stay in editing state after cancel'
    )
})

test('controlled escape restores value without closing', async t => {
    document.body.innerHTML = `
        <editable-field name="c7" value="original" can-edit editing>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for controlled escape test'
    )

    const input = el.querySelector('input') as HTMLInputElement
    input.value = 'changed'

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    t.equal(input.value, 'original', 'input value should be restored')
    t.ok(
        el.classList.contains('editing'),
        'should stay in editing state after escape'
    )
})

test('editing without can-edit also prevents self close', async t => {
    document.body.innerHTML = `
        <editable-field name="c8" value="hello" editing>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for editing-only test'
    )

    const saveBtn = el.querySelector('save-button button') as HTMLElement
    saveBtn.click()

    t.ok(
        el.classList.contains('editing'),
        'should stay in editing state after save'
    )
})

test('pending disables the input and both buttons', async t => {
    document.body.innerHTML = `
        <editable-field name="p1" value="hello" can-edit editing>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for pending disable test'
    )

    el.setAttribute('pending', '')

    t.ok(el.classList.contains('pending'), 'should add the pending class')
    t.equal(
        el.querySelector('input')?.getAttribute('disabled'),
        '',
        'input should be disabled'
    )
    t.equal(
        el.querySelector('save-button button')?.getAttribute('disabled'),
        '',
        'save button should be disabled'
    )
    t.equal(
        el.querySelector('x-button button')?.getAttribute('disabled'),
        '',
        'cancel button should be disabled'
    )
})

test('pending keeps the editor open', async t => {
    document.body.innerHTML = `
        <editable-field name="p2" value="hello" can-edit editing pending>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for pending open test'
    )

    t.ok(
        el.classList.contains('editing'),
        'should stay in editing state while pending'
    )
})

test('clearing pending re-enables while still editing', async t => {
    document.body.innerHTML = `
        <editable-field name="p3" value="hello" can-edit editing pending>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for pending clear test'
    )

    el.removeAttribute('pending')

    t.equal(
        el.classList.contains('pending'),
        false,
        'should remove the pending class'
    )
    t.equal(
        el.querySelector('input')?.getAttribute('disabled'),
        null,
        'input should be enabled again'
    )
    t.equal(
        el.querySelector('save-button button')?.getAttribute('disabled'),
        null,
        'save button should be enabled again'
    )
})

test('clearing editing before pending leaves the input disabled', async t => {
    document.body.innerHTML = `
        <editable-field name="p4" value="hello" can-edit editing pending>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for clear order test'
    )

    el.removeAttribute('editing')
    el.removeAttribute('pending')

    t.equal(
        el.classList.contains('editing'),
        false,
        'should leave editing state'
    )
    t.equal(
        el.querySelector('input')?.getAttribute('disabled'),
        '',
        'input should stay disabled'
    )
})

test('escape does nothing while pending', async t => {
    document.body.innerHTML = `
        <editable-field name="p5" value="original" can-edit editing pending>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for pending escape test'
    )

    const input = el.querySelector('input') as HTMLInputElement
    input.value = 'changed'

    let cancelFired = false
    el.addEventListener('cancel', () => { cancelFired = true })

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    t.equal(cancelFired, false, 'should not dispatch cancel while pending')
    t.equal(input.value, 'changed', 'input value should be left alone')
})

test('save does nothing while pending', async t => {
    document.body.innerHTML = `
        <editable-field name="p6" value="hello" can-edit editing pending>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for pending save test'
    )

    let saveFired = false
    el.addEventListener('save', () => { saveFired = true })

    // the save button is disabled, so drive the method directly
    ;(el as unknown as EditableField)._save()

    t.equal(saveFired, false, 'should not dispatch save while pending')
})

test('no-trigger hides the pencil button', async t => {
    document.body.innerHTML = `
        <editable-field name="n1" value="hello" can-edit no-trigger>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for no-trigger test'
    )

    const pencil = el.querySelector('pencil-button')
    t.ok(pencil, 'pencil button should still be in the markup')
    t.equal(
        pencil?.getAttribute('hidden'),
        '',
        'pencil button should be hidden'
    )
})

test('removing no-trigger shows the pencil button', async t => {
    document.body.innerHTML = `
        <editable-field name="n2" value="hello" can-edit no-trigger>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for no-trigger removal test'
    )

    el.removeAttribute('no-trigger')

    t.equal(
        el.querySelector('pencil-button')?.getAttribute('hidden'),
        null,
        'pencil button should be visible again'
    )
})

test('editing set in markup opens the editor after render', async t => {
    document.body.innerHTML = `
        <editable-field name="i1" value="hello" can-edit editing>
        </editable-field>
    `
    const el = ensureElement(
        await waitFor('editable-field'),
        'editable-field should render for initial editing test'
    )

    t.ok(el.classList.contains('editing'), 'should be in editing state')
    t.equal(
        el.querySelector('input')?.getAttribute('disabled'),
        null,
        'input should be enabled'
    )
})

test('all done', () => {
    if (window) {
        // @ts-expect-error tests
        window.testsFinished = true
    }
})

function ensureElement<T extends HTMLElement> (
    candidate:T|null,
    message:string
):T {
    if (!candidate) {
        throw new Error(message)
    }
    return candidate
}
