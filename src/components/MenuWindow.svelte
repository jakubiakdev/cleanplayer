<style>
    .container {
        position: absolute;
        width: 80vw;
        height: 70vh;
        z-index: 10;
        border-radius: 2ch;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        backdrop-filter: blur(60px);
        background-color: #70707091;
    }
</style>

<div class="container">
    <slot></slot>
</div>