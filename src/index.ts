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

/**
 * Read a boolean-ish attribute value. Absent or "false" means off.
 */
function isOn (value:string|null):boolean {
    return (value !== null && value !== 'false')
}

export class EditableField extends WebComponent.create('editable-field') {
    static TAG = 'editable-field'
    static observedAttributes = [
        'name',
        'value',
        'disabled',
        // `can-edit` has no handler on purpose. It is read on demand by
        // `_controlled`, and changing it needs no DOM work.
        'can-edit',
        'editing',
        'pending',
        'no-trigger'
    ]

    _originalValue:string = ''

    /**
     * True when the host app owns the editing state. In this mode the
     * component never opens or closes the editor by itself; it emits
     * events and waits for the app to set or clear `editing`.
     */
    get _controlled ():boolean {
        return (
            isOn(this.getAttribute('can-edit')) ||
            isOn(this.getAttribute('editing'))
        )
    }

    /**
     * True while the app is saving. Save and cancel are inert.
     */
    get _isPending ():boolean {
        return this.classList.contains('pending')
    }

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
            () => this._onTrigger()
        )

        this.querySelector('save-button')?.addEventListener(
            'click',
            () => this._save()
        )

        this.querySelector('x-button')?.addEventListener(
            'click',
            () => this._cancel()
        )

        // These attributes can be set before the input exists, because
        // `attributeChangedCallback` runs ahead of the first render.
        if (isOn(this.getAttribute('no-trigger'))) this._hideTrigger(true)
        if (isOn(this.getAttribute('editing'))) this._openEditor()
        if (isOn(this.getAttribute('pending'))) this._setPending(true)
    }

    /**
     * The built in pencil button was clicked. When the app owns the
     * editing state, say so and let it decide.
     */
    _onTrigger () {
        if (this._controlled) return this._emitEdit()
        this._enableEdit()
    }

    _emitEdit () {
        this.emit('edit')
        this.dispatch('edit')
    }

    /**
     * Open the editor without emitting anything. Used when the app sets
     * the `editing` attribute, because it already knows.
     */
    _openEditor () {
        const input = this.querySelector('input')
        if (!input) return
        this._originalValue = input.value
        input.removeAttribute('disabled')
        input.removeAttribute('aria-disabled')
        this.removeAttribute('aria-disabled')
        this.classList.add('editing')
        input.focus()
        input.select()
    }

    _enableEdit () {
        if (!this.querySelector('input')) return
        this._openEditor()
        this._emitEdit()
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
        if (this._isPending) return
        if (!this._controlled) this._disableEdit()
        this.querySelector('input')?.dispatchEvent(
            new CustomEvent('save', { bubbles: true })
        )
        this.emit('save', { bubbles: true })
    }

    _cancel () {
        if (this._isPending) return
        const input = this.querySelector('input')
        if (input) input.value = this._originalValue
        if (!this._controlled) this._disableEdit()
        this.dispatch('cancel')
        this.emit('cancel')
    }

    /**
     * Hold the editor open but inert while the app saves. Leaves the
     * `editing` class alone, so the two attributes can be cleared in
     * either order and land in the same state.
     */
    _setPending (on:boolean) {
        const input = this.querySelector('input')
        if (!input) return
        this.classList.toggle('pending', on)

        const buttons = this.querySelectorAll(
            'save-button button, x-button button'
        )

        if (on) {
            input.setAttribute('disabled', '')
            input.setAttribute('aria-disabled', 'true')
            buttons.forEach(btn => btn.setAttribute('disabled', ''))
            return
        }

        buttons.forEach(btn => btn.removeAttribute('disabled'))
        if (!this.classList.contains('editing')) return
        input.removeAttribute('disabled')
        input.removeAttribute('aria-disabled')
    }

    _hideTrigger (hide:boolean) {
        const trigger = this.querySelector('pencil-button')
        if (!trigger) return
        if (hide) {
            trigger.setAttribute('hidden', '')
        } else {
            trigger.removeAttribute('hidden')
        }
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

    handleChange_editing (_old:string, newValue:string) {
        debug('editing changed', newValue)
        if (!isOn(newValue)) return this._disableEdit()
        if (this.classList.contains('editing')) return
        this._openEditor()
    }

    handleChange_pending (_old:string, newValue:string) {
        debug('pending changed', newValue)
        this._setPending(isOn(newValue))
    }

    'handleChange_no-trigger' (_old:string, newValue:string) {
        debug('no-trigger changed', newValue)
        this._hideTrigger(isOn(newValue))
    }
}

export { PencilButton } from './edit-btn.js'
export { SaveButton } from './save-btn.js'
export { XButton } from './x-btn.js'

define('editable-field', EditableField)
