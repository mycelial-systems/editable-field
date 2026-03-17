import { WebComponent } from '@substrate-system/web-component'
import { define } from '@substrate-system/web-component/util'

declare global {
    interface HTMLElementTagNameMap {
        'x-button':XButton
    }
}

const SVG = `<svg xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24"
    fill="currentColor">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292
        5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1
        1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
</svg>`

export class XButton extends WebComponent {
    static TAG = 'x-button'

    render () {
        if (this.querySelector('button')) return
        this.innerHTML = `<button type="button">
            ${SVG}
            <span class="visually-hidden">Cancel</span>
        </button>`
    }
}

define('x-button', XButton)
