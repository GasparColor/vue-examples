<template>
    <div
        class="dropdown"
        @click="($event) => clickOnDropdown($event)"
    >
        <span
            :class="{ '--active': isDropdownListShown }"
            class="dropdown__topBtn"
        >
            <span class="dropdown__topBtnInnerBackground"/>
        </span>
        <base-dropdown-list
            v-on-clickaway="clickAway"
            v-if="isDropdownListShown"
            :actions-map="$props.actionsMap"
            :elements="$props.elements"
            :item="$props.item"
            class="dropdown__list"
        />
    </div>

</template>

<script>
import { directive as onClickaway } from 'vue-clickaway'
import BaseDropdownList from './BaseDropdownList'

export default {
    name: 'BaseDropdown',

    directives: {
        onClickaway,
    },

    components: {
        BaseDropdownList,
    },

    props: {
        // Набор экшнов, из которых происходит выполнение
        actionsMap: {
            type: Object,
            required: false,
            default: null,
        },
        elements: {
            type: Array,
            required: true,
        },
        item: {
            type: Object,
            required: false,
            default: null,
        },
    },

    data: () => ({
        isDropdownListShown: false,
    }),

    methods: {
        clickAway() {
            this.isDropdownListShown = false
        },
        clickOnDropdown(e) {
            // prevent-ом предотвращаем обработку клика элементами-предками,
            // только если событие было вызвано элементом без ссылки
            if (!e.target.href) e.preventDefault()

            this.isDropdownListShown = !this.isDropdownListShown
        },
    },

}
</script>

<style scoped lang="stylus">
@import "../styles/variables/colors.styl"
@import "../styles/variables/dropdown.styl"
@import '../styles/mixins/utils.styl'

dropdownBackgroundCircle()
    margin auto
    width 4px
    height @width
    border-radius 50%
    background-color #000

.dropdown
    position relative
    width $dropdownTriggerWidth
    height $dropdownTriggerHeight

    &:hover
        cursor pointer
        background-color $globalColorCatskillWhiteLess

.dropdown__topBtn
    display flex
    width $dropdownTriggerWidth
    height $dropdownTriggerHeight
    border-radius 4px

    &.--active,
    &:hover:not(:disabled)
        background-color $globalColorFiord
        color $globalColorWhite

        .dropdown__topBtnInnerBackground
            background-color $globalColorWhite

            &::after,
            &::before
                background-color $globalColorWhite

    .dropdown__topBtnInnerBackground
        position relative
        dropdownBackgroundCircle()

        &::after,
        &::before
            position absolute
            content ''
            dropdownBackgroundCircle()

        &::after
            left 6px

        &::before
            right 6px

.dropdown__list
    position absolute
    margin-top $dropdownListVerticalOffset
    right 0
    z-index 1

</style>
