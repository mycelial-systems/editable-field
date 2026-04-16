import { WebComponent } from '@substrate-system/web-component'
import { define } from '@substrate-system/web-component/util'

declare global {
    interface HTMLElementTagNameMap {
        'pencil-button':PencilButton
    }
}

export const SVG = `<svg xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
    <path d="M13.5 6.5l4 4" />
</svg>`

export class PencilIcon extends WebComponent {
    static TAG = 'pencil-icon'

    connectedCallback () {
        this.render()
    }

    render () {
        this.innerHTML = SVG
    }
}

export class PencilButton extends WebComponent {
    static TAG = 'pencil-button'

    render () {
        if (this.querySelector('button')) return
        this.innerHTML = `<button type="button">
            ${SVG}
            <span class="visually-hidden">Edit</span>
        </button>`
    }
}

define('pencil-button', PencilButton)
