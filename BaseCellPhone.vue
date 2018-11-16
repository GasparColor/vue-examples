<template functional>
    <span>
        {{ props.data | formatPhone }}
    </span>
</template>

<script>

export default {
    name: 'BaseCellPhone',

    functional: true,

    props: {
        data: {
            type: String,
            required: false,
            default: '',
        },
    },
}

</script>
