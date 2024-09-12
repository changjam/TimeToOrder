<script setup>
const props = defineProps(['modelValue', 'name', 'id'])
const emit = defineEmits(['update:modelValue'])

</script>

<template>
    <section id="inputField">
        <input type="text" :name="name" :id="id" required 
        :value="modelValue"
        @input="emit('update:modelValue',$event.target.value)">
        <label class="label-line" :for="id">{{ name }}</label>
    </section>
</template>

<style>
#inputField {
    position: relative;
    min-height: var(--field-height);
    line-height: var(--field-height);
    width: 100%;

    --field-height: 2.5rem;
    --focus-color: var(--gold);
    --input-size:1rem;
    --input-bg:#fefefe;
}

#inputField>input {
    position: absolute;
    width: 100%;
    padding:  0 calc((var(--field-height) - var(--input-size))/2);
    line-height: var(--field-height);
    font-size: var(--input-size);

    outline: none;
    background: transparent;

    border: 2px solid var(--black);
    border-radius: 8px;

    transition: 0.2s ease;
    z-index: 1;
}

#inputField>input:focus,
#inputField>input:valid {
    color: var(--focus-color);
    border-color: var(--focus-color);
}

#inputField>.label-line {
    padding: 0 0.5rem;
    /* margin: 0 0.5rem; */
    position: absolute;
    color: var(--black);
    

    font-size: var(--input-size);
    background: var(--input-bg);
    padding-inline: 1rem;
    transition: all 0.2s ease;
}

#inputField>input:focus+.label-line,
#inputField>input:valid+.label-line {
    color: var(--focus-color);
    height: calc(var(--field-height)*0.35);
    line-height: calc(var(--field-height)*0.35);
    transform: translate(calc(var(--field-height)*0.2) , calc(var(--field-height)*-0.2) ) scale(0.9);
    z-index: 2;    
}
</style>