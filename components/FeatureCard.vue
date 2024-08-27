<script setup>
const props = defineProps({
  Feature: {
    type: Object,
    required: true
  },
  FontSize:{
    type:String,
    default:'5em'
  },
  FontLine:{
    type:Number,
    default:10
  }
})

</script>

<template>
    <div class="feature-card" :id="Feature.id">
        <img v-if="Feature.hasImage" :src="`/_nuxt/assets/images/${Feature.id}.svg`" alt="" srcset="">
        <span class="dummys" :style="`--dummy-size:${FontSize}`">

            <span v-for="number in Array(FontLine).keys()" :key="number" :class="`row -r${number}`">
                <span class="dummy -d1 blue" :data-outline="Feature.name">{{ Feature.name }}</span>
                <span class="dummy -d2 white" :data-outline="Feature.name">{{ Feature.name }}</span>
                <span class="dummy -d3 blue" :data-outline="Feature.name">{{ Feature.name }}</span>
                <span class="dummy -d4 white" :data-outline="Feature.name">{{ Feature.name }}</span>
            </span>
            
        </span>
    </div>
</template>

<style>
.feature-card {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.feature-card:hover {
    cursor: pointer;
}

.feature-card img {
	position: absolute;
	max-width: 300px;
	height: 60%;
	max-height: 200px;
	opacity: 1;
	z-index: 10;
    filter:grayscale(100%);
    transition: filter ease-in-out 0.1s;
}

.feature-card:hover img{
    filter:grayscale(0%);
}

.feature-card p {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 2rem;
	z-index: 1;
}

.feature-card .dummys {
	position: relative;
	width: 100%;
	height: 100%;
	/* --dummy-size:4rem; */
	transform:  translateX(3.5rem) rotateZ(-15deg);
}	

.feature-card .dummys .row {
	position: absolute;	
}
.feature-card .row.-r0 {
	transform: translateY(calc(var(--dummy-size) * -1)) translateX(calc(var(--dummy-size) * 2));
}
.feature-card .row.-r1 {
	transform: none;
}
.feature-card .row.-r2 {
	transform: translateY(calc(var(--dummy-size) * 1)) translateX(calc(var(--dummy-size) * 2));
}
.feature-card .row.-r3 {
	transform: translateY(calc(var(--dummy-size) * 2));
}
.feature-card .row.-r4 {
	transform: translateY(calc(var(--dummy-size) * 3)) translateX(calc(var(--dummy-size) * 2));
}
.feature-card .row.-r5 {
	transform: translateY(calc(var(--dummy-size) * 4));
}
.feature-card .row.-r6 {
	transform: translateY(calc(var(--dummy-size) * 5)) translateX(calc(var(--dummy-size) * 2));
}
.feature-card .row.-r7 {
	transform: translateY(calc(var(--dummy-size) * 6));
}
.feature-card .row.-r8 {
	transform: translateY(calc(var(--dummy-size) * 7)) translateX(calc(var(--dummy-size) * 2));
}
.feature-card .row.-r9 {
	transform: translateY(calc(var(--dummy-size) * 8));
}

.feature-card .dummy {
	font-size: var(--dummy-size);
	opacity: 0.5;
	user-select: none;
	pointer-events: none;
	position: absolute;
	white-space: nowrap;	
}

.feature-card .-d1 {
	transform: translateX(-150%);
}

.feature-card .-d2 {
	transform: translateX(-50%);
}

.feature-card .-d3 {
	transform: translateX(50%);
}

.feature-card .-d4 {
	transform: translateX(150%);
}

.feature-card .-d5 {
	transform: translateX(250%);
}

.feature-card [data-outline].blue {
	color: transparent;
	-webkit-text-stroke: 2px #0ba1ff;
}
.feature-card [data-outline].white {
	color: transparent;
	-webkit-text-stroke: 2px #e6f4fd;
}

.feature-card [data-outline]::before {
	content: attr(data-outline);
	position: absolute;
	-webkit-text-stroke: 0;
}

</style>