import { WebComponent } from '@substrate-system/web-component'
import { define } from '@substrate-system/web-component/util'
import Debug from '@substrate-system/debug'
import './edit-btn.js'
import './save-btn.js'
import './x-btn.js'

const debug = Debug('editable-field')

declare global {
    interface HTMLElementTagNameMap {
        'editable-field':EditableField
    }
}

export class EditableField extends WebComponent.create('editable-field') {
    static TAG = 'editable-field'
    static observedAttributes = ['name', 'value', 'disabled']

    _originalValue:string = ''

    render () {
        if (this.querySelector('input')) return
        debug('render')
        const name = this.getAttribute('name') ?? ''
        const value = this.getAttribute('value') ?? ''
        this.setAttribute('aria-disabled', 'true')
        this.innerHTML = `<input
            id="${name}"
            name="${name}"
            value="${value}"
            disabled
            aria-disabled="true"
        />
        <pencil-button></pencil-button>
        <save-button></save-button>
        <x-button></x-button>`

        this.querySelector('input')?.addEventListener(
            'keydown',
            (ev:KeyboardEvent) => {
                if (ev.key !== 'Escape') return
                if (!this.classList.contains('editing')) return
                this._cancel()
            }
        )

        this.querySelector('pencil-button')?.addEventListener(
            'click',
            () => this._enableEdit()
        )

        this.querySelector('save-button')?.addEventListener(
            'click',
            () => this._save()
        )

        this.querySelector('x-button')?.addEventListener(
            'click',
            () => this._cancel()
        )
    }

    _enableEdit () {
        const input = this.querySelector('input')
        if (!input) return
        this._originalValue = input.value
        input.removeAttribute('disabled')
        input.removeAttribute('aria-disabled')
        this.removeAttribute('aria-disabled')
        this.classList.add('editing')
        input.focus()
        input.select()
        this.emit('edit')
        this.dispatch('edit')
    }

    _disableEdit () {
        const input = this.querySelector('input')
        if (!input) return
        this.classList.remove('editing')
        input.setAttribute('disabled', '')
        input.setAttribute('aria-disabled', 'true')
        this.setAttribute('aria-disabled', 'true')
    }

    _save () {
        this._disableEdit()
        this.querySelector('input')?.dispatchEvent(
            new CustomEvent('save', { bubbles: true })
        )
        this.emit('save', { bubbles: true })
    }

    _cancel () {
        const input = this.querySelector('input')
        if (input) input.value = this._originalValue
        this._disableEdit()
        this.dispatch('cancel')
        this.emit('cancel')
    }

    handleChange_name (_old:string, newValue:string) {
        debug('name changed', newValue)
        const input = this.querySelector('input')
        if (!input) return
        input.setAttribute('id', newValue)
        input.setAttribute('name', newValue)
    }

    handleChange_value (_old:string, newValue:string) {
        debug('value changed', newValue)
        const input = this.querySelector('input')
        if (!input) return
        input.setAttribute('value', newValue)
    }

    handleChange_disabled (_old:string, newValue:string) {
        debug('disabled changed', newValue)
        const input = this.querySelector('input')
        if (!input) return
        const remove = (
            (newValue as unknown) === null ||
            newValue === 'false'
        )
        if (remove) {
            input.removeAttribute('disabled')
        } else {
            input.setAttribute('disabled', '')
        }
    }
}

export { PencilButton } from './edit-btn.js'
export { SaveButton } from './save-btn.js'
export { XButton } from './x-btn.js'

define('editable-field', EditableField)
