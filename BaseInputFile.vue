<template>
    <label
        :class="{
            '--disabled': $props.disabled
        }"
        class="baseInputFile"
    >
        <span
            class="baseInputFile__inputTitle"
            v-text="$props.text"
        />
        <input
            class="baseInputFile__inputHidden"
            type="file"
            @change="($event) => $emit('input', $event.target.files[0])"
        >
    </label>
</template>

<script>
export default {
    name: 'BaseInputFile',

    props: {
        text: {
            type: String,
            required: false,
            default: 'Изменить',
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
}

</script>

<style scoped lang="stylus">
@import "../styles/variables/colors.styl"
@import '../styles/mixins/links.styl'

.baseInputFile
    &.--disabled
        pointer-events none
        .baseInputFile__inputTitle
            color $globalColorLoblolly
            cursor default

.baseInputFile__inputTitle
    commonLinksStyles()
    font-weight 500
    display inline-block
    padding 5px 0 0


.baseInputFile__inputHidden
    display none
</style>
