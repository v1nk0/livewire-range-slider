import noUiSlider from 'nouislider';

const CHANGE_EVENT = 'change';
const EMPTY_MODIFER = 'empty';
const LAZY_MODIFIER = 'lazy';
const DEFER_MODIFIER = 'defer';
const LIVE_MODIFIER = 'live';

window.LivewireRangeSlider = function (data) {
    return {
        rangeSlider: null,
        models: [],
        modifier: LIVE_MODIFIER,
        handleHistory: null,
        init() {
            this.setup();
        },
        setup() {
            if(Object.hasOwn(this.$refs.range, 'noUiSlider'))
                return;

            noUiSlider.create(this.$refs.range, {
                ...data.options,
                tooltips: {
                    to: function(numericValue) {
                        return parseInt(numericValue);
                    }
                }
            })

            this.rangeSlider = this.$refs.range.noUiSlider;

            this.rangeSlider.on('update',
                (values, handle) => this.handleUpdate(values, handle)
            );

            this.rangeSlider.on('change',
                (values, handle) => this.handleChange(values, handle)
            );
        },
        handleUpdate(values, handle) {

        },
        handleChange(values, handle) {
            if (this.models[handle]  && this.modifier !== LAZY_MODIFIER) {
                window.Livewire.find(this.$wire.id).set(this.models[handle], values[handle]);
                // this.$wire.set(this.models[handle], values[handle], this.isDeferred());
            }

            // Save handle index
            this.handleHistory = handle;
        },
        isLazy() {
            return this.modifier === LAZY_MODIFIER;
        },
        isDeferred() {
            return this.modifier === DEFER_MODIFIER;
        },
        getValue() {
            var model = this.models[this.handleHistory] ?? false;
            var value = this.rangeSlider.get()[this.handleHistory];

            if (this.isLazy() && model) {
                this.$wire.set(model, value);
            }
        },
        ...data
    }
}
