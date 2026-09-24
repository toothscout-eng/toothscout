const menu=document.querySelector('.menu'),links=document.querySelector('.links');if(menu&&links)menu.addEventListener('click',()=>links.classList.toggle('open'));
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
document.addEventListener("DOMContentLoaded", function () {

    const phone = document.querySelector(".phone");

    if (!phone) return;

    phone.classList.add("phone-active");

});
 


document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("particleCanvas");

    if (!canvas) return;

    const context = canvas.getContext("2d");
    const section = canvas.closest(".particle-section");

    if (!section || !context) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const state = {
        width: 0,
        height: 0,
        pixelRatio: 1,
        particles: [],
        pulses: [],
        mouse: {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            active: false
        },
        time: 0,
        lastTime: 0,
        scanPosition: -0.2,
        visible: true
    };

    const palette = {
        white: "245, 253, 255",
        ice: "173, 247, 255",
        cyan: "76, 232, 246",
        deepCyan: "24, 157, 185",
        dark: "4, 28, 42"
    };

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function getParticleCount() {
        const area = state.width * state.height;

        if (state.width < 600) {
            return clamp(Math.floor(area / 10500), 38, 60);
        }

        if (state.width < 1100) {
            return clamp(Math.floor(area / 9000), 58, 90);
        }

        return clamp(Math.floor(area / 8000), 85, 145);
    }

    function resizeCanvas() {
        const bounds = section.getBoundingClientRect();

        state.width = Math.max(1, bounds.width);
        state.height = Math.max(1, bounds.height);

        /*
         * Capping pixel ratio at 2 keeps the canvas sharp
         * without making very high-density screens unnecessarily heavy.
         */
        state.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.round(state.width * state.pixelRatio);
        canvas.height = Math.round(state.height * state.pixelRatio);

        canvas.style.width = state.width + "px";
        canvas.style.height = state.height + "px";

        context.setTransform(
            state.pixelRatio,
            0,
            0,
            state.pixelRatio,
            0,
            0
        );

        createParticles();
    }

    function createParticles() {
        const count = getParticleCount();

        state.particles = [];

        for (let index = 0; index < count; index++) {
            const depth = random(0.35, 1);
            const roll = Math.random();

            let type = "orb";

            /*
             * Occasional subtle ToothScout-specific nodes.
             * These remain restrained so the background stays classy.
             */
            if (roll > 0.965) {
                type = "tooth";
            } else if (roll > 0.93) {
                type = "practice";
            }

            state.particles.push({
                x: random(0, state.width),
                y: random(0, state.height),
                baseX: 0,
                baseY: 0,
                vx: random(-0.07, 0.07) * depth,
                vy: random(-0.055, 0.055) * depth,
                radius: random(0.75, 2.5) * depth,
                depth: depth,
                opacity: random(0.2, 0.82),
                shimmer: random(0, Math.PI * 2),
                shimmerSpeed: random(0.004, 0.012),
                type: type,
                special: type !== "orb",
                pulsePhase: random(0, Math.PI * 2),
                activation: 0
            });
        }
    }

    function drawBackgroundGlow() {
        const centreX =
            state.width * 0.5 +
            state.mouse.x * 22;

        const centreY =
            state.height * 0.5 +
            state.mouse.y * 14;

        const radius = Math.max(state.width, state.height) * 0.48;

        const glow = context.createRadialGradient(
            centreX,
            centreY,
            0,
            centreX,
            centreY,
            radius
        );

        glow.addColorStop(0, "rgba(55, 220, 238, 0.055)");
        glow.addColorStop(0.35, "rgba(20, 136, 166, 0.026)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");

        context.fillStyle = glow;
        context.fillRect(0, 0, state.width, state.height);
    }

    function updateParticles(delta) {
        state.mouse.x +=
            (state.mouse.targetX - state.mouse.x) * 0.025;

        state.mouse.y +=
            (state.mouse.targetY - state.mouse.y) * 0.025;

        state.particles.forEach(function (particle) {
            particle.x += particle.vx * delta;
            particle.y += particle.vy * delta;
            particle.shimmer += particle.shimmerSpeed * delta;
            particle.pulsePhase += 0.008 * delta;

            if (particle.x < -30) {
                particle.x = state.width + 30;
            }

            if (particle.x > state.width + 30) {
                particle.x = -30;
            }

            if (particle.y < -30) {
                particle.y = state.height + 30;
            }

            if (particle.y > state.height + 30) {
                particle.y = -30;
            }

            const scanX = state.scanPosition * state.width;
            const distanceFromScan = Math.abs(particle.x - scanX);
            const scanInfluence = Math.max(
                0,
                1 - distanceFromScan / 135
            );

            particle.activation +=
                (scanInfluence - particle.activation) * 0.04;
        });
    }

    function getDisplayPosition(particle) {
        const depthOffsetX =
            state.mouse.x * 22 * particle.depth;

        const depthOffsetY =
            state.mouse.y * 14 * particle.depth;

        const floatX =
            Math.sin(
                state.time * 0.00022 +
                particle.shimmer
            ) *
            4 *
            particle.depth;

        const floatY =
            Math.cos(
                state.time * 0.00018 +
                particle.shimmer
            ) *
            3 *
            particle.depth;

        return {
            x: particle.x + depthOffsetX + floatX,
            y: particle.y + depthOffsetY + floatY
        };
    }

    function drawConnections() {
        const maximumDistance =
            state.width < 700 ? 105 : 145;

        context.save();
        context.lineCap = "round";

        for (
            let firstIndex = 0;
            firstIndex < state.particles.length;
            firstIndex++
        ) {
            const first = state.particles[firstIndex];
            const firstPosition = getDisplayPosition(first);

            for (
                let secondIndex = firstIndex + 1;
                secondIndex < state.particles.length;
                secondIndex++
            ) {
                const second = state.particles[secondIndex];
                const secondPosition = getDisplayPosition(second);

                const dx = firstPosition.x - secondPosition.x;
                const dy = firstPosition.y - secondPosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > maximumDistance) continue;

                const closeness =
                    1 - distance / maximumDistance;

                const depth =
                    (first.depth + second.depth) / 2;

                const activated =
                    Math.max(
                        first.activation,
                        second.activation
                    );

                const opacity =
                    closeness *
                    depth *
                    (0.075 + activated * 0.19);

                const gradient = context.createLinearGradient(
                    firstPosition.x,
                    firstPosition.y,
                    secondPosition.x,
                    secondPosition.y
                );

                gradient.addColorStop(
                    0,
                    `rgba(${palette.deepCyan}, ${opacity * 0.55})`
                );

                gradient.addColorStop(
                    0.48,
                    `rgba(${palette.cyan}, ${opacity})`
                );

                gradient.addColorStop(
                    1,
                    `rgba(${palette.ice}, ${opacity * 0.45})`
                );

                context.beginPath();
                context.moveTo(
                    firstPosition.x,
                    firstPosition.y
                );

                context.lineTo(
                    secondPosition.x,
                    secondPosition.y
                );

                context.strokeStyle = gradient;
                context.lineWidth =
                    0.45 + depth * 0.35 + activated * 0.65;

                context.stroke();

                /*
                 * A travelling highlight creates visible,
                 * premium movement without making every line flash.
                 */
                const shouldShowSignal =
                    closeness > 0.42 &&
                    ((firstIndex + secondIndex) % 9 === 0);

                if (shouldShowSignal) {
                    drawTravellingSignal(
                        firstPosition,
                        secondPosition,
                        firstIndex + secondIndex,
                        closeness
                    );
                }
            }
        }

        context.restore();
    }

    function drawTravellingSignal(
        start,
        end,
        seed,
        strength
    ) {
        const progress =
            (
                state.time * 0.00012 +
                seed * 0.137
            ) % 1;

        const x =
            start.x + (end.x - start.x) * progress;

        const y =
            start.y + (end.y - start.y) * progress;

        const glow = context.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            11
        );

        glow.addColorStop(
            0,
            `rgba(${palette.white}, ${0.8 * strength})`
        );

        glow.addColorStop(
            0.22,
            `rgba(${palette.ice}, ${0.55 * strength})`
        );

        glow.addColorStop(
            1,
            `rgba(${palette.cyan}, 0)`
        );

        context.beginPath();
        context.arc(x, y, 11, 0, Math.PI * 2);
        context.fillStyle = glow;
        context.fill();
    }

    function drawParticle(particle) {
        const position = getDisplayPosition(particle);

        const shimmer =
            0.72 +
            Math.sin(particle.shimmer) * 0.28;

        const pulse =
            0.86 +
            Math.sin(particle.pulsePhase) * 0.14;

        const activation = particle.activation;

        if (particle.type === "tooth") {
            drawToothNode(
                position.x,
                position.y,
                particle,
                shimmer,
                activation
            );

            return;
        }

        if (particle.type === "practice") {
            drawPracticeNode(
                position.x,
                position.y,
                particle,
                shimmer,
                activation
            );

            return;
        }

        drawGlossyOrb(
            position.x,
            position.y,
            particle,
            shimmer,
            pulse,
            activation
        );
    }

    function drawGlossyOrb(
        x,
        y,
        particle,
        shimmer,
        pulse,
        activation
    ) {
        const radius =
            particle.radius *
            pulse *
            (1 + activation * 0.9);

        const glowRadius =
            radius * (5.5 + activation * 4);

        const glow = context.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            glowRadius
        );

        glow.addColorStop(
            0,
            `rgba(${palette.white}, ${
                particle.opacity * shimmer
            })`
        );

        glow.addColorStop(
            0.13,
            `rgba(${palette.ice}, ${
                particle.opacity * 0.92
            })`
       
