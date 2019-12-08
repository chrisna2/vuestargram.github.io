<template>
    <div class="body">
        <Post />
        <Post />
        <Post />
    </div>
</template>

<script>
import Post from './Post.vue';

export default {
    name: 'Body',
    components: {
        Post
    }
}
</script>

<style>

</style>