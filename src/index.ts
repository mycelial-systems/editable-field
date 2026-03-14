import { WebComponent } from '@substrate-system/web-component'
import { define } from '@substrate-system/web-component/util'
import Debug from '@substrate-system/debug'
import './edit-btn.js'

const debug = Debug('editable-field')

declare global {
    interface HTMLElementTagNameMap {
        'editable-field':EditableField
    }
}

export class EditableField extends WebComponent {
    static TAG = 'editable-field'
    static observedAttributes = ['name', 'value', 'disabled']

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
        /><pencil-button></pencil-button>`
        this.querySelector('pencil-button')
            ?.addEventListener('click', () => this._enableEdit())
    }

    _enableEdit () {
        const input = this.querySelector('input')
        if (!input) return
        input.removeAttribute('disabled')
        input.removeAttribute('aria-disabled')
        this.removeAttribute('aria-disabled')
        input.focus()
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

define('editable-field', EditableField)
