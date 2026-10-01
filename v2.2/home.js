document.addEventListener("DOMContentLoaded", () => {

    const animatedElements = document.querySelectorAll(
        ".analysis-block, .process-item, .identity-content, .development-layout"
    );

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );


    animatedElements.forEach((element) => {
        observer.observe(element);
    });

});