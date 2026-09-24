const menu=document.querySelector('.menu'),links=document.querySelector('.links');if(menu&&links)menu.addEventListener('click',()=>links.classList.toggle('open'));
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
document.addEventListener("DOMContentLoaded", function () {

    const phone = document.querySelector(".phone");

    if (!phone) return;

    phone.classList.add("phone-active");

});
 
<script>
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("particleCanvas");

    if (!canvas) return;

    const section = canvas.closest(".particle-section");
    const ctx = canvas.getContext("2d");

    if (!section || !ctx) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let particles = [];
    let animationFrame = null;
    let sectionVisible = true;
    let previousTime = 0;

    const mouse = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0
    };

    function resizeCanvas() {
        const bounds = section.getBoundingClientRect();

        width = Math.max(1, bounds.width);
        height = Math.max(1, bounds.height);
        pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        createParticles();
    }

    function createParticles() {
        const particleCount = width < 768 ? 32 : 55;

        particles = Array.from(
            { length: particleCount },
            function (_, index) {
                return {
                    x: Math.random() * width,
                    y: Math.random() * height,

                    radius:
                        index % 13 === 0
                            ? 2.8 + Math.random() * 1.5
                            : 0.9 + Math.random() * 1.7,

                    speedX: (Math.random() - 0.5) * 9,
                    speedY: (Math.random() - 0.5) * 7,

                    depth: 0.4 + Math.random() * 0.6,
                    phase: Math.random() * Math.PI * 2,
                    opacity: 0.32 + Math.random() * 0.5,

                    featured: index % 13 === 0
                };
            }
        );
    }

    function getPosition(particle, time) {
        return {
            x:
                particle.x +
                mouse.x * 12 * particle.depth +
                Math.sin(time * 0.00025 + particle.phase) *
                    3 *
                    particle.depth,

            y:
                particle.y +
                mouse.y * 8 * particle.depth +
                Math.cos(time * 0.0002 + particle.phase) *
                    3 *
                    particle.depth
        };
    }

    function updateParticles(deltaSeconds) {
        mouse.x += (mouse.targetX - mouse.x) * 0.025;
        mouse.y += (mouse.targetY - mouse.y) * 0.025;

        particles.forEach(function (particle) {
            particle.x += particle.speedX * deltaSeconds;
            particle.y += particle.speedY * deltaSeconds;

            if (particle.x < -25) particle.x = width + 25;
            if (particle.x > width + 25) particle.x = -25;

            if (particle.y < -25) particle.y = height + 25;
            if (particle.y > height + 25) particle.y = -25;
        });
    }

    function drawConnections(time) {
        const connectionDistance = width < 768 ? 115 : 145;

        ctx.save();
        ctx.lineCap = "round";

        for (let first = 0; first < particles.length; first++) {
            const particleA = particles[first];
            const positionA = getPosition(particleA, time);

            /*
             * Check only the next few particles.
             * This avoids expensive every-particle-to-every-particle checks.
             */
            const finalIndex = Math.min(first + 7, particles.length);

            for (
                let second = first + 1;
                second < finalIndex;
                second++
            ) {
                const particleB = particles[second];
                const positionB = getPosition(particleB, time);

                const dx = positionB.x - positionA.x;
                const dy = positionB.y - positionA.y;
                const distanceSquared = dx * dx + dy * dy;

                if (
                    distanceSquared >
                    connectionDistance * connectionDistance
                ) {
                    continue;
                }

                const distance = Math.sqrt(distanceSquared);
                const strength = 1 - distance / connectionDistance;

                const gradient = ctx.createLinearGradient(
                    positionA.x,
                    positionA.y,
                    positionB.x,
                    positionB.y
                );

                gradient.addColorStop(
                    0,
                    "rgba(70, 240, 255, 0)"
                );

                gradient.addColorStop(
                    0.5,
                    `rgba(101, 227, 216, ${
                        strength * 0.22
                    })`
                );

                gradient.addColorStop(
                    1,
                    "rgba(255, 255, 255, 0)"
                );

                ctx.beginPath();
                ctx.moveTo(positionA.x, positionA.y);
                ctx.lineTo(positionB.x, positionB.y);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 0.65;
                ctx.stroke();

                /*
                 * A small signal travels along selected connections,
                 * suggesting ToothScout making a match.
                 */
                if ((first + second) % 11 === 0) {
                    const progress =
                        (time * 0.00008 + first * 0.11) % 1;

                    const signalX =
                        positionA.x + dx * progress;

                    const signalY =
                        positionA.y + dy * progress;

                    drawSignal(
                        signalX,
                        signalY,
                        strength
                    );
                }
            }
        }

        ctx.restore();
    }

    function drawSignal(x, y, strength) {
        const glow = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            10
        );

        glow.addColorStop(
            0,
            `rgba(255, 255, 255, ${strength * 0.95})`
        );

        glow.addColorStop(
            0.25,
            `rgba(101, 227, 216, ${strength * 0.55})`
        );

        glow.addColorStop(
            1,
            "rgba(70, 240, 255, 0)"
        );

        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
    }

    function drawParticle(particle, time) {
        const position = getPosition(particle, time);

        const pulse =
            0.86 +
            Math.sin(time * 0.0012 + particle.phase) *
                0.14;

        const radius = particle.radius * pulse;
        const glowSize = particle.featured ? radius * 7 : radius * 5;

        const glow = ctx.createRadialGradient(
            position.x,
            position.y,
            0,
            position.x,
            position.y,
            glowSize
        );

        glow.addColorStop(
            0,
            `rgba(255, 255, 255, ${particle.opacity})`
        );

        glow.addColorStop(
            0.18,
            `rgba(142, 247, 255, ${
                particle.opacity * 0.8
            })`
        );

        glow.addColorStop(
            0.46,
            `rgba(70, 240, 255, ${
                particle.opacity * 0.28
            })`
        );

        glow.addColorStop(
            1,
            "rgba(70, 240, 255, 0)"
        );

        ctx.beginPath();
        ctx.arc(
            position.x,
            position.y,
            glowSize,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = glow;
        ctx.fill();

        const core = ctx.createRadialGradient(
            position.x - radius * 0.3,
            position.y - radius * 0.35,
            0,
            position.x,
            position.y,
            radius * 1.2
        );

        core.addColorStop(0, "rgba(255,255,255,1)");
        core.addColorStop(0.3, "rgba(190,250,255,0.95)");
        core.addColorStop(1, "rgba(42,201,220,0.75)");

        ctx.beginPath();
        ctx.arc(
            position.x,
            position.y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = core;
        ctx.fill();

        if (particle.featured) {
            ctx.beginPath();
            ctx.arc(
                position.x,
                position.y,
                radius * 2.4,
                0,
                Math.PI * 2
            );

            ctx.strokeStyle =
                "rgba(101, 227, 216, 0.16)";

            ctx.lineWidth = 0.7;
            ctx.stroke();
        }
    }

    function drawScoutSweep(time) {
        const progress = (time * 0.000025) % 1.35;
        const x = (progress - 0.15) * width;

        const sweep = ctx.createLinearGradient(
            x - 130,
            0,
            x + 130,
            0
        );

        sweep.addColorStop(0, "rgba(70,240,255,0)");
        sweep.addColorStop(0.45, "rgba(70,240,255,0.01)");
        sweep.addColorStop(0.5, "rgba(180,250,255,0.065)");
        sweep.addColorStop(0.55, "rgba(70,240,255,0.01)");
        sweep.addColorStop(1, "rgba(70,240,255,0)");

        ctx.fillStyle = sweep;
        ctx.fillRect(x - 130, 0, 260, height);
    }

    function render(time) {
        animationFrame = requestAnimationFrame(render);

        if (!sectionVisible) return;

        const elapsed = previousTime
            ? Math.min(time - previousTime, 40)
            : 16;

        previousTime = time;

        if (!reduceMotion) {
            updateParticles(elapsed / 1000);
        }

        ctx.clearRect(0, 0, width, height);

        drawConnections(time);

        particles.forEach(function (particle) {
            drawParticle(particle, time);
        });

        if (!reduceMotion) {
            drawScoutSweep(time);
        }
    }

    section.addEventListener("pointermove", function (event) {
        const bounds = section.getBoundingClientRect();

        mouse.targetX =
            ((event.clientX - bounds.left) / bounds.width - 0.5) *
            2;

        mouse.targetY =
            ((event.clientY - bounds.top) / bounds.height - 0.5) *
            2;
    });

    section.addEventListener("pointerleave", function () {
        mouse.targetX = 0;
        mouse.targetY = 0;
    });

    const visibilityObserver = new IntersectionObserver(
        function (entries) {
            sectionVisible = entries[0].isIntersecting;

            if (sectionVisible) {
                previousTime = 0;
            }
        },
        {
            threshold: 0.01
        }
    );

    visibilityObserver.observe(section);

    let resizeTimer;

    window.addEventListener("resize", function () {
        window.clearTimeout(resizeTimer);

        resizeTimer = window.setTimeout(
            resizeCanvas,
            150
        );
    });

    resizeCanvas();

    if (reduceMotion) {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(function (particle) {
            drawParticle(particle, 0);
        });
    } else {
        animationFrame = requestAnimationFrame(render);
    }

    window.addEventListener("pagehide", function () {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        visibilityObserver.disconnect();
    });
});
</script>

