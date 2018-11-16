<template>
    <ul class="dropdown-list">
        <li
            v-for="(element, idx) in $props.elements"
            :key="idx"
            class="dropdown-list__elementWrapper"
        >
            <base-action-button
                v-if="element.type === 'action'"
                :type="element.actionType"
                :title="element.title"
                :payload="{
                    elementView: element,
                    item: $props.item,
                }"
                :actions-map="$props.actionsMap"
                class="dropdown-list__element"
            />

            <a
                v-if="element.type === 'link'"
                :href="element.path"
                :target="element.openLinkInCurrentContext ? '_self' : '_blank'"
                class="dropdown-list__element --link"
                v-text="element.title"
            />
        </li>
    </ul>
</template>


<script>
import BaseActionButton from './BaseActionButton'

export default {
    name: 'BaseDropdownList',

    components: {
        BaseActionButton,
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
}
</script>

<style scoped lang="stylus">
@import "../styles/variables/colors.styl"
@import "../styles/mixins/dropdown.styl"
@import "../styles/mixins/utils.styl"

.dropdown-list
    dropdownListContainer()
    dropdownList()
    min-width 164px

.dropdown-list__elementWrapper
    dropdownListItem()
    padding 0
    display flex

    .dropdown-list__element
        &.--link
            display flex
            align-items center
            flex-grow 1
            padding 0 12px
            color $globalColorNileBlue
            text-decoration none

    // Переопределяем стили baseButton как это требуется по макету
    /deep/ .button
        font-weight normal !important
        color $globalColorNileBlue !important
        background-color transparent !important
        flex-grow 1

        &:hover:not(:disabled),
        &:active,
        &:focus
            background-color $globalColorCatskillWhite

</style>
