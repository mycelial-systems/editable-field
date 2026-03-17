import { WebComponent } from '@substrate-system/web-component'
import { define } from '@substrate-system/web-component/util'

declare global {
    interface HTMLElementTagNameMap {
        'save-button':SaveButton
    }
}

const SVG = `<svg xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
    <path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M14 4l0 4l-6 0l0 -4" />
</svg>`

export class SaveButton extends WebComponent {
    static TAG = 'save-button'

    render () {
        if (this.querySelector('button')) return
        this.innerHTML = `<button type="button">
            ${SVG}
            <span class="visually-hidden">Save</span>
        </button>`
    }
}

define('save-button', SaveButton)
